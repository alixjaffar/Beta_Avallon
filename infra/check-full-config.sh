#!/bin/bash

# Check full docker-compose config to see all environment variables
# Run this on your VPS

cd /opt/avallon-n8n

echo "🔍 Checking full docker-compose config for SMTP variables..."
echo ""

# Check full config
docker compose config 2>&1 | grep -E "(N8N_EMAIL|N8N_SMTP)" || echo "❌ No SMTP variables found in parsed config"

echo ""
echo "📋 All N8N environment variables:"
docker compose config 2>&1 | grep "N8N_" | sort

echo ""
echo "📋 Checking file structure around SMTP config:"
grep -B 5 -A 10 "N8N_EMAIL_MODE" docker-compose.n8n.yml













