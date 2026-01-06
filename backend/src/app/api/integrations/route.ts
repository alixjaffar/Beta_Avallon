// API endpoint for managing user integrations (Stripe, Twilio, etc.)
// Uses file-based storage to avoid database connection issues
import { NextRequest, NextResponse } from "next/server";
import { logError, logInfo } from "@/lib/log";
import { z } from "zod";
import { getUser } from "@/lib/auth/getUser";
import { getCorsHeaders } from "@/lib/cors";
import { 
  upsertIntegration, 
  getIntegrationsByUser, 
  deleteIntegration 
} from "@/data/integrations";

// Available integration providers (not exported from route - Next.js restriction)
const INTEGRATION_PROVIDERS = {
  stripe: {
    name: 'Stripe',
    description: 'Accept payments on your website',
    icon: '💳',
    requiredFields: ['secretKey', 'publishableKey'],
    optionalFields: ['webhookSecret'],
    docsUrl: 'https://stripe.com/docs/keys',
  },
  twilio: {
    name: 'Twilio',
    description: 'SMS and voice communications',
    icon: '📱',
    requiredFields: ['accountSid', 'authToken'],
    optionalFields: ['phoneNumber'],
    docsUrl: 'https://www.twilio.com/docs/usage/api',
  },
  sendgrid: {
    name: 'SendGrid',
    description: 'Email delivery service',
    icon: '📧',
    requiredFields: ['apiKey'],
    optionalFields: ['fromEmail', 'fromName'],
    docsUrl: 'https://docs.sendgrid.com/ui/account-and-settings/api-keys',
  },
  openai: {
    name: 'OpenAI',
    description: 'AI-powered features for your website',
    icon: '🤖',
    requiredFields: ['apiKey'],
    optionalFields: [],
    docsUrl: 'https://platform.openai.com/api-keys',
  },
  google_analytics: {
    name: 'Google Analytics',
    description: 'Website analytics and tracking',
    icon: '📊',
    requiredFields: ['measurementId'],
    optionalFields: [],
    docsUrl: 'https://support.google.com/analytics/answer/9539598',
  },
} as const;

export type IntegrationProvider = keyof typeof INTEGRATION_PROVIDERS;

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 200, headers: getCorsHeaders(req) });
}

// GET - List user's integrations
export async function GET(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    // Get user's integrations from file storage
    const userIntegrations = await getIntegrationsByUser(user.id);
    
    // Map to response format (without credentials)
    const integrations = userIntegrations.map(i => ({
      id: i.id,
      provider: i.provider,
      status: i.status,
      metadata: i.metadata,
      connectedAt: i.connectedAt,
      lastUsedAt: i.lastUsedAt,
      lastError: i.lastError,
      providerInfo: INTEGRATION_PROVIDERS[i.provider as IntegrationProvider] || null,
    }));

    // Get available providers that aren't connected yet
    const connectedProviders = new Set(integrations.map(i => i.provider));
    const availableProviders = Object.entries(INTEGRATION_PROVIDERS)
      .filter(([key]) => !connectedProviders.has(key))
      .map(([key, info]) => ({
        provider: key,
        ...info,
        status: 'not_connected',
      }));

    return NextResponse.json({
      connected: integrations,
      available: availableProviders,
    }, { headers: corsHeaders });

  } catch (error: any) {
    logError('Failed to get integrations', error, { errorMessage: error.message });
    return NextResponse.json({ 
      error: "Internal server error",
      message: error.message 
    }, { status: 500, headers: corsHeaders });
  }
}

// POST - Connect a new integration
const ConnectIntegrationSchema = z.object({
  provider: z.string().min(1),
  credentials: z.record(z.string()),
  metadata: z.record(z.any()).optional(),
  skipValidation: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    const body = await req.json();
    const { provider, credentials, metadata, skipValidation } = ConnectIntegrationSchema.parse(body);

    // Validate provider exists
    if (!INTEGRATION_PROVIDERS[provider as IntegrationProvider]) {
      return NextResponse.json({ error: "Invalid provider" }, { status: 400, headers: corsHeaders });
    }

    const providerInfo = INTEGRATION_PROVIDERS[provider as IntegrationProvider];

    // Validate required fields
    for (const field of providerInfo.requiredFields) {
      if (!credentials[field]) {
        return NextResponse.json({ 
          error: `Missing required field: ${field}` 
        }, { status: 400, headers: corsHeaders });
      }
    }

    // Validate credentials with the provider (unless skipValidation is true)
    let validationResult: { valid: boolean; error?: string; accountName?: string; accountEmail?: string } = { valid: true };
    if (!skipValidation) {
      validationResult = await validateCredentials(provider, credentials);
      if (!validationResult.valid) {
        return NextResponse.json({ 
          error: validationResult.error || "Invalid credentials",
          hint: "If you're using a restricted API key, try enabling 'Skip validation' checkbox."
        }, { status: 400, headers: corsHeaders });
      }
    } else {
      logInfo('Skipping credential validation per user request', { provider, userId: user.id });
    }

    // Store integration using file-based storage
    const integration = await upsertIntegration({
      userId: user.id,
      provider,
      credentials,
      metadata: {
        ...metadata,
        accountName: validationResult.accountName,
        accountEmail: validationResult.accountEmail,
      },
    });

    logInfo('Integration connected', { 
      userId: user.id, 
      provider, 
      integrationId: integration.id 
    });

    return NextResponse.json({
      success: true,
      message: `${providerInfo.name} connected successfully`,
      integration: {
        id: integration.id,
        provider: integration.provider,
        status: integration.status,
        metadata: integration.metadata,
        connectedAt: integration.connectedAt,
      },
    }, { headers: corsHeaders });

  } catch (error: any) {
    logError('Failed to connect integration', error, { message: error.message });
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400, headers: corsHeaders });
    }
    return NextResponse.json({ error: "Internal server error", message: error.message }, { status: 500, headers: corsHeaders });
  }
}

// DELETE - Disconnect an integration
export async function DELETE(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    const { searchParams } = new URL(req.url);
    const provider = searchParams.get('provider');

    if (!provider) {
      return NextResponse.json({ error: "Provider is required" }, { status: 400, headers: corsHeaders });
    }

    // Delete using file-based storage
    await deleteIntegration(user.id, provider);

    logInfo('Integration disconnected', { userId: user.id, provider });

    return NextResponse.json({
      success: true,
      message: `Integration disconnected`,
    }, { headers: corsHeaders });

  } catch (error: any) {
    logError('Failed to disconnect integration', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders });
  }
}

// Validate credentials with the provider's API
async function validateCredentials(provider: string, credentials: Record<string, string>): Promise<{
  valid: boolean;
  error?: string;
  accountName?: string;
  accountEmail?: string;
}> {
  try {
    switch (provider) {
      case 'stripe': {
        const secretKey = credentials.secretKey;
        const publishableKey = credentials.publishableKey;
        
        // Check if keys look valid (format check)
        if (!secretKey || (!secretKey.startsWith('sk_live_') && !secretKey.startsWith('sk_test_') && !secretKey.startsWith('rk_live_') && !secretKey.startsWith('rk_test_'))) {
          return { valid: false, error: 'Invalid Stripe secret key format. It should start with sk_live_, sk_test_, rk_live_, or rk_test_' };
        }
        
        if (!publishableKey || (!publishableKey.startsWith('pk_live_') && !publishableKey.startsWith('pk_test_'))) {
          return { valid: false, error: 'Invalid Stripe publishable key format. It should start with pk_live_ or pk_test_' };
        }
        
        // Try to validate with Stripe API
        try {
          const response = await fetch('https://api.stripe.com/v1/account', {
            headers: { 'Authorization': `Bearer ${secretKey}` },
          });
          
          if (response.ok) {
            const account = await response.json();
            return {
              valid: true,
              accountName: account.business_profile?.name || account.settings?.dashboard?.display_name,
              accountEmail: account.email,
            };
          }
          
          // Try balance endpoint for restricted keys
          const balanceResponse = await fetch('https://api.stripe.com/v1/balance', {
            headers: { 'Authorization': `Bearer ${secretKey}` },
          });
          
          if (balanceResponse.ok) {
            return { valid: true };
          }
          
          const errorData = await response.json().catch(() => ({}));
          return { valid: false, error: errorData?.error?.message || 'Invalid Stripe API key. Please verify in your Stripe Dashboard.' };
          
        } catch (networkError: any) {
          logInfo('Stripe validation network error, accepting key based on format', { error: networkError.message });
          return { valid: true };
        }
      }

      case 'twilio': {
        const auth = Buffer.from(`${credentials.accountSid}:${credentials.authToken}`).toString('base64');
        const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${credentials.accountSid}.json`, {
          headers: { 'Authorization': `Basic ${auth}` },
        });
        
        if (!response.ok) {
          return { valid: false, error: 'Invalid Twilio credentials' };
        }
        
        const account = await response.json();
        return { valid: true, accountName: account.friendly_name };
      }

      case 'sendgrid': {
        const response = await fetch('https://api.sendgrid.com/v3/user/profile', {
          headers: { 'Authorization': `Bearer ${credentials.apiKey}` },
        });
        
        if (!response.ok) {
          return { valid: false, error: 'Invalid SendGrid API key' };
        }
        
        return { valid: true };
      }

      case 'google_analytics': {
        if (!/^G-[A-Z0-9]+$/.test(credentials.measurementId)) {
          return { valid: false, error: 'Invalid Google Analytics Measurement ID format (should be G-XXXXXXXXXX)' };
        }
        return { valid: true };
      }

      case 'openai': {
        if (!credentials.apiKey?.startsWith('sk-')) {
          return { valid: false, error: 'Invalid OpenAI API key format (should start with sk-)' };
        }
        // Skip API validation for OpenAI to avoid using credits
        return { valid: true };
      }

      default:
        return { valid: true };
    }
  } catch (error: any) {
    logError('Credential validation failed', error, { provider });
    return { valid: false, error: 'Failed to validate credentials. Please check your keys.' };
  }
}


