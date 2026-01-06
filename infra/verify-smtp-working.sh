#!/bin/bash

# Verify SMTP is actually working in n8n container
# Run this on your VPS

echo "🔍 Verifying SMTP Configuration in n8n Container"
echo "================================================"
echo ""

# Check environment variables in container
echo "1. SMTP Environment Variables in Container:"
docker compose exec n8n env | grep -E "N8N_(EMAIL|SMTP)" | sort
echo ""

# Check n8n logs for SMTP initialization
echo "2. Checking n8n startup logs for SMTP:"
docker compose logs n8n 2>&1 | grep -i -E "(smtp|email|mail|invitation)" | tail -30
echo ""

# Check if n8n can reach SMTP server
echo "3. Testing network connectivity to SMTP server:"
docker compose exec n8n sh -c "timeout 5 nc -zv smtp.gmail.com 587 2>&1 || echo 'Connection failed'"
echo ""

echo "✅ Verification complete!"
echo ""
echo "If SMTP env vars are missing, the container needs to be recreated:"
echo "  docker compose down"
echo "  docker compose up -d"













