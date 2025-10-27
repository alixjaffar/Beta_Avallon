// CHANGELOG: 2025-10-12 - Return default DNS guidance from Email provider mocks
// CHANGELOG: 2025-10-11 - Add verifyDomain and addDomain stubs
// CHANGELOG: 2025-10-10 - Add EmailProvider implementation
import axios from 'axios';
import type { EmailProvider, CreateInboxInput } from '@/lib/providers/email';

const MAIL = process.env.EMAIL_BASE_URL || '';
const MAIL_KEY = process.env.EMAIL_API_KEY || '';

const DEFAULT_EMAIL_RECORDS = [
  { type: 'TXT', name: '@', value: 'zoho-verification=mock', status: 'pending' },
  { type: 'MX', name: '@', value: 'mx.zoho.com', status: 'pending' },
  { type: 'TXT', name: '@', value: 'v=spf1 include:zoho.com ~all', status: 'pending' },
];

export class DefaultEmail implements EmailProvider {
  async createInbox(input: CreateInboxInput): Promise<{ success: boolean; error?: string }> {
    if (!MAIL || !MAIL_KEY) return { success: true }; // Mock when not configured
    const res = await axios.post(`${MAIL}/v1/inboxes`, { domain: input.domain, inbox: input.inbox }, { headers: { Authorization: `Bearer ${MAIL_KEY}` } })
      .catch((error: unknown) => ({ data: { error: error instanceof Error ? error.message : String(error) } }));
    if ((res as { data?: { error?: string } }).data?.error) return { success: false, error: (res as { data?: { error?: string } }).data?.error };
    return { success: true };
  }

  async verifyDomain(domain: string): Promise<{ verified: boolean; records?: { type: string; name: string; value: string; status?: string }[] }> {
    if (!MAIL || !MAIL_KEY) return { verified: true, records: DEFAULT_EMAIL_RECORDS }; // Mock when not configured
    const res = await axios.get(`${MAIL}/v1/domains/${domain}/verify`, { headers: { Authorization: `Bearer ${MAIL_KEY}` } })
      .catch((error: unknown) => ({ data: { error: error instanceof Error ? error.message : String(error) } }));
    if ((res as { data?: { error?: string } }).data?.error) return { verified: false, records: DEFAULT_EMAIL_RECORDS };
    return { verified: true, records: (res as { data?: { records?: { type: string; name: string; value: string; status?: string }[] } }).data?.records ?? DEFAULT_EMAIL_RECORDS };
  }

  async addDomain(domain: string): Promise<{ success: boolean; verificationCode?: string; error?: string }> {
    if (!MAIL || !MAIL_KEY) return { success: true, verificationCode: 'mock-code' }; // Mock when not configured
    const res = await axios.post(`${MAIL}/v1/domains`, { domain }, { headers: { Authorization: `Bearer ${MAIL_KEY}` } })
      .catch((error: unknown) => ({ data: { error: error instanceof Error ? error.message : String(error) } }));
    if ((res as { data?: { error?: string } }).data?.error) return { success: false, error: (res as { data?: { error?: string } }).data?.error };
    return { success: true, verificationCode: (res as { data?: { verificationCode?: string } }).data?.verificationCode };
  }
}

