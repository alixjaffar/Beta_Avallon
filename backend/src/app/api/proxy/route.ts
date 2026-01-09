import { NextRequest, NextResponse } from 'next/server';
import { getCorsHeaders } from '@/lib/cors';

/**
 * Proxy endpoint for fetching external websites and resources
 * Used for importing existing websites into Avallon
 * Supports: HTML, CSS, JS, images, fonts
 */
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(req),
  });
}

export async function GET(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  
  try {
    const url = req.nextUrl.searchParams.get('url');
    const type = req.nextUrl.searchParams.get('type') || 'auto'; // auto, html, css, js, image
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Validate URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Block localhost and internal IPs for security
    const hostname = parsedUrl.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.16.') ||
      hostname.endsWith('.local')
    ) {
      return NextResponse.json(
        { error: 'Cannot proxy internal URLs' },
        { status: 403, headers: corsHeaders }
      );
    }
    
    // Fetch the URL with a reasonable timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    try {
      // Determine accept header based on type
      let acceptHeader = '*/*';
      if (type === 'html') {
        acceptHeader = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';
      } else if (type === 'css') {
        acceptHeader = 'text/css,*/*;q=0.1';
      } else if (type === 'js') {
        acceptHeader = 'application/javascript,text/javascript,*/*;q=0.1';
      } else if (type === 'image') {
        acceptHeader = 'image/*,*/*;q=0.8';
      }
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': acceptHeader,
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Referer': parsedUrl.origin,
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        return NextResponse.json(
          { error: `Failed to fetch URL: ${response.status} ${response.statusText}` },
          { status: response.status, headers: corsHeaders }
        );
      }
      
      const contentType = response.headers.get('content-type') || '';
      
      // Determine actual content type and validate
      const isHTML = contentType.includes('text/html') || contentType.includes('application/xhtml+xml');
      const isCSS = contentType.includes('text/css') || url.endsWith('.css');
      const isJS = contentType.includes('javascript') || url.endsWith('.js');
      const isImage = contentType.includes('image/');
      const isFont = contentType.includes('font/') || url.match(/\.(woff2?|ttf|otf|eot)(\?|$)/);
      
      // For auto type, allow HTML, CSS, JS, images, and fonts
      if (type === 'auto' && !isHTML && !isCSS && !isJS && !isImage && !isFont) {
        // Still allow it but warn
        console.warn(`Unexpected content type for ${url}: ${contentType}`);
      }
      
      // For specific types, validate
      if (type === 'html' && !isHTML) {
        return NextResponse.json(
          { error: 'URL does not return HTML content' },
          { status: 400, headers: corsHeaders }
        );
      }
      
      // Return the content with appropriate headers
      if (isImage || isFont) {
        // Binary content
        const buffer = await response.arrayBuffer();
        return new NextResponse(buffer, {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': contentType,
            'X-Original-URL': url,
          },
        });
      } else {
        // Text content
        const text = await response.text();
        
        return new NextResponse(text, {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': contentType || 'text/plain; charset=utf-8',
            'X-Original-URL': url,
          },
        });
      }
      
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timed out' },
          { status: 504, headers: corsHeaders }
        );
      }
      
      return NextResponse.json(
        { error: `Failed to fetch URL: ${fetchError.message}` },
        { status: 502, headers: corsHeaders }
      );
    }
    
  } catch (error: any) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
