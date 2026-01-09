/**
 * Firebase Admin SDK Configuration
 * Used for server-side token verification and user management
 */

import * as admin from 'firebase-admin';
import { NextRequest } from 'next/server';

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "avallon-e0121",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-fbsvc@avallon-e0121.iam.gserviceaccount.com",
      // For development, use the project ID. In production, use the actual private key
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, '\n'),
    }),
    projectId: "avallon-e0121",
  });
}

const auth = admin.auth();

/**
 * Verify Firebase ID token from request
 * Returns decoded token if valid, null if invalid
 */
export async function verifyFirebaseToken(idToken: string): Promise<admin.auth.DecodedIdToken | null> {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Firebase token verification failed:', error);
    return null;
  }
}

/**
 * Extract and verify Firebase token from request
 * Supports Bearer token in Authorization header
 */
export async function verifyRequestAuth(req: NextRequest): Promise<{
  authenticated: boolean;
  user: admin.auth.DecodedIdToken | null;
  error: string | null;
}> {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Fall back to x-user-email header for backward compatibility
      const userEmail = req.headers.get('x-user-email');
      if (userEmail) {
        // Legacy auth - allow but mark as not fully authenticated
        return {
          authenticated: true,
          user: null,
          error: null,
        };
      }
      
      return {
        authenticated: false,
        user: null,
        error: 'No authorization token provided',
      };
    }

    const idToken = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify the token
    const decodedToken = await verifyFirebaseToken(idToken);
    
    if (!decodedToken) {
      return {
        authenticated: false,
        user: null,
        error: 'Invalid or expired token',
      };
    }

    return {
      authenticated: true,
      user: decodedToken,
      error: null,
    };
  } catch (error) {
    console.error('Request auth verification error:', error);
    return {
      authenticated: false,
      user: null,
      error: 'Authentication failed',
    };
  }
}

/**
 * Get user by email from Firebase
 */
export async function getUserByEmail(email: string): Promise<admin.auth.UserRecord | null> {
  try {
    return await auth.getUserByEmail(email);
  } catch (error) {
    return null;
  }
}

/**
 * Get user by UID from Firebase
 */
export async function getUserByUid(uid: string): Promise<admin.auth.UserRecord | null> {
  try {
    return await auth.getUser(uid);
  } catch (error) {
    return null;
  }
}

/**
 * Create custom claims for a user (e.g., admin, premium)
 */
export async function setUserClaims(uid: string, claims: Record<string, any>): Promise<boolean> {
  try {
    await auth.setCustomUserClaims(uid, claims);
    return true;
  } catch (error) {
    console.error('Failed to set user claims:', error);
    return false;
  }
}

/**
 * Revoke all refresh tokens for a user (force logout)
 */
export async function revokeUserTokens(uid: string): Promise<boolean> {
  try {
    await auth.revokeRefreshTokens(uid);
    return true;
  } catch (error) {
    console.error('Failed to revoke user tokens:', error);
    return false;
  }
}

/**
 * Delete a user from Firebase
 */
export async function deleteUser(uid: string): Promise<boolean> {
  try {
    await auth.deleteUser(uid);
    return true;
  } catch (error) {
    console.error('Failed to delete user:', error);
    return false;
  }
}

// Export admin instance for advanced use
export { auth, admin };
