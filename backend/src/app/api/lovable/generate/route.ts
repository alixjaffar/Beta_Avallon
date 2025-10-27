// CHANGELOG: 2025-10-12 - Provision Vercel hosting and persist deployment metadata
// CHANGELOG: 2025-10-12 - Add monitoring events and retry logic
// CHANGELOG: 2025-10-11 - Add usage limit enforcement
// CHANGELOG: 2025-10-11 - Refactor to use data access helpers
// CHANGELOG: 2025-10-10 - Refactor to SiteProvider abstraction
// CHANGELOG: 2024-12-19 - Add Site persistence with Clerk auth and unique slugs
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSiteProvider, getHostingProvider } from "@/lib/providers";
import { getUser } from "@/lib/auth/getUser";
import { slugify, getUniqueSlug } from "@/lib/slug";
import { createSite } from "@/data/sites";
import { checkLimit } from "@/lib/billing/limits";
import { logError } from "@/lib/log";
import { withRetry } from "@/lib/retry";
import { trackEvent } from "@/lib/monitoring";

const Body = z.object({ 
  name: z.string().min(2).max(100), 
  mode: z.enum(["lovable","template"]) 
});

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    const json = await req.json();
    const parsed = Body.safeParse(json);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    // Check usage limits
    const limitCheck = await checkLimit(user.id, 'sites');
    if (!limitCheck.allowed) {
      return NextResponse.json({ 
        error: `Site limit reached. You have ${limitCheck.current}/${limitCheck.limit} sites. Upgrade your plan to create more.` 
      }, { status: 403 });
    }

    const { name, mode } = parsed.data;
    
    // Generate unique slug
    const baseSlug = slugify(name);
    const slug = await getUniqueSlug(baseSlug);

    // Call provider API
    const provider = getSiteProvider();
    const result = await provider.generateSite({ name, mode });

    // Provision hosting (mocked when provider not configured)
    const hosting = getHostingProvider();
    let vercelProjectId: string | null = null;
    let vercelDeploymentId: string | null = null;
    let previewUrl = result.previewUrl ?? null;
    let status: string = previewUrl ? "live" : "building";

    try {
      const project = await withRetry(
        () => hosting.createProject({ name: slug, framework: "nextjs" }),
        { onRetry: (attempt) => trackEvent("hosting.createProject.retry", { attempt, slug }) },
      );
      vercelProjectId = project.projectId;

      const deployment = await withRetry(
        () => hosting.createDeployment({
          projectId: project.projectId,
          gitUrl: result.repoUrl,
        }),
        { onRetry: (attempt) => trackEvent("hosting.createDeployment.retry", { attempt, slug }) },
      );

      vercelDeploymentId = deployment.deploymentId;
      if (deployment.url) {
        previewUrl = deployment.url;
      }

      status = deployment.readyState === "READY" ? "live" : "building";
    } catch (hostingError: unknown) {
      logError("Site hosting provisioning failed", hostingError, { slug });
    }

    // Create Site in database
    const site = await createSite({
      ownerId: user.id,
      name,
      slug,
      status,
      repoUrl: result.repoUrl || null,
      previewUrl,
      vercelProjectId,
      vercelDeploymentId,
    });

    trackEvent("site.created", {
      siteId: site.id,
      vercelProjectId,
      vercelDeploymentId,
      status: site.status,
      mode,
    });

    return NextResponse.json({ 
      message: "Site created successfully", 
      result: { 
        siteId: site.id, 
        slug: site.slug, 
        status: site.status,
        previewUrl: site.previewUrl,
        vercelProjectId: site.vercelProjectId,
        vercelDeploymentId: site.vercelDeploymentId,
      }
    });
  } catch (error: unknown) {
    logError('Create site failed', error);
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
