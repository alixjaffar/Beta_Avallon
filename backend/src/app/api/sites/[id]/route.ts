import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth/getUser';
import { getSiteById, updateSite, deleteSite } from '@/data/sites';
import { z } from 'zod';

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

// Fix image URLs and Font Awesome links in websiteContent object
function fixWebsiteContent(websiteContent: any): any {
  if (!websiteContent) return websiteContent;
  
  if (typeof websiteContent === 'string') {
    let fixed = fixImageUrls(websiteContent);
    fixed = fixFontAwesomeLinks(fixed);
    return fixed;
  }
  
  if (typeof websiteContent === 'object') {
    const fixed: any = {};
    for (const [key, value] of Object.entries(websiteContent)) {
      if (key === 'index.html' && typeof value === 'string') {
        let html = fixImageUrls(value);
        html = fixFontAwesomeLinks(html);
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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-email',
};

export async function OPTIONS(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Handle preflight request for dynamic routes
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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