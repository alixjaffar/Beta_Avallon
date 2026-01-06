import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    // Get the path from the request
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/frontend', '') || '/';
    
    // In development, proxy to Vite dev server
    if (process.env.NODE_ENV === 'development') {
      try {
        const viteUrl = `http://localhost:5173${path}`;
        const response = await fetch(viteUrl, {
          headers: {
            'Accept': request.headers.get('Accept') || '*/*',
          },
        });
        
        if (!response.ok) {
          throw new Error(`Vite server responded with ${response.status}`);
        }
        
        const contentType = response.headers.get('Content-Type') || 'text/html';
        let content = await response.text();
        
        // For HTML, fix asset URLs to work through proxy
        if (contentType.includes('text/html')) {
          // Keep Vite HMR URLs pointing to 5173 (required for hot reload)
          // But fix other asset paths to go through proxy
          content = content
            .replace(/src="\/src\//g, 'src="http://localhost:5173/src/')
            .replace(/href="\/src\//g, 'href="http://localhost:5173/src/')
            .replace(/src="\/(?!@)/g, 'src="/api/frontend/')
            .replace(/href="\/(?!@)/g, 'href="/api/frontend/');
        }
      
        return new NextResponse(content, {
        headers: {
            'Content-Type': contentType,
            // Pass through important headers from Vite
            ...(response.headers.get('Content-Type')?.includes('javascript') && {
              'Content-Type': 'application/javascript',
            }),
        },
      });
      } catch (error: any) {
        // If Vite server is not running, show helpful message
        return new NextResponse(
          `
          <html>
            <head><title>Avallon - Frontend Not Running</title></head>
            <body style="font-family: system-ui; padding: 2rem; text-align: center; max-width: 600px; margin: 0 auto;">
              <h1>🚀 Avallon Backend</h1>
              <p>The backend API is running on <strong>http://localhost:3000</strong></p>
              <p style="color: #666;">To see the full application, start the frontend:</p>
              <pre style="background: #f5f5f5; padding: 1rem; border-radius: 4px; text-align: left;">
cd frontend && npm run dev
              </pre>
              <p>Then visit: <a href="http://localhost:5173">http://localhost:5173</a></p>
              <hr style="margin: 2rem 0;" />
              <p><strong>Backend API Routes:</strong></p>
              <ul style="list-style: none; padding: 0; text-align: left;">
                <li>📊 <a href="/api/billing/credits">/api/billing/credits</a></li>
                <li>🌐 <a href="/api/sites">/api/sites</a></li>
                <li>🔍 <a href="/api/test/current-status">/api/test/current-status</a></li>
                <li>📱 <a href="/dashboard">/dashboard</a> (Next.js dashboard)</li>
              </ul>
            </body>
          </html>
          `,
          {
            headers: { 'Content-Type': 'text/html' },
          }
        );
      }
    }
    
    // In production, serve built frontend from dist folder
    const distPath = join(process.cwd(), '..', 'frontend', 'dist');
    
    if (path === '/' || path === '') {
      const indexPath = join(distPath, 'index.html');
      if (existsSync(indexPath)) {
        const indexContent = readFileSync(indexPath, 'utf-8');
        return new NextResponse(indexContent, {
          headers: { 'Content-Type': 'text/html' },
        });
      }
    }
    
    // Try to serve the requested file
    const filePath = join(distPath, path);
    if (existsSync(filePath)) {
      const fileContent = readFileSync(filePath);
      const ext = path.split('.').pop()?.toLowerCase();
      
      let contentType = 'text/plain';
      if (ext === 'html') contentType = 'text/html';
      else if (ext === 'css') contentType = 'text/css';
      else if (ext === 'js') contentType = 'application/javascript';
      else if (ext === 'json') contentType = 'application/json';
      else if (ext === 'png') contentType = 'image/png';
      else if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg';
      else if (ext === 'svg') contentType = 'image/svg+xml';
      else if (ext === 'ico') contentType = 'image/x-icon';
      
      return new NextResponse(fileContent, {
        headers: { 'Content-Type': contentType },
      });
    }
    
    // Fallback to index.html for SPA routing
    const indexPath = join(distPath, 'index.html');
    if (existsSync(indexPath)) {
      const indexContent = readFileSync(indexPath, 'utf-8');
      return new NextResponse(indexContent, {
        headers: { 'Content-Type': 'text/html' },
      });
    }
    
    return new NextResponse('Frontend not built. Run: cd frontend && npm run build', { status: 404 });
  } catch (error) {
    console.error('Error serving frontend:', error);
    return new NextResponse('Frontend not available', { status: 500 });
  }
}
