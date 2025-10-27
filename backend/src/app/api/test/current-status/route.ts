// CHANGELOG: 2025-01-15 - Check current token status and what needs to be fixed
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const claudeKey = process.env.CLAUDE_API_KEY;
    const githubToken = process.env.GITHUB_TOKEN;
    const vercelToken = process.env.VERCEL_API_TOKEN;
    
    // Test Claude API
    let claudeStatus = "❌ Not tested";
    let claudeError = "";
    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 10,
          messages: [{ role: "user", content: "Say 'Hello'" }]
        },
        {
          headers: {
            'Authorization': `Bearer ${claudeKey}`,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
          },
          timeout: 10000
        }
      );
      claudeStatus = "✅ Working";
    } catch (error: any) {
      claudeStatus = `❌ Error: ${error.response?.status}`;
      claudeError = error.response?.data?.error?.message || error.message;
    }
    
    // Test GitHub API
    let githubStatus = "❌ Not tested";
    let githubError = "";
    try {
      const response = await axios.get('https://api.github.com/user', {
        headers: { 'Authorization': `Bearer ${githubToken}` }
      });
      githubStatus = "✅ Read access working";
    } catch (error: any) {
      githubStatus = `❌ Error: ${error.response?.status}`;
      githubError = error.message;
    }
    
    // Test Vercel API
    let vercelStatus = "❌ Not tested";
    let vercelError = "";
    try {
      const response = await axios.get('https://api.vercel.com/v1/user', {
        headers: { 'Authorization': `Bearer ${vercelToken}` }
      });
      vercelStatus = "✅ Working";
    } catch (error: any) {
      vercelStatus = `❌ Error: ${error.response?.status}`;
      vercelError = error.message;
    }
    
    return NextResponse.json({
      message: "🔍 Current System Status",
      tokens: {
        claude: {
          configured: !!claudeKey,
          keyPrefix: claudeKey?.substring(0, 15) + '...' || 'Not set',
          status: claudeStatus,
          error: claudeError
        },
        github: {
          configured: !!githubToken,
          tokenPrefix: githubToken?.substring(0, 15) + '...' || 'Not set',
          status: githubStatus,
          error: githubError
        },
        vercel: {
          configured: !!vercelToken,
          tokenPrefix: vercelToken?.substring(0, 15) + '...' || 'Not set',
          status: vercelStatus,
          error: vercelError
        }
      },
      whatNeedsFixing: [
        ...(claudeStatus.includes("❌") ? ["🔧 Claude API: " + claudeError] : []),
        ...(githubStatus.includes("❌") ? ["🔧 GitHub API: " + githubError] : []),
        ...(vercelStatus.includes("❌") ? ["🔧 Vercel API: " + vercelError] : [])
      ],
      readyForTesting: claudeStatus.includes("✅") && githubStatus.includes("✅") && vercelStatus.includes("✅")
    });

  } catch (error: any) {
    return NextResponse.json({
      error: "Status check failed",
      details: error.message
    }, { status: 500 });
  }
}
