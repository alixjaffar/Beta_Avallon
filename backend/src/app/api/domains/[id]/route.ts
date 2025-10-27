// CHANGELOG: 2025-01-15 - Add individual domain management API endpoints
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { getDomainById, updateDomain, deleteDomain } from "@/data/domains";
import { logError } from "@/lib/log";
import { z } from "zod";

const UpdateDomainSchema = z.object({
  status: z.enum(["pending", "active", "failed"]).optional(),
  siteId: z.string().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser();
    const domain = await getDomainById(params.id, user.id);
    
    if (!domain) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }
    
    return NextResponse.json({ domain });
  } catch (error: any) {
    logError('Get domain failed', error);
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser();
    const body = await req.json();
    
    const validated = UpdateDomainSchema.parse(body);
    
    // Check if domain exists and belongs to user
    const existingDomain = await getDomainById(params.id, user.id);
    if (!existingDomain) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }
    
    const updatedDomain = await updateDomain(params.id, validated);
    
    return NextResponse.json({ 
      message: "Domain updated successfully", 
      result: updatedDomain 
    });
  } catch (error: any) {
    logError('Update domain failed', error);
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser();
    
    // Check if domain exists and belongs to user
    const existingDomain = await getDomainById(params.id, user.id);
    if (!existingDomain) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }
    
    await deleteDomain(params.id, user.id);
    
    return NextResponse.json({ 
      message: "Domain deleted successfully" 
    });
  } catch (error: any) {
    logError('Delete domain failed', error);
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
