// CHANGELOG: 2025-01-15 - Check API key length and format
import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.CLAUDE_API_KEY;
  
  return NextResponse.json({
    hasApiKey: !!apiKey,
    keyLength: apiKey?.length || 0,
    keyPrefix: apiKey?.substring(0, 20) || 'Not set',
    keySuffix: apiKey?.substring(apiKey.length - 10) || 'Not set',
    startsWithSkAnt: apiKey?.startsWith('sk-ant-') || false,
    fullKey: apiKey // This will show the full key for debugging
  });
}
