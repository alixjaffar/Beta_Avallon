// CHANGELOG: 2025-10-11 - Refactor to use data access helpers
// CHANGELOG: 2024-12-19 - Add sites listing API endpoint
// CHANGELOG: 2025-01-15 - Add site creation API endpoint
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { listSitesByUser, createSite } from "@/data/sites";
import { getUniqueSlug } from "@/lib/slug";
import { logError } from "@/lib/log";
import { z } from "zod";
import { getCorsHeaders } from "@/lib/cors";

const CreateSiteSchema = z.object({
  name: z.string().min(1, "Site name is required").max(100, "Site name too long"),
  slug: z.string().min(1, "Slug is required").max(50, "Slug too long").optional(),
});

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(req),
  });
}

export async function GET(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  
  try {
    // Revert to using actual user and database for listing sites
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { 
        status: 401,
        headers: corsHeaders,
      });
    }
    const sites = await listSitesByUser(user.id);
    return NextResponse.json({ data: sites }, {
      headers: corsHeaders,
    });
  } catch (error: any) {
    logError('List sites failed', error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: error?.message || 'Unknown error'
    }, { 
      status: 500,
      headers: corsHeaders,
    });
  }
}

export async function POST(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { 
        status: 401,
        headers: corsHeaders,
      });
    }

    const body = await req.json();
    const validated = CreateSiteSchema.parse(body);
    
    // Generate unique slug
    const baseSlug = (validated.slug || validated.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const slug = await getUniqueSlug(baseSlug); // Assuming getUniqueSlug handles uniqueness

    // Create site in the database
    // Use 'generating' status if provided, otherwise 'draft'
    const status = body.status === 'generating' ? 'generating' : 'draft';
    
    const newSite = await createSite({
      ownerId: user.id,
      name: validated.name,
      slug,
      status,
    });
    
    return NextResponse.json({ 
      message: "Site created successfully", 
      result: newSite 
    }, {
      headers: corsHeaders,
    });
  } catch (error: any) {
    logError('Create site failed', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { 
        status: 400,
        headers: corsHeaders,
      });
    }
    return NextResponse.json({ 
      error: "Internal server error",
      message: error?.message || 'Unknown error'
    }, { 
      status: 500,
      headers: corsHeaders,
    });
  }
}
