// CHANGELOG: 2025-01-26 - Helper to add user email to all API requests for data isolation

/**
 * Wrapper around fetch that automatically adds user email header
 * This ensures proper data isolation - each user only sees their own data
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

  // Merge headers
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  
  // Add user email header if available
  if (userEmail) {
    headers.set('x-user-email', userEmail);
  }

  // Make request with updated headers
  return fetch(url, {
    ...options,
    headers,
  });
}
















