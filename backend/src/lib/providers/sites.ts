// CHANGELOG: 2025-10-10 - Add SiteProvider interface

export type GenerateSiteInput = {
  name: string;
  mode: "lovable" | "template";
};

export type GenerateSiteResult = {
  previewUrl?: string;
  repoUrl?: string;
};

export interface SiteProvider {
  generateSite(input: GenerateSiteInput): Promise<GenerateSiteResult>;
}


