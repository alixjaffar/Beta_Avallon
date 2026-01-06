#!/bin/bash
set -e

VPS_IP="159.89.113.242"
VPS_USER="root"
VPS_PASS="AVallon1231402@rooot"

echo "Connecting to VPS and running complete setup..."

# Check if sshpass is available
if ! command -v sshpass &> /dev/null; then
    echo "Installing sshpass..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install hudochenkov/sshpass/sshpass 2>/dev/null || echo "Please install sshpass: brew install hudochenkov/sshpass/sshpass"
    else
        sudo apt-get install -y sshpass 2>/dev/null || echo "Please install sshpass: sudo apt-get install sshpass"
    fi
fi

# Run setup commands on remote server
sshpass -p "$VPS_PASS" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_IP" <<'REMOTE_SCRIPT'
set -e

echo "=== Starting Complete Setup ==="

# Step 1: Add port mapping
echo "Step 1: Adding port mapping..."
cd /opt/avallon-n8n
python3 <<'PYEOF'
import yaml

with open('/opt/avallon-n8n/docker-compose.yml', 'r') as f:
    data = yaml.safe_load(f)

if 'services' in data and 'n8n' in data['services']:
    if 'ports' not in data['services']['n8n']:
        data['services']['n8n']['ports'] = ['127.0.0.1:5678:5678']
    elif '127.0.0.1:5678:5678' not in data['services']['n8n'].get('ports', []):
        data['services']['n8n']['ports'] = ['127.0.0.1:5678:5678']
    
    with open('/opt/avallon-n8n/docker-compose.yml', 'w') as f:
        yaml.dump(data, f, default_flow_style=False, sort_keys=False, allow_unicode=True)
    print("✅ Port mapping added")
else:
    print("❌ Error: n8n service not found")
    exit(1)
PYEOF

# Step 2: Update Caddyfile
echo ""
echo "Step 2: Updating Caddyfile..."
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
caddy validate --config /etc/caddy/Caddyfile && echo "✅ Caddyfile is valid" || (echo "❌ Caddyfile validation failed"; exit 1)

# Step 3: Restart n8n containers
echo ""
echo "Step 3: Restarting n8n containers..."
cd /opt/avallon-n8n
docker compose down
docker compose up -d

# Step 4: Wait for services
echo ""
echo "Step 4: Waiting for services to start (45 seconds)..."
sleep 45

# Step 5: Verify port
echo ""
echo "Step 5: Verifying port 5678 is exposed..."
if ss -tuln | grep -q "127.0.0.1:5678"; then
    echo "✅ Port 5678 is listening"
else
    echo "❌ Port 5678 is not exposed"
    exit 1
fi

# Step 6: Restart Caddy
echo ""
echo "Step 6: Reloading Caddy..."
systemctl reload caddy
sleep 3

# Step 7: Test connections
echo ""
echo "Step 7: Testing connections..."

echo -n "Testing n8n directly... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5678 2>/dev/null || echo "000")
if [[ "$HTTP_CODE" =~ ^(200|302|401)$ ]]; then
    echo "✅ Success (HTTP $HTTP_CODE)"
else
    echo "⚠️  Got HTTP $HTTP_CODE"
fi

echo -n "Testing HTTPS... "
sleep 2
HTTPS_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 https://agents.avallon.ca 2>/dev/null || echo "000")
if [[ "$HTTPS_CODE" =~ ^(200|302|401)$ ]]; then
    echo "✅ Success (HTTP $HTTPS_CODE)"
else
    echo "⚠️  Got HTTP $HTTPS_CODE"
fi

# Step 8: Show status
echo ""
echo "=== Final Status ==="
echo ""
echo "Container Status:"
docker compose ps
echo ""
echo "Port Status:"
ss -tuln | grep -E ':(80|443|5678)' || echo "No matching ports found"
echo ""
echo "✅ Setup Complete!"
echo "Access n8n at: https://agents.avallon.ca"
REMOTE_SCRIPT

echo ""
echo "Setup completed! Check the output above for status."
















