// CHANGELOG: 2025-12-23 - DeepSeek AI website generator inspired by DeepSite
// Reference: https://huggingface.co/spaces/enzostvs/deepsite
import axios from 'axios';
import { logError, logInfo } from '@/lib/log';

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

/**
 * DeepSeek-powered website generator inspired by DeepSite
 * Uses DeepSeek's chat API for high-quality website generation
 */
export class DeepSeekWebsiteGenerator {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    const apiKey = process.env.DEEPSEEK_API_KEY || '';
    this.apiKey = apiKey.replace(/^["']|["']$/g, '').trim();
    this.baseUrl = 'https://api.deepseek.com/v1';
    
    if (!this.apiKey) {
      logError('DeepSeek API key not configured', undefined, {
        hasDeepSeekKey: !!process.env.DEEPSEEK_API_KEY
      });
    }
  }

  async generateWebsite(request: WebsiteGenerationRequest, chatHistory?: any[], currentCode?: Record<string, string>): Promise<GeneratedWebsite> {
    try {
      logInfo('Starting DeepSeek website generation', { 
        request: JSON.stringify(request),
        hasCurrentCode: !!currentCode,
        currentCodeKeys: currentCode ? Object.keys(currentCode) : [],
        chatHistoryLength: chatHistory?.length || 0
      });

      // Generate website code using DeepSeek
      const websiteCode = await this.generateWebsiteCode(request, chatHistory, currentCode);
      
      // Save website files locally
      const localPath = await this.saveWebsiteLocally(request.name, websiteCode);
      logInfo('Website saved locally', { localPath });
      
      // Set local preview URL
      const websiteSlug = request.name.toLowerCase().replace(/\s+/g, '-');
      const projectId = `project_${Date.now()}`;
      const previewUrl = `http://localhost:3001/${projectId}`;

      const website: GeneratedWebsite = {
        id: `site_${Date.now()}`,
        name: request.name,
        slug: websiteSlug,
        status: 'deployed',
        previewUrl,
        repoUrl: undefined,
        files: websiteCode,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      logInfo('Website generation completed', { name: request.name, previewUrl });
      return website;

    } catch (error) {
      logError('Website generation failed', error);
      throw error;
    }
  }

  private async generateWebsiteCode(request: WebsiteGenerationRequest, chatHistory?: any[], currentCode?: Record<string, string>): Promise<Record<string, string>> {
    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = this.buildUserPrompt(request, chatHistory, currentCode);
    
    try {
      logInfo('Calling DeepSeek API', { model: 'deepseek-chat' });
      
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 8192, // DeepSeek max limit
          top_p: 0.95,
          frequency_penalty: 0,
          presence_penalty: 0,
          stream: false
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          timeout: 180000 // 3 minute timeout for complex websites
        }
      );

      if (!response.data.choices || response.data.choices.length === 0) {
        logError('DeepSeek API returned no choices', undefined, { responseData: response.data });
        throw new Error('DeepSeek API returned no content');
      }
      
      const content = response.data.choices[0].message?.content;
      if (!content) {
        logError('DeepSeek API content is empty', undefined, { choice: response.data.choices[0] });
        throw new Error('DeepSeek API returned empty content');
      }
      
      logInfo('DeepSeek response received', { 
        contentLength: content.length, 
        contentPreview: content.substring(0, 200),
        finishReason: response.data.choices[0].finish_reason
      });
      
      return this.parseGeneratedCode(content);
      
    } catch (error: any) {
      const status = error.response?.status;
      const errorMessage = error.response?.data?.error?.message || error.message;
      
      logError('DeepSeek API call failed', error, {
        status,
        errorMessage,
        responseData: error.response?.data
      });
      
      if (status === 401) {
        throw new Error('DeepSeek API authentication failed. Please check your API key.');
      }
      if (status === 429) {
        throw new Error('DeepSeek API rate limit exceeded. Please try again later.');
      }
      
      throw new Error(`DeepSeek API failed: ${errorMessage}`);
    }
  }

  private buildSystemPrompt(): string {
    // DeepSite-inspired system prompt for high-quality website generation
    return `You are DeepSite, an expert AI web developer that creates stunning, modern websites. You generate complete, production-ready HTML websites with embedded CSS and JavaScript.

CRITICAL RULES:
1. Return ONLY the HTML code - no explanations, no markdown, no code blocks
2. Start directly with <!DOCTYPE html> and end with </html>
3. Include ALL CSS in a <style> tag in the <head>
4. Include ALL JavaScript in a <script> tag before </body>
5. Use modern design patterns: glassmorphism, gradients, smooth animations
6. Make it fully responsive with mobile-first approach
7. Use real content - no "Lorem ipsum" placeholder text
8. Include working navigation, forms, and interactive elements

DESIGN SYSTEM:
- Colors: Use vibrant gradients (purple-pink, blue-cyan, orange-red)
- Typography: Inter or Poppins font family, large headlines (3-5rem)
- Spacing: 8px grid system, generous whitespace
- Effects: Glassmorphism (backdrop-filter blur), soft shadows
- Animations: Smooth transitions (0.3s ease), hover effects, scroll animations
- Border radius: 12px-24px for modern feel

RESOURCES TO USE:
- Font Awesome 6.4.0: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
- Google Fonts: <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
- Images: Use https://images.unsplash.com/photo-[ID]?w=800&h=600&fit=crop

SECTIONS TO INCLUDE:
1. Navigation: Sticky, glassmorphism background, mobile hamburger menu
2. Hero: Full viewport height, gradient background, compelling headline
3. Features/Services: Grid layout, icon cards with hover effects
4. About: Two-column layout with image
5. Testimonials: Card carousel or grid
6. Contact: Modern form with validation
7. Footer: Dark background, organized links, social icons`;
  }

  private detectStripeRequest(prompt: string): boolean {
    const stripeKeywords = [
      'stripe', 'payment', 'payments', 'checkout', 'add payment', 'payment button',
      'accept payments', 'payment integration', 'stripe integration', 'add stripe',
      'payment form', 'buy now', 'purchase', 'pay', 'payment method', 'payment gateway',
      'credit card', 'debit card', 'card payment', 'online payment', 'ecommerce',
      'sell', 'product', 'pricing', 'subscribe', 'subscription'
    ];
    const lowerPrompt = prompt.toLowerCase();
    return stripeKeywords.some(keyword => lowerPrompt.includes(keyword));
  }

  private getStripeIntegrationInstructions(): string {
    return `

STRIPE PAYMENT INTEGRATION REQUIRED:
1. Add Stripe.js in <head>: <script src="https://js.stripe.com/v3/"></script>
2. Initialize Stripe (use test publishable key):
   <script>const stripe = Stripe('pk_test_51ScwfS0Afn09g23Qy2nzvHVaAYxy4jWxr0NaTTB7PKo5n852Ay4mYmG3dBGlxjV9aVwn3u1kciZamxGxZieaP84T00MwNl1iR4');</script>
3. Add styled payment buttons (pricing cards, product cards, or CTA) with class "stripe-checkout-btn"
4. Use price ID: price_1SmG2l0Afn09g23QoCbGETau for all payment buttons
5. Add JS function before </body>:
   <script>
     async function handleStripeCheckout(priceId) {
       // Determine API URL - use production for deployed sites, localhost for local dev
       let apiUrl = 'https://beta-avallon1.vercel.app/api/stripe/checkout';
       try {
         if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
           apiUrl = 'http://localhost:3000/api/stripe/checkout';
         }
       } catch (e) {}
       
       const response = await fetch(apiUrl, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           priceId,
           successUrl: window.location.origin + '?payment=success',
           cancelUrl: window.location.origin + '?payment=cancelled'
         })
       });
       const data = await response.json();
       if (data.error) { alert('Payment Error: ' + data.error); return; }
       if (data.checkoutUrl) window.location.href = data.checkoutUrl;
     }
   </script>
6. Buttons should call: onclick="handleStripeCheckout('price_1SmG2l0Afn09g23QoCbGETau')"
7. Match button styling to the site design (gradient, hover, shadow).`;
  }

  private buildUserPrompt(request: WebsiteGenerationRequest, chatHistory?: any[], currentCode?: Record<string, string>): string {
    const isModification = !!currentCode && Object.keys(currentCode).length > 0;
    const wantsStripe = this.detectStripeRequest(request.description);
    
    if (isModification) {
      const existingHtml = currentCode['index.html'] || Object.values(currentCode)[0] || '';
      return `MODIFY this existing website based on the user's request.

USER REQUEST: "${request.description}"

EXISTING WEBSITE CODE:
${existingHtml}

MODIFICATION RULES:
- Only change what the user specifically requested
- Preserve existing layout, colors, and structure unless asked to change them
- Keep all existing sections and content
- Maintain the same design system
- Return the COMPLETE modified HTML (not just the changes)
${wantsStripe ? this.getStripeIntegrationInstructions() : ''}

Return ONLY the complete modified HTML code starting with <!DOCTYPE html>`;
    }
    
    // For new websites
    return `Create a stunning, modern website for: "${request.description}"

Website name: ${request.name}
Type: ${request.mode}

Generate a complete, production-ready HTML website with:
- All CSS embedded in <style> tags
- All JavaScript embedded in <script> tags  
- Real, relevant content (not placeholder text)
- Professional design matching the business type
- Mobile-responsive layout
- Smooth animations and hover effects
- Working navigation and forms
${wantsStripe ? this.getStripeIntegrationInstructions() : ''}

Return ONLY the HTML code starting with <!DOCTYPE html> - no explanations or markdown.`;
  }

  private parseGeneratedCode(content: string): Record<string, string> {
    const files: Record<string, string> = {};
    
    let cleanedContent = content.trim();
    
    // Remove any markdown code block markers
    cleanedContent = cleanedContent.replace(/^```[a-z]*\s*\n?/gm, '').replace(/\n?```$/gm, '');
    cleanedContent = cleanedContent.trim();
    
    // Try to find HTML content
    let htmlContent = cleanedContent;
    
    // If content doesn't start with <!DOCTYPE or <html, try to extract HTML
    if (!cleanedContent.startsWith('<!DOCTYPE') && !cleanedContent.startsWith('<html')) {
      // Try to find HTML in the content
      const doctypeMatch = cleanedContent.match(/<!DOCTYPE[\s\S]*$/i);
      const htmlMatch = cleanedContent.match(/<html[\s\S]*$/i);
      
      if (doctypeMatch) {
        htmlContent = doctypeMatch[0];
      } else if (htmlMatch) {
        htmlContent = htmlMatch[0];
      }
    }
    
    // Clean up any remaining issues
    htmlContent = htmlContent.trim();
    
    // Validate it's HTML
    if (!htmlContent.includes('<!DOCTYPE') && !htmlContent.includes('<html') && !htmlContent.includes('<body')) {
      logError('DeepSeek did not generate valid HTML', new Error('Invalid HTML'), {
        contentLength: content.length,
        contentPreview: content.substring(0, 500)
      });
      throw new Error('DeepSeek did not generate valid HTML');
    }
    
    // Fix truncated HTML if needed
    htmlContent = this.fixTruncatedHtml(htmlContent);
    
    // Fix image URLs
    htmlContent = this.fixImageUrls(htmlContent);
    
    // Fix Font Awesome
    htmlContent = this.fixFontAwesomeLinks(htmlContent);
    
    files['index.html'] = htmlContent;
    
    logInfo('Parsed generated code', { 
      files: Object.keys(files), 
      htmlLength: htmlContent.length
    });
    
    return files;
  }

  private fixTruncatedHtml(html: string): string {
    const hasHtmlClose = html.includes('</html>');
    const hasBodyClose = html.includes('</body>');
    const hasStyleOpen = html.includes('<style');
    const hasStyleClose = html.includes('</style>');
    
    if (!hasHtmlClose || !hasBodyClose) {
      logInfo('Detected truncated HTML, completing structure');
      
      // Close unclosed style tags
      if (hasStyleOpen && !hasStyleClose) {
        html += '\n    }\n    </style>';
      }
      
      // Close unclosed script tags
      const scriptOpenCount = (html.match(/<script/g) || []).length;
      const scriptCloseCount = (html.match(/<\/script>/g) || []).length;
      for (let i = scriptCloseCount; i < scriptOpenCount; i++) {
        html += '\n    </script>';
      }
      
      // Add closing structure
      if (!hasBodyClose) {
        html += `
    <!-- Content completed by DeepSite -->
    <footer style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 60px 20px; text-align: center;">
      <p style="opacity: 0.8;">&copy; ${new Date().getFullYear()} All rights reserved.</p>
    </footer>
</body>`;
      }
      
      if (!hasHtmlClose) {
        html += '\n</html>';
      }
    }
    
    return html;
  }

  private fixImageUrls(html: string): string {
    // Fix broken Unsplash URLs
    const brokenPattern = /src=["'](photo-\d+-[a-zA-Z0-9]+[^"']*)["']/gi;
    html = html.replace(brokenPattern, (match, photoId) => {
      const cleanId = photoId.split('?')[0].split('&')[0];
      return `src="https://images.unsplash.com/${cleanId}?w=800&h=600&fit=crop"`;
    });
    
    // Fix any src that doesn't have a protocol
    const brokenSrcPattern = /src=["'](?!https?:\/\/|data:|\.\/|\/|#)([^"']+)["']/g;
    html = html.replace(brokenSrcPattern, 'src="https://picsum.photos/800/600"');
    
    return html;
  }

  private fixFontAwesomeLinks(html: string): string {
    // Remove integrity attributes that cause errors
    const faPattern = /(<link[^>]*font-awesome[^>]*)(\s+integrity=["'][^"']*["'])([^>]*>)/gi;
    return html.replace(faPattern, '$1$3');
  }

  private async saveWebsiteLocally(name: string, files: Record<string, string>): Promise<string> {
    const fs = require('fs');
    const path = require('path');
    
    const projectId = `project_${Date.now()}`;
    const websiteDir = path.join(process.cwd(), 'generated-websites', projectId);
    
    if (!fs.existsSync(websiteDir)) {
      fs.mkdirSync(websiteDir, { recursive: true });
    }
    
    for (const [filename, content] of Object.entries(files)) {
      const filePath = path.join(websiteDir, filename);
      const dir = path.dirname(filePath);
      
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

