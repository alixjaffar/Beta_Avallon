import { NextRequest, NextResponse } from "next/server";
import { setSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { email = "demo@avallon.ca", name = "Demo User" } = await req.json().catch(() => ({}));
  await setSession({ email, name, ts: Date.now() });
  return NextResponse.json({ success: true, email, name });
}



