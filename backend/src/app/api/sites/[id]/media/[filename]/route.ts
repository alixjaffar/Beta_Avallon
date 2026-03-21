import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCorsHeaders } from '@/lib/cors';

export const runtime = 'nodejs';

function contentTypeForMime(mime: string, ext: string): string {
  if (mime && mime.startsWith('image/')) return mime;
  return contentTypeForExt(ext);
}

function contentTypeForExt(ext: string): string {
  switch (ext) {
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'svg':
      return 'image/svg+xml';
    case 'ico':
      return 'image/x-icon';
    default:
      return 'application/octet-stream';
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 200, headers: getCorsHeaders(req) });
}

/**
 * Public read for uploaded site images (used in saved HTML and on published pages).
 * Filenames are unguessable hex ids; scoped per site in the database.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; filename: string }> }
) {
  const corsHeaders = getCorsHeaders(req);

  try {
    const { id: siteId, filename: raw } = await params;
    const base = raw.split(/[/\\]/).pop() || '';
    if (!/^[a-f0-9]{32}\.[a-z0-9]+$/i.test(base)) {
      return new NextResponse('Not found', { status: 404, headers: corsHeaders });
    }

    const asset = await prisma.siteAsset.findUnique({
      where: {
        siteId_key: {
          siteId,
          key: base,
        },
      },
    });

    if (!asset) {
      return new NextResponse('Not found', { status: 404, headers: corsHeaders });
    }

    const ext = base.split('.').pop()?.toLowerCase() || '';
    const ct = contentTypeForMime(asset.mime, ext);

    return new NextResponse(new Uint8Array(asset.data), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': ct,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new NextResponse('Not found', { status: 404, headers: corsHeaders });
  }
}
