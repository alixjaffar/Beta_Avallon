// CHANGELOG: 2025-10-12 - Mock email data helpers and embed-aware provider responses
// CHANGELOG: 2025-10-11 - Mock data access layer instead of Prisma directly
// CHANGELOG: 2025-10-10 - Mock provider clients and export prisma for tests
// CHANGELOG: 2024-12-19 - Add Vitest configuration and test utilities
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Clerk auth
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(() => Promise.resolve({ userId: 'test-clerk-id' })),
}));

// Mock auth/getUser helper
vi.mock('@/lib/auth/getUser', () => ({
  getUser: vi.fn(() => Promise.resolve({ id: 'user-1', clerkId: 'clerk-1', email: 'test@example.com', createdAt: new Date() })),
}));

// Mock data access helpers
vi.mock('@/data/sites', () => ({
  createSite: vi.fn(),
  listSitesByUser: vi.fn(),
  getSiteById: vi.fn(),
}));

vi.mock('@/data/agents', () => ({
  createAgent: vi.fn(),
  updateAgent: vi.fn(),
  listAgentsByUser: vi.fn(),
  getAgentById: vi.fn(),
}));

vi.mock('@/data/domains', () => ({
  createDomain: vi.fn(),
  updateDomain: vi.fn(),
  findDomainByName: vi.fn(),
  findDomainByNameAndUser: vi.fn(),
  listDomainsByUser: vi.fn(),
  getDomainById: vi.fn(),
}));

vi.mock('@/data/emailAccounts', () => ({
  createEmailAccount: vi.fn(),
  findEmailAccountByDomainAndInbox: vi.fn(),
  countEmailAccountsByUser: vi.fn(),
  listEmailAccountsByDomain: vi.fn(),
}));

// Mock slug utilities
vi.mock('@/lib/slug', () => ({
  slugify: vi.fn((text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')),
  getUniqueSlug: vi.fn((slug: string) => Promise.resolve(slug)),
}));

// Mock billing limits
vi.mock('@/lib/billing/limits', () => ({
  checkLimit: vi.fn(() => Promise.resolve({ allowed: true, current: 0, limit: 10 })),
  getUserPlan: vi.fn(() => Promise.resolve('free')),
  getUserLimits: vi.fn(() => Promise.resolve({ sites: 1, agents: 1, domains: 0, customDomains: false, emailAccounts: 0 })),
  canCreateCustomDomain: vi.fn(() => Promise.resolve(false)),
}));

// Mock provider implementations
vi.mock('@/lib/providers', () => ({
  getSiteProvider: vi.fn(() => ({
    generateSite: vi.fn().mockResolvedValue({ previewUrl: 'https://preview.example.com', repoUrl: 'https://repo.example.com' }),
  })),
  getAgentProvider: vi.fn(() => ({
    createAgent: vi.fn().mockResolvedValue({ externalId: 'wf_123', embedCode: '<script>mock</script>' }),
    getEmbedCode: vi.fn().mockReturnValue('<script>mock</script>'),
  })),
  getRegistrarProvider: vi.fn(() => ({
    purchaseDomain: vi.fn().mockResolvedValue({ success: true }),
    setRecords: vi.fn().mockResolvedValue({ success: true }),
    verifyDomain: vi.fn().mockResolvedValue({ verified: true }),
  })),
  getEmailProvider: vi.fn(() => ({
    createInbox: vi.fn().mockResolvedValue({ success: true }),
    verifyDomain: vi.fn().mockResolvedValue({ verified: true }),
    addDomain: vi.fn().mockResolvedValue({ success: true, verificationCode: 'mock-code' }),
  })),
  getHostingProvider: vi.fn(() => ({
    createProject: vi.fn().mockResolvedValue({ projectId: 'mock-project-id', projectName: 'mock-project' }),
    createDeployment: vi.fn().mockResolvedValue({ deploymentId: 'mock-deployment-id', url: 'https://mock.vercel.app', readyState: 'READY' }),
    getDeploymentStatus: vi.fn().mockResolvedValue({ status: 'READY', url: 'https://mock.vercel.app' }),
    addDomain: vi.fn().mockResolvedValue({ success: true }),
    removeDomain: vi.fn().mockResolvedValue({ success: true }),
  })),
  getProviderConfigurationStatus: vi.fn(() => ({
    lovable: true,
    n8n: true,
    registrar: true,
    email: true,
    hosting: true,
  })),
}));

export { describe, it, expect, vi, beforeEach };
