// CHANGELOG: 2025-01-15 - Add individual agent management API endpoints
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { getAgentById, updateAgent, deleteAgent } from "@/data/agents";
import { getAgentProvider } from "@/lib/providers";
import { logError } from "@/lib/log";
import { z } from "zod";

const UpdateAgentSchema = z.object({
  name: z.string().min(2, "Agent name must be at least 2 characters").max(100, "Agent name too long").optional(),
  status: z.enum(["inactive", "active"]).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser();
    const agent = await getAgentById(params.id, user.id);
    
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }
    
    // Enrich with embed code if agent is active
    const provider = getAgentProvider();
    const enrichedAgent = {
      ...agent,
      embedCode: agent.n8nId ? provider.getEmbedCode(agent.n8nId) : null,
    };
    
    return NextResponse.json({ agent: enrichedAgent });
  } catch (error: any) {
    logError('Get agent failed', error);
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser();
    const body = await req.json();
    
    const validated = UpdateAgentSchema.parse(body);
    
    // Check if agent exists and belongs to user
    const existingAgent = await getAgentById(params.id, user.id);
    if (!existingAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }
    
    const updatedAgent = await updateAgent(params.id, validated);
    
    // Enrich with embed code if agent is active
    const provider = getAgentProvider();
    const enrichedAgent = {
      ...updatedAgent,
      embedCode: updatedAgent.n8nId ? provider.getEmbedCode(updatedAgent.n8nId) : null,
    };
    
    return NextResponse.json({ 
      message: "Agent updated successfully", 
      result: enrichedAgent 
    });
  } catch (error: any) {
    logError('Update agent failed', error);
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser();
    
    // Check if agent exists and belongs to user
    const existingAgent = await getAgentById(params.id, user.id);
    if (!existingAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }
    
    // If agent has n8nId, try to delete from n8n as well
    if (existingAgent.n8nId) {
      try {
        const provider = getAgentProvider();
        await provider.deleteAgent(existingAgent.n8nId);
      } catch (providerError) {
        // Log error but don't fail the deletion - we still want to remove from our DB
        logError('Failed to delete agent from n8n', providerError);
      }
    }
    
    await deleteAgent(params.id, user.id);
    
    return NextResponse.json({ 
      message: "Agent deleted successfully" 
    });
  } catch (error: any) {
    logError('Delete agent failed', error);
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
