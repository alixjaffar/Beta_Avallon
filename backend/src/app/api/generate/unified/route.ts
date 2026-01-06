/**
 * POST /api/generate/unified
 * Unified endpoint: Prompt → Spec → Code → Validate → Return
 * This is the main entry point for website generation
 */
import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth/getUser';
import { SiteSpecGenerator } from '@/lib/generation/spec-generator';
import { CodeGenerator } from '@/lib/generation/code-generator';
import { SiteValidator } from '@/lib/generation/validator';
import { hasEnoughCredits, deductCredits, CREDIT_COSTS } from '@/lib/billing/credits';
import { logInfo, logError } from '@/lib/log';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import * as path from 'path';

const prisma = new PrismaClient();

const UnifiedGenerateSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  name: z.string().optional(),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
    timestamp: z.any().optional()
  })).optional(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
    }

    const body = await req.json();
    const { prompt, name, chatHistory = [] } = UnifiedGenerateSchema.parse(body);

    // Check credits
    const creditCheck = await hasEnoughCredits(user.id, CREDIT_COSTS.GENERATE_WEBSITE, user.email);
    if (!creditCheck.hasEnough) {
      return NextResponse.json({
        error: 'Insufficient credits',
        message: `You need ${creditCheck.requiredCredits} credits to generate a website.`,
        credits: creditCheck
      }, { status: 402, headers: corsHeaders });
    }

    logInfo('Starting unified generation', {
      userId: user.id,
      prompt: prompt.substring(0, 100)
    });

    // Step 1: Generate SiteSpec
    const specGenerator = new SiteSpecGenerator();
    const spec = await specGenerator.generateSpec(prompt, chatHistory);

    // Update project name if provided
    if (name) {
      spec.project.name = name;
      spec.project.slug = name.toLowerCase().replace(/\s+/g, '-');
    }

    // Step 2: Validate Spec
    const validator = new SiteValidator();
    const specValidation = validator.validateSpec(spec);
    
    if (!specValidation.valid) {
      return NextResponse.json({
        error: 'SiteSpec validation failed',
        details: specValidation.errors,
        warnings: specValidation.warnings
      }, { status: 400, headers: corsHeaders });
    }

    // Step 3: Generate Code
    const codeGenerator = new CodeGenerator();
    const fileMap = await codeGenerator.generateCode(spec);

    // Step 4: Validate Code
    const codeValidation = validator.validateCode(fileMap, spec);
    
    if (!codeValidation.valid) {
      logError('Code validation failed', undefined, {
        errors: codeValidation.errors,
        warnings: codeValidation.warnings
      });
    }

    // Step 5: Try to create Project and Version in database (optional - skip if tables don't exist)
    let project: any = null;
    try {
      project = await prisma.project.create({
        data: {
          ownerId: user.id,
          name: spec.project.name,
          slug: spec.project.slug,
          description: spec.project.description,
          workspacePath: path.join(process.cwd(), 'generated-projects', `project_${Date.now()}`),
          versions: {
            create: {
              version: 1,
              spec: spec as any,
              prompt: prompt,
              codeFiles: fileMap as any,
              status: codeValidation.valid ? 'validated' : 'generated'
            }
          }
        },
        include: {
          versions: true
        }
      });

      // Step 6: Write files to workspace
      if (project.workspacePath) {
        await codeGenerator.writeFiles(project.workspacePath, fileMap);
      }
      
      logInfo('✅ Project saved to database', { projectId: project.id });
    } catch (dbError: any) {
      // If database tables don't exist yet, continue without saving
      logInfo('⚠️ Skipping database save (tables may not exist yet)', { error: dbError.message });
    }

    // Step 7: Deduct credits
    await deductCredits(
      user.id,
      CREDIT_COSTS.GENERATE_WEBSITE,
      'Website generation',
      user.email
    );

    logInfo('✅ Unified generation completed', {
      projectId: project?.id || 'none',
      fileCount: Object.keys(fileMap).length
    });

    return NextResponse.json({
      success: true,
      project: project ? {
        id: project.id,
        name: project.name,
        slug: project.slug
      } : {
        id: `temp_${Date.now()}`,
        name: spec.project.name,
        slug: spec.project.slug
      },
      version: project ? {
        id: project.versions[0].id,
        version: project.versions[0].version
      } : {
        id: `temp_v1_${Date.now()}`,
        version: 1
      },
      spec,
      fileMap,
      validation: {
        spec: specValidation,
        code: codeValidation
      },
      previewUrl: `http://localhost:3001/project_${project?.id || Date.now()}`,
      message: 'Website generated successfully using spec-first architecture'
    }, { headers: corsHeaders });

  } catch (error: any) {
    logError('Unified generation failed', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to generate website' },
      { status: 500, headers: corsHeaders }
    );
  }
}
