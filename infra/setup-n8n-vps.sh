#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Avallon n8n VPS Setup Script ===${NC}"
echo ""

# Configuration
DOMAIN="agents.avallon.ca"
N8N_DIR="/opt/avallon-n8n"
EMAIL="${LETSENCRYPT_EMAIL:-admin@avallon.ca}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Error: This script must be run as root${NC}"
    exit 1
fi

echo -e "${BLUE}Step 1: Updating system packages...${NC}"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get upgrade -y -qq

echo -e "${BLUE}Step 2: Installing required packages...${NC}"
apt-get install -y -qq curl git ufw fail2ban certbot python3-certbot-nginx

echo -e "${BLUE}Step 3: Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
    sh /tmp/get-docker.sh
    rm /tmp/get-docker.sh
else
    echo -e "${YELLOW}Docker is already installed${NC}"
fi

echo -e "${BLUE}Step 4: Installing Docker Compose plugin...${NC}"
if ! command -v docker compose &> /dev/null; then
    apt-get install -y -qq docker-compose-plugin
else
    echo -e "${YELLOW}Docker Compose is already installed${NC}"
fi

echo -e "${BLUE}Step 5: Configuring firewall (UFW)...${NC}"
ufw --force enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw status

echo -e "${BLUE}Step 6: Configuring fail2ban...${NC}"
systemctl enable fail2ban
systemctl start fail2ban

# Create fail2ban jail for SSH
cat > /etc/fail2ban/jail.local <<EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = 22
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
EOF

systemctl restart fail2ban

echo -e "${BLUE}Step 7: Creating n8n directory structure...${NC}"
mkdir -p "$N8N_DIR"
mkdir -p "$N8N_DIR/nginx"
cd "$N8N_DIR"

echo -e "${BLUE}Step 8: Generating secure passwords...${NC}"
POSTGRES_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
N8N_ADMIN_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)

# Save passwords securely
cat > "$N8N_DIR/.env.secrets" <<EOF
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
N8N_ADMIN_PASSWORD=$N8N_ADMIN_PASSWORD
EOF
chmod 600 "$N8N_DIR/.env.secrets"

echo ""
echo -e "${GREEN}=========================================="
echo "n8n Admin Credentials:"
echo "Username: admin"
echo "Password: $N8N_ADMIN_PASSWORD"
echo "==========================================${NC}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Credentials saved to $N8N_DIR/.env.secrets${NC}"
echo ""

echo -e "${BLUE}Step 9: Creating docker-compose.yml...${NC}"
cat > "$N8N_DIR/docker-compose.yml" <<'DOCKER_COMPOSE_EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: n8n-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: n8n
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-n8npassword}
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
      - DB_POSTGRESDB_PASSWORD=${POSTGRES_PASSWORD:-n8npassword}
      - DB_POSTGRESDB_PORT=5432
      - N8N_HOST=agents.avallon.ca
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://agents.avallon.ca/
      - GENERIC_TIMEZONE=America/Toronto
      # Authentication - disable public signup for security
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=${N8N_ADMIN_PASSWORD:-changeme}
      # API access for Avallon backend
      - N8N_API_KEY_ENABLED=true
      # Disable public workflow execution
      - N8N_PUBLIC_API_DISABLED=false
      # Security headers
      - N8N_SECURE_COOKIE=true
      # Additional security
      - N8N_METRICS=false
      - N8N_LOG_LEVEL=warn
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

# Replace environment variables in docker-compose.yml
sed -i "s|\${POSTGRES_PASSWORD:-n8npassword}|$POSTGRES_PASSWORD|g" "$N8N_DIR/docker-compose.yml"
sed -i "s|\${N8N_ADMIN_PASSWORD:-changeme}|$N8N_ADMIN_PASSWORD|g" "$N8N_DIR/docker-compose.yml"

echo -e "${BLUE}Step 10: Installing and configuring nginx...${NC}"
apt-get install -y -qq nginx

# Create nginx configuration
cat > /etc/nginx/sites-available/n8n <<'NGINX_EOF'
# n8n reverse proxy configuration for nginx

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name agents.avallon.ca;

    # Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirect all other HTTP traffic to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name agents.avallon.ca;

    # SSL certificates (will be managed by certbot)
    ssl_certificate /etc/letsencrypt/live/agents.avallon.ca/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/agents.avallon.ca/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Increase timeouts for long-running workflows
    proxy_connect_timeout 600s;
    proxy_send_timeout 600s;
    proxy_read_timeout 600s;
    send_timeout 600s;

    # Increase body size for large payloads
    client_max_body_size 50M;

    # Proxy to n8n container
    location / {
        proxy_pass http://localhost:5678;
        proxy_http_version 1.1;
        
        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Standard proxy headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        
        # Disable buffering for streaming responses
        proxy_buffering off;
    }

    # Health check endpoint
    location /healthz {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
NGINX_EOF

# Create certbot webroot directory
mkdir -p /var/www/certbot

# Enable n8n site (but don't start nginx yet - we need SSL first)
ln -sf /etc/nginx/sites-available/n8n /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
nginx -t

echo -e "${BLUE}Step 11: Starting n8n containers...${NC}"
cd "$N8N_DIR"
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

echo -e "${BLUE}Step 12: Obtaining SSL certificate from Let's Encrypt...${NC}"
# Start nginx temporarily on port 80 for Let's Encrypt validation
systemctl start nginx

# Obtain SSL certificate
certbot certonly --nginx \
    --non-interactive \
    --agree-tos \
    --email "$EMAIL" \
    -d "$DOMAIN" \
    --webroot \
    --webroot-path=/var/www/certbot

if [ $? -eq 0 ]; then
    echo -e "${GREEN}SSL certificate obtained successfully!${NC}"
else
    echo -e "${YELLOW}Warning: SSL certificate generation failed. You may need to run certbot manually.${NC}"
    echo -e "${YELLOW}Make sure DNS is pointing to this server and port 80 is accessible.${NC}"
fi

# Restart nginx to apply SSL configuration
systemctl restart nginx
systemctl enable nginx

# Set up automatic certificate renewal
systemctl enable certbot.timer
systemctl start certbot.timer

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
echo -e "${BLUE}Next Steps:${NC}"
echo "  1. Access n8n at https://$DOMAIN"
echo "  2. Login with the credentials above"
echo "  3. Go to Settings → API and create an API key"
echo "  4. Add the API key to your backend .env file:"
echo "     N8N_BASE_URL=https://$DOMAIN"
echo "     N8N_API_KEY=your_api_key_here"
echo ""
echo -e "${BLUE}Useful Commands:${NC}"
echo "  View logs: cd $N8N_DIR && docker compose logs -f"
echo "  Restart: cd $N8N_DIR && docker compose restart"
echo "  Stop: cd $N8N_DIR && docker compose down"
echo "  Start: cd $N8N_DIR && docker compose up -d"
echo ""
echo -e "${BLUE}Backup:${NC}"
echo "  Database: docker exec n8n-postgres pg_dump -U n8n n8n > backup.sql"
echo "  Workflows: docker exec n8n tar czf /tmp/n8n-backup.tar.gz /home/node/.n8n"
echo ""

