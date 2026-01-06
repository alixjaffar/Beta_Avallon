# Avallon AI Website Generator - Complete Architecture

## 1. Architecture Overview

**Principle**: Deterministic Spec-First Generation

```
User Prompt 
  ↓
Gemini 3.0 Pro → SiteSpec JSON (structured, validated)
  ↓
Gemini 3.0 Pro → Next.js Code (from spec, not freehand)
  ↓
Validation (spec + code)
  ↓
Save to Database (versioned)
  ↓
Write Files to Workspace
  ↓
Preview + Deploy
```

**Key Difference from Old System:**
- ❌ Old: User Prompt → Direct HTML generation (unstructured, non-deterministic)
- ✅ New: User Prompt → SiteSpec → Code (structured, deterministic, editable)

## 2. Folder Structure

```
backend/
├── src/
│   ├── lib/
│   │   └── generation/              # NEW: Core generation library
│   │       ├── site-spec.ts          # Zod schema for SiteSpec
│   │       ├── spec-generator.ts     # Generates SiteSpec from prompt
│   │       ├── code-generator.ts     # Generates code from SiteSpec
│   │       ├── validator.ts          # Validates spec + code
│   │       ├── iterator.ts           # Handles iterative modifications
│   │       └── prompts/             # Gemini 3 Pro prompt templates
│   │           ├── spec.ts           # Prompt for spec generation
│   │           ├── codegen.ts        # Prompt for code generation
│   │           └── iterate.ts        # Prompt for iterations
│   │
│   └── app/
│       └── api/
│           └── generate/            # NEW: Spec-first API routes
│               ├── spec/
│               │   └── route.ts      # POST /api/generate/spec
│               ├── code/
│               │   └── route.ts     # POST /api/generate/code
│               ├── unified/
│               │   └── route.ts     # POST /api/generate/unified (recommended)
│               ├── iterate/
│               │   └── route.ts     # POST /api/iterate
│               └── validate/
│                   └── route.ts     # POST /api/validate
│
└── prisma/
    └── schema.prisma                 # Updated with Project, SiteVersion, Asset
```

## 3. Prisma Schema

```prisma
model Project {
  id            String        @id @default(cuid())
  ownerId       String
  owner         User          @relation(fields: [ownerId], references: [id])
  name          String
  slug          String        @unique
  description   String?
  site          Site?
  versions      SiteVersion[]
  assets        Asset[]
  workspacePath String?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

model SiteVersion {
  id              String   @id @default(cuid())
  projectId       String
  project         Project   @relation(fields: [projectId], references: [id])
  version         Int       @default(1)
  spec            Json     // SiteSpec JSON
  prompt          String?
  iterationPrompt String?
  codeFiles       Json?     // File map (path → content)
  status          String    @default("draft")
  previewUrl      String?
  deployedUrl     String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model Asset {
  id        String   @id @default(cuid())
  projectId String
  project   Project  @relation(fields: [projectId], references: [id])
  type      String
  url       String
  alt       String?
  width     Int?
  height    Int?
  context   String?
  metadata  Json?
  createdAt DateTime @default(now())
}
```

## 4. API Route Implementations

### POST /api/generate/spec
Generates SiteSpec from user prompt.

**Request:**
```json
{
  "prompt": "Make a modern website for my barbershop",
  "chatHistory": []
}
```

**Response:**
```json
{
  "success": true,
  "spec": { /* SiteSpec object */ }
}
```

### POST /api/generate/code
Generates Next.js code from SiteSpec.

**Request:**
```json
{
  "spec": { /* SiteSpec */ },
  "projectId": "project_123"
}
```

**Response:**
```json
{
  "success": true,
  "fileMap": {
    "app/layout.tsx": "...",
    "app/page.tsx": "..."
  }
}
```

### POST /api/generate/unified (Recommended)
Combines spec + code generation in one call.

**Request:**
```json
{
  "prompt": "Make a modern website for my barbershop",
  "name": "Modern Barbershop"
}
```

**Response:**
```json
{
  "success": true,
  "project": { "id": "...", "name": "...", "slug": "..." },
  "version": { "id": "...", "version": 1 },
  "spec": { /* SiteSpec */ },
  "fileMap": { /* code files */ },
  "validation": { "spec": {...}, "code": {...} },
  "previewUrl": "http://localhost:3001/project_123"
}
```

### POST /api/iterate
Iteratively modifies SiteSpec and regenerates only changed files.

**Request:**
```json
{
  "projectId": "project_123",
  "request": "change theme to pastel green",
  "currentSpec": { /* current spec */ }
}
```

**Response:**
```json
{
  "success": true,
  "spec": { /* updated spec */ },
  "changedFiles": { /* only changed files */ },
  "filesRegenerated": ["app/layout.tsx", "tailwind.config.ts"]
}
```

### POST /api/validate
Validates SiteSpec and/or generated code.

**Request:**
```json
{
  "spec": { /* SiteSpec */ },
  "code": { /* file map */ }
}
```

**Response:**
```json
{
  "success": true,
  "validation": {
    "spec": { "valid": true, "errors": [], "warnings": [] },
    "code": { "valid": true, "errors": [], "warnings": [] }
  }
}
```

## 5. Prompt Templates

### prompts/spec.ts
Generates SiteSpec JSON from user prompt.
- Uses Gemini 3.0 Pro
- Temperature: 0.3 (deterministic)
- Response format: JSON only
- Validates against Zod schema

### prompts/codegen.ts
Generates Next.js code from SiteSpec.
- Uses Gemini 3.0 Pro
- Temperature: 0.4 (slightly creative)
- Response format: JSON file map
- Generates complete Next.js 14 App Router structure

### prompts/iterate.ts
Generates partial SiteSpec (diff) for iterations.
- Uses Gemini 3.0 Pro
- Temperature: 0.3 (precise)
- Returns only changed fields
- Preserves website type and structure

## 6. Example Request/Response Payloads

See `src/lib/generation/examples.md` for detailed examples.

## 7. Key Features

### Deterministic Generation
- Same prompt → Same spec → Same code
- No randomness in structure
- Predictable output

### Editable Specs
- Can modify SiteSpec directly
- Regenerate code from updated spec
- No need to regenerate everything

### Version Control
- Every generation creates a new version
- Full history in database
- Can rollback to any version

### Safe Iteration
- Only regenerates changed files
- Preserves unchanged sections
- Faster iterations

### Validation
- Validates spec structure
- Validates generated code
- Catches errors before deployment

## 8. Migration Steps

1. **Run Prisma Migration:**
```bash
cd backend
npx prisma migrate dev --name add_spec_architecture
npx prisma generate
```

2. **Update Frontend:**
   - Change `/api/sites/generate` → `/api/generate/unified`
   - Handle new response format (spec + fileMap)

3. **Test:**
   - Generate: "Create a barbershop website"
   - Iterate: "Change theme to pastel green"
   - Verify only changed files are regenerated

## 9. Happy Path Commands

```bash
# 1. Start backend
cd backend
npm run dev

# 2. Test spec generation
curl -X POST http://localhost:3000/api/generate/spec \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Create a barbershop website"}'

# 3. Test unified generation
curl -X POST http://localhost:3000/api/generate/unified \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Create a barbershop website", "name": "Barbershop"}'
```

## 10. Benefits Over Old System

| Old System | New System |
|------------|------------|
| Direct HTML generation | SiteSpec → Code generation |
| Non-deterministic | Deterministic |
| Hard to edit | Easy to edit (modify spec) |
| No versioning | Full version history |
| Regenerates everything | Only regenerates changed files |
| No validation | Validates spec + code |
| Unstructured | Structured JSON spec |
