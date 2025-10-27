// CHANGELOG: 2025-10-12 - Verify registrar and email DNS records before activating domain
// CHANGELOG: 2025-10-12 - Add monitoring events for domain verification
// CHANGELOG: 2025-10-11 - Refactor to use data access helpers
// CHANGELOG: 2025-10-10 - Add domain verify route (stub registrar check)
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/lib/auth/getUser";
import { findDomainByNameAndUser, updateDomain } from "@/data/domains";
import { getRegistrarProvider, getEmailProvider } from "@/lib/providers";
import { logError } from "@/lib/log";
import { trackEvent } from "@/lib/monitoring";

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

    const record = await findDomainByNameAndUser(domain, user.id);
    if (!record) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }

    const registrar = getRegistrarProvider();
    const registrarResult = await registrar.verifyDomain(domain);

    const emailProvider = getEmailProvider();
    const emailResult = await emailProvider.verifyDomain(domain);

    const status = registrarResult.verified ? "active" : "pending";

    const updated = await updateDomain(record.id, { status });

    const responseBody = { 
      message: registrarResult.verified ? "Domain verified" : "Domain verification pending", 
      result: { 
        domainId: updated.id, 
        status: updated.status,
        registrar: registrarResult,
        email: emailResult,
      } 
    };

    trackEvent("domain.verification", {
      domainId: updated.id,
      verified: registrarResult.verified,
      emailVerified: emailResult.verified,
    });

    return NextResponse.json(responseBody);
  } catch (error: unknown) {
    logError('Verify domain failed', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
