// CHANGELOG: 2025-01-15 - Debug endpoint to check environment variables
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    claudeApiKey: process.env.CLAUDE_API_KEY ? 
      process.env.CLAUDE_API_KEY.substring(0, 10) + '...' : 
      'Not set',
    claudeBaseUrl: process.env.CLAUDE_BASE_URL || 'Not set',
    nodeEnv: process.env.NODE_ENV,
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('CLAUDE'))
  });
}
