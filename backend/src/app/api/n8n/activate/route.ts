// CHANGELOG: 2025-01-07 - Add endpoint to activate pending n8n users
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { decrypt } from "@/lib/crypto";
import { prisma } from "@/lib/db";
import { logError, logInfo } from "@/lib/log";
import axios from "axios";

const N8N = (process.env.N8N_BASE_URL || '').trim().replace(/\/$/, '');
const N8N_KEY = (process.env.N8N_API_KEY || '').trim().replace(/^["']|["']$/g, '');
const N8N_ADMIN_EMAIL = process.env.N8N_ADMIN_EMAIL || '';
const N8N_ADMIN_PASSWORD = process.env.N8N_ADMIN_PASSWORD || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-email',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

/**
 * Activate a pending n8n user account
 * This endpoint will try multiple methods to activate the user's n8n account
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    
    logInfo('Activate n8n account endpoint called', { email: user.email });
    
    if (!user.email) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Get user's n8n credentials from database
    let dbUser: any = null;
    try {
      const result = await prisma.$queryRaw`
        SELECT id, email, "n8nPassword", "n8nUserId" FROM "User" WHERE email = ${user.email} LIMIT 1
      `;
      if (Array.isArray(result) && result.length > 0) {
        dbUser = result[0];
      }
    } catch (e) {
      // Try Prisma fallback
      dbUser = await prisma.user.findUnique({ where: { email: user.email } });
    }

    if (!dbUser?.n8nPassword || !dbUser?.n8nUserId) {
      return NextResponse.json(
        { error: 'n8n account not found. Please create an agent first to set up your n8n account.' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Decrypt password
    let password: string;
    try {
      password = decrypt(dbUser.n8nPassword);
    } catch (e) {
      return NextResponse.json(
        { error: 'Failed to decrypt password' },
        { status: 500, headers: corsHeaders }
      );
    }

    const n8nUserId = dbUser.n8nUserId;
    let activated = false;
    let method = '';

    // Method 1: Try admin password change (most reliable)
    if (!activated && N8N_ADMIN_EMAIL && N8N_ADMIN_PASSWORD) {
      try {
        logInfo('Trying admin password change activation', { userId: n8nUserId });
        
        const loginResponse = await axios.post(
          `${N8N}/rest/login`,
          {
            emailOrLdapLoginId: N8N_ADMIN_EMAIL,
            password: N8N_ADMIN_PASSWORD,
          },
          { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
        );
        
        const sessionCookie = loginResponse.headers['set-cookie']?.[0];
        
        if (sessionCookie) {
          // Change password to activate user
          await axios.patch(
            `${N8N}/rest/users/${n8nUserId}/password`,
            { newPassword: password },
            {
              headers: {
                'Cookie': sessionCookie,
                'Content-Type': 'application/json',
              },
            }
          );
          
          activated = true;
          method = 'admin_password_change';
          logInfo('User activated via admin password change', { userId: n8nUserId, email: user.email });
        }
      } catch (e: any) {
        logInfo('Admin activation failed', { error: e.message });
      }
    }

    // Method 2: Try API patch to set isPending = false
    if (!activated && N8N_KEY) {
      try {
        logInfo('Trying API patch activation', { userId: n8nUserId });
        
        await axios.patch(
          `${N8N}/api/v1/users/${n8nUserId}`,
          { isPending: false },
          {
            headers: {
              'X-N8N-API-KEY': N8N_KEY,
              'Content-Type': 'application/json',
            },
          }
        );
        
        activated = true;
        method = 'api_patch';
        logInfo('User activated via API patch', { userId: n8nUserId, email: user.email });
      } catch (e: any) {
        logInfo('API patch activation failed', { error: e.message });
      }
    }

    // Method 3: Try to login directly (will fail if pending but worth trying)
    if (!activated) {
      try {
        const loginResponse = await axios.post(
          `${N8N}/rest/login`,
          {
            email: user.email,
            password: password,
          },
          { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
        );
        
        if (loginResponse.status === 200) {
          activated = true;
          method = 'direct_login';
          logInfo('User can log in directly (was already active)', { email: user.email });
        }
      } catch (e: any) {
        logInfo('Direct login check failed', { error: e.message });
      }
    }

    if (activated) {
      return NextResponse.json({
        success: true,
        message: `Account activated successfully via ${method}`,
        email: user.email,
        password: password,
        n8nUrl: N8N,
        loginUrl: `${N8N}/signin`,
      }, { headers: corsHeaders });
    } else {
      // Provide instructions for manual activation
      return NextResponse.json({
        success: false,
        message: 'Automatic activation failed. Please try the manual method.',
        email: user.email,
        password: password,
        n8nUrl: N8N,
        instructions: [
          `1. Go to ${N8N}/signin`,
          `2. Click "Forgot Password"`,
          `3. Enter your email: ${user.email}`,
          `4. Check your email for the reset link`,
          `5. Set a new password (or use: ${password})`,
          `6. This will activate your account`,
        ],
      }, { headers: corsHeaders });
    }
  } catch (error: any) {
    logError('Activate endpoint failed', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

