// CHANGELOG: 2025-10-12 - Add monitoring and retry logic for domain provisioning
// CHANGELOG: 2025-10-12 - Enforce plan limits and bootstrap email provider configuration
// CHANGELOG: 2025-10-11 - Refactor to use data access helpers
// CHANGELOG: 2025-10-10 - Refactor to RegistrarProvider abstraction
// CHANGELOG: 2024-12-19 - Add Domain persistence with Clerk auth and status management
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRegistrarProvider, getEmailProvider } from "@/lib/providers";
import { getUser } from "@/lib/auth/getUser";
import { createDomain, updateDomain, findDomainByName } from "@/data/domains";
import { checkLimit, canCreateCustomDomain } from "@/lib/billing/limits";
import { logError } from "@/lib/log";
import { withRetry } from "@/lib/retry";
import { trackEvent } from "@/lib/monitoring";

const Body = z.object({ 
  domain: z.string().min(3).max(253).regex(/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}$/, "Invalid domain format")
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

    const limitCheck = await checkLimit(user.id, 'domains');
    if (!limitCheck.allowed) {
      return NextResponse.json({
        error: `Domain limit reached. You have ${limitCheck.current}/${limitCheck.limit} domains. Upgrade your plan to add more.`,
      }, { status: 403 });
    }

    const customDomainAllowed = await canCreateCustomDomain(user.id);
    if (!customDomainAllowed) {
      return NextResponse.json({
        error: "Your current plan does not support custom domains. Upgrade to Pro to continue.",
      }, { status: 403 });
    }
    
    // Check if domain already exists
    const existingDomain = await findDomainByName(domain);
    if (existingDomain) {
      return NextResponse.json({ error: "Domain already exists" }, { status: 409 });
    }

    // Create Domain in database first with pending status
    const domainRecord = await createDomain({
      ownerId: user.id,
      domain,
      status: "pending",
    });

    try {
      // Call provider API
      const registrar = getRegistrarProvider();
      const purchase = await registrar.purchaseDomain(domain);
      if (!purchase.success) {
        await updateDomain(domainRecord.id, { status: "failed" });
        return NextResponse.json({ error: purchase.error || 'Registrar error' }, { status: 502 });
      }

      // Set default DNS records
      const dnsResponse = await withRetry(
        () => registrar.setRecords(domain, [
          { type: "A", name: "@", value: "76.76.21.21" }, // Vercel
          { type: "CNAME", name: "www", value: "cname.vercel-dns.com" },
        ]),
        { onRetry: (attempt) => trackEvent("registrar.setRecords.retry", { attempt, domain }) },
      );
      if (!dnsResponse.success) {
        await updateDomain(domainRecord.id, { status: "failed" });
        return NextResponse.json({ error: dnsResponse.error || 'Failed to apply DNS records' }, { status: 502 });
      }

      // Add domain to email provider (returns verification steps)
      const emailProvider = getEmailProvider();
      const emailDomain = await emailProvider.addDomain(domain);
      if (!emailDomain.success) {
        logError('Email provider addDomain failed', new Error(emailDomain.error || 'Unknown error'), { domain });
      }

      // Update domain status to active on success
      const updatedDomain = await updateDomain(domainRecord.id, { status: "active" });

      trackEvent("domain.purchased", {
        domainId: updatedDomain.id,
        domain: updatedDomain.domain,
        emailProvisioned: emailDomain.success,
      });

      return NextResponse.json({ 
        message: "Domain purchase successful", 
        result: { 
          domainId: updatedDomain.id, 
          domain: updatedDomain.domain, 
          status: updatedDomain.status,
          emailProvisioning: {
            success: emailDomain.success,
            verificationCode: emailDomain.verificationCode,
            error: emailDomain.error,
          },
        }
      });
    } catch (apiError) {
      // If registrar API fails, keep domain but mark as failed
      await updateDomain(domainRecord.id, { status: "failed" });
      throw apiError;
    }
  } catch (error: unknown) {
    logError('Purchase domain failed', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
