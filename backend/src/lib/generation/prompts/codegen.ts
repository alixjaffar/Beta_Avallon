/**
 * Prompt template for generating Next.js code from SiteSpec
 * Uses Gemini 3 Pro to generate structured file map
 */
import { SiteSpec } from '../site-spec';

export function buildCodegenPrompt(siteSpec: SiteSpec): string {
  // Compress spec JSON - remove whitespace to save tokens
  const specJson = JSON.stringify(siteSpec);
  
  // Handle integrations safely (could be array or object)
  const integrationsArray = Array.isArray(siteSpec.integrations) 
    ? siteSpec.integrations 
    : [];
  const hasStripe = integrationsArray.some(i => i.type === 'stripe' && i.enabled);
  const hasForm = integrationsArray.some(i => i.type === 'form' && i.enabled);
  
  const primaryColor = siteSpec.brand.colors.primary;
  const secondaryColor = siteSpec.brand.colors.secondary || 'N/A';
  const headingFont = siteSpec.brand.fonts.heading;
  const bodyFont = siteSpec.brand.fonts.body;

  return `Generate Next.js 14 App Router code from SiteSpec. Return JSON file map only.

SPEC:${specJson}

FILES: app/layout.tsx, app/page.tsx, app/[page]/page.tsx, components/sections/*.tsx (Hero/Features/About/Testimonials/Pricing/FAQ/CTA/Contact/Services/Portfolio/Team/Stats/Products), components/ui/*.tsx, components/navigation.tsx, components/footer.tsx, lib/utils.ts, tailwind.config.ts, package.json, tsconfig.json

TECH: Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui, mobile-first, SEO metadata, ARIA labels

STYLE: Colors ${primaryColor}/${secondaryColor}, Fonts ${headingFont}/${bodyFont}, Tailwind utilities, modern patterns

${hasStripe ? 'STRIPE: Add Stripe.js, init Stripe, payment buttons price_1SmG2l0Afn09g23QoCbGETau, handleStripeCheckout() → http://localhost:3000/api/stripe/checkout' : ''}
${hasForm ? 'FORMS: Contact forms with validation' : ''}

OUTPUT: {"path/to/file":"content",...} - Return JSON only, no markdown.
`;
}
