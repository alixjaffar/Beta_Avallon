// API endpoint for scraping and importing external websites
// CHANGELOG: 2026-01-15 - Scraper removed, will be replaced

import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - prevents Next.js from analyzing this route at build time
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Request schema
interface ScrapeRequest {
  url: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ScrapeRequest = await request.json();

    if (!body.url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL
    let targetUrl: URL;
    try {
      targetUrl = new URL(body.url);
      if (!['http:', 'https:'].includes(targetUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format. Please provide a valid HTTP or HTTPS URL.' },
        { status: 400 }
      );
    }

    console.log(`[Scrape] Endpoint called (scraper removed, will be replaced): ${targetUrl.href}`);

    // Scraper removed - returning error until new scraper is integrated
    return NextResponse.json(
      { error: 'Website scraping feature is temporarily unavailable. New scraper integration in progress.' },
      { status: 503 }
    );

  } catch (error: any) {
    console.error('[Scrape] Error:', error);

    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
