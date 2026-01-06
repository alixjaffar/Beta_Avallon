/**
 * POST /api/iterate
 * Iteratively modify SiteSpec and regenerate only changed files
 */
import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth/getUser';
import { SiteIterator } from '@/lib/generation/iterator';
import { CodeGenerator } from '@/lib/generation/code-generator';
import { SiteValidator } from '@/lib/generation/validator';
import { SiteSpecSchema } from '@/lib/generation/site-spec';
import { logInfo, logError } from '@/lib/log';
import { z } from 'zod';
import * as path from 'path';
import * as fs from 'fs';

const IterateSchema = z.object({
  projectId: z.string(),
  version: z.number().optional(),
  request: z.string().min(1, 'Iteration request is required'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
    timestamp: z.any().optional()
  })).optional(),
  currentSpec: SiteSpecSchema.optional(),
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
    const { projectId, version, request, chatHistory = [], currentSpec } = IterateSchema.extend({
      currentSpec: SiteSpecSchema.optional()
    }).parse(body);

    logInfo('Processing iteration', {
      userId: user.id,
      projectId,
      version,
      request: request.substring(0, 100)
    });

    // TODO: Load current spec from database (Project -> SiteVersion) if not provided
    // For MVP, accept currentSpec in request
    
    if (!currentSpec) {
      return NextResponse.json(
        { error: 'Current SiteSpec required for iteration' },
        { status: 400, headers: corsHeaders }
      );
    }

    const validatedCurrentSpec = SiteSpecSchema.parse(currentSpec);
    const iterator = new SiteIterator();
    
    // Generate partial spec (diff)
    const partialSpec = await iterator.generateIteration(request, validatedCurrentSpec, chatHistory);
    
    // Merge with current spec
    const updatedSpec = iterator.mergeSpec(validatedCurrentSpec, partialSpec);
    
    // Validate updated spec
    const validator = new SiteValidator();
    const validation = validator.validateSpec(updatedSpec);
    
    if (!validation.valid) {
      return NextResponse.json({
        error: 'Invalid updated SiteSpec',
        details: validation.errors
      }, { status: 400, headers: corsHeaders });
    }

    // Determine which files need regeneration
    const filesToRegenerate = iterator.getFilesToRegenerate(validatedCurrentSpec, updatedSpec);
    
    logInfo('Files to regenerate', {
      count: filesToRegenerate.length,
      files: filesToRegenerate
    });

    // Generate code for only changed files
    const codeGenerator = new CodeGenerator();
    const fullFileMap = await codeGenerator.generateCode(updatedSpec);
    
    // Filter to only changed files (for efficiency)
    const changedFiles: Record<string, string> = {};
    filesToRegenerate.forEach(filePath => {
      if (fullFileMap[filePath]) {
        changedFiles[filePath] = fullFileMap[filePath];
      }
    });

    // Write only changed files
    if (projectId) {
      const workspacePath = path.join(process.cwd(), 'generated-projects', projectId);
      
      // Load existing files
      const existingFiles: Record<string, string> = {};
      if (fs.existsSync(workspacePath)) {
        // Read existing files (simplified - would need recursive read)
        Object.keys(changedFiles).forEach(filePath => {
          const fullPath = path.join(workspacePath, filePath);
          if (fs.existsSync(fullPath)) {
            existingFiles[filePath] = fs.readFileSync(fullPath, 'utf8');
          }
        });
      }
      
      // Write only changed files
      await codeGenerator.writeFiles(workspacePath, changedFiles);
    }

    return NextResponse.json({
      success: true,
      spec: updatedSpec,
      changedFiles,
      filesRegenerated: filesToRegenerate,
      message: 'Iteration completed successfully'
    }, { headers: corsHeaders });

  } catch (error: any) {
    logError('Iteration failed', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to process iteration' },
      { status: 500, headers: corsHeaders }
    );
  }
}
