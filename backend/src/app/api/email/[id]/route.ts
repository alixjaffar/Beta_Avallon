// CHANGELOG: 2025-01-15 - Add individual email account management API endpoints
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { getEmailAccountById, updateEmailAccount, deleteEmailAccount } from "@/data/emailAccounts";
import { logError } from "@/lib/log";
import { z } from "zod";

const UpdateEmailAccountSchema = z.object({
  status: z.enum(["active", "inactive"]).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    const { id } = await params;
    const emailAccount = await getEmailAccountById(id, user.id);
    
    if (!emailAccount) {
      return NextResponse.json({ error: "Email account not found" }, { status: 404 });
    }
    
    return NextResponse.json({ emailAccount });
  } catch (error: any) {
    logError('Get email account failed', error);
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    const { id } = await params;
    const body = await req.json();
    
    const validated = UpdateEmailAccountSchema.parse(body);
    
    // Check if email account exists and belongs to user
    const existingEmailAccount = await getEmailAccountById(id, user.id);
    if (!existingEmailAccount) {
      return NextResponse.json({ error: "Email account not found" }, { status: 404 });
    }
    
    const updatedEmailAccount = await updateEmailAccount(id, user.id, validated);
    
    return NextResponse.json({ 
      message: "Email account updated successfully", 
      result: updatedEmailAccount 
    });
  } catch (error: any) {
    logError('Update email account failed', error);
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    const { id } = await params;
    
    // Check if email account exists and belongs to user
    const existingEmailAccount = await getEmailAccountById(id, user.id);
    if (!existingEmailAccount) {
      return NextResponse.json({ error: "Email account not found" }, { status: 404 });
    }
    
    await deleteEmailAccount(id, user.id);
    
    return NextResponse.json({ 
      message: "Email account deleted successfully" 
    });
  } catch (error: any) {
    logError('Delete email account failed', error);
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
