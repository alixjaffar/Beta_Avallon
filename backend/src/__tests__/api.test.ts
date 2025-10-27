// CHANGELOG: 2025-10-12 - Cover email persistence and embed code responses
// CHANGELOG: 2025-10-11 - Update tests to mock data access layer
// CHANGELOG: 2025-10-10 - Update tests to mock provider clients and prisma updates
// CHANGELOG: 2024-12-19 - Add basic API route tests
import { describe, it, expect, vi, beforeEach } from '@/lib/test-utils';
import { POST as createSite } from '@/app/api/lovable/generate/route';
import { POST as createAgent } from '@/app/api/n8n/agents/route';
import { POST as purchaseDomain } from '@/app/api/domains/purchase/route';
import { POST as verifyDomain } from '@/app/api/domains/verify/route';
import { POST as createEmail } from '@/app/api/email/create/route';
import { GET as providerStatus } from '@/app/api/providers/status/route';
import * as sitesData from '@/data/sites';
import * as agentsData from '@/data/agents';
import * as domainsData from '@/data/domains';
import * as emailAccountsData from '@/data/emailAccounts';

describe('API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Provider Status', () => {
    it('returns provider configuration booleans', async () => {
      const response = await providerStatus(new Request('http://localhost:3000/api/providers/status'));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toMatchObject({ lovable: true, hosting: true, registrar: true });
    });
  });

  describe('Site Creation', () => {
    it('should create a site with valid data', async () => {
      const mockSite = { id: 'site-1', name: 'Test Site', slug: 'test-site', status: 'live', ownerId: 'user-1', repoUrl: null, previewUrl: 'https://preview.example.com', createdAt: new Date(), updatedAt: new Date(), customDomain: null, vercelProjectId: 'project-1', vercelDeploymentId: 'dep-1' };
      
      vi.mocked(sitesData.createSite).mockResolvedValue(mockSite);
      
      const request = new Request('http://localhost:3000/api/lovable/generate', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test Site', mode: 'lovable' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await createSite(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Site created successfully');
    });

    it('should reject invalid data', async () => {
      const request = new Request('http://localhost:3000/api/lovable/generate', {
        method: 'POST',
        body: JSON.stringify({ name: '', mode: 'invalid' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await createSite(request);
      expect(response.status).toBe(400);
    });
  });

  describe('Agent Creation', () => {
    it('should create an agent with valid data', async () => {
      const mockAgent = { id: 'agent-1', name: 'Test Agent', status: 'inactive', ownerId: 'user-1', n8nId: null, createdAt: new Date(), updatedAt: new Date() };
      const updatedAgent = { ...mockAgent, status: 'active', n8nId: 'wf_123' };
      
      vi.mocked(agentsData.createAgent).mockResolvedValue(mockAgent);
      vi.mocked(agentsData.updateAgent).mockResolvedValue(updatedAgent);
      
      const request = new Request('http://localhost:3000/api/n8n/agents', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test Agent', prompt: 'You are helpful' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await createAgent(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Agent created successfully');
      expect(data.result.embedCode).toBeDefined();
    });
  });

  describe('Domain Purchase', () => {
    it('should purchase a domain with valid data', async () => {
      const mockDomain = { id: 'domain-1', domain: 'example.com', status: 'pending', ownerId: 'user-1', siteId: null, createdAt: new Date() };
      const updatedDomain = { ...mockDomain, status: 'active' };
      
      vi.mocked(domainsData.findDomainByName).mockResolvedValue(null);
      vi.mocked(domainsData.createDomain).mockResolvedValue(mockDomain);
      vi.mocked(domainsData.updateDomain).mockResolvedValue(updatedDomain);
      
      const request = new Request('http://localhost:3000/api/domains/purchase', {
        method: 'POST',
        body: JSON.stringify({ domain: 'example.com' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await purchaseDomain(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Domain purchase successful');
    });
  });

  describe('Domain Verify', () => {
    it('should set domain status to active on verify', async () => {
      const mockDomain = { id: 'domain-1', domain: 'example.com', status: 'pending', ownerId: 'user-1', siteId: null, createdAt: new Date() };
      const updatedDomain = { ...mockDomain, status: 'active' };

      vi.mocked(domainsData.findDomainByNameAndUser).mockResolvedValue(mockDomain);
      vi.mocked(domainsData.updateDomain).mockResolvedValue(updatedDomain);

      const request = new Request('http://localhost:3000/api/domains/verify', {
        method: 'POST',
        body: JSON.stringify({ domain: 'example.com' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await verifyDomain(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Domain verified');
    });
  });

  describe('Email Creation', () => {
    it('should create email for owned domain', async () => {
      const mockDomain = { id: 'domain-1', domain: 'example.com', status: 'active', ownerId: 'user-1', siteId: null, createdAt: new Date() };
      const mockEmailAccount = {
        id: 'email-1',
        ownerId: 'user-1',
        domainId: mockDomain.id,
        inbox: 'hello',
        status: 'active',
        createdAt: new Date(),
      };
      
      vi.mocked(domainsData.findDomainByNameAndUser).mockResolvedValue(mockDomain);
      vi.mocked(emailAccountsData.findEmailAccountByDomainAndInbox).mockResolvedValue(null);
      vi.mocked(emailAccountsData.createEmailAccount).mockResolvedValue(mockEmailAccount as Awaited<ReturnType<typeof emailAccountsData.createEmailAccount>>);
      
      const request = new Request('http://localhost:3000/api/email/create', {
        method: 'POST',
        body: JSON.stringify({ domain: 'example.com', inbox: 'hello' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await createEmail(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Email inbox created successfully');
      expect(data.result.emailAccountId).toBe(mockEmailAccount.id);
    });
  });
});
