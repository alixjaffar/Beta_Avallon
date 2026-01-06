// CHANGELOG: 2025-01-15 - Enhanced file-based storage with better persistence
import { logInfo, logError } from "@/lib/log";

// Enhanced file-based storage for development
import * as fs from 'fs';
import * as path from 'path';

const SITES_FILE = path.join(process.cwd(), 'sites.json');
let sites: any[] = [];

// Load sites from file with better error handling
function loadSites() {
  try {
    if (fs.existsSync(SITES_FILE)) {
      const data = fs.readFileSync(SITES_FILE, 'utf8');
      sites = JSON.parse(data);
      logInfo('Sites loaded from file', { count: sites.length });
    } else {
      sites = [];
      logInfo('No sites file found, starting with empty array');
    }
  } catch (error) {
    logError('Error loading sites:', error);
    sites = [];
  }
}

// Save sites to file with atomic write
function saveSites() {
  try {
    const tempFile = SITES_FILE + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(sites, null, 2));
    fs.renameSync(tempFile, SITES_FILE);
    logInfo('Sites saved to file', { count: sites.length });
  } catch (error) {
    logError('Error saving sites:', error);
  }
}

// Initialize sites on module load
loadSites();

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

export async function createSite(input: CreateSiteInput) {
  try {
    // Use enhanced file-based storage
    const newSite = {
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    sites.push(newSite);
    saveSites();
    logInfo('Site created in file storage', { siteId: newSite.id, name: newSite.name });
    return newSite;
  } catch (error) {
    logError('Error creating site:', error);
    throw error;
  }
}

export async function listSitesByUser(userId: string) {
  try {
    // Reload sites from file to ensure we have latest data
    loadSites();
    const userSites = sites.filter(site => site.ownerId === userId);
    logInfo('Sites listed from file storage', { userId, count: userSites.length });
    return userSites;
  } catch (error) {
    logError('Error listing sites:', error);
    // Return empty array on error instead of throwing
    return [];
  }
}

export async function getSiteById(id: string, userId: string) {
  try {
    // First try to find by exact match
    let site = sites.find(site => site.id === id && site.ownerId === userId);
    
    // In development, fallback to finding by ID only
    if (!site && process.env.NODE_ENV === 'development') {
      site = sites.find(site => site.id === id);
      if (site) {
        logInfo('Site found by ID only (dev mode)', { siteId: id, actualOwner: site.ownerId, requestedUser: userId });
      }
    }
    
    logInfo('Site retrieved from file storage', { siteId: id, found: !!site });
    return site;
  } catch (error) {
    logError('Error getting site by ID:', error);
    return null;
  }
}

export async function updateSite(id: string, userId: string, data: {
  name?: string;
  status?: string;
  customDomain?: string;
  repoUrl?: string | null;
  previewUrl?: string | null;
  vercelProjectId?: string | null;
  vercelDeploymentId?: string | null;
  chatHistory?: any[] | null;
  websiteContent?: any | null;
}) {
  try {
    // First try to find by exact match
    let siteIndex = sites.findIndex(site => site.id === id && site.ownerId === userId);
    
    // In development, fallback to finding by ID only
    if (siteIndex === -1 && process.env.NODE_ENV === 'development') {
      siteIndex = sites.findIndex(site => site.id === id);
      if (siteIndex !== -1) {
        logInfo('Site found by ID only for update (dev mode)', { siteId: id });
      }
    }
    
    if (siteIndex === -1) {
      logError('Site not found for update', { siteId: id, userId });
      return null;
    }
    
    sites[siteIndex] = { 
      ...sites[siteIndex], 
      ...data, 
      updatedAt: new Date().toISOString() 
    };
    saveSites();
    logInfo('Site updated in file storage', { siteId: id });
    return sites[siteIndex];
  } catch (error) {
    logError('Error updating site:', error);
    return null;
  }
}

export async function deleteSite(id: string, userId: string) {
  try {
    const siteIndex = sites.findIndex(site => site.id === id && site.ownerId === userId);
    if (siteIndex === -1) {
      logError('Site not found for deletion', { siteId: id, userId });
      return null;
    }
    
    const deletedSite = sites.splice(siteIndex, 1)[0];
    
    // Also delete the generated website files
    try {
      const fs = require('fs');
      const path = require('path');
      const generatedDir = path.join(process.cwd(), 'generated-websites');
      
      // Find and delete project directories that match this site
      if (fs.existsSync(generatedDir)) {
        const projects = fs.readdirSync(generatedDir);
        for (const project of projects) {
          if (project.startsWith('project_')) {
            // Check if this project belongs to this site by checking previewUrl pattern
            const projectPath = path.join(generatedDir, project);
            if (deletedSite.previewUrl && deletedSite.previewUrl.includes(project)) {
              fs.rmSync(projectPath, { recursive: true, force: true });
              logInfo('Deleted project directory', { project, siteId: id });
            }
          }
        }
      }
    } catch (fileError) {
      logError('Error deleting project files:', fileError);
      // Continue even if file deletion fails
    }
    
    saveSites();
    logInfo('Site deleted from file storage', { siteId: id });
    return deletedSite;
  } catch (error) {
    logError('Error deleting site:', error);
    return null;
  }
}

