// CHANGELOG: 2025-10-12 - Expose cron endpoint for infrastructure polling
import { NextResponse } from "next/server";
import { pollInfrastructureStatus } from "@/lib/jobs/polling";
import { logError } from "@/lib/log";

export async function POST() {
  try {
    await pollInfrastructureStatus();
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    logError("Polling job failed", error);
    return NextResponse.json({ error: "Polling failed" }, { status: 500 });
  }
}
