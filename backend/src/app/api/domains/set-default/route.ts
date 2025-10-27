// CHANGELOG: 2025-10-12 - Enforce plan gating when applying default DNS
// CHANGELOG: 2025-10-11 - Refactor to use data access helpers
// CHANGELOG: 2025-10-10 - Add route to set default DNS records via registrar
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/lib/auth/getUser";
import { findDomainByNameAndUser } from "@/data/domains";
import { getRegistrarProvider } from "@/lib/providers";
import { canCreateCustomDomain } from "@/lib/billing/limits";
import { logError } from "@/lib/log";

const Body = z.object({ domain: z.string().min(3).max(253) });

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    const json = await req.json();
    const parsed = Body.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const { domain } = parsed.data;

    const customDomainAllowed = await canCreateCustomDomain(user.id);
    if (!customDomainAllowed) {
      return NextResponse.json({
        error: "Your current plan does not support custom domains. Upgrade to Pro to continue.",
      }, { status: 403 });
    }

    const record = await findDomainByNameAndUser(domain, user.id);
    if (!record) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }

    const registrar = getRegistrarProvider();
    const resp = await registrar.setRecords(domain, [
      { type: "A", name: "@", value: "76.76.21.21" },
      { type: "CNAME", name: "www", value: "cname.vercel-dns.com" },
    ]);
    if (!resp.success) {
      return NextResponse.json({ error: resp.error || 'Registrar error' }, { status: 502 });
    }

    return NextResponse.json({ message: "DNS records set", result: { domain } });
  } catch (error: unknown) {
    logError('Set default DNS failed', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

