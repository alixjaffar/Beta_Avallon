#!/bin/bash
# Run this on the server to flush DNS cache and restart Caddy

echo "Flushing DNS cache..."
systemd-resolve --flush-caches 2>/dev/null || resolvectl flush-caches 2>/dev/null || echo "DNS cache flush attempted"

echo ""
echo "Verifying DNS with external servers..."
dig @8.8.8.8 agents.avallon.ca +short
dig @1.1.1.1 agents.avallon.ca +short

echo ""
echo "Restarting Caddy to retry certificate acquisition..."
systemctl restart caddy

echo ""
echo "Waiting 5 seconds..."
sleep 5

echo ""
echo "Checking Caddy status..."
systemctl status caddy --no-pager -l | head -20

echo ""
echo "Watching Caddy logs for certificate status (press Ctrl+C to exit)..."
echo "Look for 'certificate obtained successfully' or similar messages"
echo ""
journalctl -u caddy -f --no-pager
















