// CHANGELOG: 2026-01-22 - Switched to PostgreSQL with Prisma for persistent storage
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
    // Generate a unique slug if it already exists
    let slug = input.slug;
    let slugExists = true;
    let attempts = 0;
    
    while (slugExists && attempts < 10) {
      try {
        const existing = await prisma.site.findUnique({ where: { slug } });
        if (!existing) {
          slugExists = false;
        } else {
          slug = `${input.slug}-${Date.now()}`;
          attempts++;
        }
      } catch (e) {
        slugExists = false;
      }
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
    logError('Error creating site in PostgreSQL:', error);
    throw error;
  }
}

export async function listSitesByUser(userId: string): Promise<Site[]> {
  try {
    const sites = await prisma.site.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
    });
    
    logInfo('Sites listed from PostgreSQL', { userId, count: sites.length });
    return sites as Site[];
  } catch (error) {
    logError('Error listing sites from PostgreSQL:', error);
    return [];
  }
}

export async function getSiteById(id: string, userId: string): Promise<Site | null> {
  try {
    const site = await prisma.site.findUnique({
      where: { id },
    });
    
    if (!site) {
      logInfo('Site not found in PostgreSQL', { siteId: id });
      return null;
    }
    
    // Verify ownership (unless in development)
    if (site.ownerId !== userId && process.env.NODE_ENV !== 'development') {
      logInfo('Site found but owner mismatch', { siteId: id, ownerId: site.ownerId, requestedUser: userId });
      return null;
    }
    
    logInfo('Site retrieved from PostgreSQL', { siteId: id, found: true });
    return site as Site;
  } catch (error) {
    logError('Error getting site from PostgreSQL:', error);
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
    // First check if the site exists and belongs to the user
    const existingSite = await prisma.site.findUnique({
      where: { id },
    });
    
    if (!existingSite) {
      logError('Site not found for update in PostgreSQL', { siteId: id });
      return null;
    }
    
    // Verify ownership (unless in development)
    if (existingSite.ownerId !== userId && process.env.NODE_ENV !== 'development') {
      logError('Site update denied - owner mismatch', { siteId: id, ownerId: existingSite.ownerId, requestedUser: userId });
      return null;
    }
    
    const site = await prisma.site.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
    
    logInfo('Site updated in PostgreSQL', { siteId: id });
    return site as Site;
  } catch (error) {
    logError('Error updating site in PostgreSQL:', error);
    return null;
  }
}

export async function deleteSite(id: string, userId: string): Promise<Site | null> {
  try {
    // First check if the site exists and belongs to the user
    const existingSite = await prisma.site.findUnique({
      where: { id },
    });
    
    if (!existingSite) {
      logError('Site not found for deletion in PostgreSQL', { siteId: id });
      return null;
    }
    
    // Verify ownership
    if (existingSite.ownerId !== userId) {
      logError('Site deletion denied - owner mismatch', { siteId: id, ownerId: existingSite.ownerId, requestedUser: userId });
      return null;
    }
    
    const site = await prisma.site.delete({
      where: { id },
    });
    
    logInfo('Site deleted from PostgreSQL', { siteId: id });
    return site as Site;
  } catch (error) {
    logError('Error deleting site from PostgreSQL:', error);
    return null;
  }
}
