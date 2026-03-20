/**
 * Stable user id derived from email (must match across checkout, webhooks, and credits file).
 */
export function getUserIdFromEmail(userEmail: string): string {
  return `user_${Buffer.from(userEmail).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 16)}`;
}
