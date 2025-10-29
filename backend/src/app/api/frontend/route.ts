import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    // Get the path from the request
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/frontend', '') || '/';
    
    // If it's the root path, serve index.html
    if (path === '/') {
      const indexPath = join(process.cwd(), '..', 'frontend', 'dist', 'index.html');
      const indexContent = readFileSync(indexPath, 'utf-8');
      
      return new NextResponse(indexContent, {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }
    
    // For other paths, try to serve the file
    const filePath = join(process.cwd(), '..', 'frontend', 'dist', path);
    
    try {
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
        headers: {
          'Content-Type': contentType,
        },
      });
    } catch (error) {
      // If file not found, serve index.html for SPA routing
      const indexPath = join(process.cwd(), '..', 'frontend', 'dist', 'index.html');
      const indexContent = readFileSync(indexPath, 'utf-8');
      
      return new NextResponse(indexContent, {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }
  } catch (error) {
    console.error('Error serving frontend:', error);
    return new NextResponse('Frontend not available', { status: 500 });
  }
}
