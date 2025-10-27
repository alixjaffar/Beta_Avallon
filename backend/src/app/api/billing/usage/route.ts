// CHANGELOG: 2025-10-12 - Provide billing plan and usage summary endpoint
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { getUserPlan, getUserLimits } from "@/lib/billing/limits";
import { prisma } from "@/lib/db";
import { logError } from "@/lib/log";

export async function GET() {
  try {
    const user = await getUser();

    const [plan, limits, siteCount, agentCount, domainCount, emailCount] = await Promise.all([
      getUserPlan(user.id),
      getUserLimits(user.id),
      prisma.site.count({ where: { ownerId: user.id } }),
      prisma.agent.count({ where: { ownerId: user.id } }),
      prisma.domain.count({ where: { ownerId: user.id } }),
      prisma.emailAccount.count({ where: { ownerId: user.id } }),
    ]);

    return NextResponse.json({
      plan,
      limits,
      usage: {
        sites: siteCount,
        agents: agentCount,
        domains: domainCount,
        emailAccounts: emailCount,
      },
    });
  } catch (error: unknown) {
    logError("Fetch billing usage failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
