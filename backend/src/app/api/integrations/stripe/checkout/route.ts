import { NextRequest, NextResponse } from "next/server";
import { getStripeClient } from "@/lib/clients/stripe";
import { logInfo, logError } from "@/lib/log";

// CORS headers for Stripe checkout - must allow any origin for generated websites
// Using wildcard since generated websites can be on any Vercel subdomain
const getCorsHeadersForStripe = (req: NextRequest) => {
  const origin = req.headers.get('origin') || '*';
  // Allow any Vercel app or localhost for generated websites
  const isAllowed = origin === '*' || 
    origin.includes('vercel.app') || 
    origin.includes('localhost') ||
    origin.includes('127.0.0.1') ||
    origin.includes('avallon.ca') ||
    origin.includes('beta-avallon1');
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
};

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 200, headers: getCorsHeadersForStripe(req) });
}

/**
 * Create a Stripe checkout session for any product/price
 * Used by AI-generated websites to enable payments
 */
export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeadersForStripe(req);
  
  try {
    const { priceId, quantity = 1, successUrl, cancelUrl, metadata = {} } = await req.json();

    if (!priceId || typeof priceId !== 'string') {
      return NextResponse.json(
        { error: "priceId is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 503, headers: corsHeaders }
      );
    }

    // Get origin from request or use default
    const origin = req.headers.get('origin') || 
                   req.headers.get('referer')?.split('/').slice(0, 3).join('/') ||
                   'http://localhost:5173';

    // Determine if this is a recurring price (subscription) or one-time payment
    let checkoutMode: 'payment' | 'subscription' = 'payment';
    try {
      const price = await stripe.prices.retrieve(priceId);
      if (price.type === 'recurring') {
        checkoutMode = 'subscription';
      }
      logInfo('Retrieved price info', { priceId, type: price.type, mode: checkoutMode });
    } catch (error: any) {
      logError('Failed to retrieve price info, defaulting to payment mode', error);
      // Default to payment mode if we can't determine
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: checkoutMode,
      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      success_url: successUrl || `${origin}?payment=success`,
      cancel_url: cancelUrl || `${origin}?payment=cancelled`,
      metadata: {
        ...metadata,
        source: 'ai-generated-website',
      },
    });

    logInfo('Stripe checkout session created', { 
      sessionId: session.id, 
      priceId,
      url: session.url 
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    }, { headers: corsHeaders });

  } catch (error: any) {
    logError('Stripe checkout creation failed', error);
    return NextResponse.json(
      { error: error?.message || "Failed to create checkout session" },
      { status: 500, headers: corsHeaders }
    );
  }
}
