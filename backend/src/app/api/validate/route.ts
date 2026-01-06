/**
 * POST /api/validate
 * Validate SiteSpec and/or generated code
 */
import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth/getUser';
import { SiteValidator } from '@/lib/generation/validator';
import { SiteSpecSchema } from '@/lib/generation/site-spec';
import { logInfo } from '@/lib/log';
import { z } from 'zod';

const ValidateSchema = z.object({
  spec: SiteSpecSchema.optional(),
  code: z.record(z.string()).optional(), // file map
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
    const { spec, code } = ValidateSchema.parse(body);

    const validator = new SiteValidator();
    const results: any = {};

    // Validate spec if provided
    if (spec) {
      const specValidation = validator.validateSpec(spec);
      results.spec = specValidation;
      logInfo('SiteSpec validation', {
        valid: specValidation.valid,
        errors: specValidation.errors.length,
        warnings: specValidation.warnings.length
      });
    }

    // Validate code if provided
    if (code && spec) {
      const codeValidation = validator.validateCode(code, spec);
      results.code = codeValidation;
      logInfo('Code validation', {
        valid: codeValidation.valid,
        errors: codeValidation.errors.length,
        warnings: codeValidation.warnings.length
      });
    }

    const allValid = Object.values(results).every((r: any) => r.valid !== false);

    return NextResponse.json({
      success: allValid,
      validation: results,
      message: allValid ? 'Validation passed' : 'Validation failed'
    }, { headers: corsHeaders });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Validation failed' },
      { status: 500, headers: corsHeaders }
    );
  }
}
