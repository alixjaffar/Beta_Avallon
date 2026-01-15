// CHANGELOG: 2025-01-15 - Unified Agent Builder API for prompt-based website generation
import { NextRequest, NextResponse } from "next/server";
import { logError, logInfo } from "@/lib/log";
import { getUser } from "@/lib/auth/getUser";
// GeminiWebsiteGenerator is dynamically imported to avoid build-time issues with Google Cloud libs
import { N8nProvider } from "@/lib/providers/impl/n8n";
import { createSite } from "@/data/sites";
import { createAgent } from "@/data/agents";
import { z } from "zod";
import { hasEnoughCredits, deductCredits, CREDIT_COSTS } from "@/lib/billing/credits";

const GenerateWebsiteAgentSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters").max(1000, "Prompt too long"),
  name: z.string().optional(),
  style: z.enum(['modern', 'classic', 'minimalist', 'creative']).optional().default('modern'),
  framework: z.enum(['react', 'next']).optional().default('react'),
  createAgent: z.boolean().optional().default(true),
});

/**
 * Unified endpoint that:
 * 1. Takes a user prompt
 * 2. Creates an n8n agent to handle the prompt
 * 3. Generates a website using Gemini AI (based on open-source AI Website Builder)
 * 4. Returns both the website and agent details
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { prompt, name, style, framework, createAgent: shouldCreateAgent } = GenerateWebsiteAgentSchema.parse(body);

    const siteName = name || prompt.substring(0, 50).trim() || `Website ${Date.now()}`;
    
    logInfo('Starting unified website generation', { 
      prompt: prompt.substring(0, 100), 
      siteName,
      style,
      framework,
      shouldCreateAgent
    });

    // Check if user has enough credits
    const creditCheck = await hasEnoughCredits(user.id, CREDIT_COSTS.GENERATE_WEBSITE);
    if (!creditCheck.hasEnough) {
      return NextResponse.json({
        error: "Insufficient credits",
        message: `You need ${creditCheck.requiredCredits} credits to generate a website, but you only have ${creditCheck.currentCredits} credits. Please upgrade your plan to get more credits.`,
        credits: {
          current: creditCheck.currentCredits,
          required: creditCheck.requiredCredits,
        },
      }, { status: 402 }); // Payment Required
    }

    // Step 1: Generate website using Gemini AI (based on open-source AI Website Builder)
    // Dynamic import to avoid build-time issues with Google Cloud libs
    const { GeminiWebsiteGenerator } = await import("@/lib/providers/impl/gemini-website-generator");
    const generator = new GeminiWebsiteGenerator();
    let websiteResult;
    
    try {
      websiteResult = await generator.generateWebsite({
        name: siteName,
        description: prompt,
        mode: 'full',
      });
      
      logInfo('Website generated successfully with Gemini', { 
        previewUrl: websiteResult.previewUrl,
        hasFiles: !!websiteResult.files 
      });
    } catch (error: any) {
      logError('Gemini website generation failed', error, { prompt });
      return NextResponse.json({ 
        error: "Failed to generate website", 
        details: error.message 
      }, { status: 500 });
    }

    // Step 2: Save website to database
    let savedSite;
    try {
      savedSite = await createSite({
        ownerId: user.id,
        name: siteName,
        slug: siteName.toLowerCase().replace(/\s+/g, '-'),
        status: 'deployed',
        previewUrl: websiteResult.previewUrl || `https://${siteName.toLowerCase().replace(/\s+/g, '-')}.vercel.app`,
        repoUrl: websiteResult.repoUrl || undefined,
      });
      
      logInfo('Website saved to database', { siteId: savedSite.id });
    } catch (error: any) {
      logError('Failed to save website', error);
      // Continue even if save fails
    }

    // Deduct credits after successful generation
    const creditDeduction = await deductCredits(
      user.id,
      CREDIT_COSTS.GENERATE_WEBSITE,
      'Website generation via agent'
    );

    if (!creditDeduction.success) {
      logError('Failed to deduct credits after generation', new Error(creditDeduction.error || 'Unknown error'), {
        userId: user.id,
        cost: CREDIT_COSTS.GENERATE_WEBSITE,
      });
      // Continue anyway - the website was already generated
    }

    // Step 3: Create n8n agent if requested
    let agentResult = null;
    if (shouldCreateAgent) {
      try {
        const n8nProvider = new N8nProvider();
        const agentPrompt = `You are an AI assistant that helps users generate and modify websites. 
        
The user has requested: "${prompt}"

A website has been generated at: ${websiteResult.previewUrl}

Your role is to:
- Answer questions about the generated website
- Help users modify the website based on their requests
- Provide guidance on website features and improvements
- Generate code snippets when needed

Always be helpful, professional, and focused on website generation and modification.`;

        const agentCreationResult = await n8nProvider.createAgent({
          name: `${siteName} Assistant`,
          prompt: agentPrompt,
        });

        // Save agent to database
        const savedAgent = await createAgent({
          ownerId: user.id,
          name: `${siteName} Assistant`,
          n8nId: agentCreationResult.externalId,
          status: "active",
        });

        agentResult = {
          id: savedAgent.id,
          name: savedAgent.name,
          n8nId: agentCreationResult.externalId,
          embedCode: agentCreationResult.embedCode,
          webhookUrl: `${process.env.N8N_BASE_URL || 'http://localhost:5678'}/webhook/${agentCreationResult.externalId}`,
        };

        logInfo('Agent created successfully', { agentId: savedAgent.id, n8nId: agentCreationResult.externalId });
      } catch (error: any) {
        logError('Agent creation failed', error, { prompt });
        // Don't fail the whole request if agent creation fails
        agentResult = {
          error: "Agent creation failed",
          details: error.message,
        };
      }
    }

    return NextResponse.json({
      success: true,
      message: "Website generated successfully!",
      website: {
        id: savedSite?.id,
        name: siteName,
        previewUrl: websiteResult.previewUrl,
        repoUrl: websiteResult.repoUrl,
        files: websiteResult.files ? Object.keys(websiteResult.files).length : 0,
      },
      agent: agentResult,
      metadata: {
        style,
        framework,
        generatedAt: new Date().toISOString(),
      },
      credits: {
        remaining: creditDeduction.remainingCredits,
        deducted: CREDIT_COSTS.GENERATE_WEBSITE,
      },
    });

  } catch (error: any) {
    logError('Unified generation failed', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ 
        error: "Invalid input", 
        details: error.errors 
      }, { status: 400 });
    }
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error.message 
    }, { status: 500 });
  }
}

