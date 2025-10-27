// CHANGELOG: 2025-10-11 - Add Agent data access helpers
import { prisma } from "@/lib/db";

export type CreateAgentInput = {
  ownerId: string;
  name: string;
  n8nId?: string | null;
  status: string;
};

export async function createAgent(input: CreateAgentInput) {
  return await prisma.agent.create({
    data: {
      ownerId: input.ownerId,
      name: input.name,
      n8nId: input.n8nId || null,
      status: input.status,
    },
  });
}

export async function updateAgent(id: string, data: { n8nId?: string | null; status?: string }) {
  return await prisma.agent.update({
    where: { id },
    data,
  });
}

export async function listAgentsByUser(userId: string) {
  return await prisma.agent.findMany({
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
}

export async function getAgentById(id: string, userId: string) {
  return await prisma.agent.findFirst({
    where: { id, ownerId: userId },
  });
}

export async function deleteAgent(id: string, userId: string) {
  return await prisma.agent.delete({
    where: { id, ownerId: userId },
  });
}

