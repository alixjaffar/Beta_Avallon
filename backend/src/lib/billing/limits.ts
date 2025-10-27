// CHANGELOG: 2025-10-11 - Add usage limits per subscription plan
import { prisma } from "@/lib/db";

export type PlanLimits = {
  sites: number;
  agents: number;
  domains: number;
  customDomains: boolean;
  emailAccounts: number;
};

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    sites: 1,
    agents: 1,
    domains: 0,
    customDomains: false,
    emailAccounts: 0,
  },
  pro: {
    sites: 3,
    agents: 3,
    domains: 1,
    customDomains: true,
    emailAccounts: 5,
  },
  business: {
    sites: 25,
    agents: 25,
    domains: 5,
    customDomains: true,
    emailAccounts: 50,
  },
};

export async function getUserPlan(userId: string): Promise<string> {
  const subscription = await prisma.subscription.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return subscription?.plan || 'free';
}

export async function getUserLimits(userId: string): Promise<PlanLimits> {
  const plan = await getUserPlan(userId);
  return PLAN_LIMITS[plan] || PLAN_LIMITS.free;
}

export async function checkLimit(
  userId: string,
  resource: keyof Omit<PlanLimits, 'customDomains'>
): Promise<{ allowed: boolean; current: number; limit: number }> {
  const limits = await getUserLimits(userId);
  const limit = limits[resource] as number;

  let current = 0;
  switch (resource) {
    case 'sites':
      current = await prisma.site.count({ where: { ownerId: userId } });
      break;
    case 'agents':
      current = await prisma.agent.count({ where: { ownerId: userId } });
      break;
    case 'domains':
      current = await prisma.domain.count({ where: { ownerId: userId } });
      break;
    case 'emailAccounts':
      current = await prisma.emailAccount.count({ where: { ownerId: userId } });
      break;
  }

  return {
    allowed: current < limit,
    current,
    limit,
  };
}

export async function canCreateCustomDomain(userId: string): Promise<boolean> {
  const limits = await getUserLimits(userId);
  return limits.customDomains;
}

