// CHANGELOG: 2025-01-15 - Check current token status and what needs to be fixed
// CHANGELOG: 2025-12-23 - Added DeepSeek API status check
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    const claudeKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const githubToken = process.env.GITHUB_TOKEN;
    const vercelToken = process.env.VERCEL_API_TOKEN;
    
    // Test DeepSeek API (Primary for website generation)
    let deepseekStatus = "❌ Not tested";
    let deepseekError = "";
    if (deepseekKey) {
      try {
        const response = await axios.post(
          'https://api.deepseek.com/v1/chat/completions',
          {
            model: 'deepseek-chat',
            messages: [{ role: 'user', content: 'Say Hello' }],
            max_tokens: 10
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${deepseekKey.replace(/^["']|["']$/g, '').trim()}`
            },
            timeout: 10000
          }
        );
        deepseekStatus = "✅ Working (Primary)";
      } catch (error: any) {
        deepseekStatus = `❌ Error: ${error.response?.status || 'Network error'}`;
        deepseekError = error.response?.data?.error?.message || error.message;
      }
    } else {
      deepseekStatus = "⚠️ Not configured";
      deepseekError = "DEEPSEEK_API_KEY not set (will use Gemini as fallback)";
    }
    
    // Test Gemini API (Primary - using Gemini 3.0 Pro)
    let geminiStatus = "❌ Not tested";
    let geminiError = "";
    if (geminiKey) {
      try {
        // Try Gemini 3.0 Pro first, fallback to 3.0 Flash, then 2.5 Pro
        const models = ['gemini-3.0-pro', 'gemini-3.0-flash', 'gemini-2.5-pro'];
        let lastError: any = null;
        let success = false;
        
        for (const model of models) {
          try {
            const response = await axios.post(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey.replace(/^["']|["']$/g, '').trim()}`,
              {
                contents: [{
                  parts: [{ text: "Say Hello" }]
                }]
              },
              {
                headers: {
                  'Content-Type': 'application/json'
                },
                timeout: 10000
              }
            );
            geminiStatus = `✅ Working (${model})`;
            success = true;
            break;
          } catch (error: any) {
            lastError = error;
            continue; // Try next model
          }
        }
        
        if (!success) {
          geminiStatus = `❌ Error: ${lastError?.response?.status || 'Network error'}`;
          geminiError = lastError?.response?.data?.error?.message || lastError?.message || 'All models failed';
        }
      } catch (error: any) {
        geminiStatus = `❌ Error: ${error.response?.status || 'Network error'}`;
        geminiError = error.response?.data?.error?.message || error.message;
      }
    } else {
      geminiStatus = "⚠️ Not configured";
      geminiError = "GEMINI_API_KEY not set";
    }
    
    // Test Claude API (Fallback)
    let claudeStatus = "❌ Not tested";
    let claudeError = "";
    if (claudeKey) {
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
    } else {
      claudeStatus = "⚠️ Not configured";
      claudeError = "CLAUDE_API_KEY not set (optional if Gemini is configured)";
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
        deepseek: {
          configured: !!deepseekKey,
          keyPrefix: deepseekKey?.substring(0, 15) + '...' || 'Not set',
          status: deepseekStatus,
          error: deepseekError
        },
        gemini: {
          configured: !!geminiKey,
          keyPrefix: geminiKey?.substring(0, 15) + '...' || 'Not set',
          status: geminiStatus,
          error: geminiError
        },
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
      websiteGenerator: geminiStatus.includes("✅") ? "Gemini 3.0 Pro" : "Not configured",
      whatNeedsFixing: [
        ...(deepseekStatus.includes("❌") && !deepseekStatus.includes("Not configured") ? ["🔧 DeepSeek API: " + deepseekError] : []),
        ...(geminiStatus.includes("❌") && !geminiStatus.includes("Not configured") ? ["🔧 Gemini API: " + geminiError] : []),
        ...(!deepseekStatus.includes("✅") && !geminiStatus.includes("✅") ? ["🔧 AI Generation: Need DeepSeek or Gemini API key"] : []),
        ...(githubStatus.includes("❌") ? ["🔧 GitHub API: " + githubError] : []),
        ...(vercelStatus.includes("❌") ? ["🔧 Vercel API: " + vercelError] : [])
      ],
      readyForTesting: (deepseekStatus.includes("✅") || geminiStatus.includes("✅"))
    });

  } catch (error: any) {
    return NextResponse.json({
      error: "Status check failed",
      details: error.message
    }, { status: 500 });
  }
}
