// Lovable Build with URL API Integration
// Documentation: https://docs.lovable.dev/api/build-with-url
import { applyToonStylePrompt } from './generation/prompt-utils';

export interface LovableUrlOptions {
  prompt: string;
  images?: string[]; // Max 10 image URLs
}

/**
 * Generate a Lovable Build with URL
 * Format: https://lovable.dev/?autosubmit=true#prompt=ENCODED_PROMPT&images=IMAGE_URL_1&images=IMAGE_URL_2
 * 
 * Note: Lovable uses hash (#) for parameters, so we manually construct the hash string
 */
export function generateLovableUrl(options: LovableUrlOptions): string {
  const baseUrl = 'https://lovable.dev/?autosubmit=true#';
  const styledPrompt = applyToonStylePrompt(options.prompt);
  
  // URL encode the prompt (max 50,000 characters)
  // encodeURIComponent handles special characters properly
  const encodedPrompt = encodeURIComponent(styledPrompt.substring(0, 50000));
  
  // Build hash parameters manually (since URLSearchParams uses ? not #)
  const hashParts: string[] = [];
  hashParts.push(`prompt=${encodedPrompt}`);
  
  // Add images if provided (max 10)
  if (options.images && options.images.length > 0) {
    const imageUrls = options.images.slice(0, 10); // Limit to 10 images
    imageUrls.forEach(imageUrl => {
      // Only encode the image URL, not double-encode
      hashParts.push(`images=${encodeURIComponent(imageUrl)}`);
    });
  }
  
  // Construct the full URL with hash parameters
  const hashParams = hashParts.join('&');
  return `${baseUrl}${hashParams}`;
}

/**
 * Build a comprehensive prompt from website generation parameters
 */
export function buildLovablePrompt(params: {
  description: string;
  name?: string;
  industry?: string;
  targetAudience?: string;
  style?: string;
  colorScheme?: string;
  layout?: string;
  complexity?: string;
  features?: string[];
  mode?: string;
}): string {
  let prompt = applyToonStylePrompt(params.description);
  
  // Add name if provided
  if (params.name) {
    prompt = `Create a website called "${params.name}". ${prompt}`;
  }
  
  // Add industry context
  if (params.industry) {
    prompt += ` Industry: ${params.industry}.`;
  }
  
  // Add target audience
  if (params.targetAudience) {
    prompt += ` Target audience: ${params.targetAudience}.`;
  }
  
  // Add design style
  if (params.style) {
    prompt += ` Design style: ${params.style} (modern, clean, professional).`;
  }
  
  // Add color scheme
  if (params.colorScheme) {
    prompt += ` Color scheme: ${params.colorScheme}.`;
  }
  
  // Add layout type
  if (params.layout) {
    prompt += ` Layout: ${params.layout}.`;
  }
  
  // Add complexity
  if (params.complexity) {
    prompt += ` Complexity level: ${params.complexity}.`;
  }
  
  // Add features
  if (params.features && params.features.length > 0) {
    prompt += ` Features to include: ${params.features.join(', ')}.`;
  }
  
  // Add mode-specific instructions
  if (params.mode === 'full') {
    prompt += ` Create a complete, production-ready website with all sections (hero, features, about, contact, footer).`;
  } else if (params.mode === 'landing') {
    prompt += ` Create a single-page landing page focused on conversion.`;
  }
  
  // Add quality requirements
  prompt += ` Requirements: Fully responsive, modern design, accessible, SEO optimized, fast performance. Use React/Next.js and Tailwind CSS.`;
  
  return prompt;
}
