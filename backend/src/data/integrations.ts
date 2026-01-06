// File-based storage for user integrations
// Bypasses database issues with Supabase connection pooling
import { logInfo, logError } from "@/lib/log";
import { encrypt, decrypt } from "@/lib/crypto";
import * as fs from 'fs';
import * as path from 'path';

const INTEGRATIONS_FILE = path.join(process.cwd(), 'integrations.json');

interface StoredIntegration {
  id: string;
  userId: string;
  provider: string;
  status: string;
  credentials: { encrypted: string }; // Encrypted credentials
  metadata?: any;
  connectedAt: string;
  lastUsedAt?: string;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
}

let integrations: StoredIntegration[] = [];

// Load integrations from file
function loadIntegrations() {
  try {
    if (fs.existsSync(INTEGRATIONS_FILE)) {
      const data = fs.readFileSync(INTEGRATIONS_FILE, 'utf8');
      integrations = JSON.parse(data);
      logInfo('Integrations loaded from file', { count: integrations.length });
    } else {
      integrations = [];
      logInfo('No integrations file found, starting with empty array');
    }
  } catch (error) {
    logError('Error loading integrations:', error);
    integrations = [];
  }
}

// Save integrations to file
function saveIntegrations() {
  try {
    const tempFile = INTEGRATIONS_FILE + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(integrations, null, 2));
    fs.renameSync(tempFile, INTEGRATIONS_FILE);
    logInfo('Integrations saved to file', { count: integrations.length });
  } catch (error) {
    logError('Error saving integrations:', error);
  }
}

// Initialize on module load
loadIntegrations();

export interface CreateIntegrationInput {
  userId: string;
  provider: string;
  credentials: Record<string, string>;
  metadata?: any;
}

// Create or update integration
export async function upsertIntegration(input: CreateIntegrationInput): Promise<StoredIntegration> {
  loadIntegrations(); // Reload to get latest
  
  const { userId, provider, credentials, metadata } = input;
  const now = new Date().toISOString();
  
  // Encrypt credentials
  const encryptedCredentials = encrypt(JSON.stringify(credentials));
  
  // Find existing integration
  const existingIndex = integrations.findIndex(
    i => i.userId === userId && i.provider === provider
  );
  
  const integration: StoredIntegration = {
    id: existingIndex >= 0 ? integrations[existingIndex].id : `int_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 9)}`,
    userId,
    provider,
    status: 'active',
    credentials: { encrypted: encryptedCredentials },
    metadata: metadata || {},
    connectedAt: now,
    lastError: undefined,
    createdAt: existingIndex >= 0 ? integrations[existingIndex].createdAt : now,
    updatedAt: now,
  };
  
  if (existingIndex >= 0) {
    integrations[existingIndex] = integration;
    logInfo('Integration updated', { userId, provider, id: integration.id });
  } else {
    integrations.push(integration);
    logInfo('Integration created', { userId, provider, id: integration.id });
  }
  
  saveIntegrations();
  return integration;
}

// Get all integrations for a user
export async function getIntegrationsByUser(userId: string): Promise<StoredIntegration[]> {
  loadIntegrations(); // Reload to get latest
  return integrations.filter(i => i.userId === userId);
}

// Get a specific integration
export async function getIntegration(userId: string, provider: string): Promise<StoredIntegration | null> {
  loadIntegrations();
  return integrations.find(i => i.userId === userId && i.provider === provider) || null;
}

// Get decrypted credentials for a user's integration
export async function getIntegrationCredentials(userId: string, provider: string): Promise<Record<string, string> | null> {
  const integration = await getIntegration(userId, provider);
  if (!integration) return null;
  
  try {
    const decrypted = decrypt(integration.credentials.encrypted);
    return JSON.parse(decrypted);
  } catch (error) {
    logError('Failed to decrypt integration credentials', error, { userId, provider });
    return null;
  }
}

// Delete integration
export async function deleteIntegration(userId: string, provider: string): Promise<boolean> {
  loadIntegrations();
  const initialLength = integrations.length;
  integrations = integrations.filter(i => !(i.userId === userId && i.provider === provider));
  
  if (integrations.length < initialLength) {
    saveIntegrations();
    logInfo('Integration deleted', { userId, provider });
    return true;
  }
  return false;
}

// Update integration metadata (e.g., lastUsedAt, lastError)
export async function updateIntegrationMeta(userId: string, provider: string, update: Partial<StoredIntegration>): Promise<boolean> {
  loadIntegrations();
  const index = integrations.findIndex(i => i.userId === userId && i.provider === provider);
  
  if (index >= 0) {
    integrations[index] = {
      ...integrations[index],
      ...update,
      updatedAt: new Date().toISOString(),
    };
    saveIntegrations();
    return true;
  }
  return false;
}

