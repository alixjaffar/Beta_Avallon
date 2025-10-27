// CHANGELOG: 2025-01-15 - Check GitHub token permissions
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const githubToken = process.env.GITHUB_TOKEN;
    
    if (!githubToken) {
      return NextResponse.json({ 
        error: "GitHub token not configured" 
      }, { status: 400 });
    }

    // Check user info
    const userResponse = await axios.get(
      'https://api.github.com/user',
      {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    // Check token scopes
    const scopes = userResponse.headers['x-oauth-scopes'] || 'Not specified';
    
    // Check if we can list repositories
    const reposResponse = await axios.get(
      'https://api.github.com/user/repos?per_page=5',
      {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: "GitHub token permissions checked",
      user: {
        login: userResponse.data.login,
        name: userResponse.data.name,
        publicRepos: userResponse.data.public_repos
      },
      permissions: {
        scopes: scopes,
        canListRepos: true,
        repoCount: reposResponse.data.length
      },
      requiredScopes: [
        'repo (Full control of private repositories)',
        'public_repo (Access public repositories)',
        'user (Read user profile data)'
      ],
      recommendations: scopes.includes('repo') ? 
        "✅ Token has sufficient permissions" :
        "❌ Token needs 'repo' scope for repository creation"
    });

  } catch (error: any) {
    return NextResponse.json({
      error: "GitHub permissions check failed",
      details: error.message,
      status: error.response?.status,
      responseData: error.response?.data
    }, { status: 500 });
  }
}
