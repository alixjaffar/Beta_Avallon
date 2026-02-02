// Admin impersonation endpoint - allows admin to login as any user
import { NextRequest, NextResponse } from "next/server";
import { logError, logInfo } from "@/lib/log";
import { getCorsHeaders } from "@/lib/cors";

// Admin emails that can use impersonation
const ADMIN_EMAILS = [
  'alij123402@gmail.com',
];

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(request),
  });
}

export async function POST(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request);
  
  try {
    const body = await request.json();
    const { adminEmail, targetEmail } = body;
    
    if (!adminEmail || !targetEmail) {
      return NextResponse.json(
        { error: 'Admin email and target email are required' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Verify admin email is in the allowed list
    if (!ADMIN_EMAILS.includes(adminEmail.toLowerCase())) {
      logError('Unauthorized admin impersonation attempt', { adminEmail, targetEmail });
      return NextResponse.json(
        { error: 'Unauthorized. You do not have admin privileges.' },
        { status: 403, headers: corsHeaders }
      );
    }
    
    logInfo('Admin impersonation successful', { adminEmail, targetEmail });
    
    // Return success with the target user info
    // The frontend will create a session for the target user
    return NextResponse.json({
      success: true,
      user: {
        email: targetEmail,
        name: targetEmail.split('@')[0],
        isImpersonated: true,
        impersonatedBy: adminEmail,
      }
    }, { headers: corsHeaders });
    
  } catch (error) {
    logError('Admin impersonation error:', error);
    return NextResponse.json(
      { error: 'Failed to impersonate user' },
      { status: 500, headers: corsHeaders }
    );
  }
}
