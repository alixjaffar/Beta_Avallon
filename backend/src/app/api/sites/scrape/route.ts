// API endpoint for scraping and importing external websites
// CHANGELOG: 2026-01-09 - Created endpoint with Puppeteer for JS-rendered sites

import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
// Puppeteer is dynamically imported to avoid build-time issues
import type { Browser } from 'puppeteer';

// Request schema
interface ScrapeRequest {
  url: string;
}

/**
 * Convert a relative URL to absolute URL
 */
function resolveUrl(baseUrl: string, relativeUrl: string): string {
  try {
    return new URL(relativeUrl, baseUrl).href;
  } catch {
    return relativeUrl;
  }
}

/**
 * Fetch CSS from an external URL and return its content
 */
async function fetchCSS(cssUrl: string): Promise<string> {
  try {
    const response = await fetch(cssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
      signal: AbortSignal.timeout(10000),
    });
    if (response.ok) {
      return await response.text();
    }
  } catch (error) {
    console.warn(`Failed to fetch CSS from ${cssUrl}:`, error);
  }
  return '';
}

/**
 * Process and clean HTML for import
 */
async function processHtml(html: string, baseUrl: string): Promise<string> {
  const $ = cheerio.load(html);

  // Collect all external CSS URLs before removing link tags
  const cssUrls: string[] = [];
  $('link[rel="stylesheet"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href) {
      cssUrls.push(resolveUrl(baseUrl, href));
    }
  });

  // Fetch all CSS in parallel
  const cssContents = await Promise.all(cssUrls.map(url => fetchCSS(url)));

  // Remove external stylesheet links
  $('link[rel="stylesheet"]').remove();

  // REMOVE ALL SCRIPTS - they will cause errors in iframe
  $('script').remove();

  // Remove noscript tags
  $('noscript').remove();

  // Remove iframes that might cause issues
  $('iframe').remove();

  // Remove link preloads that will fail
  $('link[rel="preload"]').remove();
  $('link[rel="prefetch"]').remove();
  $('link[rel="modulepreload"]').remove();

  // Remove any inline event handlers
  $('[onclick]').removeAttr('onclick');
  $('[onload]').removeAttr('onload');
  $('[onerror]').removeAttr('onerror');
  $('[onmouseover]').removeAttr('onmouseover');
  $('[onmouseout]').removeAttr('onmouseout');
  $('[onsubmit]').removeAttr('onsubmit');
  $('[onchange]').removeAttr('onchange');

  // Fix relative URLs for images
  $('img').each((_, el) => {
    const src = $(el).attr('src');
    if (src && !src.startsWith('data:') && !src.startsWith('http')) {
      $(el).attr('src', resolveUrl(baseUrl, src));
    }
    const srcset = $(el).attr('srcset');
    if (srcset) {
      const fixedSrcset = srcset.split(',').map(part => {
        const [url, size] = part.trim().split(/\s+/);
        if (url && !url.startsWith('data:') && !url.startsWith('http')) {
          return `${resolveUrl(baseUrl, url)} ${size || ''}`.trim();
        }
        return part.trim();
      }).join(', ');
      $(el).attr('srcset', fixedSrcset);
    }
  });

  // Fix background images in inline styles
  $('[style]').each((_, el) => {
    const style = $(el).attr('style');
    if (style && style.includes('url(')) {
      const fixedStyle = style.replace(/url\(['"]?([^'")]+)['"]?\)/g, (match, url) => {
        if (!url.startsWith('data:') && !url.startsWith('http')) {
          return `url('${resolveUrl(baseUrl, url)}')`;
        }
        return match;
      });
      $(el).attr('style', fixedStyle);
    }
  });

  // Fix link hrefs (for navigation)
  $('a').each((_, el) => {
    const href = $(el).attr('href');
    if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:')) {
      if (!href.startsWith('http')) {
        $(el).attr('href', resolveUrl(baseUrl, href));
      }
    }
  });

  // Fix video/source tags
  $('video source, video').each((_, el) => {
    const src = $(el).attr('src');
    if (src && !src.startsWith('http') && !src.startsWith('data:')) {
      $(el).attr('src', resolveUrl(baseUrl, src));
    }
  });

  // Remove meta tags that might cause issues
  $('meta[http-equiv="Content-Security-Policy"]').remove();
  $('meta[http-equiv="refresh"]').remove();

  // Remove base tag that might interfere
  $('base').remove();

  // Combine all external CSS into one style tag
  if (cssContents.length > 0) {
    const combinedCss = cssContents.filter(css => css.length > 0).join('\n\n');
    // Fix URLs in CSS
    const fixedCss = combinedCss.replace(/url\(['"]?([^'")]+)['"]?\)/g, (match, url) => {
      if (!url.startsWith('data:') && !url.startsWith('http') && !url.startsWith('#')) {
        return `url('${resolveUrl(baseUrl, url)}')`;
      }
      return match;
    });

    if (fixedCss.trim()) {
      $('head').append(`<style type="text/css">\n/* Imported CSS */\n${fixedCss}\n</style>`);
    }
  }

  // Inject error suppression script to clean up console
  const errorSuppressor = `
    <script>
      (function() {
        // Suppress common errors from imported sites
        const originalConsoleError = console.error;
        console.error = function() {
          const args = Array.from(arguments);
          const msg = args.join(' ').toLowerCase();
          
          // Filter out noisy errors
          if (
            msg.includes('access-control-allow-origin') ||
            msg.includes('cors') ||
            msg.includes('404') ||
            msg.includes('jquery') ||
            msg.includes('google') ||
            msg.includes('facebook') ||
            msg.includes('analytics') ||
            msg.includes('pixel') ||
            msg.includes('stripe') ||
            msg.includes('socket') ||
            msg.includes('websocket') ||
            msg.includes('security policy') ||
            msg.includes('blocked') ||
            msg.includes('sandbox') ||
            msg.includes('timestamp')
          ) {
            return;
          }
          originalConsoleError.apply(console, args);
        };
        
        // Suppress window errors
        window.addEventListener('error', function(e) {
          if (e.message && (
            e.message.includes('Script error') ||
            e.message.toLowerCase().includes('cors') ||
            e.message.toLowerCase().includes('jquery')
          )) {
            e.stopImmediatePropagation();
            e.preventDefault();
          }
        }, true);
      })();
    </script>
  `;
  $('head').prepend(errorSuppressor);

  // Add meta tags if missing
  if (!$('meta[charset]').length) {
    $('head').prepend('<meta charset="UTF-8">');
  }
  if (!$('meta[name="viewport"]').length) {
    $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
  }

  // Add a comment indicating this is an imported site
  const comment = `<!-- 
    Imported from: ${baseUrl}
    Imported on: ${new Date().toISOString()}
    Processed by Avallon Website Builder
  -->`;

  return comment + '\n' + $.html();
}

/**
 * Use Puppeteer to render JavaScript-heavy sites
 * Dynamically imports puppeteer to avoid build-time issues
 */
async function renderWithPuppeteer(url: string): Promise<string> {
  console.log(`[Scrape] Launching Puppeteer for: ${url}`);

  // Dynamic import to avoid build-time evaluation
  const puppeteer = await import('puppeteer');
  
  const browser: Browser = await puppeteer.default.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
    ],
  });

  try {
    const page = await browser.newPage();

    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });

    // Block unnecessary resources to speed up loading
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const resourceType = req.resourceType();
      // Block analytics, ads, and other non-essential resources
      if (['media', 'font'].includes(resourceType)) {
        req.continue();
      } else if (resourceType === 'script') {
        // Allow scripts to run for rendering
        req.continue();
      } else if (resourceType === 'stylesheet' || resourceType === 'image' || resourceType === 'document') {
        req.continue();
      } else {
        req.abort();
      }
    });

    // Navigate and wait for content to render
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Wait a bit more for any lazy-loaded content
    await new Promise(r => setTimeout(r, 2000));

    // Get the fully rendered HTML
    const html = await page.content();

    console.log(`[Scrape] Puppeteer rendered ${html.length} bytes`);

    return html;
  } finally {
    await browser.close();
  }
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
