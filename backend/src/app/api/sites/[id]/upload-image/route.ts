import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { getUser } from '@/lib/auth/getUser';
import { getSiteById } from '@/data/sites';
import { prisma } from '@/lib/db';
import { getCorsHeaders } from '@/lib/cors';

export const runtime = 'nodejs';
export const maxDuration = 120;

/** Aligned with large websiteContent saves */
const MAX_BYTES = 12 * 1024 * 1024;

function extFromMime(mime: string): string {
  const m = mime.toLowerCase();
  if (m.includes('png')) return 'png';
  if (m.includes('jpeg') || m.includes('jpg')) return 'jpg';
  if (m.includes('gif')) return 'gif';
  if (m.includes('webp')) return 'webp';
  if (m.includes('svg')) return 'svg';
  if (m.includes('ico')) return 'ico';
  return 'png';
}

function publicOrigin(req: NextRequest): string {
  const forwardedHost = req.headers.get('x-forwarded-host');
  const forwardedProto = req.headers.get('x-forwarded-proto') || 'https';
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }
  return new URL(req.url).origin;
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 200, headers: getCorsHeaders(req) });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const corsHeaders = getCorsHeaders(req);

  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
    }

    const { id: siteId } = await params;
    const site = await getSiteById(siteId, user.id);
    if (!site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404, headers: corsHeaders });
    }

    const form = await req.formData();
    const file = form.get('file');
    if (!file || !(file instanceof Blob) || file.size === 0) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400, headers: corsHeaders });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: 'Image too large', maxBytes: MAX_BYTES },
        { status: 413, headers: corsHeaders }
      );
    }

    const mime = file.type || 'application/octet-stream';
    if (!mime.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400, headers: corsHeaders });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const ext = extFromMime(mime);
    const key = `${randomBytes(16).toString('hex')}.${ext}`;

    await prisma.siteAsset.create({
      data: {
        siteId,
        key,
        mime,
        data: buf,
      },
    });

    const origin = publicOrigin(req);
    const url = `${origin}/api/sites/${siteId}/media/${key}`;

    return NextResponse.json({ url, filename: key }, { headers: corsHeaders });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}
