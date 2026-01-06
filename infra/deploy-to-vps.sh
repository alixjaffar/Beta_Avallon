#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Deploy n8n Setup to VPS ===${NC}"
echo ""

# Configuration
VPS_IP="${VPS_IP:-159.9.113.242}"
VPS_USER="${VPS_USER:-root}"
SETUP_SCRIPT="infra/setup-n8n-vps.sh"
SSH_KEY="${SSH_KEY:-}"

# Check if setup script exists
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SETUP_SCRIPT_PATH="$PROJECT_ROOT/$SETUP_SCRIPT"

if [ ! -f "$SETUP_SCRIPT_PATH" ]; then
    echo -e "${RED}Error: Setup script not found at $SETUP_SCRIPT_PATH${NC}"
    exit 1
fi

# Build SSH command
SSH_CMD="ssh"
if [ -n "$SSH_KEY" ]; then
    SSH_CMD="$SSH_CMD -i $SSH_KEY"
fi
SSH_CMD="$SSH_CMD -o StrictHostKeyChecking=no -o ConnectTimeout=10"

echo -e "${BLUE}Connecting to VPS at $VPS_IP as $VPS_USER...${NC}"
echo ""

# Test SSH connection first
echo -e "${YELLOW}Testing SSH connection...${NC}"
if ! $SSH_CMD "$VPS_USER@$VPS_IP" "echo 'SSH connection successful'" 2>/dev/null; then
    echo -e "${RED}Error: Cannot connect to VPS via SSH${NC}"
    echo ""
    echo -e "${YELLOW}Please ensure:${NC}"
    echo "  1. SSH key is added to the server, OR"
    echo "  2. Password authentication is enabled"
    echo ""
    echo -e "${BLUE}If using SSH key, set:${NC}"
    echo "  export SSH_KEY=~/.ssh/your_key"
    echo ""
    echo -e "${BLUE}If using password, you can manually copy and run:${NC}"
    echo "  scp $SETUP_SCRIPT_PATH $VPS_USER@$VPS_IP:/tmp/"
    echo "  ssh $VPS_USER@$VPS_IP"
    echo "  chmod +x /tmp/setup-n8n-vps.sh && /tmp/setup-n8n-vps.sh"
    exit 1
fi

# Copy setup script to VPS
echo -e "${BLUE}Uploading setup script...${NC}"
$SSH_CMD "$VPS_USER@$VPS_IP" "mkdir -p /tmp/avallon-setup"

# Use scp to copy the script
SCP_CMD="scp"
if [ -n "$SSH_KEY" ]; then
    SCP_CMD="$SCP_CMD -i $SSH_KEY"
fi
SCP_CMD="$SCP_CMD -o StrictHostKeyChecking=no"

$SCP_CMD "$SETUP_SCRIPT_PATH" "$VPS_USER@$VPS_IP:/tmp/avallon-setup/setup-n8n-vps.sh"

# Make script executable and run it
echo -e "${BLUE}Running setup script on VPS...${NC}"
echo -e "${YELLOW}This may take several minutes. Please wait...${NC}"
echo ""

$SSH_CMD "$VPS_USER@$VPS_IP" "chmod +x /tmp/avallon-setup/setup-n8n-vps.sh && /tmp/avallon-setup/setup-n8n-vps.sh"

echo ""
echo -e "${GREEN}=== Deployment Complete! ===${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Access n8n at https://agents.avallon.ca"
echo "  2. Login with the credentials shown above"
echo "  3. Create an API key in Settings → API"
echo "  4. Add the API key to your backend .env file"
echo ""

