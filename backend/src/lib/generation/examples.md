# Example Request/Response Payloads

## 1. Generate SiteSpec

**POST /api/generate/spec**

Request:
```json
{
  "prompt": "Make a modern website for my barbershop with online booking and pricing",
  "chatHistory": []
}
```

Response:
```json
{
  "success": true,
  "spec": {
    "version": "1.0.0",
    "project": {
      "name": "Modern Barbershop",
      "slug": "modern-barbershop",
      "description": "Professional barbershop with online booking"
    },
    "brand": {
      "name": "Modern Barbershop",
      "tagline": "Classic Cuts, Modern Style",
      "colors": {
        "primary": "#1F2937",
        "secondary": "#F59E0B",
        "accent": "#DC2626",
        "background": "#FFFFFF",
        "text": "#111827"
      },
      "fonts": {
        "heading": "Inter",
        "body": "Inter"
      }
    },
    "pages": [
      {
        "id": "home",
        "path": "/",
        "title": "Home - Modern Barbershop",
        "description": "Professional barbershop services",
        "sections": [
          {
            "id": "hero-1",
            "type": "hero",
            "title": "Classic Cuts, Modern Style",
            "subtitle": "Professional barbering services",
            "order": 0,
            "visible": true
          },
          {
            "id": "services-1",
            "type": "services",
            "title": "Our Services",
            "order": 1,
            "visible": true
          },
          {
            "id": "pricing-1",
            "type": "pricing",
            "title": "Pricing",
            "order": 2,
            "visible": true
          },
          {
            "id": "cta-1",
            "type": "cta",
            "title": "Book Your Appointment",
            "order": 3,
            "visible": true
          }
        ],
        "seo": {
          "title": "Modern Barbershop - Professional Haircuts",
          "description": "Book your appointment online",
          "keywords": ["barbershop", "haircuts", "grooming"]
        }
      },
      {
        "id": "about",
        "path": "/about",
        "title": "About Us",
        "sections": [
          {
            "id": "about-1",
            "type": "about",
            "title": "Our Story",
            "order": 0,
            "visible": true
          }
        ]
      },
      {
        "id": "booking",
        "path": "/booking",
        "title": "Book Appointment",
        "sections": [
          {
            "id": "contact-1",
            "type": "contact",
            "title": "Book Your Appointment",
            "order": 0,
            "visible": true
          }
        ]
      }
    ],
    "integrations": [
      {
        "type": "form",
        "enabled": true,
        "config": {
          "type": "booking"
        }
      }
    ]
  },
  "message": "SiteSpec generated successfully"
}
```

## 2. Generate Code from Spec

**POST /api/generate/code**

Request:
```json
{
  "spec": { /* SiteSpec object */ },
  "projectId": "project_123"
}
```

Response:
```json
{
  "success": true,
  "fileMap": {
    "app/layout.tsx": "import type { Metadata } from 'next'...",
    "app/page.tsx": "import { Hero } from '@/components/sections/Hero'...",
    "app/about/page.tsx": "...",
    "components/sections/Hero.tsx": "...",
    "tailwind.config.ts": "...",
    "package.json": "{ ... }"
  },
  "validation": {
    "valid": true,
    "warnings": []
  }
}
```

## 3. Iterate (Modify)

**POST /api/iterate**

Request:
```json
{
  "projectId": "project_123",
  "version": 1,
  "request": "change theme to pastel green",
  "currentSpec": { /* current SiteSpec */ }
}
```

Response:
```json
{
  "success": true,
  "spec": { /* updated SiteSpec */ },
  "changedFiles": {
    "app/layout.tsx": "...",
    "tailwind.config.ts": "..."
  },
  "filesRegenerated": [
    "app/layout.tsx",
    "tailwind.config.ts"
  ]
}
```

## 4. Unified Generation (Recommended)

**POST /api/generate/unified**

Request:
```json
{
  "prompt": "Make a modern website for my barbershop with online booking and pricing",
  "name": "Modern Barbershop",
  "chatHistory": []
}
```

Response:
```json
{
  "success": true,
  "project": {
    "id": "project_123",
    "name": "Modern Barbershop",
    "slug": "modern-barbershop"
  },
  "version": {
    "id": "version_456",
    "version": 1
  },
  "spec": { /* SiteSpec */ },
  "fileMap": { /* code files */ },
  "validation": {
    "spec": { "valid": true, "errors": [], "warnings": [] },
    "code": { "valid": true, "errors": [], "warnings": [] }
  },
  "previewUrl": "http://localhost:3001/project_123"
}
```
