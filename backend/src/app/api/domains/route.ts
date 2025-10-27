// CHANGELOG: 2025-10-11 - Refactor to use data access helpers
// CHANGELOG: 2025-10-10 - Add domains listing API endpoint
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { listDomainsByUser } from "@/data/domains";
import { logError } from "@/lib/log";

export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    const domains = await listDomainsByUser(user.id);
    return NextResponse.json({ domains });
  } catch (error: any) {
    logError('List domains failed', error);
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


