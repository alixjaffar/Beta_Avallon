// CHANGELOG: 2025-11-25 - Debug endpoint to check n8n configuration
import { NextResponse } from "next/server";

export async function GET() {
  const n8nBaseUrl = process.env.N8N_BASE_URL || 'Not set';
  const n8nApiKey = process.env.N8N_API_KEY;
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'Not set';
  
  return NextResponse.json({
    configured: !!(n8nBaseUrl && n8nApiKey && n8nBaseUrl !== 'Not set'),
    n8nBaseUrl: n8nBaseUrl,
    n8nApiKey: n8nApiKey ? `${n8nApiKey.substring(0, 10)}...` : 'Not set',
    n8nApiKeyLength: n8nApiKey?.length || 0,
    n8nWebhookUrl: n8nWebhookUrl,
    nodeEnv: process.env.NODE_ENV,
  });
}
















