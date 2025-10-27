// CHANGELOG: 2025-10-12 - Return default DNS records from DefaultRegistrar verification
// CHANGELOG: 2025-10-11 - Add verifyDomain stub to DefaultRegistrar
// CHANGELOG: 2025-10-10 - Add RegistrarProvider implementation
import axios from 'axios';
import type { RegistrarProvider, DnsRecord } from '@/lib/providers/registrar';

const REG = process.env.REGISTRAR_BASE_URL || '';
const REG_KEY = process.env.REGISTRAR_API_KEY || '';

const DEFAULT_RECORDS: { type: string; name: string; value: string }[] = [
  { type: 'A', name: '@', value: '76.76.21.21' },
  { type: 'CNAME', name: 'www', value: 'cname.vercel-dns.com' },
];

export class DefaultRegistrar implements RegistrarProvider {
  async purchaseDomain(domain: string): Promise<{ success: boolean; error?: string }> {
    if (!REG || !REG_KEY) return { success: true }; // Mock when not configured
    const res = await axios.post(`${REG}/v1/domains/purchase`, { domain }, { headers: { Authorization: `Bearer ${REG_KEY}` } })
      .catch((e)=>({ data: { error: e.message } } as any));
    if ((res as any).data?.error) return { success: false, error: (res as any).data.error };
    return { success: true };
  }

  async setRecords(domain: string, records: DnsRecord[]): Promise<{ success: boolean; error?: string }> {
    if (!REG || !REG_KEY) return { success: true }; // Mock when not configured
    const res = await axios.post(`${REG}/v1/dns/records`, { domain, records }, { headers: { Authorization: `Bearer ${REG_KEY}` } })
      .catch((e)=>({ data: { error: e.message } } as any));
    if ((res as any).data?.error) return { success: false, error: (res as any).data.error };
    return { success: true };
  }

  async verifyDomain(domain: string): Promise<{ verified: boolean; records?: { type: string; name: string; value: string }[] }> {
    if (!REG || !REG_KEY) return { verified: true, records: DEFAULT_RECORDS }; // Mock when not configured
    const res = await axios.get(`${REG}/v1/dns/verify/${domain}`, { headers: { Authorization: `Bearer ${REG_KEY}` } })
      .catch((e)=>({ data: { error: e.message } } as any));
    if ((res as any).data?.error) return { verified: false, records: DEFAULT_RECORDS };
    const records = (res as any).data?.records ?? DEFAULT_RECORDS;
    return { verified: true, records };
  }
}

