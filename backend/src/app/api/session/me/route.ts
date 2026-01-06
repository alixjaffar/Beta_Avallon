import { NextResponse } from "next/server";
import { getSession, clearSession } from "@/lib/session";

export async function GET() {
  const s = await getSession();
  return NextResponse.json({ session: s || null });
}

export async function DELETE() {
  await clearSession();
  return NextResponse.json({ success: true });
}



