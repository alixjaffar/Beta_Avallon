# Stripe Payment Setup Guide

## Quick Setup

1. **Get your Stripe API keys:**
   - Go to https://dashboard.stripe.com/apikeys
   - Copy your **Secret Key** (starts with `sk_`)
   - Copy your **Publishable Key** (starts with `pk_`) - optional for backend

2. **Create Products and Prices in Stripe:**
   - Go to https://dashboard.stripe.com/products
   - Create a product called "Pro Plan" with monthly price $29
   - Create a product called "Business Plan" with monthly price $99
   - Copy the **Price IDs** (they start with `price_`)

3. **Set Environment Variables:**

   In your `backend/.env` file, add:
   ```env
   STRIPE_SECRET_KEY=sk_test_... (your secret key)
   STRIPE_PRICE_PRO_MONTHLY=price_... (Pro monthly price ID)
   STRIPE_PRICE_PRO_YEARLY=price_... (Pro yearly price ID - optional)
   STRIPE_PRICE_BUSINESS_MONTHLY=price_... (Business monthly price ID)
   STRIPE_PRICE_BUSINESS_YEARLY=price_... (Business yearly price ID - optional)
   STRIPE_WEBHOOK_SECRET=whsec_... (for webhook verification - see below)
   ```

4. **Set up Webhook (for production):**
   - Go to https://dashboard.stripe.com/webhooks
   - Add endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copy the **Webhook Signing Secret** (starts with `whsec_`)

5. **For Local Testing:**
   - Use Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
   - Copy the webhook secret from the CLI output

## Testing

- Use Stripe test cards: https://stripe.com/docs/testing
- Test card: `4242 4242 4242 4242`
- Any future expiry date and any CVC

## Features

- ✅ Stripe Checkout integration
- ✅ Subscription management
- ✅ Webhook handling for subscription updates
- ✅ Plan limits enforcement
- ✅ Automatic plan detection



