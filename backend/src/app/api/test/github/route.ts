// CHANGELOG: 2025-01-15 - Test GitHub API integration
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const githubToken = process.env.GITHUB_TOKEN;
    const githubOrg = process.env.GITHUB_ORG;
    
    if (!githubToken) {
      return NextResponse.json({ 
        error: "GitHub token not configured",
        details: "GITHUB_TOKEN is not set in environment variables"
      }, { status: 400 });
    }

    // Test GitHub API authentication
    const response = await axios.get(
      'https://api.github.com/user',
      {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    const user = response.data;
    
    return NextResponse.json({
      success: true,
      message: "🎉 GitHub API is working!",
      user: {
        login: user.login,
        name: user.name,
        email: user.email,
        publicRepos: user.public_repos
      },
      config: {
        tokenConfigured: true,
        orgConfigured: !!githubOrg,
        org: githubOrg || 'Not set'
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      error: "GitHub API test failed",
      details: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data
    }, { status: 500 });
  }
}
