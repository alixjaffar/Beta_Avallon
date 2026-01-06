// CHANGELOG: 2025-10-12 - Add Stripe checkout session creation endpoint
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/lib/auth/getUser";
import { prisma } from "@/lib/db";
import { requireStripeClient } from "@/lib/clients/stripe";
import { logError } from "@/lib/log";
import { trackEvent } from "@/lib/monitoring";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-email',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

const Body = z.object({
  plan: z.enum(["pro", "business"]),
  interval: z.enum(["monthly", "yearly"]).default("monthly"),
});

const PRICE_ENV_MAP: Record<string, Record<string, string | undefined>> = {
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    yearly: process.env.STRIPE_PRICE_PRO_YEARLY,
  },
  business: {
    monthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY,
    yearly: process.env.STRIPE_PRICE_BUSINESS_YEARLY,
  },
};

function resolvePriceId(plan: "pro" | "business", interval: "monthly" | "yearly"): string | null {
  return PRICE_ENV_MAP[plan][interval] ?? null;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    const json = await req.json();
    const parsed = Body.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const { plan, interval } = parsed.data;

    const priceId = resolvePriceId(plan, interval);
    if (!priceId) {
      return NextResponse.json({ 
        error: `Stripe price ID for ${plan} (${interval}) is not configured. Please set STRIPE_PRICE_${plan.toUpperCase()}_${interval.toUpperCase()} in your environment variables.` 
      }, { 
        status: 503,
        headers: corsHeaders,
      });
    }

    let stripe;
    try {
      stripe = requireStripeClient();
    } catch (stripeError: unknown) {
      logError('Stripe client not configured', stripeError);
      return NextResponse.json({ 
        error: "Stripe is not configured. Please set STRIPE_SECRET_KEY in your environment variables." 
      }, { 
        status: 503,
        headers: corsHeaders,
      });
    }

    const subscription = await prisma.subscription.findFirst({
      where: { userId: user.id },
    });

    const origin = req.headers.get("origin") || process.env.APP_URL || "http://localhost:8080";
    const successUrl = `${origin}/dashboard?upgrade=success`;
    const cancelUrl = `${origin}/dashboard?upgrade=cancelled`;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: subscription?.stripeCustomerId || undefined,
      customer_email: subscription?.stripeCustomerId ? undefined : user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: user.id, // Use user.id instead of clerkId for compatibility
      metadata: {
        plan,
        interval,
        userId: user.id,
        userEmail: user.email || '',
      },
    });

    trackEvent("billing.checkout.created", {
      userId: user.id,
      plan,
      interval,
      sessionId: session.id,
    });

    return NextResponse.json({ url: session.url, id: session.id }, {
      headers: corsHeaders,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logError('Create checkout session failed', error);
    return NextResponse.json({ error: message }, { 
      status: 500,
      headers: corsHeaders,
    });
  }
}
