#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Complete n8n + Caddy Setup ===${NC}"
echo ""

DOMAIN="agents.avallon.ca"
N8N_DIR="/opt/avallon-n8n"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Error: This script must be run as root${NC}"
    exit 1
fi

echo -e "${BLUE}Step 1: Verifying docker-compose.yml has port mapping...${NC}"
cd "$N8N_DIR"

# Check if port mapping exists
if grep -q "ports:" docker-compose.yml && grep -q "127.0.0.1:5678:5678" docker-compose.yml; then
    echo -e "${GREEN}✅ Port mapping already exists${NC}"
else
    echo -e "${YELLOW}Adding port mapping to docker-compose.yml...${NC}"
    
    # Backup
    cp docker-compose.yml docker-compose.yml.backup.$(date +%Y%m%d_%H%M%S)
    
    # Use Python to add port mapping safely
    python3 <<PYEOF
import yaml
import sys

with open('$N8N_DIR/docker-compose.yml', 'r') as f:
    data = yaml.safe_load(f)

if 'services' in data and 'n8n' in data['services']:
    if 'ports' not in data['services']['n8n']:
        data['services']['n8n']['ports'] = ['127.0.0.1:5678:5678']
        print("Adding port mapping...")
    else:
        # Update existing ports
        if '127.0.0.1:5678:5678' not in data['services']['n8n']['ports']:
            data['services']['n8n']['ports'] = ['127.0.0.1:5678:5678']
            print("Updating port mapping...")
    
    with open('$N8N_DIR/docker-compose.yml', 'w') as f:
        yaml.dump(data, f, default_flow_style=False, sort_keys=False, allow_unicode=True)
    print("✅ Port mapping added successfully")
else:
    print("❌ Error: n8n service not found")
    sys.exit(1)
PYEOF
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to add port mapping${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${BLUE}Step 2: Verifying Caddyfile configuration...${NC}"

# Create/update Caddyfile
cat > /etc/caddy/Caddyfile <<'EOF'
agents.avallon.ca {
    reverse_proxy 127.0.0.1:5678 {
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
EOF

# Validate Caddyfile
if caddy validate --config /etc/caddy/Caddyfile > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Caddyfile is valid${NC}"
else
    echo -e "${RED}❌ Caddyfile validation failed${NC}"
    caddy validate --config /etc/caddy/Caddyfile
    exit 1
fi

echo ""
echo -e "${BLUE}Step 3: Restarting n8n containers...${NC}"
cd "$N8N_DIR"
docker compose down
docker compose up -d

echo ""
echo -e "${BLUE}Step 4: Waiting for n8n to be ready (this may take 30-60 seconds)...${NC}"
echo -e "${YELLOW}Waiting for postgres to be healthy...${NC}"

# Wait for postgres
timeout=60
elapsed=0
while [ $elapsed -lt $timeout ]; do
    if docker compose ps | grep -q "postgres.*healthy"; then
        echo -e "${GREEN}✅ Postgres is healthy${NC}"
        break
    fi
    sleep 2
    elapsed=$((elapsed + 2))
    echo -n "."
done
echo ""

# Wait for n8n to start responding
echo -e "${YELLOW}Waiting for n8n to start responding...${NC}"
timeout=120
elapsed=0
while [ $elapsed -lt $timeout ]; do
    if curl -s -f http://127.0.0.1:5678 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ n8n is responding${NC}"
        break
    fi
    sleep 3
    elapsed=$((elapsed + 3))
    echo -n "."
done
echo ""

if [ $elapsed -ge $timeout ]; then
    echo -e "${RED}❌ n8n did not start in time. Checking logs...${NC}"
    docker compose logs n8n | tail -30
    exit 1
fi

echo ""
echo -e "${BLUE}Step 5: Verifying port 5678 is exposed...${NC}"
if ss -tuln | grep -q "127.0.0.1:5678"; then
    echo -e "${GREEN}✅ Port 5678 is listening on 127.0.0.1${NC}"
else
    echo -e "${RED}❌ Port 5678 is not exposed${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 6: Restarting Caddy...${NC}"
systemctl reload caddy
sleep 3

if systemctl is-active --quiet caddy; then
    echo -e "${GREEN}✅ Caddy is running${NC}"
else
    echo -e "${RED}❌ Caddy failed to start${NC}"
    systemctl status caddy --no-pager -l
    exit 1
fi

echo ""
echo -e "${BLUE}Step 7: Testing connections...${NC}"

# Test n8n directly
echo -n "Testing n8n directly (http://127.0.0.1:5678)... "
if curl -s -f -o /dev/null -w "%{http_code}" http://127.0.0.1:5678 | grep -q "200\|302\|401"; then
    echo -e "${GREEN}✅ Success${NC}"
else
    echo -e "${RED}❌ Failed${NC}"
    curl -I http://127.0.0.1:5678
fi

# Test through Caddy
echo -n "Testing through Caddy (https://$DOMAIN)... "
sleep 2
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 https://$DOMAIN 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "302" ] || [ "$HTTP_CODE" = "401" ]; then
    echo -e "${GREEN}✅ Success (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${YELLOW}⚠️  Got HTTP $HTTP_CODE. Checking Caddy logs...${NC}"
    journalctl -u caddy -n 10 --no-pager
fi

echo ""
echo -e "${GREEN}=========================================="
echo "✅ Setup Complete!"
echo "==========================================${NC}"
echo ""
echo -e "${GREEN}n8n is available at: https://$DOMAIN${NC}"
echo ""
echo -e "${BLUE}Container Status:${NC}"
docker compose ps
echo ""
echo -e "${BLUE}Port Status:${NC}"
ss -tuln | grep -E ':(80|443|5678)'
echo ""
echo -e "${BLUE}Useful Commands:${NC}"
echo "  View n8n logs: cd $N8N_DIR && docker compose logs -f n8n"
echo "  View Caddy logs: journalctl -u caddy -f"
echo "  Restart n8n: cd $N8N_DIR && docker compose restart"
echo "  Restart Caddy: systemctl restart caddy"
echo "  Test HTTPS: curl -I https://$DOMAIN"
echo ""
















