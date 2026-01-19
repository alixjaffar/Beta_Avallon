import { NextRequest, NextResponse } from "next/server";
import { getStripeClient } from "@/lib/clients/stripe";
import { namecheapRequest, isMockMode } from "@/lib/namecheap";
import { logInfo, logError } from "@/lib/log";
import { prisma } from "@/lib/db";
import { PLAN_CREDITS, addCredits } from "@/lib/billing/credits";
import Stripe from "stripe";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, stripe-signature',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

/**
 * Handle Stripe webhooks for domain purchases
 */
export async function POST(req: NextRequest) {
  const stripe = getStripeClient();
  if (!stripe) {
    logError('Stripe webhook received but Stripe not configured', new Error('No Stripe client'));
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const signature = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature) {
    logError('No stripe-signature header', new Error('Missing signature'));
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  const body = await req.text();

  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // For testing without webhook secret
      event = JSON.parse(body) as Stripe.Event;
      logInfo('Webhook secret not configured, parsing event directly');
    }
  } catch (e: any) {
    logError('Webhook signature verification failed', e);
    return NextResponse.json({ error: `Webhook Error: ${e.message}` }, { status: 400 });
  }

  logInfo('Stripe webhook received', { type: event.type, id: event.id });

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Handle subscription checkout completion
        if (session.mode === 'subscription' && session.subscription) {
          await handleSubscriptionCheckout(session);
        }
        // Handle credit purchase checkout (pay-as-you-go)
        else if (session.metadata?.type === 'credit_purchase') {
          await handleCreditPurchase(session);
        }
        // Handle domain purchase checkout
        else if (session.metadata?.type === 'domain_purchase') {
          const domain = session.metadata.domain;
          const years = parseInt(session.metadata.years || '1', 10);
          
          logInfo('Domain purchase payment completed', { 
            domain, 
            years, 
            sessionId: session.id,
            customerEmail: session.customer_email 
          });

          // Register domain with Namecheap
          const result = await registerDomainAfterPayment(domain, years, session.customer_email || '');
          
          if (result.success) {
            logInfo('Domain registered after payment', { domain, orderId: result.orderId });
          } else {
            logError('Domain registration failed after payment', new Error(result.error || 'Unknown'), { domain });
            // TODO: Trigger refund or manual intervention
          }
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCancellation(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          await handleInvoicePayment(invoice);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          await handleInvoicePaymentFailed(invoice);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logInfo('Payment failed', { 
          paymentIntentId: paymentIntent.id,
          error: paymentIntent.last_payment_error?.message 
        });
        break;
      }

      default:
        logInfo('Unhandled webhook event type', { type: event.type });
    }

    return NextResponse.json({ received: true }, { headers: corsHeaders });
  } catch (e: any) {
    logError('Webhook handler error', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/**
 * Handle subscription checkout completion
 */
async function handleSubscriptionCheckout(session: Stripe.Checkout.Session) {
  try {
    const userId = session.client_reference_id || session.metadata?.userId;
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;
    const plan = session.metadata?.plan || 'pro';
    
    if (!userId) {
      logError('No user ID in checkout session', new Error('Missing userId'), { sessionId: session.id });
      return;
    }

    logInfo('Processing subscription checkout', { userId, customerId, subscriptionId, plan });

    // Get the subscription details from Stripe
    const stripe = getStripeClient();
    if (!stripe) return;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0]?.price.id;
    
    // Determine plan from price metadata or session metadata
    let finalPlan = plan;
    if (priceId) {
      const price = await stripe.prices.retrieve(priceId);
      finalPlan = price.metadata?.plan || plan;
    }

    // Get credits for this plan
    const credits = PLAN_CREDITS[finalPlan] || PLAN_CREDITS.pro;

    // Create or update subscription in database
    await prisma.subscription.upsert({
      where: { stripeSubscriptionId: subscriptionId },
      create: {
        userId,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        stripePriceId: priceId,
        status: subscription.status === 'active' ? 'active' : 'trialing',
        plan: finalPlan,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
      },
      update: {
        stripeCustomerId: customerId,
        stripePriceId: priceId,
        status: subscription.status === 'active' ? 'active' : subscription.status === 'trialing' ? 'trialing' : 'active',
        plan: finalPlan,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
      },
    });

    // Add credits to user account (both database and file-based for compatibility)
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          credits: {
            increment: credits,
          },
        },
      });
    } catch (dbError: any) {
      logInfo('Database user update failed (user may not exist in db), using file-based credits', { userId, error: dbError.message });
    }
    
    // Also add to file-based system (main credit system used by the app)
    const userEmail = session.customer_email || session.metadata?.userEmail;
    await addCredits(userId, credits, `Subscription activated: ${finalPlan} plan`, userEmail || undefined);

    logInfo('Subscription activated and credits added', { userId, userEmail, plan: finalPlan, creditsAdded: credits });
  } catch (error: any) {
    logError('Failed to handle subscription checkout', error, { sessionId: session.id });
  }
}

/**
 * Handle pay-as-you-go credit purchase
 */
async function handleCreditPurchase(session: Stripe.Checkout.Session) {
  try {
    const userId = session.client_reference_id || session.metadata?.userId;
    const userEmail = session.metadata?.userEmail || session.customer_email;
    const quantity = parseInt(session.metadata?.quantity || '0', 10);
    
    if (!userId && !userEmail) {
      logError('No user ID or email in credit purchase session', new Error('Missing user info'), { sessionId: session.id });
      return;
    }

    if (quantity <= 0) {
      logError('Invalid credit quantity', new Error('quantity <= 0'), { sessionId: session.id, quantity });
      return;
    }

    logInfo('Processing credit purchase', { userId, userEmail, quantity, sessionId: session.id });

    // Use the unified addCredits function (handles both file and database)
    const result = await addCredits(
      userId || userEmail || 'unknown', 
      quantity, 
      'Credit purchase', 
      userEmail || undefined
    );
    
    if (result.success) {
      logInfo('Credits added successfully', { userId, userEmail, creditsAdded: quantity, newBalance: result.newBalance });
    } else {
      logError('Failed to add credits', new Error('addCredits returned false'), { userId, userEmail, quantity });
    }

    // Also try database update for users in the system
    if (userId) {
      try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: { credits: { increment: quantity } },
          });
          logInfo('Database credits also updated', { userId: user.id, creditsAdded: quantity });
        }
      } catch (dbError: any) {
        logInfo('Database update skipped', { userId, error: dbError.message });
      }
    }

    logInfo('Credit purchase completed', { userId, userEmail, quantity });
  } catch (error: any) {
    logError('Failed to handle credit purchase', error, { sessionId: session.id });
  }
}

/**
 * Handle subscription updates (plan changes, renewals, etc.)
 */
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  try {
    const subscriptionId = subscription.id;
    const customerId = subscription.customer as string;
    const priceId = subscription.items.data[0]?.price.id;

    logInfo('Processing subscription update', { subscriptionId, customerId, status: subscription.status });

    // Get the subscription from database
    const dbSubscription = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: subscriptionId },
      include: { user: true },
    });

    if (!dbSubscription) {
      logInfo('Subscription not found in database, skipping update', { subscriptionId });
      return;
    }

    // Determine plan from price metadata
    let plan = dbSubscription.plan;
    if (priceId) {
      const stripe = getStripeClient();
      if (stripe) {
        const price = await stripe.prices.retrieve(priceId);
        plan = price.metadata?.plan || dbSubscription.plan;
      }
    }

    // Update subscription
    await prisma.subscription.update({
      where: { id: dbSubscription.id },
      data: {
        stripeCustomerId: customerId,
        stripePriceId: priceId,
        status: subscription.status === 'active' ? 'active' : 
               subscription.status === 'trialing' ? 'trialing' :
               subscription.status === 'past_due' ? 'past_due' : 'canceled',
        plan,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
      },
    });

    logInfo('Subscription updated', { subscriptionId, plan, status: subscription.status });
  } catch (error: any) {
    logError('Failed to handle subscription update', error, { subscriptionId: subscription.id });
  }
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  try {
    const subscriptionId = subscription.id;

    logInfo('Processing subscription cancellation', { subscriptionId });

    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscriptionId },
      data: {
        status: 'canceled',
        cancelAtPeriodEnd: false,
      },
    });

    logInfo('Subscription canceled', { subscriptionId });
  } catch (error: any) {
    logError('Failed to handle subscription cancellation', error, { subscriptionId: subscription.id });
  }
}

/**
 * Handle successful invoice payment (subscription renewal)
 */
async function handleInvoicePayment(invoice: Stripe.Invoice) {
  try {
    const subscriptionId = invoice.subscription as string;
    
    logInfo('Processing invoice payment', { invoiceId: invoice.id, subscriptionId });

    const dbSubscription = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: subscriptionId },
      include: { user: true },
    });

    if (!dbSubscription) {
      logInfo('Subscription not found for invoice payment', { subscriptionId });
      return;
    }

    // Add monthly credits on renewal
    const credits = PLAN_CREDITS[dbSubscription.plan] || PLAN_CREDITS.pro;

    // Update database
    try {
      await prisma.user.update({
        where: { id: dbSubscription.userId },
        data: {
          credits: {
            increment: credits,
          },
        },
      });
    } catch (dbError: any) {
      logInfo('Database user update failed on renewal', { userId: dbSubscription.userId, error: dbError.message });
    }
    
    // Also add to file-based system
    const userEmail = dbSubscription.user?.email;
    await addCredits(dbSubscription.userId, credits, `Subscription renewal: ${dbSubscription.plan} plan`, userEmail || undefined);

    // Update subscription period
    const stripe = getStripeClient();
    if (stripe && subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      await prisma.subscription.update({
        where: { id: dbSubscription.id },
        data: {
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });
    }

    logInfo('Credits added on invoice payment', { userId: dbSubscription.userId, credits });
  } catch (error: any) {
    logError('Failed to handle invoice payment', error, { invoiceId: invoice.id });
  }
}

/**
 * Handle failed invoice payment
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const subscriptionId = invoice.subscription as string;
    
    logInfo('Processing invoice payment failure', { invoiceId: invoice.id, subscriptionId });

    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: subscriptionId },
      data: {
        status: 'past_due',
      },
    });

    logInfo('Subscription marked as past_due', { subscriptionId });
  } catch (error: any) {
    logError('Failed to handle invoice payment failure', error, { invoiceId: invoice.id });
  }
}

/**
 * Register domain with Namecheap after successful payment
 */
async function registerDomainAfterPayment(domain: string, years: number, customerEmail: string) {
  if (isMockMode()) {
    logInfo('Namecheap in mock/sandbox mode, simulating registration', { domain });
    return {
      success: true,
      mock: true,
      domain,
      orderId: `mock-${Date.now()}`,
    };
  }

  try {
    logInfo('Registering domain with Namecheap after payment', { domain, years, customerEmail });

    const result = await namecheapRequest("namecheap.domains.create", {
      DomainName: domain,
      Years: String(years),
    });

    if (!result.ok) {
      return {
        success: false,
        error: result.error || "Domain registration failed",
        domain,
      };
    }

    // Check for errors in XML response
    if (result.xml && result.xml.includes('<Status>ERROR</Status>')) {
      const errorMatch = result.xml?.match(/<Error[^>]*>([^<]+)<\/Error>/);
      return {
        success: false,
        error: errorMatch ? errorMatch[1] : 'Registration failed',
        domain,
      };
    }

    const orderIdMatch = result.xml?.match(/OrderID="(\d+)"/);
    const orderId = orderIdMatch ? orderIdMatch[1] : `order-${Date.now()}`;

    logInfo('Domain registered successfully', { domain, orderId });

    return {
      success: true,
      domain,
      orderId,
    };
  } catch (e: any) {
    logError('Domain registration exception', e, { domain });
    return {
      success: false,
      error: e?.message || "Registration failed",
      domain,
    };
  }
}
