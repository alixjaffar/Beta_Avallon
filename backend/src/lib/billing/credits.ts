// Credit management system for AI website generation
// CHANGELOG: 2025-01-07 - Updated for new pricing tiers and token-based consumption
// CHANGELOG: 2026-03-22 - Migrated from file-based to PostgreSQL (fixes ephemeral Vercel storage)
import { logInfo, logError } from "@/lib/log";
import { prisma } from "@/lib/db";

// Token-based credit costs (1 credit = ~1000 tokens)
export const CREDIT_COSTS = {
  GENERATE_WEBSITE: 15,   // ~15K tokens for full website generation
  MODIFY_WEBSITE: 5,      // ~5K tokens for modifications
  PER_1K_TOKENS: 1,       // 1 credit per 1000 tokens
} as const;

// Credit allocations per plan (monthly)
export const PLAN_CREDITS: Record<string, number> = {
  free: 30,         // Free plan: 30 credits/month
  starter: 100,     // Starter plan: 100 credits/month
  growth: 250,      // Growth plan: 250 credits/month
  enterprise: 400,  // Enterprise plan: 400+ credits/month
  // Legacy plans
  pro: 100,
  business: 250,
};

/**
 * Calculate credits based on token usage
 */
export function calculateTokenCredits(inputTokens: number, outputTokens: number): number {
  const totalTokens = inputTokens + outputTokens;
  // 1 credit per 1000 tokens, minimum 1 credit
  return Math.max(1, Math.ceil(totalTokens / 1000));
}

/**
 * Find user in database by clerkId or email
 */
async function findUser(userId: string, email?: string) {
  // Try clerkId first
  let user = await prisma.user.findUnique({ where: { clerkId: userId } });
  
  // If not found and email provided, try email
  if (!user && email) {
    user = await prisma.user.findUnique({ where: { email } });
  }
  
  return user;
}

/**
 * Get user's current credit balance from database
 * Checks BOTH userId (clerkId) AND email to find the user
 */
export async function getUserCredits(userId: string, email?: string): Promise<number> {
  // Skip for mock users
  if (userId === 'mock_user_id' || userId.startsWith('mock_')) {
    return 5;
  }
  
  try {
    const user = await findUser(userId, email);
    
    if (user) {
      return user.credits;
    }
    
    // User not in database - return default free plan credits
    return PLAN_CREDITS.free;
  } catch (error: any) {
    logError('Failed to get user credits from database', error, { userId, email });
    return PLAN_CREDITS.free;
  }
}

/**
 * Check if user has enough credits for an operation
 */
export async function hasEnoughCredits(
  userId: string,
  cost: number,
  email?: string
): Promise<{ hasEnough: boolean; currentCredits: number; requiredCredits: number }> {
  try {
    const currentCredits = await getUserCredits(userId, email);
    return {
      hasEnough: currentCredits >= cost,
      currentCredits,
      requiredCredits: cost,
    };
  } catch (error: any) {
    logError('Failed to check credits', error, { userId, email, cost });
    return {
      hasEnough: false,
      currentCredits: 0,
      requiredCredits: cost,
    };
  }
}

/**
 * Deduct credits from user's account in database
 * Returns true if successful, false if insufficient credits
 * Uses atomic decrement operation to prevent race conditions
 */
export async function deductCredits(
  userId: string,
  amount: number,
  reason?: string,
  email?: string
): Promise<{ success: boolean; remainingCredits: number; error?: string }> {
  // Skip for mock users
  if (userId === 'mock_user_id' || userId.startsWith('mock_')) {
    return { success: true, remainingCredits: 5 };
  }
  
  try {
    const user = await findUser(userId, email);
    
    if (!user) {
      logInfo('User not found for credit deduction', { userId, email });
      return {
        success: false,
        remainingCredits: 0,
        error: 'User not found',
      };
    }
    
    const currentCredits = user.credits;
    
    if (currentCredits < amount) {
      logInfo('Insufficient credits', {
        userId: user.id,
        email: user.email,
        currentCredits,
        required: amount,
        reason,
      });
      return {
        success: false,
        remainingCredits: currentCredits,
        error: `Insufficient credits. You have ${currentCredits} credits but need ${amount}.`,
      };
    }

    // Atomic decrement to prevent race conditions
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        credits: { decrement: amount },
      },
    });

    logInfo('Credits deducted from database', {
      userId: user.id,
      clerkId: user.clerkId,
      email: user.email,
      amount,
      previousCredits: currentCredits,
      remainingCredits: updated.credits,
      reason,
    });

    return {
      success: true,
      remainingCredits: updated.credits,
    };
  } catch (error: any) {
    logError('Failed to deduct credits', error, { userId, email, amount, reason });
    return {
      success: false,
      remainingCredits: 0,
      error: 'Failed to process credit deduction',
    };
  }
}

/**
 * Deduct credits based on token usage
 */
export async function deductTokenCredits(
  userId: string,
  inputTokens: number,
  outputTokens: number,
  reason?: string,
  email?: string
): Promise<{ success: boolean; remainingCredits: number; creditsUsed: number; error?: string }> {
  const creditsToDeduct = calculateTokenCredits(inputTokens, outputTokens);
  const result = await deductCredits(userId, creditsToDeduct, reason, email);
  return {
    ...result,
    creditsUsed: creditsToDeduct,
  };
}

/**
 * Add credits to user's account in database
 * Uses atomic increment operation to prevent race conditions
 */
export async function addCredits(
  userId: string,
  amount: number,
  reason?: string,
  email?: string
): Promise<{ success: boolean; newBalance: number }> {
  // Skip for mock users
  if (userId === 'mock_user_id' || userId.startsWith('mock_')) {
    return { success: true, newBalance: 5 + amount };
  }
  
  try {
    const user = await findUser(userId, email);
    
    if (!user) {
      logInfo('User not found for adding credits, skipping', { userId, email, amount });
      return {
        success: false,
        newBalance: 0,
      };
    }
    
    const previousCredits = user.credits;
    
    // Atomic increment to prevent race conditions
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        credits: { increment: amount },
      },
    });

    logInfo('Credits added to database', {
      userId: user.id,
      clerkId: user.clerkId,
      email: user.email,
      amount,
      previousCredits,
      newBalance: updated.credits,
      reason,
    });

    return {
      success: true,
      newBalance: updated.credits,
    };
  } catch (error: any) {
    logError('Failed to add credits', error, { userId, email, amount, reason });
    return {
      success: false,
      newBalance: 0,
    };
  }
}

/**
 * Set user's credits to a specific amount in database
 */
export async function setCredits(
  userId: string,
  amount: number,
  reason?: string,
  email?: string
): Promise<{ success: boolean; newBalance: number }> {
  // Skip for mock users
  if (userId === 'mock_user_id' || userId.startsWith('mock_')) {
    return { success: true, newBalance: amount };
  }
  
  try {
    const user = await findUser(userId, email);
    
    if (!user) {
      logInfo('User not found for setting credits', { userId, email, amount });
      return {
        success: false,
        newBalance: 0,
      };
    }
    
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        credits: amount,
      },
    });

    logInfo('Credits set in database', {
      userId: user.id,
      clerkId: user.clerkId,
      email: user.email,
      amount,
      newBalance: updated.credits,
      reason,
    });

    return {
      success: true,
      newBalance: updated.credits,
    };
  } catch (error: any) {
    logError('Failed to set credits', error, { userId, email, amount, reason });
    return {
      success: false,
      newBalance: 0,
    };
  }
}

/**
 * Get credits allocation for a plan
 */
export function getPlanCredits(plan: string): number {
  return PLAN_CREDITS[plan] || PLAN_CREDITS.free;
}

/**
 * Ensure user has credits initialized in database
 * Returns the user's current credit balance
 */
export async function ensureUserHasCredits(
  userId: string,
  email: string,
  minCredits?: number
): Promise<{ success: boolean; credits: number }> {
  const defaultCredits = minCredits ?? 30;
  
  // Skip test emails
  if (!email || email === 'user@example.com' || email === 'test@example.com') {
    return { success: true, credits: defaultCredits };
  }
  
  // Skip mock users
  if (userId === 'mock_user_id' || userId.startsWith('mock_')) {
    return { success: true, credits: defaultCredits };
  }
  
  try {
    const user = await findUser(userId, email);
    
    if (user) {
      return { success: true, credits: user.credits };
    }
    
    // User not in database yet - they'll get default credits when created
    logInfo('User not found in database during ensureUserHasCredits', { userId, email });
    return { success: true, credits: defaultCredits };
  } catch (error: any) {
    logError('Failed to ensure user has credits', error, { userId, email });
    return { success: false, credits: defaultCredits };
  }
}

/**
 * Initialize or update credits when user upgrades plan
 * This ADDS credits to the user's existing balance (doesn't reset)
 */
export async function initializeCreditsForPlan(
  userId: string,
  plan: string,
  email?: string
): Promise<{ success: boolean; credits: number }> {
  const planCredits = getPlanCredits(plan);
  const result = await addCredits(userId, planCredits, `Upgraded to ${plan} plan`, email);
  return { success: result.success, credits: result.newBalance };
}
