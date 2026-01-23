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
      // Build file list for deployment
      const filesToUpload: Array<{ file: string; content: Buffer }> = [];
      
      // Add vercel.json for static deployment with URL rewrites for navigation
      const vercelConfig = {
        version: 2,
        public: true,
        cleanUrls: true,
        trailingSlash: false,
        rewrites: [
          { source: "/team", destination: "/team.html" },
          { source: "/team/", destination: "/team.html" },
          { source: "/contact", destination: "/contact.html" },
          { source: "/contact/", destination: "/contact.html" },
          { source: "/apply", destination: "/apply.html" },
          { source: "/apply/", destination: "/apply.html" },
          { source: "/about", destination: "/about.html" },
          { source: "/about/", destination: "/about.html" },
          { source: "/careers", destination: "/careers.html" },
          { source: "/careers/", destination: "/careers.html" },
          { source: "/services", destination: "/services.html" },
          { source: "/services/", destination: "/services.html" },
          { source: "/home-page-1", destination: "/home-page-1.html" },
          { source: "/home-page-1/", destination: "/home-page-1.html" },
          { source: "/home", destination: "/index.html" },
          { source: "/home/", destination: "/index.html" },
          { source: "/:path", destination: "/:path.html" },
        ],
        headers: [
          {
            source: "/(.*)",
            headers: [
              { key: "X-Frame-Options", value: "SAMEORIGIN" },
              { key: "X-Content-Type-Options", value: "nosniff" }
            ]
          }
        ]
      };
      filesToUpload.push({
        file: 'vercel.json',
        content: Buffer.from(JSON.stringify(vercelConfig, null, 2)),
      });
      
      if (input.files && Object.keys(input.files).length > 0) {
        for (const [filePath, content] of Object.entries(input.files)) {
          const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content as string);
          filesToUpload.push({ file: filePath, content: buffer });
        }
        logInfo('Preparing files for Vercel deployment', { 
          fileCount: filesToUpload.length,
          files: filesToUpload.map(f => f.file)
        });
      } else {
        filesToUpload.push({
          file: 'index.html',
          content: Buffer.from('<html><body><h1>Welcome</h1></body></html>'),
        });
      }

      // Calculate total size to decide deployment strategy
      const totalSize = filesToUpload.reduce((sum, f) => sum + f.content.length, 0);
      const totalBase64Size = Math.ceil(totalSize * 1.37); // Base64 overhead
      
      logInfo('Deployment size analysis', { 
        rawSizeMB: (totalSize / 1024 / 1024).toFixed(2),
        estimatedBase64SizeMB: (totalBase64Size / 1024 / 1024).toFixed(2),
        fileCount: filesToUpload.length
      });

      // If small enough, use inline deployment (faster)
      // Otherwise, upload files first then create deployment with SHA references
      let response;
      
      if (totalBase64Size < 8 * 1024 * 1024) { // Under 8MB base64, use inline
        const deploymentData = {
          name: input.projectId,
          files: filesToUpload.map(f => ({
            file: f.file,
            data: f.content.toString('base64'),
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

        logInfo('Using inline deployment (small payload)', { projectId: input.projectId });
        
        response = await axios.post(
          `${VERCEL_API_BASE}/v13/deployments${this.getTeamParam()}`,
          deploymentData,
          { headers: this.getHeaders() }
        );
      } else {
        // Large deployment: upload files individually first
        logInfo('Using chunked upload (large payload)', { projectId: input.projectId });
        
        const crypto = await import('crypto');
        const fileReferences: Array<{ file: string; sha: string; size: number }> = [];
        
        // Upload files in batches of 3
        for (let i = 0; i < filesToUpload.length; i += 3) {
          const batch = filesToUpload.slice(i, i + 3);
          
          await Promise.all(batch.map(async ({ file, content }) => {
            const sha = crypto.createHash('sha1').update(content).digest('hex');
            
            try {
              // Upload file to Vercel
              await axios.post(
                `${VERCEL_API_BASE}/v2/files${this.getTeamParam()}`,
                content,
                {
                  headers: {
                    ...this.getHeaders(),
                    'Content-Type': 'application/octet-stream',
                    'x-vercel-digest': sha,
                  },
                }
              );
              
              logInfo('File uploaded to Vercel', { file, sha: sha.substring(0, 8), size: content.length });
            } catch (uploadError: any) {
              // File might already exist (409), that's fine
              if (uploadError.response?.status !== 409) {
                logInfo('File upload warning', { file, error: uploadError.message });
              }
            }
            
            fileReferences.push({ file, sha, size: content.length });
          }));
        }
        
        // Create deployment with file references
        const deploymentData = {
          name: input.projectId,
          files: fileReferences,
          target: 'production',
          project: input.projectId,
          projectSettings: {
            framework: null,
            buildCommand: '',
            outputDirectory: '',
          },
        };

        logInfo('Creating deployment with file references', { 
          projectId: input.projectId, 
          fileCount: fileReferences.length 
        });
        
        response = await axios.post(
          `${VERCEL_API_BASE}/v13/deployments${this.getTeamParam()}`,
          deploymentData,
          { headers: this.getHeaders() }
        );
      }

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

