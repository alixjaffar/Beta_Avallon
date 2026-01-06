#!/bin/bash
# Fix Caddy reverse proxy to use IPv4 instead of IPv6

echo "Checking n8n container status..."
cd /opt/avallon-n8n
docker compose ps

echo ""
echo "Checking if n8n is listening on port 5678..."
netstat -tuln | grep 5678 || ss -tuln | grep 5678

echo ""
echo "Updating Caddyfile to use 127.0.0.1 instead of localhost..."
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

echo ""
echo "Validating Caddyfile..."
caddy validate --config /etc/caddy/Caddyfile

echo ""
echo "Reloading Caddy configuration..."
systemctl reload caddy

echo ""
echo "Checking Caddy status..."
systemctl status caddy --no-pager -l | head -30
















