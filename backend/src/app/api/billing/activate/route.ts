// API endpoint to activate plan after successful Stripe checkout
// CHANGELOG: 2025-01-07 - Created for local development without webhooks
// CHANGELOG: 2025-01-07 - Added credits initialization on plan activation
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { upsertSubscription } from "@/data/subscriptions";
import { getStripeClient } from "@/lib/clients/stripe";
import { logInfo, logError } from "@/lib/log";
import { getCorsHeaders } from "@/lib/cors";
import { initializeCreditsForPlan, getPlanCredits } from "@/lib/billing/credits";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 200, headers: getCorsHeaders(req) });
}

export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  
  try {
    const user = await getUser();
    const body = await req.json();
    const { sessionId, plan } = body;

    if (!sessionId && !plan) {
      return NextResponse.json({ error: "sessionId or plan required" }, { status: 400, headers: corsHeaders });
    }

    let finalPlan = plan;
    let stripeCustomerId: string | undefined;
    let stripeSubscriptionId: string | undefined;

    // If sessionId provided, verify with Stripe
    if (sessionId) {
      const stripe = getStripeClient();
      if (stripe) {
        try {
          const session = await stripe.checkout.sessions.retrieve(sessionId);
          
          if (session.payment_status !== 'paid' && session.payment_status !== 'no_payment_required') {
            return NextResponse.json({ error: "Payment not completed" }, { status: 400, headers: corsHeaders });
          }
          
          // Get plan from session metadata
          finalPlan = session.metadata?.plan || plan || 'starter';
          stripeCustomerId = session.customer as string;
          stripeSubscriptionId = session.subscription as string;
          
          logInfo('Verified Stripe session', { sessionId, plan: finalPlan, customerId: stripeCustomerId });
        } catch (stripeError: any) {
          logError('Failed to verify Stripe session', stripeError);
          // Continue with manual plan activation if Stripe verification fails
        }
      }
    }

    // Activate the plan
    const subscription = upsertSubscription({
      userId: user.id,
      plan: finalPlan,
      status: 'active',
      stripeCustomerId,
      stripeSubscriptionId,
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    });

    // Initialize credits for the new plan
    const creditsResult = await initializeCreditsForPlan(user.id, finalPlan, user.email);
    const planCredits = getPlanCredits(finalPlan);

    logInfo('Plan activated with credits', { 
      userId: user.id, 
      plan: finalPlan, 
      subscriptionId: subscription.id,
      credits: creditsResult.credits,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully upgraded to ${finalPlan} plan! You now have ${planCredits} credits.`,
      subscription: {
        id: subscription.id,
        plan: subscription.plan,
        status: subscription.status,
      },
      credits: creditsResult.credits,
    }, { headers: corsHeaders });

  } catch (error: any) {
    logError('Failed to activate plan', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: "Authentication required" }, { status: 401, headers: corsHeaders });
    }
    
    return NextResponse.json({ error: error.message || "Failed to activate plan" }, { status: 500, headers: corsHeaders });
  }
}

// GET endpoint to check current plan
export async function GET(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  
  try {
    const user = await getUser();
    const { getSubscriptionByUserId } = await import("@/data/subscriptions");
    const subscription = getSubscriptionByUserId(user.id);

    return NextResponse.json({
      plan: subscription?.plan || 'free',
      status: subscription?.status || 'none',
      currentPeriodEnd: subscription?.currentPeriodEnd,
    }, { headers: corsHeaders });

  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return NextResponse.json({ plan: 'free', status: 'none' }, { headers: corsHeaders });
    }
    return NextResponse.json({ plan: 'free', status: 'none' }, { headers: corsHeaders });
  }
}

