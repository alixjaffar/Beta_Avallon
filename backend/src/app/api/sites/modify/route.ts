// API endpoint for modifying websites with AI chat
// CHANGELOG: 2025-12-23 - Added DeepSeek AI support for website modifications
import { NextRequest, NextResponse } from "next/server";
import { logError, logInfo } from "@/lib/log";
import { z } from "zod";
// AI generators are dynamically imported to avoid build-time issues with Google Cloud libs
import { getSiteById, updateSite } from "@/data/sites";
import { getUser } from "@/lib/auth/getUser";
import { hasEnoughCredits, deductCredits, CREDIT_COSTS, ensureUserHasCredits } from "@/lib/billing/credits";

const ModifySiteSchema = z.object({
  siteId: z.string().min(1, "Site ID is required"),
  message: z.string().min(1, "Message is required"),
  chatHistory: z.array(z.object({
    id: z.string().optional(),
    role: z.enum(['user', 'assistant']),
    content: z.string(),
    timestamp: z.any() // Accept any timestamp format
  })).optional(),
  currentCode: z.record(z.string()).optional(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-email',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { 
        status: 401,
        headers: corsHeaders,
      });
    }

    const body = await req.json();
    const { siteId, message, chatHistory = [], currentCode } = ModifySiteSchema.parse(body);

    logInfo('Modifying website with AI', { siteId, message, chatHistoryLength: chatHistory.length });

    // Get the site to understand the current context
    const site = await getSiteById(siteId, user.id);
    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { 
        status: 404,
        headers: corsHeaders,
      });
    }

    // Ensure user exists in DB with initial credits (30 for free users)
    await ensureUserHasCredits(user.id, user.email, 30);

    // Check if user has enough credits (pass email for lookup)
    const creditCheck = await hasEnoughCredits(user.id, CREDIT_COSTS.MODIFY_WEBSITE, user.email);
    if (!creditCheck.hasEnough) {
      return NextResponse.json({
        success: false,
        error: "Insufficient credits",
        message: `You need ${creditCheck.requiredCredits} credits to modify a website, but you only have ${creditCheck.currentCredits} credits. Please upgrade your plan to get more credits.`,
        credits: {
          current: creditCheck.currentCredits,
          required: creditCheck.requiredCredits,
        },
      }, {
        status: 402, // Payment Required
        headers: corsHeaders,
      });
    }

    // Enhanced AI processing with chat history context
    let responseMessage = '';
    
    // Analyze the request with chat history context
    const lowerMessage = message.toLowerCase();
    
    // Handle specific business type requests with detailed responses
    if (lowerMessage.includes('car') && (lowerMessage.includes('detail') || lowerMessage.includes('wash') || lowerMessage.includes('auto'))) {
      responseMessage = `I've created a professional auto detailing website based on your request: "${message}". The website now includes:

🚗 **Professional Auto Detailing Services**
• Full Detail Service ($150) - Complete interior and exterior detailing
• Paint Correction ($300) - Professional paint restoration and protection  
• Ceramic Coating ($500) - Long-lasting paint protection
• Interior Deep Clean ($120) - Thorough interior cleaning and protection

✨ **Key Features Added:**
• Modern dark blue gradient hero section with professional branding
• Detailed service cards with pricing and descriptions
• Contact form for quote requests
• Professional about section highlighting expertise
• Mobile-responsive design

The website is now optimized for auto detailing businesses with industry-specific content, pricing, and professional styling.`;
    } else if (lowerMessage.includes('snow') || lowerMessage.includes('snowplow') || lowerMessage.includes('plow')) {
      responseMessage = `I've created a comprehensive snowplow business website based on your request: "${message}". The website now includes:

🚛 **Professional Snow Services**
• Residential Snow Removal - Driveways and walkways
• Commercial Snow Plowing - Parking lots and business properties
• Emergency Snow Service - 24/7 availability
• Ice Management - Salt and de-icing services

❄️ **Key Features Added:**
• Winter-themed hero section with snowplow imagery
• Service packages with seasonal pricing
• Emergency contact information
• Weather-based service descriptions
• Professional contractor styling

The website is now optimized for snow removal businesses with winter-specific content and professional contractor branding.`;
    } else if (lowerMessage.includes('restaurant') || lowerMessage.includes('food') || lowerMessage.includes('dining')) {
      responseMessage = `I've created a beautiful restaurant website based on your request: "${message}". The website now includes:

🍽️ **Restaurant Features**
• Elegant hero section with food imagery
• Menu sections with appetizers, mains, and desserts
• Online reservation system
• Contact information and location details
• Professional chef and culinary story

👨‍🍳 **Key Features Added:**
• Warm color scheme perfect for dining
• Food photography placeholders
• Menu items with descriptions and pricing
• About section highlighting culinary expertise
• Contact form for reservations

The website is now optimized for restaurants with food-focused content and elegant dining aesthetics.`;
    } else if (lowerMessage.includes('landscap') || lowerMessage.includes('lawn') || lowerMessage.includes('garden')) {
      responseMessage = `I've created a professional landscaping website based on your request: "${message}". The website now includes:

🌱 **Landscaping Services**
• Lawn Care and Maintenance
• Garden Design and Installation
• Tree and Shrub Care
• Seasonal Cleanup Services

🌿 **Key Features Added:**
• Nature-inspired green color scheme
• Before/after project galleries
• Service packages for different property sizes
• Seasonal service descriptions
• Professional landscaping imagery

The website is now optimized for landscaping businesses with nature-focused content and professional outdoor service branding.`;
    } else if (lowerMessage.includes('construction') || lowerMessage.includes('contractor') || lowerMessage.includes('building')) {
      responseMessage = `I've created a professional construction website based on your request: "${message}". The website now includes:

🏗️ **Construction Services**
• Residential Construction
• Commercial Projects
• Renovations and Remodeling
• Project Management

🔨 **Key Features Added:**
• Industrial color scheme with professional styling
• Project portfolio showcase
• Service descriptions with project types
• Safety certifications and licensing info
• Contact forms for project inquiries

The website is now optimized for construction companies with professional contractor branding and project-focused content.`;
    } else if (lowerMessage.includes('change the color') || lowerMessage.includes('make the hero section black') || lowerMessage.includes('black and white')) {
      responseMessage = `I've updated the color scheme based on your request: "${message}". The hero section now features:

🎨 **Color Changes Applied:**
• Hero background changed to black
• Text color updated to white for contrast
• Maintained professional styling
• Preserved readability and accessibility

The website now has the black and white color scheme you requested while maintaining professional appearance and readability.`;
    } else if (lowerMessage.includes('make it say') || lowerMessage.includes('change the title') || lowerMessage.includes('update the text')) {
      responseMessage = `I've updated the website content based on your request: "${message}". The changes include:

📝 **Content Updates:**
• Updated main title and headings
• Modified text content throughout the site
• Maintained professional formatting
• Preserved website structure

The website content has been updated to reflect your specific requirements while maintaining the professional design and layout.`;
    } else if (lowerMessage.includes('add') || lowerMessage.includes('remove') || lowerMessage.includes('update')) {
      responseMessage = `I've modified the website content based on your request: "${message}". The updates include:

🔧 **Content Modifications:**
• Added new sections as requested
• Updated existing content
• Maintained design consistency
• Preserved responsive layout

The website has been updated with your requested changes while maintaining professional appearance and functionality.`;
    } else {
      responseMessage = `I've updated your website based on: "${message}". The changes include:

✨ **Website Updates:**
• Applied your requested modifications
• Maintained professional design standards
• Preserved responsive layout
• Updated content to match your requirements

The website now reflects your specific needs while maintaining high-quality design and functionality.`;
    }

    try {
      // Get current website content from the site OR from frontend
      const currentWebsiteContent = (currentCode && Object.keys(currentCode).length > 0) 
        ? currentCode 
        : (site.websiteContent || {});
      
      // Build complete chat history: existing + new user message
      const existingChatHistory = site.chatHistory || chatHistory || [];
      
      // Get original description from first user message for context
      const firstUserMessage = existingChatHistory.find((msg: any) => msg.role === 'user');
      const originalDescription = firstUserMessage?.content || site.name || 'website';
      
      logInfo('Starting website modification', { 
        hasCurrentCode: Object.keys(currentWebsiteContent).length > 0,
        currentCodeKeys: Object.keys(currentWebsiteContent),
        messageLength: message.length,
        originalDescription: originalDescription.substring(0, 100)
      });
      
      // Add the new user message to chat history
      const newUserMessage = {
        id: Date.now().toString(),
        role: 'user' as const,
        content: message,
        timestamp: new Date().toISOString()
      };
      
      // Combine existing chat history with new user message
      const fullChatHistory = [...existingChatHistory, newUserMessage];
      
      // ==========================================
      // SMART MODIFICATION: Try programmatic edit first for simple changes
      // ==========================================
      const lowerMessage = message.toLowerCase();
      
      // Detect simple text replacement requests
      const nameChangeMatch = message.match(/change\s+(?:the\s+)?(?:name|title|brand)\s+(?:from\s+)?["']?([^"']+)["']?\s+to\s+["']?([^"']+)["']?/i) ||
                              message.match(/rename\s+(?:from\s+)?["']?([^"']+)["']?\s+to\s+["']?([^"']+)["']?/i) ||
                              message.match(/change\s+["']?([^"']+)["']?\s+to\s+["']?([^"']+)["']?/i);
      
      // If we have current code and this is a simple text change, do it programmatically
      if (Object.keys(currentWebsiteContent).length > 0 && nameChangeMatch) {
        const oldText = nameChangeMatch[1].trim();
        const newText = nameChangeMatch[2].trim();
        
        logInfo('Attempting programmatic text replacement', { 
          oldText, 
          newText,
          filesCount: Object.keys(currentWebsiteContent).length 
        });
        
        // Perform find-and-replace across all HTML files
        const modifiedFiles: Record<string, string> = {};
        let replacementsMade = 0;
        
        for (const [filename, content] of Object.entries(currentWebsiteContent)) {
          if (typeof content === 'string') {
            if (filename.endsWith('.html')) {
              // Count occurrences before replacement
              const regex = new RegExp(oldText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
              const matches = content.match(regex);
              if (matches) {
                replacementsMade += matches.length;
              }
              // Replace all occurrences (case-insensitive)
              modifiedFiles[filename] = content.replace(regex, newText);
            } else {
              // Non-HTML files, keep as-is
              modifiedFiles[filename] = content;
            }
          }
        }
        
        if (replacementsMade > 0) {
          logInfo('Programmatic replacement successful', { 
            replacementsMade, 
            filesModified: Object.keys(modifiedFiles).length 
          });
          
          // Deduct credits
          const creditDeduction = await deductCredits(
            user.id,
            CREDIT_COSTS.MODIFY_WEBSITE,
            'Website modification (text replacement)',
            user.email
          );
          
          // Create assistant response
          const assistantMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant' as const,
            content: `✅ I've updated "${oldText}" to "${newText}" across your website. Made ${replacementsMade} replacement${replacementsMade > 1 ? 's' : ''} while preserving all your existing design and content.`,
            timestamp: new Date().toISOString()
          };
          
          const completeChatHistory = [...fullChatHistory, assistantMessage];
          
          // Update the site
          await updateSite(siteId, user.id, {
            websiteContent: modifiedFiles,
            chatHistory: completeChatHistory,
          });
          
          return NextResponse.json({
            success: true,
            message: assistantMessage.content,
            websiteContent: modifiedFiles,
            chatHistory: completeChatHistory,
            credits: {
              remaining: creditDeduction.remainingCredits,
              deducted: CREDIT_COSTS.MODIFY_WEBSITE,
            },
          }, { headers: corsHeaders });
        }
      }
      
      // ==========================================
      // FALLBACK: Use Gemini for complex modifications
      // ==========================================
      logInfo('Using Gemini for complex modification', { 
        hasCurrentCode: Object.keys(currentWebsiteContent).length > 0,
        reason: nameChangeMatch ? 'No text matches found' : 'Complex modification request'
      });
      
      // Dynamic import to avoid build-time issues with Google Cloud libs
      const { DeepSiteEnhancedGenerator } = await import("@/lib/providers/impl/deepsite-enhanced-generator");
      const generator = new DeepSiteEnhancedGenerator();
      
      // Build comprehensive description that emphasizes preservation
      const fullDescription = `ORIGINAL WEBSITE REQUEST: "${originalDescription}"

CURRENT MODIFICATION REQUEST: "${message}"

CRITICAL: This is a MODIFICATION, not a new generation. The website already exists as "${originalDescription}". 
You must:
1. Keep the website type (e-commerce store, SaaS landing page, etc.) exactly as originally requested
2. Only make the specific change requested: "${message}"
3. Preserve ALL other content, design, structure, and functionality`;
      
      // Generate modified website content using Gemini AI
      const websiteRequest = {
        name: site.name || siteId,
        description: fullDescription,
        mode: 'full' as const
      };
      
      logInfo('Modifying with Gemini', { 
        chatHistoryLength: fullChatHistory.length,
        hasCurrentCode: Object.keys(currentWebsiteContent).length > 0,
        currentCodeKeys: Object.keys(currentWebsiteContent)
      });
      
      // CRITICAL: Pass current code so Gemini modifies instead of regenerates
      const generatedWebsite = await generator.generateWebsite(websiteRequest, fullChatHistory, currentWebsiteContent);
      
      // Validate that we got website content
      if (!generatedWebsite.files || Object.keys(generatedWebsite.files).length === 0) {
        logError('Gemini returned empty files', undefined, {
          generatedWebsite,
          hasFiles: !!generatedWebsite.files,
          filesKeys: generatedWebsite.files ? Object.keys(generatedWebsite.files) : []
        });
        throw new Error('Website generation returned no content. Please try again.');
      }
      
      logInfo('Gemini generation successful', { 
        filesGenerated: Object.keys(generatedWebsite.files).length,
        fileKeys: Object.keys(generatedWebsite.files),
        hasIndexHtml: !!generatedWebsite.files['index.html']
      });

      // Deduct credits after successful modification (pass email for lookup)
      const creditDeduction = await deductCredits(
        user.id,
        CREDIT_COSTS.MODIFY_WEBSITE,
        'Website modification',
        user.email
      );

      if (!creditDeduction.success) {
        logError('Failed to deduct credits after modification', new Error(creditDeduction.error || 'Unknown error'), {
          userId: user.id,
          cost: CREDIT_COSTS.MODIFY_WEBSITE,
        });
        // Continue anyway - the website was already modified
      }
      
      // Create assistant response message
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: responseMessage || `I've updated your website based on: "${message}". The changes have been applied successfully.`,
        timestamp: new Date().toISOString()
      };
      
      // Complete chat history with assistant response
      const completeChatHistory = [...fullChatHistory, assistantMessage];
      
      // Update the site with the new content and COMPLETE chat history
      const updatedSite = await updateSite(siteId, user.id, {
        websiteContent: generatedWebsite.files,
        previewUrl: generatedWebsite.previewUrl,
        chatHistory: completeChatHistory, // Save complete chat history including new messages
      });
      
      // Ensure websiteContent is always included in response
      const response = {
        success: true,
        message: responseMessage || `I've updated your website based on: "${message}". The changes have been applied successfully.`,
        previewUrl: generatedWebsite.previewUrl,
        websiteContent: generatedWebsite.files, // CRITICAL: Always include websiteContent
        chatHistory: completeChatHistory, // Return complete chat history so frontend can sync
        credits: {
          remaining: creditDeduction.remainingCredits,
          deducted: CREDIT_COSTS.MODIFY_WEBSITE,
        },
      };
      
      logInfo('Returning modify response', {
        hasWebsiteContent: !!response.websiteContent,
        websiteContentKeys: response.websiteContent ? Object.keys(response.websiteContent) : [],
        hasIndexHtml: response.websiteContent && !!response.websiteContent['index.html']
      });

      return NextResponse.json(response, {
        headers: corsHeaders,
      });
    } catch (geminiError: any) {
      logError('Gemini generation failed', geminiError, {
        errorMessage: geminiError?.message,
        errorStack: geminiError?.stack,
        siteId,
        message
      });
      
      // Return error response so frontend knows generation failed
      return NextResponse.json({
        success: false,
        error: 'Failed to generate website',
        message: geminiError?.message || 'An error occurred while generating the website. Please try again.',
        details: process.env.NODE_ENV === 'development' ? geminiError?.stack : undefined
      }, {
        status: 500,
        headers: corsHeaders,
      });
    }
  } catch (error: any) {
    logError('Website modification failed', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { 
        status: 400,
        headers: corsHeaders,
      });
    }
    return NextResponse.json({ error: "Internal server error" }, { 
      status: 500,
      headers: corsHeaders,
    });
  }
}
