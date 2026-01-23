// CHANGELOG: 2026-01-23 - Switched to PostgreSQL with Prisma for persistent storage
import { logInfo, logError } from "@/lib/log";
import { prisma } from "@/lib/db";

// Type definition for Site
export type Site = {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  status: string;
  repoUrl: string | null;
  previewUrl: string | null;
  vercelProjectId: string | null;
  vercelDeploymentId: string | null;
  chatHistory: any[] | null;
  websiteContent: any | null;
  customDomain?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type CreateSiteInput = {
  ownerId: string;
  name: string;
  slug: string;
  status: string;
  repoUrl?: string | null;
  previewUrl?: string | null;
  vercelProjectId?: string | null;
  vercelDeploymentId?: string | null;
  chatHistory?: any[] | null;
  websiteContent?: any | null;
};

export async function createSite(input: CreateSiteInput): Promise<Site> {
  try {
    // Generate a unique slug if needed
    let slug = input.slug;
    let attempts = 0;
    
    while (attempts < 10) {
      const existing = await prisma.site.findUnique({ where: { slug } });
      if (!existing) break;
      slug = `${input.slug}-${Date.now()}`;
      attempts++;
    }
    
    const site = await prisma.site.create({
      data: {
        ownerId: input.ownerId,
        name: input.name,
        slug: slug,
        status: input.status,
        repoUrl: input.repoUrl || null,
        previewUrl: input.previewUrl || null,
        vercelProjectId: input.vercelProjectId || null,
        vercelDeploymentId: input.vercelDeploymentId || null,
        chatHistory: input.chatHistory || [],
        websiteContent: input.websiteContent || null,
      },
    });
    
    logInfo('Site created in PostgreSQL', { siteId: site.id, name: site.name });
    return site as Site;
  } catch (error: any) {
    logError('Error creating site:', error);
    throw new Error(`Failed to create site: ${error.message}`);
  }
}

export async function listSitesByUser(userId: string): Promise<Site[]> {
  try {
    const sites = await prisma.site.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
    });
    
    logInfo('Sites listed', { userId, count: sites.length });
    return sites as Site[];
  } catch (error: any) {
    logError('Error listing sites:', error);
    return [];
  }
}

export async function getSiteById(id: string, userId: string): Promise<Site | null> {
  try {
    const site = await prisma.site.findUnique({
      where: { id },
    });
    
    if (!site) {
      logInfo('Site not found', { siteId: id });
      return null;
    }
    
    // Verify ownership (skip in development for easier testing)
    if (site.ownerId !== userId && process.env.NODE_ENV !== 'development') {
      logInfo('Site access denied - owner mismatch', { siteId: id, ownerId: site.ownerId, requestedUser: userId });
      return null;
    }
    
    return site as Site;
  } catch (error: any) {
    logError('Error getting site:', error);
    return null;
  }
}

export async function updateSite(id: string, userId: string, data: {
  name?: string;
  status?: string;
  customDomain?: string | null;
  repoUrl?: string | null;
  previewUrl?: string | null;
  vercelProjectId?: string | null;
  vercelDeploymentId?: string | null;
  chatHistory?: any[] | null;
  websiteContent?: any | null;
}): Promise<Site | null> {
  try {
    // Check ownership first
    const existing = await prisma.site.findUnique({ where: { id } });
    
    if (!existing) {
      logError('Site not found for update', { siteId: id });
      return null;
    }
    
    if (existing.ownerId !== userId && process.env.NODE_ENV !== 'development') {
      logError('Site update denied - owner mismatch', { siteId: id });
      return null;
    }
    
    const site = await prisma.site.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
    
    logInfo('Site updated', { siteId: id });
    return site as Site;
  } catch (error: any) {
    logError('Error updating site:', error);
    return null;
  }
}

export async function deleteSite(id: string, userId: string): Promise<Site | null> {
  try {
    const existing = await prisma.site.findUnique({ where: { id } });
    
    if (!existing) {
      logError('Site not found for deletion', { siteId: id });
      return null;
    }
    
    if (existing.ownerId !== userId) {
      logError('Site deletion denied - owner mismatch', { siteId: id });
      return null;
    }
    
    const site = await prisma.site.delete({ where: { id } });
    
    logInfo('Site deleted', { siteId: id });
    return site as Site;
  } catch (error: any) {
    logError('Error deleting site:', error);
    return null;
  }
}
