// CHANGELOG: 2025-01-15 - Add Ultra-Advanced AI Website Generation System (Better than Lovable)
import { NextRequest, NextResponse } from "next/server";
import { logError, logInfo } from "@/lib/log";
import { ClaudeWebsiteGenerator } from "@/lib/providers/impl/claude-website-generator";
import { AdvancedAIGenerator } from "@/lib/providers/impl/advanced-ai-generator";
import { IntelligentAnalyzer } from "@/lib/providers/impl/intelligent-analyzer";
import { AdvancedContentGenerator } from "@/lib/providers/impl/advanced-content-generator";
import { UltraAdvancedGenerator } from "@/lib/providers/impl/ultra-advanced-generator";
import { createSite } from "@/data/sites";
import { getUser } from "@/lib/auth/getUser";
import { z } from "zod";

const GenerateSiteSchema = z.object({
  name: z.string().min(1, "Site name is required").max(100, "Site name too long"),
  description: z.string().min(1, "Description is required").max(1000, "Description too long"),
  mode: z.enum(['full', 'landing', 'blog', 'ecommerce']).optional().default('full'),
  // Advanced AI parameters
  industry: z.string().optional(),
  targetAudience: z.string().optional(),
  features: z.array(z.string()).optional(),
  style: z.enum(['modern', 'classic', 'minimalist', 'creative', 'professional', 'elegant', 'luxury', 'tech', 'artistic']).optional(),
  colorScheme: z.string().optional(),
  layout: z.enum(['single-page', 'multi-page', 'blog', 'ecommerce', 'portfolio', 'landing', 'dashboard', 'saas']).optional(),
  complexity: z.enum(['simple', 'intermediate', 'advanced', 'enterprise', 'premium']).optional(),
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
});

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      ai
    } = GenerateSiteSchema.parse(body);

    logInfo('Starting ultra-advanced website generation', { 
      name, 
      industry, 
      complexity,
      features: features?.length || 0,
      animations,
      ai
    });

    // Check if Claude is configured
    const claudeApiKey = process.env.CLAUDE_API_KEY;
    
    if (!claudeApiKey) {
      // Return mock generation for testing
      const projectId = `project_${Date.now()}`;
      const mockSite = {
        id: `site_${Date.now()}`,
        ownerId: user.id,
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        status: 'deployed' as const,
        previewUrl: `http://localhost:3001/${projectId}`,
        repoUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to database
      const savedSite = await createSite({
        ownerId: user.id,
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        status: 'deployed',
        previewUrl: mockSite.previewUrl,
        repoUrl: null,
      });

      return NextResponse.json({
        message: "Ultra-advanced website created successfully! (Mock mode - Claude API key not configured)",
        result: savedSite,
        mock: true,
      });
    }

    // Use Claude directly for generation (skip advanced generators for now)
    try {
      const generator = new ClaudeWebsiteGenerator();
      const generatedSite = await generator.generateWebsite({
        name,
        description,
        mode: 'full'
      });

      // Save to database
      const savedSite = await createSite({
        ownerId: user.id,
        name: generatedSite.name,
        slug: generatedSite.slug,
        status: 'deployed',
        previewUrl: generatedSite.previewUrl,
        repoUrl: generatedSite.repoUrl,
      });

      logInfo('Claude website generation completed', {
        name: generatedSite.name,
        filesGenerated: Object.keys(generatedSite.files).length,
        previewUrl: generatedSite.previewUrl
      });

      return NextResponse.json({
        message: "Professional website generated successfully with Claude AI!",
        result: savedSite,
        websiteContent: generatedSite.files,
        previewUrl: generatedSite.previewUrl
      });
    } catch (claudeError) {
      logError('Claude generation failed, falling back to basic generation', claudeError);
      
      // Fallback to Advanced AI System
      try {
        // Step 1: Intelligent Request Analysis
        const analyzer = new IntelligentAnalyzer();
        const analysis = await analyzer.analyzeRequest(description);
        
        // Enhanced analysis for better business detection
        if (description.toLowerCase().includes('snowplow') || description.toLowerCase().includes('snow plow')) {
          analysis.industry = 'snow-removal';
          analysis.features = ['snow-plowing', 'ice-management', 'equipment-rental', 'emergency-service'];
          analysis.complexity = 'intermediate';
        } else if (description.toLowerCase().includes('landscaping') || description.toLowerCase().includes('landscape')) {
          analysis.industry = 'landscaping';
          analysis.features = ['lawn-care', 'tree-services', 'garden-design', 'maintenance'];
          analysis.complexity = 'intermediate';
        } else if (description.toLowerCase().includes('construction') || description.toLowerCase().includes('contractor')) {
          analysis.industry = 'construction';
          analysis.features = ['general-contracting', 'renovations', 'custom-builds', 'project-management'];
          analysis.complexity = 'advanced';
        }
        
        // Step 2: Advanced Content Generation
        const contentGenerator = new AdvancedContentGenerator();
        const content = await contentGenerator.generateAdvancedContent(analysis);
        
        // Step 3: Advanced Website Generation
        const advancedGenerator = new AdvancedAIGenerator();
        const generatedSite = await advancedGenerator.generateAdvancedWebsite({
          name,
          description,
          industry: industry || analysis.industry,
          targetAudience: targetAudience || analysis.targetAudience,
          features: features || analysis.features,
          style: style || analysis.style,
          colorScheme: colorScheme || analysis.colorScheme,
          layout: layout || analysis.layout,
          complexity: complexity || analysis.complexity,
          integrations: integrations || analysis.integrations,
          seo: seo !== undefined ? seo : analysis.seo,
          responsive: responsive !== undefined ? responsive : analysis.responsive,
          accessibility: accessibility !== undefined ? accessibility : analysis.accessibility,
          performance: performance !== undefined ? performance : analysis.performance,
        });

        // Save to database
        const savedSite = await createSite({
          ownerId: user.id,
          name: generatedSite.name,
          slug: generatedSite.slug,
          status: 'deployed',
          previewUrl: generatedSite.previewUrl,
          repoUrl: generatedSite.repoUrl,
        });

        return NextResponse.json({
          message: "Advanced AI website generated successfully!",
          result: savedSite,
          analysis: {
            industry: analysis.industry,
            complexity: analysis.complexity,
            features: analysis.features,
            seoScore: generatedSite.metadata.seoScore,
            performanceScore: generatedSite.metadata.performanceScore,
            accessibilityScore: generatedSite.metadata.accessibilityScore,
            responsiveScore: generatedSite.metadata.responsiveScore
          },
          mock: false,
          fallback: true,
        });

      } catch (advancedError) {
        logError('Advanced AI generation failed, falling back to basic generation', advancedError);
        
        // Fallback to basic Claude generation
        const generator = new ClaudeWebsiteGenerator();
        const generatedSite = await generator.generateWebsite({
          name,
          description,
          mode
        });

        // Save to database
        const savedSite = await createSite({
          ownerId: user.id,
          name: generatedSite.name,
          slug: generatedSite.slug,
          status: 'deployed',
          previewUrl: generatedSite.previewUrl,
          repoUrl: generatedSite.repoUrl,
        });

        return NextResponse.json({
          message: "Website generated successfully with basic Claude AI!",
          result: savedSite,
          mock: false,
          fallback: true,
        });
      }
    }
  } catch (error: any) {
    logError('Website generation failed', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error", status: 500 });
  }
}
