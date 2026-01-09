import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { getUserPlan } from "@/lib/billing/limits";
import { getSubscriptionByUserId } from "@/data/subscriptions";
import { getCorsHeaders } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(req),
  });
}

export async function GET(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ plan: 'free' }, {
        headers: corsHeaders,
      });
    }

    // Get user's subscription plan from file-based storage
    const subscription = getSubscriptionByUserId(user.id);

    const plan = subscription?.plan || 'free';

    return NextResponse.json({ 
      plan,
      status: subscription?.status || 'none',
      currentPeriodEnd: subscription?.currentPeriodEnd || null,
    }, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Error fetching plan:', error);
    return NextResponse.json({ plan: 'free' }, {
      headers: corsHeaders,
    });
  }
}



