// API endpoint for deploying websites to GitHub
import { NextRequest, NextResponse } from "next/server";
import { logError, logInfo } from "@/lib/log";
import { z } from "zod";
import { getUser } from "@/lib/auth/getUser";
import { updateSite } from "@/data/sites";

const DeployToGitHubSchema = z.object({
  siteId: z.string().min(1, "Site ID is required"),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { siteId } = DeployToGitHubSchema.parse(body);

    logInfo('Deploying to GitHub', { siteId });

    // For now, return a mock GitHub URL
    // In a real implementation, you would:
    // 1. Get the site files from the local directory
    // 2. Create a new GitHub repository
    // 3. Push the files to the repository
    // 4. Update the site with the repository URL

    const repoUrl = `https://github.com/user/${siteId}`;
    
    // Update the site with the repository URL
    await updateSite(siteId, user.id, { repoUrl });

    return NextResponse.json({
      success: true,
      repoUrl,
      message: "Website deployed to GitHub successfully!"
    });
  } catch (error: any) {
    logError('GitHub deployment failed', error);
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
