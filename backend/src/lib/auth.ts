// CHANGELOG: 2024-12-19 - Add Clerk auth utilities for API routes
import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';

export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) return null;

  // Find or create user in our database
  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    // Get user info from Clerk
    const { user: clerkUser } = await auth();
    if (!clerkUser) return null;

    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
      },
    });
  }

  return user;
}

export async function requireAuth(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}
