import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const filePath = join(process.cwd(), '../frontend/dist', ...path);
    
    const fileContent = readFileSync(filePath);
    const ext = path[path.length - 1]?.split('.').pop()?.toLowerCase();
    
    let contentType = 'text/plain';
    if (ext === 'html') contentType = 'text/html';
    else if (ext === 'css') contentType = 'text/css';
    else if (ext === 'js') contentType = 'application/javascript';
    else if (ext === 'json') contentType = 'application/json';
    else if (ext === 'png') contentType = 'image/png';
    else if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg';
    else if (ext === 'svg') contentType = 'image/svg+xml';
    else if (ext === 'ico') contentType = 'image/x-icon';
    else if (ext === 'woff') contentType = 'font/woff';
    else if (ext === 'woff2') contentType = 'font/woff2';
    else if (ext === 'ttf') contentType = 'font/ttf';
    
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving static file:', error);
    return new NextResponse('File not found', { status: 404 });
  }
}
