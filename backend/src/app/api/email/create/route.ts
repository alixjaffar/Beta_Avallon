// CHANGELOG: 2025-01-07 - Add plan-based feature gating for email hosting
// CHANGELOG: 2025-10-12 - Enforce limits and persist email inbox creation
// CHANGELOG: 2025-10-12 - Add monitoring events for email provisioning
// CHANGELOG: 2025-10-11 - Refactor to use data access helpers (no persistence)
// CHANGELOG: 2025-10-10 - Refactor to EmailProvider abstraction (no persistence)
// CHANGELOG: 2024-12-19 - Update email create route with domain validation (no persistence)
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getEmailProvider } from "@/lib/providers";
import { getUser } from "@/lib/auth/getUser";
import { findDomainByNameAndUser } from "@/data/domains";
import { createEmailAccount, findEmailAccountByDomainAndInbox } from "@/data/emailAccounts";
import { checkLimit, getUserPlan, canAccessEmailHosting } from "@/lib/billing/limits";
import { logError } from "@/lib/log";
import { trackEvent } from "@/lib/monitoring";

const Body = z.object({ 
  domain: z.string().min(3).max(253), 
  inbox: z.string().min(1).max(50).regex(/^[a-zA-Z0-9._-]+$/, "Invalid inbox name")
});

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    
    // Check if user's plan allows email hosting
    const userPlan = await getUserPlan(user.id);
    if (!canAccessEmailHosting(userPlan)) {
      return NextResponse.json({
        error: "Email Hosting is not available on your current plan. Upgrade to Growth ($39.99/mo) or higher to access Email Hosting.",
        upgradeRequired: true,
        requiredPlan: "growth",
      }, { status: 403 });
    }
    
    const json = await req.json();
    const parsed = Body.safeParse(json);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const { domain, inbox } = parsed.data;

    const limitCheck = await checkLimit(user.id, "emailAccounts");
    if (!limitCheck.allowed) {
      return NextResponse.json({
        error: `Email inbox limit reached. You have ${limitCheck.current}/${limitCheck.limit} inboxes. Upgrade your plan to create more.`,
      }, { status: 403 });
    }
    
    // Verify user owns the domain and it's active
    const domainRecord = await findDomainByNameAndUser(domain, user.id);
    
    if (!domainRecord || domainRecord.status !== "active") {
      return NextResponse.json({ 
        error: "Domain not found or not active. Please purchase the domain first." 
      }, { status: 404 });
    }

    const existingInbox = await findEmailAccountByDomainAndInbox(domainRecord.id, inbox);
    if (existingInbox) {
      return NextResponse.json({
        error: `Inbox ${inbox}@${domain} already exists.`,
      }, { status: 409 });
    }

    // Call email provider API
    const email = getEmailProvider();
    const result = await email.createInbox({ domain, inbox });
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Email provider error' }, { status: 502 });
    }

    const emailAccount = await createEmailAccount({
      ownerId: user.id,
      domainId: domainRecord.id,
      inbox,
      status: "active",
    });

    const responseBody = { 
      message: "Email inbox created successfully", 
      result: { 
        email: `${inbox}@${domain}`, 
        domain, 
        inbox,
        status: emailAccount.status,
        emailAccountId: emailAccount.id,
        createdAt: emailAccount.createdAt,
      }
    };

    trackEvent("email.inbox.created", {
      emailAccountId: emailAccount.id,
      domainId: domainRecord.id,
    });

    return NextResponse.json(responseBody);
  } catch (error: unknown) {
    logError('Create email inbox failed', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
