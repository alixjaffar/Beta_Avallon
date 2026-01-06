/**
 * SiteSpec Schema - Structured website specification
 * This is the deterministic JSON structure that drives code generation
 */
import { z } from 'zod';

// Brand/Design System
export const BrandSchema = z.object({
  name: z.string(),
  tagline: z.string().optional(),
  colors: z.object({
    primary: z.string(), // hex color
    secondary: z.string().optional(),
    accent: z.string().optional(),
    background: z.string().optional(),
    text: z.string().optional(),
    muted: z.string().optional(),
  }),
  fonts: z.object({
    heading: z.string().default('Inter'),
    body: z.string().default('Inter'),
  }),
  logo: z.string().optional(), // URL or placeholder
});

// Section Types
export const SectionTypeSchema = z.enum([
  'hero',
  'features',
  'about',
  'testimonials',
  'pricing',
  'faq',
  'cta',
  'contact',
  'services',
  'portfolio',
  'team',
  'stats',
  'process',
  'timeline',
  'gallery',
  'blog',
  'products',
  'cart',
  'checkout',
  'custom',
]);

// Section Schema
export const SectionSchema = z.object({
  id: z.string(), // unique identifier
  type: SectionTypeSchema,
  title: z.string().optional(),
  subtitle: z.string().optional(),
  content: z.union([z.record(z.any()), z.string(), z.null()]).optional(), // flexible content structure
  props: z.record(z.any()).optional(), // component props
  order: z.number().default(0),
  visible: z.boolean().default(true),
});

// Page Schema
export const PageSchema = z.object({
  id: z.string(), // e.g., 'home', 'about', 'services'
  path: z.string(), // e.g., '/', '/about', '/services'
  title: z.string(),
  description: z.string().optional(), // SEO meta description
  sections: z.array(SectionSchema),
  layout: z.enum(['default', 'full-width', 'sidebar', 'split']).default('default'),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }).optional(),
});

// Component Schema (reusable components)
export const ComponentSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(), // 'button', 'card', 'form', 'navigation', etc.
  props: z.record(z.any()),
  styles: z.record(z.string()).optional(), // custom CSS
});

// Asset Schema
export const AssetSchema = z.object({
  id: z.string(),
  type: z.enum(['image', 'icon', 'video', 'document']),
  url: z.string(), // placeholder URL or actual URL
  alt: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  context: z.string().optional(), // where it's used
});

// Integration Schema
export const IntegrationSchema = z.object({
  type: z.enum(['stripe', 'form', 'email', 'analytics', 'chat']),
  enabled: z.boolean().default(false),
  config: z.record(z.any()).optional(), // integration-specific config
});

// Main SiteSpec Schema
export const SiteSpecSchema = z.object({
  version: z.string().default('1.0.0'),
  project: z.object({
    name: z.string(),
    slug: z.string(),
    description: z.string().optional(),
  }),
  brand: BrandSchema,
  pages: z.array(PageSchema),
  components: z.record(ComponentSchema).optional(), // map of reusable components
  assets: z.array(AssetSchema).optional(),
  integrations: z.union([z.array(IntegrationSchema), z.record(z.any())]).optional(), // array or object (flexible)
  metadata: z.object({
    generatedAt: z.string(),
    generator: z.string().default('avallon-gemini-3-pro'),
    prompt: z.string().optional(), // original user prompt
  }).optional(),
});

export type SiteSpec = z.infer<typeof SiteSpecSchema>;
export type Brand = z.infer<typeof BrandSchema>;
export type Page = z.infer<typeof PageSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type Component = z.infer<typeof ComponentSchema>;
export type Asset = z.infer<typeof AssetSchema>;
export type Integration = z.infer<typeof IntegrationSchema>;
