import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { getUserPlan } from "@/lib/billing/limits";
import { prisma } from "@/lib/db";
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

    // Get user's subscription plan
    const subscription = await prisma.subscription.findFirst({
      where: { userId: user.id },
    });

    const plan = subscription?.plan || 'free';

    return NextResponse.json({ 
      plan,
      status: subscription?.status || 'free',
      currentPeriodEnd: subscription?.currentPeriodEnd?.toISOString() || null,
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



