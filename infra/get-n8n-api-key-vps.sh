#!/bin/bash
# Script to get n8n API key from VPS and configure backend

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== n8n API Key Setup for VPS ===${NC}"
echo ""

# Check if n8n is accessible
echo -e "${YELLOW}Step 1: Checking n8n accessibility...${NC}"
N8N_URL="https://agents.avallon.ca"
if curl -s -o /dev/null -w "%{http_code}" "$N8N_URL" | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✅ n8n is accessible at $N8N_URL${NC}"
else
    echo -e "${RED}⚠️  Warning: Cannot access $N8N_URL${NC}"
    echo "   Make sure HTTPS is working and Caddy is configured correctly"
fi

echo ""
echo -e "${BLUE}Step 2: Get API Key from n8n UI${NC}"
echo ""
echo "Please follow these steps:"
echo "1. Open ${N8N_URL} in your browser"
echo "2. Log in with your n8n credentials"
echo "   - If this is your first time, you may need to create an account"
echo "   - Or use basic auth if configured (check docker-compose.yml)"
echo "3. Navigate to: Settings → API"
echo "   (Direct URL: ${N8N_URL}/settings/api)"
echo "4. Click 'Create API Key'"
echo "5. Give it a name (e.g., 'Avallon Backend Integration')"
echo "6. Copy the API key (it starts with 'n8n_api_...')"
echo ""
read -p "Paste your n8n API key here: " API_KEY

if [ -z "$API_KEY" ]; then
    echo -e "${RED}Error: API key cannot be empty${NC}"
    exit 1
fi

# Validate API key format
if [[ ! "$API_KEY" =~ ^n8n_api_ ]]; then
    echo -e "${YELLOW}⚠️  Warning: API key doesn't start with 'n8n_api_'. It might still be valid.${NC}"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo -e "${BLUE}Step 3: Configure Backend${NC}"
echo ""

BACKEND_DIR="$(cd "$(dirname "$0")/../backend" && pwd)"
ENV_FILE="$BACKEND_DIR/.env"

if [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}Creating .env file from env.example...${NC}"
    if [ -f "$BACKEND_DIR/env.example" ]; then
        cp "$BACKEND_DIR/env.example" "$ENV_FILE"
    else
        touch "$ENV_FILE"
    fi
fi

# Update or add N8N variables
echo -e "${YELLOW}Updating .env file...${NC}"

# Remove existing N8N variables if they exist
sed -i.bak '/^N8N_BASE_URL=/d' "$ENV_FILE" 2>/dev/null || true
sed -i.bak '/^N8N_API_KEY=/d' "$ENV_FILE" 2>/dev/null || true
sed -i.bak '/^N8N_WEBHOOK_URL=/d' "$ENV_FILE" 2>/dev/null || true

# Add new variables
cat >> "$ENV_FILE" <<EOF

# n8n Integration (added by get-n8n-api-key-vps.sh)
N8N_BASE_URL=https://agents.avallon.ca
N8N_API_KEY=$API_KEY
N8N_WEBHOOK_URL=https://agents.avallon.ca/
EOF

# Clean up backup file
rm -f "$ENV_FILE.bak"

echo -e "${GREEN}✅ Updated $ENV_FILE${NC}"
echo ""
echo -e "${BLUE}Step 4: Test Configuration${NC}"
echo ""
echo "To test the configuration:"
echo "1. Restart your backend server:"
echo "   cd backend && npm run dev"
echo ""
echo "2. Visit the test endpoint:"
echo "   http://localhost:3000/api/test/n8n-config"
echo ""
echo "3. You should see:"
echo "   {"
echo "     \"configured\": true,"
echo "     \"n8nBaseUrl\": \"https://agents.avallon.ca\","
echo "     \"n8nApiKey\": \"n8n_api_xxx...\","
echo "     \"n8nApiKeyLength\": <number>"
echo "   }"
echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Restart your backend server"
echo "2. Create an agent in Avallon"
echo "3. Check n8n workflows to see the created workflow"
















