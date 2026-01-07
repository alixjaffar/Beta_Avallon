// Encryption utility for storing sensitive data like n8n passwords
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

/**
 * Get encryption key from environment variable
 * In production, MUST set N8N_ENCRYPTION_KEY to a secure 32-byte key (base64 encoded)
 * Generate one with: openssl rand -base64 32
 */
function getEncryptionKey(): Buffer {
  const key = process.env.N8N_ENCRYPTION_KEY;
  if (key) {
    return Buffer.from(key, 'base64');
  }
  
  // In production, require the encryption key to be set
  if (process.env.NODE_ENV === 'production') {
    throw new Error('N8N_ENCRYPTION_KEY environment variable is required in production. Generate one with: openssl rand -base64 32');
  }
  
  // Development only: generate a deterministic key based on machine identifier
  // This is NOT secure for production but prevents accidental key exposure in code
  console.warn('⚠️  WARNING: Using development encryption key. Set N8N_ENCRYPTION_KEY for production.');
  const devSeed = `dev-${process.env.USER || 'default'}-${process.cwd()}`;
  return crypto.createHash('sha256').update(devSeed).digest();
}

/**
 * Encrypt a string value
 */
export function encrypt(text: string): string {
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    // Return format: iv:tag:encrypted
    return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
  } catch (error) {
    throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Decrypt a string value
 */
export function decrypt(encryptedText: string): string {
  try {
    const key = getEncryptionKey();
    const parts = encryptedText.split(':');
    
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const tag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}













