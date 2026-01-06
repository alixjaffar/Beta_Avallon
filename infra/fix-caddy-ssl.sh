#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Fixing Caddy SSL Certificate Issues ===${NC}"
echo ""

DOMAIN="agents.avallon.ca"
SERVER_IP="159.89.113.242"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Error: This script must be run as root${NC}"
    exit 1
fi

echo -e "${BLUE}Step 1: Verifying DNS...${NC}"
DNS_IP=$(dig +short $DOMAIN | tail -n1)
if [ -z "$DNS_IP" ]; then
    echo -e "${RED}❌ DNS lookup failed for $DOMAIN${NC}"
    echo -e "${YELLOW}   Please ensure DNS A record exists and points to $SERVER_IP${NC}"
    exit 1
fi

if [ "$DNS_IP" != "$SERVER_IP" ]; then
    echo -e "${RED}❌ DNS mismatch!${NC}"
    echo -e "   DNS resolves to: $DNS_IP"
    echo -e "   Server IP is: $SERVER_IP"
    echo -e "${YELLOW}   Please update DNS A record for $DOMAIN to point to $SERVER_IP${NC}"
    echo -e "${YELLOW}   Waiting 60 seconds for DNS propagation (if you just updated)...${NC}"
    sleep 60
    
    # Re-check DNS
    DNS_IP=$(dig +short $DOMAIN | tail -n1)
    if [ "$DNS_IP" != "$SERVER_IP" ]; then
        echo -e "${RED}DNS still not correct. Please fix DNS and run this script again.${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✅ DNS is correct${NC}"
echo ""

echo -e "${BLUE}Step 2: Configuring Firewall...${NC}"
ufw allow 80/tcp 2>/dev/null || echo "Port 80 already allowed"
ufw allow 443/tcp 2>/dev/null || echo "Port 443 already allowed"
ufw allow 443/udp 2>/dev/null || echo "Port 443/udp already allowed"
echo -e "${GREEN}✅ Firewall configured${NC}"
echo ""

echo -e "${BLUE}Step 3: Testing Port 80 Accessibility...${NC}"
# Start a simple HTTP server on port 80 for testing if Caddy isn't running
if ! netstat -tuln 2>/dev/null | grep -q ":80 "; then
    echo -e "${YELLOW}⚠️  Port 80 is not listening. Starting Caddy...${NC}"
    systemctl start caddy
    sleep 3
fi

# Test external connectivity
EXTERNAL_TEST=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 http://$SERVER_IP 2>/dev/null || echo "000")
if [ "$EXTERNAL_TEST" = "000" ]; then
    echo -e "${RED}❌ Port 80 is not accessible externally!${NC}"
    echo -e "${YELLOW}   This is likely a cloud provider firewall issue.${NC}"
    echo -e "${YELLOW}   Please check your cloud provider's firewall settings:${NC}"
    echo -e "   - DigitalOcean: Networking → Firewalls"
    echo -e "   - AWS: EC2 → Security Groups"
    echo -e "   - GCP: VPC Network → Firewall Rules"
    echo -e "   - Azure: Network Security Groups"
    echo -e ""
    echo -e "${YELLOW}   Ensure port 80 (HTTP) is open from 0.0.0.0/0${NC}"
    echo ""
    read -p "Have you fixed the firewall? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Please fix the firewall and run this script again.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Port 80 is accessible externally${NC}"
fi
echo ""

echo -e "${BLUE}Step 4: Verifying Caddyfile...${NC}"
if [ ! -f "/etc/caddy/Caddyfile" ]; then
    echo -e "${RED}❌ Caddyfile not found${NC}"
    exit 1
fi

# Ensure domain is in Caddyfile
if ! grep -q "$DOMAIN" /etc/caddy/Caddyfile; then
    echo -e "${YELLOW}⚠️  Domain not found in Caddyfile, updating...${NC}"
    cat > /etc/caddy/Caddyfile <<EOF
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
EOF
fi

# Validate Caddyfile
if caddy validate --config /etc/caddy/Caddyfile > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Caddyfile is valid${NC}"
else
    echo -e "${RED}❌ Caddyfile has syntax errors${NC}"
    caddy validate --config /etc/caddy/Caddyfile
    exit 1
fi
echo ""

echo -e "${BLUE}Step 5: Clearing Caddy Certificate Cache (if needed)...${NC}"
# Option to use staging for testing
read -p "Use Let's Encrypt staging environment for testing? (y/n) [n]: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Using staging environment...${NC}"
    # Add staging CA to Caddyfile temporarily
    sed -i "1i import /etc/caddy/Caddyfile.staging" /etc/caddy/Caddyfile 2>/dev/null || true
    echo "acme_ca https://acme-staging-v02.api.letsencrypt.org/directory" > /etc/caddy/Caddyfile.staging
else
    # Clear any cached certificates that might be causing issues
    echo -e "${BLUE}Clearing certificate cache...${NC}"
    rm -rf /var/lib/caddy/.local/share/caddy/certificates/acme-v02.api.letsencrypt.org-directory/* 2>/dev/null || true
fi
echo ""

echo -e "${BLUE}Step 6: Restarting Caddy...${NC}"
systemctl restart caddy
sleep 5

if systemctl is-active --quiet caddy; then
    echo -e "${GREEN}✅ Caddy is running${NC}"
else
    echo -e "${RED}❌ Caddy failed to start${NC}"
    systemctl status caddy --no-pager -l
    exit 1
fi
echo ""

echo -e "${BLUE}Step 7: Monitoring Certificate Acquisition...${NC}"
echo -e "${YELLOW}Watching Caddy logs for certificate status (30 seconds)...${NC}"
timeout 30 journalctl -u caddy -f --no-pager 2>/dev/null || true
echo ""

echo -e "${BLUE}Step 8: Testing SSL Certificate...${NC}"
sleep 5
SSL_TEST=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 https://$DOMAIN 2>/dev/null || echo "000")
if [ "$SSL_TEST" = "200" ] || [ "$SSL_TEST" = "301" ] || [ "$SSL_TEST" = "302" ]; then
    echo -e "${GREEN}✅ HTTPS is working! (HTTP code: $SSL_TEST)${NC}"
    echo -e "${GREEN}✅ SSL certificate successfully obtained${NC}"
else
    echo -e "${YELLOW}⚠️  HTTPS test returned code: $SSL_TEST${NC}"
    echo -e "${YELLOW}   Certificate may still be provisioning. Check logs:${NC}"
    echo -e "${BLUE}   sudo journalctl -u caddy -f${NC}"
fi
echo ""

echo -e "${GREEN}=== Fix Complete ===${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Check Caddy logs: ${GREEN}sudo journalctl -u caddy -f${NC}"
echo "2. Test HTTPS: ${GREEN}curl -I https://$DOMAIN${NC}"
echo "3. If still failing, check:"
echo "   - DNS propagation: ${GREEN}dig $DOMAIN${NC}"
echo "   - Cloud provider firewall settings"
echo "   - Caddy logs for specific errors"
echo ""
















