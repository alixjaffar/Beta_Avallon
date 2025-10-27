// CHANGELOG: 2025-10-12 - Lazily instantiate Stripe client with configuration guards
import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe | null {
  if (stripeClient) {
    return stripeClient;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return null;
  }

  stripeClient = new Stripe(secretKey, { apiVersion: "2024-09-30.acacia" });
  return stripeClient;
}

export function requireStripeClient(): Stripe {
  const client = getStripeClient();
  if (!client) {
    throw new Error("Stripe is not configured");
  }
  return client;
}
