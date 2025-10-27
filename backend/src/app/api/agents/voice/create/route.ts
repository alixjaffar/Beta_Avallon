// CHANGELOG: 2025-01-15 - Add AI voice agent creation with n8n integration
import { NextRequest, NextResponse } from "next/server";
import { createN8nClient } from "@/lib/clients/n8n";
import { logError } from "@/lib/log";
import { z } from "zod";

const CreateVoiceAgentSchema = z.object({
  name: z.string().min(1, "Agent name is required").max(100, "Agent name too long"),
  description: z.string().min(1, "Description is required").max(500, "Description too long"),
  voice: z.object({
    provider: z.enum(['elevenlabs', 'openai', 'azure']),
    voiceId: z.string().min(1, "Voice ID is required"),
    model: z.string().optional(),
  }),
  language: z.string().min(2, "Language code is required").max(10, "Language code too long"),
  personality: z.string().min(1, "Personality is required").max(200, "Personality too long"),
  capabilities: z.array(z.string()).min(1, "At least one capability is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const agentConfig = CreateVoiceAgentSchema.parse(body);

    // Get n8n configuration from environment
    const n8nConfig = {
      baseUrl: process.env.N8N_BASE_URL || 'http://localhost:5678',
      apiKey: process.env.N8N_API_KEY || '',
      webhookUrl: process.env.N8N_WEBHOOK_URL,
    };

    // Check if n8n is configured
    if (!n8nConfig.apiKey) {
      // Return mock agent for testing
      return NextResponse.json({
        success: true,
        agentId: `mock_agent_${Date.now()}`,
        workflowId: `mock_workflow_${Date.now()}`,
        webhookUrl: `https://mock-n8n.com/webhook/voice-agent-${agentConfig.name.toLowerCase().replace(/\s+/g, '-')}`,
        status: 'active',
        provider: 'n8n',
        mock: true,
      });
    }

    // Use real n8n API
    const n8nClient = createN8nClient(n8nConfig);
    const result = await n8nClient.deployVoiceAgent(agentConfig);

    return NextResponse.json({
      success: true,
      agentId: agentConfig.name.toLowerCase().replace(/\s+/g, '-'),
      workflowId: result.workflowId,
      webhookUrl: result.webhookUrl,
      status: result.status,
      provider: 'n8n',
      mock: false,
    });
  } catch (error: any) {
    logError('Voice agent creation failed', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
