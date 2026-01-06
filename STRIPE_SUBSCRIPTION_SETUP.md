# ✅ Stripe Subscription Setup - COMPLETE

Your Stripe subscription system is now fully configured!

---

## 🎯 What's Been Set Up

### ✅ Stripe Products & Prices Created

**Pro Plan:**
- Monthly: $29/month (`price_1SmG2l0Afn09g23QoCbGETau`)
- Yearly: $290/year (`price_1SmG2m0Afn09g23QHyz9ZVEx`)
- Credits: 100 per month

**Business Plan:**
- Monthly: $99/month (`price_1SmG2m0Afn09g23QprV6TSwB`)
- Yearly: $990/year (`price_1SmG2m0Afn09g23QIr1tjdXj`)
- Credits: 500 per month

### ✅ Environment Variables Configured

All Stripe keys and price IDs are in `backend/.env`:
- `STRIPE_SECRET_KEY` ✅
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` ✅
- `STRIPE_PRICE_PRO_MONTHLY` ✅
- `STRIPE_PRICE_PRO_YEARLY` ✅
- `STRIPE_PRICE_BUSINESS_MONTHLY` ✅
- `STRIPE_PRICE_BUSINESS_YEARLY` ✅

### ✅ API Endpoints Created

1. **Subscription Checkout**
   - `POST /api/billing/checkout`
   - Creates Stripe checkout session for subscriptions

2. **Cancel Subscription**
   - `POST /api/billing/subscription/cancel`
   - Cancels subscription at period end

3. **Billing Portal**
   - `POST /api/billing/subscription/portal`
   - Creates Stripe Customer Portal session (manage subscription, update payment method, etc.)

4. **Webhook Handler** (Updated)
   - `POST /api/webhooks/stripe`
   - Handles subscription events:
     - `checkout.session.completed` - New subscription
     - `customer.subscription.created` - Subscription created
     - `customer.subscription.updated` - Plan changes, renewals
     - `customer.subscription.deleted` - Cancellation
     - `invoice.payment_succeeded` - Monthly/yearly renewal (adds credits)
     - `invoice.payment_failed` - Payment failure

---

## 🔗 Next Step: Set Up Webhook Secret

### For Local Development:

1. **Install Stripe CLI:**
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. **Login:**
   ```bash
   stripe login
   ```

3. **Forward webhooks:**
   ```bash
   stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
   ```

4. **Copy the webhook secret** (starts with `whsec_...`) and add to `.env`:
   ```bash
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

### For Production:

1. Go to https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
4. Copy the signing secret to `.env`

---

## 🧪 Testing

### Test Subscription Flow:

1. **Start your servers:**
   ```bash
   # Backend
   cd backend && npm run dev
   
   # Frontend
   cd frontend && npm run dev
   ```

2. **Create a subscription:**
   - Go to your pricing page
   - Click "Subscribe" on Pro or Business plan
   - Use test card: `4242 4242 4242 4242`
   - Complete checkout

3. **Verify in Stripe Dashboard:**
   - https://dashboard.stripe.com/test/subscriptions
   - Should see the subscription

4. **Check database:**
   - Subscription should be created in `Subscription` table
   - User should have credits added

5. **Test renewal:**
   - In Stripe dashboard, manually trigger invoice payment
   - Credits should be added again

---

## 📊 How It Works

### Subscription Lifecycle:

```
User clicks "Subscribe"
  ↓
POST /api/billing/checkout
  ↓
Stripe Checkout Session Created
  ↓
User completes payment
  ↓
Webhook: checkout.session.completed
  ↓
Subscription created in database
  ↓
Credits added to user account
  ↓
Monthly/Yearly renewal
  ↓
Webhook: invoice.payment_succeeded
  ↓
Credits added again
```

### Credit Allocation:

- **Free Plan:** 20 credits (one-time)
- **Pro Plan:** 100 credits per month
- **Business Plan:** 500 credits per month

Credits are added:
- When subscription is first created
- On each monthly/yearly renewal

---

## 🔧 API Usage Examples

### Create Subscription Checkout:

```typescript
const response = await fetch('/api/billing/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    plan: 'pro', // or 'business'
    interval: 'monthly', // or 'yearly'
  }),
});

const { url } = await response.json();
// Redirect user to url
window.location.href = url;
```

### Cancel Subscription:

```typescript
const response = await fetch('/api/billing/subscription/cancel', {
  method: 'POST',
});

const { success, cancelAt } = await response.json();
```

### Open Billing Portal:

```typescript
const response = await fetch('/api/billing/subscription/portal', {
  method: 'POST',
});

const { url } = await response.json();
// Redirect user to url
window.location.href = url;
```

---

## ✅ Status

- ✅ Stripe products created
- ✅ Prices configured
- ✅ Environment variables set
- ✅ Webhook handler updated
- ✅ Subscription management endpoints created
- ⏳ Webhook secret needs to be set (see above)

**You're ready to test subscriptions!** 🚀
