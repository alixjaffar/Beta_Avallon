// CHANGELOG: 2025-10-12 - Add EmailAccount data access helpers
import { prisma } from "@/lib/db";

export type CreateEmailAccountInput = {
  ownerId: string;
  domainId: string;
  inbox: string;
  status: string;
};

export async function createEmailAccount(input: CreateEmailAccountInput) {
  return prisma.emailAccount.create({
    data: {
      ownerId: input.ownerId,
      domainId: input.domainId,
      inbox: input.inbox,
      status: input.status,
    },
  });
}

export async function findEmailAccountByDomainAndInbox(domainId: string, inbox: string) {
  return prisma.emailAccount.findFirst({
    where: {
      domainId,
      inbox,
    },
  });
}

export async function countEmailAccountsByUser(ownerId: string) {
  return prisma.emailAccount.count({
    where: {
      ownerId,
    },
  });
}

export async function listEmailAccountsByDomain(domainId: string) {
  return prisma.emailAccount.findMany({
    where: {
      domainId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      inbox: true,
      status: true,
      createdAt: true,
    },
  });
}

export async function listEmailAccountsByUser(ownerId: string) {
  return prisma.emailAccount.findMany({
    where: {
      ownerId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      inbox: true,
      status: true,
      createdAt: true,
      domain: {
        select: {
          domain: true,
        },
      },
    },
  });
}

export async function getEmailAccountById(id: string, ownerId: string) {
  return prisma.emailAccount.findFirst({
    where: {
      id,
      ownerId,
    },
    include: {
      domain: {
        select: {
          domain: true,
        },
      },
    },
  });
}

export async function updateEmailAccount(id: string, ownerId: string, data: {
  status?: string;
}) {
  return prisma.emailAccount.update({
    where: {
      id,
      ownerId,
    },
    data,
  });
}

export async function deleteEmailAccount(id: string, ownerId: string) {
  return prisma.emailAccount.delete({
    where: {
      id,
      ownerId,
    },
  });
}
