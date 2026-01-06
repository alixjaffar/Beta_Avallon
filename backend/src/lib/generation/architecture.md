# Avallon AI Website Generator - Architecture Overview

## Core Principle: Deterministic Spec-First Generation

**Flow:** User Prompt → SiteSpec (JSON) → Codegen → Validate → Preview

Never generate code directly from user text. Always generate structured SiteSpec first, then code from that spec.

## Architecture Layers

1. **Spec Generation Layer** (`/api/generate/spec`)
   - Takes user prompt
   - Uses Gemini 3 Pro to generate SiteSpec JSON
   - Validates with Zod schema
   - Saves to database

2. **Code Generation Layer** (`/api/generate/code`)
   - Takes SiteSpec JSON
   - Uses Gemini 3 Pro to generate Next.js code
   - Creates structured file map (path → content)
   - Writes to project workspace

3. **Validation Layer** (`/api/validate`)
   - Validates SiteSpec structure
   - Validates generated code (required pages, props, Tailwind classes)
   - Prevents invalid imports

4. **Iteration Layer** (`/api/iterate`)
   - Takes user modification request
   - Generates updated SiteSpec (or partial spec)
   - Diffs against current spec
   - Only regenerates affected files
   - Maintains version history

## Data Model

- **Project**: Top-level container
- **SiteVersion**: Each generation/iteration creates a new version
- **SiteSpec**: Structured JSON specification (brand, pages, sections, components, content, assets, integrations)
- **Assets**: Image placeholders and references

## Key Benefits

- **Deterministic**: Same spec = same code
- **Editable**: Can modify spec without regenerating everything
- **Versioned**: Full history with rollback
- **Safe Iteration**: Only updates what changed
- **Validated**: Ensures quality before codegen
