// API endpoint for importing websites using SiteMirror scraper
// CHANGELOG: 2026-01-15 - Created endpoint with SiteMirror for advanced website cloning
// Based on: https://github.com/pakelcomedy/SiteMirror/

import { NextRequest, NextResponse } from 'next/server';
import { getCorsHeaders } from '@/lib/cors';
// SiteMirrorScraper is dynamically imported to avoid build-time issues
import { logInfo, logError } from '@/lib/log';

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(req),
  });
}

export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  
  try {
    const body = await req.json();
    const { url } = body;
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
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
        { error: 'Invalid URL format. Please provide a valid HTTP or HTTPS URL.' },
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
        { error: 'Cannot import internal URLs' },
        { status: 403, headers: corsHeaders }
      );
    }
    
    logInfo('Starting SiteMirror import', { url });
    
    // Dynamic import to avoid build-time issues
    const { SiteMirrorScraper } = await import('@/lib/scrapers/site-mirror');
    
    // Initialize SiteMirror scraper
    const scraper = new SiteMirrorScraper(url, {
      maxDepth: 5,
      maxWorkers: 8,
      delay: 500,
      timeout: 15000,
      ignoreRobots: false,
      respectSitemap: true,
    });
    
    // Fetch website content using SiteMirror
    const analysis = await scraper.fetchWebsiteContent(url);
    
    if (!analysis) {
      return NextResponse.json(
        { error: 'Failed to fetch website content. The website may be blocking external access or may require JavaScript rendering.' },
        { status: 500, headers: corsHeaders }
      );
    }
    
    logInfo('SiteMirror import completed', { 
      url, 
      title: analysis.title,
      htmlLength: analysis.html.length,
      imagesCount: analysis.images.length,
      cssCount: analysis.css.external.length
    });
    
    // Return the analyzed content
    return NextResponse.json({
      success: true,
      html: analysis.html,
      title: analysis.title,
      description: analysis.description,
      metadata: {
        colors: analysis.colors,
        fonts: analysis.fonts,
        images: analysis.images,
        css: analysis.css,
        layout: analysis.layout,
        navigation: analysis.navigation,
        sections: analysis.sections,
        textContent: analysis.textContent,
      },
      sourceUrl: url,
      importedAt: new Date().toISOString(),
    }, { headers: corsHeaders });

  } catch (error: any) {
    logError('SiteMirror import failed', error);
    
    // Handle specific error types
    if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
      return NextResponse.json(
        { error: 'Request timed out. The website took too long to respond.' },
        { status: 504, headers: corsHeaders }
      );
    }

    if (error.message?.includes('net::ERR_NAME_NOT_RESOLVED') || error.message?.includes('ENOTFOUND')) {
      return NextResponse.json(
        { error: 'Could not find the website. Please check the URL and try again.' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred while importing the website.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
