// CHANGELOG: 2025-10-11 - Add verifyDomain method to RegistrarProvider
// CHANGELOG: 2025-10-10 - Add RegistrarProvider interface

export type DnsRecord = { type: string; name: string; value: string; ttl?: number };

export interface RegistrarProvider {
  purchaseDomain(domain: string): Promise<{ success: boolean; error?: string }>;
  setRecords(domain: string, records: DnsRecord[]): Promise<{ success: boolean; error?: string }>;
  verifyDomain(domain: string): Promise<{ verified: boolean; records?: { type: string; name: string; value: string }[] }>;
}


