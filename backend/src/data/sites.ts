// CHANGELOG: 2026-01-23 - Switched to PostgreSQL with Prisma for persistent storage
// CHANGELOG: 2026-02-04 - Added file-based fallback for database issues
import { logInfo, logError } from "@/lib/log";
import { prisma } from "@/lib/db";
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

// File-based storage as fallback
const SITES_DIR = join(process.cwd(), 'data', 'sites');

function ensureSitesDir() {
  if (!existsSync(SITES_DIR)) {
    mkdirSync(SITES_DIR, { recursive: true });
  }
}

function getSiteFilePath(id: string): string {
  return join(SITES_DIR, `${id}.json`);
}

function loadSiteFromFile(id: string): Site | null {
  try {
    const filePath = getSiteFilePath(id);
    if (existsSync(filePath)) {
      const data = readFileSync(filePath, 'utf-8');
      return JSON.parse(data) as Site;
    }
  } catch (error) {
    logError('Error loading site from file', error as Error);
  }
  return null;
}

function saveSiteToFile(site: Site): void {
  try {
    ensureSitesDir();
    const filePath = getSiteFilePath(site.id);
    writeFileSync(filePath, JSON.stringify(site, null, 2));
    logInfo('Site saved to file backup', { siteId: site.id });
  } catch (error) {
    logError('Error saving site to file', error as Error);
  }
}

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
    
    // Save to file as backup
    saveSiteToFile(site as Site);
    
    logInfo('Site created in PostgreSQL', { siteId: site.id, name: site.name });
    return site as Site;
  } catch (error: any) {
    logError('Error creating site in database', error);
    
    // Try file-based creation as fallback
    try {
      const fileBasedId = `site_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const fileSite: Site = {
        id: fileBasedId,
        ownerId: input.ownerId,
        name: input.name,
        slug: input.slug,
        status: input.status,
        repoUrl: input.repoUrl || null,
        previewUrl: input.previewUrl || null,
        vercelProjectId: input.vercelProjectId || null,
        vercelDeploymentId: input.vercelDeploymentId || null,
        chatHistory: input.chatHistory || [],
        websiteContent: input.websiteContent || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveSiteToFile(fileSite);
      logInfo('Site created in file storage (DB unavailable)', { siteId: fileSite.id });
      return fileSite;
    } catch (fileError) {
      throw new Error(`Failed to create site: ${error.message}`);
    }
  }
}

export async function listSitesByUser(userId: string): Promise<Site[]> {
  try {
    const sites = await prisma.site.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
    });
    
    // Also save these sites to file as backup
    for (const site of sites) {
      saveSiteToFile(site as Site);
    }
    
    logInfo('Sites listed', { userId, count: sites.length });
    return sites as Site[];
  } catch (error: any) {
    logError('Database error listing sites, trying file fallback', error);
    
    // Try to load from files if database fails
    try {
      ensureSitesDir();
      const files = readdirSync(SITES_DIR).filter((f: string) => f.endsWith('.json'));
      const sites: Site[] = [];
      for (const file of files) {
        const site = loadSiteFromFile(file.replace('.json', ''));
        if (site && site.ownerId === userId) {
          sites.push(site);
        }
      }
      logInfo('Sites listed from file backup', { userId, count: sites.length });
      return sites.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (fileError) {
      logError('Error listing sites from files', fileError as Error);
      return [];
    }
  }
}

export async function getSiteById(id: string, userId: string): Promise<Site | null> {
  try {
    const site = await prisma.site.findUnique({
      where: { id },
    });
    
    if (!site) {
      // Try file-based fallback
      logInfo('Site not in database, checking file storage', { siteId: id });
      const fileSite = loadSiteFromFile(id);
      if (fileSite) {
        // Verify ownership
        if (fileSite.ownerId !== userId && process.env.NODE_ENV !== 'development') {
          logInfo('Site access denied - owner mismatch (file)', { siteId: id });
          return null;
        }
        logInfo('Site loaded from file backup', { siteId: id });
        return fileSite;
      }
      logInfo('Site not found in database or file storage', { siteId: id });
      return null;
    }
    
    // Verify ownership (skip in development for easier testing)
    if (site.ownerId !== userId && process.env.NODE_ENV !== 'development') {
      logInfo('Site access denied - owner mismatch', { siteId: id, ownerId: site.ownerId, requestedUser: userId });
      return null;
    }
    
    // Save to file as backup
    saveSiteToFile(site as Site);
    
    return site as Site;
  } catch (error: any) {
    logError('Database error getting site, trying file fallback', error);
    
    // Try file-based fallback on database error
    const fileSite = loadSiteFromFile(id);
    if (fileSite) {
      if (fileSite.ownerId !== userId && process.env.NODE_ENV !== 'development') {
        return null;
      }
      logInfo('Site loaded from file backup after DB error', { siteId: id });
      return fileSite;
    }
    
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
    
    // Build update data with proper Prisma JSON handling
    const updateData: any = { updatedAt: new Date() };
    if (data.name !== undefined) updateData.name = data.name;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.customDomain !== undefined) updateData.customDomain = data.customDomain;
    if (data.repoUrl !== undefined) updateData.repoUrl = data.repoUrl;
    if (data.previewUrl !== undefined) updateData.previewUrl = data.previewUrl;
    if (data.vercelProjectId !== undefined) updateData.vercelProjectId = data.vercelProjectId;
    if (data.vercelDeploymentId !== undefined) updateData.vercelDeploymentId = data.vercelDeploymentId;
    if (data.chatHistory !== undefined) updateData.chatHistory = data.chatHistory ?? [];
    if (data.websiteContent !== undefined) updateData.websiteContent = data.websiteContent ?? {};
    
    const site = await prisma.site.update({
      where: { id },
      data: updateData,
    });
    
    // Save to file as backup
    saveSiteToFile(site as Site);
    
    logInfo('Site updated', { siteId: id });
    return site as Site;
  } catch (error: any) {
    logError('Error updating site in database', error);
    
    // Try to update file backup if database fails
    const fileSite = loadSiteFromFile(id);
    if (fileSite && (fileSite.ownerId === userId || process.env.NODE_ENV === 'development')) {
      const updatedSite = { ...fileSite, ...data, updatedAt: new Date().toISOString() };
      saveSiteToFile(updatedSite as Site);
      logInfo('Site updated in file backup (DB unavailable)', { siteId: id });
      return updatedSite as Site;
    }
    
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
