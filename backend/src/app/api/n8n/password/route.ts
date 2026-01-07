// CHANGELOG: 2025-01-26 - Add endpoint to retrieve n8n password for user
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { decrypt } from "@/lib/crypto";
import { prisma } from "@/lib/db";
import { logError, logInfo } from "@/lib/log";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-email',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

/**
 * Get user's n8n password (decrypted)
 * This allows users to see their password to log into n8n manually
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    
    logInfo('Password endpoint called', { email: user.email, userId: user.id });
    
    if (!user.email || user.email === 'test@example.com' || user.email === 'user@example.com') {
      return NextResponse.json(
        { error: `User email not found. Current email: ${user.email}. Please make sure you're logged in.` },
        { status: 400, headers: corsHeaders }
      );
    }

    // Find user in database to get encrypted password
    // Use raw SQL query to avoid Prisma schema validation issues
    let dbUser: any = null;
    
    // Always use raw SQL first to avoid Prisma schema issues
    try {
      const result = await prisma.$queryRaw`
        SELECT id, email, "n8nPassword", "n8nUserId" FROM "User" WHERE email = ${user.email} LIMIT 1
      `;
      if (Array.isArray(result) && result.length > 0) {
        dbUser = result[0];
        logInfo('User found via raw SQL', { email: dbUser.email, hasPassword: !!dbUser.n8nPassword });
      }
    } catch (rawError: any) {
      logError('Error with raw SQL query', rawError, { email: user.email });
      
      // Fallback to Prisma query
      try {
        dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (dbUser) {
          logInfo('User found via Prisma', { email: dbUser.email });
        }
      } catch (prismaError: any) {
        logError('Error finding user by email (Prisma)', prismaError, { email: user.email });
      }
    }

    if (!dbUser) {
      // Try to trigger onboarding automatically
      logInfo('User not found, attempting to trigger onboarding', { email: user.email });
      
      try {
        // Call onboarding endpoint to create user and n8n account
        const onboardResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/users/onboard`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-email': user.email,
          },
          body: JSON.stringify({ email: user.email }),
        });
        
        const onboardData = await onboardResponse.json();
        logInfo('Onboarding response', { 
          email: user.email, 
          hasN8nAccount: !!onboardData.n8nAccount,
          hasPassword: !!onboardData.n8nPassword,
          warning: onboardData.warning
        });
        
        if (onboardResponse.ok && onboardData.n8nAccount) {
          // Check if password was returned (DB storage failed)
          if (onboardData.n8nPassword) {
            // Password is in response - DB storage failed but we have the password
            logInfo('Returning password from onboarding response', { email: user.email });
            return NextResponse.json({
              success: true,
              email: onboardData.n8nAccount.email || user.email,
              password: onboardData.n8nPassword,
              n8nUrl: process.env.N8N_BASE_URL || 'https://agents.avallon.ca',
              warning: onboardData.warning || 'Database storage failed - please save this password',
            }, { headers: corsHeaders });
          }
          
          // Try to find user again after onboarding
          try {
            const result = await prisma.$queryRaw`
              SELECT id, email, "n8nPassword", "n8nUserId" FROM "User" WHERE email = ${user.email} LIMIT 1
            `;
            if (Array.isArray(result) && result.length > 0 && result[0].n8nPassword) {
              dbUser = result[0];
              logInfo('User found after onboarding', { email: dbUser.email });
            } else {
              // User record still missing - but we should have gotten password from onboarding response
              // If we reach here, something went wrong
              logError('CRITICAL: n8n account created but User record missing and no password in response', new Error('User record not found'), { 
                email: user.email,
                n8nAccountId: onboardData.n8nAccount.id,
                hasPasswordInResponse: !!onboardData.n8nPassword
              });
              return NextResponse.json(
                { 
                  error: `n8n account was created but database record is missing. Please contact support. Email: ${user.email}`,
                  n8nAccountId: onboardData.n8nAccount.id
                },
                { status: 500, headers: corsHeaders }
              );
            }
          } catch (findError: any) {
            logError('Error finding user after onboarding', findError, { email: user.email });
            // If we have password in response, return it
            if (onboardData.n8nPassword) {
              return NextResponse.json({
                success: true,
                email: onboardData.n8nAccount.email || user.email,
                password: onboardData.n8nPassword,
                n8nUrl: process.env.N8N_BASE_URL || 'https://agents.avallon.ca',
                warning: 'Database lookup failed but password retrieved from onboarding',
              }, { headers: corsHeaders });
            }
          }
        }
      } catch (onboardError: any) {
        logError('Failed to trigger onboarding', onboardError, { email: user.email });
      }
      
      if (!dbUser) {
        return NextResponse.json(
          { error: `User not found in database. Email: ${user.email}. Please complete signup/onboarding first. You may need to sign up again or contact support.` },
          { status: 404, headers: corsHeaders }
        );
      }
    }

    if (!dbUser.n8nPassword) {
      return NextResponse.json(
        { error: `n8n account not found for user ${dbUser.email}. Please complete onboarding to create your n8n account.` },
        { status: 404, headers: corsHeaders }
      );
    }

    // Decrypt password
    let password: string;
    try {
      password = decrypt(dbUser.n8nPassword);
    } catch (decryptError: unknown) {
      logError('Failed to decrypt password', decryptError, { email: dbUser.email });
      return NextResponse.json(
        { error: "Failed to decrypt password. Encryption key may have changed." },
        { status: 500, headers: corsHeaders }
      );
    }
    
    // Check if n8n account is pending (requires activation)
    let isPending = false;
    if (dbUser.n8nUserId) {
      try {
        const n8nUserCheck = await fetch(`${process.env.N8N_BASE_URL}/api/v1/users`, {
          headers: {
            'X-N8N-API-KEY': process.env.N8N_API_KEY || '',
          },
        });
        if (n8nUserCheck.ok) {
          const n8nUsers = await n8nUserCheck.json();
          const n8nUser = n8nUsers.data?.find((u: any) => u.email === dbUser.email || u.id === dbUser.n8nUserId);
          if (n8nUser?.isPending) {
            isPending = true;
          }
        }
      } catch (e) {
        // Ignore - can't check status
      }
    }
    
    return NextResponse.json({
      success: true,
      email: dbUser.email,
      password: password,
      n8nUrl: process.env.N8N_BASE_URL || 'https://agents.avallon.ca',
      isPending: isPending,
      activationRequired: isPending,
      activationInstructions: isPending ? `Your n8n account is pending activation. Please:\n1. Log into n8n admin UI: ${process.env.N8N_BASE_URL}\n2. Go to Settings → Users\n3. Find ${dbUser.email} and click "Activate"\n\nOR use "Forgot Password" on the login page to activate automatically.` : undefined,
    }, { headers: corsHeaders });
  } catch (error: unknown) {
    logError('Failed to get n8n password', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage === 'Authentication required') {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401, headers: corsHeaders }
      );
    }
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500, headers: corsHeaders }
    );
  }
}

