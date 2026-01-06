/**
 * Setup Stripe Products and Prices for Avallon Subscriptions
 * 
 * Run this script to create products and prices in Stripe:
 * npx tsx scripts/setup-stripe-subscriptions.ts
 */

import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

interface PlanConfig {
  name: string;
  description: string;
  monthlyPrice: number; // in dollars
  yearlyPrice: number; // in dollars
  features: string[];
  credits: number;
}

const PLANS: Record<string, PlanConfig> = {
  pro: {
    name: 'Pro Plan',
    description: 'Perfect for professionals and small teams',
    monthlyPrice: 29,
    yearlyPrice: 290, // ~20% discount (29 * 12 * 0.83)
    features: [
      '100 credits per month',
      'Unlimited websites',
      'Unlimited agents',
      '5 custom domains',
      '10 email accounts',
      'Priority support',
    ],
    credits: 100,
  },
  business: {
    name: 'Business Plan',
    description: 'For growing businesses and agencies',
    monthlyPrice: 99,
    yearlyPrice: 990, // ~17% discount (99 * 12 * 0.83)
    features: [
      '500 credits per month',
      'Unlimited websites',
      'Unlimited agents',
      'Unlimited custom domains',
      'Unlimited email accounts',
      '24/7 priority support',
      'Advanced analytics',
    ],
    credits: 500,
  },
};

async function setupStripeSubscriptions() {
  console.log('🚀 Setting up Stripe Products and Prices...\n');

  try {
    const products: Record<string, { productId: string; monthlyPriceId: string; yearlyPriceId: string }> = {};

    for (const [planKey, plan] of Object.entries(PLANS)) {
      console.log(`\n📦 Creating ${plan.name}...`);

      // Create product
      const product = await stripe.products.create({
        name: plan.name,
        description: plan.description,
        metadata: {
          plan: planKey,
          credits: String(plan.credits),
        },
      });

      console.log(`  ✅ Product created: ${product.id}`);

      // Create monthly price
      const monthlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.monthlyPrice * 100, // Convert to cents
        currency: 'usd',
        recurring: {
          interval: 'month',
        },
        metadata: {
          plan: planKey,
          interval: 'monthly',
        },
      });

      console.log(`  ✅ Monthly price created: ${monthlyPrice.id} ($${plan.monthlyPrice}/month)`);

      // Create yearly price
      const yearlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.yearlyPrice * 100, // Convert to cents
        currency: 'usd',
        recurring: {
          interval: 'year',
        },
        metadata: {
          plan: planKey,
          interval: 'yearly',
        },
      });

      console.log(`  ✅ Yearly price created: ${yearlyPrice.id} ($${plan.yearlyPrice}/year)`);

      products[planKey] = {
        productId: product.id,
        monthlyPriceId: monthlyPrice.id,
        yearlyPriceId: yearlyPrice.id,
      };
    }

    // Output environment variables
    console.log('\n\n═══════════════════════════════════════════════════════════');
    console.log('✅ STRIPE PRODUCTS & PRICES CREATED!');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('Add these to your backend/.env file:\n');
    console.log('# Stripe Subscription Prices');
    console.log(`STRIPE_PRICE_PRO_MONTHLY="${products.pro.monthlyPriceId}"`);
    console.log(`STRIPE_PRICE_PRO_YEARLY="${products.pro.yearlyPriceId}"`);
    console.log(`STRIPE_PRICE_BUSINESS_MONTHLY="${products.business.monthlyPriceId}"`);
    console.log(`STRIPE_PRICE_BUSINESS_YEARLY="${products.business.yearlyPriceId}"`);
    console.log('\n═══════════════════════════════════════════════════════════\n');

    return products;
  } catch (error: any) {
    console.error('❌ Error setting up Stripe subscriptions:', error.message);
    if (error.type === 'StripeAuthenticationError') {
      console.error('\n💡 Make sure STRIPE_SECRET_KEY is set correctly in .env');
    }
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  setupStripeSubscriptions()
    .then(() => {
      console.log('✅ Setup complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

export { setupStripeSubscriptions };
