import { NextRequest, NextResponse } from "next/server";
import { getStripeClient } from "@/lib/clients/stripe";
import { namecheapRequest, isMockMode, getNamecheapCost } from "@/lib/namecheap";
import { logInfo, logError } from "@/lib/log";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-email',
};

// $3 markup for Avallon profit
const AVALLON_MARKUP = 3.00;

// Namecheap base prices
const NAMECHEAP_PRICES: Record<string, number> = {
  com: 10.28, net: 12.88, org: 9.18, io: 32.88, co: 25.88, 
  app: 14.00, dev: 12.00, ai: 69.88, ca: 10.98,
  xyz: 1.00, site: 1.88, online: 2.88, store: 3.88, 
  blog: 4.88, tech: 4.88, cloud: 8.88, space: 1.88, 
  info: 2.88, me: 2.88
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

/**
 * Create a Stripe checkout session for domain purchase
 */
export async function POST(req: NextRequest) {
  try {
    const { domain, years = 1, successUrl, cancelUrl } = await req.json();
    const userEmail = req.headers.get('x-user-email') || '';

    if (!domain || typeof domain !== 'string') {
      return NextResponse.json(
        { error: "Domain is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Get TLD and calculate price
    const tld = domain.split('.').pop()?.toLowerCase() || 'com';
    const namecheapCost = NAMECHEAP_PRICES[tld] || 10.00;
    const avallonPrice = namecheapCost + AVALLON_MARKUP;
    const totalPrice = Math.round(avallonPrice * years * 100); // Stripe uses cents

    logInfo('Domain purchase request', { 
      domain, 
      years, 
      namecheapCost, 
      avallonPrice, 
      totalPrice: totalPrice / 100,
      userEmail 
    });

    // Check if Stripe is configured
    const stripe = getStripeClient();
    if (!stripe) {
      // If Stripe not configured, do direct purchase (for testing)
      logInfo('Stripe not configured, attempting direct Namecheap purchase', { domain });
      
      if (isMockMode()) {
        return NextResponse.json({
          success: true,
          mock: true,
          domain,
          message: "Domain purchase simulated (sandbox mode)",
          orderId: `mock-${Date.now()}`,
        }, { headers: corsHeaders });
      }

      // Direct Namecheap purchase without payment
      const result = await registerDomainWithNamecheap(domain, years);
      return NextResponse.json(result, { headers: corsHeaders });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Domain: ${domain}`,
              description: `${years} year${years > 1 ? 's' : ''} registration`,
              metadata: {
                domain,
                years: String(years),
                tld,
              },
            },
            unit_amount: totalPrice,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5173'}/dashboard?domain_purchased=${domain}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5173'}/dashboard?domain_cancelled=${domain}`,
      customer_email: userEmail || undefined,
      metadata: {
        domain,
        years: String(years),
        type: 'domain_purchase',
      },
    });

    logInfo('Stripe checkout session created', { 
      sessionId: session.id, 
      domain, 
      amount: totalPrice / 100 
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
      domain,
      price: avallonPrice,
      years,
    }, { headers: corsHeaders });

  } catch (e: any) {
    logError('Domain purchase error', e);
    return NextResponse.json(
      { error: e?.message || "Failed to process domain purchase" },
      { status: 500, headers: corsHeaders }
    );
  }
}

/**
 * Register domain directly with Namecheap (called after payment or in test mode)
 */
async function registerDomainWithNamecheap(domain: string, years: number = 1) {
  if (isMockMode()) {
    logInfo('Namecheap in mock mode, simulating registration', { domain });
    return {
      success: true,
      mock: true,
      domain,
      orderId: `mock-${Date.now()}`,
      message: "Domain registration simulated (Namecheap API not configured or in sandbox mode)",
    };
  }

  try {
    logInfo('Registering domain with Namecheap', { domain, years });

    // Register domain with Namecheap
    // Note: Requires contact info to be set in Namecheap account settings
    const result = await namecheapRequest("namecheap.domains.create", {
      DomainName: domain,
      Years: String(years),
      // Using default contact info from Namecheap account
      // In production, you'd collect this from the user
    });

    if (!result.ok) {
      logError('Namecheap registration failed', new Error(result.error || 'Unknown'), { domain });
      return {
        success: false,
        error: result.error || "Domain registration failed",
        domain,
      };
    }

    // Check for errors in XML response
    if (result.xml && result.xml.includes('<Status>ERROR</Status>')) {
      const errorMatch = result.xml.match(/<Error[^>]*>([^<]+)<\/Error>/);
      const errorMessage = errorMatch ? errorMatch[1] : 'Registration failed';
      logError('Namecheap API error', new Error(errorMessage), { domain });
      return {
        success: false,
        error: errorMessage,
        domain,
      };
    }

    // Parse order ID from response
    const orderIdMatch = result.xml?.match(/OrderID="(\d+)"/);
    const orderId = orderIdMatch ? orderIdMatch[1] : `order-${Date.now()}`;

    logInfo('Domain registered successfully with Namecheap', { domain, orderId });

    return {
      success: true,
      domain,
      orderId,
      message: "Domain registered successfully!",
    };
  } catch (e: any) {
    logError('Namecheap registration exception', e, { domain });
    return {
      success: false,
      error: e?.message || "Failed to register domain",
      domain,
    };
  }
}
