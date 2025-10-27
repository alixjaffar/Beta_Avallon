// CHANGELOG: 2025-10-12 - Add provider configuration status endpoint
import { NextResponse } from "next/server";
import { getProviderConfigurationStatus } from "@/lib/providers";

export async function GET() {
  const status = getProviderConfigurationStatus();
  return NextResponse.json({ status });
}
