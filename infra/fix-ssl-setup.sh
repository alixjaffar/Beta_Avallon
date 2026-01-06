#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Fixing SSL Setup ===${NC}"
echo ""

DOMAIN="agents.avallon.ca"
EMAIL="admin@avallon.ca"
N8N_DIR="/opt/avallon-n8n"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Error: This script must be run as root${NC}"
    exit 1
fi

echo -e "${BLUE}Option 1: Fix nginx (current setup)${NC}"
echo -e "${BLUE}Option 2: Switch to Caddy (recommended - simpler)${NC}"
echo ""
read -p "Choose option (1 or 2) [2]: " choice
choice=${choice:-2}

if [ "$choice" = "1" ]; then
    echo -e "${BLUE}Fixing nginx setup...${NC}"
    
    # Stop nginx temporarily
    systemctl stop nginx 2>/dev/null || true
    
    # Create temporary nginx config without SSL
    cat > /etc/nginx/sites-available/n8n <<NGINX_TEMP
# Temporary HTTP-only config for Let's Encrypt
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;

    # Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Proxy to n8n
    location / {
        proxy_pass http://localhost:5678;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
NGINX_TEMP

    # Create certbot webroot directory
    mkdir -p /var/www/certbot
    
    # Test and start nginx
    nginx -t && systemctl start nginx
    
    # Get SSL certificate
    echo -e "${BLUE}Obtaining SSL certificate...${NC}"
    certbot certonly --nginx \
        --non-interactive \
        --agree-tos \
        --email "$EMAIL" \
        -d "$DOMAIN" \
        --webroot \
        --webroot-path=/var/www/certbot
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}SSL certificate obtained!${NC}"
        
        # Now create full HTTPS config
        cat > /etc/nginx/sites-available/n8n <<NGINX_HTTPS
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    proxy_connect_timeout 600s;
    proxy_send_timeout 600s;
    proxy_read_timeout 600s;
    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:5678;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_buffering off;
    }

    location /healthz {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
NGINX_HTTPS

        nginx -t && systemctl restart nginx
        echo -e "${GREEN}nginx configured with SSL!${NC}"
    else
        echo -e "${YELLOW}SSL certificate generation failed. Check DNS and try again.${NC}"
    fi

else
    echo -e "${BLUE}Switching to Caddy...${NC}"
    
    # Stop nginx
    systemctl stop nginx 2>/dev/null || true
    systemctl disable nginx 2>/dev/null || true
    
    # Install Caddy
    if ! command -v caddy &> /dev/null; then
        apt-get update -qq
        apt-get install -y -qq debian-keyring debian-archive-keyring apt-transport-https curl gpg
        curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
        curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
        apt-get update -qq
        apt-get install -y -qq caddy
        echo -e "${GREEN}Caddy installed${NC}"
    fi
    
    # Configure firewall
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 443/udp
    
    # Create Caddyfile
    cat > /etc/caddy/Caddyfile <<CADDYFILE
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

    mkdir -p /var/log/caddy
    chown caddy:caddy /var/log/caddy
    
    # Update n8n docker-compose.yml
    cd "$N8N_DIR"
    
    if [ -f ".env.secrets" ]; then
        source .env.secrets
    fi
    
    if [ -z "$POSTGRES_PASSWORD" ]; then
        POSTGRES_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    fi
    if [ -z "$N8N_ADMIN_PASSWORD" ]; then
        N8N_ADMIN_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    fi
    
    # Update docker-compose.yml with correct domain
    if [ -f "docker-compose.yml" ]; then
        cp docker-compose.yml docker-compose.yml.backup
        
        # Update environment variables in docker-compose.yml
        sed -i "s|N8N_HOST=.*|N8N_HOST=$DOMAIN|g" docker-compose.yml
        sed -i "s|WEBHOOK_URL=.*|WEBHOOK_URL=https://$DOMAIN/|g" docker-compose.yml
        sed -i "s|N8N_PROTOCOL=.*|N8N_PROTOCOL=https|g" docker-compose.yml
        
        # Restart containers
        docker compose down
        docker compose up -d
    fi
    
    # Start Caddy
    systemctl enable caddy
    systemctl restart caddy
    
    sleep 5
    
    if systemctl is-active --quiet caddy; then
        echo -e "${GREEN}Caddy is running!${NC}"
    else
        echo -e "${YELLOW}Checking Caddy status...${NC}"
        systemctl status caddy
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
fi

echo -e "${BLUE}Useful commands:${NC}"
echo "  View n8n logs: cd $N8N_DIR && docker compose logs -f"
if [ "$choice" = "2" ]; then
    echo "  View Caddy logs: journalctl -u caddy -f"
    echo "  Restart Caddy: systemctl restart caddy"
else
    echo "  View nginx logs: journalctl -u nginx -f"
    echo "  Restart nginx: systemctl restart nginx"
fi
echo "  Test SSL: curl -I https://$DOMAIN"
echo ""

















