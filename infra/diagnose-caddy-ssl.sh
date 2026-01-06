#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Caddy SSL Certificate Diagnostic ===${NC}"
echo ""

DOMAIN="agents.avallon.ca"
SERVER_IP="159.89.113.242"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${YELLOW}Not running as root, some checks may require sudo${NC}"
    SUDO="sudo"
else
    SUDO=""
fi

echo -e "${BLUE}1. Checking DNS Configuration...${NC}"
DNS_IP=$(dig +short $DOMAIN | tail -n1)
if [ -z "$DNS_IP" ]; then
    echo -e "${RED}❌ DNS lookup failed - domain may not exist${NC}"
else
    echo -e "   DNS resolves to: ${GREEN}$DNS_IP${NC}"
    if [ "$DNS_IP" = "$SERVER_IP" ]; then
        echo -e "   ${GREEN}✅ DNS correctly points to server IP${NC}"
    else
        echo -e "   ${RED}❌ DNS points to $DNS_IP, but server IP is $SERVER_IP${NC}"
        echo -e "   ${YELLOW}   Fix: Update DNS A record for $DOMAIN to point to $SERVER_IP${NC}"
    fi
fi
echo ""

echo -e "${BLUE}2. Checking Firewall (UFW)...${NC}"
if command -v ufw &> /dev/null; then
    UFW_STATUS=$($SUDO ufw status | grep -i "Status:" | awk '{print $2}')
    echo -e "   UFW Status: ${GREEN}$UFW_STATUS${NC}"
    
    if $SUDO ufw status | grep -q "80/tcp"; then
        echo -e "   ${GREEN}✅ Port 80 is allowed${NC}"
    else
        echo -e "   ${RED}❌ Port 80 is not allowed${NC}"
        echo -e "   ${YELLOW}   Fix: Run 'sudo ufw allow 80/tcp'${NC}"
    fi
    
    if $SUDO ufw status | grep -q "443/tcp"; then
        echo -e "   ${GREEN}✅ Port 443 is allowed${NC}"
    else
        echo -e "   ${RED}❌ Port 443 is not allowed${NC}"
        echo -e "   ${YELLOW}   Fix: Run 'sudo ufw allow 443/tcp'${NC}"
    fi
else
    echo -e "   ${YELLOW}⚠️  UFW not installed (may be using different firewall)${NC}"
fi
echo ""

echo -e "${BLUE}3. Checking if ports are listening...${NC}"
if netstat -tuln 2>/dev/null | grep -q ":80 "; then
    LISTENING_80=$(netstat -tuln 2>/dev/null | grep ":80 " | awk '{print $4}')
    echo -e "   ${GREEN}✅ Port 80 is listening on: $LISTENING_80${NC}"
else
    echo -e "   ${RED}❌ Port 80 is not listening${NC}"
    echo -e "   ${YELLOW}   Caddy should be listening on port 80 for HTTP validation${NC}"
fi

if netstat -tuln 2>/dev/null | grep -q ":443 "; then
    LISTENING_443=$(netstat -tuln 2>/dev/null | grep ":443 " | awk '{print $4}')
    echo -e "   ${GREEN}✅ Port 443 is listening on: $LISTENING_443${NC}"
else
    echo -e "   ${YELLOW}⚠️  Port 443 is not listening (will be after SSL cert is obtained)${NC}"
fi
echo ""

echo -e "${BLUE}4. Checking Caddy Service Status...${NC}"
if systemctl is-active --quiet caddy; then
    echo -e "   ${GREEN}✅ Caddy service is running${NC}"
else
    echo -e "   ${RED}❌ Caddy service is not running${NC}"
    echo -e "   ${YELLOW}   Fix: Run 'sudo systemctl start caddy'${NC}"
fi

if systemctl is-enabled --quiet caddy; then
    echo -e "   ${GREEN}✅ Caddy service is enabled${NC}"
else
    echo -e "   ${YELLOW}⚠️  Caddy service is not enabled${NC}"
    echo -e "   ${YELLOW}   Fix: Run 'sudo systemctl enable caddy'${NC}"
fi
echo ""

echo -e "${BLUE}5. Checking Caddyfile Configuration...${NC}"
if [ -f "/etc/caddy/Caddyfile" ]; then
    echo -e "   ${GREEN}✅ Caddyfile exists${NC}"
    if grep -q "$DOMAIN" /etc/caddy/Caddyfile; then
        echo -e "   ${GREEN}✅ Domain $DOMAIN found in Caddyfile${NC}"
    else
        echo -e "   ${RED}❌ Domain $DOMAIN not found in Caddyfile${NC}"
    fi
    
    # Validate Caddyfile
    if $SUDO caddy validate --config /etc/caddy/Caddyfile 2>&1 | grep -q "Valid"; then
        echo -e "   ${GREEN}✅ Caddyfile syntax is valid${NC}"
    else
        echo -e "   ${RED}❌ Caddyfile syntax error${NC}"
        $SUDO caddy validate --config /etc/caddy/Caddyfile
    fi
else
    echo -e "   ${RED}❌ Caddyfile not found at /etc/caddy/Caddyfile${NC}"
fi
echo ""

echo -e "${BLUE}6. Checking Recent Caddy Logs...${NC}"
echo -e "   ${YELLOW}Last 20 lines of Caddy logs:${NC}"
$SUDO journalctl -u caddy -n 20 --no-pager | tail -n 20
echo ""

echo -e "${BLUE}7. Testing HTTP Access from Server...${NC}"
HTTP_TEST=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://localhost 2>/dev/null || echo "000")
if [ "$HTTP_TEST" != "000" ]; then
    echo -e "   ${GREEN}✅ HTTP request to localhost succeeded (code: $HTTP_TEST)${NC}"
else
    echo -e "   ${RED}❌ HTTP request to localhost failed${NC}"
fi

HTTP_DOMAIN_TEST=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://$DOMAIN 2>/dev/null || echo "000")
if [ "$HTTP_DOMAIN_TEST" != "000" ]; then
    echo -e "   ${GREEN}✅ HTTP request to $DOMAIN succeeded (code: $HTTP_DOMAIN_TEST)${NC}"
else
    echo -e "   ${RED}❌ HTTP request to $DOMAIN failed${NC}"
    echo -e "   ${YELLOW}   This may indicate DNS or external firewall issue${NC}"
fi
echo ""

echo -e "${BLUE}8. Checking Cloud Provider Firewall (if applicable)...${NC}"
echo -e "   ${YELLOW}⚠️  Manual check required:${NC}"
echo -e "   - DigitalOcean: Check Firewall rules in Control Panel"
echo -e "   - AWS: Check Security Groups"
echo -e "   - GCP: Check Firewall Rules"
echo -e "   - Azure: Check Network Security Groups"
echo -e "   ${YELLOW}   Ensure ports 80 and 443 are open from 0.0.0.0/0${NC}"
echo ""

echo -e "${BLUE}9. Testing External Connectivity...${NC}"
echo -e "   ${YELLOW}Testing if port 80 is accessible from external service...${NC}"
EXTERNAL_TEST=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 http://$SERVER_IP 2>/dev/null || echo "000")
if [ "$EXTERNAL_TEST" != "000" ]; then
    echo -e "   ${GREEN}✅ Port 80 is accessible externally (code: $EXTERNAL_TEST)${NC}"
else
    echo -e "   ${RED}❌ Port 80 is not accessible externally${NC}"
    echo -e "   ${YELLOW}   This is likely the issue! Check cloud provider firewall.${NC}"
fi
echo ""

echo -e "${GREEN}=== Diagnostic Complete ===${NC}"
echo ""
echo -e "${BLUE}Common Solutions:${NC}"
echo "1. ${YELLOW}DNS Issue:${NC} Ensure $DOMAIN A record points to $SERVER_IP"
echo "2. ${YELLOW}Cloud Firewall:${NC} Open ports 80 and 443 in your cloud provider's firewall"
echo "3. ${YELLOW}Local Firewall:${NC} Run 'sudo ufw allow 80/tcp && sudo ufw allow 443/tcp'"
echo "4. ${YELLOW}Restart Caddy:${NC} Run 'sudo systemctl restart caddy' after fixing issues"
echo "5. ${YELLOW}Check Logs:${NC} Run 'sudo journalctl -u caddy -f' to watch for errors"
echo ""
















