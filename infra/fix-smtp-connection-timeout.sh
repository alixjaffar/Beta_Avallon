#!/bin/bash

# Fix SMTP connection timeout in n8n container
# Run this on your VPS

cd /opt/avallon-n8n

echo "🔍 Diagnosing SMTP Connection Timeout"
echo "======================================"
echo ""

echo "1. Testing connectivity from container to smtp.gmail.com:"
docker compose exec n8n sh -c "timeout 5 nc -zv smtp.gmail.com 587 2>&1" || echo "   ❌ Port 587 connection failed"
echo ""

echo "2. Testing port 465 (alternative SMTP port):"
docker compose exec n8n sh -c "timeout 5 nc -zv smtp.gmail.com 465 2>&1" || echo "   ❌ Port 465 connection failed"
echo ""

echo "3. Testing DNS resolution from container:"
docker compose exec n8n sh -c "nslookup smtp.gmail.com 2>&1 | head -5"
echo ""

echo "4. Testing basic internet connectivity:"
docker compose exec n8n sh -c "timeout 5 ping -c 2 8.8.8.8 2>&1 | head -3" || echo "   ❌ No internet connectivity"
echo ""

echo "======================================"
echo ""
echo "💡 Solution: Use port 465 with secure=true"
echo ""
echo "If port 587 is blocked, port 465 usually works."
echo "Update docker-compose.yml:"
echo "  - N8N_SMTP_PORT=465"
echo "  - N8N_SMTP_SECURE=true"
echo ""













