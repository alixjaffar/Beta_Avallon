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
      logInfo('Vercel not configured, returning mocked project', input);
      return { projectId: 'mock-project-id', projectName: input.name };
    }

    try {
      const response = await axios.post(
        `${VERCEL_API_BASE}/v9/projects${this.getTeamParam()}`,
        {
          name: input.name,
          framework: input.framework || 'nextjs',
          rootDirectory: input.rootDirectory || '',
        },
        { headers: this.getHeaders() }
      );

      const project = response.data;
      logInfo('Vercel project created', { projectId: project.id, name: project.name });
      
      return {
        projectId: project.id,
        projectName: project.name,
      };
    } catch (error: any) {
      logError('Vercel createProject error', error, input);
      throw new Error(`Failed to create Vercel project: ${error.message}`);
    }
  }

  async createDeployment(input: CreateDeploymentInput): Promise<CreateDeploymentResult> {
    if (!isConfigured) {
      logInfo('Vercel not configured, returning mocked deployment', input);
      return {
        deploymentId: 'mock-deployment-id',
        url: `https://mock-${input.projectId}.vercel.app`,
        readyState: 'READY',
      };
    }

    try {
      const deploymentData: any = {
        name: input.projectId,
        projectSettings: {
          framework: 'nextjs',
        },
      };

      // Deploy from Git or files
      if (input.gitUrl) {
        deploymentData.gitSource = {
          type: 'github',
          repoId: this.extractRepoId(input.gitUrl),
          ref: 'main',
        };
      } else if (input.files) {
        deploymentData.files = Object.entries(input.files).map(([path, content]) => ({
          file: path,
          data: Buffer.from(content).toString('base64'),
          encoding: 'base64',
        }));
      } else {
        // Create minimal Next.js app
        deploymentData.files = this.getMinimalNextjsFiles();
      }

      if (input.env) {
        deploymentData.env = input.env;
      }

      const response = await axios.post(
        `${VERCEL_API_BASE}/v13/deployments${this.getTeamParam()}`,
        deploymentData,
        { headers: this.getHeaders() }
      );

      const deployment = response.data;
      logInfo('Vercel deployment created', { deploymentId: deployment.id, url: deployment.url });

      return {
        deploymentId: deployment.id,
        url: `https://${deployment.url}`,
        readyState: deployment.readyState || 'QUEUED',
      };
    } catch (error: any) {
      logError('Vercel createDeployment error', error, input);
      throw new Error(`Failed to create Vercel deployment: ${error.message}`);
    }
  }

  async getDeploymentStatus(deploymentId: string): Promise<{ status: string; url?: string }> {
    if (!isConfigured) {
      return { status: 'READY', url: `https://mock-${deploymentId}.vercel.app` };
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
      logInfo('Vercel not configured, returning mocked domain add', input);
      return { success: true };
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
      logInfo('Vercel not configured, returning mocked domain remove', { projectId, domain });
      return { success: true };
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

  private getMinimalNextjsFiles(): Array<{ file: string; data: string; encoding: string }> {
    const packageJson = {
      name: 'avallon-site',
      version: '0.1.0',
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
      },
      dependencies: {
        next: '^14.0.0',
        react: '^18.2.0',
        'react-dom': '^18.2.0',
      },
    };

    const indexPage = `
      export default function Home() {
        return (
          <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
            <h1>Welcome to your Avallon site!</h1>
            <p>This site is deployed on Vercel.</p>
          </div>
        );
      }
    `;

    return [
      {
        file: 'package.json',
        data: Buffer.from(JSON.stringify(packageJson, null, 2)).toString('base64'),
        encoding: 'base64',
      },
      {
        file: 'pages/index.js',
        data: Buffer.from(indexPage).toString('base64'),
        encoding: 'base64',
      },
    ];
  }
}

export function isVercelConfigured(): boolean {
  return isConfigured;
}

