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
 * Cancel user's subscription
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

    if (!subscription || !subscription.stripeSubscriptionId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Cancel at period end (don't cancel immediately)
    const canceledSubscription = await stripe.subscriptions.update(
      subscription.stripeSubscriptionId,
      {
        cancel_at_period_end: true,
      }
    );

    // Update database
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: true,
        status: 'canceled',
      },
    });

    logInfo('Subscription canceled', { 
      userId: user.id, 
      subscriptionId: subscription.stripeSubscriptionId,
      cancelAt: canceledSubscription.cancel_at 
    });

    return NextResponse.json({ 
      success: true,
      message: "Subscription will cancel at the end of the billing period",
      cancelAt: canceledSubscription.cancel_at ? new Date(canceledSubscription.cancel_at * 1000) : null,
    }, { headers: corsHeaders });

  } catch (error: any) {
    logError('Failed to cancel subscription', error);
    return NextResponse.json(
      { error: error.message || "Failed to cancel subscription" },
      { status: 500, headers: corsHeaders }
    );
  }
}
