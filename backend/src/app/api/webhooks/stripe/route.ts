// CHANGELOG: 2025-10-12 - Guard Stripe client configuration and improve typing
// CHANGELOG: 2025-10-11 - Add Stripe webhook handler for subscription updates
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { requireStripeClient } from "@/lib/clients/stripe";
import { prisma } from "@/lib/db";
import { logError, logInfo } from "@/lib/log";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  if (!webhookSecret) {
    logError('Stripe webhook secret not configured', new Error('Missing STRIPE_WEBHOOK_SECRET'));
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  let stripe: Stripe;
  try {
    stripe = requireStripeClient();
  } catch (clientError: unknown) {
    logError('Stripe client not configured', clientError);
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    
    logInfo('Stripe webhook received', { type: event.type, id: event.id });

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as any);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as any);
        break;
      
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as any);
        break;
      
      default:
        logInfo('Unhandled Stripe webhook event', { type: event.type });
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logError('Stripe webhook error', error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer;
  const subscriptionId = subscription.id;
  const status = subscription.status;
  const priceId = subscription.items.data[0]?.price.id;
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
  const cancelAtPeriodEnd = subscription.cancel_at_period_end;

  // Determine plan from price ID
  const plan = determinePlanFromPriceId(priceId);

  // Find user by Stripe customer ID
  const existingSub = await prisma.subscription.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (existingSub) {
    await prisma.subscription.update({
      where: { id: existingSub.id },
      data: {
        stripeSubscriptionId: subscriptionId,
        stripePriceId: priceId,
        status: mapStripeStatus(status),
        plan,
        currentPeriodEnd,
        cancelAtPeriodEnd,
      },
    });
    logInfo('Subscription updated', { userId: existingSub.userId, plan, status });
  } else {
    logInfo('Subscription customer not found', { customerId });
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id;

  const existingSub = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
  });

  if (existingSub) {
    await prisma.subscription.update({
      where: { id: existingSub.id },
      data: {
        status: 'canceled',
        plan: 'free',
      },
    });
    logInfo('Subscription canceled', { userId: existingSub.userId });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const customerId = session.customer as string | null;
  const subscriptionId = session.subscription as string | null;
  const clientReferenceId = session.client_reference_id; // User ID from Clerk

  if (!clientReferenceId) {
    logError('No client_reference_id in checkout session', new Error('Missing user ID'));
    return;
  }

  if (!customerId || !subscriptionId) {
    logError('Missing customer or subscription in checkout session', new Error('Incomplete checkout session payload'));
    return;
  }

  // Find user by Clerk ID
  const user = await prisma.user.findUnique({
    where: { clerkId: clientReferenceId },
  });

  if (!user) {
    logError('User not found for checkout', new Error(`User ${clientReferenceId} not found`));
    return;
  }

  // Create or update subscription
  const existingSub = await prisma.subscription.findFirst({
    where: { userId: user.id },
  });

  if (existingSub) {
    await prisma.subscription.update({
      where: { id: existingSub.id },
      data: {
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
      },
    });
  } else {
    await prisma.subscription.create({
      data: {
        userId: user.id,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
      },
    });
  }

  logInfo('Checkout completed', { userId: user.id, customerId });
}

function mapStripeStatus(stripeStatus: string): string {
  const statusMap: Record<string, string> = {
    active: 'active',
    trialing: 'trialing',
    past_due: 'past_due',
    canceled: 'canceled',
    unpaid: 'canceled',
  };
  return statusMap[stripeStatus] || 'free';
}

function determinePlanFromPriceId(priceId: string): string {
  const proPrices = [
    process.env.STRIPE_PRICE_PRO_MONTHLY,
    process.env.STRIPE_PRICE_PRO_YEARLY,
  ];
  const businessPrices = [
    process.env.STRIPE_PRICE_BUSINESS_MONTHLY,
    process.env.STRIPE_PRICE_BUSINESS_YEARLY,
  ];

  if (proPrices.includes(priceId)) return 'pro';
  if (businessPrices.includes(priceId)) return 'business';
  return 'free';
}
