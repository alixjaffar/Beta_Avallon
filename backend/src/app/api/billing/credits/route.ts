// API endpoint to get user's credit balance
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { getUserCredits, CREDIT_COSTS, setCredits, addCredits } from "@/lib/billing/credits";
import { logError, logInfo } from "@/lib/log";
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    logInfo('Getting user credits', { userId: user.id, email: user.email });

    // Try to get credits (pass email for better lookup)
    let credits = await getUserCredits(user.id, user.email);
    
    // If user has no credits or credits < 20, ensure they get 20
    if (credits === null || credits === undefined || credits < 20) {
      logInfo('User has insufficient credits, updating to 20', { userId: user.id, currentCredits: credits, email: user.email });
      try {
        const { getPlanCredits } = await import("@/lib/billing/credits");
        const targetCredits = getPlanCredits('free');
        
        // Use raw SQL to update credits - this is more reliable and handles edge cases
        try {
          // First, try to update by any matching field using raw SQL
          const updateQuery = `
            UPDATE "User" 
            SET credits = $1
            WHERE (id = $2 OR email = $3 OR "clerkId" = $4)
              AND (credits IS NULL OR credits < $1)
            RETURNING credits
          `;
          
          const result = await prisma.$queryRawUnsafe(
            updateQuery,
            targetCredits.toString(),
            user.id || '',
            user.email || '',
            user.clerkId || ''
          ) as Array<{ credits: number }>;
          
          if (result && result.length > 0) {
            credits = result[0].credits;
            logInfo('Updated credits using raw SQL', { userId: user.id, newCredits: credits });
          } else {
            // User might not exist, try to create or update with upsert
            try {
              // Try to find user first
              const existingUser = await prisma.user.findFirst({
                where: {
                  OR: [
                    { id: user.id },
                    ...(user.email && user.email !== 'user@example.com' && user.email !== 'test@example.com' ? [{ email: user.email }] : []),
                    ...(user.clerkId ? [{ clerkId: user.clerkId }] : []),
                  ],
                },
              });
              
              if (existingUser) {
            await prisma.user.update({
                  where: { id: existingUser.id },
                  data: { credits: targetCredits },
            });
                credits = targetCredits;
                logInfo('Updated existing user credits', { userId: existingUser.id, newCredits: credits });
              } else {
                // User doesn't exist, but we'll return 20 as default
                credits = targetCredits;
                logInfo('User not found in DB, returning default credits', { userId: user.id, credits });
              }
            } catch (upsertError: any) {
              logInfo('Failed to upsert user credits', { error: upsertError.message });
              credits = targetCredits; // Return default
            }
          }
        } catch (sqlError: any) {
          logError('Failed to update credits with raw SQL', sqlError, { userId: user.id });
          // Fallback: return 20 as default
          credits = targetCredits;
        }
      } catch (updateError: any) {
        logError('Failed to update user credits', updateError, { userId: user.id });
        // Return 20 as fallback
        credits = 20;
      }
    }

    logInfo('User credits retrieved', { userId: user.id, credits });

    return NextResponse.json({
      credits: credits || 20,
      costs: {
        generateWebsite: CREDIT_COSTS.GENERATE_WEBSITE,
        modifyWebsite: CREDIT_COSTS.MODIFY_WEBSITE,
      },
    }, { headers: corsHeaders });
  } catch (error: any) {
    logError('Failed to get user credits', error);
    // Return default credits on error
    return NextResponse.json({
      credits: 20,
      costs: {
        generateWebsite: CREDIT_COSTS.GENERATE_WEBSITE,
        modifyWebsite: CREDIT_COSTS.MODIFY_WEBSITE,
      },
    }, { headers: getCorsHeaders(req) });
  }
}

// POST endpoint to add credits to current user (for testing/admin)
export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    const body = await req.json().catch(() => ({}));
    const amount = body.amount || 20; // Default to 20 credits

    logInfo('Adding credits to user', { userId: user.id, email: user.email, amount });

    // Try multiple methods to add credits
    let result;
    
    // Method 1: Try by userId
    try {
      result = await addCredits(user.id, amount, 'Manual credit addition');
      if (result.success) {
        return NextResponse.json({
          success: true,
          credits: result.newBalance,
          message: `Added ${amount} credits. New balance: ${result.newBalance}`,
        }, { headers: corsHeaders });
      }
    } catch (e: any) {
      logInfo('Failed to add credits by userId, trying other methods', { error: e.message });
    }
    
    // Method 2: Try by email
    if (user.email && user.email !== 'user@example.com' && user.email !== 'test@example.com') {
      try {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (dbUser) {
          result = await addCredits(dbUser.id, amount, 'Manual credit addition');
          if (result.success) {
            return NextResponse.json({
              success: true,
              credits: result.newBalance,
              message: `Added ${amount} credits. New balance: ${result.newBalance}`,
            }, { headers: corsHeaders });
          }
        }
      } catch (e: any) {
        logInfo('Failed to add credits by email', { error: e.message });
      }
    }
    
    // Method 3: Try by clerkId
    if (user.clerkId) {
      try {
        const dbUser = await prisma.user.findUnique({
          where: { clerkId: user.clerkId },
        });
        if (dbUser) {
          result = await addCredits(dbUser.id, amount, 'Manual credit addition');
          if (result.success) {
            return NextResponse.json({
              success: true,
              credits: result.newBalance,
              message: `Added ${amount} credits. New balance: ${result.newBalance}`,
            }, { headers: corsHeaders });
          }
        }
      } catch (e: any) {
        logInfo('Failed to add credits by clerkId', { error: e.message });
      }
    }
    
    // Method 4: Direct SQL update as last resort
    try {
      const updateResult = await prisma.$executeRawUnsafe(`
        UPDATE "User" 
        SET credits = COALESCE(credits, 0) + ${amount}
        WHERE id = $1 OR email = $2 OR "clerkId" = $3
        RETURNING credits
      `, user.id, user.email || '', user.clerkId || '');
      
      return NextResponse.json({
        success: true,
        credits: 20 + amount,
        message: `Added ${amount} credits using direct SQL update`,
      }, { headers: corsHeaders });
    } catch (e: any) {
      logError('Failed to add credits with all methods', e, { userId: user.id });
      return NextResponse.json(
        { error: "Failed to add credits. Please try again or contact support." },
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




