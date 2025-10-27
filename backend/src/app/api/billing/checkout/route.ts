// CHANGELOG: 2025-10-12 - Add Stripe checkout session creation endpoint
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/lib/auth/getUser";
import { prisma } from "@/lib/db";
import { requireStripeClient } from "@/lib/clients/stripe";
import { logError } from "@/lib/log";
import { trackEvent } from "@/lib/monitoring";

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
      return NextResponse.json({ error: "Selected plan is not configured." }, { status: 503 });
    }

    let stripe;
    try {
      stripe = requireStripeClient();
    } catch (stripeError: unknown) {
      logError('Stripe client not configured', stripeError);
      return NextResponse.json({ error: "Stripe is not configured." }, { status: 503 });
    }

    const subscription = await prisma.subscription.findFirst({
      where: { userId: user.id },
    });

    const origin = req.headers.get("origin") || process.env.APP_URL || "http://localhost:3000";
    const successUrl = `${origin}/studio/billing?status=success`;
    const cancelUrl = `${origin}/studio/billing?status=cancelled`;

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
      client_reference_id: user.clerkId,
      metadata: {
        plan,
        interval,
      },
    });

    trackEvent("billing.checkout.created", {
      userId: user.id,
      plan,
      interval,
      sessionId: session.id,
    });

    return NextResponse.json({ url: session.url, id: session.id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logError('Create checkout session failed', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
