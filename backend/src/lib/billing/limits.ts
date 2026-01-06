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
  try {
    const subscription = await prisma.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    }).catch((error: any) => {
      // Catch Prisma connection errors
      if (error?.code === 'P1001' || error?.message?.includes("Can't reach database")) {
        throw new Error('DATABASE_UNAVAILABLE');
      }
      throw error;
    });

    return subscription?.plan || 'free';
  } catch (error: any) {
    // If database is not available, default to free plan
    if (error.message === 'DATABASE_UNAVAILABLE' || error?.code === 'P1001' || error?.message?.includes("Can't reach database")) {
      console.warn('Database not available, defaulting to free plan');
      return 'free';
    }
    // For other errors, also default to free plan
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

    let current = 0;
    try {
      switch (resource) {
        case 'sites':
          current = await prisma.site.count({ where: { ownerId: userId } }).catch((e: any) => {
            if (e?.code === 'P1001' || e?.message?.includes("Can't reach database")) throw new Error('DATABASE_UNAVAILABLE');
            throw e;
          });
          break;
        case 'agents':
          current = await prisma.agent.count({ where: { ownerId: userId } }).catch((e: any) => {
            if (e?.code === 'P1001' || e?.message?.includes("Can't reach database")) throw new Error('DATABASE_UNAVAILABLE');
            throw e;
          });
          break;
        case 'domains':
          current = await prisma.domain.count({ where: { ownerId: userId } }).catch((e: any) => {
            if (e?.code === 'P1001' || e?.message?.includes("Can't reach database")) throw new Error('DATABASE_UNAVAILABLE');
            throw e;
          });
          break;
        case 'emailAccounts':
          current = await prisma.emailAccount.count({ where: { ownerId: userId } }).catch((e: any) => {
            if (e?.code === 'P1001' || e?.message?.includes("Can't reach database")) throw new Error('DATABASE_UNAVAILABLE');
            throw e;
          });
          break;
      }
    } catch (dbError: any) {
      // If database query fails, assume current count is 0
      if (dbError.message === 'DATABASE_UNAVAILABLE' || dbError?.code === 'P1001' || dbError?.message?.includes("Can't reach database")) {
        console.warn('Database unavailable, assuming current count is 0');
      } else {
        console.warn('Database query failed, assuming current count is 0:', dbError.message);
      }
      current = 0;
    }

    return {
      allowed: current < limit,
      current,
      limit,
    };
  } catch (error: any) {
    // If database is not available, allow creation (fail open)
    if (error.message === 'DATABASE_UNAVAILABLE' || error?.code === 'P1001' || error?.message?.includes("Can't reach database")) {
      console.warn('Database not available, allowing resource creation');
    } else {
      console.warn('Error checking limit, allowing resource creation:', error.message);
    }
    return {
      allowed: true,
      current: 0,
      limit: 999, // High limit when DB unavailable
    };
  }
}

export async function canCreateCustomDomain(userId: string): Promise<boolean> {
  const limits = await getUserLimits(userId);
  return limits.customDomains;
}

