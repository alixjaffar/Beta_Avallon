import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { prisma } from "@/lib/db";
import { requireStripeClient } from "@/lib/clients/stripe";
import { logInfo, logError } from "@/lib/log";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

/**
 * Create Stripe Customer Portal session for subscription management
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    const stripe = requireStripeClient();

    // Find user's subscription
    const subscription = await prisma.subscription.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription || !subscription.stripeCustomerId) {
      return NextResponse.json(
        { error: "No subscription found. Please subscribe first." },
        { status: 404, headers: corsHeaders }
      );
    }

    const origin = req.headers.get("origin") || process.env.APP_URL || "http://localhost:8080";
    const returnUrl = `${origin}/dashboard?billing=updated`;

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: returnUrl,
    });

    logInfo('Billing portal session created', { 
      userId: user.id, 
      portalUrl: session.url 
    });

    return NextResponse.json({ 
      url: session.url 
    }, { headers: corsHeaders });

  } catch (error: any) {
    logError('Failed to create billing portal session', error);
    return NextResponse.json(
      { error: error.message || "Failed to create billing portal session" },
      { status: 500, headers: corsHeaders }
    );
  }
}
