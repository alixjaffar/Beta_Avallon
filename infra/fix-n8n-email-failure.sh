#!/bin/bash

# Fix n8n "Failed to send email" errors
# Run this on your VPS

cd /opt/avallon-n8n

echo "🔍 Getting detailed email error logs..."
echo "========================================"
echo ""

# Get more detailed error logs
echo "1. Checking for detailed SMTP error messages:"
docker compose logs n8n 2>&1 | grep -A 5 -B 5 "Failed to send email" | tail -50
echo ""

echo "2. Checking for SMTP connection errors:"
docker compose logs n8n 2>&1 | grep -i -E "(smtp|connection|auth|tls|ssl)" | tail -20
echo ""

echo "3. Checking n8n configuration:"
echo "   Current SMTP settings:"
docker compose exec n8n env | grep -E "N8N_(EMAIL|SMTP)" | sort
echo ""

echo "========================================"
echo ""
echo "💡 Possible fixes:"
echo ""
echo "Fix 1: Add N8N_TRUST_PROXY (for Traefik reverse proxy)"
echo "   Add to docker-compose.yml:"
echo "   - N8N_TRUST_PROXY=true"
echo ""
echo "Fix 2: Check if SMTP password has spaces (should be removed)"
echo "   Current: N8N_SMTP_PASS=oagqtgpxwcldyibn"
echo ""
echo "Fix 3: Try using port 465 with secure=true"
echo "   Change:"
echo "   - N8N_SMTP_PORT=465"
echo "   - N8N_SMTP_SECURE=true"
echo ""













