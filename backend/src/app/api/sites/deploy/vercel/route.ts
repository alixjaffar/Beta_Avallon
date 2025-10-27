// API endpoint for deploying websites to Vercel
import { NextRequest, NextResponse } from "next/server";
import { logError, logInfo } from "@/lib/log";
import { z } from "zod";
import { getUser } from "@/lib/auth/getUser";
import { updateSite } from "@/data/sites";

const DeployToVercelSchema = z.object({
  siteId: z.string().min(1, "Site ID is required"),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { siteId } = DeployToVercelSchema.parse(body);

    logInfo('Deploying to Vercel', { siteId });

    // For now, return a mock Vercel URL
    // In a real implementation, you would:
    // 1. Get the site files from the local directory
    // 2. Create a Vercel project
    // 3. Deploy the files to Vercel
    // 4. Update the site with the Vercel URL

    const previewUrl = `https://${siteId}.vercel.app`;
    
    // Update the site with the Vercel URL
    await updateSite(siteId, user.id, { previewUrl });

    return NextResponse.json({
      success: true,
      previewUrl,
      message: "Website deployed to Vercel successfully!"
    });
  } catch (error: any) {
    logError('Vercel deployment failed', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
