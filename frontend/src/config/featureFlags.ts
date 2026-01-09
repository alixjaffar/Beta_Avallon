// Feature flags for Avallon
// These flags control which features are enabled/disabled in the UI

export const FEATURE_FLAGS = {
  // Archived features (disabled but code kept for future use)
  ENABLE_AI_AGENTS: false,
  ENABLE_EMAIL_HOSTING: false,
  ENABLE_DOMAIN_HOSTING: false,
  
  // Active features
  ENABLE_WEBSITE_GENERATOR: true,
  ENABLE_VISUAL_EDITOR: true,
  ENABLE_INTEGRATIONS: true,
  ENABLE_BILLING: true,
  ENABLE_MULTI_PAGE: true,
  ENABLE_VERCEL_DEPLOY: true,
  ENABLE_GITHUB_DEPLOY: true,
} as const;

// Helper functions
export function isFeatureEnabled(feature: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[feature];
}

export function canAccessAgents(): boolean {
  return FEATURE_FLAGS.ENABLE_AI_AGENTS;
}

export function canAccessEmail(): boolean {
  return FEATURE_FLAGS.ENABLE_EMAIL_HOSTING;
}

export function canAccessDomains(): boolean {
  return FEATURE_FLAGS.ENABLE_DOMAIN_HOSTING;
}
