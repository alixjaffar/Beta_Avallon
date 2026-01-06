#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Setting up Caddy SSL for n8n ===${NC}"
echo ""

# Configuration - EDIT THESE VALUES
DOMAIN="n8n.avallon.ca"  # Change to avallon.ca if you want root domain
EMAIL="admin@avallon.ca"  # Change to your email
N8N_DIR="/opt/avallon-n8n"
TIMEZONE="America/Toronto"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Error: This script must be run as root${NC}"
    exit 1
fi

echo -e "${BLUE}Configuration:${NC}"
echo "  Domain: $DOMAIN"
echo "  Email: $EMAIL"
echo "  Timezone: $TIMEZONE"
echo ""

read -p "Continue with these settings? (y/n) [y]: " confirm
confirm=${confirm:-y}
if [ "$confirm" != "y" ]; then
    echo "Exiting. Edit the script to change settings."
    exit 0
fi

echo ""
echo -e "${BLUE}Step 1: Installing Caddy...${NC}"

# Install Caddy
if ! command -v caddy &> /dev/null; then
    apt-get update -qq
    apt-get install -y -qq debian-keyring debian-archive-keyring apt-transport-https curl gpg
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
    apt-get update -qq
    apt-get install -y -qq caddy
    echo -e "${GREEN}Caddy installed successfully${NC}"
else
    echo -e "${YELLOW}Caddy is already installed${NC}"
fi

echo -e "${BLUE}Step 2: Configuring firewall...${NC}"
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 443/udp
ufw status | grep -E "(80|443)" || echo -e "${YELLOW}Firewall rules configured${NC}"

echo -e "${BLUE}Step 3: Creating Caddy configuration...${NC}"

# Create Caddyfile
cat > /etc/caddy/Caddyfile <<CADDYFILE
$DOMAIN {
    reverse_proxy localhost:5678 {
        header_up Host {host}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
        header_up X-Forwarded-Proto {scheme}
        
        # WebSocket support
        header_up Connection {>Connection}
        header_up Upgrade {>Upgrade}
    }
    
    # Health check endpoint
    handle /healthz {
        respond "healthy"
    }
    
    # Logging
    log {
        output file /var/log/caddy/access.log
        format json
    }
}
CADDYFILE

# Create log directory
mkdir -p /var/log/caddy
chown caddy:caddy /var/log/caddy

echo -e "${BLUE}Step 4: Updating n8n docker-compose.yml...${NC}"

cd "$N8N_DIR"

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}Error: docker-compose.yml not found in $N8N_DIR${NC}"
    exit 1
fi

# Backup existing compose file
cp docker-compose.yml docker-compose.yml.backup

# Read current admin password if exists
if [ -f ".env.secrets" ]; then
    source .env.secrets
fi

# Generate new passwords if they don't exist
if [ -z "$POSTGRES_PASSWORD" ]; then
    POSTGRES_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
fi
if [ -z "$N8N_ADMIN_PASSWORD" ]; then
    N8N_ADMIN_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
fi

# Create updated docker-compose.yml
cat > docker-compose.yml <<DOCKER_COMPOSE_EOF
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: n8n-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: n8n
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: n8n
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U n8n"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - n8n-network

  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=n8n
      - DB_POSTGRESDB_PASSWORD=${POSTGRES_PASSWORD}
      - DB_POSTGRESDB_PORT=5432
      - N8N_HOST=${DOMAIN}
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://${DOMAIN}/
      - GENERIC_TIMEZONE=${TIMEZONE}
      # Authentication
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=${N8N_ADMIN_PASSWORD}
      # API access for Avallon backend
      - N8N_API_KEY_ENABLED=true
      # Security
      - N8N_SECURE_COOKIE=true
      - N8N_METRICS=false
      - N8N_LOG_LEVEL=warn
      # Production settings
      - EXECUTIONS_PROCESS=main
      - EXECUTIONS_MODE=regular
    volumes:
      - n8n_data:/home/node/.n8n
    networks:
      - n8n-network
    labels:
      - "com.docker.compose.service=n8n"

volumes:
  postgres_data:
  n8n_data:

networks:
  n8n-network:
    driver: bridge
DOCKER_COMPOSE_EOF

# Save passwords
cat > "$N8N_DIR/.env.secrets" <<EOF
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
N8N_ADMIN_PASSWORD=$N8N_ADMIN_PASSWORD
DOMAIN=$DOMAIN
TIMEZONE=$TIMEZONE
EOF
chmod 600 "$N8N_DIR/.env.secrets"

echo -e "${BLUE}Step 5: Restarting n8n containers with new configuration...${NC}"
cd "$N8N_DIR"
docker compose down
docker compose up -d

# Wait for n8n to be ready
echo -e "${YELLOW}Waiting for n8n to start...${NC}"
sleep 10

# Check if containers are running
if docker compose ps | grep -q "Up"; then
    echo -e "${GREEN}n8n containers are running!${NC}"
else
    echo -e "${RED}Error: n8n containers failed to start${NC}"
    docker compose logs
    exit 1
fi

echo -e "${BLUE}Step 6: Starting and enabling Caddy...${NC}"
systemctl enable caddy
systemctl restart caddy

# Wait a moment for Caddy to start
sleep 5

# Check Caddy status
if systemctl is-active --quiet caddy; then
    echo -e "${GREEN}Caddy is running!${NC}"
else
    echo -e "${YELLOW}Warning: Caddy may need a moment to start${NC}"
    systemctl status caddy
fi

echo ""
echo -e "${GREEN}=========================================="
echo "✅ Setup Complete!"
echo "==========================================${NC}"
echo ""
echo -e "${GREEN}n8n is now available at: https://$DOMAIN${NC}"
echo ""
echo -e "${BLUE}Credentials:${NC}"
echo -e "  Username: ${GREEN}admin${NC}"
echo -e "  Password: ${GREEN}$N8N_ADMIN_PASSWORD${NC}"
echo ""
echo -e "${BLUE}Configuration saved to:${NC}"
echo "  $N8N_DIR/.env.secrets"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "  1. Access n8n at https://$DOMAIN"
echo "  2. Login with the credentials above"
echo "  3. Go to Settings → API and create an API key"
echo "  4. Add the API key to your backend .env file:"
echo "     N8N_BASE_URL=https://$DOMAIN"
echo "     N8N_API_KEY=your_api_key_here"
echo ""
echo -e "${BLUE}Useful Commands:${NC}"
echo "  View n8n logs: cd $N8N_DIR && docker compose logs -f"
echo "  View Caddy logs: journalctl -u caddy -f"
echo "  Restart Caddy: systemctl restart caddy"
echo "  Check Caddy status: systemctl status caddy"
echo "  Test SSL: curl -I https://$DOMAIN"
echo ""

















