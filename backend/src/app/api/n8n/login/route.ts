// CHANGELOG: 2025-01-26 - Add automatic n8n login endpoint
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { loginN8nUser } from "@/lib/n8n/users";
import { decrypt } from "@/lib/crypto";
import { prisma } from "@/lib/db";
import { logInfo, logError } from "@/lib/log";

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
 * Generate a login session for n8n and redirect user to n8n with session cookie
 * This allows users to automatically log into n8n from Avallon
 * 
 * Query params:
 * - workflowId: Optional n8n workflow ID to redirect to after login
 * 
 * Note: Due to CORS and cookie restrictions, we need to use a proxy approach.
 * The frontend will call this endpoint, which will redirect to n8n with proper cookies.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const workflowId = searchParams.get('workflowId');
  try {
    const user = await getUser();
    
    if (!user.email) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Find user in database to get encrypted password
    let dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser && user.clerkId) {
      // Try finding by clerkId as fallback
      dbUser = await prisma.user.findUnique({
        where: { clerkId: user.clerkId },
      });
    }

    if (!dbUser || !dbUser.n8nPassword) {
      return NextResponse.json(
        { error: "n8n account not found. Please complete onboarding first." },
        { status: 404, headers: corsHeaders }
      );
    }

    // Decrypt password and login to n8n
    const password = decrypt(dbUser.n8nPassword);
    const n8nBaseUrl = (process.env.N8N_BASE_URL || 'https://agents.avallon.ca').replace(/\/$/, '');
    
    try {
      const { sessionCookie } = await loginN8nUser(dbUser.email, password);
      
      logInfo('n8n login session generated', { email: dbUser.email });
      
      // Parse the session cookie to extract domain, path, etc.
      const cookieParts = sessionCookie.split(';').map(p => p.trim());
      const [nameValue] = cookieParts;
      const [cookieName, cookieValue] = nameValue.split('=');
      
      // Extract cookie attributes
      const cookieAttrs: Record<string, string> = {};
      cookieParts.slice(1).forEach(attr => {
        const [key, value] = attr.split('=');
        cookieAttrs[key.toLowerCase()] = value || 'true';
      });
      
      // Build redirect URL - redirect to workflow if provided, otherwise to workflow list
      const redirectUrl = workflowId 
        ? `${n8nBaseUrl}/workflow/${workflowId}`
        : `${n8nBaseUrl}/workflow`;
      
      // Note: We can't set cross-domain cookies from JavaScript or server redirects
      // The session cookie needs to be set by n8n itself. 
      // We'll redirect to n8n login page with email pre-filled, and user can use password reset
      // OR we can try to use n8n's API to create a password reset link
      
      // For now, redirect to n8n login page
      // The user will need to use "Forgot Password" to reset their password
      // TODO: Implement password reset via n8n API
      const loginUrl = `${n8nBaseUrl}/login`;
      
      return NextResponse.redirect(loginUrl, { status: 302 });
    } catch (loginError: unknown) {
      logError('Failed to login to n8n', loginError, { email: dbUser.email });
      return NextResponse.json(
        { error: "Failed to login to n8n. Please try again later." },
        { status: 500, headers: corsHeaders }
      );
    }
  } catch (error: unknown) {
    logError('n8n login endpoint failed', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401, headers: corsHeaders }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}

/**
 * POST endpoint that returns session info for frontend to handle redirect
 * This is needed for cross-domain cookie scenarios
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    
    if (!user.email) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Find user in database to get encrypted password
    let dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser && user.clerkId) {
      dbUser = await prisma.user.findUnique({
        where: { clerkId: user.clerkId },
      });
    }

    if (!dbUser || !dbUser.n8nPassword) {
      return NextResponse.json(
        { error: "n8n account not found. Please complete onboarding first." },
        { status: 404, headers: corsHeaders }
      );
    }

    // Decrypt password and login to n8n
    const password = decrypt(dbUser.n8nPassword);
    const n8nBaseUrl = (process.env.N8N_BASE_URL || 'https://agents.avallon.ca').replace(/\/$/, '');
    
    try {
      const { sessionCookie } = await loginN8nUser(dbUser.email, password);
      
      logInfo('n8n login session generated', { email: dbUser.email });
      
      // Return session info for frontend to handle
      return NextResponse.json({
        success: true,
        n8nUrl: n8nBaseUrl,
        sessionCookie: sessionCookie,
        redirectUrl: `${n8nBaseUrl}/workflow`,
      }, { headers: corsHeaders });
    } catch (loginError: unknown) {
      logError('Failed to login to n8n', loginError, { email: dbUser.email });
      return NextResponse.json(
        { error: "Failed to login to n8n. Please try again later." },
        { status: 500, headers: corsHeaders }
      );
    }
  } catch (error: unknown) {
    logError('n8n login endpoint failed', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401, headers: corsHeaders }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}

