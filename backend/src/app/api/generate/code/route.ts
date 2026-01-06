/**
 * POST /api/generate/code
 * Generate Next.js code from SiteSpec
 */
import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth/getUser';
import { CodeGenerator } from '@/lib/generation/code-generator';
import { SiteValidator } from '@/lib/generation/validator';
import { SiteSpecSchema } from '@/lib/generation/site-spec';
import { logInfo, logError } from '@/lib/log';
import { z } from 'zod';
import * as path from 'path';

const GenerateCodeSchema = z.object({
  spec: SiteSpecSchema,
  projectId: z.string().optional(),
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
    const { spec, projectId } = GenerateCodeSchema.parse(body);

    // Validate spec first
    const validator = new SiteValidator();
    const specValidation = validator.validateSpec(spec);
    
    if (!specValidation.valid) {
      return NextResponse.json({
        error: 'Invalid SiteSpec',
        details: specValidation.errors,
        warnings: specValidation.warnings
      }, { status: 400, headers: corsHeaders });
    }

    logInfo('Generating code from SiteSpec', {
      userId: user.id,
      projectId,
      pagesCount: spec.pages.length
    });

    const generator = new CodeGenerator();
    const fileMap = await generator.generateCode(spec);

    // Validate generated code
    const codeValidation = validator.validateCode(fileMap, spec);
    
    if (!codeValidation.valid) {
      logError('Code validation failed', undefined, {
        errors: codeValidation.errors,
        warnings: codeValidation.warnings
      });
      
      return NextResponse.json({
        error: 'Generated code validation failed',
        details: codeValidation.errors,
        warnings: codeValidation.warnings,
        fileMap // Still return files even if validation fails (warnings only)
      }, { status: 400, headers: corsHeaders });
    }

    // Write files to workspace if projectId provided
    if (projectId) {
      const workspacePath = path.join(process.cwd(), 'generated-projects', projectId);
      await generator.writeFiles(workspacePath, fileMap);
    }

    return NextResponse.json({
      success: true,
      fileMap,
      validation: {
        valid: codeValidation.valid,
        warnings: codeValidation.warnings
      },
      message: 'Code generated successfully'
    }, { headers: corsHeaders });

  } catch (error: any) {
    logError('Code generation failed', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to generate code' },
      { status: 500, headers: corsHeaders }
    );
  }
}
