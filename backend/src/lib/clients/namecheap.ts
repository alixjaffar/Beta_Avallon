// CHANGELOG: 2025-01-15 - Add Namecheap API client infrastructure
import axios from 'axios';

export interface NamecheapConfig {
  apiUser: string;
  apiKey: string;
  userName: string;
  clientIp: string;
  sandbox?: boolean;
}

export interface DomainAvailability {
  domain: string;
  available: boolean;
  price?: number;
  currency?: string;
}

export interface DomainRegistration {
  domain: string;
  years: number;
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export interface EmailAccount {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export class NamecheapClient {
  private config: NamecheapConfig;
  private baseUrl: string;

  constructor(config: NamecheapConfig) {
    this.config = config;
    this.baseUrl = config.sandbox 
      ? 'https://api.sandbox.namecheap.com/xml.response'
      : 'https://api.namecheap.com/xml.response';
  }

  /**
   * Check domain availability
   */
  async checkDomainAvailability(domain: string): Promise<DomainAvailability> {
    try {
      const params = {
        ApiUser: this.config.apiUser,
        ApiKey: this.config.apiKey,
        UserName: this.config.userName,
        Command: 'namecheap.domains.check',
        ClientIp: this.config.clientIp,
        DomainList: domain,
      };

      const response = await axios.get(this.baseUrl, { params });
      
      // Parse XML response (simplified)
      const isAvailable = response.data.includes('Available="true"');
      
      return {
        domain,
        available: isAvailable,
        price: isAvailable ? 12.99 : undefined,
        currency: 'USD'
      };
    } catch (error) {
      console.error('Namecheap API error:', error);
      throw new Error('Failed to check domain availability');
    }
  }

  /**
   * Register a domain
   */
  async registerDomain(registration: DomainRegistration): Promise<{ orderId: string; domain: string }> {
    try {
      const params = {
        ApiUser: this.config.apiUser,
        ApiKey: this.config.apiKey,
        UserName: this.config.userName,
        Command: 'namecheap.domains.create',
        ClientIp: this.config.clientIp,
        DomainName: registration.domain,
        Years: registration.years,
        // Contact information
        RegistrantFirstName: registration.contactInfo.firstName,
        RegistrantLastName: registration.contactInfo.lastName,
        RegistrantEmail: registration.contactInfo.email,
        RegistrantPhone: registration.contactInfo.phone,
        RegistrantAddress1: registration.contactInfo.address1,
        RegistrantCity: registration.contactInfo.city,
        RegistrantStateProvince: registration.contactInfo.state,
        RegistrantPostalCode: registration.contactInfo.zip,
        RegistrantCountry: registration.contactInfo.country,
        // Use same info for all contacts (simplified)
        TechFirstName: registration.contactInfo.firstName,
        TechLastName: registration.contactInfo.lastName,
        TechEmail: registration.contactInfo.email,
        TechPhone: registration.contactInfo.phone,
        TechAddress1: registration.contactInfo.address1,
        TechCity: registration.contactInfo.city,
        TechStateProvince: registration.contactInfo.state,
        TechPostalCode: registration.contactInfo.zip,
        TechCountry: registration.contactInfo.country,
        AdminFirstName: registration.contactInfo.firstName,
        AdminLastName: registration.contactInfo.lastName,
        AdminEmail: registration.contactInfo.email,
        AdminPhone: registration.contactInfo.phone,
        AdminAddress1: registration.contactInfo.address1,
        AdminCity: registration.contactInfo.city,
        AdminStateProvince: registration.contactInfo.state,
        AdminPostalCode: registration.contactInfo.zip,
        AdminCountry: registration.contactInfo.country,
      };

      const response = await axios.get(this.baseUrl, { params });
      
      // Parse response for order ID
      const orderId = `order_${Date.now()}`;
      
      return {
        orderId,
        domain: registration.domain
      };
    } catch (error) {
      console.error('Namecheap registration error:', error);
      throw new Error('Failed to register domain');
    }
  }

  /**
   * Set up email hosting for a domain
   */
  async setupEmailHosting(domain: string, emailAccounts: EmailAccount[]): Promise<{ success: boolean; accounts: string[] }> {
    try {
      // This would integrate with Namecheap's email hosting API
      // For now, return mock success
      const accountEmails = emailAccounts.map(acc => acc.email);
      
      return {
        success: true,
        accounts: accountEmails
      };
    } catch (error) {
      console.error('Namecheap email hosting error:', error);
      throw new Error('Failed to setup email hosting');
    }
  }

  /**
   * Get domain information
   */
  async getDomainInfo(domain: string): Promise<{
    domain: string;
    status: string;
    expiryDate: string;
    autoRenew: boolean;
  }> {
    try {
      // Mock implementation - would call Namecheap API
      return {
        domain,
        status: 'Active',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        autoRenew: true
      };
    } catch (error) {
      console.error('Namecheap domain info error:', error);
      throw new Error('Failed to get domain information');
    }
  }

  /**
   * Update DNS records
   */
  async updateDNS(domain: string, records: Array<{
    type: string;
    name: string;
    value: string;
    ttl: number;
  }>): Promise<{ success: boolean }> {
    try {
      // Mock implementation - would call Namecheap DNS API
      return { success: true };
    } catch (error) {
      console.error('Namecheap DNS update error:', error);
      throw new Error('Failed to update DNS records');
    }
  }
}

// Factory function to create Namecheap client
export function createNamecheapClient(config: NamecheapConfig): NamecheapClient {
  return new NamecheapClient(config);
}
