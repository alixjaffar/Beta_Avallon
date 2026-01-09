// API endpoint to cancel subscription
// CHANGELOG: 2025-01-07 - Created for subscription cancellation
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { getSubscriptionByUserId, upsertSubscription } from "@/data/subscriptions";
import { getStripeClient } from "@/lib/clients/stripe";
import { logInfo, logError } from "@/lib/log";
import { getCorsHeaders } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 200, headers: getCorsHeaders(req) });
}

export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  
  try {
    const user = await getUser();
    
    // Get current subscription
    const subscription = getSubscriptionByUserId(user.id);
    
    if (!subscription || subscription.status !== 'active') {
      return NextResponse.json({
        error: "No active subscription found",
      }, { status: 400, headers: corsHeaders });
    }

    // If there's a Stripe subscription, cancel it there too
    if (subscription.stripeSubscriptionId) {
      const stripe = getStripeClient();
      if (stripe) {
        try {
          await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
            cancel_at_period_end: true,
          });
          logInfo('Stripe subscription set to cancel at period end', { 
            subscriptionId: subscription.stripeSubscriptionId 
          });
        } catch (stripeError: any) {
          logError('Failed to cancel Stripe subscription', stripeError);
          // Continue with local cancellation
        }
      }
    }

    // Update local subscription status
    upsertSubscription({
      userId: user.id,
      plan: 'free',
      status: 'canceled',
    });

    logInfo('Subscription cancelled', { userId: user.id, previousPlan: subscription.plan });

    return NextResponse.json({
      success: true,
      message: "Your subscription has been cancelled. You'll retain access until the end of your billing period.",
    }, { headers: corsHeaders });

  } catch (error: any) {
    logError('Failed to cancel subscription', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: "Authentication required" }, { status: 401, headers: corsHeaders });
    }
    
    return NextResponse.json({ error: error.message || "Failed to cancel subscription" }, { status: 500, headers: corsHeaders });
  }
}
