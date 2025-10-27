// CHANGELOG: 2025-01-15 - Test complete site generation workflow
import { NextResponse } from "next/server";
import { validateClaudeConfig } from "@/lib/config/claude";

export async function GET() {
  try {
    // Check Claude configuration
    const claudeConfig = validateClaudeConfig();
    
    // Check GitHub configuration
    const githubToken = process.env.GITHUB_TOKEN;
    const githubOrg = process.env.GITHUB_ORG;
    
    // Check Vercel configuration
    const vercelToken = process.env.VERCEL_API_TOKEN;
    const vercelTeamId = process.env.VERCEL_TEAM_ID;
    
    const config = {
      claude: {
        configured: claudeConfig.valid,
        errors: claudeConfig.errors,
        apiKey: process.env.CLAUDE_API_KEY ? 
          process.env.CLAUDE_API_KEY.substring(0, 15) + '...' : 
          'Not set'
      },
      github: {
        configured: !!githubToken,
        token: githubToken ? githubToken.substring(0, 15) + '...' : 'Not set',
        org: githubOrg || 'Not set'
      },
      vercel: {
        configured: !!vercelToken,
        token: vercelToken ? vercelToken.substring(0, 15) + '...' : 'Not set',
        teamId: vercelTeamId || 'Not set'
      }
    };
    
    // Determine what's ready
    const ready = {
      claude: claudeConfig.valid,
      github: !!githubToken,
      vercel: !!vercelToken,
      complete: claudeConfig.valid && !!githubToken && !!vercelToken
    };
    
    return NextResponse.json({
      message: "Site generation configuration status",
      ready,
      config,
      nextSteps: ready.complete ? 
        "🎉 All systems ready! You can now generate sites." :
        [
          ...(ready.claude ? [] : ["❌ Fix Claude API key (401 error)"]),
          ...(ready.github ? [] : ["❌ Add GitHub token"]),
          ...(ready.vercel ? [] : ["❌ Add Vercel token"])
        ]
    });

  } catch (error: any) {
    return NextResponse.json({
      error: "Configuration check failed",
      details: error.message
    }, { status: 500 });
  }
}
