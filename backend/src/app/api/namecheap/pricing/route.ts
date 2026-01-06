import { NextRequest, NextResponse } from "next/server";
import { getPricingMap } from "@/lib/namecheap";
import { logInfo, logError } from "@/lib/log";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-email',
};

const TLDs = ["com", "net", "org", "io", "co", "app", "dev", "ai", "ca", "xyz", "site", "online", "store", "blog", "tech", "cloud", "space", "info", "me"];

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET(req: NextRequest) {
  try {
    // Get prices with $3 Avallon markup already included
    const prices = await getPricingMap(TLDs);
    
    logInfo('Pricing fetched successfully', { 
      tldCount: Object.keys(prices).length,
      samplePrices: { com: prices.com, io: prices.io, ai: prices.ai }
    });
    
    return NextResponse.json({ prices }, { headers: corsHeaders });
  } catch (e: any) {
    logError('Pricing API exception', e);
    
    // Return fallback prices with $3 markup if API fails
    const fallbackPrices: Record<string, number> = {
      com: 13.28, net: 15.88, org: 12.18, io: 35.88, co: 28.88, 
      app: 17.00, dev: 15.00, ai: 72.88, ca: 13.98,
      xyz: 4.00, site: 4.88, online: 5.88, store: 6.88, 
      blog: 7.88, tech: 7.88, cloud: 11.88, space: 4.88, 
      info: 5.88, me: 5.88
    };
    
    return NextResponse.json({ prices: fallbackPrices }, { headers: corsHeaders });
  }
}



