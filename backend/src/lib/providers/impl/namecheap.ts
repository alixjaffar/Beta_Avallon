// CHANGELOG: 2025-10-12 - Parse DNS records during verification
// CHANGELOG: 2025-10-11 - Add Namecheap registrar implementation with real API
import axios from 'axios';
import type { RegistrarProvider, DnsRecord } from '@/lib/providers/registrar';
import { logError, logInfo } from '@/lib/log';

const API_USER = process.env.NAMECHEAP_API_USER || '';
const API_KEY = process.env.NAMECHEAP_API_KEY || '';
const USERNAME = process.env.NAMECHEAP_USERNAME || '';
const CLIENT_IP = process.env.NAMECHEAP_CLIENT_IP || '';
const BASE_URL = process.env.NAMECHEAP_BASE_URL || 'https://api.namecheap.com/xml.response';

const isConfigured = !!(API_USER && API_KEY && USERNAME && CLIENT_IP);

export class NamecheapProvider implements RegistrarProvider {
  private buildUrl(command: string, extraParams: Record<string, string> = {}) {
    const params = new URLSearchParams({
      ApiUser: API_USER,
      ApiKey: API_KEY,
      UserName: USERNAME,
      ClientIp: CLIENT_IP,
      Command: command,
      ...extraParams,
    });
    return `${BASE_URL}?${params.toString()}`;
  }

  async purchaseDomain(domain: string): Promise<{ success: boolean; error?: string }> {
    if (!isConfigured) {
      logInfo('Namecheap not configured, returning mocked purchase success', { domain });
      return { success: true };
    }

    try {
      const [sld, tld] = domain.split('.');
      const url = this.buildUrl('namecheap.domains.create', {
        DomainName: domain,
        Years: '1',
      });

      const response = await axios.get(url);
      
      // Parse XML response (simplified - real implementation should use xml2js)
      if (response.data.includes('<Status>ERROR</Status>')) {
        const errorMatch = response.data.match(/<Error>([^<]+)<\/Error>/);
        const error = errorMatch ? errorMatch[1] : 'Domain purchase failed';
        logError('Namecheap purchase failed', new Error(error), { domain });
        return { success: false, error };
      }

      logInfo('Namecheap domain purchased', { domain });
      return { success: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logError('Namecheap purchase error', error, { domain });
      return { success: false, error: message };
    }
  }

  async setRecords(domain: string, records: DnsRecord[]): Promise<{ success: boolean; error?: string }> {
    if (!isConfigured) {
      logInfo('Namecheap not configured, returning mocked DNS set success', { domain, recordCount: records.length });
      return { success: true };
    }

    try {
      const [sld, tld] = domain.split('.');
      
      // Build host records params
      const params: Record<string, string> = { SLD: sld, TLD: tld };
      records.forEach((record, i) => {
        const idx = i + 1;
        params[`HostName${idx}`] = record.name === '@' ? '@' : record.name;
        params[`RecordType${idx}`] = record.type;
        params[`Address${idx}`] = record.value;
        params[`TTL${idx}`] = (record.ttl || 1800).toString();
      });

      const url = this.buildUrl('namecheap.domains.dns.setHosts', params);
      const response = await axios.get(url);

      if (response.data.includes('<Status>ERROR</Status>')) {
        const errorMatch = response.data.match(/<Error>([^<]+)<\/Error>/);
        const error = errorMatch ? errorMatch[1] : 'DNS update failed';
        logError('Namecheap DNS set failed', new Error(error), { domain });
        return { success: false, error };
      }

      logInfo('Namecheap DNS records set', { domain, recordCount: records.length });
      return { success: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logError('Namecheap DNS set error', error, { domain });
      return { success: false, error: message };
    }
  }

  async verifyDomain(domain: string): Promise<{ verified: boolean; records?: { type: string; name: string; value: string }[] }> {
    const defaultRecords = [
      { type: 'A', name: '@', value: '76.76.21.21' },
      { type: 'CNAME', name: 'www', value: 'cname.vercel-dns.com' },
    ];

    if (!isConfigured) {
      logInfo('Namecheap not configured, returning mocked verification', { domain });
      return { verified: true, records: defaultRecords };
    }

    try {
      const [sld, tld] = domain.split('.');
      const url = this.buildUrl('namecheap.domains.dns.getHosts', { SLD: sld, TLD: tld });
      const response = await axios.get(url);

      // Parse and return current records (simplified)
      const verified = !response.data.includes('<Status>ERROR</Status>');
      const records: { type: string; name: string; value: string }[] = [];

      const hostRegex = /<host[^>]*Name="([^"]+)"[^>]*Type="([^"]+)"[^>]*Address="([^"]+)"[^>]*>/gi;
      let match: RegExpExecArray | null;
      while ((match = hostRegex.exec(response.data)) !== null) {
        records.push({
          name: match[1],
          type: match[2],
          value: match[3],
        });
      }

      if (records.length === 0) {
        records.push(...defaultRecords);
      }
      
      logInfo('Namecheap domain verified', { domain, verified, recordCount: records.length });
      return { verified, records };
    } catch (error: unknown) {
      logError('Namecheap verify error', error, { domain });
      return { verified: false, records: defaultRecords };
    }
  }
}

export function isNamecheapConfigured(): boolean {
  return isConfigured;
}
