// CHANGELOG: 2025-01-15 - Add Ultra-Advanced AI Website Generation System (Better than Lovable)
// CHANGELOG: 2025-10-27 - Updated to use LovableProvider for AI website generation
// CHANGELOG: 2025-12-23 - Switched to DeepSeek AI for better website generation (DeepSite-inspired)
// CHANGELOG: 2026-01-06 - Added user integration support (Stripe, GA, etc.)
// CHANGELOG: 2026-01-07 - Fixed CORS handling to use shared getCorsHeaders utility
import { NextRequest, NextResponse } from "next/server";
import { logError, logInfo } from "@/lib/log";
// AI generators are dynamically imported to avoid build-time issues with Google Cloud libs
import { createSite } from "@/data/sites";

// Force dynamic rendering - prevents Next.js from analyzing this route at build time
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { getUser } from "@/lib/auth/getUser";
import { z } from "zod";
import { hasEnoughCredits, deductCredits, deductTokenCredits, CREDIT_COSTS, ensureUserHasCredits, calculateTokenCredits } from "@/lib/billing/credits";
import { 
  getUserStripeIntegration, 
  getUserGoogleAnalyticsIntegration,
  generateStripeIntegrationCode,
  generateGoogleAnalyticsCode,
  getUserActiveIntegrations 
} from "@/lib/integrations";
import { getCorsHeaders } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(req),
  });
}

const GenerateSiteSchema = z.object({
  name: z.string().min(1, "Site name is required").max(100, "Site name too long"),
  description: z.string().min(1, "Description is required").max(5000, "Description too long"),
  mode: z.enum(['full', 'landing', 'blog', 'ecommerce']).optional().default('full'),
  // Advanced AI parameters
  industry: z.string().optional(),
  targetAudience: z.string().optional(),
  features: z.array(z.string()).optional(),
  style: z.enum(['modern', 'classic', 'minimalist', 'creative', 'professional', 'elegant']).optional(),
  colorScheme: z.string().optional(),
  layout: z.enum(['single-page', 'multi-page', 'blog', 'ecommerce', 'portfolio', 'landing']).optional(),
  complexity: z.enum(['simple', 'intermediate', 'advanced', 'enterprise']).optional(),
  integrations: z.array(z.string()).optional(),
  seo: z.boolean().optional().default(true),
  responsive: z.boolean().optional().default(true),
  accessibility: z.boolean().optional().default(true),
  performance: z.boolean().optional().default(true),
  animations: z.boolean().optional().default(true),
  darkMode: z.boolean().optional().default(false),
  multilingual: z.boolean().optional().default(false),
  analytics: z.boolean().optional().default(true),
  cms: z.boolean().optional().default(false),
  ecommerce: z.boolean().optional().default(false),
  social: z.boolean().optional().default(false),
  ai: z.boolean().optional().default(true),
  // Modification support
  siteId: z.string().optional(),
  multiPage: z.boolean().optional().default(true),
  messages: z.array(z.any()).optional(),
  currentCode: z.record(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { 
        status: 401,
        headers: corsHeaders,
      });
    }

    const body = await req.json();
    const { 
      name, 
      description, 
      mode,
      industry,
      targetAudience,
      features,
      style,
      colorScheme,
      layout,
      complexity,
      integrations,
      seo,
      responsive,
      accessibility,
      performance,
      animations,
      darkMode,
      multilingual,
      analytics,
      cms,
      ecommerce,
      social,
      ai,
      siteId,
      multiPage,
      messages,
      currentCode,
    } = GenerateSiteSchema.parse(body);

    logInfo('Starting Lovable website generation', { 
      name, 
      description: description.substring(0, 100),
      mode,
      industry,
      style,
      complexity
    });

    // Ensure user exists in DB with initial credits (20 for free users)
    await ensureUserHasCredits(user.id, user.email, 20);

    // Check if user has enough credits (minimum 5 credits to start, actual cost based on tokens used)
    // We use a minimum threshold since we don't know exact token usage upfront
    const MIN_CREDITS_REQUIRED = 5;
    const creditCheck = await hasEnoughCredits(user.id, MIN_CREDITS_REQUIRED, user.email);
    if (!creditCheck.hasEnough) {
      return NextResponse.json({
        error: "Insufficient credits",
        message: `You need at least ${MIN_CREDITS_REQUIRED} credits to generate a website, but you only have ${creditCheck.currentCredits} credits. Actual cost depends on content complexity (typically 5-30 credits).`,
        credits: {
          current: creditCheck.currentCredits,
          required: MIN_CREDITS_REQUIRED,
          note: "Credits are charged based on actual AI usage (1 credit per ~1000 tokens)",
        },
      }, {
        status: 402, // Payment Required
        headers: corsHeaders,
      });
    }

    // Use Gemini 3.0 Pro for high-quality website generation
    try {
      // Dynamic import to avoid build-time issues with Google Cloud libs
      // Using GeminiWebsiteGenerator with Vertex AI Gemini 3 Pro Preview (as requested)
      const { GeminiWebsiteGenerator } = await import("@/lib/providers/impl/gemini-website-generator");
      const generator = new GeminiWebsiteGenerator();
      
      logInfo('Using AI generator', { 
        provider: 'Gemini 3.0 Pro',
        hasGeminiKey: !!process.env.GEMINI_API_KEY
      });
      
      // Generate name from description if not provided
      const generateNameFromDescription = (desc: string): string => {
        const lowerDesc = desc.toLowerCase();
        
        if (lowerDesc.includes('car') && (lowerDesc.includes('detail') || lowerDesc.includes('wash') || lowerDesc.includes('auto'))) {
          return 'Auto Detailing Website';
        } else if (lowerDesc.includes('snow') || lowerDesc.includes('snowplow') || lowerDesc.includes('plow')) {
          return 'Snow Removal Services';
        } else if (lowerDesc.includes('restaurant') || lowerDesc.includes('food') || lowerDesc.includes('dining')) {
          return 'Restaurant Website';
        } else if (lowerDesc.includes('landscap') || lowerDesc.includes('lawn') || lowerDesc.includes('garden')) {
          return 'Landscaping Services';
        } else if (lowerDesc.includes('construction') || lowerDesc.includes('contractor') || lowerDesc.includes('building')) {
          return 'Construction Company';
        } else if (lowerDesc.includes('portfolio')) {
          return 'Portfolio Website';
        } else if (lowerDesc.includes('ecommerce') || lowerDesc.includes('store') || lowerDesc.includes('shop')) {
          return 'E-commerce Store';
        } else if (lowerDesc.includes('blog')) {
          return 'Blog Website';
        } else if (lowerDesc.includes('saas') || lowerDesc.includes('software')) {
          return 'SaaS Product';
        } else {
          // Try to extract meaningful words
          const words = desc.split(/\s+/).filter(w => w.length > 3 && !['make', 'create', 'build', 'website', 'site'].includes(w.toLowerCase()));
          if (words.length > 0) {
            const nameWords = words.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
            return nameWords.join(' ') + ' Website';
          }
          return name || `Website ${Date.now()}`;
        }
      };
      
      const finalName = name || generateNameFromDescription(description);
      
      // ALWAYS generate multi-page websites by default
      const descLower = description.toLowerCase();
      
      // Only create single-page if EXPLICITLY requested
      const isExplicitlySinglePage = layout === 'single-page' || 
        layout === 'landing' ||
        descLower.includes('single page only') ||
        descLower.includes('one page only') ||
        descLower.includes('landing page only') ||
        descLower.includes('just a landing');
      
      // Multi-page is now the DEFAULT - always true unless explicitly single page
      const shouldBeMultiPage = !isExplicitlySinglePage;
      
      // Determine pages to generate based on context - ALWAYS multi-page
      let pagesToGenerate = ['index', 'about', 'services', 'contact'];
      
      // Context-specific pages based on website type
      if (descLower.includes('restaurant') || descLower.includes('food') || descLower.includes('menu') || descLower.includes('cafe') || descLower.includes('dining')) {
        pagesToGenerate = ['index', 'about', 'menu', 'reservations', 'contact'];
      } else if (descLower.includes('portfolio') || descLower.includes('creative') || descLower.includes('designer') || descLower.includes('photographer') || descLower.includes('artist')) {
        pagesToGenerate = ['index', 'about', 'portfolio', 'services', 'contact'];
      } else if (descLower.includes('ecommerce') || descLower.includes('store') || descLower.includes('shop') || descLower.includes('product') || mode === 'ecommerce') {
        pagesToGenerate = ['index', 'products', 'about', 'contact', 'cart'];
      } else if (descLower.includes('blog') || mode === 'blog') {
        pagesToGenerate = ['index', 'blog', 'about', 'contact'];
      } else if (descLower.includes('saas') || descLower.includes('software') || descLower.includes('app') || descLower.includes('startup')) {
        pagesToGenerate = ['index', 'about', 'features', 'pricing', 'contact'];
      } else if (descLower.includes('agency') || descLower.includes('marketing') || descLower.includes('consulting')) {
        pagesToGenerate = ['index', 'about', 'services', 'portfolio', 'contact'];
      } else if (descLower.includes('real estate') || descLower.includes('property') || descLower.includes('realtor')) {
        pagesToGenerate = ['index', 'about', 'listings', 'services', 'contact'];
      } else if (descLower.includes('gym') || descLower.includes('fitness') || descLower.includes('health') || descLower.includes('wellness')) {
        pagesToGenerate = ['index', 'about', 'classes', 'pricing', 'contact'];
      } else if (descLower.includes('law') || descLower.includes('legal') || descLower.includes('attorney') || descLower.includes('lawyer')) {
        pagesToGenerate = ['index', 'about', 'practice-areas', 'team', 'contact'];
      } else if (descLower.includes('medical') || descLower.includes('clinic') || descLower.includes('doctor') || descLower.includes('healthcare')) {
        pagesToGenerate = ['index', 'about', 'services', 'team', 'contact'];
      } else {
        // Default business website pages - 4 pages minimum
        pagesToGenerate = ['index', 'about', 'services', 'contact'];
      }
      
      // If explicitly single page, only generate index
      if (isExplicitlySinglePage) {
        pagesToGenerate = ['index'];
      }
      
      const generationRequest = {
        name: finalName,
        description: description + 
          (industry ? ` Industry: ${industry}.` : '') +
          (targetAudience ? ` Target audience: ${targetAudience}.` : '') +
          (style ? ` Design style: ${style}.` : '') +
          (colorScheme ? ` Color scheme: ${colorScheme}.` : '') +
          (layout ? ` Layout: ${layout}.` : '') +
          (complexity ? ` Complexity: ${complexity}.` : '') +
          (features && features.length > 0 ? ` Features: ${features.join(', ')}.` : '') +
          (shouldBeMultiPage ? ' Generate a complete multi-page website with navigation between pages.' : ''),
        mode: mode || 'full',
        multiPage: shouldBeMultiPage,
        pages: shouldBeMultiPage ? pagesToGenerate : undefined,
      };

      logInfo('Starting Gemini website generation', {
        name,
        description: generationRequest.description.substring(0, 100),
        hasCurrentCode: !!currentCode && Object.keys(currentCode).length > 0,
        messagesCount: messages?.length || 0,
      });

      // Generate website using Gemini AI (pass currentCode for modifications)
      let websiteResult;
      try {
        // For modifications with large existing content, truncate to avoid token limits
        let truncatedCurrentCode = currentCode;
        if (currentCode && Object.keys(currentCode).length > 0) {
          const totalSize = Object.values(currentCode).reduce((acc, html) => acc + (html?.length || 0), 0);
          logInfo('Current code size for modification', { totalSize, fileCount: Object.keys(currentCode).length });
          
          // If total size exceeds 100KB, truncate each file
          if (totalSize > 100000) {
            truncatedCurrentCode = {};
            const maxPerFile = Math.floor(60000 / Object.keys(currentCode).length);
            for (const [filename, content] of Object.entries(currentCode)) {
              if (content && content.length > maxPerFile) {
                truncatedCurrentCode[filename] = content.substring(0, maxPerFile) + '\n<!-- Content truncated for AI processing -->';
              } else {
                truncatedCurrentCode[filename] = content;
              }
            }
            logInfo('Truncated large website content for modification', { 
              originalSize: totalSize, 
              maxPerFile,
              truncatedSize: Object.values(truncatedCurrentCode).reduce((acc, html) => acc + (html?.length || 0), 0)
            });
          }
        }
        
        websiteResult = await generator.generateWebsite(generationRequest, messages, truncatedCurrentCode);
      } catch (genError: any) {
        logError('Generator.generateWebsite failed', genError, {
          name,
          description: generationRequest.description.substring(0, 100),
          errorMessage: genError?.message,
          errorStack: genError?.stack,
        });
        
        // Provide more helpful error messages based on the error type
        const errorMsg = genError?.message || 'Unknown error';
        let helpText = '';
        
        if (errorMsg.includes('quota') || errorMsg.includes('RESOURCE_EXHAUSTED')) {
          helpText = 'The AI service quota has been exceeded. Please try again in a few minutes or contact support.';
        } else if (errorMsg.includes('PERMISSION_DENIED') || errorMsg.includes('UNAUTHENTICATED') || errorMsg.includes('authentication')) {
          helpText = 'AI service authentication failed. Please contact support.';
        } else if (errorMsg.includes('token') || errorMsg.includes('too long') || errorMsg.includes('limit')) {
          helpText = 'The request was too large. Try making a smaller change or editing fewer files at once.';
        } else if (errorMsg.includes('timeout') || errorMsg.includes('DEADLINE_EXCEEDED')) {
          helpText = 'The AI service took too long to respond. Please try again.';
        }
        
        const error = new Error(`Website generation failed: ${errorMsg}`);
        (error as any).help = helpText;
        throw error;
      }
      
      // Validate that we got website content
      if (!websiteResult.files || Object.keys(websiteResult.files).length === 0) {
        logError('Gemini returned empty files', undefined, {
          websiteResult,
          hasFiles: !!websiteResult.files,
          filesKeys: websiteResult.files ? Object.keys(websiteResult.files) : []
        });
        throw new Error('Website generation returned no content. Please try again.');
      }
      
      logInfo('Website generation completed', {
        filesCount: Object.keys(websiteResult.files).length,
        fileKeys: Object.keys(websiteResult.files),
        hasIndexHtml: !!websiteResult.files['index.html'],
        indexHtmlLength: websiteResult.files['index.html'] ? websiteResult.files['index.html'].length : 0
      });

      // ==========================================
      // INJECT USER INTEGRATIONS INTO GENERATED HTML
      // ==========================================
      try {
        const userIntegrations = await getUserActiveIntegrations(user.id);
        logInfo('User integrations found', { userId: user.id, integrations: userIntegrations });
        
        if (userIntegrations.length > 0) {
          let integrationCode = '';
          
          // Add Stripe integration if user has it connected
          if (userIntegrations.includes('stripe')) {
            const stripeIntegration = await getUserStripeIntegration(user.id);
            if (stripeIntegration) {
              integrationCode += generateStripeIntegrationCode(stripeIntegration);
              logInfo('Stripe integration code added', { userId: user.id });
            }
          }
          
          // Add Google Analytics if user has it connected
          if (userIntegrations.includes('google_analytics')) {
            const gaIntegration = await getUserGoogleAnalyticsIntegration(user.id);
            if (gaIntegration) {
              integrationCode += generateGoogleAnalyticsCode(gaIntegration);
              logInfo('Google Analytics code added', { userId: user.id });
            }
          }
          
          // Inject integration code into all HTML files
          if (integrationCode) {
            for (const [filename, content] of Object.entries(websiteResult.files)) {
              if (filename.endsWith('.html') && typeof content === 'string') {
                // Inject before </head> if exists
                if (content.includes('</head>')) {
                  websiteResult.files[filename] = content.replace('</head>', `${integrationCode}\n</head>`);
                } else if (content.includes('</body>')) {
                  // Otherwise inject before </body>
                  websiteResult.files[filename] = content.replace('</body>', `${integrationCode}\n</body>`);
                }
              }
            }
            logInfo('Integration code injected into HTML files', { 
              fileCount: Object.keys(websiteResult.files).length 
            });
          }
        }
      } catch (integrationError: any) {
        // Don't fail the whole generation if integrations fail
        logError('Failed to inject integrations (continuing without)', integrationError);
      }

      // Deduct credits based on actual token usage (or fallback to fixed cost)
      let creditDeduction;
      let actualCreditsUsed: number = CREDIT_COSTS.GENERATE_WEBSITE; // Default fallback
      
      if (websiteResult.tokensUsed && websiteResult.tokensUsed.total > 0) {
        // Use actual token usage: 1 credit per 1000 tokens
        actualCreditsUsed = calculateTokenCredits(
          websiteResult.tokensUsed.input,
          websiteResult.tokensUsed.output
        );
        
        logInfo('Using token-based credit deduction', {
          inputTokens: websiteResult.tokensUsed.input,
          outputTokens: websiteResult.tokensUsed.output,
          totalTokens: websiteResult.tokensUsed.total,
          creditsToDeduct: actualCreditsUsed,
        });
        
        creditDeduction = await deductCredits(
          user.id,
          actualCreditsUsed,
          `Website generation (${websiteResult.tokensUsed.total.toLocaleString()} tokens)`,
          user.email
        );
      } else {
        // Fallback to fixed cost if token info not available
        creditDeduction = await deductCredits(
          user.id,
          CREDIT_COSTS.GENERATE_WEBSITE,
          'Website generation',
          user.email
        );
      }

      if (!creditDeduction.success) {
        logError('Failed to deduct credits after generation', new Error(creditDeduction.error || 'Unknown error'), {
          userId: user.id,
          cost: actualCreditsUsed,
        });
        // Continue anyway - the website was already generated
      }

      // Save to database with initial chat history
      const initialChatHistory = [
        {
          id: '1',
          role: 'user',
          content: description,
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          role: 'assistant',
          content: "Website generated successfully with Kirin!",
          timestamp: new Date().toISOString()
        }
      ];
      
      const savedSite = await createSite({
        ownerId: user.id,
        name: finalName,
        slug: websiteResult.slug,
        status: websiteResult.status,
        previewUrl: websiteResult.previewUrl,
        repoUrl: websiteResult.repoUrl,
        chatHistory: initialChatHistory,
        websiteContent: websiteResult.files || {},
      });

      logInfo('Gemini website generation completed', {
        name,
        previewUrl: websiteResult.previewUrl,
        filesCount: websiteResult.files ? Object.keys(websiteResult.files).length : 0,
      });

      // Ensure websiteContent is always included
      const responseWebsiteContent = websiteResult.files || {};
      
      logInfo('Returning generate response', {
        hasWebsiteContent: !!responseWebsiteContent,
        websiteContentKeys: Object.keys(responseWebsiteContent),
        hasIndexHtml: !!responseWebsiteContent['index.html'],
        indexHtmlLength: responseWebsiteContent['index.html'] ? responseWebsiteContent['index.html'].length : 0
      });
      
      return NextResponse.json({
        success: true,
        message: "Website generated successfully with Kirin!",
        result: savedSite,
        websiteContent: responseWebsiteContent, // CRITICAL: Always include websiteContent
        previewUrl: websiteResult.previewUrl,
        repoUrl: websiteResult.repoUrl,
        credits: {
          remaining: creditDeduction.remainingCredits,
          deducted: actualCreditsUsed,
        },
        tokensUsed: websiteResult.tokensUsed,
      }, {
        headers: corsHeaders,
      });
    } catch (error: any) {
      logError('Gemini website generation failed', error);
      
      // Return detailed error message for debugging
      const errorMessage = error?.message || "An error occurred during website generation";
      const errorDetails = error?.response?.data || error?.stack || "No additional details";
      
      logError('Generation error details', error, {
        message: errorMessage,
        details: errorDetails,
        status: error?.response?.status
      });

      // Use help text from error if available, otherwise generate based on message
      let helpText = (error as any).help;
      if (!helpText) {
        if (errorMessage.includes('expired') || errorMessage.includes('invalid')) {
          helpText = "Get a new Gemini API key from https://aistudio.google.com/apikey and update GEMINI_API_KEY in backend/.env";
        } else if (errorMessage.includes('quota') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
          helpText = "The AI service quota has been exceeded. Please try again in a few minutes.";
        } else if (errorMessage.includes('PERMISSION_DENIED') || errorMessage.includes('authentication')) {
          helpText = "AI service authentication failed. Please contact support.";
        }
      }

      return NextResponse.json({
        error: "Failed to generate website",
        help: helpText,
        message: errorMessage,
        details: typeof errorDetails === 'object' ? JSON.stringify(errorDetails) : errorDetails,
      }, { 
        status: 500,
        headers: corsHeaders,
      });
    }
  } catch (error: any) {
    logError('Website generation failed (outer catch)', error);
    
    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      logError('Validation error', error, { errors: error.errors });
      return NextResponse.json({ 
        error: "Invalid input", 
        details: error.errors 
      }, { 
        status: 400,
        headers: corsHeaders,
      });
    }
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      logError('JSON parsing error', error);
      return NextResponse.json({ 
        error: "Invalid JSON in request body",
        message: error.message
      }, { 
        status: 400,
        headers: corsHeaders,
      });
    }
    
    // Return detailed error for debugging
    const errorMessage = error?.message || 'Unknown error';
    const errorStack = error?.stack || 'No stack trace';
    
    logError('Unhandled error in generate endpoint', error, {
      message: errorMessage,
      stack: errorStack,
      name: error?.name,
      code: error?.code,
    });
    
    return NextResponse.json({ 
      error: "Internal server error",
      message: errorMessage,
      // Only include stack in development
      ...(process.env.NODE_ENV === 'development' && { stack: errorStack })
    }, { 
      status: 500,
      headers: corsHeaders,
    });
  }
}
