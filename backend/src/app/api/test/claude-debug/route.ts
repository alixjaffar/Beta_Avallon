// CHANGELOG: 2025-01-15 - Debug Claude API key format and test different approaches
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const claudeKey = process.env.CLAUDE_API_KEY;
    
    if (!claudeKey) {
      return NextResponse.json({ 
        error: "No API key found",
        details: "CLAUDE_API_KEY is not set"
      }, { status: 400 });
    }

    // Check key format
    const keyInfo = {
      length: claudeKey.length,
      startsWithSkAnt: claudeKey.startsWith('sk-ant-'),
      prefix: claudeKey.substring(0, 20),
      suffix: claudeKey.substring(claudeKey.length - 10),
      hasSpaces: claudeKey.includes(' '),
      hasNewlines: claudeKey.includes('\n'),
      hasTabs: claudeKey.includes('\t'),
      rawLength: claudeKey.length,
      trimmedLength: claudeKey.trim().length
    };

    // Test with different approaches
    const tests = [];

    // Test 1: Basic request
    try {
      const response1 = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 10,
          messages: [{ role: "user", content: "Hello" }]
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
      tests.push({ name: "Basic request", status: "✅ Success", response: response1.data });
    } catch (error: any) {
      tests.push({ 
        name: "Basic request", 
        status: "❌ Failed", 
        error: error.response?.status,
        message: error.response?.data?.error?.message || error.message
      });
    }

    // Test 2: With trimmed key
    try {
      const trimmedKey = claudeKey.trim();
      const response2 = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 10,
          messages: [{ role: "user", content: "Hello" }]
        },
        {
          headers: {
            'Authorization': `Bearer ${trimmedKey}`,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
          },
          timeout: 10000
        }
      );
      tests.push({ name: "Trimmed key", status: "✅ Success", response: response2.data });
    } catch (error: any) {
      tests.push({ 
        name: "Trimmed key", 
        status: "❌ Failed", 
        error: error.response?.status,
        message: error.response?.data?.error?.message || error.message
      });
    }

    // Test 3: Different model
    try {
      const response3 = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: "claude-3-opus-20240229",
          max_tokens: 10,
          messages: [{ role: "user", content: "Hello" }]
        },
        {
          headers: {
            'Authorization': `Bearer ${claudeKey.trim()}`,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01'
          },
          timeout: 10000
        }
      );
      tests.push({ name: "Different model", status: "✅ Success", response: response3.data });
    } catch (error: any) {
      tests.push({ 
        name: "Different model", 
        status: "❌ Failed", 
        error: error.response?.status,
        message: error.response?.data?.error?.message || error.message
      });
    }

    return NextResponse.json({
      message: "🔍 Claude API Debug Results",
      keyInfo,
      tests,
      recommendations: [
        "Check if your Anthropic account has credits",
        "Verify your account is fully verified",
        "Try generating a completely new API key",
        "Check if there are any account restrictions"
      ]
    });

  } catch (error: any) {
    return NextResponse.json({
      error: "Debug test failed",
      details: error.message
    }, { status: 500 });
  }
}
