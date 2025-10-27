// CHANGELOG: 2025-10-12 - Expose provider configuration status helpers
// CHANGELOG: 2025-10-11 - Add Vercel hosting provider
// CHANGELOG: 2025-10-11 - Add Zoho Mail provider preference when configured
// CHANGELOG: 2025-10-11 - Add Namecheap provider preference when configured
// CHANGELOG: 2025-10-10 - Add provider DI switcher (default implementations)
import type { SiteProvider } from '@/lib/providers/sites';
import type { AgentProvider } from '@/lib/providers/agents';
import type { RegistrarProvider } from '@/lib/providers/registrar';
import type { EmailProvider } from '@/lib/providers/email';
import type { HostingProvider } from '@/lib/providers/hosting';

import { LovableProvider, isLovableConfigured } from '@/lib/providers/impl/lovable';
import { ClaudeProvider, isClaudeConfigured } from '@/lib/providers/impl/claude';
import { N8nProvider, isN8nConfigured } from '@/lib/providers/impl/n8n';
import { DefaultRegistrar } from '@/lib/providers/impl/registrar';
import { NamecheapProvider, isNamecheapConfigured } from '@/lib/providers/impl/namecheap';
import { DefaultEmail } from '@/lib/providers/impl/email';
import { ZohoMailProvider, isZohoConfigured } from '@/lib/providers/impl/zoho';
import { VercelProvider, isVercelConfigured } from '@/lib/providers/impl/vercel';

export function getSiteProvider(): SiteProvider {
  // Use Claude if configured, otherwise fallback to Lovable
  if (isClaudeConfigured()) {
    return new ClaudeProvider();
  }
  return new LovableProvider();
}

export function getAgentProvider(): AgentProvider {
  return new N8nProvider();
}

export function getRegistrarProvider(): RegistrarProvider {
  // Prefer Namecheap when configured
  if (isNamecheapConfigured()) {
    return new NamecheapProvider();
  }
  return new DefaultRegistrar();
}

export function getEmailProvider(): EmailProvider {
  // Prefer Zoho when configured
  if (isZohoConfigured()) {
    return new ZohoMailProvider();
  }
  return new DefaultEmail();
}

export function getHostingProvider(): HostingProvider {
  // Currently only Vercel
  return new VercelProvider();
}

export function getProviderConfigurationStatus() {
  return {
    lovable: isLovableConfigured(),
    n8n: isN8nConfigured(),
    registrar: isNamecheapConfigured(),
    email: isZohoConfigured(),
    hosting: isVercelConfigured(),
  };
}

