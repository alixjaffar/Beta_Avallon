// SiteMirror - Complete Website Cloning Implementation
// Based on: https://github.com/pakelcomedy/SiteMirror/
// TypeScript/Node.js port of the Python SiteMirror tool

import axios, { AxiosRequestConfig } from 'axios';
import { load, CheerioAPI } from 'cheerio';
import type { Element } from 'domhandler';
import { logInfo, logError } from '@/lib/log';
import { existsSync, readdirSync, statSync, mkdirSync } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

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

export class SiteMirrorScraper {
  private baseUrl: string;
  private domain: string;
  private protocol: string;
  private options: Required<ScrapeOptions>;
  private userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 SiteMirror/1.0';

  constructor(url: string, options: ScrapeOptions = {}) {
    this.baseUrl = this.normalizeUrl(url);
    const urlObj = new URL(this.baseUrl);
    this.domain = urlObj.hostname;
    this.protocol = urlObj.protocol;

    this.options = {
      maxDepth: options.maxDepth ?? 5,
      maxWorkers: options.maxWorkers ?? 8,
      delay: options.delay ?? 500,
      timeout: options.timeout ?? 30000,
      ignoreRobots: options.ignoreRobots ?? false,
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

  private normalizeUrl(url: string): string {
    let normalized = url.trim().replace(/^["'\s]+|["'\s]+$/g, '');
    if (!normalized.match(/^https?:\/\//i)) {
      normalized = 'https://' + normalized;
    }
    normalized = normalized.replace(/\/+$/, '');
    return normalized;
  }

  private resolveUrl(baseUrl: string, relativeUrl: string): string | null {
    try {
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

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

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
        const backoff = this.options.delay * Math.pow(2, attempt) + Math.random() * 1000;
        await this.sleep(backoff);
      }
    }
    return null;
  }

  private async fetchWithPuppeteer(url: string): Promise<string | null> {
    try {
      // Dynamic import to avoid build-time issues
      const puppeteer = await import('puppeteer');
      const { existsSync, statSync } = await import('fs');
      const { readdirSync } = await import('fs');
      const path = await import('path');
      
      logInfo('🌐 SiteMirror: Using Puppeteer for JavaScript rendering', { url });
      
      // Set PUPPETEER_CACHE_DIR explicitly to ensure Puppeteer knows where to look
      const projectCacheDir = path.default.resolve(process.cwd(), '.puppeteer-cache');
      const renderCacheDir = '/opt/render/.cache/puppeteer';
      const downloadCacheDir = projectCacheDir;

      // Ensure the download cache directory exists
      if (!existsSync(downloadCacheDir)) {
        mkdirSync(downloadCacheDir, { recursive: true });
        logInfo('Created Puppeteer download cache directory', { downloadCacheDir });
      }

      process.env.PUPPETEER_CACHE_DIR = downloadCacheDir;
      
      // Find Chrome executable path - MUST WORK FOR SITEMIRROR
      let executablePath: string | undefined = process.env.PUPPETEER_EXECUTABLE_PATH;
      
      if (!executablePath) {
        const knownVersion = '143.0.7499.169';
        const directPaths = [
          path.default.join(projectCacheDir, 'chrome', `linux-${knownVersion}`, 'chrome-linux64', 'chrome'),
          path.default.join(renderCacheDir, 'chrome', `linux-${knownVersion}`, 'chrome-linux64', 'chrome'),
        ];

        for (const directPath of directPaths) {
          if (existsSync(directPath)) {
            try {
              const stats = statSync(directPath);
              if (stats.isFile()) {
                executablePath = directPath;
                logInfo('✅ Found Chrome at direct path', { path: executablePath });
                break;
              }
            } catch (statError: any) {
              // Continue searching
            }
          }
        }
        
        // Comprehensive file system search if not found by direct path
        if (!executablePath) {
          const possibleCacheDirs = [
            downloadCacheDir,
            renderCacheDir,
            path.default.resolve(process.cwd(), '.cache', 'puppeteer'),
            path.default.resolve(process.env.HOME || '/tmp', '.cache', 'puppeteer'),
          ].filter(Boolean).map(dir => path.default.resolve(dir)) as string[];
          
          const uniqueCacheDirs = [...new Set(possibleCacheDirs)];
          
          for (const searchDir of uniqueCacheDirs) {
            try {
              if (!existsSync(searchDir)) continue;
              
              const chromeDir = path.default.join(searchDir, 'chrome');
              
              if (existsSync(chromeDir)) {
                const dirs = readdirSync(chromeDir);
                const versionDir = dirs.find(d => d.startsWith('linux-'));
                
                if (versionDir) {
                  const possiblePaths = [
                    path.default.resolve(chromeDir, versionDir, 'chrome-linux64', 'chrome'),
                    path.default.resolve(chromeDir, versionDir, 'chrome', 'chrome'),
                    path.default.resolve(chromeDir, versionDir, 'headless_shell', 'headless_shell'),
                  ];
                  
                  for (const chromePath of possiblePaths) {
                    if (existsSync(chromePath)) {
                      try {
                        const stats = statSync(chromePath);
                        if (stats.isFile()) {
                          executablePath = chromePath;
                          logInfo('✅✅✅ FOUND CHROME EXECUTABLE', { path: executablePath });
                          break;
                        }
                      } catch (statError: any) {
                        // Continue
                      }
                    }
                  }
                  
                  if (executablePath) break;
                }
              }
            } catch (error: any) {
              // Continue searching
            }
          }
        }
        
        // Runtime download fallback
        if (!executablePath) {
          logInfo('Chrome not found through search, attempting runtime download...');
          try {
            execSync(`npx puppeteer browsers install chrome`, { 
              stdio: 'inherit', 
              env: { ...process.env, PUPPETEER_CACHE_DIR: downloadCacheDir } 
            });
            
            const chromeDir = path.default.join(downloadCacheDir, 'chrome');
            if (existsSync(chromeDir)) {
              const dirs = readdirSync(chromeDir);
              const versionDir = dirs.find(d => d.startsWith('linux-'));
              if (versionDir) {
                const downloadedPath = path.default.join(chromeDir, versionDir, 'chrome-linux64', 'chrome');
                if (existsSync(downloadedPath)) {
                  executablePath = downloadedPath;
                  logInfo('✅ Chrome downloaded and found at runtime', { path: executablePath });
                }
              }
            }
          } catch (downloadError: any) {
            logError('Failed to download Chrome at runtime', downloadError);
          }
        }
      }

      if (!executablePath) {
        logError('CRITICAL: Chrome not found - SiteMirror requires Puppeteer', null, {
          cacheDir: downloadCacheDir,
          puppeteerEnv: {
            PUPPETEER_CACHE_DIR: process.env.PUPPETEER_CACHE_DIR,
            PUPPETEER_EXECUTABLE_PATH: process.env.PUPPETEER_EXECUTABLE_PATH,
          }
        });
        throw new Error('Could not find Chrome executable for Puppeteer.');
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
        executablePath: executablePath,
      };
      
      const browser = await puppeteer.default.launch(launchOptions);

      try {
        const page = await browser.newPage();
        
        // Set viewport (like SiteMirror's Selenium)
        await page.setViewport({ width: 1920, height: 1080 });
        
        // Block unnecessary resources to speed up (like SiteMirror)
        await page.setRequestInterception(true);
        page.on('request', (req) => {
          const resourceType = req.resourceType();
          if (['document', 'stylesheet', 'script', 'image', 'font', 'media'].includes(resourceType)) {
            req.continue();
          } else {
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
        logInfo('📄 SiteMirror: Main page fetched', {
          url,
          htmlLength: html.length,
          method: 'Puppeteer'
        });

        return html;
      } finally {
        await browser.close();
      }
    } catch (error: any) {
      logError('SiteMirror: Puppeteer fetch failed', error, { url, errorMessage: error?.message });
      return null;
    }
  }

  async fetchWebsiteContent(url?: string): Promise<WebsiteAnalysis | null> {
    const targetUrl = url || this.baseUrl;
    
    logInfo('🚀 SiteMirror: Starting website clone', { url: targetUrl });

    try {
      let html: string | null = null;
      
      // Following SiteMirror's dual-engine approach (Requests vs Selenium)
      if (this.options.forceRender) {
        // Use Puppeteer for JavaScript rendering (like SiteMirror's Selenium mode)
        html = await this.fetchWithPuppeteer(targetUrl);
        
        // Fallback to HTTP fetch if Puppeteer fails
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
        } else {
          // Fallback to Puppeteer if HTTP fails
          logInfo('🔄 SiteMirror: Regular fetch failed, trying Puppeteer', { url: targetUrl });
          html = await this.fetchWithPuppeteer(targetUrl);
        }
      }
      
      if (!html) {
        logError('SiteMirror: Failed to fetch main page', null, { url: targetUrl });
        return null;
      }

      const $ = load(html);
      const title = $('title').first().text() || '';
      const description = $('meta[name="description"]').attr('content') || '';

      // Rewrite all URLs to be absolute
      this.rewriteUrls($, targetUrl);

      const images = this.extractImages($);
      const css = this.extractCss($, targetUrl);
      const colors = this.extractColors(css.parsed);
      const fonts = this.extractFonts(css.parsed);
      const layout = this.analyzeLayout($);
      const navigation = this.extractNavigation($);
      const sections = this.extractSections($);
      const textContent = this.extractTextContent($);

      logInfo('✅ SiteMirror: Website clone complete', {
        url: targetUrl,
        title,
        htmlLength: html.length,
        cssLength: css.parsed.length,
        colors: colors.length,
        fonts: fonts.length,
        images: images.length,
        internalLinks: navigation.filter(link => this.isSameDomain(link.url)).length,
      });

      return {
        html,
        title,
        description,
        colors,
        fonts,
        images,
        css,
        layout,
        navigation,
        sections,
        textContent,
      };
    } catch (error) {
      logError('SiteMirror: Error during website cloning', error, { url: targetUrl });
      return null;
    }
  }

  private rewriteUrls($: CheerioAPI, baseUrl: string): void {
    $('a, link, script, img, source, iframe').each((_, element) => {
      const $element = $(element);
      let href = $element.attr('href');
      let src = $element.attr('src');
      let srcset = $element.attr('srcset');

      if (href) {
        const absoluteUrl = this.resolveUrl(baseUrl, href);
        if (absoluteUrl) {
          $element.attr('href', absoluteUrl);
        }
      }
      if (src) {
        const absoluteUrl = this.resolveUrl(baseUrl, src);
        if (absoluteUrl) {
          $element.attr('src', absoluteUrl);
        }
      }
      if (srcset) {
        // Handle srcset for responsive images
        const updatedSrcset = srcset.split(',').map(s => {
          const parts = s.trim().split(/\s+/);
          const url = parts[0];
          const descriptor = parts[1] || '';
          const absoluteUrl = this.resolveUrl(baseUrl, url);
          return absoluteUrl ? `${absoluteUrl} ${descriptor}`.trim() : s;
        }).join(', ');
        $element.attr('srcset', updatedSrcset);
      }
    });
  }

  private extractImages($: CheerioAPI): string[] {
    const images: string[] = [];
    $('img').each((_, element) => {
      const src = $(element).attr('src');
      if (src) {
        images.push(src);
      }
    });
    return images;
  }

  private extractCss($: CheerioAPI, baseUrl: string): { inline: string; external: string[]; parsed: string } {
    let inlineCss = '';
    const externalCss: string[] = [];
    let parsedCss = '';

    // Extract inline styles
    $('style').each((_, element) => {
      inlineCss += $(element).html() || '';
    });

    // Extract external stylesheets
    $('link[rel="stylesheet"]').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        const absoluteUrl = this.resolveUrl(baseUrl, href);
        if (absoluteUrl) {
          externalCss.push(absoluteUrl);
        }
      }
    });

    // For now, combine for parsing. In a real scenario, you'd fetch external CSS.
    parsedCss = inlineCss; // Simplified: only inline for now

    logInfo('🎨 SiteMirror: CSS parsed', { url: baseUrl, embeddedAssets: inlineCss.length > 0 ? 1 : 0 });

    return { inline: inlineCss, external: externalCss, parsed: parsedCss };
  }

  private extractColors(css: string): string[] {
    const colorRegex = /#(?:[0-9a-fA-F]{3}){1,2}|rgb\((?:\d{1,3},\s*){2}\d{1,3}\)|rgba\((?:\d{1,3},\s*){3}(?:0?\.\d+|1)\)|hsl\(\d{1,3},\s*\d{1,3}%,\s*\d{1,3}%\)|hsla\(\d{1,3},\s*\d{1,3}%,\s*\d{1,3}%(?:,\s*(?:0?\.\d+|1))\)/g;
    const colors = css.match(colorRegex) || [];
    return [...new Set(colors)]; // Unique colors
  }

  private extractFonts(css: string): string[] {
    const fontRegex = /font-family:\s*([^;]+)/g;
    const matches = css.match(fontRegex) || [];
    const fonts = matches.map(match => match.replace(/font-family:\s*/, '').replace(/['";]/g, '').trim());
    return [...new Set(fonts)]; // Unique fonts
  }

  private analyzeLayout($: CheerioAPI): { structure: string; sections: string[] } {
    const sections: string[] = [];
    // Basic section detection
    $('header, nav, main, article, section, aside, footer').each((_, el) => {
      sections.push(el.tagName);
    });
    return {
      structure: 'Basic HTML structure detected',
      sections: [...new Set(sections)],
    };
  }

  private extractNavigation($: CheerioAPI): Array<{ text: string; url: string }> {
    const navigation: Array<{ text: string; url: string }> = [];
    $('nav a').each((_, element) => {
      const $element = $(element);
      const text = $element.text().trim();
      const url = $element.attr('href');
      if (text && url) {
        navigation.push({ text, url });
      }
    });
    return navigation;
  }

  private extractSections($: CheerioAPI): Array<{ type: string; content: string }> {
    const sections: Array<{ type: string; content: string }> = [];
    $('h1, h2, h3, p, button').each((_, element) => {
      const $element = $(element);
      sections.push({
        type: element.tagName,
        content: $element.text().trim(),
      });
    });
    return sections;
  }

  private extractTextContent($: CheerioAPI): { headings: string[]; paragraphs: string[]; buttons: string[] } {
    const headings: string[] = [];
    const paragraphs: string[] = [];
    const buttons: string[] = [];

    $('h1, h2, h3, h4, h5, h6').each((_, el) => {
      headings.push($(el).text().trim());
    });

    $('p').each((_, el) => {
      paragraphs.push($(el).text().trim());
    });

    $('button').each((_, el) => {
      buttons.push($(el).text().trim());
    });

    return { headings, paragraphs, buttons };
  }
}
