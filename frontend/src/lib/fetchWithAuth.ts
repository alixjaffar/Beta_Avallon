/**
 * Secure API client with Firebase token authentication
 * Automatically attaches Firebase ID token to all requests
 */

/**
 * Wrapper around fetch that automatically adds Firebase authentication
 * - Attaches Firebase ID token as Bearer token
 * - Falls back to email header for backward compatibility
 * - Handles token refresh automatically
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Get user email from localStorage session
  let userEmail: string | null = null;
  try {
    const sessionData = localStorage.getItem('avallon_session');
    if (sessionData) {
      const session = JSON.parse(sessionData);
      userEmail = session.email || null;
    }
  } catch (error) {
    // Ignore errors
  }

  // Get Firebase ID token (automatically refreshed if expired)
  // Using dynamic import to avoid blocking app load if Firebase is blocked
  let firebaseToken: string | null = null;
  try {
    const { getIdToken } = await import('./firebase');
    firebaseToken = await getIdToken();
    if (firebaseToken) {
      // Cache the token locally
      localStorage.setItem('firebase_token', firebaseToken);
    }
  } catch (error) {
    // Try to use cached token if Firebase call fails
    firebaseToken = localStorage.getItem('firebase_token');
  }

  // Merge headers
  const headers = new Headers(options.headers);
  
  // Only set Content-Type for non-FormData bodies
  if (!(options.body instanceof FormData)) {
  headers.set('Content-Type', 'application/json');
  }
  
  // Add Firebase Bearer token (primary authentication)
  if (firebaseToken) {
    headers.set('Authorization', `Bearer ${firebaseToken}`);
  }
  
  // Add user email header (fallback/legacy support)
  if (userEmail) {
    headers.set('x-user-email', userEmail);
  }

  // Make request with updated headers
  return fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Include cookies for session management
  });
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  try {
    const sessionData = localStorage.getItem('avallon_session');
    if (!sessionData) return false;
    
    const session = JSON.parse(sessionData);
    return !!session.email;
  } catch {
    return false;
  }
}

/**
 * Get current user's email
 */
export function getCurrentUserEmail(): string | null {
  try {
    const sessionData = localStorage.getItem('avallon_session');
    if (!sessionData) return null;
    
    const session = JSON.parse(sessionData);
    return session.email || null;
  } catch {
    return null;
  }
}

/**
 * Clear authentication data
 */
export function clearAuth(): void {
  localStorage.removeItem('avallon_session');
  localStorage.removeItem('firebase_token');
}
