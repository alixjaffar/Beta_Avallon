/**
 * Simple in-memory rate limiter for API routes
 * 
 * SECURITY: Prevents brute force attacks, DDoS, and API abuse
 * 
 * For production at scale, consider using:
 * - Redis-based rate limiting (@upstash/ratelimit)
 * - Cloudflare Rate Limiting
 * - AWS WAF
 */

import { NextRequest, NextResponse } from 'next/server';
import { logError, logInfo } from '@/lib/log';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
// Note: This resets on server restart and doesn't work across multiple instances
// For production, use Redis or similar
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

export interface RateLimitConfig {
  // Maximum requests allowed in the window
  maxRequests: number;
  // Time window in milliseconds
  windowMs: number;
  // Optional: Custom key generator (defaults to IP address)
  keyGenerator?: (req: NextRequest) => string;
  // Optional: Skip rate limiting for certain requests
  skip?: (req: NextRequest) => boolean;
}

/**
 * Get client IP address from request
 */
function getClientIP(req: NextRequest): string {
  // Check various headers for the real IP (when behind proxy/load balancer)
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Take the first IP in the chain (original client)
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = req.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  // Fallback (usually won't work in production behind proxies)
  return 'unknown';
}

/**
 * Check if request should be rate limited
 * Returns null if allowed, or a Response if rate limited
 */
export function checkRateLimit(
  req: NextRequest,
  config: RateLimitConfig
): NextResponse | null {
  // Skip if configured to skip
  if (config.skip && config.skip(req)) {
    return null;
  }
  
  // Generate rate limit key
  const key = config.keyGenerator 
    ? config.keyGenerator(req) 
    : `ip:${getClientIP(req)}`;
  
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  
  if (!entry || entry.resetTime < now) {
    // New window - create entry
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return null; // Allowed
  }
  
  // Existing window - check count
  if (entry.count >= config.maxRequests) {
    // Rate limited
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    logInfo('Rate limit exceeded', { key, count: entry.count, maxRequests: config.maxRequests });
    
    return NextResponse.json(
      { 
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter,
      },
      { 
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(config.maxRequests),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(entry.resetTime / 1000)),
        },
      }
    );
  }
  
  // Increment count
  entry.count++;
  return null; // Allowed
}

/**
 * Create a rate limit middleware function
 */
export function createRateLimiter(config: RateLimitConfig) {
  return (req: NextRequest): NextResponse | null => {
    return checkRateLimit(req, config);
  };
}

// Pre-configured rate limiters for common use cases

/**
 * Standard API rate limiter
 * 100 requests per minute per IP
 */
export const standardRateLimiter = createRateLimiter({
  maxRequests: 100,
  windowMs: 60 * 1000, // 1 minute
});

/**
 * Strict rate limiter for sensitive operations
 * 10 requests per minute per IP
 */
export const strictRateLimiter = createRateLimiter({
  maxRequests: 10,
  windowMs: 60 * 1000, // 1 minute
});

/**
 * Very strict rate limiter for authentication endpoints
 * 5 requests per minute per IP
 */
export const authRateLimiter = createRateLimiter({
  maxRequests: 5,
  windowMs: 60 * 1000, // 1 minute
});

/**
 * Rate limiter for AI generation (expensive operation)
 * 10 requests per 5 minutes per IP
 */
export const generationRateLimiter = createRateLimiter({
  maxRequests: 10,
  windowMs: 5 * 60 * 1000, // 5 minutes
});

/**
 * Rate limiter for scraping/import (resource intensive)
 * 5 requests per 5 minutes per IP
 */
export const scrapingRateLimiter = createRateLimiter({
  maxRequests: 5,
  windowMs: 5 * 60 * 1000, // 5 minutes
});
