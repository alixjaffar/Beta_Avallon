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
 * Download external images and embed them locally in the deployment
 * This prevents broken images when the original website is deleted
 * 
 * Limits:
 * - Max 500KB per image
 * - Max 7MB total for all images (to stay under Vercel's 10MB limit)
 */
async function downloadAndEmbedImages(files: Record<string, string>): Promise<{
  updatedFiles: Record<string, string>;
  imageFiles: Record<string, Buffer>;
}> {
  const imageFiles: Record<string, Buffer> = {};
  const imageMapping: Record<string, string> = {};
  let imageIndex = 0;
  
  const MAX_IMAGE_SIZE = 500 * 1024; // 500KB per image
  const MAX_TOTAL_SIZE = 7 * 1024 * 1024; // 7MB total for images
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
  
  // Download images with size limits
  const downloadImage = async (url: string): Promise<void> => {
    try {
      // Check if we've hit the total size limit
      if (totalSize >= MAX_TOTAL_SIZE) {
        logInfo('Image skipped - total size limit reached', { url: url.substring(0, 60), totalSize });
        return;
      }
      
      if (url.startsWith('data:') || !url.startsWith('http')) return;
      if (url.length > 2000) return;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        },
        signal: AbortSignal.timeout(8000),
      });
      
      if (!response.ok) return;
      
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/html') || contentType.includes('application/json')) return;
      
      // Check content-length header first if available
      const contentLength = response.headers.get('content-length');
      if (contentLength && parseInt(contentLength) > MAX_IMAGE_SIZE) {
        logInfo('Image skipped - too large (header)', { url: url.substring(0, 60), size: contentLength });
        return;
      }
      
      const buffer = Buffer.from(await response.arrayBuffer());
      
      // Skip images that are too small (likely broken) or too large
      if (buffer.byteLength < 100) return;
      if (buffer.byteLength > MAX_IMAGE_SIZE) {
        logInfo('Image skipped - too large', { url: url.substring(0, 60), size: buffer.byteLength });
        return;
      }
      
      // Check if adding this image would exceed total limit
      if (totalSize + buffer.byteLength > MAX_TOTAL_SIZE) {
        logInfo('Image skipped - would exceed total limit', { url: url.substring(0, 60), imageSize: buffer.byteLength, totalSize });
        return;
      }
      
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
  
  // Download in batches of 5
  const urls = Array.from(imageUrls);
  for (let i = 0; i < urls.length; i += 5) {
    // Stop if we've hit the size limit
    if (totalSize >= MAX_TOTAL_SIZE) break;
    
    const batch = urls.slice(i, i + 5);
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
 * Fix navigation links in HTML files for multi-page sites
 * Uses aggressive string replacement to ensure all links work
 */
function fixNavigationLinks(files: Record<string, string>): Record<string, string> {
  const fixedFiles: Record<string, string> = {};
  const pageNames = Object.keys(files)
    .filter(f => f.endsWith('.html'))
    .map(f => f.replace('.html', ''));
  
  logInfo('Navigation fix starting', { pageNames, fileCount: Object.keys(files).length });
  
  // Collect all unique domains found in the HTML
  const allDomains = new Set<string>();
  for (const content of Object.values(files)) {
    if (typeof content !== 'string') continue;
    // Find all URLs in the content
    const urlMatches = content.matchAll(/https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi);
    for (const match of urlMatches) {
      allDomains.add(match[0].toLowerCase());
    }
  }
  
  // Filter to likely source domains (exclude CDNs, common services)
  const excludeDomains = ['fonts.googleapis.com', 'cdnjs.cloudflare.com', 'cdn.', 'ajax.googleapis.com', 'unpkg.com', 'jsdelivr.net'];
  const sourceDomains = Array.from(allDomains).filter(d => 
    !excludeDomains.some(exc => d.includes(exc))
  );
  
  logInfo('Navigation fix: source domains detected', { sourceDomains: sourceDomains.slice(0, 10) });
  
  for (const [filename, content] of Object.entries(files)) {
    if (!filename.endsWith('.html') || typeof content !== 'string') {
      fixedFiles[filename] = content;
      continue;
    }
    
    let fixedContent = content;
    let fixCount = 0;
    
    // Log some sample hrefs before fixing
    const hrefSamples = content.match(/href=["'][^"']{1,200}["']/gi)?.slice(0, 10) || [];
    logInfo('Sample hrefs before fix', { filename, samples: hrefSamples });
    
    // STEP 1: Replace absolute URLs with domain to local paths
    // Match: href="https://www.example.com/page" or href="https://example.com/page/"
    for (const domain of sourceDomains) {
      const escapedDomain = domain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Pattern to match href with full URL
      const fullUrlPattern = new RegExp(
        `href\\s*=\\s*(["'])${escapedDomain}(/[^"'#?]*)?([#?][^"']*)?\\1`,
        'gi'
      );
      
      fixedContent = fixedContent.replace(fullUrlPattern, (match, quote, path, extra) => {
        const cleanPath = (path || '/')
          .replace(/^\/+/, '')
          .replace(/\/+$/, '')
          .replace(/\.html$/, '');
        
        let targetPage = cleanPath;
        if (cleanPath === '' || cleanPath === 'home' || cleanPath === 'home-page' || cleanPath === 'home-page-1') {
          targetPage = 'index';
        }
        
        fixCount++;
        logInfo('Fixed absolute URL', { from: match.substring(0, 100), to: `${targetPage}.html` });
        return `href=${quote}${targetPage}.html${extra || ''}${quote}`;
      });
    }
    
    // STEP 2: Replace relative paths like /team/, /contact, /apply/
    // This catches: href="/team" href="/team/" href="team" href="team/"
    fixedContent = fixedContent.replace(
      /href\s*=\s*(["'])(\/?)(team|contact|apply|about|services|home|careers|blog|portfolio|gallery|faq|pricing|index|home-page-1|home-page)(\/?)(["'])/gi,
      (match, q1, slash1, page, slash2, q2) => {
        const targetPage = (page.toLowerCase() === 'home' || page.toLowerCase() === 'home-page' || page.toLowerCase() === 'home-page-1') 
          ? 'index' 
          : page.toLowerCase();
        fixCount++;
        return `href=${q1}${targetPage}.html${q2}`;
      }
    );
    
    // STEP 3: Fix root path href="/"
    fixedContent = fixedContent.replace(
      /href\s*=\s*(["'])\/(["'])/gi,
      (match, q1, q2) => {
        fixCount++;
        return `href=${q1}index.html${q2}`;
      }
    );
    
    // STEP 4: Fix any remaining relative paths that look like pages
    // Match: href="/something" or href="something" where something is alphanumeric
    fixedContent = fixedContent.replace(
      /href\s*=\s*(["'])(\/?[a-zA-Z][a-zA-Z0-9_-]{1,30})\/?(\1)/gi,
      (match, q1, path, q2) => {
        // Skip if already has extension or is a known non-page
        if (path.includes('.') || path.startsWith('#') || path.startsWith('javascript') || 
            path.startsWith('mailto') || path.startsWith('tel') || path.startsWith('http')) {
          return match;
        }
        
        const cleanPath = path.replace(/^\/+/, '').replace(/\/+$/, '');
        const targetPage = (cleanPath === 'home' || cleanPath === 'home-page' || cleanPath === 'home-page-1') 
          ? 'index' 
          : cleanPath;
        
        fixCount++;
        return `href=${q1}${targetPage}.html${q1}`;
      }
    );
    
    // STEP 5: Fix JavaScript navigation
    fixedContent = fixedContent.replace(
      /window\.location(?:\.href)?\s*=\s*(["'])([^"']+)\1/gi,
      (match, q, path) => {
        if (path.startsWith('http') || path.endsWith('.html') || path.startsWith('#')) {
          return match;
        }
        const cleanPath = path.replace(/^\/+/, '').replace(/\/+$/, '');
        if (cleanPath && cleanPath.length < 50 && !cleanPath.includes('.')) {
          const targetPage = (cleanPath === '' || cleanPath === 'home') ? 'index' : cleanPath;
          fixCount++;
          return `window.location.href=${q}${targetPage}.html${q}`;
        }
        return match;
      }
    );
    
    // Log sample hrefs after fixing
    const hrefSamplesAfter = fixedContent.match(/href=["'][^"']{1,200}["']/gi)?.slice(0, 10) || [];
    logInfo('Sample hrefs after fix', { filename, samples: hrefSamplesAfter, fixCount });
    
    fixedFiles[filename] = fixedContent;
  }
  
  logInfo('Navigation links fix complete', { 
    pagesProcessed: Object.keys(fixedFiles).filter(f => f.endsWith('.html')).length,
    pageNames 
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

    logInfo('Starting deployment to GitHub and Vercel', { siteId });

    // Get the site with its files
    const site = await getSiteById(siteId, user.id);
    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404, headers: corsHeaders });
    }

    // Get website files from websiteContent
    const rawFiles = site.websiteContent?.files || site.websiteContent || {};
    if (!rawFiles || Object.keys(rawFiles).length === 0) {
      return NextResponse.json({ error: "No website files found" }, { status: 400, headers: corsHeaders });
    }

    let repoUrl: string | undefined;
    let previewUrl: string;

    try {
      logInfo('Processing files for deployment', { fileCount: Object.keys(rawFiles).length });
      
      // Step 1: Fix navigation links for multi-page sites
      const filesWithFixedNav = fixNavigationLinks(rawFiles);
      
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
