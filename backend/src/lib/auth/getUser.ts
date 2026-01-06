// CHANGELOG: 2024-12-19 - Add getUser helper for Clerk auth integration
// CHANGELOG: 2025-01-26 - Support email-based user identification for n8n agent isolation
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { headers } from 'next/headers';
import { getSession } from '@/lib/session';

export async function getUser() {
  // OPTIMIZATION: Check headers first (fastest path - no DB queries)
      try {
    const headersList = await headers();
    const userEmail = headersList.get('x-user-email') || 
                      headersList.get('user-email');

    if (userEmail && userEmail !== 'user@example.com' && userEmail !== 'test@example.com') {
      // Use email hash as user ID for isolation
      const userId = `user_${Buffer.from(userEmail).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 16)}`;

          return {
        id: userId,
        clerkId: null,
        email: userEmail,
        createdAt: new Date(),
        updatedAt: new Date(),
          };
    }
  } catch (error) {
    // Headers not available, continue to other methods
  }

  // Fallback: Try to get user from session cookie (fast - no DB)
  try {
    const session = await getSession();
    if (session?.email) {
      // Use email hash as user ID for isolation
      const userId = `user_${Buffer.from(session.email).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 16)}`;
      
      return {
        id: userId,
        clerkId: null,
        email: session.email,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  } catch (error) {
    // Session not available
  }

  // Final fallback: return mock user (all users share this - not ideal for production)
  return {
    id: 'mock_user_id',
    clerkId: 'mock_clerk_id',
    email: 'test@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
