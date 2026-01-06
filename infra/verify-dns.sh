#!/bin/bash

DOMAIN="agents.avallon.ca"
EXPECTED_IP="159.89.113.242"

echo "Checking DNS for $DOMAIN..."
echo "Expected IP: $EXPECTED_IP"
echo ""

DNS_IP=$(dig +short $DOMAIN | tail -n1)

if [ -z "$DNS_IP" ]; then
    echo "❌ DNS lookup failed - domain may not exist"
    exit 1
fi

echo "Current DNS IP: $DNS_IP"
echo ""

if [ "$DNS_IP" = "$EXPECTED_IP" ]; then
    echo "✅ DNS is correctly configured!"
    echo ""
    echo "Next steps:"
    echo "1. SSH to server: ssh root@159.89.113.242"
    echo "2. Restart Caddy: systemctl restart caddy"
    echo "3. Watch logs: journalctl -u caddy -f"
else
    echo "❌ DNS mismatch!"
    echo ""
    echo "Please update DNS A record:"
    echo "  Domain: $DOMAIN"
    echo "  Current: $DNS_IP"
    echo "  Should be: $EXPECTED_IP"
    echo ""
    echo "After updating DNS, wait 2-5 minutes for propagation, then:"
    echo "1. Verify: dig $DOMAIN"
    echo "2. Restart Caddy on server"
fi
















