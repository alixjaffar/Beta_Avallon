// CHANGELOG: 2025-01-15 - Test endpoint for Claude API integration
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { validateClaudeConfig, getClaudeHeaders, CLAUDE_CONFIG } from "@/lib/config/claude";
import { logError, logInfo } from "@/lib/log";
import axios from "axios";

export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    
    // Validate configuration
    const configValidation = validateClaudeConfig();
    if (!configValidation.valid) {
      return NextResponse.json({ 
        error: "Claude configuration invalid", 
        details: configValidation.errors 
      }, { status: 400 });
    }

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
      userId: user.id,
      model: CLAUDE_CONFIG.MODEL,
      responseLength: generatedCode.length 
    });

    return NextResponse.json({
      success: true,
      message: "Claude API is working correctly!",
      test: {
        model: CLAUDE_CONFIG.MODEL,
        responseLength: generatedCode.length,
        generatedCode: generatedCode.substring(0, 200) + '...'
      }
    });

  } catch (error: any) {
    logError('Claude API test failed', error);
    
    if (error.response?.status === 401) {
      return NextResponse.json({ 
        error: "Claude API authentication failed", 
        details: "Please check your CLAUDE_API_KEY" 
      }, { status: 401 });
    }
    
    if (error.response?.status === 429) {
      return NextResponse.json({ 
        error: "Claude API rate limit exceeded", 
        details: "Please wait a moment and try again" 
      }, { status: 429 });
    }
    
    return NextResponse.json({ 
      error: "Claude API test failed", 
      details: error.message 
    }, { status: 500 });
  }
}
