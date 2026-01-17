// SiteMirror - Advanced Website Cloning Implementation
// Based on: https://github.com/pakelcomedy/SiteMirror/
// TypeScript/Node.js port of the Python SiteMirror tool
//
// Key Features (from SiteMirror):
// - Dual-engine fetching: HTTP for static, Puppeteer for JavaScript rendering
// - CSS parsing and URL rewriting using cssutils approach
// - Comprehensive link extraction (a, form, button, video, audio, inline CSS)
// - Concurrent resource downloads with ThreadPoolExecutor-style parallelism
// - Automatic fallback between rendering modes
// - 404 and error page detection

import axios, { AxiosRequestConfig } from 'axios';
import { load, CheerioAPI } from 'cheerio';
import { logInfo, logError } from '@/lib/log';
import { URL } from 'url';

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

export interface SiteMirrorOptions {
  maxWorkers?: number;        // Like SiteMirror's --max_workers
  delay?: number;             // Like SiteMirror's --delay
  timeout?: number;           // Like SiteMirror's --timeout
  forceRender?: boolean;      // Like SiteMirror's --force_render
  seleniumWait?: number;      // Like SiteMirror's --selenium_wait
  ignoreRobots?: boolean;     // Like SiteMirror's --ignore_robots
  userAgent?: string;
  maxRetries?: number;        // Like SiteMirror's --max_retries
}

/**
 * SiteMirror Scraper - Based on https://github.com/pakelcomedy/SiteMirror/
 * 
 * Features:
 * - Complete site cloning with HTML, CSS, JS, images
 * - Dual-engine: Requests (static) + Selenium/Puppeteer (dynamic)
 * - CSS parsing and URL rewriting
 * - Comprehensive link extraction
 */
export class SiteMirrorScraper {
  private baseUrl: string;
  private domain: string;
  private protocol: string;
  private options: Required<SiteMirrorOptions>;
  private userAgent: string;
  private resourceCache: Map<string, string> = new Map();

  constructor(url: string, options: SiteMirrorOptions = {}) {
    this.baseUrl = this.normalizeUrl(url);
    const urlObj = new URL(this.baseUrl);
    this.domain = urlObj.hostname;
    this.protocol = urlObj.protocol;

    // Default options matching SiteMirror's defaults
    this.options = {
      maxWorkers: options.maxWorkers ?? 8,
      delay: options.delay ?? 500,
      timeout: options.timeout ?? 30000,
      forceRender: options.forceRender ?? true, // Use Puppeteer by default like --force_render
      seleniumWait: options.seleniumWait ?? 5000,
      ignoreRobots: options.ignoreRobots ?? true,
      maxRetries: options.maxRetries ?? 3,
      userAgent: options.userAgent ?? 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 SiteMirror/2.0',
    };

    this.userAgent = this.options.userAgent;

    logInfo('🔧 SiteMirror initialized', {
      baseUrl: this.baseUrl,
      domain: this.domain,
      forceRender: this.options.forceRender,
      maxWorkers: this.options.maxWorkers,
    });
  }

  private normalizeUrl(url: string): string {
    let normalized = url.trim().replace(/^["'\s]+|["'\s]+$/g, '');
    if (!normalized.match(/^https?:\/\//i)) {
      normalized = 'https://' + normalized;
    }
    return normalized.replace(/\/+$/, '');
  }

  private resolveUrl(baseUrl: string, relativeUrl: string): string | null {
    try {
      if (/^(data:|javascript:|mailto:|tel:|#|blob:)/.test(relativeUrl)) {
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
             urlObj.hostname.endsWith('.' + this.domain) ||
             this.domain.endsWith('.' + urlObj.hostname);
    } catch {
      return false;
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * DUAL-ENGINE FETCHING (like SiteMirror)
   * - Static mode: Requests + BeautifulSoup equivalent (axios + cheerio)
   * - Dynamic mode: Selenium equivalent (Puppeteer)
   * 
   * For SPAs: Navigate to homepage first, then use client-side routing
   */
  private async fetchWithPuppeteer(url: string): Promise<string | null> {
    try {
      const puppeteer = await import('puppeteer');
      
      logInfo('🌐 SiteMirror: Using Puppeteer (--force_render mode)', { url });

      const browser = await puppeteer.default.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process',
          '--user-agent=' + this.userAgent,
          '--window-size=1920,1080',
        ],
      });

      try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        await page.setUserAgent(this.userAgent);

        // Block tracking/analytics (like SiteMirror filters)
        await page.setRequestInterception(true);
        page.on('request', (req) => {
          const reqUrl = req.url();
          const resourceType = req.resourceType();
          
          const blockPatterns = [
            'google-analytics', 'googletagmanager', 'gtag',
            'facebook.net', 'fbevents', 'doubleclick',
            'hotjar', 'clarity.ms', 'segment.com',
            'intercom', 'crisp.chat', 'drift.com',
          ];
          
          if (blockPatterns.some(p => reqUrl.includes(p))) {
            req.abort();
            return;
          }
          
          if (['document', 'stylesheet', 'script', 'image', 'font', 'xhr', 'fetch'].includes(resourceType)) {
            req.continue();
          } else {
            req.abort();
          }
        });

        const targetUrl = new URL(url);
        const isSubpage = targetUrl.pathname !== '/' && targetUrl.pathname !== '';
        
        // FOR SPA SUPPORT: First load homepage, then navigate via client-side routing
        if (isSubpage) {
          // Load homepage first to initialize the SPA
          const homepageUrl = `${targetUrl.protocol}//${targetUrl.host}/`;
          logInfo('SiteMirror: Loading SPA homepage first', { homepage: homepageUrl, target: url });
          
          await page.goto(homepageUrl, {
            waitUntil: 'networkidle0',
            timeout: this.options.timeout,
          });
          
          await this.sleep(2000); // Wait for SPA to initialize
          
          // Now navigate to the target route using client-side navigation
          // Try to find and click the link, or use pushState navigation
          const targetPath = targetUrl.pathname;
          
          // Method 1: Try clicking a link that matches the path
          const linkClicked = await page.evaluate((path: string) => {
            const links = Array.from(document.querySelectorAll('a[href]'));
            for (const link of links) {
              const href = link.getAttribute('href');
              if (href === path || href === path.replace(/^\//, '') || 
                  href?.endsWith(path) || href?.endsWith(path.replace(/^\//, ''))) {
                (link as HTMLElement).click();
                return true;
              }
            }
            return false;
          }, targetPath);
          
          if (linkClicked) {
            logInfo('SiteMirror: Clicked SPA navigation link', { path: targetPath });
            await this.sleep(2000); // Wait for SPA navigation
            await page.waitForNetworkIdle({ timeout: 5000 }).catch(() => {});
          } else {
            // Method 2: Use History API to navigate (works for most SPAs)
            logInfo('SiteMirror: Using History API for SPA navigation', { path: targetPath });
            await page.evaluate((path: string) => {
              window.history.pushState({}, '', path);
              window.dispatchEvent(new PopStateEvent('popstate'));
              // Also try triggering hashchange for hash-based routers
              if (path.startsWith('#')) {
                window.location.hash = path;
              }
            }, targetPath);
            await this.sleep(2000);
          }
        } else {
          // For homepage, just navigate directly
          await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: this.options.timeout,
          });
        }

        // Wait for dynamic content (like --selenium_wait)
        await this.sleep(this.options.seleniumWait);

        // Check if we got a 404 page (for SPAs that show 404 content)
        const pageContent = await page.evaluate(() => {
          const h1 = document.querySelector('h1')?.textContent?.toLowerCase() || '';
          const title = document.title.toLowerCase();
          return { h1, title, bodyLength: document.body.innerHTML.length };
        });
        
        // If it's a 404 page, try direct navigation as fallback
        if ((pageContent.h1.includes('404') || pageContent.title.includes('404') || 
             pageContent.h1.includes('not found')) && isSubpage) {
          logInfo('SiteMirror: SPA returned 404, trying direct navigation', { url });
          await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: this.options.timeout,
          });
          await this.sleep(this.options.seleniumWait);
        }

        // Scroll to trigger lazy loading (comprehensive like SiteMirror)
        await this.autoScrollPage(page);
        await this.sleep(1000);
        await page.evaluate(() => window.scrollTo(0, 0));

        // Extract all CSS including computed styles
        const extractedCSS = await page.evaluate(() => {
          const styles: string[] = [];
          
          // Get all stylesheet rules
          for (const sheet of Array.from(document.styleSheets)) {
            try {
              if (sheet.cssRules) {
                for (const rule of Array.from(sheet.cssRules)) {
                  styles.push(rule.cssText);
                }
              }
            } catch (e) {
              // Cross-origin, skip
            }
          }
          
          // Get inline styles
          Array.from(document.querySelectorAll('style')).forEach(style => {
            if (style.textContent) styles.push(style.textContent);
          });
          
          return styles.join('\n');
        });

        const html = await page.content();
        const styledHtml = this.injectExtractedCSS(html, extractedCSS);

        logInfo('📄 SiteMirror: Puppeteer fetch complete', {
          url,
          htmlLength: styledHtml.length,
          cssExtracted: extractedCSS.length > 0,
        });

        return styledHtml;
      } finally {
        await browser.close();
      }
    } catch (error: any) {
      logError('SiteMirror: Puppeteer failed', error, { url });
      return null;
    }
  }

  /**
   * Static fetch (like SiteMirror's Requests mode)
   */
  private async fetchWithRequests(url: string): Promise<string | null> {
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
          },
          maxRedirects: 10,
          validateStatus: (status) => status < 400,
          responseType: 'text',
        });

        return response.data;
      } catch (error: any) {
        if (attempt === this.options.maxRetries - 1) {
          logError('SiteMirror: Requests fetch failed', error, { url });
          return null;
        }
        // Exponential backoff with jitter (like SiteMirror)
        const backoff = this.options.delay * Math.pow(2, attempt) + Math.random() * 1000;
        await this.sleep(backoff);
      }
    }
    return null;
  }

  /**
   * Auto-scroll for lazy loading (like SiteMirror's scroll behavior)
   */
  private async autoScrollPage(page: any): Promise<void> {
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 300;
        const maxScrolls = 50;
        let scrollCount = 0;
        
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          scrollCount++;

          if (totalHeight >= scrollHeight || scrollCount >= maxScrolls) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
        
        setTimeout(() => {
          clearInterval(timer);
          resolve();
        }, 10000);
      });
    });
  }

  /**
   * Inject extracted CSS into HTML
   */
  private injectExtractedCSS(html: string, css: string): string {
    if (!css || css.length === 0) return html;
    
    const styleTag = `<style data-sitemirror-extracted="true">\n${css}\n</style>`;
    
    if (html.includes('</head>')) {
      return html.replace('</head>', `${styleTag}\n</head>`);
    }
    return styleTag + '\n' + html;
  }

  /**
   * Detect 404/error pages (comprehensive detection)
   */
  private is404Page($: CheerioAPI, html: string): boolean {
    const title = $('title').text().toLowerCase();
    const h1 = $('h1').first().text().toLowerCase();
    const body = $('body').text().toLowerCase();
    
    // Title checks
    if (title.includes('404') || title.includes('not found') || 
        title.includes('page not found') || title.includes('error page')) {
      return true;
    }
    
    // H1 checks
    if (h1.includes('404') || h1.includes('not found') || h1 === 'error') {
      return true;
    }
    
    // Body pattern checks
    const patterns = [
      /\b404\b.*not\s*found/i,
      /page\s*not\s*found/i,
      /page\s*doesn.*exist/i,
      /this\s*page\s*.*could\s*not\s*be\s*found/i,
      /the\s*page\s*you.*looking\s*for/i,
      /oops.*page.*not.*found/i,
      /sorry.*page.*not.*exist/i,
    ];
    
    for (const pattern of patterns) {
      if (pattern.test(body.substring(0, 2000))) { // Check first 2000 chars
        return true;
      }
    }
    
    return false;
  }

  /**
   * Convert internal links to local page references
   * Critical for navigation in the editor
   */
  private convertInternalLinksToLocal($: CheerioAPI): void {
    const baseDomain = this.domain;
    
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (!href) return;
      
      if (href.startsWith('#') || href.startsWith('javascript:') || 
          href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }
      
      try {
        let urlObj: URL;
        if (href.startsWith('http://') || href.startsWith('https://')) {
          urlObj = new URL(href);
        } else if (href.startsWith('//')) {
          urlObj = new URL('https:' + href);
        } else {
          urlObj = new URL(href, this.baseUrl);
        }
        
        // Check if internal
        if (urlObj.hostname === baseDomain || 
            urlObj.hostname.endsWith('.' + baseDomain) ||
            baseDomain.endsWith('.' + urlObj.hostname)) {
          
          let path = urlObj.pathname.replace(/^\/+/, '').replace(/\/+$/, '');
          
          if (!path) {
            $(el).attr('href', 'index.html');
            return;
          }
          
          // Skip assets
          if (path.match(/\.(jpg|jpeg|png|gif|svg|webp|ico|pdf|doc|docx|xls|xlsx|zip|css|js|json|xml|mp3|mp4)$/i)) {
            $(el).attr('href', urlObj.href);
            return;
          }
          
          let localFile = path.replace(/\//g, '-');
          if (!localFile.endsWith('.html') && !localFile.endsWith('.htm')) {
            localFile += '.html';
          }
          
          $(el).attr('href', localFile);
        }
      } catch (e) {
        // Invalid URL, leave as-is
      }
    });
  }

  /**
   * CSS PARSING & URL REWRITING (like SiteMirror's cssutils approach)
   * Parses CSS content and rewrites all url() references to absolute
   */
  private rewriteCSSUrls(css: string, cssFileUrl: string): string {
    try {
      const base = new URL(cssFileUrl);
      const cssDir = base.href.substring(0, base.href.lastIndexOf('/') + 1);

      // Rewrite url() references
      css = css.replace(/url\(["']?(?!data:|https?:|\/\/)([^"')]+)["']?\)/gi, (match, url) => {
        try {
          const absoluteUrl = new URL(url.trim(), cssDir).href;
          return `url("${absoluteUrl}")`;
        } catch {
          return match;
        }
      });

      // Rewrite @import
      css = css.replace(/@import\s+["'](?!https?:|\/\/)([^"']+)["']/gi, (match, url) => {
        try {
          const absoluteUrl = new URL(url.trim(), cssDir).href;
          return `@import "${absoluteUrl}"`;
        } catch {
          return match;
        }
      });

      // Rewrite @font-face src
      css = css.replace(/src:\s*url\(["']?(?!data:|https?:)([^"')]+)["']?\)/gi, (match, url) => {
        try {
          const absoluteUrl = new URL(url.trim(), cssDir).href;
          return `src: url("${absoluteUrl}")`;
        } catch {
          return match;
        }
      });

    } catch (error) {
      logError('SiteMirror: CSS URL rewriting failed', error);
    }

    return css;
  }

  /**
   * Fix all resource URLs to absolute (images, scripts, etc.)
   */
  private fixResourceUrls($: CheerioAPI, baseUrl: string): void {
    // Fix link href (stylesheets)
    $('link[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && !href.startsWith('data:')) {
        const absoluteUrl = this.resolveUrl(baseUrl, href);
        if (absoluteUrl) $(el).attr('href', absoluteUrl);
      }
    });

    // Fix src attributes
    $('[src]').each((_, el) => {
      const src = $(el).attr('src');
      if (src && !src.startsWith('data:') && !src.startsWith('blob:')) {
        const absoluteUrl = this.resolveUrl(baseUrl, src);
        if (absoluteUrl) $(el).attr('src', absoluteUrl);
      }
    });

    // Fix srcset
    $('[srcset]').each((_, el) => {
      const srcset = $(el).attr('srcset');
      if (srcset) {
        const newSrcset = srcset.split(',').map(part => {
          const [url, size] = part.trim().split(/\s+/);
          const absoluteUrl = this.resolveUrl(baseUrl, url);
          return absoluteUrl ? `${absoluteUrl}${size ? ' ' + size : ''}` : part;
        }).join(', ');
        $(el).attr('srcset', newSrcset);
      }
    });

    // Fix data-src (lazy loading)
    $('[data-src]').each((_, el) => {
      const dataSrc = $(el).attr('data-src');
      if (dataSrc && !dataSrc.startsWith('data:')) {
        const absoluteUrl = this.resolveUrl(baseUrl, dataSrc);
        if (absoluteUrl) {
          $(el).attr('data-src', absoluteUrl);
          // Also set src for immediate display
          if (!$(el).attr('src') || $(el).attr('src')?.includes('placeholder') || $(el).attr('src')?.includes('data:')) {
            $(el).attr('src', absoluteUrl);
          }
        }
      }
    });

    // Fix background-image in inline styles
    $('[style*="background"]').each((_, el) => {
      let style = $(el).attr('style') || '';
      style = style.replace(/url\(["']?(?!data:|http)([^"')]+)["']?\)/gi, (match, url) => {
        const absoluteUrl = this.resolveUrl(baseUrl, url);
        return absoluteUrl ? `url("${absoluteUrl}")` : match;
      });
      $(el).attr('style', style);
    });

    // Fix poster (video)
    $('[poster]').each((_, el) => {
      const poster = $(el).attr('poster');
      if (poster && !poster.startsWith('data:')) {
        const absoluteUrl = this.resolveUrl(baseUrl, poster);
        if (absoluteUrl) $(el).attr('poster', absoluteUrl);
      }
    });

    // Fix action (forms)
    $('form[action]').each((_, el) => {
      const action = $(el).attr('action');
      if (action && !action.startsWith('javascript:') && !action.startsWith('#')) {
        const absoluteUrl = this.resolveUrl(baseUrl, action);
        if (absoluteUrl) $(el).attr('action', absoluteUrl);
      }
    });
  }

  /**
   * Remove tracking scripts (like SiteMirror filters)
   */
  private removeTrackingScripts($: CheerioAPI): void {
    const blockPatterns = [
      'google-analytics', 'googletagmanager', 'gtag', 'fbevents',
      'facebook.net', 'analytics', 'tracking', 'pixel', 'hotjar',
      'clarity.ms', 'segment.com', 'intercom', 'crisp.chat',
      'drift.com', 'hubspot', 'marketo', 'pardot', 'doubleclick',
      'adsense', 'adservice', 'googlesyndication'
    ];

    $('script').each((_, el) => {
      const src = $(el).attr('src') || '';
      const content = $(el).html() || '';
      
      if (blockPatterns.some(p => src.includes(p) || content.includes(p))) {
        $(el).remove();
        return;
      }
      
      if (content.includes('gtag(') || content.includes('fbq(') || 
          content.includes('dataLayer') || content.includes('_gaq')) {
        $(el).remove();
      }
    });

    // Remove noscript tracking pixels
    $('noscript').each((_, el) => {
      const content = $(el).html() || '';
      if (content.includes('facebook') || content.includes('google') || 
          content.includes('linkedin') || content.includes('pixel')) {
        $(el).remove();
      }
    });
  }

  /**
   * Fetch and inline external CSS (like SiteMirror's ResourceDownloader)
   */
  private async fetchAndInlineCSS(cssUrls: string[], baseUrl: string): Promise<string> {
    const cssContents: string[] = [];
    
    // Filter tracking CSS
    const filteredUrls = cssUrls.filter(url => {
      const lower = url.toLowerCase();
      return !['analytics', 'tracking', 'pixel', 'gtm'].some(p => lower.includes(p));
    });

    // Concurrent fetch (like SiteMirror's ThreadPoolExecutor)
    for (let i = 0; i < filteredUrls.length; i += this.options.maxWorkers) {
      const batch = filteredUrls.slice(i, i + this.options.maxWorkers);
      
      const promises = batch.map(async (url) => {
        // Check cache first
        if (this.resourceCache.has(url)) {
          return this.resourceCache.get(url)!;
        }
        
        try {
          const response = await axios.get(url, {
            timeout: this.options.timeout,
            headers: { 'User-Agent': this.userAgent },
            responseType: 'text',
          });
          
          let css = response.data;
          css = this.rewriteCSSUrls(css, url);
          
          this.resourceCache.set(url, css);
          return `/* SiteMirror: Inlined from ${url} */\n${css}`;
        } catch (e) {
          logError('SiteMirror: CSS fetch failed', e, { url });
          return '';
        }
      });

      const results = await Promise.all(promises);
      cssContents.push(...results.filter(Boolean));
      
      if (i + this.options.maxWorkers < filteredUrls.length) {
        await this.sleep(this.options.delay);
      }
    }

    return cssContents.join('\n\n');
  }

  /**
   * Extract images
   */
  private extractImages($: CheerioAPI): string[] {
    const images: string[] = [];
    const seen = new Set<string>();

    $('img').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      if (src && !src.startsWith('data:') && !seen.has(src)) {
        seen.add(src);
        images.push(src);
      }
    });

    // Background images
    $('[style*="background-image"]').each((_, el) => {
      const style = $(el).attr('style') || '';
      const match = style.match(/url\(["']?([^"')]+)["']?\)/);
      if (match && match[1] && !match[1].startsWith('data:') && !seen.has(match[1])) {
        seen.add(match[1]);
        images.push(match[1]);
      }
    });

    return images;
  }

  /**
   * Extract CSS info
   */
  private extractCSSInfo($: CheerioAPI): { external: string[]; inline: string } {
    const external: string[] = [];
    let inline = '';

    $('link[rel="stylesheet"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href) external.push(href);
    });

    $('style').each((_, el) => {
      const content = $(el).html();
      if (content) inline += content + '\n';
    });

    return { external, inline };
  }

  /**
   * Extract navigation
   */
  private extractNavigation($: CheerioAPI): Array<{ text: string; url: string }> {
    const nav: Array<{ text: string; url: string }> = [];
    const seen = new Set<string>();

    const selectors = ['nav a', 'header a', '.nav a', '.navigation a', '.menu a'];
    
    for (const selector of selectors) {
      $(selector).each((_, el) => {
        const href = $(el).attr('href');
        const text = $(el).text().trim();
        
        if (href && text && !seen.has(href) && 
            !href.startsWith('#') && !href.startsWith('javascript:')) {
          seen.add(href);
          nav.push({ text, url: href });
        }
      });
      
      if (nav.length >= 10) break;
    }

    return nav;
  }

  /**
   * Extract text content
   */
  private extractTextContent($: CheerioAPI): { headings: string[]; paragraphs: string[]; buttons: string[] } {
    return {
      headings: $('h1, h2, h3, h4, h5, h6').map((_, el) => $(el).text().trim()).get().slice(0, 50),
      paragraphs: $('p').map((_, el) => $(el).text().trim()).get().slice(0, 50),
      buttons: $('button, .btn, .button, [role="button"]')
        .map((_, el) => $(el).text().trim() || $(el).val()?.toString().trim())
        .get()
        .filter(Boolean)
        .slice(0, 20),
    };
  }

  /**
   * Extract sections
   */
  private extractSections($: CheerioAPI): Array<{ type: string; content: string }> {
    const sections: Array<{ type: string; content: string }> = [];

    $('body > section, body > div, body > main, body > article, body > header, body > footer').each((_, el) => {
      const type = el.tagName;
      const id = $(el).attr('id') || '';
      const cls = ($(el).attr('class') || '').split(' ')[0];
      
      sections.push({
        type: `${type}${id ? '#' + id : ''}${cls ? '.' + cls : ''}`,
        content: $(el).html()?.substring(0, 500) || '',
      });
    });

    return sections;
  }

  /**
   * Get layout structure
   */
  private getLayoutStructure($: CheerioAPI): string {
    const structure: string[] = [];
    $('body').children().each((_, el) => {
      structure.push(el.tagName);
    });
    return structure.join(' > ');
  }

  /**
   * Extract colors from CSS
   */
  private extractColors(css: string): string[] {
    const regex = /#(?:[0-9a-fA-F]{3}){1,2}\b|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)/g;
    const matches = css.match(regex);
    return matches ? [...new Set(matches)] : [];
  }

  /**
   * Extract fonts from CSS
   */
  private extractFonts(css: string): string[] {
    const regex = /font-family:\s*([^;]+)/g;
    const matches = css.match(regex);
    if (!matches) return [];
    
    const fonts = matches.map(m => 
      m.replace(/font-family:\s*/, '').replace(/['"]/g, '').split(',')[0].trim()
    );
    return [...new Set(fonts)];
  }

  /**
   * MAIN METHOD: Fetch website content
   * Like SiteMirror's main crawl loop
   */
  async fetchWebsiteContent(url?: string): Promise<WebsiteAnalysis | null> {
    const targetUrl = url || this.baseUrl;

    logInfo('🚀 SiteMirror: Starting website clone', { url: targetUrl });

    try {
      let html: string | null = null;

      // DUAL-ENGINE: Try Puppeteer first if forceRender, else try static first
      if (this.options.forceRender) {
        logInfo('SiteMirror: Using Puppeteer (--force_render)', { url: targetUrl });
        html = await this.fetchWithPuppeteer(targetUrl);
        
        // Fallback to Requests if Puppeteer fails
        if (!html) {
          logInfo('SiteMirror: Puppeteer failed, falling back to Requests', { url: targetUrl });
          html = await this.fetchWithRequests(targetUrl);
        }
      } else {
        // Static first, then Puppeteer if needed
        logInfo('SiteMirror: Using Requests (static mode)', { url: targetUrl });
        html = await this.fetchWithRequests(targetUrl);
        
        // If static fetch seems incomplete, try Puppeteer
        if (!html || html.length < 1000) {
          logInfo('SiteMirror: Static fetch incomplete, trying Puppeteer', { url: targetUrl });
          html = await this.fetchWithPuppeteer(targetUrl);
        }
      }

      if (!html) {
        logError('SiteMirror: Failed to fetch content', null, { url: targetUrl });
        return null;
      }

      const $ = load(html);

      // Remove tracking scripts
      this.removeTrackingScripts($);

      // Fix resource URLs
      this.fixResourceUrls($, targetUrl);

      // Convert internal links to local
      this.convertInternalLinksToLocal($);

      const title = $('title').text() || this.domain;
      const description = $('meta[name="description"]').attr('content') || 
                         $('meta[property="og:description"]').attr('content') || '';

      // Extract resources
      const images = this.extractImages($);
      const { external: externalCss, inline: inlineCss } = this.extractCSSInfo($);
      const navigation = this.extractNavigation($);
      const sections = this.extractSections($);
      const textContent = this.extractTextContent($);

      // Fetch and inline external CSS
      const allCss = await this.fetchAndInlineCSS(externalCss, targetUrl);
      const parsedCss = inlineCss + '\n' + allCss;

      // Extract colors and fonts
      const colors = this.extractColors(parsedCss);
      const fonts = this.extractFonts(parsedCss);

      // Add inlined CSS to document
      if (allCss.length > 0) {
        const styleTag = `<style data-sitemirror-inlined="true">\n${allCss}\n</style>`;
        if ($('head').length) {
          $('head').append(styleTag);
        }
      }

      const finalHtml = $.html();

      logInfo('✅ SiteMirror: Clone complete!', {
        url: targetUrl,
        htmlLength: finalHtml.length,
        images: images.length,
        css: externalCss.length,
        colors: colors.length,
        fonts: fonts.length,
      });

      return {
        html: finalHtml,
        title,
        description,
        colors,
        fonts,
        images,
        css: {
          inline: inlineCss,
          external: externalCss,
          parsed: parsedCss,
        },
        layout: {
          structure: this.getLayoutStructure($),
          sections: sections.map(s => s.type),
        },
        navigation,
        sections,
        textContent,
      };
    } catch (error) {
      logError('SiteMirror: Clone failed', error, { url: targetUrl });
      return null;
    }
  }
}
