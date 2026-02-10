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
      
      // Final check: verify we didn't scrape a security checkpoint page
      // Only check title - body might have legitimate mentions
      const lowerTitle = title.toLowerCase();
      
      const checkpointTitlePhrases = [
        'security checkpoint', 'verifying your browser', 'just a moment',
        'checking the site connection', 'checking your connection',
        'vercel security checkpoint', 'browser verification',
        'please wait', 'attention required'
      ];
      
      // Check if the HTML is suspiciously short (likely just a checkpoint page)
      const isLikelyCheckpoint = html.length < 50000 && checkpointTitlePhrases.some(phrase => lowerTitle.includes(phrase));
      
      if (isLikelyCheckpoint) {
        await this.cleanup();
        logError('Scraped content appears to be a security checkpoint page', null, { url: targetUrl, title, htmlLength: html.length });
        throw new Error('SECURITY_CHECKPOINT: The website has bot protection. The scraped content appears to be a security checkpoint page. Please try again or download the HTML manually and use "Import HTML File" instead.');
      }
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
      const pathKeyword = normalizedPath.replace(/^\/+|\/+$/g, '').toLowerCase();
      
      logInfo('🎭 Playwright: Scraping internal page (SPA-aware)', { 
        basePath: this.baseUrl,
        targetPath: normalizedPath,
        targetUrl,
        pathKeyword,
      });
      
      // STRATEGY 1: Try direct navigation first (works for most sites)
      logInfo('🎭 Playwright: Trying direct navigation first', { targetUrl });
      await page.goto(targetUrl, { 
        waitUntil: 'networkidle',
        timeout: this.options.timeout,
      });
      await this.sleep(3000);
      
      // Check if direct navigation worked (not a 404 or redirect to home)
      let pageInfo = await page.evaluate(() => {
        const h1 = document.querySelector('h1')?.textContent?.toLowerCase() || '';
        const title = document.title.toLowerCase();
        const bodyText = document.body.innerText.toLowerCase().slice(0, 1000);
        const currentPath = window.location.pathname;
        return { h1, title, bodyText, bodyLength: document.body.innerHTML.length, currentPath };
      });
      
      const isHomeOrError = pageInfo.currentPath === '/' || 
                           pageInfo.h1.includes('404') || 
                           pageInfo.title.includes('404') ||
                           pageInfo.bodyText.includes('page not found');
      
      // Check if we're on a page that matches our target (title/h1 contains keyword)
      const contentMatchesTarget = pageInfo.h1.includes(pathKeyword) || 
                                   pageInfo.title.includes(pathKeyword) ||
                                   pageInfo.bodyText.includes(pathKeyword);
      
      logInfo('🎭 Playwright: Direct navigation result', { 
        currentPath: pageInfo.currentPath,
        h1: pageInfo.h1.slice(0, 50),
        isHomeOrError,
        contentMatchesTarget,
      });
      
      // STRATEGY 2: If direct nav failed, load homepage and click navigation link
      if (isHomeOrError && !contentMatchesTarget) {
        logInfo('🎭 Playwright: Direct navigation failed, trying SPA click navigation');
        
        await page.goto(this.baseUrl, { 
          waitUntil: 'networkidle',
          timeout: this.options.timeout,
        });
        await this.sleep(3000);
        
        // Get initial H1 to detect page change
        const initialH1 = await page.evaluate(() => document.querySelector('h1')?.textContent || '');
        
        // Find and click navigation link using Playwright's locator API
        const linkSelector = `a[href*="${pathKeyword}"], a[href$="/${pathKeyword}"], a[href$="/${pathKeyword}/"], a:has-text("${pathKeyword}")`;
        const navLink = page.locator(linkSelector).first();
        
        if (await navLink.count() > 0) {
          const linkHref = await navLink.getAttribute('href');
          logInfo('🎭 Playwright: Found nav link, clicking', { href: linkHref, pathKeyword });
          
          // Use Promise.all to wait for navigation while clicking
          try {
            await Promise.all([
              page.waitForURL(url => url.pathname.includes(pathKeyword), { timeout: 10000 }).catch(() => {}),
              navLink.click(),
            ]);
          } catch {
            // Click anyway if navigation wait fails
            await navLink.click().catch(() => {});
          }
          
          // Wait for content to change
          await this.sleep(3000);
          await page.waitForLoadState('networkidle').catch(() => {});
          
          // Wait for H1 to change (indicating page transition)
          const startTime = Date.now();
          while (Date.now() - startTime < 8000) {
            const currentH1 = await page.evaluate(() => document.querySelector('h1')?.textContent || '');
            if (currentH1 !== initialH1 && currentH1.toLowerCase().includes(pathKeyword)) {
              logInfo('🎭 Playwright: H1 changed, page transition detected', { initialH1, currentH1 });
              break;
            }
            await this.sleep(500);
          }
          
          await this.sleep(2000); // Additional wait for content
        } else {
          // Try clicking by visible text
          const textLink = page.getByRole('link', { name: new RegExp(pathKeyword, 'i') }).first();
          if (await textLink.count() > 0) {
            logInfo('🎭 Playwright: Found link by text, clicking');
            await textLink.click().catch(() => {});
            await this.sleep(4000);
            await page.waitForLoadState('networkidle').catch(() => {});
          }
        }
      }
      
      // STRATEGY 3: History API fallback (for hash routers or pushState SPAs)
      pageInfo = await page.evaluate(() => {
        const h1 = document.querySelector('h1')?.textContent?.toLowerCase() || '';
        const title = document.title.toLowerCase();
        const bodyText = document.body.innerText.toLowerCase().slice(0, 1000);
        return { h1, title, bodyText, bodyLength: document.body.innerHTML.length, currentPath: window.location.pathname };
      });
      
      const stillOnHome = pageInfo.currentPath === '/' && !pageInfo.h1.includes(pathKeyword);
      
      if (stillOnHome) {
        logInfo('🎭 Playwright: Still on home, trying History API navigation');
        
        await page.evaluate((path: string) => {
          window.history.pushState({}, '', path);
          window.dispatchEvent(new PopStateEvent('popstate'));
          window.dispatchEvent(new Event('locationchange'));
          window.dispatchEvent(new HashChangeEvent('hashchange'));
        }, normalizedPath);
        
        await this.sleep(4000);
        await page.waitForLoadState('networkidle').catch(() => {});
      }
      
      // Final wait and scroll
      await this.sleep(this.options.waitForJs);
      
      // Check for security checkpoint BEFORE scrolling
      const isSecurityCheckpoint = await this.detectAndWaitForSecurityCheckpoint(page);
      if (isSecurityCheckpoint) {
        logInfo('🔒 Security checkpoint detected on internal page, waiting...', { path: normalizedPath });
        await this.sleep(8000);
        
        // Check again
        const stillOnCheckpoint = await this.detectAndWaitForSecurityCheckpoint(page);
        if (stillOnCheckpoint) {
          logInfo('🔒 Security checkpoint did not resolve, skipping page', { path: normalizedPath });
          await page.close();
          await this.cleanup();
          return null;
        }
      }
      
      await this.autoScroll(page);
      await page.evaluate(() => window.scrollTo(0, 0));
      await this.sleep(500);
      
      const html = await page.content();
      const $ = load(html);
      
      // Double-check the title/content isn't a security checkpoint
      const title = this.extractTitle($);
      const lowerTitle = title.toLowerCase();
      const lowerHtml = html.toLowerCase().slice(0, 3000);
      
      const checkpointPhrases = [
        'security checkpoint', 'verifying your browser', 'just a moment',
        'checking the site connection', 'checking your connection', 
        'cloudflare', 'please wait', 'browser verification',
        'enable cookies', 'requires cookies'
      ];
      
      for (const phrase of checkpointPhrases) {
        if (lowerTitle.includes(phrase) || lowerHtml.includes(phrase)) {
          logInfo('🔒 Page content indicates security checkpoint, skipping', { path: normalizedPath, title, phrase });
          await page.close();
          await this.cleanup();
          return null;
        }
      }
      
      const processedHtml = await this.processHtml(page, html, targetUrl);
      
      await page.close();
      await this.cleanup();
      
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
    
    // Stealth browser args to bypass bot detection
    const stealthArgs = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled',
      '--disable-features=IsolateOrigins,site-per-process',
      '--disable-site-isolation-trials',
      '--disable-web-security',
      '--disable-features=BlockInsecurePrivateNetworkRequests',
      '--allow-running-insecure-content',
      '--window-size=1920,1080',
      '--start-maximized',
    ];
    
    try {
      this.browser = await chromium.launch({
        headless: true,
        args: stealthArgs,
      });
    } catch (error: any) {
      // If browser not found, try to find it manually or fall back to downloading
      if (error.message?.includes('Executable doesn\'t exist') || error.message?.includes('chromium')) {
        logInfo('🎭 Playwright: Chromium not found, attempting to locate or install', { error: error.message });
        
        // Try to find Chromium in common cache locations (both regular and headless shell)
        const { existsSync } = await import('fs');
        const possiblePaths = [
          // Regular Chromium
          '/opt/render/.cache/ms-playwright/chromium-1200/chrome-linux64/chrome',
          `${process.cwd()}/.cache/ms-playwright/chromium-1200/chrome-linux64/chrome`,
          // Headless Shell (what Playwright is looking for)
          '/opt/render/.cache/ms-playwright/chromium_headless_shell-1200/chrome-headless-shell-linux64/chrome-headless-shell',
          `${process.cwd()}/.cache/ms-playwright/chromium_headless_shell-1200/chrome-headless-shell-linux64/chrome-headless-shell`,
          // Environment variable paths
          process.env.PLAYWRIGHT_BROWSERS_PATH ? `${process.env.PLAYWRIGHT_BROWSERS_PATH}/chromium-1200/chrome-linux64/chrome` : null,
          process.env.PLAYWRIGHT_BROWSERS_PATH ? `${process.env.PLAYWRIGHT_BROWSERS_PATH}/chromium_headless_shell-1200/chrome-headless-shell-linux64/chrome-headless-shell` : null,
          // Common Render paths
          '/home/render/.cache/ms-playwright/chromium-1200/chrome-linux64/chrome',
          '/home/render/.cache/ms-playwright/chromium_headless_shell-1200/chrome-headless-shell-linux64/chrome-headless-shell',
        ].filter(Boolean) as string[];
        
        let foundPath: string | null = null;
        
        // Check each path
        for (const path of possiblePaths) {
          try {
            if (existsSync(path)) {
              foundPath = path;
              logInfo('🎭 Playwright: Found browser executable at', { path });
              break;
            }
          } catch {
            // Path check failed, continue
          }
        }
        
        if (foundPath) {
          this.browser = await chromium.launch({
            headless: true,
            executablePath: foundPath,
            args: stealthArgs,
          });
        } else {
          // Last resort: try to install at runtime
          logInfo('🎭 Playwright: Browser not found in cache, attempting runtime installation');
          try {
            const { execSync } = await import('child_process');
            // Install chromium (this will use the headless shell)
            execSync('npx playwright install chromium', { 
              stdio: 'inherit',
              timeout: 120000, // 2 minute timeout
              env: { ...process.env, PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: '0' }
            });
            logInfo('🎭 Playwright: Runtime installation complete, retrying launch');
            
            // Retry launch after installation
            this.browser = await chromium.launch({
              headless: true,
              args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
              ],
            });
          } catch (installError: any) {
            logError('🎭 Playwright: Runtime installation failed', installError);
            // Final fallback: try launch anyway (might work if partially installed)
            this.browser = await chromium.launch({
              headless: true,
              args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
              ],
            });
          }
        }
      } else {
        throw error;
      }
    }
    
    // Create context with realistic browser settings
    this.context = await this.browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
      ignoreHTTPSErrors: true,
      javaScriptEnabled: true,
      locale: 'en-US',
      timezoneId: 'America/New_York',
      geolocation: { longitude: -73.935242, latitude: 40.730610 },
      permissions: ['geolocation'],
      extraHTTPHeaders: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
      },
    });
  }

  private async createPage(): Promise<Page> {
    if (!this.context) {
      await this.initBrowser();
    }
    
    const page = await this.context!.newPage();
    
    // Inject stealth scripts to avoid bot detection
    await page.addInitScript(() => {
      // Override webdriver property
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      
      // Override plugins
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });
      
      // Override languages
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
      });
      
      // Override platform
      Object.defineProperty(navigator, 'platform', {
        get: () => 'Win32',
      });
      
      // Override hardware concurrency
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        get: () => 8,
      });
      
      // Override device memory
      Object.defineProperty(navigator, 'deviceMemory', {
        get: () => 8,
      });
      
      // Mock chrome runtime
      (window as any).chrome = {
        runtime: {},
      };
      
      // Override permissions query
      const originalQuery = window.navigator.permissions.query.bind(window.navigator.permissions);
      Object.defineProperty(window.navigator.permissions, 'query', {
        value: (parameters: any) => {
          if (parameters.name === 'notifications') {
            return Promise.resolve({ state: 'denied' } as any);
          }
          return originalQuery(parameters);
        }
      });
    });
    
    // Block tracking scripts if enabled (but NOT cloudflare/security scripts)
    if (this.options.blockTracking) {
      await page.route('**/*', (route) => {
        const url = route.request().url();
        // Don't block cloudflare or security-related scripts
        if (url.includes('cloudflare') || url.includes('challenge') || url.includes('turnstile')) {
          route.continue();
        } else if (this.BLOCK_PATTERNS.some(pattern => url.includes(pattern))) {
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
      
      // Check for and handle Vercel/Cloudflare security checkpoints with retry
      let isSecurityCheckpoint = await this.detectAndWaitForSecurityCheckpoint(page);
      if (isSecurityCheckpoint) {
        logInfo('🔒 Security checkpoint detected, attempting to resolve...', { url });
        
        // Try multiple times with increasing wait times
        const waitTimes = [5000, 8000, 12000, 15000];
        
        for (let i = 0; i < waitTimes.length; i++) {
          logInfo(`🔄 Waiting for checkpoint to resolve (attempt ${i + 1}/${waitTimes.length})...`, { url, waitMs: waitTimes[i] });
          await this.sleep(waitTimes[i]);
          
          // Check if resolved
          isSecurityCheckpoint = await this.detectAndWaitForSecurityCheckpoint(page);
          if (!isSecurityCheckpoint) {
            logInfo('🔓 Security checkpoint resolved!', { url, attempt: i + 1 });
            break;
          }
          
          // Try refreshing the page on later attempts
          if (i >= 2) {
            logInfo('🔄 Refreshing page to retry checkpoint...', { url });
            try {
              await page.reload({ waitUntil: 'networkidle', timeout: 15000 });
              await this.sleep(3000);
            } catch {
              // Ignore reload errors
            }
          }
        }
        
        // Final check
        if (await this.detectAndWaitForSecurityCheckpoint(page)) {
          logError('Security checkpoint did not resolve after all attempts', null, { url });
          // Don't throw error - return what we have and let the content check catch it
        }
      }
      
      // Scroll to trigger lazy loading
      await this.autoScroll(page);
      
      // Scroll back to top
      await page.evaluate(() => window.scrollTo(0, 0));
      await this.sleep(500);
      
      return await page.content();
      
    } catch (error: any) {
      logError('Navigation failed', error, { url });
      
      // Re-throw security checkpoint errors with helpful message
      if (error.message?.includes('SECURITY_CHECKPOINT')) {
        throw error;
      }
      
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
  
  /**
   * Detect Vercel, Cloudflare, or other security checkpoints
   * Also attempts to click through verification if possible
   */
  private async detectAndWaitForSecurityCheckpoint(page: Page): Promise<boolean> {
    try {
      // First, try to click any verification buttons/checkboxes
      await this.tryClickVerificationElements(page);
      
      const isCheckpoint = await page.evaluate(() => {
        const bodyText = document.body?.innerText?.toLowerCase() || '';
        const title = document.title?.toLowerCase() || '';
        
        // Vercel security checkpoint indicators
        const vercelIndicators = [
          'verifying your browser',
          'security checkpoint',
          'just a moment',
          'checking your browser',
          'ddos protection',
          'please wait while we verify',
          'we\'re verifying',
        ];
        
        // Cloudflare indicators (expanded)
        const cloudflareIndicators = [
          'checking if the site connection is secure',
          'checking the site connection security',
          'checking your connection',
          'enable javascript and cookies',
          'ray id',
          'please wait',
          'this page requires cookies',
          'performance & security by cloudflare',
          'please enable cookies',
          'browser verification',
        ];
        
        const allIndicators = [...vercelIndicators, ...cloudflareIndicators];
        
        for (const indicator of allIndicators) {
          if (bodyText.includes(indicator) || title.includes(indicator)) {
            return true;
          }
        }
        
        // Check for common checkpoint elements
        const hasVercelChallenge = document.querySelector('[data-testid="challenge"]') !== null;
        const hasCloudflareChallenge = document.querySelector('#challenge-running') !== null;
        const hasCloudflareForm = document.querySelector('#challenge-form') !== null;
        const hasCfChallenge = document.querySelector('.cf-browser-verification') !== null;
        const hasTurnstile = document.querySelector('[data-turnstile-callback]') !== null;
        const hasHcaptcha = document.querySelector('.h-captcha') !== null;
        
        return hasVercelChallenge || hasCloudflareChallenge || hasCloudflareForm || hasCfChallenge || hasTurnstile || hasHcaptcha;
      });
      
      return isCheckpoint;
    } catch {
      return false;
    }
  }
  
  /**
   * Try to click verification elements (checkboxes, buttons) on challenge pages
   */
  private async tryClickVerificationElements(page: Page): Promise<void> {
    try {
      // List of possible verification selectors
      const verificationSelectors = [
        // Cloudflare Turnstile
        'input[type="checkbox"]',
        '.cf-turnstile iframe',
        '#turnstile-wrapper input',
        // Generic verify buttons
        'button:has-text("Verify")',
        'button:has-text("Continue")',
        'button:has-text("I am human")',
        'input[type="submit"]',
        // Cloudflare specific
        '#challenge-stage input',
        '.challenge-solve-button',
      ];
      
      for (const selector of verificationSelectors) {
        try {
          const element = page.locator(selector).first();
          if (await element.count() > 0 && await element.isVisible()) {
            await element.click({ timeout: 2000 }).catch(() => {});
            await this.sleep(1000);
          }
        } catch {
          // Ignore click errors
        }
      }
    } catch {
      // Ignore errors
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
    const base = new URL(baseUrl);
    
    // Extract and inline all CSS, cleaning up problematic URLs
    let extractedCSS = await page.evaluate(() => {
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
    
    // Clean up the extracted CSS aggressively
    if (extractedCSS) {
      // Remove blob: URLs (they don't work outside the original browser session)
      extractedCSS = extractedCSS.replace(/url\(['"]?blob:[^'")\s]+['"]?\)/gi, 'url()');
      
      // Remove ALL data: URLs from CSS - they cause "Data URL decoding failed" errors
      // and massively bloat the HTML. Better to lose some inline images than break the site.
      extractedCSS = extractedCSS.replace(/url\(['"]?data:[^'")\s]+['"]?\)/gi, 'url()');
      
      // Fix relative URLs in CSS to absolute
      extractedCSS = extractedCSS.replace(/url\(['"]?(?!data:|http|https|blob:)([^'")\s]+)['"]?\)/gi, (match, url) => {
        try {
          const absoluteUrl = new URL(url, base).href;
          return `url('${absoluteUrl}')`;
        } catch {
          return match;
        }
      });
    }
    
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
    
    // Remove broken image placeholders
    this.cleanupBrokenResources($);
    
    // Add meta tag for imported site
    if (!$('meta[name="avallon-imported"]').length) {
      $('head').prepend(`<meta name="avallon-imported" content="${new Date().toISOString()}">`);
    }
    
    return $.html();
  }
  
  /**
   * Remove broken resource references that can cause errors
   */
  private cleanupBrokenResources($: CheerioAPI): void {
    // Remove images with blob: URLs
    $('img[src^="blob:"]').each((_, el) => {
      const dataSrc = $(el).attr('data-src') || $(el).attr('data-lazy-src');
      if (dataSrc && !dataSrc.startsWith('blob:') && !dataSrc.startsWith('data:')) {
        $(el).attr('src', dataSrc);
      } else {
        $(el).removeAttr('src');
      }
    });
    
    // Remove images with data: URLs (they often get corrupted and cause errors)
    $('img[src^="data:"]').each((_, el) => {
      const dataSrc = $(el).attr('data-src') || $(el).attr('data-lazy-src');
      if (dataSrc && !dataSrc.startsWith('blob:') && !dataSrc.startsWith('data:')) {
        $(el).attr('src', dataSrc);
      }
      // Keep small data URLs (likely valid placeholders), remove large ones
      const src = $(el).attr('src') || '';
      if (src.length > 1000) {
        $(el).removeAttr('src');
        $(el).attr('src', 'about:blank'); // Prevent broken image icon
      }
    });
    
    // Fix data-src and data-lazy-src attributes
    $('img[data-src], img[data-lazy-src]').each((_, el) => {
      const src = $(el).attr('src');
      const dataSrc = $(el).attr('data-src') || $(el).attr('data-lazy-src');
      
      // If src is empty, placeholder, or data URL, use data-src if it's a real URL
      if ((!src || src.includes('placeholder') || src.startsWith('data:') || src === 'about:blank') && 
          dataSrc && !dataSrc.startsWith('blob:') && !dataSrc.startsWith('data:')) {
        $(el).attr('src', dataSrc);
      }
    });
    
    // Remove elements with broken blob: or data: background images in inline styles
    $('[style*="blob:"], [style*="data:image"]').each((_, el) => {
      const style = $(el).attr('style') || '';
      // Remove blob URLs
      let cleanStyle = style.replace(/url\(['"]?blob:[^'")\s]+['"]?\)/gi, 'none');
      // Remove data URLs (they get corrupted)
      cleanStyle = cleanStyle.replace(/url\(['"]?data:[^'")\s]+['"]?\)/gi, 'none');
      $(el).attr('style', cleanStyle);
    });
    
    // Remove preload links for resources we can't load
    $('link[rel="preload"][href^="blob:"]').remove();
    $('link[rel="preload"][href^="data:"]').remove();
    
    // Fix srcset with blob or data URLs
    $('img[srcset*="blob:"], source[srcset*="blob:"], img[srcset*="data:"], source[srcset*="data:"]').each((_, el) => {
      $(el).removeAttr('srcset');
    });
    
    // Remove any remaining very long data: attributes that might cause issues
    $('[src^="data:"]').each((_, el) => {
      const src = $(el).attr('src') || '';
      if (src.length > 5000) {
        $(el).removeAttr('src');
      }
    });
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
      if (!src) return;
      
      // Skip data URLs and absolute URLs
      if (src.startsWith('http://') || src.startsWith('https://')) return;
      
      // Handle blob URLs - try to use data-src instead
      if (src.startsWith('blob:')) {
        const dataSrc = $(el).attr('data-src') || $(el).attr('data-lazy-src');
        if (dataSrc && !dataSrc.startsWith('blob:')) {
          $(el).attr('src', dataSrc.startsWith('http') ? dataSrc : new URL(dataSrc, base).href);
        }
        return;
      }
      
      // Skip data URLs
      if (src.startsWith('data:')) return;
      
      // Convert relative URLs to absolute
      try {
        $(el).attr('src', new URL(src, base).href);
      } catch {
        // Invalid URL, leave as-is
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
    // ONLY remove tracking/analytics - KEEP interactive scripts like carousels
    const trackingPatterns = [
      'google-analytics', 'googletagmanager', 'gtag(',
      'fbevents', 'fbq(', 'pixel',
      'hotjar', 'clarity.ms', 'segment.io',
      'intercom', 'drift', 'crisp',
      'mixpanel', 'amplitude', 'heap',
    ];
    
    // WordPress-specific scripts that ONLY cause issues (not functionality)
    const wordpressProblematicPatterns = [
      'wp-emoji', 'twemoji', 'emoji-release',
      'wpemojiSettings', 'WordPressSettings',
    ];
    
    // Scripts that MUST be kept (carousels, sliders, UI libraries)
    const keepPatterns = [
      'swiper', 'slick', 'owl', 'carousel', 'slider',
      'flickity', 'glide', 'splide', 'keen-slider',
      'lightbox', 'fancybox', 'magnific',
      'gsap', 'anime', 'aos', 'scroll',
      'jquery', 'bootstrap', 'foundation',
      'alpine', 'vue', 'react', 'angular',
      'lodash', 'underscore', 'moment', 'dayjs',
      'popper', 'tippy', 'tooltip',
      'modal', 'dialog', 'popup',
      'accordion', 'tab', 'collapse',
      'form', 'validation', 'input',
      'menu', 'nav', 'dropdown',
    ];
    
    // Safe CDNs that should ALWAYS be kept
    const safeCDNs = [
      'cdnjs', 'unpkg', 'jsdelivr', 'cloudflare', 
      'googleapis', 'gstatic', 'jquery',
      'bootstrapcdn', 'fontawesome', 'swiperjs',
      'npmjs', 'esm.sh', 'skypack',
    ];
    
    $('script').each((_, el) => {
      const src = $(el).attr('src') || '';
      const content = $(el).html() || '';
      const srcLower = src.toLowerCase();
      const contentLower = content.toLowerCase();
      
      // ALWAYS keep scripts that look like UI/interactive libraries
      if (keepPatterns.some(p => srcLower.includes(p) || contentLower.includes(p))) {
        return; // Keep this script
      }
      
      // Remove ONLY tracking scripts
      if (trackingPatterns.some(p => srcLower.includes(p) || contentLower.includes(p))) {
        $(el).remove();
        return;
      }
      
      // Remove ONLY problematic WordPress scripts
      if (wordpressProblematicPatterns.some(p => srcLower.includes(p) || contentLower.includes(p))) {
        $(el).remove();
        return;
      }
      
      // For external scripts, check if they're from safe CDNs
      if (src && !src.startsWith('data:')) {
        try {
          const scriptUrl = new URL(src, this.baseUrl);
          
          // Always keep CDN scripts
          if (safeCDNs.some(cdn => scriptUrl.hostname.includes(cdn))) {
            return; // Keep
          }
          
          // Keep scripts from same domain
          if (scriptUrl.hostname === this.baseDomain) {
            return; // Keep
          }
          
          // Remove ONLY WordPress core scripts that cause CORS issues
          if (scriptUrl.pathname.includes('/wp-includes/') && 
              !keepPatterns.some(p => scriptUrl.pathname.toLowerCase().includes(p))) {
            $(el).remove();
          }
        } catch {
          // Keep script if URL parsing fails - might still be valid
        }
      }
    });
    
    // Remove noscript tracking pixels ONLY
    $('noscript').each((_, el) => {
      const content = $(el).html() || '';
      if (trackingPatterns.some(p => content.toLowerCase().includes(p))) {
        $(el).remove();
      }
    });
    
    // Remove ONLY emoji-related inline scripts (keep all other inline scripts!)
    $('script:not([src])').each((_, el) => {
      const content = $(el).html() || '';
      const contentLower = content.toLowerCase();
      
      // Keep scripts that initialize UI components
      if (keepPatterns.some(p => contentLower.includes(p))) {
        return; // Keep - might be carousel/slider init
      }
      
      // Remove ONLY emoji-related scripts
      if (content.includes('_wpemojiSettings') ||
          content.includes('twemoji.parse') ||
          (content.includes('wp-emoji') && !content.includes('swiper') && !content.includes('slider'))) {
        $(el).remove();
      }
    });
    
    // Remove ONLY WP emoji preloads (keep other preloads)
    $('link[rel="preload"][href*="wp-emoji"]').remove();
    $('link[rel="preload"][href*="twemoji"]').remove();
    // DON'T remove all dns-prefetch - only remove tracking-related ones
    $('link[rel="dns-prefetch"][href*="google-analytics"]').remove();
    $('link[rel="dns-prefetch"][href*="facebook"]').remove();
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
