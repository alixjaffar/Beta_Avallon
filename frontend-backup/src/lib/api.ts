// API client for Avallon Cloud backend
import { Site, Agent, Domain, EmailAccount, GenerateSiteRequest, GenerateSiteResponse, ApiResponse, SystemStatus } from '../../../shared/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  // Sites API
  async getSites(): Promise<ApiResponse<Site[]>> {
    return this.request('/api/sites');
  }

  async createSite(data: { name: string; slug?: string }): Promise<ApiResponse<Site>> {
    return this.request('/api/sites', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSite(id: string): Promise<ApiResponse<Site>> {
    return this.request(`/api/sites/${id}`);
  }

  async updateSite(id: string, data: Partial<Site>): Promise<ApiResponse<Site>> {
    return this.request(`/api/sites/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSite(id: string): Promise<ApiResponse<void>> {
    return this.request(`/api/sites/${id}`, {
      method: 'DELETE',
    });
  }

  // Site Generation API
  async generateSite(data: GenerateSiteRequest): Promise<ApiResponse<GenerateSiteResponse>> {
    return this.request('/api/sites/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSiteGenerationProgress(siteId: string): Promise<ApiResponse<{ progress: number; status: string; message: string }>> {
    return this.request(`/api/sites/generate/stream?siteId=${siteId}`);
  }

  // Agents API
  async getAgents(): Promise<ApiResponse<Agent[]>> {
    return this.request('/api/n8n/agents');
  }

  async createAgent(data: { name: string; description?: string }): Promise<ApiResponse<Agent>> {
    return this.request('/api/n8n/agents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAgent(id: string): Promise<ApiResponse<Agent>> {
    return this.request(`/api/n8n/agents/${id}`);
  }

  async updateAgent(id: string, data: Partial<Agent>): Promise<ApiResponse<Agent>> {
    return this.request(`/api/n8n/agents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAgent(id: string): Promise<ApiResponse<void>> {
    return this.request(`/api/n8n/agents/${id}`, {
      method: 'DELETE',
    });
  }

  // Domains API
  async getDomains(): Promise<ApiResponse<Domain[]>> {
    return this.request('/api/domains');
  }

  async createDomain(data: { name: string; provider?: string }): Promise<ApiResponse<Domain>> {
    return this.request('/api/domains', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDomain(id: string): Promise<ApiResponse<Domain>> {
    return this.request(`/api/domains/${id}`);
  }

  async updateDomain(id: string, data: Partial<Domain>): Promise<ApiResponse<Domain>> {
    return this.request(`/api/domains/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDomain(id: string): Promise<ApiResponse<void>> {
    return this.request(`/api/domains/${id}`, {
      method: 'DELETE',
    });
  }

  // Email API
  async getEmailAccounts(): Promise<ApiResponse<EmailAccount[]>> {
    return this.request('/api/email');
  }

  async createEmailAccount(data: { email: string; provider: string }): Promise<ApiResponse<EmailAccount>> {
    return this.request('/api/email', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getEmailAccount(id: string): Promise<ApiResponse<EmailAccount>> {
    return this.request(`/api/email/${id}`);
  }

  async updateEmailAccount(id: string, data: Partial<EmailAccount>): Promise<ApiResponse<EmailAccount>> {
    return this.request(`/api/email/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEmailAccount(id: string): Promise<ApiResponse<void>> {
    return this.request(`/api/email/${id}`, {
      method: 'DELETE',
    });
  }

  // System Status API
  async getSystemStatus(): Promise<ApiResponse<SystemStatus>> {
    return this.request('/api/test/current-status');
  }

  async testCompleteWorkflow(): Promise<ApiResponse<any>> {
    return this.request('/api/test/complete-workflow');
  }

  async testGitHubPermissions(): Promise<ApiResponse<any>> {
    return this.request('/api/test/github-permissions');
  }

  async testClaudeDebug(): Promise<ApiResponse<any>> {
    return this.request('/api/test/claude-debug');
  }
}

export const apiClient = new ApiClient();
export default apiClient;
