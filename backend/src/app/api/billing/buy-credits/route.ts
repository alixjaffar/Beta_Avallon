// CHANGELOG: 2026-01-09 - Add pay-as-you-go credit purchase endpoint
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/lib/auth/getUser";
import { requireStripeClient } from "@/lib/clients/stripe";
import { logError, logInfo } from "@/lib/log";
import { trackEvent } from "@/lib/monitoring";
import { getCorsHeaders } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(req),
  });
}

const Body = z.object({
  quantity: z.number().min(1).max(1000).default(10), // Number of credits to buy
});

// Price per credit in cents (30 cents = $0.30)
const PRICE_PER_CREDIT_CENTS = 30;

export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  
  try {
    const user = await getUser();
    const json = await req.json();
    const parsed = Body.safeParse(json);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    const { quantity } = parsed.data;
    const totalCents = quantity * PRICE_PER_CREDIT_CENTS;

    let stripe;
    try {
      stripe = requireStripeClient();
    } catch (stripeError: unknown) {
      logError('Stripe client not configured', stripeError);
      return NextResponse.json({ 
        error: "Stripe is not configured. Please set STRIPE_SECRET_KEY in your environment variables." 
      }, { 
        status: 503,
        headers: corsHeaders,
      });
    }

    const origin = req.headers.get("origin") || process.env.APP_URL || "http://localhost:5173";
    const successUrl = `${origin}/dashboard?credits=success&quantity=${quantity}`;
    const cancelUrl = `${origin}/dashboard?credits=cancelled`;

    // Create a one-time checkout session with dynamic pricing
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${quantity} Avallon Credits`,
              description: `Pay-as-you-go credits for website generation (${quantity} credits × $0.30 each)`,
            },
            unit_amount: PRICE_PER_CREDIT_CENTS,
          },
          quantity: quantity,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: user.id,
      metadata: {
        type: 'credit_purchase',
        quantity: quantity.toString(),
        userId: user.id,
        userEmail: user.email || '',
      },
    });

    logInfo('Credit purchase checkout created', {
      userId: user.id,
      quantity,
      totalCents,
      sessionId: session.id,
    });

    trackEvent("billing.credits.checkout_created", {
      userId: user.id,
      quantity,
      totalCents,
      sessionId: session.id,
    });

    return NextResponse.json({ 
      url: session.url, 
      id: session.id,
      quantity,
      totalAmount: (totalCents / 100).toFixed(2),
    }, {
      headers: corsHeaders,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logError('Create credit purchase checkout failed', error);
    return NextResponse.json({ error: message }, { 
      status: 500,
      headers: corsHeaders,
    });
  }
}
