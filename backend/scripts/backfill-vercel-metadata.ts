// CHANGELOG: 2025-10-12 - Backfill Vercel identifiers for legacy sites
import { prisma } from "../src/lib/db";
import { getHostingProvider } from "../src/lib/providers";
import { logError, logInfo } from "../src/lib/log";

async function backfill(): Promise<void> {
  const sites = await prisma.site.findMany({
    where: {
      OR: [
        { vercelProjectId: null },
        { vercelProjectId: "" },
        { vercelDeploymentId: null },
        { vercelDeploymentId: "" },
      ],
    },
  });

  if (sites.length === 0) {
    logInfo("No sites require backfill");
    return;
  }

  const hosting = getHostingProvider();

  for (const site of sites) {
    try {
      const projectId = site.vercelProjectId || `legacy-${site.slug}`;
      const project = await hosting.createProject({ name: site.slug, framework: "nextjs" });
      const deployment = await hosting.createDeployment({
        projectId: project.projectId,
        gitUrl: site.repoUrl ?? undefined,
      });

      await prisma.site.update({
        where: { id: site.id },
        data: {
          vercelProjectId: site.vercelProjectId || project.projectId,
          vercelDeploymentId: deployment.deploymentId,
          previewUrl: site.previewUrl ?? deployment.url,
        },
      });
      logInfo("Backfilled Vercel metadata", { siteId: site.id });
    } catch (error: unknown) {
      logError("Failed to backfill Vercel metadata", error, { siteId: site.id });
    }
  }
}

backfill()
  .then(() => {
    logInfo("Backfill complete");
    process.exit(0);
  })
  .catch(error => {
    logError("Backfill script error", error);
    process.exit(1);
  });
