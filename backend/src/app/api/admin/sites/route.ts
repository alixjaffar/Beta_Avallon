/**
 * Admin endpoint for managing ALL sites across ALL users
 * SECURITY: Only accessible by alij123402@gmail.com
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logInfo, logError } from "@/lib/log";

const ADMIN_EMAIL = 'alij123402@gmail.com';

function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

function getAdminEmail(req: NextRequest): string | null {
  return req.headers.get('x-user-email') || req.headers.get('x-admin-email') || null;
}

// GET - List all sites from all users
export async function GET(req: NextRequest) {
  const adminEmail = getAdminEmail(req);
  
  if (!isAdmin(adminEmail)) {
    logError('Unauthorized admin sites access', null, { email: adminEmail });
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const ownerEmail = searchParams.get('ownerEmail');
    const siteId = searchParams.get('siteId');
    const limit = parseInt(searchParams.get('limit') || '50');

    // If specific site requested
    if (siteId) {
      const site = await prisma.site.findUnique({
        where: { id: siteId },
      });
      
      if (!site) {
        return NextResponse.json({ error: "Site not found" }, { status: 404 });
      }
      
      return NextResponse.json({ site });
    }

    // Build query
    const where: any = {};
    
    // Filter by owner email if provided (match by ownerId pattern)
    if (ownerEmail) {
      // The ownerId is a hash of the email, so we need to find users first
      const user = await prisma.user.findUnique({ where: { email: ownerEmail } });
      if (user) {
        where.ownerId = user.id;
      } else {
        // Try the email-based ID pattern
        const emailBasedId = `user_${Buffer.from(ownerEmail).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 16)}`;
        where.ownerId = emailBasedId;
      }
    }

    const sites = await prisma.site.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      take: limit,
      select: {
        id: true,
        ownerId: true,
        name: true,
        slug: true,
        status: true,
        previewUrl: true,
        customDomain: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const totalSites = await prisma.site.count({ where });

    // Try to enrich with owner emails
    const enrichedSites = await Promise.all(sites.map(async (site) => {
      let ownerEmail = null;
      try {
        const user = await prisma.user.findFirst({ where: { id: site.ownerId } });
        ownerEmail = user?.email || null;
      } catch {
        // ownerId might be email-based hash, try to decode isn't practical
      }
      return { ...site, ownerEmail };
    }));

    logInfo('Admin sites list', { adminEmail, count: sites.length, totalSites });

    return NextResponse.json({
      sites: enrichedSites,
      totalSites,
      showing: sites.length,
    });
  } catch (error: any) {
    logError('Admin sites GET failed', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Publish a site (change status, set preview URL)
export async function POST(req: NextRequest) {
  const adminEmail = getAdminEmail(req);
  
  if (!isAdmin(adminEmail)) {
    logError('Unauthorized admin sites publish', null, { email: adminEmail });
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { siteId, action } = body;

    if (!siteId) {
      return NextResponse.json({ error: "siteId is required" }, { status: 400 });
    }

    const site = await prisma.site.findUnique({ where: { id: siteId } });
    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    let updatedSite;

    switch (action) {
      case 'publish':
        // Generate preview URL if not set
        const previewUrl = site.previewUrl || `https://avallon.ca/${site.id}`;
        updatedSite = await prisma.site.update({
          where: { id: siteId },
          data: { 
            status: 'live',
            previewUrl,
          },
        });
        logInfo('Admin published site', { adminEmail, siteId, previewUrl });
        break;

      case 'unpublish':
        updatedSite = await prisma.site.update({
          where: { id: siteId },
          data: { status: 'draft' },
        });
        logInfo('Admin unpublished site', { adminEmail, siteId });
        break;

      case 'delete':
        await prisma.site.delete({ where: { id: siteId } });
        logInfo('Admin deleted site', { adminEmail, siteId });
        return NextResponse.json({ success: true, message: "Site deleted" });

      default:
        return NextResponse.json({ error: "Invalid action. Use 'publish', 'unpublish', or 'delete'" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      site: updatedSite,
      action,
    });
  } catch (error: any) {
    logError('Admin sites POST failed', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update site content directly
export async function PUT(req: NextRequest) {
  const adminEmail = getAdminEmail(req);
  
  if (!isAdmin(adminEmail)) {
    logError('Unauthorized admin sites update', null, { email: adminEmail });
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { siteId, name, status, websiteContent } = body;

    if (!siteId) {
      return NextResponse.json({ error: "siteId is required" }, { status: 400 });
    }

    const site = await prisma.site.findUnique({ where: { id: siteId } });
    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (status !== undefined) updateData.status = status;
    if (websiteContent !== undefined) updateData.websiteContent = websiteContent;

    const updatedSite = await prisma.site.update({
      where: { id: siteId },
      data: updateData,
    });

    logInfo('Admin updated site', { adminEmail, siteId, fields: Object.keys(updateData) });

    return NextResponse.json({
      success: true,
      site: updatedSite,
    });
  } catch (error: any) {
    logError('Admin sites PUT failed', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
