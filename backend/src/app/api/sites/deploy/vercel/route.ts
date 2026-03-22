// API endpoint for deploying websites to GitHub and Vercel
// CHANGELOG: 2026-01-07 - Added proper CORS handling
// CHANGELOG: 2026-01-22 - Added image downloading and navigation link fixing
// CHANGELOG: 2026-03-12 - Added bulletproof mobile menu injection (v2)
// CHANGELOG: 2026-03-12 - Accept websiteContent directly from frontend to avoid stale data
import { NextRequest, NextResponse } from "next/server";
import { logError, logInfo } from "@/lib/log";
import { z } from "zod";
import { getUser } from "@/lib/auth/getUser";
import { getSiteById, updateSite } from "@/data/sites";
import { GitHubClient } from "@/lib/clients/github";
import { VercelProvider } from "@/lib/providers/impl/vercel";
import { getCorsHeaders } from "@/lib/cors";
import { injectCarouselIntoHtmlForDeploy } from "@/lib/html-utils";

/** Bumped when deploy-injected layout CSS changes */
const DEPLOY_VERSION = "2026-03-21-layout-v11-wp-publish";

// Route segment config to allow larger request bodies (for base64 images)
export const maxDuration = 120; // 2 minutes timeout
export const runtime = 'nodejs';

const DeployToVercelSchema = z.object({
  siteId: z.string().min(1, "Site ID is required"),
  // Optional: Frontend can send content directly to avoid stale data issues
  websiteContent: z.record(z.any()).optional(),
});

/**
 * CRITICAL: Remove editor-injected scripts that break navigation on published sites
 * The visual editor injects a script with e.preventDefault() for in-editor navigation
 * This MUST be removed before publishing or links won't work
 */
function cleanEditorScripts(html: string): string {
  if (!html || typeof html !== 'string') return html;
  
  // Remove the navigation script that prevents links from working
  // Pattern 1: The exact navigation script structure
  html = html.replace(/<script>\s*\(function\(\)\s*\{\s*document\.querySelectorAll\(['"]a\[href\]['"]\)[\s\S]*?<\/script>/gi, '');
  
  // Pattern 2: Any script with querySelectorAll + preventDefault combo
  html = html.replace(/<script>[\s\S]*?querySelectorAll\(['"]a\[href\]['"]\)[\s\S]*?preventDefault[\s\S]*?<\/script>/gi, '');
  
  // Pattern 3: Any script with postMessage navigate type
  html = html.replace(/<script>[\s\S]*?window\.parent\.postMessage\(\s*\{\s*type:\s*['"]navigate['"][\s\S]*?<\/script>/gi, '');
  
  // Pattern 4: Visual editor scripts
  html = html.replace(/<script>\s*\(function\(\)\s*\{\s*let selectedElement[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<script>[\s\S]*?avallon-selection-overlay[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<script>[\s\S]*?avallon-hover-overlay[\s\S]*?<\/script>/gi, '');
  
  // Remove avallon overlay divs
  html = html.replace(/<div[^>]*id="avallon-[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
  
  // Remove contenteditable attributes
  html = html.replace(/\s+contenteditable="[^"]*"/gi, '');
  
  // Clean empty script tags
  html = html.replace(/<script>\s*<\/script>/gi, '');
  
  // NOTE: We no longer strip inline width/min-width from divs/sections here — that broke migrated
  // layouts (mentor grids, absolute cards, WP block geometry) on Vercel. Overflow is handled in CSS only.
  
  return html;
}

/**
 * Editor preview rewrites external images to Avallon's /api/proxy/image?url=...
 * Those URLs (a) are not downloaded by the image scraper (no .jpg in path) and
 * (b) point at the API host — wrong origin on Vercel, often 401/CORS.
 * Decode the real https URL so downloadAndEmbedImages + browsers fetch real assets.
 */
function unwrapAvallonProxyImageUrls(html: string): string {
  if (!html || typeof html !== 'string') return html;
  return html.replace(
    /https?:\/\/[^"'\\s>)]*\/api\/proxy\/image\?url=([^&"'\\s]+)/gi,
    (_full, encoded: string) => {
      try {
        const decoded = decodeURIComponent(encoded);
        if (/^https?:\/\//i.test(decoded)) return decoded;
      } catch {
        /* ignore */
      }
      return _full;
    }
  );
}

/**
 * Inject responsive styles to ensure proper mobile display
 * - Ensures viewport meta tag exists
 * - Adds global CSS to prevent overflow and ensure images/media scale properly
 *
 * v5: Viewport + optional box-sizing only. Previous global rules (img max-width, section max-width,
 * overflow-x on body, heading clamps) still broke migrated mentor/hero sections on Vercel.
 *
 * v8: Targeted fluid rules — clip horizontal overflow (white strip on edited pages), scale media,
 * WP root width, flex/grid min-width. Does NOT strip inline widths on sections (mentor layouts).
 *
 * v9: Full-bleed for WP .has-background / .alignfull (navy sections stopping short = constrained
 * width + body white showing). Viewport breakout + clamp padding so all laptop sizes look consistent.
 *
 * v11: WordPress publish fix — htmlImporter injects data-avallon-responsive in the editor; deploy used to
 * SKIP injection when that attribute existed, so published sites never got WP full-bleed rules (white
 * gutter). Strip any prior Avallon responsive &lt;style&gt; on every publish, then inject deploy CSS.
 * Break out .has-background / cover from .is-layout-constrained; reset columns/nested groups.
 */
function stripAvallonResponsiveInjections(html: string): string {
  let out = html.replace(/<style[^>]*data-avallon-responsive[^>]*>[\s\S]*?<\/style>\s*/gi, "");
  out = out.replace(/\n?<!--\s*avallon-deploy[^\n]*-->\s*/gi, "\n");
  out = out.replace(/<!--\s*AVALLON RESPONSIVE FIXES\s*-->\s*/gi, "");
  out = out.replace(/<!--\s*END AVALLON RESPONSIVE FIXES\s*-->\s*/gi, "");
  return out;
}

function injectResponsiveStyles(files: Record<string, string>): Record<string, string> {
  const fixedFiles: Record<string, string> = {};
  
  const responsiveCSS = `
<style data-avallon-responsive="true" data-avallon-deploy-fluid="true">
/* --- Avallon v11: WordPress static publish — full-width shell + breakouts (no skip on editor HTML) --- */
*, *::before, *::after {
  box-sizing: border-box;
}
html {
  overflow-x: clip;
  max-width: 100%;
  width: 100%;
}
body {
  margin: 0;
  overflow-x: clip;
  max-width: 100%;
  width: 100%;
  min-width: 0;
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}
/* theme.json “wide” cap + centered shell — main cause of white gutters on exported WP pages */
:root {
  --wp--style--global--wide-size: 100%;
}
/* Outer WordPress wrapper: use full viewport width (static export often keeps theme max-width inline) */
.wp-site-blocks {
  width: 100% !important;
  max-width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  min-width: 0;
  box-sizing: border-box;
}
#page, #content, #primary, .site, .site-content, .entry-content {
  max-width: 100% !important;
  box-sizing: border-box;
}
header,
.wp-block-template-part {
  max-width: 100% !important;
  width: 100%;
  box-sizing: border-box;
}
/* Direct-child breakouts (v9) */
.wp-block-group.alignfull.has-background,
.wp-block-group.has-background.alignfull,
.wp-block-cover.alignfull,
.wp-site-blocks > .wp-block-group.has-background,
.entry-content > .wp-block-group.has-background,
.wp-site-blocks > .wp-block-cover,
.entry-content > .wp-block-cover,
/* Hero/nav sections often sit INSIDE .is-layout-constrained — v9 missed these */
.is-layout-constrained > .wp-block-group.has-background,
.is-layout-constrained > .wp-block-cover {
  width: 100vw;
  max-width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  padding-left: clamp(1rem, 4vw, 3rem);
  padding-right: clamp(1rem, 4vw, 3rem);
  box-sizing: border-box;
}
/* Other background groups: fill parent row without viewport math */
.wp-block-group.has-background,
.wp-block-cover {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}
/* Do not break out cards / columns */
.wp-block-column .wp-block-group.has-background,
.wp-block-column .wp-block-cover,
.wp-block-columns .wp-block-group.has-background,
.wp-block-group.has-background .wp-block-group.has-background,
.wp-block-cover .wp-block-group.has-background {
  width: 100% !important;
  max-width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}
/* Media & embeds */
img, video, iframe, svg {
  max-width: 100%;
  height: auto;
}
figure img, picture img {
  max-width: 100%;
  height: auto;
}
.is-layout-flex,
.is-layout-grid,
.wp-block-columns {
  min-width: 0;
}
</style>
<!-- avallon-deploy ${DEPLOY_VERSION} -->
`;

  for (const [filename, content] of Object.entries(files)) {
    if (!filename.endsWith('.html') || typeof content !== 'string') {
      fixedFiles[filename] = content;
      continue;
    }
    
    /* Replace editor + any previous deploy injections so WP rules always apply on publish */
    let fixedContent = stripAvallonResponsiveInjections(content);
    
    // 1. Ensure viewport meta tag exists
    const hasViewport = /<meta[^>]*name=["']viewport["'][^>]*>/i.test(fixedContent);
    if (!hasViewport) {
      const viewportMeta = '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">';
      
      // Try to inject after <head>
      if (fixedContent.includes('<head>')) {
        fixedContent = fixedContent.replace('<head>', '<head>\n' + viewportMeta);
      } else if (fixedContent.includes('<head ')) {
        fixedContent = fixedContent.replace(/<head[^>]*>/, (match) => match + '\n' + viewportMeta);
      } else if (fixedContent.includes('<html')) {
        // If no head tag, add one after html
        fixedContent = fixedContent.replace(/<html[^>]*>/, (match) => match + '\n<head>\n' + viewportMeta + '\n</head>');
      } else {
        // Last resort: prepend to content
        fixedContent = '<!DOCTYPE html>\n<html>\n<head>\n' + viewportMeta + '\n</head>\n' + fixedContent;
      }
      logInfo('Injected viewport meta tag', { filename });
    }
    
    // 2. Inject responsive CSS after <head> or existing viewport meta
    const headMatch = fixedContent.match(/<head[^>]*>/i);
    if (headMatch) {
      fixedContent = fixedContent.replace(headMatch[0], headMatch[0] + '\n' + responsiveCSS);
    } else {
      // If somehow still no head, prepend CSS
      fixedContent = responsiveCSS + '\n' + fixedContent;
    }
    
    fixedFiles[filename] = fixedContent;
  }
  
  logInfo('Injected responsive styles', { fileCount: Object.keys(fixedFiles).filter(f => f.endsWith('.html')).length });
  return fixedFiles;
}

/**
 * Convert inline data:image/...;base64,... into real files under images/
 * so static deploys are well-formed (no giant HTML) and assets behave like normal files.
 */
function extractDataUrlImagesToFiles(files: Record<string, string>): {
  updatedFiles: Record<string, string>;
  dataImageFiles: Record<string, Buffer>;
} {
  const dataImageFiles: Record<string, Buffer> = {};
  let imageIndex = 0;
  const seen = new Map<string, string>();

  function mimeToExt(mime: string): string {
    const m = mime.toLowerCase();
    if (m.includes('jpeg') || m === 'jpg') return 'jpg';
    if (m.includes('png')) return 'png';
    if (m.includes('gif')) return 'gif';
    if (m.includes('webp')) return 'webp';
    if (m.includes('svg')) return 'svg';
    return 'png';
  }

  function replaceDataUrls(html: string): string {
    return html.replace(/\bdata:image\/[a-zA-Z0-9+.=-]+;base64,[A-Za-z0-9+/=\s]+/g, (dataUrl) => {
      const compact = dataUrl.replace(/\s+/g, '');
      if (seen.has(compact)) return seen.get(compact)!;
      const m = /^data:image\/([^;]+);base64,(.+)$/.exec(compact);
      if (!m) return dataUrl;
      try {
        const buf = Buffer.from(m[2], 'base64');
        if (buf.byteLength < 20) return dataUrl;
        const ext = mimeToExt(m[1]);
        const path = `images/image_${imageIndex++}.${ext}`;
        dataImageFiles[path] = buf;
        seen.set(compact, path);
        return path;
      } catch {
        return dataUrl;
      }
    });
  }

  const updatedFiles: Record<string, string> = {};
  for (const [filename, content] of Object.entries(files)) {
    if (!filename.endsWith('.html') || typeof content !== 'string') {
      updatedFiles[filename] = content;
      continue;
    }
    updatedFiles[filename] = replaceDataUrls(content);
  }
  return { updatedFiles, dataImageFiles };
}

/**
 * Download external images and embed them locally in the deployment
 * This prevents broken images when the original website is deleted
 *
 * WARNING: Large deployments (>10MB after base64) may fail due to Vercel API limits.
 * If deployment fails, images will remain as external links.
 */
async function downloadAndEmbedImages(files: Record<string, string>): Promise<{
  updatedFiles: Record<string, string>;
  imageFiles: Record<string, Buffer>;
}> {
  const { updatedFiles: afterDataUrls, dataImageFiles } = extractDataUrlImagesToFiles(files);
  const workingFiles = afterDataUrls;

  const imageFiles: Record<string, Buffer> = { ...dataImageFiles };
  const imageMapping: Record<string, string> = {};
  let imageIndex = Object.keys(dataImageFiles).length;
  let totalSize = Object.values(dataImageFiles).reduce((s, b) => s + b.byteLength, 0);

  // Extract all image URLs from HTML files
  const imageUrls = new Set<string>();
  
  // Patterns to find images
  const imageUrlPattern = /(?:src=["']|url\(["']?)(https?:\/\/[^"'\s)]+\.(?:jpg|jpeg|png|gif|webp|svg|ico)[^"'\s)]*)/gi;
  const bgImagePattern = /background(?:-image)?:\s*url\(["']?(https?:\/\/[^"'\s)]+)["']?\)/gi;
  const unsplashPattern = /(?:src=["']|url\(["']?)(https?:\/\/images\.unsplash\.com\/[^"'\s)]+)/gi;
  
  const proxyParamPattern = /https?:\/\/[^"'\\s>)]*\/api\/proxy\/image\?url=([^&"'\\s]+)/gi;

  for (const content of Object.values(workingFiles)) {
    if (typeof content !== 'string') continue;
    
    let match;
    
    // Avallon editor proxy: decode inner URL so we can download the real file
    const proxyPat = new RegExp(proxyParamPattern.source, 'gi');
    while ((match = proxyPat.exec(content)) !== null) {
      try {
        const inner = decodeURIComponent(match[1].replace(/["')]+$/, ''));
        if (/^https?:\/\//i.test(inner)) imageUrls.add(inner.split('#')[0]);
      } catch {
        /* ignore */
      }
    }
    
    // Find images with extensions
    const pattern1 = new RegExp(imageUrlPattern.source, 'gi');
    while ((match = pattern1.exec(content)) !== null) {
      const url = match[1].split('?')[0] + (match[1].includes('?') ? '?' + match[1].split('?')[1].split('"')[0].split("'")[0] : '');
      imageUrls.add(url.replace(/["')]+$/, ''));
    }
    
    // Find background images
    const pattern2 = new RegExp(bgImagePattern.source, 'gi');
    while ((match = pattern2.exec(content)) !== null) {
      imageUrls.add(match[1].replace(/["')]+$/, ''));
    }
    
    // Find Unsplash images
    const pattern3 = new RegExp(unsplashPattern.source, 'gi');
    while ((match = pattern3.exec(content)) !== null) {
      imageUrls.add(match[1].replace(/["')]+$/, ''));
    }
  }
  
  logInfo('Found external images to download', {
    count: imageUrls.size,
    embeddedDataUrlFiles: Object.keys(dataImageFiles).length,
  });

  if (imageUrls.size === 0) {
    return { updatedFiles: workingFiles, imageFiles };
  }
  
  // Download ALL images - no size limits
  const downloadImage = async (url: string): Promise<void> => {
    try {
      if (url.startsWith('data:') || !url.startsWith('http')) return;
      if (url.length > 2000) return;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        },
        signal: AbortSignal.timeout(30000), // 30 second timeout for large images
      });
      
      if (!response.ok) return;
      
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/html') || contentType.includes('application/json')) return;
      
      const buffer = Buffer.from(await response.arrayBuffer());
      
      // Skip images that are too small (likely broken)
      if (buffer.byteLength < 100) return;
      
      // Determine extension
      let extension = 'jpg';
      const urlExt = url.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)/i);
      if (urlExt) {
        extension = urlExt[1].toLowerCase();
      } else if (contentType.includes('png')) {
        extension = 'png';
      } else if (contentType.includes('gif')) {
        extension = 'gif';
      } else if (contentType.includes('webp')) {
        extension = 'webp';
      } else if (contentType.includes('svg')) {
        extension = 'svg';
      }
      
      const filename = `images/image_${imageIndex++}.${extension}`;
      imageMapping[url] = filename;
      imageFiles[filename] = buffer;
      totalSize += buffer.byteLength;
      
      logInfo('Image downloaded', { url: url.substring(0, 60), filename, size: buffer.byteLength, totalSize });
    } catch (error: any) {
      logInfo('Image download skipped', { url: url.substring(0, 60), error: error.message });
    }
  };
  
  // Download in batches of 3 (smaller batches for large images)
  const urls = Array.from(imageUrls);
  for (let i = 0; i < urls.length; i += 3) {
    const batch = urls.slice(i, i + 3);
    await Promise.all(batch.map(downloadImage));
  }
  
  logInfo('Image download complete', { 
    total: imageUrls.size, 
    downloaded: Object.keys(imageFiles).length,
    totalSizeMB: (totalSize / 1024 / 1024).toFixed(2)
  });
  
  // Update HTML to use local paths
  const updatedFiles: Record<string, string> = {};
  for (const [filename, content] of Object.entries(workingFiles)) {
    if (!filename.endsWith('.html') || typeof content !== 'string') {
      updatedFiles[filename] = content;
      continue;
    }
    
    let newContent = content;
    for (const [originalUrl, localPath] of Object.entries(imageMapping)) {
      const escapedUrl = originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      newContent = newContent.replace(new RegExp(escapedUrl, 'g'), localPath);
    }
    updatedFiles[filename] = newContent;
  }
  
  return { updatedFiles, imageFiles };
}

/**
 * Extract text content from HTML, stripping all tags
 */
function extractTextFromHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')  // Replace tags with space
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')      // Collapse whitespace
    .trim();
}

/**
 * Check if a link is a valid navigation link
 */
function isValidNavLink(href: string, text: string): boolean {
  if (!href || !text) return false;
  if (text.length > 50 || text.length < 1) return false;
  if (href.startsWith('javascript:')) return false;
  if (href.startsWith('mailto:')) return false;
  if (href.startsWith('tel:')) return false;
  if (href.startsWith('data:')) return false;
  if (href === '#') return false;
  // Allow relative URLs, absolute URLs, and hash links with content
  return true;
}

/**
 * Extract navigation links from HTML to build mobile menu
 * Handles nested elements like <a href="/about"><span>About</span></a>
 */
function extractNavigationLinks(html: string): Array<{text: string; href: string}> {
  const links: Array<{text: string; href: string}> = [];
  const seen = new Set<string>();
  
  // Regex that captures the full content between <a> tags (including nested elements)
  const linkRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  
  // Helper to extract links from a section
  const extractFromSection = (section: string) => {
    let match;
    const regex = new RegExp(linkRegex.source, 'gi');
    while ((match = regex.exec(section)) !== null) {
      const href = match[1];
      const rawContent = match[2];
      const text = extractTextFromHtml(rawContent);
      
      if (isValidNavLink(href, text) && !seen.has(href)) {
        seen.add(href);
        links.push({ text, href });
      }
    }
  };
  
  // Strategy 1: Try <nav> elements
  const navSections = html.match(/<nav[^>]*>[\s\S]*?<\/nav>/gi) || [];
  for (const section of navSections) {
    extractFromSection(section);
  }
  
  // Strategy 2: Try <header> elements
  if (links.length === 0) {
    const headerSections = html.match(/<header[^>]*>[\s\S]*?<\/header>/gi) || [];
    for (const section of headerSections) {
      extractFromSection(section);
    }
  }
  
  // Strategy 3: Try elements with nav-related classes
  if (links.length === 0) {
    const navClassSections = html.match(/<[^>]*class="[^"]*(?:nav|menu|navigation)[^"]*"[^>]*>[\s\S]*?<\/(?:div|ul|section)>/gi) || [];
    for (const section of navClassSections) {
      extractFromSection(section);
    }
  }
  
  // Strategy 4: Try top-level links (first 500 chars often contain nav)
  if (links.length === 0) {
    const topSection = html.substring(0, Math.min(html.length, 5000));
    extractFromSection(topSection);
  }
  
  // Strategy 5: Last resort - find ANY internal links in the whole document
  if (links.length === 0) {
    let match;
    const regex = new RegExp(linkRegex.source, 'gi');
    while ((match = regex.exec(html)) !== null && links.length < 10) {
      const href = match[1];
      const text = extractTextFromHtml(match[2]);
      
      // Only include links that look like navigation (short text, internal links)
      const isInternal = href.startsWith('/') || href.startsWith('./') || href.startsWith('#') || 
                        href.includes('.html') || !href.includes('://');
      
      if (isValidNavLink(href, text) && !seen.has(href) && isInternal && text.length <= 25) {
        seen.add(href);
        links.push({ text, href });
      }
    }
  }
  
  // If still no links, create basic navigation
  if (links.length === 0) {
    // Check if common pages exist by looking for links to them
    const commonPages = ['/', '/about', '/services', '/contact', '/home'];
    for (const page of commonPages) {
      if (html.toLowerCase().includes(`href="${page}"`) || html.toLowerCase().includes(`href="${page}.html"`)) {
        const name = page === '/' ? 'Home' : page.replace('/', '').replace('.html', '');
        links.push({ text: name.charAt(0).toUpperCase() + name.slice(1), href: page });
      }
    }
  }
  
  // Final fallback - just provide Home link
  if (links.length === 0) {
    links.push({ text: 'Home', href: '/' });
  }
  
  logInfo('Extracted navigation links', { count: links.length, links: links.slice(0, 5) });
  return links.slice(0, 10);
}

/**
 * Inject CSS-only mobile menu for published sites
 * 
 * CSS-ONLY VERSION v4 (Seamless design like Ascendance Foundry):
 * 1. Uses checkbox :checked hack for toggle - HIDDEN by default
 * 2. Seamless hamburger that blends with site header
 * 3. Only shows overlay when hamburger is clicked
 * 4. Click anywhere on overlay or links to close
 */
function injectMobileMenuFix(files: Record<string, string>): Record<string, string> {
  const fixedFiles: Record<string, string> = {};
  
  for (const [filename, content] of Object.entries(files)) {
    if (!filename.endsWith('.html') || typeof content !== 'string') {
      fixedFiles[filename] = content;
      continue;
    }
    
    // Skip if already has our mobile menu
    if (content.includes('id="avm-toggle"') || content.includes('data-avallon-mobile-css="true"')) {
      fixedFiles[filename] = content;
      continue;
    }
    
    // Extract navigation links for mobile menu
    const navLinks = extractNavigationLinks(content);
    const navLinksHtml = navLinks.map(link => 
      `<a href="${link.href}" class="avm-link" onclick="document.getElementById('avm-toggle').checked=false">${link.text}</a>`
    ).join('\n      ');
    
    // CSS-only mobile menu v4 - Seamless design
    const mobileMenuCode = `
<!-- AVALLON MOBILE MENU v4 - ${DEPLOY_VERSION} -->
<style data-avallon-mobile-css="true">
/* ========== CHECKBOX - Hidden off-screen ========== */
#avm-toggle {
  position: absolute !important;
  left: -9999px !important;
  opacity: 0 !important;
  pointer-events: none !important;
}

/* ========== HAMBURGER - Seamless design like Ascendance Foundry ========== */
.avm-hamburger {
  display: none;
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 100000;
  width: 40px;
  height: 40px;
  background: transparent;
  border: 1px solid rgba(128, 128, 128, 0.3);
  border-radius: 8px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 5px;
  padding: 8px;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  user-select: none;
  transition: all 0.2s ease;
}
.avm-hamburger:hover {
  background: rgba(128, 128, 128, 0.1);
}
.avm-hamburger span {
  display: block;
  width: 20px;
  height: 2px;
  background: currentColor;
  border-radius: 1px;
  transition: all 0.3s ease;
  pointer-events: none;
}

/* ========== OVERLAY - HIDDEN BY DEFAULT ========== */
.avm-overlay {
  display: none !important;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%) !important;
  z-index: 99999 !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: flex-start !important;
  padding: 80px 20px 40px !important;
  overflow-y: auto !important;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

/* ========== MENU LINKS ========== */
.avm-link {
  display: block !important;
  padding: 16px 32px !important;
  margin: 8px 0 !important;
  font-size: 18px !important;
  font-weight: 600 !important;
  color: #fff !important;
  text-decoration: none !important;
  background: rgba(255,255,255,0.08) !important;
  border-radius: 12px !important;
  width: 100% !important;
  max-width: 320px !important;
  text-align: center !important;
  transition: all 0.2s ease !important;
  -webkit-tap-highlight-color: transparent;
}
.avm-link:hover, .avm-link:active {
  background: rgba(255,255,255,0.15) !important;
  transform: translateY(-2px) !important;
}

/* ========== DESKTOP: Hide mobile menu completely ========== */
@media (min-width: 768px) {
  #avm-toggle,
  .avm-hamburger,
  .avm-overlay {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
  }
}

/* ========== MOBILE: Show hamburger, toggle overlay ========== */
@media (max-width: 767px) {
  /* Show seamless hamburger */
  .avm-hamburger {
    display: flex !important;
  }
  
  /* Hide original hamburger buttons */
  .hamburger, .hamburger-menu, .hamburger-btn,
  .menu-toggle, .menu-btn, .mobile-menu-toggle,
  .mobile-nav-toggle, .mobile-toggle,
  .nav-toggle, .navbar-toggle, .navbar-toggler,
  .burger, .burger-menu,
  .wp-block-navigation__responsive-container-open,
  header button:not(.avm-hamburger):not([type="submit"]),
  nav button:not(.avm-hamburger),
  [class*="hamburger"]:not(.avm-hamburger),
  [class*="burger"]:not(.avm-hamburger),
  [class*="mobile-menu"]:not(.avm-overlay):not(.avm-link),
  [class*="menu-toggle"]:not(.avm-hamburger),
  button[aria-label*="menu" i]:not(.avm-hamburger) {
    display: none !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }
  
  /* ========== WHEN CHECKBOX IS CHECKED = SHOW MENU ========== */
  #avm-toggle:checked + .avm-hamburger + .avm-overlay {
    display: flex !important;
    opacity: 1 !important;
    visibility: visible !important;
  }
  
  /* Animate hamburger to X when open */
  #avm-toggle:checked + .avm-hamburger {
    background: rgba(255,255,255,0.1);
  }
  #avm-toggle:checked + .avm-hamburger span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }
  #avm-toggle:checked + .avm-hamburger span:nth-child(2) {
    opacity: 0;
    transform: scaleX(0);
  }
  #avm-toggle:checked + .avm-hamburger span:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
  }
}
</style>

<!-- Mobile Menu: Checkbox (hidden) + Hamburger + Overlay -->
<input type="checkbox" id="avm-toggle" />
<label for="avm-toggle" class="avm-hamburger" aria-label="Toggle Menu">
  <span></span>
  <span></span>
  <span></span>
</label>
<div class="avm-overlay" onclick="if(event.target===this)document.getElementById('avm-toggle').checked=false">
  ${navLinksHtml || '<a href="/" class="avm-link" onclick="document.getElementById(\'avm-toggle\').checked=false">Home</a>'}
</div>
<!-- END AVALLON MOBILE MENU v4 -->
`;

    // Inject right after <body> tag so checkbox siblings work
    let fixedContent = content;
    const bodyMatch = content.match(/<body[^>]*>/i);
    if (bodyMatch) {
      fixedContent = content.replace(bodyMatch[0], bodyMatch[0] + '\n' + mobileMenuCode);
    } else if (content.includes('<html')) {
      const htmlMatch = content.match(/<html[^>]*>/i);
      if (htmlMatch) {
        fixedContent = content.replace(htmlMatch[0], htmlMatch[0] + '\n' + mobileMenuCode);
      }
    } else {
      fixedContent = mobileMenuCode + '\n' + content;
    }
    
    fixedFiles[filename] = fixedContent;
  }
  
  logInfo('Injected mobile menu v4', { fileCount: Object.keys(fixedFiles).filter(f => f.endsWith('.html')).length });
  return fixedFiles;
}

/**
 * Fix navigation links in HTML files for multi-page sites
 * ONLY replaces absolute URLs to the original source domain
 * Leaves relative links alone (Vercel rewrites will handle them)
 */
function fixNavigationLinks(files: Record<string, string>): Record<string, string> {
  const fixedFiles: Record<string, string> = {};
  const pageNames = Object.keys(files)
    .filter(f => f.endsWith('.html'))
    .map(f => f.replace('.html', ''));
  
  logInfo('Navigation fix starting', { pageNames, fileCount: Object.keys(files).length });
  
  // Collect unique source domains (the original website's domain)
  const domainCounts: Record<string, number> = {};
  
  // Domains to exclude - these are third-party services, not the source website
  const excludedDomains = [
    'googleapis', 'cloudflare', 'jsdelivr', 'unpkg', 'fonts.', 'cdn.',
    'app.dover.com', 'dover.com', 'linkedin.com', 'twitter.com', 'facebook.com',
    'instagram.com', 'youtube.com', 'github.com', 'google.com', 'gstatic.com',
    'gravatar.com', 'wp.com', 'wordpress.com', 'calendly.com', 'typeform.com',
    'hubspot.com', 'mailchimp.com', 'stripe.com', 'paypal.com', 'shopify.com',
    'squarespace.com', 'wix.com', 'webflow.com', 'notion.so', 'airtable.com',
    'zapier.com', 'intercom.com', 'crisp.chat', 'drift.com', 'zendesk.com',
    'freshdesk.com', 'tawk.to', 'hotjar.com', 'segment.com', 'mixpanel.com',
    'amplitude.com', 'heap.io', 'fullstory.com', 'mouseflow.com', 'crazyegg.com',
    'optimizely.com', 'vwo.com', 'unbounce.com', 'leadpages.com', 'clickfunnels.com'
  ];
  
  for (const content of Object.values(files)) {
    if (typeof content !== 'string') continue;
    // Find domains in href attributes
    const hrefMatches = content.matchAll(/href=["'](https?:\/\/[^"'\/]+)/gi);
    for (const match of hrefMatches) {
      const domain = match[1].toLowerCase();
      // Exclude CDNs and third-party services
      const isExcluded = excludedDomains.some(excluded => domain.includes(excluded));
      if (!isExcluded) {
        domainCounts[domain] = (domainCounts[domain] || 0) + 1;
      }
    }
  }
  
  // Get the most common domain (likely the source website)
  const sourceDomains = Object.entries(domainCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([d]) => d);
  
  logInfo('Navigation fix: source domains', { sourceDomains, domainCounts });
  
  for (const [filename, content] of Object.entries(files)) {
    if (!filename.endsWith('.html') || typeof content !== 'string') {
      fixedFiles[filename] = content;
      continue;
    }
    
    let fixedContent = content;
    let fixCount = 0;
    
    // ONLY fix absolute URLs pointing to the source domain
    // Example: href="https://www.ascendancefoundry.com/team/" → href="/team"
    for (const domain of sourceDomains) {
      const escapedDomain = domain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Match: href="https://domain.com" or href="https://domain.com/" or href="https://domain.com/page"
      const pattern = new RegExp(
        `(href\\s*=\\s*)(["'])${escapedDomain}(/[^"']*)?\\2`,
        'gi'
      );
      
      fixedContent = fixedContent.replace(pattern, (match, prefix, quote, path) => {
        // Extract just the path, preserving any hash or query
        let fullPath = path || '/';
        
        // Clean the path for the page name
        let pagePath = fullPath.split(/[#?]/)[0]; // Remove hash/query
        pagePath = pagePath.replace(/^\/+/, '').replace(/\/+$/, ''); // Remove slashes
        
        // Map to local path
        let localPath: string;
        if (pagePath === '' || pagePath === 'home' || pagePath === 'home-page' || pagePath === 'home-page-1') {
          localPath = '/';
        } else {
          localPath = '/' + pagePath;
        }
        
        // Preserve hash/query if present
        const hashMatch = fullPath.match(/([#?].*)$/);
        if (hashMatch) {
          localPath += hashMatch[1];
        }
        
        fixCount++;
        logInfo('Replaced absolute URL', { 
          original: match.substring(0, 80), 
          path: fullPath,
          localPath 
        });
        
        return `${prefix}${quote}${localPath}${quote}`;
      });
    }
    
    logInfo('Fixed links in file', { filename, fixCount });
    fixedFiles[filename] = fixedContent;
  }
  
  logInfo('Navigation fix complete', { 
    pagesProcessed: Object.keys(fixedFiles).filter(f => f.endsWith('.html')).length,
    totalSourceDomainLinks: Object.values(domainCounts).reduce((a, b) => a + b, 0)
  });
  
  return fixedFiles;
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(req),
  });
}

export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    const body = await req.json();
    const { siteId, websiteContent: frontendContent } = DeployToVercelSchema.parse(body);

    logInfo('Starting deployment to GitHub and Vercel', { 
      siteId, 
      userId: user.id,
      contentProvidedByFrontend: !!frontendContent 
    });

    // Get the site with its files
    const site = await getSiteById(siteId, user.id);
    if (!site) {
      logError('Site not found during deployment', new Error(`Site ${siteId} not found for user ${user.id}`));
      return NextResponse.json({ 
        error: "Site not found", 
        details: "The site may not exist or you may not have access to it. If you just created this site, please try refreshing the page." 
      }, { status: 404, headers: corsHeaders });
    }
    
    logInfo('Site found for deployment', { siteId: site.id, siteName: site.name, ownerId: site.ownerId });

    // CRITICAL: Prefer content from frontend (most up-to-date) over database
    // This avoids stale data issues when save hasn't completed yet
    const sourceContent = frontendContent || site.websiteContent;
    const rawFiles = sourceContent?.files || sourceContent || {};
    
    if (!rawFiles || Object.keys(rawFiles).length === 0) {
      return NextResponse.json({ error: "No website files found" }, { status: 400, headers: corsHeaders });
    }
    
    logInfo('Using content for deployment', { 
      source: frontendContent ? 'frontend' : 'database',
      fileCount: Object.keys(rawFiles).filter(k => !k.startsWith('_')).length 
    });

    let repoUrl: string | undefined;
    let previewUrl: string;

    try {
      logInfo('Processing files for deployment', { fileCount: Object.keys(rawFiles).length });
      
      // Step 0: CRITICAL - Clean editor-injected scripts that break navigation
      // Step 0.05: Unwrap /api/proxy/image?url=... back to real asset URLs (editor preview only)
      const cleanedFiles: Record<string, string> = {};
      for (const [filename, content] of Object.entries(rawFiles)) {
        if (filename.endsWith('.html') && typeof content === 'string') {
          cleanedFiles[filename] = injectCarouselIntoHtmlForDeploy(
            unwrapAvallonProxyImageUrls(cleanEditorScripts(content))
          );
        } else if (typeof content === 'string') {
          cleanedFiles[filename] = content;
        }
      }
      logInfo('Cleaned editor scripts + unwrapped proxy image URLs for deploy');
      
      // Step 0.25: Inject responsive styles for proper mobile display
      const responsiveFiles = injectResponsiveStyles(cleanedFiles);
      logInfo('Injected responsive styles for mobile display');
      
      // Step 0.5: Inject custom scripts/widgets
      const customScripts = rawFiles._customScripts as Array<{ code: string; applyTo: string }> | undefined;
      if (customScripts && customScripts.length > 0) {
        logInfo('Injecting custom scripts', { count: customScripts.length });
        
        for (const [filename, content] of Object.entries(responsiveFiles)) {
          if (!filename.endsWith('.html') || typeof content !== 'string') continue;
          
          // Find scripts that apply to this page
          const scriptsForPage = customScripts.filter(script => 
            script.applyTo === 'all' || script.applyTo === filename
          );
          
          if (scriptsForPage.length === 0) continue;
          
          // Combine all script codes
          const scriptBlock = scriptsForPage.map(s => s.code).join('\n');
          
          // Inject before </body> or </html>
          if (content.includes('</body>')) {
            responsiveFiles[filename] = content.replace('</body>', `\n<!-- Custom Widgets -->\n${scriptBlock}\n</body>`);
          } else if (content.includes('</html>')) {
            responsiveFiles[filename] = content.replace('</html>', `\n<!-- Custom Widgets -->\n${scriptBlock}\n</html>`);
          } else {
            responsiveFiles[filename] = content + `\n<!-- Custom Widgets -->\n${scriptBlock}`;
          }
          
          logInfo('Injected scripts into page', { filename, scriptCount: scriptsForPage.length });
        }
      }
      
      // Remove _customScripts from files (it's metadata, not a file)
      delete responsiveFiles._customScripts;
      
      // Step 0.75: Inject mobile menu fix for reliable mobile navigation
      const filesWithMobileMenu = injectMobileMenuFix(responsiveFiles);
      
      // Step 1: Fix navigation links for multi-page sites
      const filesWithFixedNav = fixNavigationLinks(filesWithMobileMenu);
      
      // Step 2: Download external images and embed locally
      const { updatedFiles, imageFiles } = await downloadAndEmbedImages(filesWithFixedNav);
      
      logInfo('Files processed', { 
        htmlFiles: Object.keys(updatedFiles).filter(f => f.endsWith('.html')).length,
        imageFiles: Object.keys(imageFiles).length 
      });
      
      // Step 3: Build final file set with images
      const vercelFiles: Record<string, string | Buffer> = {
        ...updatedFiles,
        'package.json': JSON.stringify({
          name: site.slug,
          version: '1.0.0',
          scripts: {
            dev: 'npx serve .',
            start: 'npx serve .'
          },
          dependencies: {}
        }, null, 2)
      };
      
      // Add image files (as Buffer)
      for (const [imagePath, imageBuffer] of Object.entries(imageFiles)) {
        vercelFiles[imagePath] = imageBuffer;
      }

      // Step 4: Try GitHub (optional - don't fail if it doesn't work)
      try {
        logInfo('Attempting to deploy to GitHub', { siteId, siteName: site.name });
        const github = new GitHubClient();
        
        // Create repository
        repoUrl = await github.createRepository(site.name, `Generated website for ${site.name}`);
        
        // Extract repo name from URL
        const repoName = repoUrl.replace('https://github.com/', '');
        
        // Add vercel.json for instant static deployment
        const vercelConfig = {
          version: 2,
          public: true,
          cleanUrls: true,
          builds: [{ src: "**/*", use: "@vercel/static" }],
          routes: [{ handle: "filesystem" }]
        };
        
        // Files for GitHub (text files only - images handled separately)
        const githubTextFiles: Record<string, string> = {
          ...updatedFiles,
          'vercel.json': JSON.stringify(vercelConfig, null, 2),
          'package.json': JSON.stringify({
            name: site.slug,
            version: '1.0.0',
            scripts: {
              dev: 'npx serve .',
              start: 'npx serve .'
            },
            dependencies: {}
          }, null, 2)
        };
        
        // Push text files to GitHub
        await github.pushFiles(repoName, githubTextFiles, `Initial commit - Generated by Avallon for ${site.name}`);
        logInfo('Successfully deployed to GitHub', { repoUrl });
      } catch (githubError: any) {
        // GitHub is optional - log and continue
        logInfo('GitHub deployment skipped (optional)', { error: githubError.message });
        repoUrl = undefined;
      }

      // Step 5: Deploy to Vercel (required)
      logInfo('Deploying to Vercel', { siteId, fileCount: Object.keys(vercelFiles).length });
      const vercel = new VercelProvider();
      const projectName = site.slug;
      
      // Create Vercel project
      const project = await vercel.createProject({
        name: projectName,
        framework: 'static',
        rootDirectory: ''
      });
      
      logInfo('Vercel project created', { projectId: project.projectId });
      
      // Deploy files directly to Vercel (not via Git - simpler and doesn't require Git integration)
      const deployment = await vercel.createDeployment({
        projectId: project.projectId,
        files: vercelFiles
      });
      
      logInfo('Vercel deployment created', { deploymentId: deployment.deploymentId, url: deployment.url });
      
      // Wait a bit for deployment to process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get deployment status
      const status = await vercel.getDeploymentStatus(deployment.deploymentId);
      previewUrl = status.url || deployment.url;
      
      logInfo('Vercel deployment completed', { previewUrl });

      // Update the site with deployment URLs
      await updateSite(siteId, user.id, {
        repoUrl,
        previewUrl,
        vercelProjectId: project.projectId,
        vercelDeploymentId: deployment.deploymentId,
        status: 'live'
      });

      return NextResponse.json({
        success: true,
        previewUrl,
        repoUrl,
        vercelProjectId: project.projectId,
        vercelDeploymentId: deployment.deploymentId,
        message: "Website deployed successfully!"
      }, { headers: corsHeaders });
    } catch (deployError: any) {
      logError('Deployment failed', deployError);
      
      // Provide more helpful error messages
      let errorMessage = deployError.message;
      if (errorMessage.includes('VERCEL_TOKEN') || errorMessage.includes('not configured')) {
        errorMessage = 'Vercel is not configured. Please add VERCEL_TOKEN to environment variables.';
      } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        errorMessage = 'Vercel authentication failed. Please check your VERCEL_TOKEN.';
      } else if (errorMessage.includes('rate limit')) {
        errorMessage = 'Rate limit exceeded. Please try again in a few minutes.';
      }
      
      return NextResponse.json({
        error: "Deployment failed",
        details: errorMessage
      }, { status: 500, headers: corsHeaders });
    }
  } catch (error: any) {
    logError('Vercel deployment failed', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400, headers: corsHeaders });
    }
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500, headers: corsHeaders });
  }
}
