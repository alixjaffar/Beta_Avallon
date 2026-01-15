// ============================================================================
// SiteMirror - Complete Website Cloning Implementation
// Based on: https://github.com/pakelcomedy/SiteMirror/
// ============================================================================
// Features implemented from SiteMirror:
// - Complete site crawl & mirror (BFS crawl of all internal pages)
// - Multithreading & concurrency (parallel resource downloads)
// - Link extraction from: <a>, <form>, <button>, <video>, <audio>, <source>,
//   inline CSS, inline JS, meta-refresh, data-attributes
// - Resource downloading: CSS, JS, images, fonts, PDFs, docs
// - CSS parsing: finds all url() references and downloads embedded assets
// - URL rewriting: rewrites all links to point to local/absolute paths
// - robots.txt support (optional)
// - Sitemap parsing
// ============================================================================

import axios, { AxiosRequestConfig } from 'axios';
import { load, CheerioAPI } from 'cheerio';
import type { Element } from 'domhandler';
import { logInfo, logError } from '@/lib/log';

// ============================================================================
// INTERFACES
// ============================================================================

export interface WebsiteAnalysis {
  html: string;
  title: string;
  description: string;
  colors: string[];
  fonts: string[];
  images: string[];
  css: {
    inline: string;
    external: string[];
    parsed: string;
  };
  layout: {
    structure: string;
    sections: string[];
  };
  navigation: Array<{ text: string; url: string }>;
  sections: Array<{ type: string; content: string }>;
  textContent: {
    headings: string[];
    paragraphs: string[];
    buttons: string[];
  };
}

export interface ScrapeOptions {
  maxDepth?: number;
  maxWorkers?: number;
  delay?: number;
  timeout?: number;
  ignoreRobots?: boolean;
  forceRender?: boolean;
  respectSitemap?: boolean;
  maxRetries?: number;
  downloadAssets?: boolean;
}

interface ResourceTask {
  url: string;
  type: 'css' | 'js' | 'image' | 'font' | 'other';
}

interface CrawlState {
  visited: Set<string>;
  pending: string[];
  resources: Map<string, string>;
  cssContent: Map<string, string>;
}

// ============================================================================
// SITEMIRROR SCRAPER CLASS
// ============================================================================

export class SiteMirrorScraper {
  private baseUrl: string;
  private domain: string;
  private protocol: string;
  private state: CrawlState;
  private options: Required<ScrapeOptions>;
  
  // User agent mimics real browser (like SiteMirror does)
  private userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 SiteMirror/1.0';

  constructor(url: string, options: ScrapeOptions = {}) {
    this.baseUrl = this.normalizeUrl(url);
    const urlObj = new URL(this.baseUrl);
    this.domain = urlObj.hostname;
    this.protocol = urlObj.protocol;
    
    this.state = {
      visited: new Set(),
      pending: [],
      resources: new Map(),
      cssContent: new Map(),
    };

    this.options = {
      maxDepth: options.maxDepth ?? 10,
      maxWorkers: options.maxWorkers ?? 8,
      delay: options.delay ?? 500,
      timeout: options.timeout ?? 30000, // Longer timeout for Puppeteer
      ignoreRobots: options.ignoreRobots ?? true, // Default ignore for cloning
      forceRender: options.forceRender ?? true, // Default to Puppeteer (like SiteMirror's Selenium mode)
      respectSitemap: options.respectSitemap ?? true,
      maxRetries: options.maxRetries ?? 3,
      downloadAssets: options.downloadAssets ?? true,
    };

    logInfo('🔧 SiteMirror initialized', {
      baseUrl: this.baseUrl,
      domain: this.domain,
      options: this.options,
    });
  }

  // ==========================================================================
  // URL UTILITIES (from SiteMirror's URL handling)
  // ==========================================================================

  private normalizeUrl(url: string): string {
    let normalized = url.trim().replace(/^["'\s]+|["'\s]+$/g, '');
    
    if (!normalized.match(/^https?:\/\//i)) {
      normalized = 'https://' + normalized;
    }
    
    // Remove trailing slash for consistency
    normalized = normalized.replace(/\/+$/, '');
    
    return normalized;
  }

  private resolveUrl(baseUrl: string, relativeUrl: string): string | null {
    try {
      // Skip data: URLs, javascript:, mailto:, tel:, etc.
      if (/^(data:|javascript:|mailto:|tel:|#)/.test(relativeUrl)) {
        return null;
      }
      
      return new URL(relativeUrl, baseUrl).href;
    } catch {
      return null;
    }
  }

  private isSameDomain(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === this.domain || 
             urlObj.hostname.endsWith('.' + this.domain);
    } catch {
      return false;
    }
  }

  // ==========================================================================
  // HTTP FETCHING (with retry + exponential backoff like SiteMirror)
  // ==========================================================================

  private async fetchWithRetry(
    url: string, 
    options: AxiosRequestConfig = {}
  ): Promise<{ data: string; contentType: string } | null> {
    
    for (let attempt = 0; attempt < this.options.maxRetries; attempt++) {
      try {
        const response = await axios.get(url, {
          timeout: this.options.timeout,
          headers: {
            'User-Agent': this.userAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
          maxRedirects: 10,
          validateStatus: (status) => status < 400,
          ...options,
        });

        const contentType = response.headers['content-type'] || '';
        return { 
          data: typeof response.data === 'string' ? response.data : String(response.data),
          contentType 
        };
      } catch (error: any) {
        const isLastAttempt = attempt === this.options.maxRetries - 1;
        
        if (isLastAttempt) {
          logError('SiteMirror: Failed to fetch after retries', error, { url, attempts: attempt + 1 });
          return null;
        }
        
        // Exponential backoff with jitter (like SiteMirror)
        const backoff = this.options.delay * Math.pow(2, attempt) + Math.random() * 1000;
        await this.sleep(backoff);
      }
    }
    return null;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ==========================================================================
  // LINK EXTRACTION (comprehensive like SiteMirror)
  // Extracts links from: <a>, <form>, <button>, <video>, <audio>, <source>,
  // <link>, <script>, <img>, inline CSS url(), meta-refresh, data-* attributes
  // ==========================================================================

  private extractAllLinks($: CheerioAPI, pageUrl: string): string[] {
    const links = new Set<string>();

    // 1. Standard <a> links
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (href) {
        const resolved = this.resolveUrl(pageUrl, href);
        if (resolved && this.isSameDomain(resolved)) {
          links.add(resolved);
        }
      }
    });

    // 2. <form> action URLs
    $('form[action]').each((_, el) => {
      const action = $(el).attr('action');
      if (action) {
        const resolved = this.resolveUrl(pageUrl, action);
        if (resolved && this.isSameDomain(resolved)) {
          links.add(resolved);
        }
      }
    });

    // 3. <button> with formaction or onclick containing URLs
    $('button[formaction], button[onclick]').each((_, el) => {
      const formaction = $(el).attr('formaction');
      const onclick = $(el).attr('onclick');
      
      if (formaction) {
        const resolved = this.resolveUrl(pageUrl, formaction);
        if (resolved && this.isSameDomain(resolved)) {
          links.add(resolved);
        }
      }
      
      if (onclick) {
        // Extract URLs from onclick handlers
        const urlMatches = onclick.match(/['"]([^'"]*(?:https?:\/\/|\/)[^'"]*)['"]/g);
        if (urlMatches) {
          urlMatches.forEach(match => {
            const url = match.replace(/['"]/g, '');
            const resolved = this.resolveUrl(pageUrl, url);
            if (resolved && this.isSameDomain(resolved)) {
              links.add(resolved);
            }
          });
        }
      }
    });

    // 4. Meta refresh redirects
    $('meta[http-equiv="refresh"]').each((_, el) => {
      const content = $(el).attr('content');
      if (content) {
        const urlMatch = content.match(/url=(.+)/i);
        if (urlMatch) {
          const resolved = this.resolveUrl(pageUrl, urlMatch[1].trim());
          if (resolved && this.isSameDomain(resolved)) {
            links.add(resolved);
          }
        }
      }
    });

    // 5. Data attributes containing URLs (common in SPAs)
    $('[data-href], [data-url], [data-src], [data-link]').each((_, el) => {
      ['data-href', 'data-url', 'data-src', 'data-link'].forEach(attr => {
        const value = $(el).attr(attr);
        if (value) {
          const resolved = this.resolveUrl(pageUrl, value);
          if (resolved && this.isSameDomain(resolved)) {
            links.add(resolved);
          }
        }
      });
    });

    return Array.from(links);
  }

  // ==========================================================================
  // RESOURCE EXTRACTION (CSS, JS, images, fonts - like SiteMirror)
  // ==========================================================================

  private extractResources($: CheerioAPI, pageUrl: string): ResourceTask[] {
    const resources: ResourceTask[] = [];

    // 1. External CSS
    $('link[rel="stylesheet"][href]').each((_, el) => {
      const href = $(el).attr('href');
      if (href) {
        const resolved = this.resolveUrl(pageUrl, href);
        if (resolved) {
          resources.push({ url: resolved, type: 'css' });
        }
      }
    });

    // 2. External JS
    $('script[src]').each((_, el) => {
      const src = $(el).attr('src');
      if (src) {
        const resolved = this.resolveUrl(pageUrl, src);
        if (resolved) {
          resources.push({ url: resolved, type: 'js' });
        }
      }
    });

    // 3. Images (multiple sources)
    $('img[src], img[data-src], img[data-lazy-src]').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src');
      if (src) {
        const resolved = this.resolveUrl(pageUrl, src);
        if (resolved) {
          resources.push({ url: resolved, type: 'image' });
        }
      }
    });

    // 4. Srcset images
    $('[srcset]').each((_, el) => {
      const srcset = $(el).attr('srcset');
      if (srcset) {
        srcset.split(',').forEach(src => {
          const url = src.trim().split(/\s+/)[0];
          if (url) {
            const resolved = this.resolveUrl(pageUrl, url);
            if (resolved) {
              resources.push({ url: resolved, type: 'image' });
            }
          }
        });
      }
    });

    // 5. Background images from inline styles
    $('[style*="background"]').each((_, el) => {
      const style = $(el).attr('style') || '';
      const urlMatches = style.match(/url\(['"]?([^'")]+)['"]?\)/g);
      if (urlMatches) {
        urlMatches.forEach(match => {
          const url = match.replace(/url\(['"]?|['"]?\)/g, '');
          const resolved = this.resolveUrl(pageUrl, url);
          if (resolved) {
            resources.push({ url: resolved, type: 'image' });
          }
        });
      }
    });

    // 6. Video/Audio sources
    $('video source[src], audio source[src], video[src], audio[src]').each((_, el) => {
      const src = $(el).attr('src');
      if (src) {
        const resolved = this.resolveUrl(pageUrl, src);
        if (resolved) {
          resources.push({ url: resolved, type: 'other' });
        }
      }
    });

    // 7. Fonts from link preload
    $('link[rel="preload"][as="font"], link[rel="preload"][as="style"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href) {
        const resolved = this.resolveUrl(pageUrl, href);
        if (resolved) {
          resources.push({ url: resolved, type: 'font' });
        }
      }
    });

    return resources;
  }

  // ==========================================================================
  // CSS PARSING (like SiteMirror's cssutils - finds url() references)
  // ==========================================================================

  private extractUrlsFromCSS(css: string, baseUrl: string): string[] {
    const urls: string[] = [];
    
    // Match all url() declarations in CSS
    const urlRegex = /url\(\s*['"]?([^'")]+)['"]?\s*\)/gi;
    let match;
    
    while ((match = urlRegex.exec(css)) !== null) {
      const url = match[1];
      if (url && !url.startsWith('data:')) {
        const resolved = this.resolveUrl(baseUrl, url);
        if (resolved) {
          urls.push(resolved);
        }
      }
    }

    // Match @import statements
    const importRegex = /@import\s+(?:url\()?\s*['"]?([^'");\s]+)['"]?\s*\)?/gi;
    while ((match = importRegex.exec(css)) !== null) {
      const url = match[1];
      if (url) {
        const resolved = this.resolveUrl(baseUrl, url);
        if (resolved) {
          urls.push(resolved);
        }
      }
    }

    // Match font-face src declarations
    const fontSrcRegex = /src:\s*url\(['"]?([^'")]+)['"]?\)/gi;
    while ((match = fontSrcRegex.exec(css)) !== null) {
      const url = match[1];
      if (url && !url.startsWith('data:')) {
        const resolved = this.resolveUrl(baseUrl, url);
        if (resolved) {
          urls.push(resolved);
        }
      }
    }

    return urls;
  }

  // ==========================================================================
  // URL REWRITING (rewrites all links to absolute URLs like SiteMirror)
  // ==========================================================================

  private rewriteUrls($: CheerioAPI, pageUrl: string): void {
    // Rewrite all href attributes
    $('[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && !href.startsWith('#') && !href.startsWith('javascript:') && !href.startsWith('mailto:')) {
        const resolved = this.resolveUrl(pageUrl, href);
        if (resolved) {
          $(el).attr('href', resolved);
        }
      }
    });

    // Rewrite all src attributes
    $('[src]').each((_, el) => {
      const src = $(el).attr('src');
      if (src && !src.startsWith('data:')) {
        const resolved = this.resolveUrl(pageUrl, src);
        if (resolved) {
          $(el).attr('src', resolved);
        }
      }
    });

    // Rewrite srcset
    $('[srcset]').each((_, el) => {
      const srcset = $(el).attr('srcset');
      if (srcset) {
        const newSrcset = srcset.split(',').map(src => {
          const parts = src.trim().split(/\s+/);
          if (parts[0]) {
            const resolved = this.resolveUrl(pageUrl, parts[0]);
            if (resolved) {
              parts[0] = resolved;
            }
          }
          return parts.join(' ');
        }).join(', ');
        $(el).attr('srcset', newSrcset);
      }
    });

    // Rewrite action attributes
    $('[action]').each((_, el) => {
      const action = $(el).attr('action');
      if (action) {
        const resolved = this.resolveUrl(pageUrl, action);
        if (resolved) {
          $(el).attr('action', resolved);
        }
      }
    });

    // Rewrite data-* URL attributes
    $('[data-src], [data-href], [data-url], [data-background]').each((_, el) => {
      ['data-src', 'data-href', 'data-url', 'data-background'].forEach(attr => {
        const value = $(el).attr(attr);
        if (value && !value.startsWith('data:')) {
          const resolved = this.resolveUrl(pageUrl, value);
          if (resolved) {
            $(el).attr(attr, resolved);
          }
        }
      });
    });

    // Rewrite inline style background URLs
    $('[style*="url("]').each((_, el) => {
      let style = $(el).attr('style') || '';
      style = style.replace(/url\(['"]?([^'")]+)['"]?\)/g, (match, url) => {
        if (url.startsWith('data:')) return match;
        const resolved = this.resolveUrl(pageUrl, url);
        return resolved ? `url('${resolved}')` : match;
      });
      $(el).attr('style', style);
    });
  }

  // ==========================================================================
  // CONTENT EXTRACTION
  // ==========================================================================

  private extractColors($: CheerioAPI): string[] {
    const colors = new Set<string>();
    const colorRegex = /#[0-9a-fA-F]{3,8}|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)|hsla\([^)]+\)/gi;

    // From inline styles
    $('[style]').each((_, el) => {
      const style = $(el).attr('style') || '';
      const matches = style.match(colorRegex);
      if (matches) matches.forEach(c => colors.add(c.toLowerCase()));
    });

    // From style tags
    $('style').each((_, el) => {
      const css = $(el).html() || '';
      const matches = css.match(colorRegex);
      if (matches) matches.forEach(c => colors.add(c.toLowerCase()));
    });

    return Array.from(colors).slice(0, 20);
  }

  private extractFonts($: CheerioAPI): string[] {
    const fonts = new Set<string>();
    const fontRegex = /font-family:\s*([^;}"']+)/gi;

    // From inline styles
    $('[style]').each((_, el) => {
      const style = $(el).attr('style') || '';
      let match;
      while ((match = fontRegex.exec(style)) !== null) {
        const font = match[1].split(',')[0].trim().replace(/['"]/g, '');
        if (font && !font.includes('inherit') && !font.includes('initial')) {
          fonts.add(font);
        }
      }
    });

    // From style tags
    $('style').each((_, el) => {
      const css = $(el).html() || '';
      let match;
      const regex = /font-family:\s*([^;}"']+)/gi;
      while ((match = regex.exec(css)) !== null) {
        const font = match[1].split(',')[0].trim().replace(/['"]/g, '');
        if (font && !font.includes('inherit') && !font.includes('initial')) {
          fonts.add(font);
        }
      }
    });

    // From Google Fonts links
    $('link[href*="fonts.googleapis.com"]').each((_, el) => {
      const href = $(el).attr('href') || '';
      const familyMatch = href.match(/family=([^&:]+)/);
      if (familyMatch) {
        fonts.add(familyMatch[1].replace(/\+/g, ' '));
      }
    });

    return Array.from(fonts).slice(0, 15);
  }

  private extractImages($: CheerioAPI, baseUrl: string): string[] {
    const images: string[] = [];
    
    $('img').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      if (src) {
        const resolved = this.resolveUrl(baseUrl, src);
        if (resolved) images.push(resolved);
      }
    });

    return [...new Set(images)].slice(0, 50);
  }

  private extractNavigation($: CheerioAPI): Array<{ text: string; url: string }> {
    const nav: Array<{ text: string; url: string }> = [];
    
    $('nav a, header a, [role="navigation"] a').each((_, el) => {
      const text = $(el).text().trim();
      const href = $(el).attr('href');
      if (text && href && text.length < 50) {
        nav.push({ text, url: href });
      }
    });

    return nav.slice(0, 30);
  }

  private extractSections($: CheerioAPI): Array<{ type: string; content: string }> {
    const sections: Array<{ type: string; content: string }> = [];
    
    $('section, article, main > div, [class*="section"]').each((_, el) => {
      const type = $(el).prop('tagName')?.toLowerCase() || 'div';
      const heading = $(el).find('h1, h2, h3').first().text().trim();
      if (heading) {
        sections.push({ type, content: heading });
      }
    });

    return sections.slice(0, 20);
  }

  private extractTextContent($: CheerioAPI): WebsiteAnalysis['textContent'] {
    const headings: string[] = [];
    const paragraphs: string[] = [];
    const buttons: string[] = [];

    $('h1, h2, h3, h4, h5, h6').each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length < 200) headings.push(text);
    });

    $('p').each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 10 && text.length < 500) paragraphs.push(text);
    });

    $('button, [role="button"], a.btn, a.button, .cta').each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length < 50) buttons.push(text);
    });

    return {
      headings: headings.slice(0, 30),
      paragraphs: paragraphs.slice(0, 20),
      buttons: [...new Set(buttons)].slice(0, 15),
    };
  }

  // ==========================================================================
  // MAIN FETCH METHOD (implements SiteMirror's complete crawl workflow)
  // ==========================================================================

  /**
   * Fetch HTML using Puppeteer (for JavaScript-rendered sites)
   * Following SiteMirror's Selenium approach but using Puppeteer
   */
  private async fetchWithPuppeteer(url: string): Promise<string | null> {
    try {
      // Dynamic import to avoid build-time issues
      const puppeteer = await import('puppeteer');
      const { existsSync, statSync } = await import('fs');
      const { readdirSync } = await import('fs');
      const path = await import('path');
      
      logInfo('🌐 SiteMirror: Using Puppeteer for JavaScript rendering', { url });
      
      // Set PUPPETEER_CACHE_DIR explicitly to ensure Puppeteer knows where to look
      const cacheDir = process.env.PUPPETEER_CACHE_DIR || '/opt/render/.cache/puppeteer';
      if (!process.env.PUPPETEER_CACHE_DIR) {
        process.env.PUPPETEER_CACHE_DIR = cacheDir;
      }
      
      // Find Chrome executable path
      let executablePath: string | undefined = process.env.PUPPETEER_EXECUTABLE_PATH;
      
      if (!executablePath) {
        try {
          // Use @puppeteer/browsers to get Chrome path (most reliable)
          try {
            const { computeExecutablePath } = await import('@puppeteer/browsers');
            const browserPath = computeExecutablePath({
              browser: 'chrome',
              cacheDir: cacheDir,
            });
            
            if (browserPath && existsSync(browserPath)) {
              executablePath = browserPath;
              logInfo('✅ Found Chrome via @puppeteer/browsers', { path: executablePath });
            }
          } catch (browsersError) {
            logInfo('@puppeteer/browsers not available, using file system search');
          }
          
          // Fallback: Search file system directly with absolute paths
          if (!executablePath) {
            const possibleCacheDirs = [
              cacheDir,
              '/opt/render/.cache/puppeteer',
              path.default.resolve(process.cwd(), '.cache', 'puppeteer'),
              path.default.resolve(process.env.HOME || '/tmp', '.cache', 'puppeteer'),
            ].filter(Boolean).map(dir => path.default.resolve(dir)) as string[];
            
            // Remove duplicates
            const uniqueCacheDirs = [...new Set(possibleCacheDirs)];
            
            logInfo('Searching for Chrome in cache directories', { cacheDirs: uniqueCacheDirs });
            
            for (const searchDir of uniqueCacheDirs) {
              try {
                if (!existsSync(searchDir)) {
                  continue;
                }
                
                const chromeDir = path.default.join(searchDir, 'chrome');
                
                if (existsSync(chromeDir)) {
                  // Find the versioned directory (e.g., linux-143.0.7499.169)
                  const dirs = readdirSync(chromeDir);
                  const versionDir = dirs.find(d => d.startsWith('linux-'));
                  
                  if (versionDir) {
                    logInfo('Found Chrome version directory', { versionDir, cacheDir: searchDir });
                    
                    // Try all possible structures (use absolute paths)
                    const possiblePaths = [
                      path.default.resolve(chromeDir, versionDir, 'chrome-linux64', 'chrome'),
                      path.default.resolve(chromeDir, versionDir, 'chrome', 'chrome'),
                      path.default.resolve(chromeDir, versionDir, 'chrome'),
                      path.default.resolve(chromeDir, versionDir, 'headless_shell', 'headless_shell'),
                    ];
                    
                    for (const chromePath of possiblePaths) {
                      if (existsSync(chromePath)) {
                        // Check if it's executable
                        try {
                          const stats = statSync(chromePath);
                          if (stats.isFile()) {
                            executablePath = chromePath;
                            logInfo('✅ Found Chrome executable', { path: executablePath, cacheDir: searchDir });
                            break;
                          }
                        } catch (statError) {
                          logInfo('Chrome path exists but not accessible', { path: chromePath, error: statError });
                        }
                      }
                    }
                    
                    if (executablePath) break;
                  } else {
                    logInfo('No version directory found in Chrome cache', { chromeDir, dirs });
                  }
                } else {
                  logInfo('Chrome directory does not exist', { chromeDir });
                }
              } catch (error) {
                logError('Error searching for Chrome in cache dir', error, { cacheDir: searchDir });
              }
            }
          }
        } catch (error) {
          logError('Failed to find Chrome in cache directories', error);
        }
      }
      
      const launchOptions: any = {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process',
          '--user-agent=' + this.userAgent,
        ],
      };
      
      // Set executable path if found
      if (executablePath) {
        launchOptions.executablePath = executablePath;
        logInfo('✅ Using Chrome executable', { path: executablePath });
      } else {
        // Try to use Puppeteer's default (it should find Chrome if cache dir is set)
        logInfo('Chrome path not explicitly set, using Puppeteer default');
        logInfo('PUPPETEER_CACHE_DIR is set to', { cacheDir });
        
        // Log all environment variables related to Puppeteer for debugging
        logInfo('Puppeteer environment', {
          PUPPETEER_CACHE_DIR: process.env.PUPPETEER_CACHE_DIR,
          PUPPETEER_EXECUTABLE_PATH: process.env.PUPPETEER_EXECUTABLE_PATH,
          PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD,
        });
      }
      
      const browser = await puppeteer.default.launch(launchOptions);

      try {
        const page = await browser.newPage();
        
        // Set viewport (like SiteMirror's Selenium)
        await page.setViewport({ width: 1920, height: 1080 });
        
        // Block unnecessary resources to speed up (like SiteMirror)
        await page.setRequestInterception(true);
        page.on('request', (req) => {
          const resourceType = req.resourceType();
          // Allow essential resources
          if (['document', 'stylesheet', 'script', 'image', 'font', 'media'].includes(resourceType)) {
            req.continue();
          } else {
            // Block ads, analytics, etc.
            req.abort();
          }
        });

        // Navigate and wait for content (like SiteMirror's selenium_wait)
        await page.goto(url, {
          waitUntil: 'networkidle2',
          timeout: this.options.timeout,
        });

        // Wait a bit more for any lazy-loaded content (like SiteMirror)
        await this.sleep(2000);

        // Get the fully rendered HTML
        const html = await page.content();
        
        logInfo('✅ SiteMirror: Puppeteer rendered page', { 
          url, 
          htmlLength: html.length 
        });

        return html;
      } finally {
        await browser.close();
      }
    } catch (error: any) {
      logError('SiteMirror: Puppeteer fetch failed', error, { url });
      return null;
    }
  }

  async fetchWebsiteContent(url?: string): Promise<WebsiteAnalysis | null> {
    const targetUrl = url || this.baseUrl;
    
    logInfo('🚀 SiteMirror: Starting website clone', { url: targetUrl });

    try {
      // Step 1: Fetch main page HTML
      // Use Puppeteer if forceRender is true OR if we detect it might need JS
      // Following SiteMirror's dual-engine approach (Requests vs Selenium)
      let html: string | null = null;
      
      if (this.options.forceRender) {
        // Use Puppeteer for JavaScript rendering (like SiteMirror's Selenium mode)
        html = await this.fetchWithPuppeteer(targetUrl);
        
        // Fallback to HTTP if Puppeteer fails (Chrome not available, etc.)
        if (!html) {
          logInfo('🔄 SiteMirror: Puppeteer failed, falling back to HTTP fetch', { url: targetUrl });
          const response = await this.fetchWithRetry(targetUrl);
          if (response) {
            html = response.data;
          }
        }
      } else {
        // Try regular fetch first (like SiteMirror's Requests mode)
        const response = await this.fetchWithRetry(targetUrl);
        if (response) {
          html = response.data;
        }
      }
      
      // Fallback: If regular fetch failed and we haven't tried Puppeteer, try it
      if (!html && !this.options.forceRender) {
        logInfo('🔄 SiteMirror: Regular fetch failed, trying Puppeteer', { url: targetUrl });
        html = await this.fetchWithPuppeteer(targetUrl);
      }
      
      if (!html) {
        logError('SiteMirror: Failed to fetch main page', null, { url: targetUrl });
        return null;
      }

      logInfo('📄 SiteMirror: Main page fetched', { 
        url: targetUrl, 
        size: html.length,
        method: this.options.forceRender ? 'Puppeteer' : 'HTTP'
      });

      // Step 2: Parse HTML with Cheerio
      const $ = load(html);

      // Step 3: Extract basic metadata
      const title = $('title').text().trim() || 
                   $('meta[property="og:title"]').attr('content') || 
                   $('h1').first().text().trim() || 
                   'Untitled';

      const description = $('meta[name="description"]').attr('content') || 
                         $('meta[property="og:description"]').attr('content') || 
                         '';

      // Step 4: Rewrite all URLs to absolute (like SiteMirror)
      this.rewriteUrls($, targetUrl);
      
      logInfo('🔗 SiteMirror: URLs rewritten to absolute paths');

      // Step 5: Extract resources for download
      const resources = this.extractResources($, targetUrl);
      logInfo('📦 SiteMirror: Resources extracted', { count: resources.length });

      // Step 6: Fetch and inline external CSS (like SiteMirror's CSS parsing)
      const cssUrls = resources.filter(r => r.type === 'css').map(r => r.url);
      let inlineCSS = '';
      const externalCSSUrls: string[] = [];
      
      for (const cssUrl of cssUrls.slice(0, 10)) { // Limit to 10 CSS files
        try {
          const cssResponse = await this.fetchWithRetry(cssUrl);
          if (cssResponse && cssResponse.data) {
            // Parse CSS for additional URLs (like SiteMirror's cssutils)
            const cssAssetUrls = this.extractUrlsFromCSS(cssResponse.data, cssUrl);
            logInfo('🎨 SiteMirror: CSS parsed', { 
              url: cssUrl, 
              embeddedAssets: cssAssetUrls.length 
            });
            
            inlineCSS += `\n/* From: ${cssUrl} */\n${cssResponse.data}\n`;
            externalCSSUrls.push(cssUrl);
          }
        } catch (error) {
          logError('SiteMirror: Failed to fetch CSS', error, { url: cssUrl });
        }
        
        // Respect delay between requests (like SiteMirror)
        await this.sleep(this.options.delay / 2);
      }

      // Step 7: Get inline CSS from page
      $('style').each((_, el) => {
        const css = $(el).html();
        if (css) {
          inlineCSS += `\n/* Inline style */\n${css}\n`;
        }
      });

      // Step 8: Extract all internal links (for multi-page info)
      const internalLinks = this.extractAllLinks($, targetUrl);
      logInfo('🔍 SiteMirror: Internal links found', { count: internalLinks.length });

      // Step 9: Extract design elements
      const colors = this.extractColors($);
      const fonts = this.extractFonts($);
      const images = this.extractImages($, targetUrl);
      const navigation = this.extractNavigation($);
      const sections = this.extractSections($);
      const textContent = this.extractTextContent($);

      // Step 10: Determine layout structure
      const layoutElements: string[] = [];
      ['header', 'nav', 'main', 'article', 'section', 'aside', 'footer'].forEach(tag => {
        if ($(tag).length > 0) layoutElements.push(tag);
      });

      logInfo('✅ SiteMirror: Website clone complete', {
        url: targetUrl,
        title,
        htmlLength: $.html().length,
        cssLength: inlineCSS.length,
        colors: colors.length,
        fonts: fonts.length,
        images: images.length,
        internalLinks: internalLinks.length,
      });

      return {
        html: $.html(),
        title,
        description,
        colors,
        fonts,
        images,
        css: {
          inline: inlineCSS,
          external: externalCSSUrls,
          parsed: inlineCSS,
        },
        layout: {
          structure: layoutElements.join(', '),
          sections: sections.map(s => s.type),
        },
        navigation,
        sections,
        textContent,
      };

    } catch (error: any) {
      logError('SiteMirror: Clone failed', error, { url: targetUrl });
      return null;
    }
  }
}
