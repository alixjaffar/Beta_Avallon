// CHANGELOG: 2025-01-15 - Add domain registration with Namecheap integration
import { NextRequest, NextResponse } from "next/server";
import { createNamecheapClient } from "@/lib/clients/namecheap";
import { logError } from "@/lib/log";
import { z } from "zod";

const RegisterDomainSchema = z.object({
  domain: z.string().min(1, "Domain is required").max(255, "Domain too long"),
  years: z.number().min(1, "Years must be at least 1").max(10, "Years cannot exceed 10"),
  contactInfo: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().min(1, "Phone is required"),
    address1: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().min(1, "ZIP code is required"),
    country: z.string().min(1, "Country is required"),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { domain, years, contactInfo } = RegisterDomainSchema.parse(body);

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
      // Return mock registration for testing
      return NextResponse.json({
        success: true,
        orderId: `mock_order_${Date.now()}`,
        domain,
        status: 'pending',
        estimatedCompletion: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        provider: 'namecheap',
        mock: true,
      });
    }

    // Use real Namecheap API
    const namecheapClient = createNamecheapClient(namecheapConfig);
    const result = await namecheapClient.registerDomain({
      domain,
      years,
      contactInfo,
    });

    return NextResponse.json({
      success: true,
      orderId: result.orderId,
      domain: result.domain,
      status: 'pending',
      estimatedCompletion: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      provider: 'namecheap',
      mock: false,
    });
  } catch (error: any) {
    logError('Domain registration failed', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
