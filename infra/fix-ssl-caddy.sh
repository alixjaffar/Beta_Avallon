#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Switching to Caddy ===${NC}"
echo ""

DOMAIN="agents.avallon.ca"
EMAIL="admin@avallon.ca"
N8N_DIR="/opt/avallon-n8n"

# Check if running as root, if not use sudo
if [ "$EUID" -ne 0 ]; then 
    echo -e "${YELLOW}Not running as root, will use sudo${NC}"
    SUDO="sudo"
else
    SUDO=""
fi

echo -e "${BLUE}Stopping nginx...${NC}"
$SUDO systemctl stop nginx 2>/dev/null || true
$SUDO systemctl disable nginx 2>/dev/null || true

echo -e "${BLUE}Installing Caddy...${NC}"

# Install Caddy
if ! command -v caddy &> /dev/null; then
    $SUDO apt-get update -qq
    $SUDO apt-get install -y -qq debian-keyring debian-archive-keyring apt-transport-https curl gpg
    
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | $SUDO gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | $SUDO tee /etc/apt/sources.list.d/caddy-stable.list > /dev/null
    
    $SUDO apt-get update -qq
    $SUDO apt-get install -y -qq caddy
    echo -e "${GREEN}Caddy installed${NC}"
else
    echo -e "${YELLOW}Caddy is already installed${NC}"
fi

echo -e "${BLUE}Configuring firewall...${NC}"
$SUDO ufw allow 80/tcp
$SUDO ufw allow 443/tcp
$SUDO ufw allow 443/udp

echo -e "${BLUE}Creating Caddyfile...${NC}"

# Create Caddyfile
$SUDO tee /etc/caddy/Caddyfile > /dev/null <<CADDYFILE
$DOMAIN {
    reverse_proxy localhost:5678 {
        header_up Host {host}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
        header_up X-Forwarded-Proto {scheme}
        header_up Connection {>Connection}
        header_up Upgrade {>Upgrade}
    }
    handle /healthz {
        respond "healthy"
    }
    log {
        output file /var/log/caddy/access.log
        format json
    }
}
CADDYFILE

$SUDO mkdir -p /var/log/caddy
$SUDO chown caddy:caddy /var/log/caddy

echo -e "${BLUE}Updating n8n docker-compose.yml...${NC}"

cd "$N8N_DIR"

# Read existing passwords
if [ -f ".env.secrets" ]; then
    source .env.secrets
fi

# Update docker-compose.yml with correct domain
if [ -f "docker-compose.yml" ]; then
    cp docker-compose.yml docker-compose.yml.backup.$(date +%Y%m%d_%H%M%S)
    
    # Update environment variables
    sed -i "s|N8N_HOST=.*|N8N_HOST=$DOMAIN|g" docker-compose.yml
    sed -i "s|WEBHOOK_URL=.*|WEBHOOK_URL=https://$DOMAIN/|g" docker-compose.yml
    sed -i "s|N8N_PROTOCOL=.*|N8N_PROTOCOL=https|g" docker-compose.yml
    
    echo -e "${BLUE}Restarting n8n containers...${NC}"
    docker compose down
    docker compose up -d
    
    sleep 10
    echo -e "${GREEN}n8n containers restarted${NC}"
fi

echo -e "${BLUE}Starting Caddy...${NC}"
$SUDO systemctl enable caddy
$SUDO systemctl restart caddy

sleep 5

if $SUDO systemctl is-active --quiet caddy; then
    echo -e "${GREEN}Caddy is running!${NC}"
else
    echo -e "${YELLOW}Checking Caddy status...${NC}"
    $SUDO systemctl status caddy --no-pager -l
fi

echo ""
echo -e "${GREEN}=========================================="
echo "✅ Caddy Setup Complete!"
echo "==========================================${NC}"
echo ""
echo -e "${GREEN}n8n is now available at: https://$DOMAIN${NC}"
echo ""
if [ -f "$N8N_DIR/.env.secrets" ]; then
    source "$N8N_DIR/.env.secrets"
    echo -e "${BLUE}Credentials:${NC}"
    echo -e "  Username: ${GREEN}admin${NC}"
    echo -e "  Password: ${GREEN}${N8N_ADMIN_PASSWORD:-check .env.secrets}${NC}"
fi
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo "  View n8n logs: cd $N8N_DIR && docker compose logs -f"
echo "  View Caddy logs: sudo journalctl -u caddy -f"
echo "  Restart Caddy: sudo systemctl restart caddy"
echo "  Check Caddy status: sudo systemctl status caddy"
echo "  Test SSL: curl -I https://$DOMAIN"
echo ""

















