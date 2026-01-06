/**
 * POST /api/generate/spec
 * Generate SiteSpec from user prompt
 */
import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth/getUser';
import { SiteSpecGenerator } from '@/lib/generation/spec-generator';
import { logInfo, logError } from '@/lib/log';
import { z } from 'zod';

const GenerateSpecSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
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
    const { prompt, chatHistory = [] } = GenerateSpecSchema.parse(body);

    logInfo('Generating SiteSpec', {
      userId: user.id,
      prompt: prompt.substring(0, 100)
    });

    const generator = new SiteSpecGenerator();
    const spec = await generator.generateSpec(prompt, chatHistory);

    return NextResponse.json({
      success: true,
      spec,
      message: 'SiteSpec generated successfully'
    }, { headers: corsHeaders });

  } catch (error: any) {
    logError('SiteSpec generation failed', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to generate SiteSpec' },
      { status: 500, headers: corsHeaders }
    );
  }
}
