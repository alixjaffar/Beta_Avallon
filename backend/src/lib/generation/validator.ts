/**
 * Validator - Validates SiteSpec and generated code
 */
import { SiteSpec, SiteSpecSchema } from './site-spec';
import { CodeFileMap } from './code-generator';
import { logInfo, logError } from '@/lib/log';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export class SiteValidator {
  /**
   * Validate SiteSpec structure
   */
  validateSpec(spec: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Validate against Zod schema
      SiteSpecSchema.parse(spec);
    } catch (error: any) {
      if (error.errors) {
        error.errors.forEach((err: any) => {
          errors.push(`${err.path.join('.')}: ${err.message}`);
        });
      } else {
        errors.push(`Schema validation failed: ${error.message}`);
      }
    }

    // Additional business logic validations
    if (spec.pages && spec.pages.length === 0) {
      errors.push('SiteSpec must have at least one page');
    }

    // Check for required pages
    const pageIds = spec.pages?.map((p: any) => p.id) || [];
    if (!pageIds.includes('home') && !pageIds.includes('index')) {
      warnings.push('No home page found (recommended to have a page with id "home" or "index")');
    }

    // Validate color format
    if (spec.brand?.colors?.primary && !spec.brand.colors.primary.match(/^#[0-9A-Fa-f]{6}$/)) {
      errors.push('Primary color must be a valid hex color (e.g., #6366F1)');
    }

    // Validate page paths
    spec.pages?.forEach((page: any, index: number) => {
      if (!page.path) {
        errors.push(`Page ${index} (${page.id}) is missing a path`);
      }
      if (!page.path.startsWith('/')) {
        errors.push(`Page ${index} (${page.id}) path must start with "/"`);
      }
    });

    // Validate sections
    spec.pages?.forEach((page: any) => {
      if (!page.sections || page.sections.length === 0) {
        warnings.push(`Page "${page.id}" has no sections`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate generated code
   */
  validateCode(fileMap: CodeFileMap, spec: SiteSpec): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required files exist
    const requiredFiles = [
      'app/layout.tsx',
      'app/page.tsx',
      'package.json',
      'tsconfig.json',
      'tailwind.config.ts'
    ];

    requiredFiles.forEach(file => {
      if (!fileMap[file]) {
        errors.push(`Required file missing: ${file}`);
      }
    });

    // Check all pages have corresponding files
    spec.pages.forEach(page => {
      if (page.path === '/') {
        // Home page should be app/page.tsx (already checked)
        return;
      }
      
      const expectedPath = `app${page.path}/page.tsx`;
      if (!fileMap[expectedPath]) {
        warnings.push(`Page "${page.id}" (${page.path}) missing file: ${expectedPath}`);
      }
    });

    // Validate TypeScript files
    Object.entries(fileMap).forEach(([filePath, content]) => {
      if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        // Check for common issues
        if (content.includes('any') && !content.includes('// eslint-disable')) {
          warnings.push(`File ${filePath} uses 'any' type (consider using proper types)`);
        }

        // Check for required imports in Next.js files
        if (filePath.startsWith('app/') && filePath.endsWith('page.tsx')) {
          if (!content.includes('export default')) {
            errors.push(`Page ${filePath} must export a default component`);
          }
        }

        // Check for Tailwind classes (basic validation)
        const invalidClassPattern = /class=["']([^"']*\s{2,}[^"']*)["']/;
        if (invalidClassPattern.test(content)) {
          warnings.push(`File ${filePath} may have invalid Tailwind classes (double spaces)`);
        }
      }

      // Validate package.json
      if (filePath === 'package.json') {
        try {
          const pkg = JSON.parse(content);
          if (!pkg.dependencies || !pkg.dependencies.next) {
            errors.push('package.json missing Next.js dependency');
          }
          if (!pkg.dependencies || !pkg.dependencies.react) {
            errors.push('package.json missing React dependency');
          }
        } catch (e) {
          errors.push('package.json is not valid JSON');
        }
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}
