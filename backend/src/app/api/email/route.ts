// CHANGELOG: 2025-01-15 - Add email accounts listing API endpoint
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { listEmailAccountsByUser } from "@/data/emailAccounts";
import { logError } from "@/lib/log";

export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    const emailAccounts = await listEmailAccountsByUser(user.id);
    return NextResponse.json({ emailAccounts });
  } catch (error: any) {
    logError('List email accounts failed', error);
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
