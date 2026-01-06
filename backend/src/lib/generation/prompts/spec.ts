/**
 * Prompt template for generating SiteSpec from user prompt
 * Uses Gemini 3 Pro with structured JSON output
 */
import { SiteSpecSchema } from '../site-spec';

export function buildSpecGenerationPrompt(userPrompt: string, chatHistory?: any[]): string {
  const historyContext = chatHistory && chatHistory.length > 0
    ? `\nHISTORY:\n${chatHistory.slice(-3).map((msg: any) => `${msg.role}:${msg.content.substring(0, 150)}`).join('\n')}`
    : '';

  return `Generate SiteSpec JSON from user request. Return ONLY valid JSON, no markdown.

REQUEST: "${userPrompt}"${historyContext}

CRITICAL - Section types MUST be one of: hero, features, about, testimonials, pricing, faq, cta, contact, services, portfolio, team, stats, process, timeline, gallery, blog, products, cart, checkout, custom

EXAMPLE:
{"version":"1.0.0","project":{"name":"Business Name","slug":"business-name","description":"Description"},"brand":{"name":"Business Name","tagline":"Tagline","colors":{"primary":"#6366F1","secondary":"#7C3AED"},"fonts":{"heading":"Inter","body":"Inter"}},"pages":[{"id":"home","path":"/","title":"Home","description":"SEO description","sections":[{"id":"hero-1","type":"hero","title":"Main Title","subtitle":"Subtitle","order":0,"visible":true},{"id":"features-1","type":"features","title":"Our Features","order":1,"visible":true},{"id":"cta-1","type":"cta","title":"Get Started","order":2,"visible":true}],"seo":{"title":"SEO Title","description":"SEO Description","keywords":["keyword1","keyword2"]}}]}

RULES:
- Pages: Restaurant→home/about/menu/contact | E-commerce→home/products/about/contact | SaaS→home/about/features/pricing/contact | Default→home/about/services/contact
- Colors: Tech→#6366F1 | Food→#DC2626 | Health→#059669 | Finance→#1E40AF | Creative→#7C3AED | E-commerce→#0891B2
- Section types: ONLY use: hero, features, about, testimonials, pricing, faq, cta, contact, services, portfolio, team, stats, process, timeline, gallery, blog, products, cart, checkout, custom
- Each section MUST have: id, type (from list above), order, visible
- Stripe: Enable if mentions payment/stripe/checkout/buy/sell/ecommerce
- Return JSON only, start with {
`;
}
