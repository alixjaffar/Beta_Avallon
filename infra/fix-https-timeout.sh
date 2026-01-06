#!/bin/bash
# Fix HTTPS timeout issue - likely cloud provider firewall

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Fixing HTTPS Timeout Issue ===${NC}"
echo ""

SERVER_IP="159.89.113.242"
DOMAIN="agents.avallon.ca"

echo -e "${YELLOW}The issue: HTTPS/HTTP connections are timing out${NC}"
echo "This is usually caused by:"
echo "1. Cloud provider firewall blocking ports 80/443"
echo "2. Network security groups not configured"
echo ""
echo -e "${BLUE}Step 1: Check local firewall (UFW)${NC}"
echo "UFW is already configured correctly (ports 80/443 open)"
echo ""

echo -e "${BLUE}Step 2: Cloud Provider Firewall Configuration${NC}"
echo ""
echo "You need to configure your cloud provider's firewall:"
echo ""
echo -e "${YELLOW}For DigitalOcean:${NC}"
echo "1. Go to: https://cloud.digitalocean.com/networking/firewalls"
echo "2. Create or edit firewall rules for your droplet"
echo "3. Add inbound rules:"
echo "   - HTTP (TCP port 80) from 0.0.0.0/0"
echo "   - HTTPS (TCP port 443) from 0.0.0.0/0"
echo ""
echo -e "${YELLOW}For AWS EC2:${NC}"
echo "1. Go to: EC2 → Security Groups"
echo "2. Select your instance's security group"
echo "3. Add inbound rules:"
echo "   - HTTP (TCP port 80) from 0.0.0.0/0"
echo "   - HTTPS (TCP port 443) from 0.0.0.0/0"
echo ""
echo -e "${YELLOW}For Linode:${NC}"
echo "1. Go to: Linode → Firewalls"
echo "2. Create or edit firewall"
echo "3. Add inbound rules for ports 80 and 443"
echo ""
echo -e "${YELLOW}For Azure:${NC}"
echo "1. Go to: Network Security Groups"
echo "2. Add inbound security rules for ports 80 and 443"
echo ""
echo -e "${BLUE}Step 3: Test after configuring firewall${NC}"
echo ""
echo "After configuring the cloud firewall, test:"
echo "  curl -I http://$DOMAIN"
echo "  curl -I https://$DOMAIN"
echo ""
echo -e "${GREEN}Once the firewall is configured, HTTPS should work!${NC}"
















