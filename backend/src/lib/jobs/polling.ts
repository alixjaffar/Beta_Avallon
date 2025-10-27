// CHANGELOG: 2025-10-12 - Poll Vercel deployments and domain/email verification statuses
import { prisma } from "@/lib/db";
import { getHostingProvider, getRegistrarProvider, getEmailProvider } from "@/lib/providers";
import { logError, logInfo } from "@/lib/log";
import { trackEvent } from "@/lib/monitoring";

export async function pollInfrastructureStatus(): Promise<void> {
  const hosting = getHostingProvider();
  const registrar = getRegistrarProvider();
  const email = getEmailProvider();

  const [sites, domains] = await Promise.all([
    prisma.site.findMany({
      where: { status: { in: ["building", "draft"] }, vercelDeploymentId: { not: null } },
      select: { id: true, vercelDeploymentId: true },
    }),
    prisma.domain.findMany({
      where: { status: { in: ["pending", "failed"] } },
      select: { id: true, domain: true },
    }),
  ]);

  for (const site of sites) {
    if (!site.vercelDeploymentId) continue;
    try {
      const status = await hosting.getDeploymentStatus(site.vercelDeploymentId);
      if (status.status === "READY") {
        await prisma.site.update({
          where: { id: site.id },
          data: { status: "live", previewUrl: status.url ?? undefined },
        });
        trackEvent("site.deployment.ready", { siteId: site.id });
      }
    } catch (error: unknown) {
      logError("Deployment polling failed", error, { siteId: site.id });
    }
  }

  for (const domain of domains) {
    try {
      const registrarResult = await registrar.verifyDomain(domain.domain);
      const emailResult = await email.verifyDomain(domain.domain);
      if (registrarResult.verified && emailResult.verified) {
        await prisma.domain.update({ where: { id: domain.id }, data: { status: "active" } });
        trackEvent("domain.verification.completed", { domainId: domain.id });
      }
    } catch (error: unknown) {
      logError("Domain polling failed", error, { domainId: domain.id });
    }
  }

  logInfo("Infrastructure polling tick", { sitesPolled: sites.length, domainsPolled: domains.length });
}
