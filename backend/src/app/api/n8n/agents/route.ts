// CHANGELOG: 2025-10-12 - Enforce plan limits and return embed snippets
// CHANGELOG: 2025-10-12 - Add monitoring events for agent provisioning
// CHANGELOG: 2025-10-11 - Refactor to use data access helpers
// CHANGELOG: 2025-10-10 - Add GET listing for user's agents; refactor to AgentProvider
// CHANGELOG: 2024-12-19 - Add Agent persistence with Clerk auth and status management
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAgentProvider } from "@/lib/providers";
import { getUser } from "@/lib/auth/getUser";
import { createAgent, updateAgent, listAgentsByUser } from "@/data/agents";
import { checkLimit } from "@/lib/billing/limits";
import { logError } from "@/lib/log";
import { trackEvent } from "@/lib/monitoring";

const Body = z.object({ 
  name: z.string().min(2).max(100), 
  prompt: z.string().min(4).max(2000) 
});

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    const json = await req.json();
    const parsed = Body.safeParse(json);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const { name, prompt } = parsed.data;

    const limitCheck = await checkLimit(user.id, 'agents');
    if (!limitCheck.allowed) {
      return NextResponse.json({
        error: `Agent limit reached. You have ${limitCheck.current}/${limitCheck.limit} agents. Upgrade your plan to create more.`,
      }, { status: 403 });
    }

    // Create Agent in database first with inactive status
    const agent = await createAgent({
      ownerId: user.id,
      name,
      n8nId: null,
      status: "inactive",
    });

    try {
      // Call provider API
      const provider = getAgentProvider();
      const result = await provider.createAgent({ name, prompt });

      // Update agent with n8nId and set status to active on success
      const updatedAgent = await updateAgent(agent.id, {
        n8nId: result.externalId || null,
        status: "active",
      });

      const responseBody = { 
        message: "Agent created successfully", 
        result: { 
          agentId: updatedAgent.id, 
          name: updatedAgent.name, 
          status: updatedAgent.status,
          n8nId: updatedAgent.n8nId,
          embedCode: result.embedCode,
        }
      };

      trackEvent("agent.created", {
        agentId: updatedAgent.id,
        n8nId: updatedAgent.n8nId,
        status: updatedAgent.status,
      });

      return NextResponse.json(responseBody);
    } catch (apiError) {
      // If n8n API fails, keep agent but mark as inactive
      await updateAgent(agent.id, { status: "inactive" });
      throw apiError;
    }
  } catch (error: unknown) {
    logError('Create agent failed', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    const agents = await listAgentsByUser(user.id);
    const provider = getAgentProvider();
    const enrichedAgents = agents.map(agent => ({
      ...agent,
      embedCode: agent.n8nId ? provider.getEmbedCode(agent.n8nId) : null,
    }));
    return NextResponse.json({ agents: enrichedAgents });
  } catch (error: unknown) {
    logError('List agents failed', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
