// CHANGELOG: 2025-01-15 - Add domain availability check with Namecheap integration
import { NextRequest, NextResponse } from "next/server";
import { createNamecheapClient } from "@/lib/clients/namecheap";
import { logError } from "@/lib/log";
import { z } from "zod";

const CheckDomainSchema = z.object({
  domain: z.string().min(1, "Domain is required").max(255, "Domain too long"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { domain } = CheckDomainSchema.parse(body);

    // Get Namecheap configuration from environment
    const namecheapConfig = {
      apiUser: process.env.NAMECHEAP_API_USER || '',
      apiKey: process.env.NAMECHEAP_API_KEY || '',
      userName: process.env.NAMECHEAP_USERNAME || '',
      clientIp: process.env.NAMECHEAP_CLIENT_IP || '127.0.0.1',
      sandbox: process.env.NAMECHEAP_SANDBOX === 'true',
    };

    // Check if Namecheap is configured
    if (!namecheapConfig.apiKey) {
      // Return mock data for testing
      return NextResponse.json({
        domain,
        available: Math.random() > 0.5, // Random availability for testing
        price: 12.99,
        currency: 'USD',
        provider: 'namecheap',
        mock: true,
      });
    }

    // Use real Namecheap API
    const namecheapClient = createNamecheapClient(namecheapConfig);
    const result = await namecheapClient.checkDomainAvailability(domain);

    return NextResponse.json({
      ...result,
      provider: 'namecheap',
      mock: false,
    });
  } catch (error: any) {
    logError('Domain check failed', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
