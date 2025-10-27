// Shared types for Avallon Cloud platform

export interface Site {
  id: string;
  name: string;
  slug: string;
  status: 'draft' | 'generating' | 'deployed' | 'failed';
  previewUrl?: string;
  repoUrl?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Agent {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'error';
  n8nId?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Domain {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'expired' | 'failed';
  provider: 'namecheap' | 'other';
  expiresAt?: Date;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailAccount {
  id: string;
  email: string;
  provider: string;
  status: 'active' | 'inactive' | 'error';
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GenerateSiteRequest {
  name: string;
  description?: string;
  features?: string[];
  style?: 'modern' | 'classic' | 'minimal' | 'creative';
  colorScheme?: string;
  pages?: string[];
}

export interface GenerateSiteResponse {
  siteId: string;
  previewUrl: string;
  repoUrl: string;
  status: 'generating' | 'completed' | 'failed';
  progress?: number;
  message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface ProgressUpdate {
  step: string;
  progress: number;
  message: string;
  status: 'running' | 'completed' | 'failed';
}

export interface SystemStatus {
  claude: {
    status: 'working' | 'error';
    message?: string;
  };
  github: {
    status: 'working' | 'error';
    message?: string;
  };
  vercel: {
    status: 'working' | 'error';
    message?: string;
  };
  database: {
    status: 'working' | 'error';
    message?: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  limits: {
    sites: number;
    agents: number;
    domains: number;
    emailAccounts: number;
  };
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'past_due';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}
