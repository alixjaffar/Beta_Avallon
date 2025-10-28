import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://beta-avallon1.vercel.app/api' // Your deployed backend URL
  : 'http://localhost:3000/api'; // Backend runs on port 3000

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Site {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  status: 'draft' | 'generating' | 'deployed' | 'failed';
  previewUrl?: string;
  repoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DomainAvailability {
  domain: string;
  available: boolean;
  price?: number;
  currency?: string;
  provider: string;
  mock: boolean;
}

export interface DomainRegistration {
  domain: string;
  years: number;
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export interface VoiceAgent {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'error';
  webhookUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface VoiceAgentConfig {
  name: string;
  description: string;
  voice: {
    provider: 'elevenlabs' | 'openai' | 'azure';
    voiceId: string;
    model?: string;
  };
  language: string;
  personality: string;
  capabilities: string[];
}

export const apiClient = {
  // Sites
  getSites: () => api.get<{ data: Site[] }>('/sites'),
  getSiteById: (id: string) => api.get<{ data: Site }>(`/sites/${id}`),
  createSite: (data: { name: string; slug?: string }) => api.post<{ message: string; result: Site }>('/sites', data),
  updateSite: (id: string, data: Partial<Site>) => api.put<{ message: string; result: Site }>(`/sites/${id}`, data),
  deleteSite: (id: string) => api.delete<{ message: string }>(`/sites/${id}`),

  // Generate site with AI
  generateSite: (data: { name: string; description?: string; mode?: string }) => 
    api.post<{ message: string; result: Site }>('/sites/generate', data),

  // Domain Management
  checkDomainAvailability: (domain: string) => 
    api.post<DomainAvailability>('/domains/check', { domain }),
  registerDomain: (data: DomainRegistration) => 
    api.post<{ success: boolean; orderId: string; domain: string; status: string }>('/domains/register', data),

  // Voice Agents
  createVoiceAgent: (data: VoiceAgentConfig) => 
    api.post<{ success: boolean; agentId: string; workflowId: string; webhookUrl: string }>('/agents/voice/create', data),
  triggerVoiceAgent: (agentId: string, input: { message?: string; audio?: string; context?: any }) => 
    api.post<{ success: boolean; response?: string; audioUrl?: string }>('/agents/voice/trigger', { agentId, input }),
};
