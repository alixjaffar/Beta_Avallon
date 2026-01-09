// File-based subscription storage (works without database)
// CHANGELOG: 2025-01-07 - Created file-based subscription storage for plan management
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const SUBSCRIPTIONS_FILE = join(process.cwd(), 'subscriptions.json');

export interface Subscription {
  id: string;
  userId: string;
  plan: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd?: string;
  createdAt: string;
  updatedAt: string;
}

function loadSubscriptions(): Subscription[] {
  try {
    if (existsSync(SUBSCRIPTIONS_FILE)) {
      const data = readFileSync(SUBSCRIPTIONS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading subscriptions:', error);
  }
  return [];
}

function saveSubscriptions(subscriptions: Subscription[]): void {
  try {
    writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(subscriptions, null, 2));
  } catch (error) {
    console.error('Error saving subscriptions:', error);
  }
}

export function getSubscriptionByUserId(userId: string): Subscription | null {
  const subscriptions = loadSubscriptions();
  return subscriptions.find(s => s.userId === userId) || null;
}

export function upsertSubscription(data: {
  userId: string;
  plan: string;
  status?: 'active' | 'canceled' | 'past_due' | 'trialing';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd?: Date;
}): Subscription {
  const subscriptions = loadSubscriptions();
  const existingIndex = subscriptions.findIndex(s => s.userId === data.userId);
  
  const now = new Date().toISOString();
  
  if (existingIndex >= 0) {
    // Update existing
    subscriptions[existingIndex] = {
      ...subscriptions[existingIndex],
      plan: data.plan,
      status: data.status || subscriptions[existingIndex].status,
      stripeCustomerId: data.stripeCustomerId || subscriptions[existingIndex].stripeCustomerId,
      stripeSubscriptionId: data.stripeSubscriptionId || subscriptions[existingIndex].stripeSubscriptionId,
      currentPeriodEnd: data.currentPeriodEnd?.toISOString() || subscriptions[existingIndex].currentPeriodEnd,
      updatedAt: now,
    };
    saveSubscriptions(subscriptions);
    return subscriptions[existingIndex];
  } else {
    // Create new
    const newSubscription: Subscription = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: data.userId,
      plan: data.plan,
      status: data.status || 'active',
      stripeCustomerId: data.stripeCustomerId,
      stripeSubscriptionId: data.stripeSubscriptionId,
      currentPeriodEnd: data.currentPeriodEnd?.toISOString(),
      createdAt: now,
      updatedAt: now,
    };
    subscriptions.push(newSubscription);
    saveSubscriptions(subscriptions);
    return newSubscription;
  }
}

export function cancelSubscription(userId: string): void {
  const subscriptions = loadSubscriptions();
  const index = subscriptions.findIndex(s => s.userId === userId);
  if (index >= 0) {
    subscriptions[index].status = 'canceled';
    subscriptions[index].updatedAt = new Date().toISOString();
    saveSubscriptions(subscriptions);
  }
}

