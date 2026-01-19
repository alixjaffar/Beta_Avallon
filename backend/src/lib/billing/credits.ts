// Credit management system for AI website generation
// CHANGELOG: 2025-01-07 - Updated for new pricing tiers and token-based consumption
import { logInfo, logError } from "@/lib/log";
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const USER_CREDITS_FILE = join(process.cwd(), 'user-credits.json');

// Token-based credit costs (1 credit = ~1000 tokens)
export const CREDIT_COSTS = {
  GENERATE_WEBSITE: 15,   // ~15K tokens for full website generation
  MODIFY_WEBSITE: 5,      // ~5K tokens for modifications
  PER_1K_TOKENS: 1,       // 1 credit per 1000 tokens
} as const;

// Credit allocations per plan (monthly)
export const PLAN_CREDITS: Record<string, number> = {
  free: 15,         // Free plan: 15 credits/month
  starter: 100,     // Starter plan: 100 credits/month
  growth: 250,      // Growth plan: 250 credits/month
  enterprise: 400,  // Enterprise plan: 400+ credits/month
  // Legacy plans
  pro: 100,
  business: 250,
};

// File-based user credits storage
interface UserCredits {
  [userId: string]: {
    credits: number;
    lastUpdated: string;
  };
}

function loadUserCredits(): UserCredits {
  try {
    if (existsSync(USER_CREDITS_FILE)) {
      const data = readFileSync(USER_CREDITS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading user credits:', error);
  }
  return {};
}

function saveUserCredits(credits: UserCredits): void {
  try {
    writeFileSync(USER_CREDITS_FILE, JSON.stringify(credits, null, 2));
  } catch (error) {
    console.error('Error saving user credits:', error);
  }
}

/**
 * Calculate credits based on token usage
 */
export function calculateTokenCredits(inputTokens: number, outputTokens: number): number {
  const totalTokens = inputTokens + outputTokens;
  // 1 credit per 1000 tokens, minimum 1 credit
  return Math.max(1, Math.ceil(totalTokens / 1000));
}

/**
 * Get user's current credit balance (file-based)
 */
export async function getUserCredits(userId: string, email?: string): Promise<number> {
  const lookupId = email || userId;
  
  // Skip for mock users
  if (userId === 'mock_user_id' || userId.startsWith('mock_')) {
    return 5; // Default free plan credits
  }
  
  try {
    const allCredits = loadUserCredits();
    
    // Try userId first, then email
    const userCredits = allCredits[userId] || (email ? allCredits[email] : null);
    
    if (userCredits) {
      return userCredits.credits;
    }
    
    // New user - give them 15 credits (free plan)
    return 15;
  } catch (error: any) {
    logError('Failed to get user credits', error, { userId, email });
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
 * Deduct credits from user's account (file-based)
 * Returns true if successful, false if insufficient credits
 */
export async function deductCredits(
  userId: string,
  amount: number,
  reason?: string,
  email?: string
): Promise<{ success: boolean; remainingCredits: number; error?: string }> {
  const lookupId = email || userId;
  
  try {
    const allCredits = loadUserCredits();
    const currentCredits = allCredits[lookupId]?.credits ?? PLAN_CREDITS.free;
    
    if (currentCredits < amount) {
      logInfo('Insufficient credits', {
        userId,
        email,
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

    // Deduct credits
    const newCredits = currentCredits - amount;
    allCredits[lookupId] = {
      credits: newCredits,
      lastUpdated: new Date().toISOString(),
    };
    saveUserCredits(allCredits);

    logInfo('Credits deducted', {
      userId,
      email,
      amount,
      previousCredits: currentCredits,
      remainingCredits: newCredits,
      reason,
    });

    return {
      success: true,
      remainingCredits: newCredits,
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
 * Add credits to user's account (file-based)
 */
export async function addCredits(
  userId: string,
  amount: number,
  reason?: string,
  email?: string
): Promise<{ success: boolean; newBalance: number }> {
  const lookupId = email || userId;
  
  try {
    const allCredits = loadUserCredits();
    const currentCredits = allCredits[lookupId]?.credits ?? 0;
    const newBalance = currentCredits + amount;
    
    allCredits[lookupId] = {
      credits: newBalance,
      lastUpdated: new Date().toISOString(),
    };
    saveUserCredits(allCredits);

    logInfo('Credits added', {
      userId,
      email,
      amount,
      previousCredits: currentCredits,
      newBalance,
      reason,
    });

    return {
      success: true,
      newBalance,
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
 * Set user's credits to a specific amount (file-based)
 */
export async function setCredits(
  userId: string,
  amount: number,
  reason?: string,
  email?: string
): Promise<{ success: boolean; newBalance: number }> {
  const lookupId = email || userId;
  
  try {
    const allCredits = loadUserCredits();
    
    allCredits[lookupId] = {
      credits: amount,
      lastUpdated: new Date().toISOString(),
    };
    saveUserCredits(allCredits);

    logInfo('Credits set', {
      userId,
      email,
      amount,
      newBalance: amount,
      reason,
    });

    return {
      success: true,
      newBalance: amount,
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
 * Ensure user has at least the minimum credits (file-based)
 */
export async function ensureUserHasCredits(
  userId: string,
  email: string,
  minCredits?: number
): Promise<{ success: boolean; credits: number }> {
  const defaultCredits = minCredits ?? 15; // Default to 15 credits for all new users
  const lookupId = email || userId;
  
  if (!email || email === 'user@example.com' || email === 'test@example.com') {
    return { success: true, credits: defaultCredits };
  }
  
  try {
    const allCredits = loadUserCredits();
    
    if (allCredits[lookupId]) {
      return { success: true, credits: allCredits[lookupId].credits };
    }
    
    // New user - give them 15 credits (free plan default)
    allCredits[lookupId] = {
      credits: 15,
      lastUpdated: new Date().toISOString(),
    };
    saveUserCredits(allCredits);
    
    logInfo('Initialized user credits', { email, userId, credits: 15 });
    return { success: true, credits: 15 };
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
  // Use addCredits instead of setCredits to preserve existing credits
  const result = await addCredits(userId, planCredits, `Upgraded to ${plan} plan`, email);
  return { success: result.success, credits: result.newBalance };
}




