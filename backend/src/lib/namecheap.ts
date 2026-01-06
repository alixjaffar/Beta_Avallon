import { URLSearchParams } from "url";

const NAMECHEAP_API_URL = process.env.NAMECHEAP_USE_SANDBOX === "true"
  ? "https://api.sandbox.namecheap.com/xml.response"
  : "https://api.namecheap.com/xml.response";

interface NamecheapResult<T = unknown> {
  ok: boolean;
  data?: T;
  xml?: string;
  error?: string;
  mock?: boolean;
}

function getBaseParams(command: string) {
  return {
    ApiUser: process.env.NAMECHEAP_API_USER || "",
    ApiKey: process.env.NAMECHEAP_API_KEY || "",
    UserName: process.env.NAMECHEAP_USERNAME || "",
    ClientIp: process.env.NAMECHEAP_CLIENT_IP || "127.0.0.1",
    Command: command,
  };
}

export async function namecheapRequest<T = unknown>(command: string, params: Record<string, string>): Promise<NamecheapResult<T>> {
  // Mock mode when keys are missing so frontend can function pre-config
  if (!process.env.NAMECHEAP_API_KEY || !process.env.NAMECHEAP_API_USER || !process.env.NAMECHEAP_USERNAME) {
    return { ok: true, data: {} as T, mock: true };
  }

  const all = { ...getBaseParams(command), ...params } as Record<string, string>;
  const search = new URLSearchParams(all);
  const url = `${NAMECHEAP_API_URL}?${search.toString()}`;

  try {
    const res = await fetch(url, { method: "GET" });
    const xml = await res.text();
    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}`, xml };
    }
    // We return raw XML here to avoid adding XML parser deps; callers can parse minimally or use mock mode.
    return { ok: true, xml };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Network error" };
  }
}

export function isMockMode() {
  return !process.env.NAMECHEAP_API_KEY || !process.env.NAMECHEAP_API_USER || !process.env.NAMECHEAP_USERNAME;
}

// Namecheap base prices (updated regularly)
const NAMECHEAP_BASE_PRICES: Record<string, number> = {
  com: 10.28, net: 12.88, org: 9.18, io: 32.88, co: 25.88, 
  app: 14.00, dev: 12.00, ai: 69.88, ca: 10.98,
  xyz: 1.00, site: 1.88, online: 2.88, store: 3.88, 
  blog: 4.88, tech: 4.88, cloud: 8.88, space: 1.88, 
  info: 2.88, me: 2.88
};

// $3 markup for Avallon profit
const AVALLON_MARKUP = 3.00;

export async function getPricingMap(tlds: string[]): Promise<Record<string, number>> {
  // Always add $3 markup to Namecheap prices for profit
  const basePrices = { ...NAMECHEAP_BASE_PRICES };
  
  // Try to get live prices from Namecheap API
  if (!isMockMode()) {
    try {
      const res = await namecheapRequest("namecheap.users.getPricing", { 
        ProductType: "DOMAIN", 
        ActionName: "REGISTER", 
        ProductCategory: "DOMAINS" 
      });
      
      if (res.ok && res.xml) {
        const xml = res.xml;
        for (const tld of tlds) {
          const r = new RegExp(`<Product[^>]*Name=\\"${tld.toUpperCase()}\\"[\\s\\S]*?<Price>([0-9.]+)</Price>`, 'i');
          const m = xml.match(r);
          if (m) {
            basePrices[tld] = parseFloat(m[1]);
          }
        }
      }
    } catch (e) {
      console.error('Failed to fetch Namecheap pricing, using defaults:', e);
    }
  }
  
  // Return prices with $3 markup
  const out: Record<string, number> = {};
  tlds.forEach(t => { 
    if (basePrices[t] != null) {
      out[t] = Math.round((basePrices[t] + AVALLON_MARKUP) * 100) / 100; // Add $3 markup
    }
  });
  return out;
}

// Get Namecheap cost (without markup) for actual purchase
export function getNamecheapCost(tld: string): number {
  return NAMECHEAP_BASE_PRICES[tld] || 10.00;
}


