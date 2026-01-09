// CHANGELOG: 2025-01-07 - Add plan-based feature gating for AI agents
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
import { checkLimit, getUserPlan, canAccessAgents } from "@/lib/billing/limits";
import { logError } from "@/lib/log";
import { trackEvent } from "@/lib/monitoring";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-email',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

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
      return NextResponse.json({ error: parsed.error.format() }, { status: 400, headers: corsHeaders });
    }

    const { name, prompt } = parsed.data;

    // Check if user's plan allows AI agents
    try {
      const userPlan = await getUserPlan(user.id);
      if (!canAccessAgents(userPlan)) {
        return NextResponse.json({
          error: "AI Agents are not available on the Free plan. Upgrade to Starter or higher to create AI agents.",
          upgradeRequired: true,
          requiredPlan: "starter",
        }, { status: 403, headers: corsHeaders });
      }
    } catch (planError: any) {
      // If plan check fails, default to free (restricted)
      logError('Plan check failed', planError);
      return NextResponse.json({
        error: "Unable to verify plan. Please try again.",
      }, { status: 500, headers: corsHeaders });
    }

    // Check limits (skip if database unavailable)
    let limitCheck;
    try {
      limitCheck = await checkLimit(user.id, 'agents');
      if (!limitCheck.allowed) {
        return NextResponse.json({
          error: `Agent limit reached. You have ${limitCheck.current}/${limitCheck.limit} agents. Upgrade your plan to create more.`,
          upgradeRequired: true,
        }, { status: 403, headers: corsHeaders });
      }
    } catch (limitError: any) {
      // If limit check fails (e.g., database unavailable), allow creation
      logError('Limit check failed, allowing agent creation', limitError);
      limitCheck = { allowed: true, current: 0, limit: 999 };
    }

    // Create Agent in database first with inactive status
    const agent = await createAgent({
      ownerId: user.id,
      name,
      n8nId: null,
      status: "inactive",
    });

    try {
      // Call provider API - create agent and automatically activate workflow
      // Set N8N_AUTO_ACTIVATE=false in env to disable auto-activation
      const shouldAutoActivate = process.env.N8N_AUTO_ACTIVATE !== 'false';
      const provider = getAgentProvider();
      const result = await provider.createAgent({ name, prompt, activate: shouldAutoActivate });

      // Update agent with n8nId and set status based on activation
      const updatedAgent = await updateAgent(agent.id, {
        n8nId: result.externalId || null,
        status: shouldAutoActivate ? "active" : "inactive", // Auto-activate if enabled
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

      return NextResponse.json(responseBody, { headers: corsHeaders });
    } catch (apiError: unknown) {
      // If n8n API fails, keep agent but mark as inactive
      await updateAgent(agent.id, { status: "inactive" });
      const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown error';
      logError('n8n API error during agent creation', apiError);
      return NextResponse.json({ 
        error: `Failed to create agent in n8n: ${errorMessage}`,
        details: errorMessage.includes('ECONNREFUSED') ? 'Cannot connect to n8n. Make sure n8n is running and accessible.' : errorMessage
      }, { status: 500, headers: corsHeaders });
    }
  } catch (error: unknown) {
    logError('Create agent failed', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage === 'Authentication required') {
      return NextResponse.json({ error: "Authentication required" }, { status: 401, headers: corsHeaders });
    }
    return NextResponse.json({ 
      error: errorMessage || "Internal server error",
      details: errorMessage
    }, { status: 500, headers: corsHeaders });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    
    // Check if user's plan allows AI agents
    const userPlan = await getUserPlan(user.id);
    const hasAgentAccess = canAccessAgents(userPlan);
    
    if (!hasAgentAccess) {
      return NextResponse.json({ 
        agents: [],
        featureGated: true,
        message: "AI Agents are not available on the Free plan. Upgrade to Starter or higher to access AI agents.",
        requiredPlan: "starter",
      }, { headers: corsHeaders });
    }
    
    const agents = await listAgentsByUser(user.id);
    const provider = getAgentProvider();
    const enrichedAgents = agents.map(agent => ({
      ...agent,
      embedCode: agent.n8nId ? provider.getEmbedCode(agent.n8nId) : null,
    }));
    return NextResponse.json({ agents: enrichedAgents, featureGated: false }, { headers: corsHeaders });
  } catch (error: unknown) {
    logError('List agents failed', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: "Authentication required" }, { status: 401, headers: corsHeaders });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders });
  }
}
