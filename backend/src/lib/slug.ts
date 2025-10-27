// CHANGELOG: 2024-12-19 - Add slug utility for unique site slugs
// Temporarily using in-memory storage for testing

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function getUniqueSlug(baseSlug: string): Promise<string> {
  // For now, just return the base slug with a timestamp to ensure uniqueness
  return `${baseSlug}-${Date.now()}`;
}
