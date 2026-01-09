// CHANGELOG: 2025-01-07 - Updated pricing tiers: Free, Starter, Growth, Enterprise
// CHANGELOG: 2025-01-07 - Switch to file-based subscription storage
import { getSubscriptionByUserId } from "@/data/subscriptions";

export type PlanLimits = {
  sites: number;
  agents: number;
  domains: number;
  customDomains: boolean;
  emailAccounts: number;
  credits: number;
  integrations: boolean;
  multiSite: boolean;
};

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  // Free Tier - 15 credits/month, 1 site, no AI agents, no integrations
  free: {
    sites: 1,
    agents: 0,           // No AI agents on free tier
    domains: 0,
    customDomains: false,
    emailAccounts: 0,
    credits: 15,
    integrations: false, // No integrations on free tier
    multiSite: false,
  },
  // Starter - $24.99/mo - 100 credits, multi-site, 1 AI agent, integrations
  starter: {
    sites: 5,
    agents: 1,
    domains: 1,
    customDomains: true,
    emailAccounts: 0,
    credits: 100,
    integrations: true,
    multiSite: true,
  },
  // Growth - $39.99/mo - 250 credits, 4 AI agents, email hosting
  growth: {
    sites: 10,
    agents: 4,
    domains: 3,
    customDomains: true,
    emailAccounts: 10,
    credits: 250,
    integrations: true,
    multiSite: true,
  },
  // Enterprise - Custom - 400+ credits, 10+ AI agents, everything
  enterprise: {
    sites: 999,
    agents: 999,
    domains: 999,
    customDomains: true,
    emailAccounts: 999,
    credits: 400,
    integrations: true,
    multiSite: true,
  },
  // Legacy plans (for backwards compatibility)
  pro: {
    sites: 5,
    agents: 1,
    domains: 1,
    customDomains: true,
    emailAccounts: 0,
    credits: 100,
    integrations: true,
    multiSite: true,
  },
  business: {
    sites: 10,
    agents: 4,
    domains: 3,
    customDomains: true,
    emailAccounts: 10,
    credits: 250,
    integrations: true,
    multiSite: true,
  },
};

// Feature access checks
export function canAccessAgents(plan: string): boolean {
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  return limits.agents > 0;
}

export function canAccessIntegrations(plan: string): boolean {
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  return limits.integrations;
}

export function canCreateMultipleSites(plan: string): boolean {
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  return limits.multiSite;
}

export function canAccessEmailHosting(plan: string): boolean {
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  // Email hosting only available on Growth and Enterprise (plans with emailAccounts > 0)
  return limits.emailAccounts > 0;
}

export async function getUserPlan(userId: string): Promise<string> {
  try {
    // Use file-based subscription storage
    const subscription = getSubscriptionByUserId(userId);
    
    if (subscription && subscription.status === 'active') {
      return subscription.plan || 'free';
    }
    
    return 'free';
  } catch (error: any) {
    console.warn('Error getting user plan, defaulting to free plan:', error.message);
    return 'free';
  }
}

export async function getUserLimits(userId: string): Promise<PlanLimits> {
  try {
    const plan = await getUserPlan(userId);
    return PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  } catch (error: any) {
    // If getUserPlan fails, default to free plan limits
    console.warn('Failed to get user limits, defaulting to free plan:', error.message);
    return PLAN_LIMITS.free;
  }
}

export async function checkLimit(
  userId: string,
  resource: keyof Omit<PlanLimits, 'customDomains'>
): Promise<{ allowed: boolean; current: number; limit: number }> {
  try {
    const limits = await getUserLimits(userId);
    const limit = limits[resource] as number;

    // For now, allow all operations (database counting not available)
    // Resource counting will be implemented with local file storage
    return {
      allowed: true,
      current: 0,
      limit,
    };
  } catch (error: any) {
    console.warn('Error checking limit, allowing resource creation:', error.message);
    return {
      allowed: true,
      current: 0,
      limit: 999,
    };
  }
}

export async function canCreateCustomDomain(userId: string): Promise<boolean> {
  const limits = await getUserLimits(userId);
  return limits.customDomains;
}

