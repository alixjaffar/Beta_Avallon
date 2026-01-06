// Integration utilities for website generation
import { db } from "@/lib/db";
import { decrypt } from "@/lib/crypto";
import { logInfo, logError } from "@/lib/log";

export interface StripeIntegration {
  secretKey: string;
  publishableKey: string;
  webhookSecret?: string;
  accountName?: string;
}

export interface TwilioIntegration {
  accountSid: string;
  authToken: string;
  phoneNumber?: string;
}

export interface GoogleAnalyticsIntegration {
  measurementId: string;
}

/**
 * Get user's integration credentials for a specific provider
 * Returns decrypted credentials or null if not connected
 */
export async function getUserIntegration(
  userId: string, 
  provider: string
): Promise<Record<string, string> | null> {
  try {
    const integration = await db.userIntegration.findUnique({
      where: {
        userId_provider: {
          userId,
          provider,
        },
      },
    });

    if (!integration || integration.status !== 'active') {
      return null;
    }

    // Decrypt credentials
    const encryptedData = (integration.credentials as any)?.encrypted;
    if (!encryptedData) {
      logError('Integration credentials missing', new Error('No encrypted data'), { userId, provider });
      return null;
    }

    const decrypted = decrypt(encryptedData);
    const credentials = JSON.parse(decrypted);

    // Update last used timestamp
    await db.userIntegration.update({
      where: { id: integration.id },
      data: { lastUsedAt: new Date() },
    });

    logInfo('Integration credentials retrieved', { userId, provider });
    return credentials;

  } catch (error: any) {
    logError('Failed to get integration', error, { userId, provider });
    return null;
  }
}

/**
 * Get user's Stripe integration
 */
export async function getUserStripeIntegration(userId: string): Promise<StripeIntegration | null> {
  const credentials = await getUserIntegration(userId, 'stripe');
  if (!credentials) return null;

  return {
    secretKey: credentials.secretKey,
    publishableKey: credentials.publishableKey,
    webhookSecret: credentials.webhookSecret,
  };
}

/**
 * Get user's Twilio integration
 */
export async function getUserTwilioIntegration(userId: string): Promise<TwilioIntegration | null> {
  const credentials = await getUserIntegration(userId, 'twilio');
  if (!credentials) return null;

  return {
    accountSid: credentials.accountSid,
    authToken: credentials.authToken,
    phoneNumber: credentials.phoneNumber,
  };
}

/**
 * Get user's Google Analytics integration
 */
export async function getUserGoogleAnalyticsIntegration(userId: string): Promise<GoogleAnalyticsIntegration | null> {
  const credentials = await getUserIntegration(userId, 'google_analytics');
  if (!credentials) return null;

  return {
    measurementId: credentials.measurementId,
  };
}

/**
 * Check if user has a specific integration connected
 */
export async function hasIntegration(userId: string, provider: string): Promise<boolean> {
  const integration = await db.userIntegration.findUnique({
    where: {
      userId_provider: {
        userId,
        provider,
      },
    },
    select: { status: true },
  });

  return integration?.status === 'active';
}

/**
 * Get all active integrations for a user
 */
export async function getUserActiveIntegrations(userId: string): Promise<string[]> {
  const integrations = await db.userIntegration.findMany({
    where: {
      userId,
      status: 'active',
    },
    select: { provider: true },
  });

  return integrations.map(i => i.provider);
}

/**
 * Generate Stripe integration code for website
 * Uses user's actual Stripe keys
 */
export function generateStripeIntegrationCode(stripeIntegration: StripeIntegration, priceId?: string): string {
  const { publishableKey } = stripeIntegration;
  
  return `
<!-- Stripe Integration -->
<script src="https://js.stripe.com/v3/"></script>
<script>
  // Initialize Stripe with your publishable key
  const stripe = Stripe('${publishableKey}');
  
  // Handle checkout
  async function handleStripeCheckout(priceId, mode = 'payment') {
    try {
      // Show loading state
      const button = event.target;
      const originalText = button.textContent;
      button.textContent = 'Processing...';
      button.disabled = true;
      
      // Determine API URL - use production for deployed sites, localhost for local dev
      let apiUrl = 'https://beta-avallon1.vercel.app/api/stripe/checkout';
      try {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          apiUrl = 'http://localhost:3000/api/stripe/checkout';
        }
      } catch (e) {}
      
      // Create checkout session via Avallon backend
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId: priceId,
          mode: mode,
          successUrl: window.location.href.split('?')[0] + '?payment=success',
          cancelUrl: window.location.href.split('?')[0] + '?payment=cancelled'
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        alert('Payment Error: ' + data.error);
        button.textContent = originalText;
        button.disabled = false;
        return;
      }
      
      // Redirect to Stripe Checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else if (data.url) {
        window.location.href = data.url;
      } else if (data.sessionId) {
        const result = await stripe.redirectToCheckout({ sessionId: data.sessionId });
        if (result.error) {
          alert(result.error.message);
        }
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Failed to start checkout. Please try again.');
    }
  }
  
  // Handle one-time payment
  function buyNow(priceId) {
    handleStripeCheckout(priceId, 'payment');
  }
  
  // Handle subscription
  function subscribe(priceId) {
    handleStripeCheckout(priceId, 'subscription');
  }
</script>

<style>
  .stripe-button {
    background: linear-gradient(135deg, #6366F1, #8B5CF6);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
  }
  .stripe-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
  }
  .stripe-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
</style>
`;
}

/**
 * Generate Google Analytics code for website
 */
export function generateGoogleAnalyticsCode(gaIntegration: GoogleAnalyticsIntegration): string {
  const { measurementId } = gaIntegration;
  
  return `
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${measurementId}');
</script>
`;
}


