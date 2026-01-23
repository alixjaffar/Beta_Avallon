// CHANGELOG: 2026-01-22 - Switched to Firebase Firestore for persistent storage
import { logInfo, logError } from "@/lib/log";
import { db } from "@/lib/firebase-admin";

// Firestore collection name
const SITES_COLLECTION = 'sites';

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

export async function createSite(input: CreateSiteInput): Promise<Site> {
  try {
    const siteId = `site_${Date.now()}`;
    
    const newSite: Site = {
      id: siteId,
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
    
    // Save to Firestore
    await db.collection(SITES_COLLECTION).doc(siteId).set(newSite);
    
    logInfo('Site created in Firestore', { siteId: newSite.id, name: newSite.name });
    return newSite;
  } catch (error) {
    logError('Error creating site in Firestore:', error);
    throw error;
  }
}

export async function listSitesByUser(userId: string): Promise<Site[]> {
  try {
    const snapshot = await db.collection(SITES_COLLECTION)
      .where('ownerId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    const sites = snapshot.docs.map(doc => doc.data() as Site);
    
    logInfo('Sites listed from Firestore', { userId, count: sites.length });
    return sites;
  } catch (error: any) {
    // If index doesn't exist yet, fall back to unordered query
    if (error.code === 9 || error.message?.includes('index')) {
      logInfo('Firestore index not ready, using unordered query', { userId });
      try {
        const snapshot = await db.collection(SITES_COLLECTION)
          .where('ownerId', '==', userId)
          .get();
        
        const sites = snapshot.docs.map(doc => doc.data() as Site);
        // Sort in memory
        sites.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        logInfo('Sites listed from Firestore (unordered)', { userId, count: sites.length });
        return sites;
      } catch (innerError) {
        logError('Error listing sites from Firestore (fallback):', innerError);
        return [];
      }
    }
    logError('Error listing sites from Firestore:', error);
    return [];
  }
}

export async function getSiteById(id: string, userId: string): Promise<Site | null> {
  try {
    const doc = await db.collection(SITES_COLLECTION).doc(id).get();
    
    if (!doc.exists) {
      logInfo('Site not found in Firestore', { siteId: id });
      return null;
    }
    
    const site = doc.data() as Site;
    
    // Verify ownership (unless in development)
    if (site.ownerId !== userId && process.env.NODE_ENV !== 'development') {
      logInfo('Site found but owner mismatch', { siteId: id, ownerId: site.ownerId, requestedUser: userId });
      return null;
    }
    
    logInfo('Site retrieved from Firestore', { siteId: id, found: true });
    return site;
  } catch (error) {
    logError('Error getting site from Firestore:', error);
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
    const docRef = db.collection(SITES_COLLECTION).doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      logError('Site not found for update in Firestore', { siteId: id });
      return null;
    }
    
    const existingSite = doc.data() as Site;
    
    // Verify ownership (unless in development)
    if (existingSite.ownerId !== userId && process.env.NODE_ENV !== 'development') {
      logError('Site update denied - owner mismatch', { siteId: id, ownerId: existingSite.ownerId, requestedUser: userId });
      return null;
    }
    
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    await docRef.update(updateData);
    
    const updatedSite: Site = {
      ...existingSite,
      ...updateData,
    };
    
    logInfo('Site updated in Firestore', { siteId: id });
    return updatedSite;
  } catch (error) {
    logError('Error updating site in Firestore:', error);
    return null;
  }
}

export async function deleteSite(id: string, userId: string): Promise<Site | null> {
  try {
    const docRef = db.collection(SITES_COLLECTION).doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      logError('Site not found for deletion in Firestore', { siteId: id });
      return null;
    }
    
    const site = doc.data() as Site;
    
    // Verify ownership
    if (site.ownerId !== userId) {
      logError('Site deletion denied - owner mismatch', { siteId: id, ownerId: site.ownerId, requestedUser: userId });
      return null;
    }
    
    await docRef.delete();
    
    logInfo('Site deleted from Firestore', { siteId: id });
    return site;
  } catch (error) {
    logError('Error deleting site from Firestore:', error);
    return null;
  }
}
