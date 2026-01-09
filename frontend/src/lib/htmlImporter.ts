/**
 * Advanced HTML Importer for Avallon
 * 
 * This module handles importing existing websites into Avallon's editor
 * while preserving EVERYTHING - exact formatting, styles, images, and structure.
 * 
 * Key Features:
 * - Fetches and inlines ALL external CSS
 * - Converts images to absolute URLs or data URIs
 * - Preserves all fonts and external resources
 * - Handles relative URL conversion
 * - Detects and preserves CSS frameworks
 */

// Common CDN patterns to preserve (don't inline these, just fix URLs)
const CDN_PATTERNS = [
  'cdnjs.cloudflare.com',
  'unpkg.com',
  'jsdelivr.net',
  'googleapis.com',
  'gstatic.com',
  'fontawesome.com',
  'bootstrapcdn.com',
  'tailwindcss.com',
  'fonts.googleapis.com',
  'kit.fontawesome.com',
  'use.typekit.net',
  'maxcdn.bootstrapcdn.com',
  'stackpath.bootstrapcdn.com',
  'cdn.jsdelivr.net',
];

// Framework detection patterns
const FRAMEWORK_PATTERNS = {
  bootstrap: /bootstrap(\.min)?\.css/i,
  tailwind: /tailwind(css)?/i,
  bulma: /bulma(\.min)?\.css/i,
  foundation: /foundation(\.min)?\.css/i,
  materialize: /materialize(\.min)?\.css/i,
  fontawesome: /font-?awesome|fa-/i,
  animate: /animate(\.min)?\.css/i,
};

interface ImportOptions {
  sourceUrl?: string;
  preserveExternalCSS?: boolean;
  preserveExternalJS?: boolean;
  preserveImages?: boolean;
  preserveFonts?: boolean;
  convertRelativeUrls?: boolean;
  inlineExternalCSS?: boolean;
  inlineImages?: boolean;
  cleanupHTML?: boolean;
  preserveMetaTags?: boolean;
  preserveStructure?: boolean;
  fetchTimeout?: number;
}

interface ImportResult {
  html: string;
  css: string[];
  js: string[];
  fonts: string[];
  images: string[];
  frameworks: string[];
  errors: string[];
  warnings: string[];
  inlinedCSS?: string;
}

export interface DetectedPage {
  url: string;
  title: string;
  path: string;
  suggestedFilename: string;
  isExternal: boolean;
}

export interface MultiPageImportResult {
  pages: Array<{
    filename: string;
    html: string;
    title: string;
    url: string;
  }>;
  sharedCSS: string[];
  sharedFonts: string[];
  frameworks: string[];
  errors: string[];
  warnings: string[];
}

/**
 * Main HTML import function - FULL IMPORT with resource fetching
 * Takes raw HTML and processes it for use in Avallon's editor
 */
export async function importHTML(
  rawHtml: string,
  options: ImportOptions = {}
): Promise<ImportResult> {
  const {
    sourceUrl = '',
    preserveExternalCSS = true,
    preserveExternalJS = true,
    preserveImages = true,
    preserveFonts = true,
    convertRelativeUrls = true,
    inlineExternalCSS = true,
    inlineImages = false, // Can be expensive for large images
    cleanupHTML = false, // Keep original formatting
    preserveMetaTags = true,
    preserveStructure = true,
    fetchTimeout = 10000,
  } = options;

  const result: ImportResult = {
    html: rawHtml,
    css: [],
    js: [],
    fonts: [],
    images: [],
    frameworks: [],
    errors: [],
    warnings: [],
    inlinedCSS: '',
  };

  try {
    // Step 1: Parse and normalize HTML (minimal changes)
    let html = normalizeHTML(rawHtml);

    // Step 2: Convert relative URLs FIRST if source URL provided
    if (convertRelativeUrls && sourceUrl) {
      html = convertToAbsoluteUrls(html, sourceUrl);
    }

    // Step 3: Extract and categorize resources
    const resources = extractResources(html, sourceUrl);
    result.css = resources.css;
    result.js = resources.js;
    result.fonts = resources.fonts;
    result.images = resources.images;

    // Step 4: Detect frameworks
    result.frameworks = detectFrameworks(html, resources.css);

    // Step 5: Fetch and inline external CSS (THE KEY STEP!)
    if (inlineExternalCSS && resources.css.length > 0) {
      const { html: htmlWithInlinedCSS, inlinedCSS, errors } = await fetchAndInlineCSS(
        html, 
        resources.css, 
        sourceUrl,
        fetchTimeout
      );
      html = htmlWithInlinedCSS;
      result.inlinedCSS = inlinedCSS;
      result.errors.push(...errors);
    }

    // Step 6: Fix common issues
    html = fixCommonIssues(html);

    // Step 7: Ensure external resources are properly preserved
    if (preserveExternalCSS) {
      html = ensureExternalCSSPreserved(html, result.frameworks);
    }

    if (preserveFonts) {
      html = ensureFontsPreserved(html);
    }

    // Step 8: Add integrity fixes for common CDNs
    html = fixCDNIntegrity(html);

    // Step 9: Ensure proper document structure
    if (preserveStructure) {
      html = ensureProperStructure(html);
    }

    // Step 10: Ensure meta tags
    if (preserveMetaTags) {
      html = ensureMetaTags(html);
    }

    // Step 11: Add base tag for relative resources if we have a source URL
    if (sourceUrl) {
      html = addBaseTag(html, sourceUrl);
    }

    result.html = html;

  } catch (error) {
    result.errors.push(`Import error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return result;
}

/**
 * Fetch and inline ALL external CSS - This is the key function!
 */
async function fetchAndInlineCSS(
  html: string,
  cssUrls: string[],
  sourceUrl: string,
  timeout: number
): Promise<{ html: string; inlinedCSS: string; errors: string[] }> {
  const errors: string[] = [];
  const inlinedStyles: string[] = [];
  const failedUrls: string[] = [];
  
  // Filter out tracking/analytics CSS
  const trackingPatterns = ['analytics', 'tracking', 'pixel', 'gtm', 'gtag'];
  const filteredCssUrls = cssUrls.filter(url => {
    const lowerUrl = url.toLowerCase();
    return !trackingPatterns.some(pattern => lowerUrl.includes(pattern));
  });
  
  // Fetch all CSS files in parallel (with limit to avoid overwhelming)
  const batchSize = 5;
  const results: Array<{ url: string; css: string | null; isCDN: boolean }> = [];
  
  for (let i = 0; i < filteredCssUrls.length; i += batchSize) {
    const batch = filteredCssUrls.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (cssUrl) => {
      // Skip CDN resources - keep them as external links (they work cross-origin)
      if (CDN_PATTERNS.some(pattern => cssUrl.includes(pattern))) {
        return { url: cssUrl, css: null, isCDN: true };
      }
      
      try {
        const absoluteUrl = makeAbsoluteUrl(cssUrl, sourceUrl);
        
        // Skip if it's a data URL or blob
        if (absoluteUrl.startsWith('data:') || absoluteUrl.startsWith('blob:')) {
          return { url: cssUrl, css: null, isCDN: false };
        }
        
        const response = await fetchWithTimeout(absoluteUrl, timeout);
        
        if (!response.ok) {
          console.warn(`Failed to fetch CSS: ${cssUrl} (${response.status})`);
          failedUrls.push(cssUrl);
          return { url: cssUrl, css: null, isCDN: false };
        }
        
        let cssContent = await response.text();
        
        // Check if it's actually CSS (some servers return HTML error pages)
        if (cssContent.trim().startsWith('<!DOCTYPE') || cssContent.trim().startsWith('<html')) {
          console.warn(`CSS URL returned HTML instead: ${cssUrl}`);
          failedUrls.push(cssUrl);
          return { url: cssUrl, css: null, isCDN: false };
        }
        
        // Process CSS to fix relative URLs within it
        cssContent = processCSSUrls(cssContent, absoluteUrl);
        
        return { url: cssUrl, css: cssContent, isCDN: false };
      } catch (error) {
        console.warn(`Error fetching CSS ${cssUrl}:`, error);
        failedUrls.push(cssUrl);
        return { url: cssUrl, css: null, isCDN: false };
      }
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }
  
  // Build inlined CSS
  for (const result of results) {
    if (result.css) {
      inlinedStyles.push(`/* Inlined from: ${result.url} */\n${result.css}`);
      
      // Remove the original link tag for this CSS
      // Match both the exact URL and any URL that ends with the same filename
      const urlParts = result.url.split('/');
      const filename = urlParts[urlParts.length - 1].split('?')[0];
      
      // Try to remove by exact URL
      const escapedUrl = result.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      html = html.replace(
        new RegExp(`<link[^>]*href=["'][^"']*${escapedUrl.split('?')[0]}[^"']*["'][^>]*>`, 'gi'),
        ''
      );
      
      // Also try to match by filename in case URL format is slightly different
      if (filename) {
        const escapedFilename = filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        html = html.replace(
          new RegExp(`<link[^>]*href=["'][^"']*${escapedFilename}[^"']*["'][^>]*rel=["']stylesheet["'][^>]*>`, 'gi'),
          ''
        );
        html = html.replace(
          new RegExp(`<link[^>]*rel=["']stylesheet["'][^>]*href=["'][^"']*${escapedFilename}[^"']*["'][^>]*>`, 'gi'),
          ''
        );
      }
    }
  }
  
  // Add note about failed URLs (but don't treat as errors - site may still work)
  if (failedUrls.length > 0) {
    console.log(`Note: ${failedUrls.length} CSS files could not be fetched (CORS restrictions). The site may still render correctly with CDN styles.`);
  }
  
  // Insert inlined CSS into the head
  if (inlinedStyles.length > 0) {
    const inlinedCSS = inlinedStyles.join('\n\n');
    const styleTag = `<style data-inlined="true">\n${inlinedCSS}\n</style>`;
    
    if (html.includes('</head>')) {
      html = html.replace('</head>', `${styleTag}\n</head>`);
    } else if (html.includes('<body')) {
      html = html.replace(/<body/i, `${styleTag}\n<body`);
    } else {
      html = styleTag + '\n' + html;
    }
  }
  
  return { html, inlinedCSS: inlinedStyles.join('\n\n'), errors };
}

/**
 * Process CSS content to fix relative URLs
 */
function processCSSUrls(css: string, cssFileUrl: string): string {
  try {
    const cssBase = new URL(cssFileUrl);
    const cssDir = cssBase.href.substring(0, cssBase.href.lastIndexOf('/') + 1);
    
    // Fix url() references in CSS
    css = css.replace(/url\(["']?(?!data:|https?:|\/\/)([^"')]+)["']?\)/gi, (match, url) => {
      const absoluteUrl = resolveUrl(url.trim(), cssBase.origin, cssDir.replace(cssBase.origin, ''));
      return `url("${absoluteUrl}")`;
    });
    
    // Fix @import statements
    css = css.replace(/@import\s+["'](?!https?:|\/\/)([^"']+)["']/gi, (match, url) => {
      const absoluteUrl = resolveUrl(url.trim(), cssBase.origin, cssDir.replace(cssBase.origin, ''));
      return `@import "${absoluteUrl}"`;
    });
    
  } catch (error) {
    console.warn('Error processing CSS URLs:', error);
  }
  
  return css;
}

/**
 * Fetch external resource through our proxy (to avoid CORS issues)
 */
async function fetchWithTimeout(url: string, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    // ALWAYS use our proxy to avoid CORS issues
    const baseUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:3000'
      : 'https://beta-avallon.onrender.com';
    
    const proxyResponse = await fetch(
      `${baseUrl}/api/proxy?url=${encodeURIComponent(url)}&type=css`,
      { signal: controller.signal }
    );
    
    clearTimeout(timeoutId);
    return proxyResponse;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Make a URL absolute
 */
function makeAbsoluteUrl(url: string, sourceUrl: string): string {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
    if (url.startsWith('//')) {
      return 'https:' + url;
    }
    return url;
  }
  
  try {
    const base = new URL(sourceUrl);
    return new URL(url, base).href;
  } catch {
    return url;
  }
}

/**
 * Add base tag for relative resources
 */
function addBaseTag(html: string, sourceUrl: string): string {
  try {
    const base = new URL(sourceUrl);
    const baseHref = base.origin + base.pathname.substring(0, base.pathname.lastIndexOf('/') + 1);
    
    // Check if base tag already exists
    if (/<base[^>]+href/i.test(html)) {
      return html;
    }
    
    const baseTag = `<base href="${baseHref}" target="_self">`;
    
    if (html.includes('<head>')) {
      html = html.replace('<head>', `<head>\n  ${baseTag}`);
    } else if (html.includes('<head ')) {
      html = html.replace(/<head([^>]*)>/i, `<head$1>\n  ${baseTag}`);
    }
    
    return html;
  } catch {
    return html;
  }
}

/**
 * Normalize HTML - minimal changes to preserve original structure
 */
function normalizeHTML(html: string): string {
  // Remove BOM characters
  html = html.replace(/^\uFEFF/, '');
  
  // Normalize line endings
  html = html.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  return html;
}

/**
 * Extract all resources (CSS, JS, fonts, images) from HTML
 */
function extractResources(html: string, sourceUrl: string = ''): { css: string[]; js: string[]; fonts: string[]; images: string[] } {
  const css: string[] = [];
  const js: string[] = [];
  const fonts: string[] = [];
  const images: string[] = [];
  
  // Extract CSS links - multiple patterns to catch all
  const cssPatterns = [
    /<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi,
    /<link[^>]+href=["']([^"']+)["'][^>]*rel=["']stylesheet["'][^>]*>/gi,
    /<link[^>]+href=["']([^"']+\.css(?:\?[^"']*)?)["'][^>]*>/gi,
  ];
  
  for (const pattern of cssPatterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      const url = makeAbsoluteUrl(match[1], sourceUrl);
      if (!css.includes(url)) css.push(url);
    }
  }
  
  // Extract JS scripts
  const jsRegex = /<script[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = jsRegex.exec(html)) !== null) {
    const url = makeAbsoluteUrl(match[1], sourceUrl);
    if (!js.includes(url)) js.push(url);
  }
  
  // Extract font imports from inline styles
  const fontImportRegex = /@import\s+url\(["']?([^"')]+)["']?\)/gi;
  while ((match = fontImportRegex.exec(html)) !== null) {
    if (match[1].includes('fonts.googleapis.com') || match[1].includes('fonts.gstatic.com')) {
      fonts.push(match[1]);
    }
  }
  
  // Extract Google Fonts links
  const googleFontsRegex = /<link[^>]+href=["'](https?:\/\/fonts\.googleapis\.com[^"']+)["'][^>]*>/gi;
  while ((match = googleFontsRegex.exec(html)) !== null) {
    if (!fonts.includes(match[1])) fonts.push(match[1]);
  }
  
  // Extract images
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  while ((match = imgRegex.exec(html)) !== null) {
    const url = makeAbsoluteUrl(match[1], sourceUrl);
    if (!images.includes(url)) images.push(url);
  }
  
  // Extract background images from inline styles
  const bgImageRegex = /background(?:-image)?:\s*url\(["']?([^"')]+)["']?\)/gi;
  while ((match = bgImageRegex.exec(html)) !== null) {
    const url = makeAbsoluteUrl(match[1], sourceUrl);
    if (!images.includes(url)) images.push(url);
  }
  
  // Extract srcset images
  const srcsetRegex = /srcset=["']([^"']+)["']/gi;
  while ((match = srcsetRegex.exec(html)) !== null) {
    const srcset = match[1];
    srcset.split(',').forEach(item => {
      const url = item.trim().split(/\s+/)[0];
      if (url) {
        const absoluteUrl = makeAbsoluteUrl(url, sourceUrl);
        if (!images.includes(absoluteUrl)) images.push(absoluteUrl);
      }
    });
  }
  
  return { css, js, fonts, images };
}

/**
 * Detect frameworks used in the HTML
 */
function detectFrameworks(html: string, cssUrls: string[]): string[] {
  const frameworks: string[] = [];
  
  const allContent = html + ' ' + cssUrls.join(' ');
  
  Object.entries(FRAMEWORK_PATTERNS).forEach(([framework, pattern]) => {
    if (pattern.test(allContent)) {
      frameworks.push(framework);
    }
  });
  
  // Check for specific class patterns
  if (/class=["'][^"']*(?:container|row|col-|btn-|card|navbar|modal)/.test(html)) {
    if (!frameworks.includes('bootstrap')) frameworks.push('bootstrap');
  }
  
  if (/class=["'][^"']*(?:flex|grid|text-|bg-|p-|m-|w-|h-)/.test(html)) {
    if (!frameworks.includes('tailwind')) frameworks.push('tailwind');
  }
  
  return frameworks;
}

/**
 * Convert relative URLs to absolute URLs
 */
function convertToAbsoluteUrls(html: string, sourceUrl: string): string {
  try {
    const baseUrl = new URL(sourceUrl);
    const baseOrigin = baseUrl.origin;
    const basePath = baseUrl.pathname.substring(0, baseUrl.pathname.lastIndexOf('/') + 1);
    
    // Convert href attributes (but not anchors or mailto/tel)
    html = html.replace(/href=["'](?!(?:https?:|mailto:|tel:|#|javascript:|data:))([^"']+)["']/gi, (match, url) => {
      const absoluteUrl = resolveUrl(url, baseOrigin, basePath);
      return `href="${absoluteUrl}"`;
    });
    
    // Convert src attributes
    html = html.replace(/src=["'](?!(?:https?:|data:|\/\/))([^"']+)["']/gi, (match, url) => {
      const absoluteUrl = resolveUrl(url, baseOrigin, basePath);
      return `src="${absoluteUrl}"`;
    });
    
    // Convert url() in inline styles
    html = html.replace(/url\(["']?(?!(?:https?:|data:|\/\/))([^"')]+)["']?\)/gi, (match, url) => {
      const absoluteUrl = resolveUrl(url, baseOrigin, basePath);
      return `url("${absoluteUrl}")`;
    });
    
    // Convert srcset attributes
    html = html.replace(/srcset=["']([^"']+)["']/gi, (match, srcset) => {
      const newSrcset = srcset.split(',').map((item: string) => {
        const parts = item.trim().split(/\s+/);
        if (parts[0] && !parts[0].startsWith('http') && !parts[0].startsWith('data:')) {
          parts[0] = resolveUrl(parts[0], baseOrigin, basePath);
        }
        return parts.join(' ');
      }).join(', ');
      return `srcset="${newSrcset}"`;
    });
    
    // Convert poster attributes (video)
    html = html.replace(/poster=["'](?!(?:https?:|data:))([^"']+)["']/gi, (match, url) => {
      const absoluteUrl = resolveUrl(url, baseOrigin, basePath);
      return `poster="${absoluteUrl}"`;
    });
    
    // Convert data-src (lazy loading)
    html = html.replace(/data-src=["'](?!(?:https?:|data:))([^"']+)["']/gi, (match, url) => {
      const absoluteUrl = resolveUrl(url, baseOrigin, basePath);
      return `data-src="${absoluteUrl}"`;
    });
    
    // Convert action attributes (forms)
    html = html.replace(/action=["'](?!(?:https?:|mailto:|javascript:))([^"']+)["']/gi, (match, url) => {
      const absoluteUrl = resolveUrl(url, baseOrigin, basePath);
      return `action="${absoluteUrl}"`;
    });
    
  } catch (error) {
    console.warn('Failed to convert URLs:', error);
  }
  
  return html;
}

/**
 * Resolve a relative URL to absolute
 */
function resolveUrl(url: string, baseOrigin: string, basePath: string): string {
  if (!url || url.startsWith('http') || url.startsWith('data:') || url.startsWith('//')) {
    if (url.startsWith('//')) {
      return 'https:' + url;
    }
    return url;
  }
  
  if (url.startsWith('/')) {
    return baseOrigin + url;
  }
  
  // Handle ../ and ./ paths
  let resolvedPath = basePath;
  let remainingUrl = url;
  
  while (remainingUrl.startsWith('../')) {
    resolvedPath = resolvedPath.substring(0, resolvedPath.lastIndexOf('/', resolvedPath.length - 2) + 1);
    remainingUrl = remainingUrl.substring(3);
  }
  
  if (remainingUrl.startsWith('./')) {
    remainingUrl = remainingUrl.substring(2);
  }
  
  return baseOrigin + resolvedPath + remainingUrl;
}

/**
 * Fix common HTML issues
 */
function fixCommonIssues(html: string): string {
  // Fix broken Unsplash URLs
  html = html.replace(/src=["'](?:photo-)?(\d+-[\da-f]+)(?:\?[^"']*)?["']/gi, (match, id) => {
    return `src="https://images.unsplash.com/photo-${id}?w=800&h=600&fit=crop"`;
  });
  
  // Fix Font Awesome integrity issues
  html = html.replace(/<link([^>]*href=["'][^"']*font-?awesome[^"']*["'][^>]*)>/gi, (match, attrs) => {
    let newAttrs = attrs.replace(/\s+integrity=["'][^"']*["']/gi, '');
    newAttrs = newAttrs.replace(/\s+crossorigin=["'][^"']*["']/gi, '');
    return `<link${newAttrs}>`;
  });
  
  // Fix empty alt attributes
  html = html.replace(/<img([^>]*)>/gi, (match, attrs) => {
    if (!attrs.includes('alt=')) {
      return `<img${attrs} alt="">`;
    }
    return match;
  });
  
  // Remove IE conditional comments
  html = html.replace(/<!--\[if[^\]]*\]>[\s\S]*?<!\[endif\]-->/gi, '');
  html = html.replace(/<!--\[if[^\]]*\]><!-->[\s\S]*?<!--<!\[endif\]-->/gi, '');
  
  // Remove ONLY tracking/analytics scripts - keep functional scripts!
  html = removeTrackingScripts(html);
  
  // Remove link preload/modulepreload for external scripts (not CSS or fonts)
  html = html.replace(/<link[^>]*rel=["'](?:preload|modulepreload)["'][^>]*as=["']script["'][^>]*>/gi, '');
  
  // Keep inline scripts but remove problematic dynamic imports
  html = html.replace(/import\s*\(\s*["'][^"']+["']\s*\)/g, 'Promise.resolve({})');
  
  // DO NOT remove all external scripts - many are needed for hero animations, sliders, etc.
  // Only remove known problematic ones (already handled by removeTrackingScripts)
  
  // Fix WordPress navigation and other elements that require JS to display
  html = fixWordPressElements(html);
  
  return html;
}

/**
 * Fix WordPress-specific elements that are hidden by default until JS runs
 */
function fixWordPressElements(html: string): string {
  // Extract navigation links from the HTML to build a fallback nav
  const navLinks = extractNavigationLinks(html);
  
  // Create a fallback navigation bar
  const fallbackNav = navLinks.length > 0 ? `
<nav class="avallon-fallback-nav" style="display: flex; align-items: center; gap: 2rem; margin-left: auto;">
  ${navLinks.map(link => `<a href="${link.href}" style="color: inherit; text-decoration: none; font-weight: 500; font-size: 14px;">${link.text}</a>`).join('\n  ')}
</nav>
` : '';

  // More aggressive CSS fix
  const wpFixCSS = `
<style data-wp-fixes="true">
/* AGGRESSIVE FIX: Force ALL navigation to be visible */
.wp-block-navigation,
.wp-block-navigation__responsive-container,
.wp-block-navigation__responsive-container.is-menu-open,
.wp-block-navigation__responsive-container.hidden-by-default,
nav[class*="navigation"],
[class*="wp-block-navigation"] {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  position: relative !important;
  top: auto !important;
  left: auto !important;
  right: auto !important;
  width: auto !important;
  height: auto !important;
  max-height: none !important;
  transform: none !important;
  background: transparent !important;
  pointer-events: auto !important;
  overflow: visible !important;
  clip: auto !important;
  clip-path: none !important;
}

/* Hide hamburger/mobile menu buttons */
.wp-block-navigation__responsive-container-open,
.wp-block-navigation__responsive-close,
button[aria-label*="menu"],
button[aria-label*="Menu"],
.menu-toggle,
.mobile-menu-toggle {
  display: none !important;
}

/* Force nav content to show */
.wp-block-navigation__responsive-container-content,
.wp-block-navigation__container {
  display: flex !important;
  flex-direction: row !important;
  gap: 1.5rem !important;
  align-items: center !important;
  visibility: visible !important;
  opacity: 1 !important;
  position: relative !important;
  transform: none !important;
}

/* Force nav items visible */
.wp-block-navigation-item,
.wp-block-navigation-link,
.menu-item,
nav li {
  display: inline-flex !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.wp-block-navigation-item__content,
.wp-block-navigation-link__content,
nav a {
  display: inline-block !important;
  visibility: visible !important;
  opacity: 1 !important;
  color: inherit !important;
}

/* Remove any hiding transforms/clips */
[style*="display: none"],
[style*="display:none"],
[style*="visibility: hidden"],
[style*="visibility:hidden"] {
  display: revert !important;
  visibility: visible !important;
}

/* Fix header layout */
header, .site-header, .header, .wp-block-template-part {
  display: flex !important;
  visibility: visible !important;
  overflow: visible !important;
  align-items: center !important;
}

/* Fallback nav styling */
.avallon-fallback-nav {
  display: flex !important;
  align-items: center !important;
  gap: 2rem !important;
  margin-left: auto !important;
}

.avallon-fallback-nav a {
  color: inherit !important;
  text-decoration: none !important;
  font-weight: 500 !important;
}

.avallon-fallback-nav a:hover {
  opacity: 0.7 !important;
}

/* Ensure the row layout for header */
.wp-block-group.is-layout-flex,
.wp-block-columns,
header .wp-block-group {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: space-between !important;
  width: 100% !important;
}
</style>
`;

  // Insert the fix CSS into the head
  if (html.includes('</head>')) {
    html = html.replace('</head>', wpFixCSS + '\n</head>');
  } else if (html.includes('<body')) {
    html = html.replace(/<body/i, wpFixCSS + '\n<body');
  }

  // Remove ALL data-wp-* attributes that control visibility
  html = html.replace(/\s*data-wp-[a-z-]+="[^"]*"/gi, '');
  
  // Remove hidden-by-default and similar classes
  html = html.replace(/\bhas-modal-open\b/gi, '');
  html = html.replace(/\bhidden-by-default\b/gi, '');
  html = html.replace(/\bis-menu-open\b/gi, '');
  
  // Make sure aria-hidden is not hiding navigation
  html = html.replace(/(<nav[^>]*)aria-hidden="true"/gi, '$1aria-hidden="false"');
  html = html.replace(/(<ul[^>]*)aria-hidden="true"/gi, '$1aria-hidden="false"');
  
  // Remove inline style hiding from key elements
  html = html.replace(/<(nav|header|ul|li|div)([^>]*)style="([^"]*)(display\s*:\s*none|visibility\s*:\s*hidden|opacity\s*:\s*0|clip\s*:[^;]+)([^"]*)"([^>]*)>/gi, 
    '<$1$2style="$3$5"$6>');
  
  // If there's a header with logo but no visible nav, inject fallback nav
  if (fallbackNav && html.includes('wp-block-site-logo') && !html.includes('wp-block-navigation-item__content')) {
    // Find the header and inject fallback nav
    html = html.replace(
      /(<header[^>]*>[\s\S]*?<div[^>]*class="[^"]*wp-block-site-logo[^"]*"[^>]*>[\s\S]*?<\/div>)/i,
      `$1\n${fallbackNav}`
    );
  }
  
  return html;
}

/**
 * Extract navigation links from WordPress HTML
 */
function extractNavigationLinks(html: string): Array<{text: string; href: string}> {
  const links: Array<{text: string; href: string}> = [];
  const seen = new Set<string>();
  
  // Try to find navigation links in WordPress navigation blocks
  const navLinkRegex = /<a[^>]*class="[^"]*wp-block-navigation-item__content[^"]*"[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/gi;
  let match;
  
  while ((match = navLinkRegex.exec(html)) !== null) {
    const href = match[1];
    const text = match[2].trim();
    if (text && href && !seen.has(href)) {
      seen.add(href);
      links.push({ text, href });
    }
  }
  
  // If no WP nav links found, try regular nav links
  if (links.length === 0) {
    const regularNavRegex = /<nav[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>[\s\S]*?<\/nav>/gi;
    while ((match = regularNavRegex.exec(html)) !== null) {
      const href = match[1];
      const text = match[2].trim();
      if (text && href && !seen.has(href) && !href.startsWith('#') && !href.startsWith('javascript')) {
        seen.add(href);
        links.push({ text, href });
      }
    }
  }
  
  // Also check for menu items
  if (links.length === 0) {
    const menuRegex = /<li[^>]*class="[^"]*menu-item[^"]*"[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/gi;
    while ((match = menuRegex.exec(html)) !== null) {
      const href = match[1];
      const text = match[2].trim();
      if (text && href && !seen.has(href)) {
        seen.add(href);
        links.push({ text, href });
      }
    }
  }
  
  return links.slice(0, 6); // Limit to 6 nav items
}

/**
 * Remove tracking, analytics, and other scripts that won't work in Avallon
 */
function removeTrackingScripts(html: string): string {
  // List of tracking/analytics domains to remove
  const trackingDomains = [
    'google-analytics.com',
    'googletagmanager.com',
    'gtag',
    'facebook.net',
    'fbevents',
    'connect.facebook',
    'linkedin.com/li.lms-analytics',
    'snap.licdn.com',
    'redditstatic.com',
    'reddit.com/pixel',
    'twitter.com/i/adsct',
    'ads-twitter.com',
    'analytics',
    'pixel.js',
    'rum.hlx.page',
    'go-mpulse.net',
    'hotjar.com',
    'clarity.ms',
    'segment.com',
    'mixpanel.com',
    'amplitude.com',
    'heap.io',
    'fullstory.com',
    'intercom.io',
    'crisp.chat',
    'drift.com',
    'tawk.to',
    'zendesk.com',
    'hubspot.com',
    'marketo.com',
    'pardot.com',
    'eloqua.com',
    'en25.com',
    'omtrdc.net',
    'demdex.net',
    'doubleclick.net',
    'adsrvr.org',
    'taboola.com',
    'outbrain.com',
    'quantserve.com',
    'scorecardresearch.com',
    'chartbeat.com',
    'newrelic.com',
    'nr-data.net',
    'sentry.io',
    'bugsnag.com',
    'rollbar.com',
    'logrocket.com',
    'mouseflow.com',
    'crazyegg.com',
    'optimizely.com',
    'abtasty.com',
    'vwo.com',
  ];
  
  // Remove script tags that reference tracking domains
  for (const domain of trackingDomains) {
    const escapedDomain = domain.replace(/\./g, '\\.');
    const scriptRegex = new RegExp(`<script[^>]*(?:src=["'][^"']*${escapedDomain}[^"']*["']|[^>]*${escapedDomain}[^>]*)>[\\s\\S]*?<\\/script>`, 'gi');
    html = html.replace(scriptRegex, '<!-- Removed tracking script -->');
  }
  
  // Remove inline tracking scripts (common patterns)
  html = html.replace(/<script[^>]*>[\s\S]*?(?:gtag|fbq|_linkedin|reddit|twq|dataLayer\.push)[\s\S]*?<\/script>/gi, '<!-- Removed inline tracking script -->');
  
  // Remove noscript tracking pixels
  html = html.replace(/<noscript>[\s\S]*?(?:facebook|linkedin|google|twitter)[\s\S]*?<\/noscript>/gi, '');
  
  // Remove link tags for tracking
  for (const domain of trackingDomains) {
    const escapedDomain = domain.replace(/\./g, '\\.');
    const linkRegex = new RegExp(`<link[^>]*href=["'][^"']*${escapedDomain}[^"']*["'][^>]*>`, 'gi');
    html = html.replace(linkRegex, '');
  }
  
  return html;
}

/**
 * Ensure external CSS is properly preserved
 */
function ensureExternalCSSPreserved(html: string, frameworks: string[]): string {
  const existingLinks = html.match(/<link[^>]+href=["'][^"']+["'][^>]*>/gi) || [];
  
  // Add Bootstrap if detected but missing
  if (frameworks.includes('bootstrap') && !existingLinks.some(l => /bootstrap/i.test(l))) {
    const bootstrapLink = '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">';
    html = html.replace('</head>', bootstrapLink + '\n</head>');
  }
  
  // Add Font Awesome if detected but missing
  if (frameworks.includes('fontawesome') && !existingLinks.some(l => /font-?awesome/i.test(l))) {
    const faLink = '<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">';
    html = html.replace('</head>', faLink + '\n</head>');
  }
  
  return html;
}

/**
 * Ensure fonts are preserved
 */
function ensureFontsPreserved(html: string): string {
  // Check for font-family declarations without corresponding imports
  const fontFamilies = html.match(/font-family:\s*["']?([^"';,}]+)/gi) || [];
  const uniqueFonts = [...new Set(fontFamilies.map(f => f.replace(/font-family:\s*["']?/i, '').trim()))];
  
  const googleFonts = ['Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald', 'Source Sans Pro', 'Raleway', 'PT Sans', 'Merriweather', 'Ubuntu', 'Playfair Display', 'Nunito', 'Poppins', 'Inter', 'Work Sans', 'Quicksand', 'DM Sans', 'Space Grotesk', 'Rubik', 'Karla', 'Manrope', 'Plus Jakarta Sans'];
  
  const fontsToAdd: string[] = [];
  
  uniqueFonts.forEach(font => {
    const fontName = font.split(',')[0].replace(/["']/g, '').trim();
    if (googleFonts.some(gf => gf.toLowerCase() === fontName.toLowerCase())) {
      if (!html.includes(`family=${fontName}`) && !html.includes(`family=${fontName.replace(/ /g, '+')}`)) {
        fontsToAdd.push(fontName.replace(/ /g, '+'));
      }
    }
  });
  
  if (fontsToAdd.length > 0) {
    const fontLink = `<link href="https://fonts.googleapis.com/css2?family=${fontsToAdd.join('&family=')}&display=swap" rel="stylesheet">`;
    if (html.includes('</head>')) {
      html = html.replace('</head>', fontLink + '\n</head>');
    }
  }
  
  return html;
}

/**
 * Fix CDN integrity attributes
 */
function fixCDNIntegrity(html: string): string {
  CDN_PATTERNS.forEach(cdn => {
    const regex = new RegExp(`(<(?:link|script)[^>]*(?:href|src)=["'][^"']*${cdn.replace(/\./g, '\\.')}[^"']*["'][^>]*)integrity=["'][^"']*["']([^>]*)>`, 'gi');
    html = html.replace(regex, '$1$2>');
    
    html = html.replace(new RegExp(`(<(?:link|script)[^>]*(?:href|src)=["'][^"']*${cdn.replace(/\./g, '\\.')}[^"']*["'][^>]*)crossorigin=["'][^"']*["']([^>]*)>`, 'gi'), '$1$2>');
  });
  
  return html;
}

/**
 * Ensure proper HTML document structure
 */
function ensureProperStructure(html: string): string {
  const hasDoctype = /<!DOCTYPE\s+html/i.test(html);
  const hasHtmlTag = /<html[\s>]/i.test(html);
  const hasHead = /<head[\s>]/i.test(html);
  const hasBody = /<body[\s>]/i.test(html);
  
  if (!hasDoctype && !hasHtmlTag) {
    // It's a fragment, wrap it properly
    const styles: string[] = [];
    const scripts: string[] = [];
    
    // Extract inline styles
    html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, match => {
      styles.push(match);
      return '';
    });
    
    // Extract link tags
    html = html.replace(/<link[^>]*>/gi, match => {
      styles.push(match);
      return '';
    });
    
    // Keep scripts at the end
    html = html.replace(/<script[^>]+src=["'][^"']+["'][^>]*>[\s\S]*?<\/script>/gi, match => {
      scripts.push(match);
      return '';
    });
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Imported Page</title>
  ${styles.join('\n  ')}
</head>
<body>
${html.trim()}
${scripts.join('\n')}
</body>
</html>`;
  }
  
  if (!hasDoctype) {
    html = '<!DOCTYPE html>\n' + html;
  }
  
  if (hasHtmlTag && !hasHead) {
    html = html.replace(/<html([^>]*)>/i, `<html$1>\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Imported Page</title>\n</head>`);
  }
  
  return html;
}

/**
 * Ensure proper meta tags
 */
function ensureMetaTags(html: string): string {
  if (!/<meta[^>]+name=["']viewport["']/i.test(html) && html.includes('<head>')) {
    html = html.replace(/<head>/i, '<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">');
  }
  
  if (!/<meta[^>]+charset=/i.test(html) && html.includes('<head>')) {
    html = html.replace(/<head>/i, '<head>\n  <meta charset="UTF-8">');
  }
  
  return html;
}

/**
 * Quick import - simplified version (no fetching, just fixes)
 */
export function quickImport(rawHtml: string, sourceUrl?: string): string {
  let html = normalizeHTML(rawHtml);
  html = fixCommonIssues(html);
  
  if (sourceUrl) {
    html = convertToAbsoluteUrls(html, sourceUrl);
    html = addBaseTag(html, sourceUrl);
  }
  
  html = fixCDNIntegrity(html);
  
  const isFullDocument = /<!DOCTYPE|<html/i.test(html);
  if (!isFullDocument) {
    html = ensureProperStructure(html);
  }
  
  html = ensureMetaTags(html);
  html = ensureFontsPreserved(html);
  
  return html;
}

/**
 * FULL import from URL - fetches the page AND all its resources
 */
export async function importFromUrl(url: string): Promise<ImportResult> {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://beta-avallon.onrender.com' 
      : 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/proxy?url=${encodeURIComponent(url)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Use full import with CSS fetching
    return importHTML(html, {
      sourceUrl: url,
      convertRelativeUrls: true,
      preserveExternalCSS: true,
      preserveFonts: true,
      preserveImages: true,
      inlineExternalCSS: true,
      fetchTimeout: 15000,
    });
  } catch (error) {
    return {
      html: '',
      css: [],
      js: [],
      fonts: [],
      images: [],
      frameworks: [],
      errors: [`Failed to import from URL: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings: [],
    };
  }
}

/**
 * Detect if pasted content is HTML
 */
export function isHTML(content: string): boolean {
  const htmlPatterns = [
    /<!DOCTYPE\s+html/i,
    /<html[\s>]/i,
    /<head[\s>]/i,
    /<body[\s>]/i,
    /<div[\s>]/i,
    /<p[\s>]/i,
    /<section[\s>]/i,
    /<header[\s>]/i,
    /<footer[\s>]/i,
    /<nav[\s>]/i,
    /<style[\s>]/i,
    /<script[\s>]/i,
    /<link[^>]+stylesheet/i,
  ];
  
  return htmlPatterns.some(pattern => pattern.test(content));
}

/**
 * Detect internal pages from HTML - finds all links to pages on the same domain
 */
export function detectInternalPages(html: string, sourceUrl: string): DetectedPage[] {
  const pages: DetectedPage[] = [];
  const seenUrls = new Set<string>();
  
  try {
    const baseUrl = new URL(sourceUrl);
    const baseOrigin = baseUrl.origin;
    
    // Find all anchor tags with href
    const linkRegex = /<a[^>]+href=["']([^"'#]+)["'][^>]*>([^<]*)</gi;
    let match;
    
    while ((match = linkRegex.exec(html)) !== null) {
      let href = match[1].trim();
      const linkText = match[2].trim();
      
      // Skip empty, javascript:, mailto:, tel:, and data: links
      if (!href || href.startsWith('javascript:') || href.startsWith('mailto:') || 
          href.startsWith('tel:') || href.startsWith('data:') || href.startsWith('#')) {
        continue;
      }
      
      // Make URL absolute
      let absoluteUrl: string;
      let isExternal = false;
      
      try {
        if (href.startsWith('http://') || href.startsWith('https://')) {
          absoluteUrl = href;
          isExternal = !href.startsWith(baseOrigin);
        } else if (href.startsWith('//')) {
          absoluteUrl = 'https:' + href;
          isExternal = !absoluteUrl.startsWith(baseOrigin);
        } else {
          absoluteUrl = new URL(href, sourceUrl).href;
          isExternal = false;
        }
      } catch {
        continue;
      }
      
      // Skip external links and already seen URLs
      if (isExternal || seenUrls.has(absoluteUrl)) {
        continue;
      }
      
      seenUrls.add(absoluteUrl);
      
      // Skip non-HTML resources
      const urlPath = new URL(absoluteUrl).pathname.toLowerCase();
      if (urlPath.match(/\.(jpg|jpeg|png|gif|svg|webp|ico|pdf|doc|docx|xls|xlsx|zip|tar|gz|mp3|mp4|avi|mov|css|js|json|xml)$/)) {
        continue;
      }
      
      // Generate suggested filename
      let suggestedFilename = urlPath === '/' ? 'index.html' : urlPath;
      if (!suggestedFilename.endsWith('.html') && !suggestedFilename.endsWith('.htm')) {
        // Clean up path for filename
        suggestedFilename = suggestedFilename.replace(/^\/+|\/+$/g, '').replace(/\//g, '-');
        if (!suggestedFilename) suggestedFilename = 'index';
        suggestedFilename += '.html';
      } else {
        suggestedFilename = suggestedFilename.replace(/^\/+/, '').replace(/\//g, '-');
      }
      
      // Generate title from link text or URL
      const title = linkText || suggestedFilename.replace('.html', '').replace(/-/g, ' ');
      
      pages.push({
        url: absoluteUrl,
        title: title.charAt(0).toUpperCase() + title.slice(1),
        path: urlPath,
        suggestedFilename,
        isExternal,
      });
    }
    
  } catch (error) {
    console.warn('Error detecting internal pages:', error);
  }
  
  // Sort: index first, then alphabetically
  return pages.sort((a, b) => {
    if (a.path === '/') return -1;
    if (b.path === '/') return 1;
    if (a.suggestedFilename === 'index.html') return -1;
    if (b.suggestedFilename === 'index.html') return 1;
    return a.suggestedFilename.localeCompare(b.suggestedFilename);
  });
}

/**
 * Import multiple pages from a website
 */
export async function importMultiplePages(
  pageUrls: string[],
  options: ImportOptions = {}
): Promise<MultiPageImportResult> {
  const result: MultiPageImportResult = {
    pages: [],
    sharedCSS: [],
    sharedFonts: [],
    frameworks: [],
    errors: [],
    warnings: [],
  };
  
  const allCSS = new Set<string>();
  const allFonts = new Set<string>();
  const allFrameworks = new Set<string>();
  
  // Import each page
  for (const url of pageUrls) {
    try {
      const pageResult = await importFromUrl(url);
      
      if (pageResult.errors.length > 0 && pageResult.html.length < 100) {
        result.errors.push(`Failed to import ${url}: ${pageResult.errors.join(', ')}`);
        continue;
      }
      
      // Extract filename from URL
      const urlObj = new URL(url);
      let filename = urlObj.pathname === '/' ? 'index.html' : urlObj.pathname;
      if (!filename.endsWith('.html') && !filename.endsWith('.htm')) {
        filename = filename.replace(/^\/+|\/+$/g, '').replace(/\//g, '-') || 'index';
        filename += '.html';
      } else {
        filename = filename.replace(/^\/+/, '').replace(/\//g, '-');
      }
      
      // Extract title from HTML
      const titleMatch = pageResult.html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : filename.replace('.html', '').replace(/-/g, ' ');
      
      result.pages.push({
        filename,
        html: pageResult.html,
        title,
        url,
      });
      
      // Collect shared resources
      pageResult.css.forEach(css => allCSS.add(css));
      pageResult.fonts.forEach(font => allFonts.add(font));
      pageResult.frameworks.forEach(fw => allFrameworks.add(fw));
      
      // Collect warnings
      if (pageResult.warnings.length > 0) {
        result.warnings.push(`${filename}: ${pageResult.warnings.join(', ')}`);
      }
      
    } catch (error) {
      result.errors.push(`Error importing ${url}: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  }
  
  result.sharedCSS = Array.from(allCSS);
  result.sharedFonts = Array.from(allFonts);
  result.frameworks = Array.from(allFrameworks);
  
  return result;
}

export default {
  importHTML,
  quickImport,
  importFromUrl,
  isHTML,
  detectInternalPages,
  importMultiplePages,
};
