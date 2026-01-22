// CHANGELOG: 2025-10-11 - Add Vercel hosting provider implementation
import axios from 'axios';
import type { 
  HostingProvider, 
  CreateProjectInput, 
  CreateProjectResult,
  CreateDeploymentInput,
  CreateDeploymentResult,
  AddDomainInput,
} from '@/lib/providers/hosting';
import { logError, logInfo } from '@/lib/log';

const VERCEL_TOKEN = process.env.VERCEL_TOKEN || '';
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID || '';
const VERCEL_API_BASE = 'https://api.vercel.com';

const isConfigured = !!VERCEL_TOKEN;

export class VercelProvider implements HostingProvider {
  private getHeaders() {
    return {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
    };
  }

  private getTeamParam() {
    return VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : '';
  }

  async createProject(input: CreateProjectInput): Promise<CreateProjectResult> {
    if (!isConfigured) {
      logError('Vercel not configured - VERCEL_TOKEN is required for deployments', new Error('Missing VERCEL_TOKEN'));
      throw new Error('Vercel is not configured. Please add VERCEL_TOKEN to environment variables to enable publishing.');
    }

    try {
      // First check if project already exists
      let existingProjectId: string | null = null;
      try {
        const existingProject = await axios.get(
          `${VERCEL_API_BASE}/v9/projects/${input.name}${this.getTeamParam()}`,
          { headers: this.getHeaders() }
        );
        existingProjectId = existingProject.data.id;
        logInfo('Vercel project already exists', { projectId: existingProjectId, name: existingProject.data.name });
        
        // Disable deployment protection on existing project
        if (existingProjectId) {
          await this.disableDeploymentProtection(existingProjectId);
        }
        
        return {
          projectId: existingProject.data.id,
          projectName: existingProject.data.name,
        };
      } catch (e: any) {
        // Project doesn't exist, create it
        logInfo('Project does not exist, creating new one', { name: input.name });
      }

      const payload: any = {
        name: input.name,
      };
      
      // Only set framework if specified and not 'static'
      if (input.framework && input.framework !== 'static') {
        payload.framework = input.framework;
      }
      
      if (input.rootDirectory) {
        payload.rootDirectory = input.rootDirectory;
      }

      logInfo('Creating Vercel project with payload', payload);

      const response = await axios.post(
        `${VERCEL_API_BASE}/v9/projects${this.getTeamParam()}`,
        payload,
        { headers: this.getHeaders() }
      );

      const project = response.data;
      logInfo('Vercel project created', { projectId: project.id, name: project.name });
      
      // Disable deployment protection after creation
      await this.disableDeploymentProtection(project.id);
      
      return {
        projectId: project.id,
        projectName: project.name,
      };
    } catch (error: any) {
      const errorDetails = error.response?.data || error.message;
      logError('Vercel createProject error', error, { ...input, errorDetails });
      throw new Error(`Failed to create Vercel project: ${JSON.stringify(errorDetails)}`);
    }
  }

  private async disableDeploymentProtection(projectId: string): Promise<void> {
    try {
      // Update project to disable password protection (main blocker for public access)
      await axios.patch(
        `${VERCEL_API_BASE}/v9/projects/${projectId}${this.getTeamParam()}`,
        {
          passwordProtection: null,
          ssoProtection: null,
        },
        { headers: this.getHeaders() }
      );
      logInfo('Deployment protection disabled for project', { projectId });
    } catch (error: any) {
      // Log but don't fail - protection settings might not be available on all plans
      logInfo('Could not disable deployment protection (may require Pro plan)', { 
        projectId, 
        error: error.response?.data || error.message 
      });
    }
  }

  async createDeployment(input: CreateDeploymentInput): Promise<CreateDeploymentResult> {
    if (!isConfigured) {
      logError('Vercel not configured - VERCEL_TOKEN is required for deployments', new Error('Missing VERCEL_TOKEN'));
      throw new Error('Vercel is not configured. Please add VERCEL_TOKEN to environment variables to enable publishing.');
    }

    try {
      // Build file list for direct static deployment
      const files: Array<{ file: string; data: string }> = [];
      
      // Add vercel.json for static deployment with permissive headers and clean URLs
      // Note: Vercel auto-detects static files
      const vercelConfig = {
        version: 2,
        public: true,
        cleanUrls: true,  // Allows /about to serve about.html
        trailingSlash: false,
        headers: [
          {
            source: "/(.*)",
            headers: [
              {
                key: "X-Frame-Options",
                value: "SAMEORIGIN"
              },
              {
                key: "X-Content-Type-Options",
                value: "nosniff"
              }
            ]
          }
        ]
      };
      files.push({
        file: 'vercel.json',
        data: Buffer.from(JSON.stringify(vercelConfig, null, 2)).toString('base64'),
      });
      
      if (input.files && Object.keys(input.files).length > 0) {
        for (const [filePath, content] of Object.entries(input.files)) {
          // Handle both string and Buffer content (images)
          if (Buffer.isBuffer(content)) {
            files.push({
              file: filePath,
              data: content.toString('base64'),
            });
          } else {
            files.push({
              file: filePath,
              data: Buffer.from(content as string).toString('base64'),
            });
          }
        }
        logInfo('Deploying files to Vercel', { 
          fileCount: files.length,
          files: files.map(f => f.file)
        });
      } else {
        // Create minimal static site as fallback
        files.push({
          file: 'index.html',
          data: Buffer.from('<html><body><h1>Welcome</h1></body></html>').toString('base64'),
        });
      }

      // Use v13 API - Vercel will detect vercel.json and use static builder
      const deploymentData = {
        name: input.projectId,
        files: files.map(f => ({
          file: f.file,
          data: f.data,
          encoding: 'base64' as const,
        })),
        target: 'production',
        project: input.projectId,
        projectSettings: {
          framework: null,
          buildCommand: '',
          outputDirectory: '',
        },
      };

      logInfo('Creating Vercel static deployment', { 
        projectId: input.projectId, 
        fileCount: files.length,
      });

      const response = await axios.post(
        `${VERCEL_API_BASE}/v13/deployments${this.getTeamParam()}`,
        deploymentData,
        { headers: this.getHeaders() }
      );

      const deployment = response.data;
      logInfo('Vercel deployment created', { 
        deploymentId: deployment.id, 
        url: deployment.url,
        readyState: deployment.readyState,
        inspectorUrl: deployment.inspectorUrl
      });

      // Wait for deployment to be ready (up to 60 seconds for static)
      let finalUrl = deployment.url;
      let finalState = deployment.readyState;
      let attempts = 0;
      const maxAttempts = 30; // 60 seconds total
      
      while (attempts < maxAttempts && finalState !== 'READY') {
        await new Promise(resolve => setTimeout(resolve, 2000));
        try {
          const statusResponse = await axios.get(
            `${VERCEL_API_BASE}/v13/deployments/${deployment.id}${this.getTeamParam()}`,
            { headers: this.getHeaders() }
          );
          const status = statusResponse.data;
          finalState = status.readyState;
          finalUrl = status.url || finalUrl;
          
          logInfo('Deployment status check', { 
            deploymentId: deployment.id, 
            readyState: finalState,
            attempt: attempts + 1
          });
          
          if (finalState === 'READY') {
            break;
          } else if (finalState === 'ERROR' || finalState === 'CANCELED') {
            throw new Error(`Deployment failed with state: ${finalState}`);
          }
        } catch (statusError: any) {
          if (statusError.message?.includes('Deployment failed')) {
            throw statusError;
          }
          logInfo('Status check failed, continuing', { error: statusError.message });
        }
        attempts++;
      }

      // Return the URL even if still building - it will be ready soon
      return {
        deploymentId: deployment.id,
        url: `https://${finalUrl}`,
        readyState: finalState || 'BUILDING',
      };
    } catch (error: any) {
      const errorDetails = error.response?.data || error.message;
      logError('Vercel createDeployment error', error, { 
        projectId: input.projectId,
        errorDetails,
        statusCode: error.response?.status 
      });
      throw new Error(`Failed to create Vercel deployment: ${JSON.stringify(errorDetails)}`);
    }
  }

  async getDeploymentStatus(deploymentId: string): Promise<{ status: string; url?: string }> {
    if (!isConfigured) {
      throw new Error('Vercel is not configured. Please add VERCEL_TOKEN to environment variables.');
    }

    try {
      const response = await axios.get(
        `${VERCEL_API_BASE}/v13/deployments/${deploymentId}${this.getTeamParam()}`,
        { headers: this.getHeaders() }
      );

      const deployment = response.data;
      return {
        status: deployment.readyState || 'UNKNOWN',
        url: deployment.url ? `https://${deployment.url}` : undefined,
      };
    } catch (error: any) {
      logError('Vercel getDeploymentStatus error', error, { deploymentId });
      return { status: 'ERROR' };
    }
  }

  async addDomain(input: AddDomainInput): Promise<{ success: boolean; error?: string }> {
    if (!isConfigured) {
      return { success: false, error: 'Vercel is not configured. Please add VERCEL_TOKEN to environment variables.' };
    }

    try {
      await axios.post(
        `${VERCEL_API_BASE}/v9/projects/${input.projectId}/domains${this.getTeamParam()}`,
        { name: input.domain },
        { headers: this.getHeaders() }
      );

      logInfo('Vercel domain added', input);
      return { success: true };
    } catch (error: any) {
      logError('Vercel addDomain error', error, input);
      return { success: false, error: error.message };
    }
  }

  async removeDomain(projectId: string, domain: string): Promise<{ success: boolean; error?: string }> {
    if (!isConfigured) {
      return { success: false, error: 'Vercel is not configured. Please add VERCEL_TOKEN to environment variables.' };
    }

    try {
      await axios.delete(
        `${VERCEL_API_BASE}/v9/projects/${projectId}/domains/${domain}${this.getTeamParam()}`,
        { headers: this.getHeaders() }
      );

      logInfo('Vercel domain removed', { projectId, domain });
      return { success: true };
    } catch (error: any) {
      logError('Vercel removeDomain error', error, { projectId, domain });
      return { success: false, error: error.message };
    }
  }

  private extractRepoId(gitUrl: string): string {
    // Extract owner/repo from GitHub URL
    const match = gitUrl.match(/github\.com[/:](.+?)\/(.+?)(\.git)?$/);
    if (match) {
      return `${match[1]}/${match[2].replace('.git', '')}`;
    }
    return gitUrl;
  }

  private getMinimalStaticFiles(): Array<{ file: string; data: string; encoding: string }> {
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Avallon</title>
  <style>
    body { font-family: system-ui; padding: 2rem; text-align: center; }
    h1 { color: #333; }
    p { color: #666; }
  </style>
</head>
<body>
  <h1>Welcome to your Avallon site!</h1>
  <p>This site is deployed on Vercel.</p>
</body>
</html>`;

    return [
      {
        file: 'index.html',
        data: Buffer.from(indexHtml).toString('base64'),
        encoding: 'base64',
      },
    ];
  }
}

export function isVercelConfigured(): boolean {
  return isConfigured;
}

