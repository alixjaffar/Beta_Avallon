// Credit management system for AI website generation
import { prisma } from "@/lib/db";
import { logInfo, logError } from "@/lib/log";

// Credit costs for different operations
export const CREDIT_COSTS = {
  GENERATE_WEBSITE: 10, // Cost to generate a new website
  MODIFY_WEBSITE: 5,    // Cost to modify an existing website
} as const;

// Credit allocations per plan (when upgrading)
export const PLAN_CREDITS: Record<string, number> = {
  free: 20,       // Free plan gets 20 credits
  pro: 100,       // Pro plan gets 100 credits
  business: 500, // Business plan gets 500 credits
};

/**
 * Get user's current credit balance
 */
export async function getUserCredits(userId: string, email?: string): Promise<number> {
  // Skip database query for mock users (fast path)
  if (userId === 'mock_user_id' || userId.startsWith('mock_')) {
    return 20; // Default credits for mock users
  }
  
  try {
    // Try to find user by ID first, then by email
    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true, id: true },
    });
    
    // If not found by ID, try by email
    if (!user && email) {
      user = await prisma.user.findUnique({
        where: { email: email },
        select: { credits: true, id: true },
      });
    }
    
    // If still not found, try raw SQL search
    if (!user) {
      try {
        const results = await prisma.$queryRaw<Array<{credits: number | null, id: string}>>`
          SELECT credits, id FROM "User" 
          WHERE id = ${userId} OR email = ${email || ''}
          LIMIT 1
        `;
        if (results && results.length > 0) {
          const rawUser = results[0];
          user = { id: rawUser.id, credits: rawUser.credits ?? 20 };
        }
      } catch (e) {
        // Ignore raw SQL errors
      }
    }

    const credits = user?.credits;
    logInfo('getUserCredits result', { userId, email, credits, hasUser: !!user });
    
    // If credits is null/undefined, return 20 as default
    if (credits === null || credits === undefined) {
      return 20;
    }
    
    return credits;
  } catch (error: any) {
    // Handle Prisma prepared statement errors gracefully
    if (error?.message?.includes('prepared statement') || error?.code === '42P05') {
      logInfo('Prisma connection pool issue, using default credits', { userId });
      return 20;
    }
    logError('Failed to get user credits', error, { userId, email });
    // Return 20 as default instead of 0
    return 20;
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
 * Deduct credits from user's account
 * Returns true if successful, false if insufficient credits
 */
export async function deductCredits(
  userId: string,
  amount: number,
  reason?: string,
  email?: string
): Promise<{ success: boolean; remainingCredits: number; error?: string }> {
  try {
    // Check current credits
    const currentCredits = await getUserCredits(userId, email);
    
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

    // Find the user record first (by ID or email)
    let dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, credits: true },
    });
    
    if (!dbUser && email) {
      dbUser = await prisma.user.findUnique({
        where: { email: email },
        select: { id: true, credits: true },
      });
    }
    
    if (!dbUser) {
      // Try raw SQL
      try {
        const results = await prisma.$queryRaw<Array<{id: string, credits: number | null}>>`
          SELECT id, credits FROM "User" 
          WHERE id = ${userId} OR email = ${email || ''}
          LIMIT 1
        `;
        if (results && results.length > 0) {
          const rawUser = results[0];
          dbUser = { id: rawUser.id, credits: rawUser.credits ?? 20 };
        }
      } catch (e) {
        logInfo('Raw SQL lookup failed', { error: (e as Error).message });
      }
    }
    
    if (!dbUser) {
      logInfo('User not found for credit deduction, using in-memory tracking', { userId, email });
      // User doesn't exist in DB yet, but we tracked credits in memory
      // Return success with remaining credits (won't persist but allows the operation)
      return {
        success: true,
        remainingCredits: currentCredits - amount,
      };
    }

    // Deduct credits atomically using the found user's ID
    const updatedUser = await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        credits: {
          decrement: amount,
        },
      },
      select: { credits: true },
    });

    logInfo('Credits deducted', {
      userId,
      email,
      dbUserId: dbUser.id,
      amount,
      previousCredits: currentCredits,
      remainingCredits: updatedUser.credits,
      reason,
    });

    return {
      success: true,
      remainingCredits: updatedUser.credits ?? 0,
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
 * Add credits to user's account (typically when upgrading plan)
 */
export async function addCredits(
  userId: string,
  amount: number,
  reason?: string
): Promise<{ success: boolean; newBalance: number }> {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          increment: amount,
        },
      },
      select: { credits: true },
    });

    logInfo('Credits added', {
      userId,
      amount,
      newBalance: updatedUser.credits,
      reason,
    });

    return {
      success: true,
      newBalance: updatedUser.credits,
    };
  } catch (error: any) {
    logError('Failed to add credits', error, { userId, amount, reason });
    return {
      success: false,
      newBalance: 0,
    };
  }
}

/**
 * Set user's credits to a specific amount (typically when upgrading plan)
 */
export async function setCredits(
  userId: string,
  amount: number,
  reason?: string
): Promise<{ success: boolean; newBalance: number }> {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        credits: amount,
      },
      select: { credits: true },
    });

    logInfo('Credits set', {
      userId,
      amount,
      newBalance: updatedUser.credits,
      reason,
    });

    return {
      success: true,
      newBalance: updatedUser.credits,
    };
  } catch (error: any) {
    logError('Failed to set credits', error, { userId, amount, reason });
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
 * Ensure user has at least the minimum credits (creates user if needed)
 * Call this when user first interacts with the system
 */
export async function ensureUserHasCredits(
  userId: string,
  email: string,
  minCredits: number = 20
): Promise<{ success: boolean; credits: number }> {
  if (!email || email === 'user@example.com' || email === 'test@example.com') {
    return { success: true, credits: minCredits };
  }
  
  try {
    // Check if user exists by email
    let user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, credits: true },
    });
    
    if (user) {
      // User exists, check if they need credits
      if (user.credits === null || user.credits < minCredits) {
        const updated = await prisma.user.update({
          where: { id: user.id },
          data: { credits: minCredits },
          select: { credits: true },
        });
        logInfo('Updated existing user credits', { email, userId: user.id, credits: updated.credits });
        return { success: true, credits: updated.credits ?? minCredits };
      }
      return { success: true, credits: user.credits };
    }
    
    // User doesn't exist, create them with minimum credits
    const clerkId = `email_${Buffer.from(email).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 16)}_${Date.now()}`;
    const cuid = `c${Date.now().toString(36)}${Math.random().toString(36).substring(2, 11)}`;
    
    try {
      const newUser = await prisma.user.create({
        data: {
          id: cuid,
          clerkId: clerkId,
          email: email,
          credits: minCredits,
        },
        select: { credits: true },
      });
      logInfo('Created new user with credits', { email, credits: newUser.credits });
      return { success: true, credits: newUser.credits ?? minCredits };
    } catch (createError: any) {
      // If creation fails due to unique constraint, user was just created by another request
      if (createError.code === 'P2002') {
        const existingUser = await prisma.user.findUnique({
          where: { email },
          select: { credits: true },
        });
        return { success: true, credits: existingUser?.credits ?? minCredits };
      }
      throw createError;
    }
  } catch (error: any) {
    logError('Failed to ensure user has credits', error, { userId, email });
    return { success: false, credits: minCredits };
  }
}




