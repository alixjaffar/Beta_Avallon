// CHANGELOG: 2025-01-15 - Gemini AI website generation (based on open-source AI Website Builder)
// Reference: https://github.com/Ratna-Babu/Ai-Website-Builder
import axios from 'axios';
import { logError, logInfo } from '@/lib/log';

// Ensure environment variables are loaded
if (typeof process !== 'undefined' && process.env) {
  require('dotenv').config();
}

export interface WebsiteGenerationRequest {
  name: string;
  description: string;
  mode: 'full' | 'landing' | 'blog' | 'ecommerce';
}

export interface GeneratedWebsite {
  id: string;
  name: string;
  slug: string;
  status: 'generating' | 'deployed' | 'failed';
  previewUrl?: string;
  repoUrl?: string;
  files: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export class GeminiWebsiteGenerator {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    // Get API key, removing quotes if present
    const apiKey = process.env.GEMINI_API_KEY || '';
    this.apiKey = apiKey.replace(/^["']|["']$/g, '').trim();
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
    
    if (!this.apiKey) {
      logError('Gemini API key not configured', undefined, {
        hasGeminiKey: !!process.env.GEMINI_API_KEY
      });
    }
  }

  async generateWebsite(request: WebsiteGenerationRequest, chatHistory?: any[], currentCode?: Record<string, string>): Promise<GeneratedWebsite> {
    try {
      logInfo('Starting Gemini website generation', { 
        request: JSON.stringify(request),
        hasCurrentCode: !!currentCode,
        currentCodeKeys: currentCode ? Object.keys(currentCode) : [],
        chatHistoryLength: chatHistory?.length || 0
      });

      // Step 1: Generate website code using Gemini (modify if currentCode exists, otherwise generate new)
      const websiteCode = await this.generateWebsiteCode(request, chatHistory, currentCode);
      
      // Step 2: Save website files locally
      const localPath = await this.saveWebsiteLocally(request.name, websiteCode);
      logInfo('Website saved locally', { localPath });
      
      // Set local preview URL specific to this project
      const websiteSlug = request.name.toLowerCase().replace(/\s+/g, '-');
      const projectId = `project_${Date.now()}`;
      const previewUrl = `http://localhost:3001/${projectId}`;
      const repoUrl = null;

      const website: GeneratedWebsite = {
        id: `site_${Date.now()}`,
        name: request.name,
        slug: websiteSlug,
        status: 'deployed',
        previewUrl,
        repoUrl: repoUrl || undefined,
        files: websiteCode,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      logInfo('Website generation completed', { name: request.name, previewUrl, repoUrl });
      return website;

    } catch (error) {
      logError('Website generation failed', error);
      throw error;
    }
  }

  private async generateWebsiteCode(request: WebsiteGenerationRequest, chatHistory?: any[], currentCode?: Record<string, string>): Promise<Record<string, string>> {
    const prompt = this.buildWebsitePrompt(request, chatHistory, currentCode);
    
    // Try models in order: gemini-2.5-flash (stable, better free tier), then gemini-2.0-flash-exp
    // IMPORTANT: gemini-2.5-flash is stable and has better free tier limits
    // Note: gemini-1.5-flash is not available in v1beta API
    const models = ['gemini-2.5-flash', 'gemini-2.0-flash-exp'];
    let lastError: any = null;
    
    for (const model of models) {
      try {
        logInfo('Calling Gemini API with model', { model });
        
        const response = await axios.post(
          `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`,
          {
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 8192, // Gemini supports up to 8192 tokens
            }
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 120000 // 2 minute timeout
          }
        );

        // Check if response has candidates
        if (!response.data.candidates || response.data.candidates.length === 0) {
          logError('Gemini API returned no candidates', undefined, { responseData: response.data });
          throw new Error('Gemini API returned no content. Response: ' + JSON.stringify(response.data));
        }
        
        const candidate = response.data.candidates[0];
        if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
          logError('Gemini API candidate has no content', undefined, { candidate });
          throw new Error('Gemini API candidate has no content parts');
        }
        
        const content = candidate.content.parts[0].text;
        if (!content) {
          logError('Gemini API content is empty', undefined, { candidate });
          throw new Error('Gemini API returned empty content');
        }
        
        logInfo('Gemini response received', { model, contentLength: content.length, contentPreview: content.substring(0, 200) });
        return this.parseGeneratedCode(content);
      } catch (error: any) {
        lastError = error;
        const status = error.response?.status;
        const errorCode = error.response?.data?.error?.code;
        
        // If quota exceeded (429) or resource exhausted, try next model
        if (status === 429 || errorCode === 429 || errorCode === 'RESOURCE_EXHAUSTED') {
          logInfo(`Model ${model} quota exceeded, trying next model`, { model, status, errorCode });
          continue; // Try next model
        }
        
        // If authentication error, don't try other models
        if (status === 401 || status === 403) {
          throw new Error(`Gemini API authentication failed. Please check your API key. Status: ${status}`);
        }
        
        // For other errors, try next model
        logInfo(`Model ${model} failed, trying next model`, { model, status, error: error.message });
        continue;
      }
    }
    
    // If we get here, all models failed
    logError('All Gemini models failed', lastError, {
      modelsTried: models,
      lastStatus: lastError?.response?.status,
      lastErrorCode: lastError?.response?.data?.error?.code,
      lastMessage: lastError?.response?.data?.error?.message
    });
    
    const errorMessage = lastError?.response?.data?.error?.message || lastError?.message || 'Unknown error';
    const status = lastError?.response?.status;
    
    // Provide helpful error messages
    if (status === 400 && (errorMessage?.toLowerCase().includes('expired') || errorMessage?.toLowerCase().includes('invalid'))) {
      throw new Error(`Gemini API key expired or invalid. Please get a new key from https://aistudio.google.com/apikey and update GEMINI_API_KEY in your backend/.env file. Error: ${errorMessage}`);
    }
    if (status === 401 || status === 403) {
      throw new Error(`Gemini API authentication failed. Please check your API key is valid and update GEMINI_API_KEY in your backend/.env file. Error: ${errorMessage}`);
    }
    if (status === 429 || lastError?.response?.data?.error?.code === 429) {
      throw new Error(`Gemini API quota exceeded. ${errorMessage}. Please check your billing/quota at https://ai.google.dev/`);
    }
    
    throw new Error(`Gemini API failed with all models: ${errorMessage}`);
  }

  private buildWebsitePrompt(request: WebsiteGenerationRequest, chatHistory?: any[], currentCode?: Record<string, string>): string {
    const originalPrompt = request.description;
    const chatContext = chatHistory ? this.buildChatContext(chatHistory) : '';
    const isModification = !!currentCode && Object.keys(currentCode).length > 0;
    const currentCodeContext = isModification ? this.buildCurrentCodeContext(currentCode) : '';
    
    // Premium, modern website generation prompt - matching top-tier design quality
    const basePrompt = isModification 
      ? `You are an elite web developer modifying an existing website. The user wants to make changes to their current website. MODIFY the existing code based on the user's request: "${originalPrompt}"

${currentCodeContext}

${chatContext}

**CRITICAL INSTRUCTIONS FOR MODIFICATIONS:**
- You MUST preserve the existing website structure, layout, and content
- Only modify what the user specifically requested
- Keep all existing sections, styles, and functionality unless explicitly asked to remove them
- Maintain the same design system, color scheme, and overall aesthetic
- Update only the parts mentioned in the user's request and chat history
- If the user asks to "change the color to X", update the color scheme but keep everything else the same
- If the user asks to "change the text", update only the text content, not the layout
- If the user asks to "add a section", add it while preserving all existing sections
- DO NOT regenerate the entire website from scratch - only modify what's requested

🎯 DESIGN REQUIREMENTS (Premium Quality):`
      : `You are an elite web developer creating a world-class, modern website. Generate a stunning, professional website based on: "${originalPrompt}"

${chatContext}

🎯 DESIGN REQUIREMENTS (Premium Quality):`;
    
    return `${basePrompt}

**Modern Design System:**
- Use vibrant, modern color palettes (gradients, bold colors, not boring)
- Glassmorphism effects: backdrop-filter blur, semi-transparent backgrounds
- Smooth micro-animations and transitions (hover effects, scroll animations)
- Modern typography: Large, bold headlines (3-5rem), clean body text
- Generous white space and modern spacing (8px grid system)
- Premium shadows and depth (multi-layer shadows)
- Modern border radius (12px, 16px, 24px for cards)

**Color Palette:**
- Use vibrant gradients (purple-to-pink, blue-to-cyan, orange-to-red, etc.)
- Modern color combinations (not just blue/gray)
- High contrast for readability
- Accent colors for CTAs and highlights

**Layout & Structure:**
- Hero section: Full viewport height (100vh) with large headline, compelling subheadline, and prominent CTAs
- Features/Services: Modern grid layout (3 columns desktop, responsive)
- About section: Two-column layout with image and compelling copy
- Testimonials: Modern card-based layout
- Contact form: Clean, modern form with smooth interactions
- Footer: Dark background with organized links and social icons

**Modern UI Elements:**
- Large, prominent buttons with gradients and hover effects
- Modern cards with hover animations (lift, scale, shadow)
- Smooth scroll animations (fade in, slide up)
- Interactive elements with micro-animations
- Modern icons (use Font Awesome or emoji)
- Glassmorphism navigation bar (sticky, blurred background)

**Responsive Design:**
- Mobile-first approach
- Breakpoints: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)
- Touch-friendly buttons (min 44x44px)
- Hamburger menu for mobile
- Stack sections vertically on mobile

**Content Quality:**
- Real, specific content (not generic placeholders)
- Compelling headlines with power words
- Clear value propositions
- Professional copywriting
- Social proof elements

**Technical Excellence:**
- Semantic HTML5
- Modern CSS (CSS Grid, Flexbox, CSS Variables)
- Smooth animations (CSS transitions, transforms)
- Performance optimized
- Accessible (ARIA labels, keyboard navigation)
- SEO optimized (meta tags, semantic structure)

**IMPORTANT - External Resources:**
- Use Font Awesome 6.4.0 (NO integrity check): <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  * DO NOT use integrity="sha512-..." attribute - it causes errors
  * Use the simple link tag without integrity checks
- For images, ALWAYS use FULL URLs:
  * Placeholder images: https://via.placeholder.com/800x600/6366f1/ffffff?text=Image
  * Unsplash images: https://images.unsplash.com/photo-1554971672-091448c99a35?w=800&h=600&fit=crop
  * Picsum images: https://picsum.photos/800/600
  * DO NOT use partial URLs like "photo-1554971672" - ALWAYS include the full domain
- Use Google Fonts: https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap
- DO NOT use broken image URLs or invalid CDN links
- If you need an image, use: https://picsum.photos/800/600 (always works)

Generate a single, complete HTML file with ALL CSS and JavaScript inline. The website must look like a $10,000+ premium website - modern, vibrant, and professional.

IMPORTANT: Return ONLY the HTML code wrapped in \`\`\`html code block. Start with <!DOCTYPE html> and include everything needed for a complete, beautiful website.`;

  }

  private buildChatContext(chatHistory: any[]): string {
    if (!chatHistory || chatHistory.length === 0) return '';
    
    const userMessages = chatHistory.filter(msg => msg.role === 'user');
    const assistantMessages = chatHistory.filter(msg => msg.role === 'assistant');
    
    let context = '\nCHAT HISTORY CONTEXT:\n';
    context += `- Original request: "${userMessages[0]?.content || 'Not available'}"\n`;
    
    if (userMessages.length > 1) {
      context += '- Recent user requests:\n';
      userMessages.slice(1).forEach((msg, index) => {
        context += `  ${index + 1}. "${msg.content}"\n`;
      });
    }
    
    if (assistantMessages.length > 0) {
      context += '- Previous AI responses:\n';
      assistantMessages.slice(-3).forEach((msg, index) => {
        context += `  ${index + 1}. "${msg.content.substring(0, 100)}..."\n`;
      });
    }
    
    return context;
  }

  private buildCurrentCodeContext(currentCode: Record<string, string>): string {
    if (!currentCode || Object.keys(currentCode).length === 0) return '';
    
    let context = '\n\n**CURRENT WEBSITE CODE:**\n';
    context += 'Here is the existing website code that you MUST modify (do not regenerate from scratch):\n\n';
    
    // Include index.html if it exists (most important)
    if (currentCode['index.html']) {
      const htmlContent = currentCode['index.html'];
      // Truncate if too long (keep first 8000 chars to stay within token limits)
      const truncatedHtml = htmlContent.length > 8000 
        ? htmlContent.substring(0, 8000) + '\n\n... (code truncated, but preserve the structure above)'
        : htmlContent;
      
      context += '```html\n';
      context += truncatedHtml;
      context += '\n```\n';
    }
    
    // Include other files if they exist
    const otherFiles = Object.keys(currentCode).filter(key => key !== 'index.html');
    if (otherFiles.length > 0) {
      context += '\n**Other files:**\n';
      otherFiles.forEach(filename => {
        const content = currentCode[filename];
        const truncatedContent = content.length > 2000 
          ? content.substring(0, 2000) + '\n... (truncated)'
          : content;
        context += `\n**${filename}:**\n\`\`\`\n${truncatedContent}\n\`\`\`\n`;
      });
    }
    
    context += '\n**IMPORTANT:** Modify ONLY the parts requested by the user. Keep everything else exactly as it is.\n';
    
    return context;
  }

  private parseGeneratedCode(content: string): Record<string, string> {
    const files: Record<string, string> = {};
    
    // Clean the content first - remove any leading/trailing markdown markers
    let cleanedContent = content.trim();
    
    // First, try to find file: prefix blocks
    const filePattern = /```file:([^\n]+)\n([\s\S]*?)```/g;
    let match;
    
    while ((match = filePattern.exec(cleanedContent)) !== null) {
      const filename = match[1].trim();
      let fileContent = match[2].trim();
      // Remove any remaining markdown markers
      fileContent = fileContent.replace(/^```[a-z]*\s*\n?/gm, '').replace(/\n?```$/gm, '');
      files[filename] = fileContent;
    }
    
    // If no file: blocks found, try to extract HTML from markdown code blocks
    if (Object.keys(files).length === 0) {
      // Try ```html or ``` code blocks - match the content inside, not the markers
      const htmlPattern = /```(?:html)?\s*\n?([\s\S]*?)```/g;
      let htmlMatch;
      let foundHtml = false;
      
      while ((htmlMatch = htmlPattern.exec(cleanedContent)) !== null) {
        let htmlContent = htmlMatch[1].trim();
        // Remove any nested code block markers that might be in the content
        htmlContent = htmlContent.replace(/^```[a-z]*\s*\n?/gm, '').replace(/\n?```$/gm, '');
        
        // Check if it looks like HTML
        if (htmlContent.includes('<!DOCTYPE') || htmlContent.includes('<html') || htmlContent.includes('<body')) {
          files['index.html'] = htmlContent;
          foundHtml = true;
          break;
        }
      }
      
      // If still no HTML found, check if the entire content is HTML (without code blocks)
      if (!foundHtml) {
        let trimmedContent = cleanedContent.trim();
        // Remove code block markers if present
        trimmedContent = trimmedContent.replace(/^```[a-z]*\s*\n?/gm, '').replace(/\n?```$/gm, '');
        
        if (trimmedContent.includes('<!DOCTYPE') || trimmedContent.includes('<html') || trimmedContent.includes('<body')) {
          files['index.html'] = trimmedContent;
        } else {
          // Log the actual response for debugging
          logError('Failed to parse HTML from Gemini response', new Error('No HTML found'), {
            contentLength: content.length,
            contentPreview: content.substring(0, 500),
            hasCodeBlocks: content.includes('```'),
            hasHtmlTags: content.includes('<html') || content.includes('<!DOCTYPE')
          });
          throw new Error('Gemini did not generate valid HTML. Response: ' + content.substring(0, 200));
        }
      }
    }
    
    // Ensure we have index.html and clean it
    if (!files['index.html']) {
      logError('No index.html found in parsed files', new Error('Parsing failed'), {
        filesFound: Object.keys(files),
        contentLength: content.length,
        contentPreview: content.substring(0, 300)
      });
      throw new Error('Failed to extract HTML from Gemini response');
    }
    
    // Final cleanup: ensure no markdown markers remain
    let finalHtml = files['index.html'];
    // Remove any remaining ``` markers
    finalHtml = finalHtml.replace(/^```[a-z]*\s*\n?/gm, '').replace(/\n?```$/gm, '');
    // Remove any leading/trailing whitespace
    finalHtml = finalHtml.trim();
    
    // Fix broken image URLs - replace partial Unsplash URLs with full URLs
    finalHtml = this.fixImageUrls(finalHtml);
    
    // Fix Font Awesome integrity check errors - remove integrity attributes
    finalHtml = this.fixFontAwesomeLinks(finalHtml);
    
    // Validate it's actually HTML
    if (!finalHtml.includes('<!DOCTYPE') && !finalHtml.includes('<html') && !finalHtml.includes('<body')) {
      logError('Parsed content does not look like HTML', new Error('Invalid HTML'), {
        contentPreview: finalHtml.substring(0, 200)
      });
      throw new Error('Parsed content is not valid HTML');
    }
    
    files['index.html'] = finalHtml;
    
    logInfo('Parsed generated code', { 
      files: Object.keys(files), 
      totalFiles: Object.keys(files).length,
      htmlLength: finalHtml.length,
      htmlPreview: finalHtml.substring(0, 100)
    });
    return files;
  }

  private fixImageUrls(html: string): string {
    // Fix broken Unsplash URLs that are missing the domain
    // Pattern: photo-XXXXXXXX-XXXXXXXX (without https://images.unsplash.com/)
    // This handles cases like: src="photo-1554971672-091448c99a35"
    const brokenUnsplashPattern = /src=["'](photo-\d+-\d+[^"']*)["']/gi;
    html = html.replace(brokenUnsplashPattern, (match, photoId) => {
      // Extract just the photo ID part (remove any query params that might be there)
      const cleanPhotoId = photoId.split('?')[0].split('&')[0];
      const fixedUrl = `https://images.unsplash.com/${cleanPhotoId}?w=800&h=600&fit=crop`;
      logInfo('Fixed broken Unsplash URL', { original: photoId, fixed: fixedUrl });
      return `src="${fixedUrl}"`;
    });
    
    // Also fix URLs in quotes that are just photo IDs
    const brokenQuotedPattern = /(["'])(photo-\d+-\d+[^"']*)(["'])/g;
    html = html.replace(brokenQuotedPattern, (match, quote1, photoId, quote2) => {
      const cleanPhotoId = photoId.split('?')[0].split('&')[0];
      const fixedUrl = `https://images.unsplash.com/${cleanPhotoId}?w=800&h=600&fit=crop`;
      logInfo('Fixed broken quoted Unsplash URL', { original: photoId, fixed: fixedUrl });
      return `${quote1}${fixedUrl}${quote2}`;
    });
    
    // Fix any src attributes that are just photo IDs without proper URL
    // Handle cases where src might be just the photo ID
    const brokenSrcPattern = /src=["']([^"']*photo-\d+-\d+[^"']*)["']/gi;
    html = html.replace(brokenSrcPattern, (match, url) => {
      // If it doesn't start with http:// or https://, it's broken
      if (!url.match(/^https?:\/\//)) {
        const cleanPhotoId = url.split('?')[0].split('&')[0];
        const fixedUrl = `https://images.unsplash.com/${cleanPhotoId}?w=800&h=600&fit=crop`;
        logInfo('Fixed broken src URL', { original: url, fixed: fixedUrl });
        return `src="${fixedUrl}"`;
      }
      return match;
    });
    
    // Replace any remaining broken image references with a working placeholder
    // Look for src attributes that don't start with http:// or https:// or / or data:
    const brokenImagePattern = /src=["'](?!https?:\/\/|data:|\.\/|\/|#)([^"']+)["']/g;
    html = html.replace(brokenImagePattern, (match, brokenUrl) => {
      // If it looks like a photo ID, use Unsplash
      if (brokenUrl.match(/^photo-\d+-\d+/)) {
        const cleanPhotoId = brokenUrl.split('?')[0].split('&')[0];
        const fixedUrl = `https://images.unsplash.com/${cleanPhotoId}?w=800&h=600&fit=crop`;
        logInfo('Fixed broken image URL', { original: brokenUrl, fixed: fixedUrl });
        return `src="${fixedUrl}"`;
      }
      // Otherwise use a placeholder service
      const fixedUrl = `https://picsum.photos/800/600`;
      logInfo('Replaced broken image URL with placeholder', { original: brokenUrl, fixed: fixedUrl });
      return `src="${fixedUrl}"`;
    });
    
    return html;
  }

  private fixFontAwesomeLinks(html: string): string {
    // Remove integrity attributes from Font Awesome links to prevent integrity check errors
    // Pattern: <link ... href="...font-awesome..." integrity="sha512-..." ...>
    const fontAwesomePattern = /(<link[^>]*href=["'][^"']*font-awesome[^"']*["'][^>]*)(\s+integrity=["'][^"']*["'])([^>]*>)/gi;
    html = html.replace(fontAwesomePattern, (match, before, integrity, after) => {
      // Remove the integrity attribute
      return before + after;
    });
    
    // Also handle crossorigin attributes that might be paired with integrity
    const fontAwesomeWithCrossorigin = /(<link[^>]*href=["'][^"']*font-awesome[^"']*["'][^>]*)(\s+crossorigin=["'][^"']*["'])([^>]*>)/gi;
    html = html.replace(fontAwesomeWithCrossorigin, (match, before, crossorigin, after) => {
      // Keep crossorigin but ensure no integrity
      if (!before.includes('integrity')) {
        return match; // Keep as is if no integrity
      }
      // Remove both integrity and crossorigin if integrity exists
      return before.replace(/\s+integrity=["'][^"']*["']/gi, '') + after;
    });
    
    logInfo('Fixed Font Awesome links', { removedIntegrity: html.includes('font-awesome') && !html.match(/font-awesome[^>]*integrity/gi) });
    
    return html;
  }

  private async saveWebsiteLocally(name: string, files: Record<string, string>): Promise<string> {
    const fs = require('fs');
    const path = require('path');
    
    // Create a unique project ID for this website
    const projectId = `project_${Date.now()}`;
    const websiteDir = path.join(process.cwd(), 'generated-websites', projectId);
    
    // Ensure the directory exists
    if (!fs.existsSync(websiteDir)) {
      fs.mkdirSync(websiteDir, { recursive: true });
    }
    
    // Write all files to the local directory
    for (const [filename, content] of Object.entries(files)) {
      const filePath = path.join(websiteDir, filename);
      const dir = path.dirname(filePath);
      
      // Ensure the directory exists
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(filePath, content);
      logInfo(`Created file: ${filename}`);
    }
    
    logInfo(`Website saved to: ${websiteDir}`);
    return websiteDir;
  }

}

