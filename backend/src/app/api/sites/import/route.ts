/**
 * API endpoint for importing websites using Playwright-based scraper
 * 
 * This is the recommended approach for Avallon:
 * Playwright + custom crawler for maximum control and reliability
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCorsHeaders } from '@/lib/cors';
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
    const { url, crawl = false, maxPages = 10 } = body;
    
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
    
    logInfo('🎭 Playwright: Starting website import', { url, crawl, maxPages });
    
    // Dynamic import to avoid build-time issues with Playwright
    let PlaywrightScraper;
    try {
      const scraperModule = await import('@/lib/scrapers/playwright-scraper');
      PlaywrightScraper = scraperModule.PlaywrightScraper;
      if (!PlaywrightScraper) {
        throw new Error('PlaywrightScraper not found in module');
      }
    } catch (importError: any) {
      logError('Failed to import PlaywrightScraper', importError);
      return NextResponse.json(
        { error: `Failed to load scraper: ${importError?.message || 'Unknown error'}` },
        { status: 500, headers: corsHeaders }
      );
    }
    
    // Initialize Playwright scraper with optimal settings
    let scraper;
    try {
      scraper = new PlaywrightScraper(url, {
        maxPages: maxPages,
        maxDepth: 2,
        timeout: 60000,       // 60 second timeout
        waitForJs: 5000,      // Wait 5s for JS to render
        blockTracking: true,  // Remove analytics/tracking
        followExternalLinks: false,
      });
    } catch (scraperError: any) {
      logError('Failed to create PlaywrightScraper', scraperError);
      return NextResponse.json(
        { error: `Failed to initialize scraper: ${scraperError?.message || 'Unknown error'}` },
        { status: 500, headers: corsHeaders }
      );
    }
    
    // Fetch website content
    let result;
    try {
      if (crawl) {
        // Crawl entire site
        result = await scraper.crawlSite();
      } else {
        // Single page scrape
        result = await scraper.scrapePage();
      }
    } catch (fetchError: any) {
      logError('Playwright scraping failed', fetchError, { url });
      return NextResponse.json(
        { error: `Failed to fetch website: ${fetchError?.message || 'Unknown error'}` },
        { status: 500, headers: corsHeaders }
      );
    }
    
    if (!result || !result.mainPage.html) {
      return NextResponse.json(
        { error: 'Failed to fetch website content. The website may be blocking automated access or using advanced bot protection.' },
        { status: 500, headers: corsHeaders }
      );
    }
    
    logInfo('✅ Playwright: Import completed', { 
      url, 
      title: result.metadata.title,
      htmlLength: result.mainPage.html.length,
      imagesCount: result.resources.images.length,
      internalPages: result.internalPages.length,
      colors: result.colors.length,
      fonts: result.fonts.length,
    });
    
    // Return the scraped content
    return NextResponse.json({
      success: true,
      html: result.mainPage.html,
      title: result.metadata.title,
      description: result.metadata.description,
      metadata: {
        colors: result.colors,
        fonts: result.fonts,
        images: result.resources.images,
        css: {
          external: result.resources.css,
          inline: '',
          parsed: '',
        },
        layout: {
          hasHeader: result.mainPage.html.includes('<header'),
          hasFooter: result.mainPage.html.includes('<footer'),
          hasNav: result.mainPage.html.includes('<nav'),
          hasSidebar: result.mainPage.html.includes('sidebar'),
        },
        navigation: result.internalPages.map(p => ({
          text: p.title,
          url: p.url,
          path: p.path,
        })),
        sections: [],
        textContent: '',
      },
      internalPages: result.internalPages,
      sourceUrl: url,
      importedAt: new Date().toISOString(),
    }, { headers: corsHeaders });

  } catch (error: any) {
    logError('Playwright import failed', error);
    
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

/**
 * GET endpoint to scrape a specific internal page
 * Used for multi-page imports
 */
export async function GET(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  const { searchParams } = new URL(req.url);
  const baseUrl = searchParams.get('baseUrl');
  const pagePath = searchParams.get('path');
  
  if (!baseUrl || !pagePath) {
    return NextResponse.json(
      { error: 'baseUrl and path are required' },
      { status: 400, headers: corsHeaders }
    );
  }
  
  try {
    const { PlaywrightScraper } = await import('@/lib/scrapers/playwright-scraper');
    const scraper = new PlaywrightScraper(baseUrl, {
      timeout: 60000,
      waitForJs: 5000,
      blockTracking: true,
    });
    
    const page = await scraper.scrapeInternalPage(pagePath);
    
    if (!page) {
      return NextResponse.json(
        { error: 'Failed to scrape internal page' },
        { status: 500, headers: corsHeaders }
      );
    }
    
    return NextResponse.json({
      success: true,
      html: page.html,
      title: page.title,
      path: page.path,
      suggestedFilename: page.suggestedFilename,
    }, { headers: corsHeaders });
    
  } catch (error: any) {
    logError('Internal page scrape failed', error);
    return NextResponse.json(
      { error: error.message || 'Failed to scrape internal page' },
      { status: 500, headers: corsHeaders }
    );
  }
}
