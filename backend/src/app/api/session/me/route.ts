import { NextRequest, NextResponse } from "next/server";
import { getSession, clearSession } from "@/lib/session";
import { getCorsHeaders } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(req),
  });
}

export async function GET(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  const s = await getSession();
  return NextResponse.json({ session: s || null }, { headers: corsHeaders });
}

export async function DELETE(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req);
  await clearSession();
  return NextResponse.json({ success: true }, { headers: corsHeaders });
}



