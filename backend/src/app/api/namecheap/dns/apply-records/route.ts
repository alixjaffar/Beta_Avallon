import { NextRequest, NextResponse } from "next/server";
import { isMockMode, namecheapRequest } from "@/lib/namecheap";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-email',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { domain, records } = await req.json();
    if (!domain || !Array.isArray(records)) {
      return NextResponse.json({ error: "domain and records[] required" }, { 
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-email',
        },
      });
    }

    if (isMockMode()) {
      return NextResponse.json({ success: true, mock: true }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-email',
        },
      });
    }

    // For MVP: set default DNS (so MX/SPF/DKIM might be applied via provider UI later)
    const result = await namecheapRequest("namecheap.domains.dns.setDefault", { SLD: domain.split(".")[0], TLD: domain.split(".").slice(1).join(".") });
    if (!result.ok) return NextResponse.json({ error: result.error }, { 
      status: 502,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-email',
      },
    });
    return NextResponse.json({ success: true, xml: result.xml }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-email',
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to apply DNS" }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-email',
      },
    });
  }
}


