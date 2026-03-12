// API endpoint for deploying websites to GitHub and Vercel
// CHANGELOG: 2026-01-07 - Added proper CORS handling
// CHANGELOG: 2026-01-22 - Added image downloading and navigation link fixing
import { NextRequest, NextResponse } from "next/server";
import { logError, logInfo } from "@/lib/log";
import { z } from "zod";
import { getUser } from "@/lib/auth/getUser";
import { getSiteById, updateSite } from "@/data/sites";
import { GitHubClient } from "@/lib/clients/github";
import { VercelProvider } from "@/lib/providers/impl/vercel";
import { getCorsHeaders } from "@/lib/cors";

const DeployToVercelSchema = z.object({
  siteId: z.string().min(1, "Site ID is required"),
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
  
  // =====================================================
  // FIX: Remove hardcoded viewport widths from WordPress sections
  // These are calculated based on editor viewport and break on other screen sizes
  // =====================================================
  
  // Remove hardcoded width from full-width sections (alignfull, has-background)
  // Pattern: style="...width: 1315px;..." -> remove just the width part
  html = html.replace(
    /(<div[^>]*class="[^"]*(?:alignfull|has-background|wp-block-group)[^"]*"[^>]*style="[^"]*)(width:\s*\d{3,}(?:\.\d+)?px;?\s*)/gi,
    '$1'
  );
  
  // Also remove hardcoded heights from these sections
  html = html.replace(
    /(<div[^>]*class="[^"]*(?:alignfull|has-background|wp-block-group)[^"]*"[^>]*style="[^"]*)(height:\s*\d{3,}(?:\.\d+)?px;?\s*)/gi,
    '$1'
  );
  
  // Clean up any resulting empty style attributes or double semicolons
  html = html.replace(/style="\s*;+\s*"/gi, '');
  html = html.replace(/style="([^"]*);\s*;+/gi, 'style="$1;');
  html = html.replace(/style=";\s*/gi, 'style="');
  
  return html;
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
  const imageFiles: Record<string, Buffer> = {};
  const imageMapping: Record<string, string> = {};
  let imageIndex = 0;
  let totalSize = 0;
  
  // Extract all image URLs from HTML files
  const imageUrls = new Set<string>();
  
  // Patterns to find images
  const imageUrlPattern = /(?:src=["']|url\(["']?)(https?:\/\/[^"'\s)]+\.(?:jpg|jpeg|png|gif|webp|svg|ico)[^"'\s)]*)/gi;
  const bgImagePattern = /background(?:-image)?:\s*url\(["']?(https?:\/\/[^"'\s)]+)["']?\)/gi;
  const unsplashPattern = /(?:src=["']|url\(["']?)(https?:\/\/images\.unsplash\.com\/[^"'\s)]+)/gi;
  
  for (const content of Object.values(files)) {
    if (typeof content !== 'string') continue;
    
    let match;
    
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
  
  logInfo('Found external images to download', { count: imageUrls.size });
  
  if (imageUrls.size === 0) {
    return { updatedFiles: files, imageFiles: {} };
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
  for (const [filename, content] of Object.entries(files)) {
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
 * Extract navigation links from HTML to build mobile menu
 */
function extractNavigationLinks(html: string): Array<{text: string; href: string}> {
  const links: Array<{text: string; href: string}> = [];
  const seen = new Set<string>();
  
  // Try nav elements first
  const navLinkRegex = /<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/gi;
  const navSections = html.match(/<nav[^>]*>[\s\S]*?<\/nav>/gi) || [];
  
  for (const navSection of navSections) {
    let match;
    const regex = new RegExp(navLinkRegex.source, 'gi');
    while ((match = regex.exec(navSection)) !== null) {
      const href = match[1];
      const text = match[2].trim();
      if (text && href && !seen.has(href) && 
          !href.startsWith('#') && 
          !href.startsWith('javascript') &&
          !href.includes('mailto:') &&
          !href.includes('tel:') &&
          text.length < 50) {
        seen.add(href);
        links.push({ text, href });
      }
    }
  }
  
  // If no nav links found, try header area
  if (links.length === 0) {
    const headerSections = html.match(/<header[^>]*>[\s\S]*?<\/header>/gi) || [];
    for (const section of headerSections) {
      let match;
      const regex = new RegExp(navLinkRegex.source, 'gi');
      while ((match = regex.exec(section)) !== null) {
        const href = match[1];
        const text = match[2].trim();
        if (text && href && !seen.has(href) && 
            !href.startsWith('#') && 
            !href.startsWith('javascript') &&
            !href.includes('mailto:') &&
            !href.includes('tel:') &&
            text.length < 50) {
          seen.add(href);
          links.push({ text, href });
        }
      }
    }
  }
  
  return links.slice(0, 10);
}

/**
 * Inject mobile menu fix for published sites
 * Ensures hamburger menus work on mobile devices
 * 
 * BULLETPROOF VERSION:
 * 1. Hides ALL original hamburger/mobile menu buttons
 * 2. Injects our own working hamburger with inline onclick (no JS dependency)
 * 3. Uses extremely high specificity CSS
 */
function injectMobileMenuFix(files: Record<string, string>): Record<string, string> {
  const fixedFiles: Record<string, string> = {};
  
  for (const [filename, content] of Object.entries(files)) {
    if (!filename.endsWith('.html') || typeof content !== 'string') {
      fixedFiles[filename] = content;
      continue;
    }
    
    // Skip if already has our mobile menu
    if (content.includes('id="avallon-mobile-toggle"') || content.includes('data-avallon-mobile-nav="true"')) {
      fixedFiles[filename] = content;
      continue;
    }
    
    // Extract navigation links for mobile menu
    const navLinks = extractNavigationLinks(content);
    const navLinksHtml = navLinks.map(link => 
      `<a href="${link.href}" class="avm-link" onclick="document.getElementById('avallon-mobile-overlay').classList.remove('active');document.getElementById('avallon-mobile-toggle').classList.remove('active');document.body.classList.remove('avm-open');">${link.text}</a>`
    ).join('\n    ');
    
    // Inline toggle function - works even if external JS is blocked
    const toggleFn = `(function(){var o=document.getElementById('avallon-mobile-overlay'),t=document.getElementById('avallon-mobile-toggle');if(!o||!t)return;var isOpen=o.classList.contains('active');o.classList.toggle('active',!isOpen);t.classList.toggle('active',!isOpen);document.body.classList.toggle('avm-open',!isOpen);})()`;
    
    const mobileMenuCode = `
<!-- AVALLON MOBILE MENU - Injected for reliable mobile navigation -->
<style data-avallon-mobile-nav="true">
/* ========== HIDE ALL ORIGINAL HAMBURGER MENUS ========== */
@media (max-width: 767px) {
  /* Common hamburger button classes */
  .hamburger, .hamburger-menu, .hamburger-btn, .hamburger-button,
  .menu-toggle, .menu-btn, .menu-button, .mobile-menu-toggle,
  .mobile-menu-btn, .mobile-nav-toggle, .mobile-toggle,
  .nav-toggle, .navbar-toggle, .navbar-toggler,
  .burger, .burger-menu, .burger-btn,
  /* WordPress specific */
  .wp-block-navigation__responsive-container-open,
  .wp-block-navigation-button,
  /* Icon-based selectors */
  button[aria-label*="menu" i]:not(#avallon-mobile-toggle),
  button[aria-label*="Menu" i]:not(#avallon-mobile-toggle),
  button[aria-label*="navigation" i]:not(#avallon-mobile-toggle),
  button[aria-label*="toggle" i]:not(#avallon-mobile-toggle),
  /* SVG hamburger icons in buttons */
  header button:not(#avallon-mobile-toggle),
  nav button:not(#avallon-mobile-toggle),
  .header button:not(#avallon-mobile-toggle),
  .navbar button:not(#avallon-mobile-toggle),
  /* Three-line hamburger patterns */
  [class*="hamburger"]:not(#avallon-mobile-toggle),
  [class*="burger"]:not(#avallon-mobile-toggle),
  [class*="mobile-menu"]:not(#avallon-mobile-toggle):not(#avallon-mobile-overlay),
  [class*="menu-toggle"]:not(#avallon-mobile-toggle),
  [class*="nav-toggle"]:not(#avallon-mobile-toggle) {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
  }
}

/* ========== AVALLON MOBILE TOGGLE BUTTON ========== */
#avallon-mobile-toggle {
  display: none;
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 2147483647;
  width: 48px;
  height: 48px;
  background: #1a1a2e;
  border: 2px solid #fff;
  border-radius: 10px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
@media (max-width: 767px) {
  #avallon-mobile-toggle {
    display: flex !important;
  }
}
@media (min-width: 768px) {
  #avallon-mobile-toggle,
  #avallon-mobile-overlay {
    display: none !important;
  }
}
#avallon-mobile-toggle span {
  display: block;
  width: 24px;
  height: 3px;
  background: #fff;
  border-radius: 2px;
  transition: all 0.3s ease;
  pointer-events: none;
}
#avallon-mobile-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}
#avallon-mobile-toggle.active span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}
#avallon-mobile-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* ========== MOBILE MENU OVERLAY ========== */
#avallon-mobile-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  z-index: 2147483646;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px 20px;
  overflow-y: auto;
}
#avallon-mobile-overlay.active {
  display: flex !important;
}

/* ========== MENU LINKS ========== */
.avm-link {
  display: block;
  padding: 18px 32px;
  margin: 6px 0;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  width: 100%;
  max-width: 280px;
  text-align: center;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}
.avm-link:hover, .avm-link:active {
  background: rgba(255,255,255,0.2);
  transform: scale(1.02);
}

/* ========== BODY SCROLL LOCK ========== */
body.avm-open {
  overflow: hidden !important;
  position: fixed !important;
  width: 100% !important;
}
</style>

<!-- Mobile Menu Toggle Button - Uses inline onclick for maximum compatibility -->
<button id="avallon-mobile-toggle" 
        aria-label="Open Menu" 
        onclick="${toggleFn}">
  <span></span>
  <span></span>
  <span></span>
</button>

<!-- Mobile Menu Overlay -->
<div id="avallon-mobile-overlay" onclick="if(event.target===this){${toggleFn}}">
  ${navLinksHtml || '<a href="/" class="avm-link">Home</a>'}
</div>

<script data-avallon-mobile-nav="true">
// Backup event listeners (in case inline onclick is stripped)
(function() {
  'use strict';
  var toggle = document.getElementById('avallon-mobile-toggle');
  var overlay = document.getElementById('avallon-mobile-overlay');
  if (!toggle || !overlay) return;
  
  function toggleMenu(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    var isOpen = overlay.classList.contains('active');
    overlay.classList.toggle('active', !isOpen);
    toggle.classList.toggle('active', !isOpen);
    document.body.classList.toggle('avm-open', !isOpen);
    toggle.setAttribute('aria-label', isOpen ? 'Open Menu' : 'Close Menu');
  }
  
  // Remove any existing listeners then add fresh ones
  var newToggle = toggle.cloneNode(true);
  toggle.parentNode.replaceChild(newToggle, toggle);
  toggle = newToggle;
  
  // Touch handling for iOS
  var touchStarted = false;
  toggle.addEventListener('touchstart', function() { touchStarted = true; }, { passive: true });
  toggle.addEventListener('touchend', function(e) {
    if (touchStarted) {
      e.preventDefault();
      toggleMenu();
      touchStarted = false;
    }
  }, { passive: false });
  
  // Click handler for non-touch
  toggle.addEventListener('click', function(e) {
    if (!touchStarted) toggleMenu(e);
    touchStarted = false;
  });
  
  // Close when clicking overlay background
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) toggleMenu(e);
  });
  
  // Close on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) toggleMenu();
  });
})();
</script>
<!-- END AVALLON MOBILE MENU -->
`;

    // Inject before </body>
    let fixedContent = content;
    if (content.includes('</body>')) {
      fixedContent = content.replace('</body>', mobileMenuCode + '\n</body>');
    } else if (content.includes('</html>')) {
      fixedContent = content.replace('</html>', mobileMenuCode + '\n</html>');
    } else {
      fixedContent = content + mobileMenuCode;
    }
    
    fixedFiles[filename] = fixedContent;
  }
  
  logInfo('Injected mobile menu fix', { fileCount: Object.keys(fixedFiles).filter(f => f.endsWith('.html')).length });
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
    const { siteId } = DeployToVercelSchema.parse(body);

    logInfo('Starting deployment to GitHub and Vercel', { siteId, userId: user.id });

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

    // Get website files from websiteContent
    const rawFiles = site.websiteContent?.files || site.websiteContent || {};
    if (!rawFiles || Object.keys(rawFiles).length === 0) {
      return NextResponse.json({ error: "No website files found" }, { status: 400, headers: corsHeaders });
    }

    let repoUrl: string | undefined;
    let previewUrl: string;

    try {
      logInfo('Processing files for deployment', { fileCount: Object.keys(rawFiles).length });
      
      // Step 0: CRITICAL - Clean editor-injected scripts that break navigation
      const cleanedFiles: Record<string, string> = {};
      for (const [filename, content] of Object.entries(rawFiles)) {
        if (filename.endsWith('.html') && typeof content === 'string') {
          cleanedFiles[filename] = cleanEditorScripts(content);
        } else if (typeof content === 'string') {
          cleanedFiles[filename] = content;
        }
      }
      logInfo('Cleaned editor scripts from HTML files');
      
      // Step 0.5: Inject custom scripts/widgets
      const customScripts = rawFiles._customScripts as Array<{ code: string; applyTo: string }> | undefined;
      if (customScripts && customScripts.length > 0) {
        logInfo('Injecting custom scripts', { count: customScripts.length });
        
        for (const [filename, content] of Object.entries(cleanedFiles)) {
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
            cleanedFiles[filename] = content.replace('</body>', `\n<!-- Custom Widgets -->\n${scriptBlock}\n</body>`);
          } else if (content.includes('</html>')) {
            cleanedFiles[filename] = content.replace('</html>', `\n<!-- Custom Widgets -->\n${scriptBlock}\n</html>`);
          } else {
            cleanedFiles[filename] = content + `\n<!-- Custom Widgets -->\n${scriptBlock}`;
          }
          
          logInfo('Injected scripts into page', { filename, scriptCount: scriptsForPage.length });
        }
      }
      
      // Remove _customScripts from files (it's metadata, not a file)
      delete cleanedFiles._customScripts;
      
      // Step 0.75: Inject mobile menu fix for reliable mobile navigation
      const filesWithMobileMenu = injectMobileMenuFix(cleanedFiles);
      
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
