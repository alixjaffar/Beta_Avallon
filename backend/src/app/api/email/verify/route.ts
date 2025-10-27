// CHANGELOG: 2025-10-12 - Verify email provider DNS records for a domain
// CHANGELOG: 2025-10-12 - Add monitoring event for email domain verification
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/lib/auth/getUser";
import { findDomainByNameAndUser } from "@/data/domains";
import { getEmailProvider } from "@/lib/providers";
import { logError } from "@/lib/log";
import { trackEvent } from "@/lib/monitoring";

const Body = z.object({
  domain: z.string().min(3).max(253),
});

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

    const emailProvider = getEmailProvider();
    const verification = await emailProvider.verifyDomain(domain);

    const responseBody = {
      message: verification.verified ? "Email domain verified" : "Email domain pending verification",
      result: verification,
    };

    trackEvent("email.domain.verification", {
      domainId: record.id,
      verified: verification.verified,
    });

    return NextResponse.json(responseBody);
  } catch (error: unknown) {
    logError("Verify email domain failed", error);
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
