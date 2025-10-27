// CHANGELOG: 2025-10-11 - Add Zoho Mail provider implementation with OAuth2
import axios from 'axios';
import type { EmailProvider, CreateInboxInput } from '@/lib/providers/email';
import { logError, logInfo } from '@/lib/log';

const CLIENT_ID = process.env.ZOHO_CLIENT_ID || '';
const CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET || '';
const REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN || '';
const DC = process.env.ZOHO_DC || 'com'; // Data center

const isConfigured = !!(CLIENT_ID && CLIENT_SECRET && REFRESH_TOKEN);

export class ZohoMailProvider implements EmailProvider {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  private getBaseUrl() {
    return `https://mail.zoho.${DC}`;
  }

  private async refreshAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(`https://accounts.zoho.${DC}/oauth/v2/token`, null, {
        params: {
          refresh_token: REFRESH_TOKEN,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: 'refresh_token',
        },
      });

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000; // 60s buffer
      
      logInfo('Zoho access token refreshed');
      return this.accessToken!;
    } catch (error: any) {
      logError('Zoho token refresh failed', error);
      throw new Error('Failed to refresh Zoho access token');
    }
  }

  async createInbox(input: CreateInboxInput): Promise<{ success: boolean; error?: string }> {
    if (!isConfigured) {
      logInfo('Zoho not configured, returning mocked inbox creation', input);
      return { success: true };
    }

    try {
      const token = await this.refreshAccessToken();
      const { domain, inbox } = input;

      // Create mailbox (account)
      const response = await axios.post(
        `${this.getBaseUrl()}/api/accounts`,
        {
          mode: 'create',
          accountName: inbox,
          domainName: domain,
          firstName: inbox,
          lastName: 'User',
          displayName: `${inbox}@${domain}`,
          password: this.generatePassword(), // Generate secure password
        },
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status?.code !== 200) {
        const error = response.data.status?.description || 'Failed to create mailbox';
        logError('Zoho mailbox creation failed', new Error(error), input);
        return { success: false, error };
      }

      logInfo('Zoho mailbox created', { email: `${inbox}@${domain}` });
      return { success: true };
    } catch (error: any) {
      logError('Zoho createInbox error', error, input);
      return { success: false, error: error.message };
    }
  }

  async verifyDomain(domain: string): Promise<{ 
    verified: boolean; 
    records?: { type: string; name: string; value: string; status?: string }[];
    orgId?: string;
  }> {
    if (!isConfigured) {
      logInfo('Zoho not configured, returning mocked verification', { domain });
      return { verified: true };
    }

    try {
      const token = await this.refreshAccessToken();

      // Get domain details
      const response = await axios.get(
        `${this.getBaseUrl()}/api/domains/${domain}`,
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${token}`,
          },
        }
      );

      const domainData = response.data.data;
      const verified = domainData?.verificationStatus === 'verified';
      const records = [
        {
          type: 'TXT',
          name: '@',
          value: domainData?.verificationCode || 'zoho-verification=...',
          status: domainData?.verificationStatus,
        },
        {
          type: 'MX',
          name: '@',
          value: `mx.zoho.${DC}`,
          status: domainData?.mxStatus,
        },
        {
          type: 'TXT',
          name: '@',
          value: 'v=spf1 include:zoho.${DC} ~all',
          status: domainData?.spfStatus,
        },
      ];

      logInfo('Zoho domain verification checked', { domain, verified });
      return { verified, records, orgId: domainData?.orgId };
    } catch (error: any) {
      logError('Zoho domain verification error', error, { domain });
      
      // If domain not found, it needs to be added first
      if (error.response?.status === 404) {
        return { 
          verified: false, 
          records: [{
            type: 'TXT',
            name: '@',
            value: 'Add domain to Zoho first',
            status: 'pending',
          }],
        };
      }

      return { verified: false };
    }
  }

  async addDomain(domain: string): Promise<{ success: boolean; verificationCode?: string; error?: string }> {
    if (!isConfigured) {
      logInfo('Zoho not configured, returning mocked domain add', { domain });
      return { success: true, verificationCode: 'zoho-verification-mock' };
    }

    try {
      const token = await this.refreshAccessToken();

      const response = await axios.post(
        `${this.getBaseUrl()}/api/domains`,
        { domainName: domain },
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const verificationCode = response.data.data?.verificationCode;
      logInfo('Zoho domain added', { domain, verificationCode });
      
      return { success: true, verificationCode };
    } catch (error: any) {
      logError('Zoho addDomain error', error, { domain });
      return { success: false, error: error.message };
    }
  }

  private generatePassword(): string {
    // Generate a secure random password
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}

export function isZohoConfigured(): boolean {
  return isConfigured;
}

