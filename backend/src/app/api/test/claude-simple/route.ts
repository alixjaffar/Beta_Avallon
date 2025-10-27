// CHANGELOG: 2025-01-15 - Simple Claude API test without authentication
import { NextResponse } from "next/server";
import { validateClaudeConfig, getClaudeHeaders, CLAUDE_CONFIG } from "@/lib/config/claude";
import { logError, logInfo } from "@/lib/log";
import axios from "axios";

export async function GET() {
  try {
    // Validate configuration
    const configValidation = validateClaudeConfig();
    if (!configValidation.valid) {
      return NextResponse.json({ 
        error: "Claude configuration invalid", 
        details: configValidation.errors 
      }, { status: 400 });
    }

    logInfo('Testing Claude API', { 
      hasApiKey: !!CLAUDE_CONFIG.API_KEY,
      apiKeyPrefix: CLAUDE_CONFIG.API_KEY.substring(0, 10) + '...',
      baseUrl: CLAUDE_CONFIG.BASE_URL
    });

    // Test Claude API with a simple request
    const testPrompt = "Generate a simple 'Hello World' React component in TypeScript. Return only the component code, no explanations.";
    
    const response = await axios.post(
      `${CLAUDE_CONFIG.BASE_URL}/messages`,
      {
        model: CLAUDE_CONFIG.MODEL,
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: testPrompt
          }
        ]
      },
      {
        headers: getClaudeHeaders(),
        timeout: CLAUDE_CONFIG.TIMEOUT
      }
    );

    const generatedCode = response.data.content[0].text;
    
    logInfo('Claude API test successful', { 
      model: CLAUDE_CONFIG.MODEL,
      responseLength: generatedCode.length 
    });

    return NextResponse.json({
      success: true,
      message: "🎉 Claude API is working correctly!",
      config: {
        model: CLAUDE_CONFIG.MODEL,
        baseUrl: CLAUDE_CONFIG.BASE_URL,
        apiKeyConfigured: true
      },
      test: {
        responseLength: generatedCode.length,
        generatedCode: generatedCode.substring(0, 200) + '...'
      }
    });

  } catch (error: any) {
    logError('Claude API test failed', error);
    
    if (error.response?.status === 401) {
      return NextResponse.json({ 
        error: "❌ Claude API authentication failed", 
        details: "Please check your CLAUDE_API_KEY in .env.local" 
      }, { status: 401 });
    }
    
    if (error.response?.status === 429) {
      return NextResponse.json({ 
        error: "⏳ Claude API rate limit exceeded", 
        details: "Please wait a moment and try again" 
      }, { status: 429 });
    }
    
    return NextResponse.json({ 
      error: "❌ Claude API test failed", 
      details: error.message,
      config: {
        hasApiKey: !!CLAUDE_CONFIG.API_KEY,
        apiKeyPrefix: CLAUDE_CONFIG.API_KEY ? CLAUDE_CONFIG.API_KEY.substring(0, 10) + '...' : 'Not set',
        baseUrl: CLAUDE_CONFIG.BASE_URL
      }
    }, { status: 500 });
  }
}
