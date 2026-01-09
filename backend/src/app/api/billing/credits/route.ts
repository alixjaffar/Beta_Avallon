// API endpoint to get user's credit balance (file-based)
// CHANGELOG: 2025-01-07 - Updated to use file-based credits storage
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { getUserCredits, CREDIT_COSTS, addCredits, ensureUserHasCredits, PLAN_CREDITS } from "@/lib/billing/credits";
import { logError, logInfo } from "@/lib/log";
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
      return NextResponse.json({ 
        credits: PLAN_CREDITS.free,
        costs: {
          generateWebsite: CREDIT_COSTS.GENERATE_WEBSITE,
          modifyWebsite: CREDIT_COSTS.MODIFY_WEBSITE,
          per1kTokens: CREDIT_COSTS.PER_1K_TOKENS,
        },
      }, { headers: corsHeaders });
    }

    // Ensure user has credits initialized
    await ensureUserHasCredits(user.id, user.email || '');
    
    // Get current credits
    const credits = await getUserCredits(user.id, user.email);

    logInfo('User credits retrieved', { userId: user.id, credits });

    return NextResponse.json({
      credits: credits,
      costs: {
        generateWebsite: CREDIT_COSTS.GENERATE_WEBSITE,
        modifyWebsite: CREDIT_COSTS.MODIFY_WEBSITE,
        per1kTokens: CREDIT_COSTS.PER_1K_TOKENS,
      },
    }, { headers: corsHeaders });
  } catch (error: any) {
    logError('Failed to get user credits', error);
    return NextResponse.json({
      credits: PLAN_CREDITS.free,
      costs: {
        generateWebsite: CREDIT_COSTS.GENERATE_WEBSITE,
        modifyWebsite: CREDIT_COSTS.MODIFY_WEBSITE,
        per1kTokens: CREDIT_COSTS.PER_1K_TOKENS,
      },
    }, { headers: getCorsHeaders(req) });
  }
}

// POST endpoint to add credits (for testing/admin)
export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    const body = await req.json().catch(() => ({}));
    const amount = body.amount || 20;

    logInfo('Adding credits to user', { userId: user.id, email: user.email, amount });

    const result = await addCredits(user.id, amount, 'Manual credit addition', user.email);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        credits: result.newBalance,
        message: `Added ${amount} credits. New balance: ${result.newBalance}`,
      }, { headers: corsHeaders });
    } else {
      return NextResponse.json(
        { error: "Failed to add credits" },
        { status: 500, headers: corsHeaders }
      );
    }
  } catch (error: any) {
    logError('Failed to add credits', error);
    return NextResponse.json(
      { error: error.message || "Failed to add credits" },
      { status: 500, headers: getCorsHeaders(req) }
    );
  }
}
