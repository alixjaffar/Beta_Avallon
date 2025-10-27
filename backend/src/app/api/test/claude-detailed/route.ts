// CHANGELOG: 2025-01-15 - Detailed Claude API test with full error reporting
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const apiKey = process.env.CLAUDE_API_KEY;
    const baseUrl = process.env.CLAUDE_BASE_URL || 'https://api.anthropic.com/v1';
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: "No API key found",
        details: "CLAUDE_API_KEY is not set in environment variables"
      }, { status: 400 });
    }

    // Test the API key format
    const isValidFormat = apiKey.startsWith('sk-ant-');
    
    if (!isValidFormat) {
      return NextResponse.json({ 
        error: "Invalid API key format",
        details: `API key should start with 'sk-ant-', but got: ${apiKey.substring(0, 10)}...`
      }, { status: 400 });
    }

    // Make actual API call
    const response = await axios.post(
      `${baseUrl}/messages`,
      {
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 100,
        messages: [
          {
            role: "user",
            content: "Say 'Hello' and nothing else."
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        timeout: 30000
      }
    );

    const result = response.data.content[0].text;
    
    return NextResponse.json({
      success: true,
      message: "🎉 Claude API is working!",
      response: result,
      apiKeyFormat: "Valid",
      apiKeyLength: apiKey.length
    });

  } catch (error: any) {
    return NextResponse.json({
      error: "Claude API test failed",
      details: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      apiKey: process.env.CLAUDE_API_KEY ? 
        process.env.CLAUDE_API_KEY.substring(0, 15) + '...' : 
        'Not set'
    }, { status: 500 });
  }
}
