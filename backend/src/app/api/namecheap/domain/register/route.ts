import { NextRequest, NextResponse } from "next/server";
import { isMockMode, namecheapRequest } from "@/lib/namecheap";
import { logInfo, logError } from "@/lib/log";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-email',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { domain, years = 1 } = await req.json();
    
    if (!domain || typeof domain !== 'string') {
      return NextResponse.json(
        { error: "Domain is required and must be a valid string" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate domain format
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      return NextResponse.json(
        { error: "Invalid domain format" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate years
    const yearsNum = parseInt(String(years), 10);
    if (isNaN(yearsNum) || yearsNum < 1 || yearsNum > 10) {
      return NextResponse.json(
        { error: "Years must be between 1 and 10" },
        { status: 400, headers: corsHeaders }
      );
    }

    logInfo('Domain registration request', { domain, years: yearsNum });

    if (isMockMode()) {
      logInfo('Domain registration in mock mode', { domain });
      return NextResponse.json(
        {
          success: true,
          mock: true,
          orderId: `mock-${Date.now()}`,
          domain,
          message: "Domain registration simulated (Namecheap API not configured)",
        },
        { headers: corsHeaders }
      );
    }

    // NOTE: Namecheap uses Registrant contact fields; for MVP we assume defaults are set on the account.
    const result = await namecheapRequest("namecheap.domains.create", {
      DomainName: domain,
      Years: String(yearsNum),
    });

    if (!result.ok) {
      logError('Domain registration failed', new Error(result.error || 'Unknown error'), { domain });
      return NextResponse.json(
        {
          error: result.error || "Domain registration failed",
          details: "Please check your Namecheap API configuration and ensure your IP is whitelisted",
        },
        { status: 502, headers: corsHeaders }
      );
    }

    // Parse response to check for errors in XML
    if (result.xml && result.xml.includes('<Status>ERROR</Status>')) {
      const errorMatch = result.xml.match(/<Error>([^<]+)<\/Error>/);
      const errorMessage = errorMatch ? errorMatch[1] : 'Domain registration failed';
      logError('Domain registration API error', new Error(errorMessage), { domain, xml: result.xml });
      return NextResponse.json(
        {
          error: errorMessage,
          details: "The domain may already be registered or there was an issue with the registration",
        },
        { status: 400, headers: corsHeaders }
      );
    }

    logInfo('Domain registration successful', { domain });
    return NextResponse.json(
      {
        success: true,
        domain,
        orderId: `order-${Date.now()}`,
        message: "Domain registration initiated successfully",
      },
      { headers: corsHeaders }
    );
  } catch (e: any) {
    logError('Domain registration exception', e, { error: e?.message });
    return NextResponse.json(
      {
        error: e?.message || "Failed to register domain",
        details: "An unexpected error occurred. Please try again later.",
      },
      { status: 500, headers: corsHeaders }
    );
  }
}


