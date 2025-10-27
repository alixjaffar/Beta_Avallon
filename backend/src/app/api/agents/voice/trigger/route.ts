// CHANGELOG: 2025-01-15 - Add AI voice agent trigger with n8n integration
import { NextRequest, NextResponse } from "next/server";
import { createN8nClient } from "@/lib/clients/n8n";
import { logError } from "@/lib/log";
import { z } from "zod";

const TriggerAgentSchema = z.object({
  agentId: z.string().min(1, "Agent ID is required"),
  input: z.object({
    message: z.string().optional(),
    audio: z.string().optional(),
    context: z.record(z.any()).optional(),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentId, input } = TriggerAgentSchema.parse(body);

    // Get n8n configuration from environment
    const n8nConfig = {
      baseUrl: process.env.N8N_BASE_URL || 'http://localhost:5678',
      apiKey: process.env.N8N_API_KEY || '',
      webhookUrl: process.env.N8N_WEBHOOK_URL,
    };

    // Check if n8n is configured
    if (!n8nConfig.apiKey) {
      // Return mock response for testing
      return NextResponse.json({
        success: true,
        response: `Hello! I'm your AI voice agent. You said: "${input.message || 'Hello'}"`,
        audioUrl: `https://mock-audio.com/response-${Date.now()}.mp3`,
        agentId,
        provider: 'n8n',
        mock: true,
      });
    }

    // Use real n8n API
    const n8nClient = createN8nClient(n8nConfig);
    const result = await n8nClient.triggerVoiceAgent({
      agentId,
      input,
    });

    return NextResponse.json({
      success: result.success,
      response: result.response,
      audioUrl: result.audioUrl,
      agentId,
      provider: 'n8n',
      mock: false,
    });
  } catch (error: any) {
    logError('Voice agent trigger failed', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
