# Spec-First Website Generation Architecture

## Overview

This document describes the new deterministic, spec-first architecture for Avallon's AI Website Generator. The system follows a strict flow:

**User Prompt → SiteSpec (JSON) → Codegen → Validate → Preview**

## Architecture Layers

### 1. Spec Generation (`/api/generate/spec`)
- Takes user prompt
- Uses Gemini 3.0 Pro to generate structured SiteSpec JSON
- Validates with Zod schema
- Returns validated SiteSpec

### 2. Code Generation (`/api/generate/code`)
- Takes SiteSpec JSON
- Uses Gemini 3.0 Pro to generate Next.js 14 code
- Creates structured file map (path → content)
- Writes to project workspace

### 3. Validation (`/api/validate`)
- Validates SiteSpec structure
- Validates generated code (required pages, props, Tailwind classes)
- Prevents invalid imports

### 4. Iteration (`/api/iterate`)
- Takes user modification request
- Generates updated SiteSpec (partial/diff)
- Only regenerates affected files
- Maintains version history

### 5. Unified Endpoint (`/api/generate/unified`)
- Combines spec + code generation in one call
- Recommended for new website generation
- Handles credits, database, file writing

## Data Model

### Project
- Top-level container for a website project
- Links to Site model
- Has workspace path for generated files
- Owns versions and assets

### SiteVersion
- Each generation/iteration creates a new version
- Stores SiteSpec JSON
- Stores code file map
- Tracks status (draft, generated, validated, deployed)

### Asset
- Image/media references
- Placeholder URLs or actual storage URLs
- Metadata (alt text, dimensions, context)

## SiteSpec Structure

```typescript
{
  version: "1.0.0",
  project: {
    name: "Website Name",
    slug: "website-slug",
    description: "Description"
  },
  brand: {
    name: "Brand Name",
    colors: { primary: "#hex", secondary: "#hex", ... },
    fonts: { heading: "Font", body: "Font" }
  },
  pages: [
    {
      id: "home",
      path: "/",
      title: "Home",
      sections: [
        { id: "hero-1", type: "hero", ... },
        { id: "features-1", type: "features", ... }
      ]
    }
  ],
  integrations: [
    { type: "stripe", enabled: true }
  ]
}
```

## Key Benefits

1. **Deterministic**: Same spec = same code
2. **Editable**: Can modify spec without regenerating everything
3. **Versioned**: Full history with rollback
4. **Safe Iteration**: Only updates what changed
5. **Validated**: Ensures quality before codegen

## Usage

### Generate New Website

```typescript
POST /api/generate/unified
{
  "prompt": "Make a modern website for my barbershop with online booking",
  "name": "Modern Barbershop"
}
```

### Iterate on Existing Website

```typescript
POST /api/iterate
{
  "projectId": "project_123",
  "request": "change theme to pastel green",
  "currentSpec": { /* current spec */ }
}
```

## Migration

To use the new architecture:

1. Run Prisma migration:
```bash
cd backend
npx prisma migrate dev --name add_spec_architecture
npx prisma generate
```

2. Update frontend to call `/api/generate/unified` instead of `/api/sites/generate`

3. The new system will:
   - Generate SiteSpec first
   - Validate it
   - Generate code from spec
   - Validate code
   - Save to database with versioning

## Files Created

- `src/lib/generation/site-spec.ts` - Zod schema
- `src/lib/generation/spec-generator.ts` - Spec generation
- `src/lib/generation/code-generator.ts` - Code generation
- `src/lib/generation/validator.ts` - Validation
- `src/lib/generation/iterator.ts` - Iteration logic
- `src/lib/generation/prompts/` - Gemini 3 Pro prompts
- `src/app/api/generate/` - API routes
