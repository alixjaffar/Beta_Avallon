/**
 * Playwright-Based Website Scraper for Avallon
 * 
 * A robust, production-ready scraper using Playwright for:
 * - JavaScript-heavy sites (React, Vue, Angular SPAs)
 * - Auth-protected pages
 * - Network interception for resource capture
 * - Intelligent link discovery and crawling
 * - CSS/font/image extraction with URL normalization
 * 
 * This is the recommended approach for Avallon's use case:
 * Playwright + custom crawler layer for maximum control
 */

import { chromium, Browser, Page, BrowserContext } from 'playwright';
import { load, CheerioAPI } from 'cheerio';
import { logInfo, logError } from '@/lib/log';

// ==================== TYPES ====================

export interface ScrapedPage {
  url: string;
  html: string;
  title: string;
  description: string;
  path: string;
  suggestedFilename: string;
}

export interface ScrapedResource {
  url: string;
  type: 'css' | 'js' | 'image' | 'font' | 'other';
  content?: string;
  base64?: string;
}

export interface CrawlResult {
  mainPage: ScrapedPage;
  internalPages: ScrapedPage[];
  resources: {
    css: string[];
    images: string[];
    fonts: string[];
  };
  colors: string[];
  fonts: string[];
  metadata: {
    title: string;
    description: string;
    favicon?: string;
  };
}

export interface PlaywrightScraperOptions {
  maxPages?: number;           // Max pages to crawl (default: 10)
  maxDepth?: number;           // Max link depth (default: 2)
  timeout?: number;            // Page timeout in ms (default: 30000)
  waitForJs?: number;          // Wait for JS to render (default: 3000)
  followExternalLinks?: boolean; // Follow external links (default: false)
  blockTracking?: boolean;     // Block tracking scripts (default: true)
  captureScreenshot?: boolean; // Capture page screenshots (default: false)
  userAgent?: string;          // Custom user agent
}

// ==================== SCRAPER CLASS ====================

export class PlaywrightScraper {
  private baseUrl: string;
  private baseDomain: string;
  private options: Required<PlaywrightScraperOptions>;
  private visitedUrls: Set<string> = new Set();
  private discoveredUrls: Map<string, number> = new Map(); // url -> depth
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;

  // Tracking/analytics patterns to block
  private readonly BLOCK_PATTERNS = [
    'google-analytics', 'googletagmanager', 'gtag', 'ga.js',
    'facebook.net', 'fbevents', 'fbq',
    'doubleclick', 'googlesyndication',
    'hotjar', 'clarity.ms', 'segment.com', 'segment.io',
    'intercom', 'crisp.chat', 'drift.com', 'zendesk',
    'mixpanel', 'amplitude', 'heap', 'fullstory',
    'optimizely', 'crazyegg', 'mouseflow',
  ];

  constructor(url: string, options: PlaywrightScraperOptions = {}) {
    this.baseUrl = url.replace(/\/$/, '');
    this.baseDomain = new URL(url).hostname;
    
    this.options = {
      maxPages: options.maxPages ?? 10,
      maxDepth: options.maxDepth ?? 2,
      timeout: options.timeout ?? 30000,
      waitForJs: options.waitForJs ?? 3000,
      followExternalLinks: options.followExternalLinks ?? false,
      blockTracking: options.blockTracking ?? true,
      captureScreenshot: options.captureScreenshot ?? false,
      userAgent: options.userAgent ?? 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    };
  }

  /**
   * Main entry point: Scrape a single page
   */
  async scrapePage(url?: string): Promise<CrawlResult | null> {
    const targetUrl = url || this.baseUrl;
    
    try {
      logInfo('🎭 Playwright: Starting scrape', { url: targetUrl });
      
      await this.initBrowser();
      const page = await this.createPage();
      
      // Navigate and wait for content
      const html = await this.navigateAndCapture(page, targetUrl);
      if (!html) {
        throw new Error('Failed to capture page content');
      }
      
      // Extract metadata and resources
      const $ = load(html);
      const title = this.extractTitle($);
      const description = this.extractDescription($);
      const colors = this.extractColors($, html);
      const fonts = this.extractFonts($);
      const images = this.extractImages($, targetUrl);
      const cssUrls = this.extractCSSUrls($, targetUrl);
      
      // Discover internal links from RENDERED page using Playwright
      // This is crucial for SPAs where links are dynamically added
      const internalLinks = await this.discoverLinksWithPlaywright(page, targetUrl);
      
      // Process and inline CSS
      const processedHtml = await this.processHtml(page, html, targetUrl);
      
      await page.close();
      await this.cleanup();
      
      const result: CrawlResult = {
        mainPage: {
          url: targetUrl,
          html: processedHtml,
          title,
          description,
          path: '/',
          suggestedFilename: 'index.html',
        },
        internalPages: internalLinks.map(link => ({
          url: link.url,
          html: '',
          title: link.text || '',
          description: '',
          path: link.path,
          suggestedFilename: this.pathToFilename(link.path),
        })),
        resources: {
          css: cssUrls,
          images,
          fonts: [],
        },
        colors,
        fonts,
        metadata: {
          title,
          description,
          favicon: this.extractFavicon($, targetUrl),
        },
      };
      
      logInfo('✅ Playwright: Scrape complete', {
        url: targetUrl,
        htmlLength: processedHtml.length,
        internalPages: internalLinks.length,
        links: internalLinks.map(l => l.path),
        colors: colors.length,
        fonts: fonts.length,
      });
      
      return result;
      
    } catch (error: any) {
      logError('Playwright scrape failed', error, { url: targetUrl });
      await this.cleanup();
      return null;
    }
  }

  /**
   * Discover all internal links using Playwright (gets links from rendered DOM)
   * This is essential for SPAs where navigation links are dynamically injected
   */
  private async discoverLinksWithPlaywright(page: Page, pageUrl: string): Promise<Array<{ url: string; path: string; text: string }>> {
    const baseDomain = this.baseDomain;
    
    const links = await page.evaluate((domain: string) => {
      const results: Array<{ url: string; path: string; text: string }> = [];
      const seen = new Set<string>();
      
      // Get all anchor tags (convert NodeList to Array for iteration)
      const anchors = Array.from(document.querySelectorAll('a[href]'));
      
      for (const anchor of anchors) {
        const href = anchor.getAttribute('href');
        if (!href) continue;
        
        // Skip non-page links
        if (href.startsWith('#') || 
            href.startsWith('mailto:') || 
            href.startsWith('tel:') ||
            href.startsWith('javascript:')) {
          continue;
        }
        
        try {
          // Resolve relative URLs
          const url = new URL(href, window.location.origin);
          
          // Only internal links (same domain)
          if (url.hostname !== domain && !url.hostname.endsWith('.' + domain)) {
            continue;
          }
          
          // Normalize path
          let path = url.pathname.replace(/\/+$/, '') || '/';
          
          // Skip file extensions that aren't pages
          if (/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|pdf|zip|xml|json)$/i.test(path)) {
            continue;
          }
          
          // Skip if already seen
          if (seen.has(path)) continue;
          seen.add(path);
          
          // Skip homepage (we already have it)
          if (path === '/' || path === '') continue;
          
          const text = anchor.textContent?.trim().slice(0, 50) || path;
          
          results.push({
            url: url.href.replace(/\/+$/, ''),
            path,
            text,
          });
        } catch {
          // Invalid URL, skip
        }
      }
      
      return results;
    }, baseDomain);
    
    logInfo('🔍 Playwright: Discovered internal links', { 
      count: links.length,
      paths: links.map(l => l.path),
    });
    
    return links;
  }

  /**
   * Crawl multiple pages starting from the base URL
   */
  async crawlSite(): Promise<CrawlResult | null> {
    try {
      logInfo('🎭 Playwright: Starting site crawl', { 
        baseUrl: this.baseUrl,
        maxPages: this.options.maxPages,
        maxDepth: this.options.maxDepth,
      });
      
      await this.initBrowser();
      
      // Start with the main page
      this.discoveredUrls.set(this.baseUrl, 0);
      const pages: ScrapedPage[] = [];
      let mainResult: CrawlResult | null = null;
      
      while (this.discoveredUrls.size > 0 && pages.length < this.options.maxPages) {
        // Get next URL to crawl
        const [nextUrl, depth] = this.getNextUrl();
        if (!nextUrl || depth > this.options.maxDepth) break;
        
        this.visitedUrls.add(nextUrl);
        this.discoveredUrls.delete(nextUrl);
        
        const page = await this.createPage();
        const html = await this.navigateAndCapture(page, nextUrl);
        
        if (html) {
          const $ = load(html);
          const processedHtml = await this.processHtml(page, html, nextUrl);
          
          const scrapedPage: ScrapedPage = {
            url: nextUrl,
            html: processedHtml,
            title: this.extractTitle($),
            description: this.extractDescription($),
            path: new URL(nextUrl).pathname,
            suggestedFilename: this.pathToFilename(new URL(nextUrl).pathname),
          };
          
          pages.push(scrapedPage);
          
          // Discover more links from this page
          if (depth < this.options.maxDepth) {
            const links = this.discoverInternalLinks($, nextUrl);
            for (const link of links) {
              if (!this.visitedUrls.has(link.url) && !this.discoveredUrls.has(link.url)) {
                this.discoveredUrls.set(link.url, depth + 1);
              }
            }
          }
          
          // Use first page as main result
          if (!mainResult) {
            mainResult = {
              mainPage: scrapedPage,
              internalPages: [],
              resources: {
                css: this.extractCSSUrls($, nextUrl),
                images: this.extractImages($, nextUrl),
                fonts: [],
              },
              colors: this.extractColors($, processedHtml),
              fonts: this.extractFonts($),
              metadata: {
                title: scrapedPage.title,
                description: scrapedPage.description,
                favicon: this.extractFavicon($, nextUrl),
              },
            };
          }
        }
        
        await page.close();
      }
      
      await this.cleanup();
      
      if (mainResult && pages.length > 1) {
        mainResult.internalPages = pages.slice(1);
      }
      
      logInfo('✅ Playwright: Site crawl complete', {
        pagesScraped: pages.length,
        urlsDiscovered: this.visitedUrls.size,
      });
      
      return mainResult;
      
    } catch (error: any) {
      logError('Playwright crawl failed', error);
      await this.cleanup();
      return null;
    }
  }

  /**
   * Scrape a specific internal page (for SPA navigation)
   * Uses multiple strategies to ensure we get the actual page content
   */
  async scrapeInternalPage(pagePath: string): Promise<ScrapedPage | null> {
    try {
      await this.initBrowser();
      const page = await this.createPage();
      
      // Normalize the path
      const normalizedPath = pagePath.startsWith('/') ? pagePath : '/' + pagePath;
      const targetUrl = new URL(normalizedPath, this.baseUrl).href;
      
      logInfo('🎭 Playwright: Scraping internal page (SPA-aware)', { 
        basePath: this.baseUrl,
        targetPath: normalizedPath,
        targetUrl,
      });
      
      // STRATEGY 1: Load homepage first, then click on navigation link
      await page.goto(this.baseUrl, { 
        waitUntil: 'networkidle',
        timeout: this.options.timeout,
      });
      await this.sleep(3000); // Wait for SPA to fully initialize
      
      // Try to find and click a link that navigates to this page
      const linkClicked = await page.evaluate((targetPath: string) => {
        const normalizedTarget = targetPath.toLowerCase().replace(/^\/+|\/+$/g, '');
        const links = Array.from(document.querySelectorAll('a[href]'));
        
        for (const link of links) {
          const href = link.getAttribute('href') || '';
          const normalizedHref = href.toLowerCase().replace(/^\/+|\/+$/g, '').replace(/^https?:\/\/[^/]+\/?/, '');
          
          // Match by path
          if (normalizedHref === normalizedTarget || 
              normalizedHref === normalizedTarget + '/' ||
              href.endsWith(targetPath) ||
              href.endsWith(targetPath + '/')) {
            console.log('Clicking navigation link:', href);
            (link as HTMLElement).click();
            return { clicked: true, href };
          }
        }
        return { clicked: false, href: null };
      }, normalizedPath);
      
      if (linkClicked.clicked) {
        logInfo('🎭 Playwright: Clicked SPA navigation link', { link: linkClicked.href });
        await this.sleep(3000); // Wait for SPA navigation
        await page.waitForLoadState('networkidle').catch(() => {});
      } else {
        // STRATEGY 2: Try direct URL navigation (works for server-rendered pages)
        logInfo('🎭 Playwright: No nav link found, trying direct navigation', { targetUrl });
        await page.goto(targetUrl, {
          waitUntil: 'networkidle',
          timeout: this.options.timeout,
        });
        await this.sleep(3000);
      }
      
      // Wait for content to render
      await this.sleep(this.options.waitForJs);
      
      // Scroll to trigger lazy loading
      await this.autoScroll(page);
      await page.evaluate(() => window.scrollTo(0, 0));
      await this.sleep(500);
      
      // Check if we got a 404 page
      const pageInfo = await page.evaluate(() => {
        const h1 = document.querySelector('h1')?.textContent?.toLowerCase() || '';
        const title = document.title.toLowerCase();
        const bodyText = document.body.innerText.toLowerCase().slice(0, 500);
        return { h1, title, bodyText, bodyLength: document.body.innerHTML.length };
      });
      
      // If it looks like a 404, try one more strategy: use History API
      if ((pageInfo.h1.includes('404') || pageInfo.title.includes('404') || 
           pageInfo.h1.includes('not found') || pageInfo.bodyText.includes('page not found')) &&
          pageInfo.bodyLength < 5000) {
        logInfo('🎭 Playwright: Got 404, trying History API navigation');
        
        // Go back to homepage
        await page.goto(this.baseUrl, { waitUntil: 'networkidle', timeout: this.options.timeout });
        await this.sleep(2000);
        
        // Use History API
        await page.evaluate((path: string) => {
          window.history.pushState({}, '', path);
          window.dispatchEvent(new PopStateEvent('popstate'));
          // Also dispatch a custom event that some routers listen to
          window.dispatchEvent(new Event('locationchange'));
        }, normalizedPath);
        
        await this.sleep(3000);
      }
      
      const html = await page.content();
      const $ = load(html);
      const processedHtml = await this.processHtml(page, html, targetUrl);
      
      await page.close();
      await this.cleanup();
      
      const title = this.extractTitle($);
      
      logInfo('🎭 Playwright: Internal page scraped', { 
        path: normalizedPath, 
        title,
        htmlLength: processedHtml.length,
      });
      
      return {
        url: targetUrl,
        html: processedHtml,
        title,
        description: this.extractDescription($),
        path: normalizedPath,
        suggestedFilename: this.pathToFilename(normalizedPath),
      };
      
    } catch (error: any) {
      logError('Playwright internal page scrape failed', error, { pagePath });
      await this.cleanup();
      return null;
    }
  }

  // ==================== BROWSER MANAGEMENT ====================

  private async initBrowser(): Promise<void> {
    if (this.browser) return;
    
    this.browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });
    
    this.context = await this.browser.newContext({
      userAgent: this.options.userAgent,
      viewport: { width: 1920, height: 1080 },
      ignoreHTTPSErrors: true,
    });
  }

  private async createPage(): Promise<Page> {
    if (!this.context) {
      await this.initBrowser();
    }
    
    const page = await this.context!.newPage();
    
    // Block tracking scripts if enabled
    if (this.options.blockTracking) {
      await page.route('**/*', (route) => {
        const url = route.request().url();
        if (this.BLOCK_PATTERNS.some(pattern => url.includes(pattern))) {
          route.abort();
        } else {
          route.continue();
        }
      });
    }
    
    return page;
  }

  private async cleanup(): Promise<void> {
    if (this.context) {
      await this.context.close();
      this.context = null;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  // ==================== NAVIGATION ====================

  private async navigateAndCapture(page: Page, url: string): Promise<string | null> {
    try {
      // Navigate with network idle detection
      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: this.options.timeout,
      });
      
      // Wait for JavaScript to render
      await this.sleep(this.options.waitForJs);
      
      // Scroll to trigger lazy loading
      await this.autoScroll(page);
      
      // Scroll back to top
      await page.evaluate(() => window.scrollTo(0, 0));
      await this.sleep(500);
      
      return await page.content();
      
    } catch (error: any) {
      logError('Navigation failed', error, { url });
      
      // Try with domcontentloaded as fallback
      try {
        await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: this.options.timeout,
        });
        await this.sleep(this.options.waitForJs);
        return await page.content();
      } catch {
        return null;
      }
    }
  }

  private async navigateWithinSPA(page: Page, targetPath: string): Promise<boolean> {
    try {
      // Method 1: Find and click a link that matches the path
      const linkClicked = await page.evaluate((path: string) => {
        const normalizedPath = path.startsWith('/') ? path : '/' + path;
        const links = Array.from(document.querySelectorAll('a[href]'));
        
        for (const link of links) {
          const href = link.getAttribute('href') || '';
          const linkPath = href.startsWith('/') ? href : '/' + href;
          
          if (linkPath === normalizedPath || 
              linkPath === normalizedPath.replace(/\/$/, '') ||
              href === path ||
              href === path.replace(/^\//, '')) {
            (link as HTMLElement).click();
            return true;
          }
        }
        return false;
      }, targetPath);
      
      if (linkClicked) {
        await this.sleep(2000);
        await page.waitForLoadState('networkidle').catch(() => {});
        return true;
      }
      
      // Method 2: Use History API for SPAs
      await page.evaluate((path: string) => {
        const normalizedPath = path.startsWith('/') ? path : '/' + path;
        window.history.pushState({}, '', normalizedPath);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }, targetPath);
      
      await this.sleep(2000);
      return true;
      
    } catch (error) {
      return false;
    }
  }

  private async autoScroll(page: Page): Promise<void> {
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 300;
        const delay = 100;
        
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, delay);
        
        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(timer);
          resolve();
        }, 10000);
      });
    });
  }

  // ==================== CONTENT EXTRACTION ====================

  private async processHtml(page: Page, html: string, baseUrl: string): Promise<string> {
    const $ = load(html);
    
    // Extract and inline all CSS
    const extractedCSS = await page.evaluate(() => {
      const styles: string[] = [];
      
      // Get all stylesheet rules (convert StyleSheetList to Array)
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          if (sheet.cssRules) {
            for (const rule of Array.from(sheet.cssRules)) {
              styles.push(rule.cssText);
            }
          }
        } catch (e) {
          // Cross-origin stylesheet, skip
        }
      }
      
      return styles.join('\n');
    });
    
    // Remove external stylesheets (we've inlined them)
    $('link[rel="stylesheet"]').remove();
    
    // Add inlined CSS
    if (extractedCSS) {
      $('head').append(`<style data-avallon-inlined="true">${extractedCSS}</style>`);
    }
    
    // Fix all resource URLs to absolute (images, scripts, etc.)
    this.fixUrls($, baseUrl);
    
    // IMPORTANT: Convert internal navigation links to local page references
    this.convertNavigationLinks($, baseUrl);
    
    // Remove tracking scripts
    this.removeTrackingScripts($);
    
    // Add meta tag for imported site
    if (!$('meta[name="avallon-imported"]').length) {
      $('head').prepend(`<meta name="avallon-imported" content="${new Date().toISOString()}">`);
    }
    
    return $.html();
  }

  /**
   * Convert internal navigation links to local page references
   * e.g., https://example.com/about -> about.html
   *       /contact -> contact.html
   */
  private convertNavigationLinks($: CheerioAPI, baseUrl: string): void {
    const base = new URL(baseUrl);
    
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (!href) return;
      
      // Skip external links, anchors, mailto, tel, javascript
      if (href.startsWith('mailto:') || 
          href.startsWith('tel:') || 
          href.startsWith('javascript:') ||
          href.startsWith('#')) {
        return;
      }
      
      try {
        // Parse the href to get the full URL
        const linkUrl = new URL(href, base);
        
        // Only convert internal links (same domain)
        if (linkUrl.hostname !== this.baseDomain) {
          return;
        }
        
        // Convert to local page reference
        let path = linkUrl.pathname;
        
        // Handle root path
        if (path === '/' || path === '') {
          $(el).attr('href', 'index.html');
          return;
        }
        
        // Remove leading slash and convert to filename
        path = path.replace(/^\/+/, '').replace(/\/+$/, '');
        
        // Handle paths with multiple segments (e.g., /blog/post -> blog-post.html)
        const filename = path.replace(/\//g, '-') || 'index';
        
        // Add .html extension if not present
        const localHref = filename.endsWith('.html') ? filename : `${filename}.html`;
        
        $(el).attr('href', localHref);
        
        // Also add a data attribute with the original URL for reference
        $(el).attr('data-original-href', href);
        
      } catch {
        // Invalid URL, leave as-is
      }
    });
  }

  private fixUrls($: CheerioAPI, baseUrl: string): void {
    const base = new URL(baseUrl);
    
    // Fix image sources
    $('img[src]').each((_, el) => {
      const src = $(el).attr('src');
      if (src && !src.startsWith('data:') && !src.startsWith('http')) {
        $(el).attr('src', new URL(src, base).href);
      }
    });
    
    // Fix link hrefs (but not navigation links - keep those relative for the editor)
    $('link[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && !href.startsWith('http') && !href.startsWith('data:')) {
        $(el).attr('href', new URL(href, base).href);
      }
    });
    
    // Fix script sources
    $('script[src]').each((_, el) => {
      const src = $(el).attr('src');
      if (src && !src.startsWith('http') && !src.startsWith('data:')) {
        $(el).attr('src', new URL(src, base).href);
      }
    });
    
    // Fix background images in inline styles
    $('[style*="url("]').each((_, el) => {
      const style = $(el).attr('style');
      if (style) {
        const fixed = style.replace(/url\(['"]?([^'")\s]+)['"]?\)/g, (match, url) => {
          if (url.startsWith('data:') || url.startsWith('http')) return match;
          return `url('${new URL(url, base).href}')`;
        });
        $(el).attr('style', fixed);
      }
    });
    
    // Fix source srcset
    $('source[srcset], img[srcset]').each((_, el) => {
      const srcset = $(el).attr('srcset');
      if (srcset) {
        const fixed = srcset.split(',').map(part => {
          const [url, descriptor] = part.trim().split(/\s+/);
          if (url && !url.startsWith('data:') && !url.startsWith('http')) {
            return `${new URL(url, base).href} ${descriptor || ''}`.trim();
          }
          return part;
        }).join(', ');
        $(el).attr('srcset', fixed);
      }
    });
  }

  private removeTrackingScripts($: CheerioAPI): void {
    const trackingPatterns = [
      'google-analytics', 'googletagmanager', 'gtag',
      'facebook', 'fb', 'pixel',
      'hotjar', 'clarity', 'segment',
      'intercom', 'drift', 'crisp',
    ];
    
    $('script').each((_, el) => {
      const src = $(el).attr('src') || '';
      const content = $(el).html() || '';
      
      if (trackingPatterns.some(p => src.includes(p) || content.includes(p))) {
        $(el).remove();
      }
    });
    
    // Remove noscript tracking pixels
    $('noscript').each((_, el) => {
      const content = $(el).html() || '';
      if (trackingPatterns.some(p => content.includes(p))) {
        $(el).remove();
      }
    });
  }

  // ==================== METADATA EXTRACTION ====================

  private extractTitle($: CheerioAPI): string {
    return $('title').first().text().trim() ||
           $('meta[property="og:title"]').attr('content') ||
           $('h1').first().text().trim() ||
           'Untitled Page';
  }

  private extractDescription($: CheerioAPI): string {
    return $('meta[name="description"]').attr('content') ||
           $('meta[property="og:description"]').attr('content') ||
           $('p').first().text().trim().slice(0, 160) ||
           '';
  }

  private extractFavicon($: CheerioAPI, baseUrl: string): string | undefined {
    const favicon = $('link[rel="icon"], link[rel="shortcut icon"]').attr('href');
    if (favicon) {
      return favicon.startsWith('http') ? favicon : new URL(favicon, baseUrl).href;
    }
    return undefined;
  }

  private extractColors($: CheerioAPI, html: string): string[] {
    const colors = new Set<string>();
    
    // Extract from inline styles
    const styleMatches = html.match(/(?:color|background(?:-color)?)\s*:\s*([^;}"']+)/gi) || [];
    for (const match of styleMatches) {
      const color = match.split(':')[1]?.trim();
      if (color && this.isValidColor(color)) {
        colors.add(color.toLowerCase());
      }
    }
    
    // Extract hex colors
    const hexMatches = html.match(/#(?:[0-9a-fA-F]{3}){1,2}\b/g) || [];
    for (const hex of hexMatches) {
      colors.add(hex.toLowerCase());
    }
    
    // Extract rgb/rgba colors
    const rgbMatches = html.match(/rgba?\s*\([^)]+\)/gi) || [];
    for (const rgb of rgbMatches) {
      colors.add(rgb.toLowerCase());
    }
    
    return Array.from(colors).slice(0, 20);
  }

  private extractFonts($: CheerioAPI): string[] {
    const fonts = new Set<string>();
    
    // From Google Fonts links
    $('link[href*="fonts.googleapis.com"]').each((_, el) => {
      const href = $(el).attr('href') || '';
      const familyMatch = href.match(/family=([^&:]+)/);
      if (familyMatch) {
        familyMatch[1].split('|').forEach(f => fonts.add(f.replace(/\+/g, ' ')));
      }
    });
    
    // From CSS font-family declarations
    const fontMatches = $.html().match(/font-family\s*:\s*([^;}"']+)/gi) || [];
    for (const match of fontMatches) {
      const families = match.split(':')[1]?.trim();
      if (families) {
        families.split(',').forEach(f => {
          const clean = f.trim().replace(/["']/g, '');
          if (clean && !['inherit', 'initial', 'unset', 'sans-serif', 'serif', 'monospace'].includes(clean.toLowerCase())) {
            fonts.add(clean);
          }
        });
      }
    }
    
    return Array.from(fonts).slice(0, 10);
  }

  private extractImages($: CheerioAPI, baseUrl: string): string[] {
    const images: string[] = [];
    const base = new URL(baseUrl);
    
    $('img[src]').each((_, el) => {
      const src = $(el).attr('src');
      if (src && !src.startsWith('data:')) {
        const absoluteUrl = src.startsWith('http') ? src : new URL(src, base).href;
        if (!images.includes(absoluteUrl)) {
          images.push(absoluteUrl);
        }
      }
    });
    
    return images.slice(0, 50);
  }

  private extractCSSUrls($: CheerioAPI, baseUrl: string): string[] {
    const cssUrls: string[] = [];
    const base = new URL(baseUrl);
    
    $('link[rel="stylesheet"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href) {
        const absoluteUrl = href.startsWith('http') ? href : new URL(href, base).href;
        if (!cssUrls.includes(absoluteUrl)) {
          cssUrls.push(absoluteUrl);
        }
      }
    });
    
    return cssUrls;
  }

  // ==================== LINK DISCOVERY ====================

  private discoverInternalLinks($: CheerioAPI, pageUrl: string): Array<{ url: string; path: string; text: string }> {
    const links: Array<{ url: string; path: string; text: string }> = [];
    const seen = new Set<string>();
    const base = new URL(pageUrl);
    
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim();
      
      if (!href || 
          href.startsWith('#') || 
          href.startsWith('mailto:') || 
          href.startsWith('tel:') ||
          href.startsWith('javascript:')) {
        return;
      }
      
      try {
        const url = new URL(href, base);
        
        // Only internal links
        if (url.hostname !== this.baseDomain) return;
        
        // Normalize the URL
        const normalizedUrl = `${url.protocol}//${url.hostname}${url.pathname}`.replace(/\/$/, '');
        
        if (seen.has(normalizedUrl)) return;
        seen.add(normalizedUrl);
        
        // Skip common non-page URLs
        if (/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|pdf|zip)$/i.test(url.pathname)) {
          return;
        }
        
        links.push({
          url: normalizedUrl,
          path: url.pathname || '/',
          text: text.slice(0, 50),
        });
      } catch {
        // Invalid URL, skip
      }
    });
    
    return links;
  }

  // ==================== UTILITIES ====================

  private getNextUrl(): [string | null, number] {
    for (const [url, depth] of this.discoveredUrls) {
      if (!this.visitedUrls.has(url)) {
        return [url, depth];
      }
    }
    return [null, 0];
  }

  private pathToFilename(path: string): string {
    if (!path || path === '/') return 'index.html';
    
    const clean = path.replace(/^\/+|\/+$/g, '').replace(/[^a-zA-Z0-9-_/]/g, '-');
    const parts = clean.split('/');
    const name = parts[parts.length - 1] || 'page';
    
    return name.endsWith('.html') ? name : `${name}.html`;
  }

  private isValidColor(color: string): boolean {
    const invalid = ['inherit', 'initial', 'unset', 'transparent', 'currentColor', 'none'];
    return !invalid.includes(color.toLowerCase()) && color.length > 0;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ==================== CONVENIENCE FUNCTION ====================

/**
 * Quick scrape function for importing a website
 */
export async function scrapeWebsite(url: string, options?: PlaywrightScraperOptions): Promise<CrawlResult | null> {
  const scraper = new PlaywrightScraper(url, options);
  return scraper.scrapePage();
}

/**
 * Crawl an entire site
 */
export async function crawlWebsite(url: string, options?: PlaywrightScraperOptions): Promise<CrawlResult | null> {
  const scraper = new PlaywrightScraper(url, options);
  return scraper.crawlSite();
}
