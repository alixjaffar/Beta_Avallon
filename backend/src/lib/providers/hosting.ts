// CHANGELOG: 2025-10-11 - Add HostingProvider interface for deployment platforms

export type CreateProjectInput = {
  name: string;
  framework?: string;
  rootDirectory?: string;
};

export type CreateProjectResult = {
  projectId: string;
  projectName: string;
};

export type CreateDeploymentInput = {
  projectId: string;
  gitUrl?: string;
  files?: Record<string, string>; // filepath -> content
  env?: Record<string, string>;
};

export type CreateDeploymentResult = {
  deploymentId: string;
  url: string;
  readyState: 'QUEUED' | 'BUILDING' | 'READY' | 'ERROR';
};

export type AddDomainInput = {
  projectId: string;
  domain: string;
};

export interface HostingProvider {
  createProject(input: CreateProjectInput): Promise<CreateProjectResult>;
  createDeployment(input: CreateDeploymentInput): Promise<CreateDeploymentResult>;
  getDeploymentStatus(deploymentId: string): Promise<{ status: string; url?: string }>;
  addDomain(input: AddDomainInput): Promise<{ success: boolean; error?: string }>;
  removeDomain(projectId: string, domain: string): Promise<{ success: boolean; error?: string }>;
}

