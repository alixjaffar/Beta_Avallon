// CHANGELOG: 2025-01-15 - Add individual agent management API endpoints
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { getAgentById, updateAgent, deleteAgent } from "@/data/agents";
import { getAgentProvider } from "@/lib/providers";
import { logError, logInfo } from "@/lib/log";
import { z } from "zod";
import axios from "axios";

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

const UpdateAgentSchema = z.object({
  name: z.string().min(2, "Agent name must be at least 2 characters").max(100, "Agent name too long").optional(),
  status: z.enum(["inactive", "active"]).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    const { id } = await params;
    const agent = await getAgentById(id, user.id);
    
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404, headers: corsHeaders });
    }
    
    // Enrich with embed code if agent is active
    const provider = getAgentProvider();
    const enrichedAgent = {
      ...agent,
      embedCode: agent.n8nId ? provider.getEmbedCode(agent.n8nId) : null,
    };
    
    return NextResponse.json({ agent: enrichedAgent }, { headers: corsHeaders });
  } catch (error: any) {
    logError('Get agent failed', error);
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: "Authentication required" }, { status: 401, headers: corsHeaders });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    const { id } = await params;
    const body = await req.json();
    
    const validated = UpdateAgentSchema.parse(body);
    
    // Check if agent exists and belongs to user
    const existingAgent = await getAgentById(id, user.id);
    if (!existingAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404, headers: corsHeaders });
    }
    
    const updatedAgent = await updateAgent(id, validated);
    
    // Enrich with embed code if agent is active
    const provider = getAgentProvider();
    const enrichedAgent = {
      ...updatedAgent,
      embedCode: updatedAgent.n8nId ? provider.getEmbedCode(updatedAgent.n8nId) : null,
    };
    
    return NextResponse.json({ 
      message: "Agent updated successfully", 
      result: enrichedAgent 
    }, { headers: corsHeaders });
  } catch (error: any) {
    logError('Update agent failed', error);
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: "Authentication required" }, { status: 401, headers: corsHeaders });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400, headers: corsHeaders });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    const { id } = await params;
    
    // Check if agent exists and belongs to user
    const existingAgent = await getAgentById(id, user.id);
    if (!existingAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404, headers: corsHeaders });
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
    
    await deleteAgent(id, user.id);
    
    return NextResponse.json({ 
      message: "Agent deleted successfully" 
    }, { headers: corsHeaders });
  } catch (error: any) {
    logError('Delete agent failed', error);
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: "Authentication required" }, { status: 401, headers: corsHeaders });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    const { id } = await params;
    const body = await req.json();
    
    // Check if this is a publish request
    if (body.action === 'publish') {
      const agent = await getAgentById(id, user.id);
      if (!agent) {
        return NextResponse.json({ error: "Agent not found" }, { status: 404, headers: corsHeaders });
      }
      
      if (!agent.n8nId) {
        return NextResponse.json({ error: "Agent has no n8n workflow ID" }, { status: 400, headers: corsHeaders });
      }
      
      // Activate the workflow in n8n
      const n8nBaseUrl = process.env.N8N_BASE_URL || '';
      const n8nApiKey = process.env.N8N_API_KEY || '';
      
      if (!n8nBaseUrl || !n8nApiKey) {
        return NextResponse.json({ error: "n8n is not configured" }, { status: 503, headers: corsHeaders });
      }
      
      try {
        await axios.patch(
          `${n8nBaseUrl}/api/v1/workflows/${agent.n8nId}`,
          { active: true },
          { headers: { 'X-N8N-API-KEY': n8nApiKey, 'Content-Type': 'application/json' } }
        );
        
        logInfo('n8n workflow activated', { workflowId: agent.n8nId, agentId: id });
        
        // Update agent status to active
        const updatedAgent = await updateAgent(id, { status: 'active' });
        
        const provider = getAgentProvider();
        const enrichedAgent = {
          ...updatedAgent,
          embedCode: updatedAgent.n8nId ? provider.getEmbedCode(updatedAgent.n8nId) : null,
        };
        
        return NextResponse.json({ 
          message: "Agent published successfully", 
          result: enrichedAgent 
        }, { headers: corsHeaders });
      } catch (n8nError: any) {
        logError('Failed to activate n8n workflow', n8nError);
        return NextResponse.json({ 
          error: `Failed to publish agent: ${n8nError.message || 'Unknown error'}` 
        }, { status: 500, headers: corsHeaders });
      }
    }
    
    // Otherwise, treat as regular update
    const validated = UpdateAgentSchema.parse(body);
    const existingAgent = await getAgentById(id, user.id);
    if (!existingAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404, headers: corsHeaders });
    }
    
    const updatedAgent = await updateAgent(id, validated);
    const provider = getAgentProvider();
    const enrichedAgent = {
      ...updatedAgent,
      embedCode: updatedAgent.n8nId ? provider.getEmbedCode(updatedAgent.n8nId) : null,
    };
    
    return NextResponse.json({ 
      message: "Agent updated successfully", 
      result: enrichedAgent 
    }, { headers: corsHeaders });
  } catch (error: any) {
    logError('Publish/update agent failed', error);
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: "Authentication required" }, { status: 401, headers: corsHeaders });
    }
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400, headers: corsHeaders });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders });
  }
}
