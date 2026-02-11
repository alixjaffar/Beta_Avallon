import { NextRequest, NextResponse } from 'next/server';
import { logInfo, logError } from '@/lib/log';

// Simple in-memory cache for 403/404 URLs to avoid repeated failures
const failedUrls = new Map<string, number>();
const FAILURE_CACHE_TTL = 300000; // 5 minutes

/**
 * Proxy endpoint for downloading images from external sites
 * This bypasses CORS and hotlinking restrictions that block browser-side fetches
 */
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter required' }, { status: 400 });
  }
  
  // Check if this URL recently failed
  const failedAt = failedUrls.get(url);
  if (failedAt && Date.now() - failedAt < FAILURE_CACHE_TTL) {
    // Return a 1x1 transparent pixel instead of error to avoid console spam
    const transparentPixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    return new NextResponse(transparentPixel, {
      headers: {
        'Content-Type': 'image/gif',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600',
        'X-Proxy-Status': 'cached-failure',
      },
    });
  }
  
  try {
    // Parse and validate the URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }
    
    // SECURITY: Only allow http/https protocols to prevent file:// and other attacks
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return NextResponse.json({ error: 'Invalid protocol' }, { status: 400 });
    }
    
    // SECURITY: Block internal/private IP addresses to prevent SSRF attacks
    const hostname = parsedUrl.hostname.toLowerCase();
    const isInternalIP = 
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname === '::1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.16.') ||
      hostname.startsWith('172.17.') ||
      hostname.startsWith('172.18.') ||
      hostname.startsWith('172.19.') ||
      hostname.startsWith('172.20.') ||
      hostname.startsWith('172.21.') ||
      hostname.startsWith('172.22.') ||
      hostname.startsWith('172.23.') ||
      hostname.startsWith('172.24.') ||
      hostname.startsWith('172.25.') ||
      hostname.startsWith('172.26.') ||
      hostname.startsWith('172.27.') ||
      hostname.startsWith('172.28.') ||
      hostname.startsWith('172.29.') ||
      hostname.startsWith('172.30.') ||
      hostname.startsWith('172.31.') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal') ||
      hostname === 'metadata.google.internal' || // GCP metadata
      hostname === '169.254.169.254'; // AWS/Cloud metadata endpoint
    
    if (isInternalIP) {
      logError('SSRF attempt blocked', null, { url, hostname });
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    
    const origin = parsedUrl.origin;
    logInfo('Proxying image download', { url: url.substring(0, 100) });
    
    const response = await fetch(url, {
      headers: {
        // Mimic a real browser request
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        // Use the original site as the referer to bypass hotlink protection
        'Referer': origin + '/',
        'Origin': origin,
        'Sec-Fetch-Dest': 'image',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'same-origin',
      },
    });
    
    if (!response.ok) {
      logError('Image proxy failed', null, { url, status: response.status });
      // Cache this failure to avoid repeated attempts
      failedUrls.set(url, Date.now());
      // Clean up old entries periodically
      if (failedUrls.size > 1000) {
        const now = Date.now();
        for (const [key, time] of failedUrls.entries()) {
          if (now - time > FAILURE_CACHE_TTL) {
            failedUrls.delete(key);
          }
        }
      }
      
      // Return a transparent pixel for 403/404 errors instead of error response
      // This prevents console errors in the browser
      if (response.status === 403 || response.status === 404) {
        const transparentPixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
        return new NextResponse(transparentPixel, {
          headers: {
            'Content-Type': 'image/gif',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=3600',
            'X-Proxy-Status': 'fallback',
            'X-Original-Status': response.status.toString(),
          },
        });
      }
      
      return NextResponse.json({ error: 'Failed to fetch image' }, { status: response.status });
    }
    
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=604800', // Cache for 7 days
      },
    });
  } catch (error: any) {
    logError('Image proxy error', error, { url });
    // Cache network failures too
    failedUrls.set(url, Date.now());
    
    // Return transparent pixel for network errors
    const transparentPixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    return new NextResponse(transparentPixel, {
      headers: {
        'Content-Type': 'image/gif',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600',
        'X-Proxy-Status': 'error',
        'X-Error-Message': error.message?.substring(0, 100) || 'Unknown error',
      },
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
