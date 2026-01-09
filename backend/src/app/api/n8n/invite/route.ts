// CHANGELOG: 2025-01-07 - Direct n8n invitation endpoint - uses n8n's native invite system
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { logError, logInfo } from "@/lib/log";
import axios from 'axios';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-email',
};

const N8N = (process.env.N8N_BASE_URL || '').trim().replace(/\/$/, '');
const N8N_KEY = (process.env.N8N_API_KEY || '').trim().replace(/^["']|["']$/g, '');

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

/**
 * Send n8n invitation to user using n8n's native invitation system
 * User will receive an email from n8n to set up their own password
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    
    if (!user.email || user.email === 'test@example.com') {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400, headers: corsHeaders }
      );
    }

    logInfo('n8n invite requested', { email: user.email });

    // Check if n8n is configured
    if (!N8N || !N8N_KEY) {
      return NextResponse.json(
        { error: "n8n is not configured. Please contact support." },
        { status: 500, headers: corsHeaders }
      );
    }

    // Step 1: Check if user already exists in n8n
    let existingUser = null;
    try {
      const usersResponse = await axios.get(`${N8N}/api/v1/users`, {
        headers: { 'X-N8N-API-KEY': N8N_KEY },
        timeout: 10000,
      });
      
      const users = usersResponse.data?.data || usersResponse.data || [];
      existingUser = users.find((u: any) => u.email === user.email);
      
      if (existingUser && !existingUser.isPending) {
        logInfo('User already exists and is active in n8n', { email: user.email });
        return NextResponse.json({
          success: true,
          message: "You already have an n8n account. Click the button to log in.",
          n8nUrl: N8N,
          email: user.email,
          alreadyActive: true,
        }, { headers: corsHeaders });
      }
      
      if (existingUser && existingUser.isPending) {
        logInfo('User exists but is pending, will resend invitation', { email: user.email });
      }
    } catch (error: any) {
      logError('Error checking existing n8n users', error);
    }

    // Step 2: Send invitation using n8n's invite API
    try {
      logInfo('Sending n8n invitation', { email: user.email });
      
      // Use n8n's invitation endpoint - this sends the email automatically
      const inviteResponse = await axios.post(
        `${N8N}/api/v1/invitations`,
        [{
          email: user.email,
          role: 'global:member',
        }],
        {
          headers: {
            'X-N8N-API-KEY': N8N_KEY,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        }
      );

      const result = Array.isArray(inviteResponse.data) ? inviteResponse.data[0] : inviteResponse.data;
      
      logInfo('n8n invitation sent', { 
        email: user.email, 
        response: result,
      });
      
      return NextResponse.json({
        success: true,
        message: "Invitation sent! Check your email to set up your n8n account.",
        n8nUrl: N8N,
        email: user.email,
        isNewUser: true,
      }, { headers: corsHeaders });
      
    } catch (inviteError: any) {
      logError('Failed to send n8n invitation', inviteError, {
        status: inviteError.response?.status,
        data: inviteError.response?.data,
      });
      
      // If invitation fails (user might already exist), try alternative methods
      const errorMessage = inviteError.response?.data?.message || inviteError.message;
      
      // Check if error is because user already exists
      if (errorMessage?.includes('already') || inviteError.response?.status === 409) {
        // User exists - if they're pending, try to resend invitation
        if (existingUser?.isPending && existingUser?.id) {
          try {
            // Try to reinvite the user
            await axios.post(
              `${N8N}/api/v1/invitations/${existingUser.id}/resend`,
              {},
              {
                headers: {
                  'X-N8N-API-KEY': N8N_KEY,
                  'Content-Type': 'application/json',
                },
                timeout: 10000,
              }
            );
            
            logInfo('Resent n8n invitation', { email: user.email, userId: existingUser.id });
            
            return NextResponse.json({
              success: true,
              message: "Invitation resent! Check your email to set up your n8n account.",
              n8nUrl: N8N,
              email: user.email,
            }, { headers: corsHeaders });
          } catch (resendError: any) {
            logError('Failed to resend invitation', resendError);
          }
        }
        
        // User exists and is active, or resend failed
        return NextResponse.json({
          success: true,
          message: "You may already have an n8n account. Try logging in or use 'Forgot Password' to reset.",
          n8nUrl: N8N,
          email: user.email,
          alreadyExists: true,
        }, { headers: corsHeaders });
      }
      
      return NextResponse.json(
        { error: `Failed to send invitation: ${errorMessage}` },
        { status: 500, headers: corsHeaders }
      );
    }

  } catch (error: any) {
    logError('n8n invite failed', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401, headers: corsHeaders }
      );
    }
    
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}

