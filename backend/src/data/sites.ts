// CHANGELOG: Simple file-based storage for sites
import { logInfo, logError } from "@/lib/log";
import fs from 'fs';
import path from 'path';

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
  createdAt: string;
  updatedAt: string;
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

const SITES_FILE = path.join(process.cwd(), 'data', 'sites.json');

function ensureDataDir() {
  const dataDir = path.dirname(SITES_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function loadSites(): Site[] {
  ensureDataDir();
  if (!fs.existsSync(SITES_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(SITES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    logError('Error loading sites file:', error);
    return [];
  }
}

function saveSites(sites: Site[]): void {
  ensureDataDir();
  fs.writeFileSync(SITES_FILE, JSON.stringify(sites, null, 2));
}

export async function createSite(input: CreateSiteInput): Promise<Site> {
  const sites = loadSites();
  
  const now = new Date().toISOString();
  const site: Site = {
    id: `site_${Date.now()}`,
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
    createdAt: now,
    updatedAt: now,
  };
  
  sites.push(site);
  saveSites(sites);
  
  logInfo('Site created', { siteId: site.id, name: site.name });
  return site;
}

export async function listSitesByUser(userId: string): Promise<Site[]> {
  const sites = loadSites();
  const userSites = sites.filter(s => s.ownerId === userId);
  logInfo('Sites listed', { userId, count: userSites.length });
  return userSites;
}

export async function getSiteById(id: string, userId: string): Promise<Site | null> {
  const sites = loadSites();
  const site = sites.find(s => s.id === id);
  
  if (!site) {
    logInfo('Site not found', { siteId: id });
    return null;
  }
  
  // In development, allow any user to access any site
  if (site.ownerId !== userId && process.env.NODE_ENV !== 'development') {
    logInfo('Site found but owner mismatch', { siteId: id });
    return null;
  }
  
  return site;
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
  const sites = loadSites();
  const index = sites.findIndex(s => s.id === id);
  
  if (index === -1) {
    logError('Site not found for update', { siteId: id });
    return null;
  }
  
  // Verify ownership (unless in development)
  if (sites[index].ownerId !== userId && process.env.NODE_ENV !== 'development') {
    logError('Site update denied - owner mismatch', { siteId: id });
    return null;
  }
  
  sites[index] = {
    ...sites[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  saveSites(sites);
  logInfo('Site updated', { siteId: id });
  return sites[index];
}

export async function deleteSite(id: string, userId: string): Promise<Site | null> {
  const sites = loadSites();
  const index = sites.findIndex(s => s.id === id);
  
  if (index === -1) {
    logError('Site not found for deletion', { siteId: id });
    return null;
  }
  
  // Verify ownership
  if (sites[index].ownerId !== userId) {
    logError('Site deletion denied - owner mismatch', { siteId: id });
    return null;
  }
  
  const [deleted] = sites.splice(index, 1);
  saveSites(sites);
  
  logInfo('Site deleted', { siteId: id });
  return deleted;
}
