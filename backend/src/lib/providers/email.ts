// CHANGELOG: 2025-10-11 - Add domain verification and management methods
// CHANGELOG: 2025-10-10 - Add EmailProvider interface

export type CreateInboxInput = { domain: string; inbox: string };

export interface EmailProvider {
  createInbox(input: CreateInboxInput): Promise<{ success: boolean; error?: string }>;
  verifyDomain(domain: string): Promise<{ 
    verified: boolean; 
    records?: { type: string; name: string; value: string; status?: string }[];
    orgId?: string;
  }>;
  addDomain(domain: string): Promise<{ success: boolean; verificationCode?: string; error?: string }>;
}


