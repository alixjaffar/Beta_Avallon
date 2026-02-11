// CHANGELOG: 2025-10-12 - Attach domains to Vercel project with plan enforcement
// CHANGELOG: 2025-10-11 - Refactor to use data access helpers
// CHANGELOG: 2025-10-10 - Add route to connect a domain to a site
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/lib/auth/getUser";
import { findDomainByNameAndUser, updateDomain } from "@/data/domains";
import { getSiteById } from "@/data/sites";
import { getHostingProvider } from "@/lib/providers";
import { canCreateCustomDomain } from "@/lib/billing/limits";
import { logError } from "@/lib/log";

const Body = z.object({
  domain: z.string().min(3).max(253),
  siteId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    const json = await req.json();
    const parsed = Body.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const { domain, siteId } = parsed.data;

    const customDomainAllowed = await canCreateCustomDomain(user.id);
    if (!customDomainAllowed) {
      return NextResponse.json({
        error: "Your current plan does not support custom domains. Upgrade to Pro to continue.",
      }, { status: 403 });
    }

    // Ensure both belong to the current user
    const [domainRecord, site] = await Promise.all([
      findDomainByNameAndUser(domain, user.id),
      getSiteById(siteId, user.id),
    ]);

    if (!domainRecord) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }
    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    if (!site.vercelProjectId) {
      return NextResponse.json({ error: "Site is not yet provisioned on Vercel." }, { status: 400 });
    }

    const hosting = getHostingProvider();
    const hostingResult = await hosting.addDomain({ projectId: site.vercelProjectId, domain });
    if (!hostingResult.success) {
      return NextResponse.json({ error: hostingResult.error || "Failed to attach domain to hosting provider" }, { status: 502 });
    }

    // SECURITY: Pass userId for ownership verification
    const updated = await updateDomain(domainRecord.id, user.id, { siteId: site.id });

    return NextResponse.json({
      message: "Domain connected to site",
      result: { domainId: updated.id, siteId: updated.siteId },
    });
  } catch (error: unknown) {
    logError('Connect domain to site failed', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

