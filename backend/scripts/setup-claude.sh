#!/bin/bash

# CHANGELOG: 2025-01-15 - Setup script for Claude API integration
echo "🚀 Setting up Claude API integration for Avallon Cloud..."

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    touch .env.local
fi

# Add Claude configuration
echo "" >> .env.local
echo "# Claude API Configuration" >> .env.local
echo "CLAUDE_API_KEY=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" >> .env.local
echo "CLAUDE_BASE_URL=https://api.anthropic.com/v1" >> .env.local

# Add GitHub configuration (you'll need to set these)
echo "" >> .env.local
echo "# GitHub Integration (REQUIRED for site generation)" >> .env.local
echo "GITHUB_TOKEN=your_github_token_here" >> .env.local
echo "GITHUB_ORG=your_github_org_here" >> .env.local

# Add Vercel configuration (you'll need to set these)
echo "" >> .env.local
echo "# Vercel Deployment (REQUIRED for site generation)" >> .env.local
echo "VERCEL_API_TOKEN=your_vercel_token_here" >> .env.local
echo "VERCEL_TEAM_ID=your_vercel_team_id_here" >> .env.local

echo "✅ Claude API key configured!"
echo ""
echo "🔧 Next steps:"
echo "1. Get your GitHub token: https://github.com/settings/tokens"
echo "2. Get your Vercel token: https://vercel.com/account/tokens"
echo "3. Update the tokens in .env.local"
echo "4. Test the integration: GET /api/test/claude"
echo ""
echo "🎯 Your Claude API key is ready to use!"
