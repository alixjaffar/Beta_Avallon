#!/bin/bash

# Fix SMTP in the correct docker-compose file
# Run this on your VPS

cd /opt/avallon-n8n

echo "🔍 Checking which file docker compose uses..."
echo ""

# Check which file has SMTP config
echo "1. Checking docker-compose.yml (default file):"
if grep -q "N8N_SMTP_HOST" docker-compose.yml; then
    echo "   ✅ SMTP config found in docker-compose.yml"
else
    echo "   ❌ SMTP config NOT in docker-compose.yml"
    echo "   📝 Adding SMTP config to docker-compose.yml..."
    
    # Find N8N_SECURE_COOKIE and add SMTP after it
    if grep -q "N8N_SECURE_COOKIE" docker-compose.yml; then
        sed -i '/N8N_SECURE_COOKIE=true/a\      # SMTP Configuration for sending invitation emails\n      - N8N_EMAIL_MODE=smtp\n      - N8N_SMTP_HOST=smtp.gmail.com\n      - N8N_SMTP_PORT=587\n      - N8N_SMTP_USER=Hello@avallon.ca\n      - N8N_SMTP_PASS=oagqtgpxwcldyibn\n      - N8N_SMTP_SENDER=Hello@avallon.ca\n      - N8N_SMTP_SECURE=false' docker-compose.yml
        echo "   ✅ Added SMTP config"
    else
        echo "   ⚠️  Could not find N8N_SECURE_COOKIE in docker-compose.yml"
        echo "   Please check the file structure"
    fi
fi

echo ""
echo "2. Verifying SMTP config in docker-compose.yml:"
grep -A 7 "N8N_EMAIL_MODE" docker-compose.yml 2>/dev/null || echo "   Not found"

echo ""
echo "3. Recreating container..."
docker compose down
docker compose up -d

echo ""
echo "⏳ Waiting for n8n to start..."
sleep 10

echo ""
echo "4. Verifying SMTP env vars:"
docker compose exec n8n env | grep -E "N8N_(EMAIL|SMTP)" | sort

echo ""
echo "✅ Done!"













