// CHANGELOG: 2024-12-19 - Add getUser helper for Clerk auth integration
// CHANGELOG: 2025-01-26 - Support email-based user identification for n8n agent isolation
// CHANGELOG: 2026-03-20 - Resolve user from Firebase ID token when x-user-email missing (fixes Stripe checkout without headers)
import { headers } from 'next/headers';
import { getSession } from '@/lib/session';
import { verifyFirebaseToken } from '@/lib/firebase-admin';
import { getUserIdFromEmail } from '@/lib/auth/userId';

export async function getUser() {
  try {
    const headersList = await headers();
    const userEmail =
      headersList.get('x-user-email') || headersList.get('user-email');

    if (userEmail && userEmail !== 'user@example.com' && userEmail !== 'test@example.com') {
      const userId = getUserIdFromEmail(userEmail);
      return {
        id: userId,
        clerkId: null,
        email: userEmail,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    // Firebase Bearer token (sent by fetchWithAuth) — required when x-user-email is absent
    const authHeader = headersList.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const idToken = authHeader.slice(7);
      const decoded = await verifyFirebaseToken(idToken);
      const email = decoded?.email;
      if (email && email !== 'test@example.com' && email !== 'user@example.com') {
        return {
          id: getUserIdFromEmail(email),
          clerkId: null,
          email,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    }
  } catch (error) {
    // Continue to session / mock
  }

  // Fallback: Try to get user from session cookie (fast - no DB)
  try {
    const session = await getSession();
    if (session?.email) {
      const userId = getUserIdFromEmail(session.email);
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
