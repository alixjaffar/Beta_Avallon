#!/bin/bash
# Script to help get n8n API key and configure backend

echo "=== n8n Integration Setup ==="
echo ""
echo "Step 1: Get API Key from n8n"
echo "1. Open https://agents.avallon.ca in your browser"
echo "2. Log in to n8n"
echo "3. Go to Settings → API"
echo "4. Click 'Create API Key'"
echo "5. Copy the API key"
echo ""
read -p "Enter your n8n API key: " API_KEY

if [ -z "$API_KEY" ]; then
    echo "Error: API key cannot be empty"
    exit 1
fi

echo ""
echo "Step 2: Configure Backend"
echo ""
echo "For Vercel deployment:"
echo "1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables"
echo "2. Add these variables:"
echo ""
echo "   N8N_BASE_URL=https://agents.avallon.ca"
echo "   N8N_API_KEY=$API_KEY"
echo "   N8N_WEBHOOK_URL=https://agents.avallon.ca/"
echo ""
echo "3. Redeploy your application"
echo ""
echo "For local development:"
echo "1. Edit backend/.env file:"
echo ""
echo "   N8N_BASE_URL=https://agents.avallon.ca"
echo "   N8N_API_KEY=$API_KEY"
echo "   N8N_WEBHOOK_URL=https://agents.avallon.ca/"
echo ""
echo "2. Restart your dev server: pnpm dev"
echo ""
echo "Step 3: Test"
echo "Visit: http://localhost:3000/api/test/n8n-config"
echo "Or: https://your-vercel-app.vercel.app/api/test/n8n-config"
echo ""
