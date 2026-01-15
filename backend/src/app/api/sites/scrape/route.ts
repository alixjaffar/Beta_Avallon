// API endpoint for scraping and importing external websites
// CHANGELOG: 2026-01-09 - Created endpoint with Puppeteer for JS-rendered sites

import { NextRequest, NextResponse } from 'next/server';
// All helper functions are in a separate module to avoid build-time evaluation

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

    console.log(`[Scrape] Starting import for: ${targetUrl.href}`);

    // Dynamically import helpers to avoid build-time evaluation
    const { renderWithPuppeteer, processHtml } = await import('@/lib/scrapers/scrape-helpers');

    // Use Puppeteer to render the page (captures JS-rendered content)
    const renderedHtml = await renderWithPuppeteer(targetUrl.href);

    // Process the rendered HTML
    const processedHtml = await processHtml(renderedHtml, targetUrl.href);

    console.log(`[Scrape] Final processed HTML: ${processedHtml.length} bytes`);

    return NextResponse.json({
      success: true,
      html: processedHtml,
      sourceUrl: targetUrl.href,
      importedAt: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('[Scrape] Error:', error);

    // Handle specific error types
    if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
      return NextResponse.json(
        { error: 'Request timed out. The website took too long to respond.' },
        { status: 504 }
      );
    }

    if (error.message?.includes('net::ERR_NAME_NOT_RESOLVED')) {
      return NextResponse.json(
        { error: 'Could not find the website. Please check the URL and try again.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred while importing the website.' },
      { status: 500 }
    );
  }
}
