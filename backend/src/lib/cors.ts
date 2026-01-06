// Shared CORS utility for API routes
// Handles dynamic origin for credentials-based requests
import { NextRequest } from "next/server";

// Allowed origins list - add production URLs as needed
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:3000',
  'https://beta-avallon1.vercel.app',
  'https://avallon.ca',
  'https://www.avallon.ca',
];

// Pattern for Vercel-deployed generated websites
const VERCEL_APP_PATTERN = /^https:\/\/[a-z0-9-]+\.vercel\.app$/;

/**
 * Get CORS headers with dynamic origin support
 * Required when using credentials: 'include' in fetch requests
 * Cannot use '*' for Access-Control-Allow-Origin with credentials
 */
export function getCorsHeaders(req?: NextRequest | null): Record<string, string> {
  let origin: string | null = null;
  
  if (req) {
    // Get origin from request header
    origin = req.headers.get('origin');
    
    // If no origin header, try to get it from referer
    if (!origin) {
      const referer = req.headers.get('referer');
      if (referer) {
        try {
          const url = new URL(referer);
          origin = url.origin;
        } catch {
          // Ignore parsing errors
        }
      }
    }
  }
  
  // Add APP_URL from environment if configured
  const appUrl = process.env.APP_URL;
  const allowedOrigins = appUrl 
    ? [...ALLOWED_ORIGINS, appUrl]
    : ALLOWED_ORIGINS;
  
  // Check if origin is in allowed list or matches Vercel app pattern (for generated websites)
  const isAllowedOrigin = origin && (
    allowedOrigins.some(allowed => origin === allowed || origin?.startsWith(allowed)) ||
    VERCEL_APP_PATTERN.test(origin)
  );
  
  // Use the origin if allowed, otherwise use development default
  const allowedOrigin = isAllowedOrigin 
    ? origin 
    : (process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : allowedOrigins[0]);
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin || 'http://localhost:5173',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-email',
    'Access-Control-Allow-Credentials': 'true',
  };
}

/**
 * Simple CORS headers without credentials (uses wildcard)
 * Use this only for public endpoints that don't need cookies/auth
 */
export const publicCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-email',
};


