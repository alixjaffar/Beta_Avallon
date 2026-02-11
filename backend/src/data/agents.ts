// CHANGELOG: 2025-10-11 - Add Agent data access helpers
import { prisma } from "@/lib/db";
import { logInfo, logError } from "@/lib/log";
import * as fs from 'fs';
import * as path from 'path';

const AGENTS_FILE = path.join(process.cwd(), 'agents.json');
let agents: any[] = [];

// Load agents from file
function loadAgents() {
  try {
    if (fs.existsSync(AGENTS_FILE)) {
      const data = fs.readFileSync(AGENTS_FILE, 'utf8');
      agents = JSON.parse(data);
      logInfo('Agents loaded from file', { count: agents.length });
    } else {
      agents = [];
      logInfo('No agents file found, starting with empty array');
    }
  } catch (error) {
    logError('Error loading agents:', error);
    agents = [];
  }
}

// Save agents to file
function saveAgents() {
  try {
    const tempFile = AGENTS_FILE + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(agents, null, 2));
    fs.renameSync(tempFile, AGENTS_FILE);
    logInfo('Agents saved to file', { count: agents.length });
  } catch (error) {
    logError('Error saving agents:', error);
  }
}

// Initialize agents on module load
loadAgents();

export type CreateAgentInput = {
  ownerId: string;
  name: string;
  n8nId?: string | null;
  status: string;
};

export async function createAgent(input: CreateAgentInput) {
  try {
    // Try database first
    try {
      return await prisma.agent.create({
        data: {
          ownerId: input.ownerId,
          name: input.name,
          n8nId: input.n8nId || null,
          status: input.status,
        },
      });
    } catch (dbError: any) {
      // If database fails or table doesn't exist, use file-based storage
      const isDatabaseError = dbError.message?.includes('Can\'t reach database') || 
                              dbError.code === 'P1001' ||
                              dbError.message?.includes('does not exist') ||
                              dbError.message?.includes('table') ||
                              dbError.code === 'P2021' ||
                              dbError.code === 'P2003';
      
      if (isDatabaseError) {
        logInfo('Database unavailable or table missing, using file-based storage for agents', { 
          error: dbError.message,
          code: dbError.code 
        });
        const newAgent = {
          id: `agent_${Date.now()}`,
          ownerId: input.ownerId,
          name: input.name,
          n8nId: input.n8nId || null,
          status: input.status,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        agents.push(newAgent);
        saveAgents();
        logInfo('Agent created in file storage', { agentId: newAgent.id, name: newAgent.name });
        return newAgent;
      }
      throw dbError;
    }
  } catch (error) {
    logError('Error creating agent:', error);
    throw error;
  }
}

/**
 * Update an agent with ownership verification
 * SECURITY: Always require userId to prevent IDOR attacks
 */
export async function updateAgent(id: string, userId: string, data: { n8nId?: string | null; status?: string; name?: string }) {
  try {
    // First check if this is a file-based agent (starts with 'agent_')
    if (id.startsWith('agent_')) {
      const agentIndex = agents.findIndex(a => a.id === id);
      if (agentIndex !== -1) {
        // SECURITY: Verify ownership for file-based agents
        if (agents[agentIndex].ownerId !== userId) {
          throw new Error('Agent not found or access denied');
        }
        agents[agentIndex] = {
          ...agents[agentIndex],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        saveAgents();
        logInfo('Agent updated in file storage', { agentId: id });
        return agents[agentIndex];
      }
    }
    
    // Try database with ownership verification
    try {
      // SECURITY: Include ownerId in where clause to prevent IDOR
      return await prisma.agent.update({
        where: { id, ownerId: userId },
        data,
      });
    } catch (dbError: any) {
      // If database fails, record not found, or table doesn't exist, use file-based storage
      const shouldFallback = dbError.message?.includes('Can\'t reach database') || 
                              dbError.code === 'P1001' ||
                              dbError.code === 'P2025' || // Record not found
                              dbError.message?.includes('does not exist') ||
                              dbError.message?.includes('not found') ||
                              dbError.message?.includes('table') ||
                              dbError.code === 'P2021' ||
                              dbError.code === 'P2003';
      
      if (shouldFallback) {
        logInfo('Falling back to file-based storage for agent update', { 
          error: dbError.message,
          code: dbError.code 
        });
        const agentIndex = agents.findIndex(a => a.id === id);
        if (agentIndex === -1) {
          // Agent not in file storage either
          logInfo('Agent not found in file storage, skipping update', { agentId: id });
          return null;
        }
        // SECURITY: Verify ownership for file-based agents
        if (agents[agentIndex].ownerId !== userId) {
          throw new Error('Agent not found or access denied');
        }
        agents[agentIndex] = {
          ...agents[agentIndex],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        saveAgents();
        logInfo('Agent updated in file storage', { agentId: id });
        return agents[agentIndex];
      }
      throw dbError;
    }
  } catch (error) {
    logError('Error updating agent:', error);
    throw error;
  }
}

export async function listAgentsByUser(userId: string) {
  try {
    // Get file-based agents first
    const fileAgents = agents
      .filter(a => a.ownerId === userId)
      .map(a => ({
        id: a.id,
        name: a.name,
        n8nId: a.n8nId,
        status: a.status,
        createdAt: a.createdAt,
      }));
    
    // Try to get database agents
    try {
      const dbAgents = await prisma.agent.findMany({
        where: { ownerId: userId },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          n8nId: true,
          status: true,
          createdAt: true,
        },
      });
      
      // Combine both, avoiding duplicates
      const allAgents = [...dbAgents];
      for (const fileAgent of fileAgents) {
        if (!allAgents.some(a => a.id === fileAgent.id)) {
          allAgents.push(fileAgent);
        }
      }
      
      return allAgents.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (dbError: any) {
      // If database fails, return file-based agents only
      const shouldFallback = dbError.message?.includes('Can\'t reach database') || 
                              dbError.code === 'P1001' ||
                              dbError.code === 'P2025' ||
                              dbError.message?.includes('does not exist') ||
                              dbError.message?.includes('table') ||
                              dbError.code === 'P2021' ||
                              dbError.code === 'P2003';
      
      if (shouldFallback) {
        logInfo('Falling back to file-based storage for agent list', { 
          error: dbError.message,
          code: dbError.code 
        });
        return fileAgents.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      throw dbError;
    }
  } catch (error) {
    logError('Error listing agents:', error);
    return [];
  }
}

export async function getAgentById(id: string, userId: string) {
  try {
    // First check file storage for file-based agents (starts with 'agent_')
    if (id.startsWith('agent_')) {
      const fileAgent = agents.find(a => a.id === id && a.ownerId === userId);
      if (fileAgent) {
        return fileAgent;
      }
    }
    
    // Try database
    try {
      return await prisma.agent.findFirst({
        where: { id, ownerId: userId },
      });
    } catch (dbError: any) {
      // If database fails or table doesn't exist, use file-based storage
      const shouldFallback = dbError.message?.includes('Can\'t reach database') || 
                              dbError.code === 'P1001' ||
                              dbError.code === 'P2025' ||
                              dbError.message?.includes('does not exist') ||
                              dbError.message?.includes('table') ||
                              dbError.code === 'P2021' ||
                              dbError.code === 'P2003';
      
      if (shouldFallback) {
        logInfo('Falling back to file-based storage for agent lookup', { 
          error: dbError.message,
          code: dbError.code 
        });
        return agents.find(a => a.id === id && a.ownerId === userId) || null;
      }
      throw dbError;
    }
  } catch (error) {
    logError('Error getting agent by ID:', error);
    return null;
  }
}

export async function deleteAgent(id: string, userId: string) {
  try {
    try {
      return await prisma.agent.delete({
        where: { id, ownerId: userId },
      });
    } catch (dbError: any) {
      // If database fails, use file-based storage
      if (dbError.message?.includes('Can\'t reach database') || dbError.code === 'P1001') {
        logInfo('Database unavailable, using file-based storage for agent deletion');
        const agentIndex = agents.findIndex(a => a.id === id && a.ownerId === userId);
        if (agentIndex === -1) {
          throw new Error('Agent not found');
        }
        const deleted = agents.splice(agentIndex, 1)[0];
        saveAgents();
        logInfo('Agent deleted from file storage', { agentId: id });
        return deleted;
      }
      throw dbError;
    }
  } catch (error) {
    logError('Error deleting agent:', error);
    throw error;
  }
}

