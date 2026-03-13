import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth/getUser';
import { getSiteById, updateSite, deleteSite } from '@/data/sites';
import { z } from 'zod';
import { getCorsHeaders } from '@/lib/cors';

// Route segment config to allow larger request bodies (for base64 images)
export const maxDuration = 60; // 1 minute timeout
export const runtime = 'nodejs';

// Utility function to fix broken image URLs in HTML content
function fixImageUrls(html: string): string {
  if (!html || typeof html !== 'string') return html;
  
  // Fix broken Unsplash URLs in src attributes
  const brokenSrcPattern = /src=["'](photo-\d+-\d+[^"']*)["']/gi;
  html = html.replace(brokenSrcPattern, (match, photoId) => {
    const cleanPhotoId = photoId.split('?')[0].split('&')[0];
    return `src="https://images.unsplash.com/${cleanPhotoId}?w=800&h=600&fit=crop"`;
  });
  
  // Fix broken Unsplash URLs in CSS url() functions
  const brokenUrlPattern = /url\(["']?(photo-\d+-\d+[^"')]*)["']?\)/gi;
  html = html.replace(brokenUrlPattern, (match, photoId) => {
    const cleanPhotoId = photoId.split('?')[0].split('&')[0];
    return `url("https://images.unsplash.com/${cleanPhotoId}?w=800&h=600&fit=crop")`;
  });
  
  // Fix broken Unsplash URLs in background-image CSS
  const brokenBgPattern = /background-image:\s*url\(["']?(photo-\d+-\d+[^"')]*)["']?\)/gi;
  html = html.replace(brokenBgPattern, (match, photoId) => {
    const cleanPhotoId = photoId.split('?')[0].split('&')[0];
    return `background-image: url("https://images.unsplash.com/${cleanPhotoId}?w=800&h=600&fit=crop")`;
  });
  
  // Fix any standalone photo IDs (not in quotes or attributes)
  // This catches cases where the URL might be in a different format
  const standalonePhotoPattern = /(?:src|href|url\(|background-image:\s*url\()["']?(photo-\d+-\d+)/gi;
  html = html.replace(standalonePhotoPattern, (match, prefix, photoId) => {
    const cleanPhotoId = photoId.split('?')[0].split('&')[0];
    if (match.includes('url(')) {
      return match.replace(photoId, `https://images.unsplash.com/${cleanPhotoId}?w=800&h=600&fit=crop`);
    }
    return match.replace(photoId, `https://images.unsplash.com/${cleanPhotoId}?w=800&h=600&fit=crop`);
  });
  
  // Fix URLs in quotes that are just photo IDs (catch-all)
  const brokenQuotedPattern = /(["'])(photo-\d+-\d+[^"']*)(["'])/g;
  html = html.replace(brokenQuotedPattern, (match, quote1, photoId, quote2) => {
    // Skip if it's already part of a fixed URL
    if (photoId.includes('images.unsplash.com')) return match;
    const cleanPhotoId = photoId.split('?')[0].split('&')[0];
    return `${quote1}https://images.unsplash.com/${cleanPhotoId}?w=800&h=600&fit=crop${quote2}`;
  });
  
  // Replace any remaining broken image references with a working placeholder
  const brokenImagePattern = /src=["'](?!https?:\/\/|data:|\.\/|\/|#)([^"']+)["']/g;
  html = html.replace(brokenImagePattern, (match, brokenUrl) => {
    if (brokenUrl.match(/^photo-\d+-\d+/)) {
      const cleanPhotoId = brokenUrl.split('?')[0].split('&')[0];
      return `src="https://images.unsplash.com/${cleanPhotoId}?w=800&h=600&fit=crop"`;
    }
    return `src="https://picsum.photos/800/600"`;
  });
  
  // Add image error handler script to the HTML
  // This will try fallback images if the original fails to load
  const fallbackImageIds = [
    '1522071820080-37f2cb85c41d', '1497366216548-37526070297c', '1556761175-4bda37b9dd37',
    '1556761175-b4136fa58510', '1552664736-d46ed1db83d9', '1556761175-5973dc0f32e7',
    '1556761175-5973dc0f32e8', '1556761175-5973dc0f32e9', '1556761175-5973dc0f32ea',
    '1556761175-5973dc0f32eb'
  ];
  
  if (html.includes('</body>') || html.includes('</html>')) {
    const imageErrorHandler = `
<script>
(function() {
  const fallbackImages = ${JSON.stringify(fallbackImageIds)};
  let fallbackIndex = 0;
  
  function getFallbackImageUrl() {
    if (fallbackIndex >= fallbackImages.length) {
      fallbackIndex = 0;
    }
    const imageId = fallbackImages[fallbackIndex];
    fallbackIndex++;
    return 'https://images.unsplash.com/' + imageId + '?w=800&h=600&fit=crop';
  }
  
  function handleImageError(img) {
    const originalSrc = img.getAttribute('data-original-src') || img.src;
    
    if (!img.getAttribute('data-original-src')) {
      img.setAttribute('data-original-src', originalSrc);
      img.setAttribute('data-fallback-attempts', '0');
    }
    
    const attempts = parseInt(img.getAttribute('data-fallback-attempts') || '0');
    
    if (attempts < 5) {
      img.setAttribute('data-fallback-attempts', (attempts + 1).toString());
      img.src = getFallbackImageUrl();
    } else {
      img.style.display = 'none';
    }
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(function(img) {
      if (!img.onerror) {
        img.onerror = function() { handleImageError(img); };
      }
    });
  });
  
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1) {
          if (node.tagName === 'IMG') {
            node.onerror = function() { handleImageError(node); };
          }
          const images = node.querySelectorAll && node.querySelectorAll('img');
          if (images) {
            images.forEach(function(img) {
              if (!img.onerror) {
                img.onerror = function() { handleImageError(img); };
              }
            });
          }
        }
      });
    });
  });
  
  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true
  });
})();
</script>`;
    
    if (html.includes('</body>')) {
      html = html.replace('</body>', imageErrorHandler + '</body>');
    } else if (html.includes('</html>')) {
      html = html.replace('</html>', imageErrorHandler + '</html>');
    }
  }
  
  return html;
}

function fixFontAwesomeLinks(html: string): string {
  if (!html || typeof html !== 'string') return html;
  
  // Remove integrity attributes from Font Awesome links to prevent integrity check errors
  // More robust pattern that handles any order of attributes
  // Pattern: <link ... integrity="..." ... href="...font-awesome..." ...> or vice versa
  html = html.replace(/<link([^>]*href=["'][^"']*font-awesome[^"']*["'][^>]*)>/gi, (match, attributes) => {
    // Remove integrity attribute regardless of position
    const cleaned = attributes.replace(/\s+integrity=["'][^"']*["']/gi, '');
    // Also remove crossorigin if it was paired with integrity (optional cleanup)
    const finalCleaned = cleaned.replace(/\s+crossorigin=["'][^"']*["']/gi, '');
    return `<link${finalCleaned}>`;
  });
  
  // Also handle cases where integrity comes before href
  html = html.replace(/<link([^>]*integrity=["'][^"']*["'][^>]*href=["'][^"']*font-awesome[^"']*["'][^>]*)>/gi, (match, attributes) => {
    // Remove integrity attribute
    const cleaned = attributes.replace(/\s+integrity=["'][^"']*["']/gi, '');
    const finalCleaned = cleaned.replace(/\s+crossorigin=["'][^"']*["']/gi, '');
    return `<link${finalCleaned}>`;
  });
  
  return html;
}

// Extract navigation links from HTML to build mobile menu
function extractNavLinks(html: string): Array<{text: string; href: string}> {
  const links: Array<{text: string; href: string}> = [];
  const seen = new Set<string>();
  
  // Match links in nav, header, and menu elements
  const linkRegex = /<a[^>]*href=["']([^"'#][^"']*)["'][^>]*>([^<]+)<\/a>/gi;
  let match;
  
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    const text = match[2].trim();
    
    if (text && text.length < 50 && !seen.has(href) && 
        !href.startsWith('javascript:') && !href.startsWith('tel:') && !href.startsWith('mailto:')) {
      seen.add(href);
      links.push({ text, href });
    }
    
    if (links.length >= 10) break;
  }
  
  return links;
}

// Inject Avallon mobile menu system into HTML if not already present
function injectMobileMenu(html: string): string {
  if (!html || typeof html !== 'string') return html;
  
  // Skip if already has our mobile menu
  if (html.includes('avallon-mobile-toggle') || html.includes('data-avallon-mobile')) {
    return html;
  }
  
  // Extract nav links to build mobile menu
  const navLinks = extractNavLinks(html);
  const navLinksHtml = navLinks.map(link => 
    `<a href="${link.href}" class="avallon-mobile-link">${link.text}</a>`
  ).join('\n    ');
  
  const mobileMenuCode = `
<!-- Avallon Mobile Menu System -->
<style data-avallon-mobile="true">
@media (min-width: 768px) {
  #avallon-mobile-toggle { display: none !important; }
  #avallon-mobile-overlay { display: none !important; }
}

@media (max-width: 767px) {
  #avallon-mobile-toggle {
    display: flex !important;
    position: fixed !important;
    top: 15px !important;
    right: 15px !important;
    z-index: 99999 !important;
    width: 44px !important;
    height: 44px !important;
    background: #333 !important;
    border: none !important;
    border-radius: 8px !important;
    cursor: pointer !important;
    align-items: center !important;
    justify-content: center !important;
    flex-direction: column !important;
    gap: 5px !important;
    padding: 10px !important;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3) !important;
  }
  
  #avallon-mobile-toggle span {
    display: block !important;
    width: 22px !important;
    height: 2px !important;
    background: white !important;
    transition: all 0.3s !important;
  }
  
  #avallon-mobile-toggle.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px) !important; }
  #avallon-mobile-toggle.active span:nth-child(2) { opacity: 0 !important; }
  #avallon-mobile-toggle.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px) !important; }
  
  .hamburger, .hamburger-menu, .menu-toggle, .mobile-menu-toggle,
  button[aria-label*="menu" i]:not(#avallon-mobile-toggle) {
    display: none !important;
  }
}

#avallon-mobile-overlay {
  display: none;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background: rgba(255, 255, 255, 0.98) !important;
  z-index: 99998 !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 20px !important;
  overflow-y: auto !important;
}

#avallon-mobile-overlay.active { display: flex !important; }

.avallon-mobile-link {
  display: block !important;
  padding: 16px 24px !important;
  font-size: 20px !important;
  color: #333 !important;
  text-decoration: none !important;
  border-bottom: 1px solid #eee !important;
  width: 100% !important;
  max-width: 300px !important;
  text-align: center !important;
}

.avallon-mobile-link:hover { background: #f5f5f5 !important; }
body.avallon-menu-open { overflow: hidden !important; }
</style>

<button id="avallon-mobile-toggle" aria-label="Menu">
  <span></span><span></span><span></span>
</button>
<div id="avallon-mobile-overlay">
  ${navLinksHtml || '<p style="color:#666;">Menu</p>'}
</div>
<script data-avallon-mobile="true">
(function() {
  var t = document.getElementById('avallon-mobile-toggle');
  var o = document.getElementById('avallon-mobile-overlay');
  if (!t || !o) return;
  
  function toggle() {
    var isOpen = o.classList.contains('active');
    t.classList.toggle('active', !isOpen);
    o.classList.toggle('active', !isOpen);
    document.body.classList.toggle('avallon-menu-open', !isOpen);
  }
  
  t.addEventListener('click', function(e) { e.preventDefault(); e.stopPropagation(); toggle(); });
  t.addEventListener('touchend', function(e) { e.preventDefault(); e.stopPropagation(); toggle(); });
  o.querySelectorAll('a').forEach(function(l) { l.addEventListener('click', toggle); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && o.classList.contains('active')) toggle(); });
  o.addEventListener('click', function(e) { if (e.target === o) toggle(); });
})();
</script>
`;

  // Inject before </body> or </html>
  if (html.includes('</body>')) {
    html = html.replace('</body>', mobileMenuCode + '</body>');
  } else if (html.includes('</html>')) {
    html = html.replace('</html>', mobileMenuCode + '</html>');
  }
  
  return html;
}

// Fix image URLs, Font Awesome links, and inject mobile menu in websiteContent object
function fixWebsiteContent(websiteContent: any): any {
  if (!websiteContent) return websiteContent;
  
  if (typeof websiteContent === 'string') {
    let fixed = fixImageUrls(websiteContent);
    fixed = fixFontAwesomeLinks(fixed);
    fixed = injectMobileMenu(fixed);
    return fixed;
  }
  
  if (typeof websiteContent === 'object') {
    const fixed: any = {};
    for (const [key, value] of Object.entries(websiteContent)) {
      if (key.endsWith('.html') && typeof value === 'string') {
        let html = fixImageUrls(value);
        html = fixFontAwesomeLinks(html);
        html = injectMobileMenu(html);
        fixed[key] = html;
      } else if (typeof value === 'string' && (value.includes('photo-') || value.includes('font-awesome'))) {
        let content = value;
        if (value.includes('photo-') && value.includes('src=')) {
          content = fixImageUrls(content);
        }
        if (value.includes('font-awesome')) {
          content = fixFontAwesomeLinks(content);
        }
        fixed[key] = content;
      } else {
        fixed[key] = value;
      }
    }
    return fixed;
  }
  
  return websiteContent;
}

const UpdateSiteSchema = z.object({
  name: z.string().optional(),
  status: z.string().optional(),
  customDomain: z.string().optional(),
  repoUrl: z.string().nullable().optional(),
  previewUrl: z.string().nullable().optional(),
  vercelProjectId: z.string().nullable().optional(),
  vercelDeploymentId: z.string().nullable().optional(),
  chatHistory: z.array(z.any()).nullable().optional(),
  websiteContent: z.any().nullable().optional(),
});

export async function OPTIONS(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Handle preflight request for dynamic routes
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(request),
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const corsHeaders = getCorsHeaders(request);
  
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { 
        status: 401,
        headers: corsHeaders,
      });
    }

    const { id } = await params;
    const site = await getSiteById(id, user.id);
    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { 
        status: 404,
        headers: corsHeaders,
      });
    }

    // Fix broken image URLs in websiteContent before returning
    if (site.websiteContent) {
      site.websiteContent = fixWebsiteContent(site.websiteContent);
    }

    return NextResponse.json(site, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Error fetching site:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const corsHeaders = getCorsHeaders(request);
  
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { 
        status: 401,
        headers: corsHeaders,
      });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = UpdateSiteSchema.parse(body);

    const updatedSite = await updateSite(id, user.id, validatedData);
    if (!updatedSite) {
      return NextResponse.json({ error: 'Site not found' }, { 
        status: 404,
        headers: corsHeaders,
      });
    }

    return NextResponse.json(updatedSite, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Error updating site:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

// PUT handler - same as PATCH for compatibility
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const corsHeaders = getCorsHeaders(request);
  
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { 
        status: 401,
        headers: corsHeaders,
      });
    }

    const { id } = await params;
    const body = await request.json();
    
    // More lenient schema for PUT - allow messages array
    const UpdateSiteSchemaExtended = z.object({
      name: z.string().optional(),
      status: z.string().optional(),
      customDomain: z.string().optional(),
      repoUrl: z.string().nullable().optional(),
      previewUrl: z.string().nullable().optional(),
      vercelProjectId: z.string().nullable().optional(),
      vercelDeploymentId: z.string().nullable().optional(),
      chatHistory: z.array(z.any()).nullable().optional(),
      messages: z.array(z.any()).nullable().optional(), // Allow messages field
      websiteContent: z.any().nullable().optional(),
    });
    
    const validatedData = UpdateSiteSchemaExtended.parse(body);
    
    // Map messages to chatHistory if provided
    if (validatedData.messages && !validatedData.chatHistory) {
      validatedData.chatHistory = validatedData.messages;
    }

    // Log received content for debugging
    const receivedPageCount = validatedData.websiteContent 
      ? Object.keys(validatedData.websiteContent).filter((k: string) => k.endsWith('.html')).length 
      : 0;
    const receivedContentSize = validatedData.websiteContent 
      ? JSON.stringify(validatedData.websiteContent).length 
      : 0;
    console.log('[PUT /sites/:id] Received:', { 
      siteId: id, 
      userId: user.id,
      receivedPageCount,
      receivedContentSize,
      hasWebsiteContent: !!validatedData.websiteContent
    });

    // Check if site exists first - reload to ensure latest data
    let existingSite = await getSiteById(id, user.id);
    
    if (!existingSite) {
      console.error('Site not found for update', { 
        siteId: id, 
        userId: user.id,
        hasWebsiteContent: !!validatedData.websiteContent,
        nodeEnv: process.env.NODE_ENV
      });
      return NextResponse.json({ 
        error: 'Site not found',
        message: `Site with ID ${id} not found. The site may not have been created yet. Please generate the site first.`
      }, { 
        status: 404,
        headers: corsHeaders,
      });
    }

    const updatedSite = await updateSite(id, user.id, validatedData);
    if (!updatedSite) {
      console.error('[PUT /sites/:id] Failed to update site', { siteId: id, userId: user.id });
      return NextResponse.json({ 
        error: 'Failed to update site',
        message: 'Site was found but update failed'
      }, { 
        status: 500,
        headers: corsHeaders,
      });
    }

    // Log what we're returning
    const returnedPageCount = updatedSite.websiteContent 
      ? Object.keys(updatedSite.websiteContent).filter((k: string) => k.endsWith('.html')).length 
      : 0;
    console.log('[PUT /sites/:id] Success:', { 
      siteId: updatedSite.id, 
      returnedPageCount,
      updatedAt: updatedSite.updatedAt
    });

    return NextResponse.json(updatedSite, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Error updating site:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const corsHeaders = getCorsHeaders(request);
  
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { 
        status: 401,
        headers: corsHeaders,
      });
    }

    const { id } = await params;
    const deletedSite = await deleteSite(id, user.id);
    if (!deletedSite) {
      return NextResponse.json({ error: 'Site not found' }, { 
        status: 404,
        headers: corsHeaders,
      });
    }

    return NextResponse.json({ success: true }, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Error deleting site:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}