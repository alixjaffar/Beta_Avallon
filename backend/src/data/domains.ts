// CHANGELOG: 2025-10-11 - Add Domain data access helpers
import { prisma } from "@/lib/db";

export type CreateDomainInput = {
  ownerId: string;
  domain: string;
  status: string;
  siteId?: string | null;
};

export async function createDomain(input: CreateDomainInput) {
  return await prisma.domain.create({
    data: {
      ownerId: input.ownerId,
      domain: input.domain,
      status: input.status,
      siteId: input.siteId || null,
    },
  });
}

export async function updateDomain(id: string, data: { status?: string; siteId?: string | null }) {
  return await prisma.domain.update({
    where: { id },
    data,
  });
}

export async function findDomainByName(domain: string) {
  return await prisma.domain.findUnique({
    where: { domain },
  });
}

export async function findDomainByNameAndUser(domain: string, userId: string) {
  return await prisma.domain.findFirst({
    where: { domain, ownerId: userId },
  });
}

export async function listDomainsByUser(userId: string) {
  return await prisma.domain.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      domain: true,
      status: true,
      siteId: true,
      createdAt: true,
    },
  });
}

export async function getDomainById(id: string, userId: string) {
  return await prisma.domain.findFirst({
    where: { id, ownerId: userId },
  });
}

export async function deleteDomain(id: string, userId: string) {
  return await prisma.domain.delete({
    where: { id, ownerId: userId },
  });
}

