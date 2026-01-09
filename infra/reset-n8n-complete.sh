#!/bin/bash
# Complete n8n Reset Script
# This will wipe the database and start fresh

set -e

echo "============================================"
echo "  Complete n8n Reset - Fresh Start"
echo "============================================"

VPS_IP="159.89.113.242"
VPS_USER="root"
N8N_DIR="/opt/n8n"

echo ""
echo "This script will:"
echo "  1. Stop all n8n containers"
echo "  2. Remove ALL data (database, workflows, users)"
echo "  3. Set up fresh n8n with new admin account"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Aborted."
    exit 1
fi

echo ""
echo "Connecting to VPS at $VPS_IP..."
echo ""

ssh $VPS_USER@$VPS_IP << 'REMOTE_SCRIPT'
#!/bin/bash
set -e

echo "=== Stopping n8n containers ==="
cd /opt/n8n
docker compose down 2>/dev/null || docker-compose down 2>/dev/null || true

echo ""
echo "=== Removing old data volumes ==="
docker volume rm n8n_postgres_data 2>/dev/null || true
docker volume rm n8n_n8n_data 2>/dev/null || true
docker volume rm opt_n8n_postgres_data 2>/dev/null || true
docker volume rm opt_n8n_n8n_data 2>/dev/null || true

# Also try with directory prefix
cd /opt/n8n
docker volume ls | grep -E "postgres|n8n" | awk '{print $2}' | xargs -r docker volume rm 2>/dev/null || true

echo ""
echo "=== Creating fresh docker-compose.yml ==="

# Create new docker-compose with proper user management enabled
cat > /opt/n8n/docker-compose.yml << 'COMPOSE'
services:
  postgres:
    image: postgres:15-alpine
    container_name: n8n-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: n8n
      POSTGRES_PASSWORD: n8npassword
      POSTGRES_DB: n8n
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U n8n"]
      interval: 10s
      timeout: 5s
      retries: 5

  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    ports:
      - "5678:5678"
    environment:
      # Database
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=n8n
      - DB_POSTGRESDB_PASSWORD=n8npassword
      - DB_POSTGRESDB_PORT=5432
      
      # Host configuration
      - N8N_HOST=agents.avallon.ca
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://agents.avallon.ca/
      - GENERIC_TIMEZONE=America/Toronto
      
      # Security
      - N8N_TRUST_PROXY=true
      - N8N_SECURE_COOKIE=false
      
      # User Management - IMPORTANT: This enables proper user creation
      - N8N_USER_MANAGEMENT_DISABLED=false
      - N8N_PUBLIC_API_DISABLED=false
      
      # SMTP for invitations
      - N8N_EMAIL_MODE=smtp
      - N8N_SMTP_HOST=smtp.gmail.com
      - N8N_SMTP_PORT=587
      - N8N_SMTP_USER=Hello@avallon.ca
      - N8N_SMTP_PASS=oagqtgpxwcldyibn
      - N8N_SMTP_SENDER=Hello@avallon.ca
      - N8N_SMTP_SSL=false
      
    volumes:
      - n8n_data:/home/node/.n8n

  caddy:
    image: caddy:2-alpine
    container_name: caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - n8n

volumes:
  postgres_data:
  n8n_data:
  caddy_data:
  caddy_config:
COMPOSE

echo ""
echo "=== Creating Caddyfile for SSL ==="
cat > /opt/n8n/Caddyfile << 'CADDY'
agents.avallon.ca {
    reverse_proxy n8n:5678
}
CADDY

echo ""
echo "=== Pulling latest images ==="
docker compose pull

echo ""
echo "=== Starting containers ==="
docker compose up -d

echo ""
echo "=== Waiting for n8n to start (30 seconds) ==="
sleep 30

echo ""
echo "=== Checking container status ==="
docker ps

echo ""
echo "============================================"
echo "  n8n Reset Complete!"
echo "============================================"
echo ""
echo "IMPORTANT: First time setup required!"
echo ""
echo "1. Go to: https://agents.avallon.ca"
echo "2. You'll see the SETUP page to create your OWNER account"
echo "3. Create your admin account with:"
echo "   - Email: admin@avallon.ca (or your email)"
echo "   - Password: (choose a strong password)"
echo ""
echo "4. After setup, go to Settings > API to create an API key"
echo "5. Update your backend/.env with the new N8N_API_KEY"
echo ""
echo "============================================"

REMOTE_SCRIPT

echo ""
echo "Done! Now go to https://agents.avallon.ca to set up your admin account."

