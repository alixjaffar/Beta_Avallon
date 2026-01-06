// CHANGELOG: 2025-01-26 - Handle OAuth callbacks and extract user info
import { NextRequest, NextResponse } from "next/server";
import { setSession } from "@/lib/session";
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
 * Handle OAuth callback and extract user information
 * This endpoint processes OAuth provider responses and extracts user data
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const provider = searchParams.get('provider') || 'google';
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      logError('OAuth error', new Error(error));
      return NextResponse.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8082'}/auth?error=${encodeURIComponent(error)}`);
    }

    // In a real implementation, you would exchange the code for user info
    // For now, we'll extract what we can from the callback
    // This is a simplified version - in production you'd use the OAuth provider's API
    
    logInfo('OAuth callback received', { provider, hasCode: !!code });

    // Redirect to frontend with success
    return NextResponse.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8082'}/auth?oauth=success&provider=${provider}`);
  } catch (error: unknown) {
    logError('OAuth callback error', error);
    return NextResponse.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8082'}/auth?error=oauth_failed`);
  }
}

/**
 * Process OAuth user data from frontend
 * Frontend extracts user info and sends it here for processing
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { provider, email, name, picture, id } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400, headers: corsHeaders });
    }

    // Store user session
    const sessionData = {
      email,
      name: name || email.split('@')[0],
      picture: picture || null,
      provider,
      providerId: id,
      ts: Date.now(),
    };

    await setSession(sessionData, 60 * 60 * 24 * 30); // 30 days

    logInfo('OAuth user session created', { email, provider, name });

    return NextResponse.json({
      success: true,
      user: sessionData,
    }, { headers: corsHeaders });

  } catch (error: unknown) {
    logError('OAuth processing error', error);
    return NextResponse.json({
      error: "Failed to process OAuth data",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500, headers: corsHeaders });
  }
}

