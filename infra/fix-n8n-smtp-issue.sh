#!/bin/bash

# Fix n8n SMTP issue - SMTP works but n8n isn't using it
# Run this on your VPS

cd /opt/avallon-n8n

echo "🔍 Checking n8n SMTP Configuration"
echo "=================================="
echo ""

# Step 1: Check if SMTP vars are in docker-compose.yml
echo "1. Checking docker-compose.yml for SMTP config:"
if grep -q "N8N_SMTP_HOST" docker-compose.yml; then
    echo "   ✅ SMTP config found in docker-compose.yml"
    grep -A 6 "N8N_SMTP_HOST" docker-compose.yml | head -7
else
    echo "   ❌ SMTP config NOT in docker-compose.yml"
    echo "   Adding it now..."
    
    # Find N8N_SECURE_COOKIE and add SMTP after it
    if grep -q "N8N_SECURE_COOKIE" docker-compose.yml; then
        sed -i '/N8N_SECURE_COOKIE=true/a\      # SMTP Configuration\n      - N8N_EMAIL_MODE=smtp\n      - N8N_SMTP_HOST=smtp.gmail.com\n      - N8N_SMTP_PORT=587\n      - N8N_SMTP_USER=Hello@avallon.ca\n      - N8N_SMTP_PASS=oagqtgpxwcldyibn\n      - N8N_SMTP_SENDER=Hello@avallon.ca\n      - N8N_SMTP_SECURE=false' docker-compose.yml
        echo "   ✅ Added SMTP config"
    else
        echo "   ⚠️  Could not find N8N_SECURE_COOKIE in docker-compose.yml"
    fi
fi

echo ""
echo "2. Checking if SMTP vars are loaded in running container:"
SMTP_VARS=$(docker compose exec n8n env 2>/dev/null | grep -E "N8N_(EMAIL|SMTP)" | wc -l)
if [ "$SMTP_VARS" -ge 6 ]; then
    echo "   ✅ SMTP vars are loaded ($SMTP_VARS variables found)"
    docker compose exec n8n env 2>/dev/null | grep -E "N8N_(EMAIL|SMTP)" | sort
else
    echo "   ❌ SMTP vars NOT loaded in container ($SMTP_VARS variables found, expected 6+)"
    echo "   Container needs to be recreated"
fi

echo ""
echo "3. Checking n8n logs for SMTP errors:"
docker compose logs n8n 2>&1 | grep -i -E "(smtp|email|mail|invitation)" | tail -10

echo ""
echo "=================================="
echo ""

if [ "$SMTP_VARS" -lt 6 ]; then
    echo "🔧 Fixing: Recreating container to load SMTP vars..."
    echo ""
    docker compose down
    sleep 2
    docker compose up -d
    echo ""
    echo "⏳ Waiting for n8n to start..."
    sleep 15
    echo ""
    echo "✅ Container recreated"
    echo ""
    echo "4. Verifying SMTP vars are now loaded:"
    docker compose exec n8n env 2>/dev/null | grep -E "N8N_(EMAIL|SMTP)" | sort
    echo ""
    echo "✅ Done! Try 'Resend Invitation' button in n8n UI now."
else
    echo "✅ SMTP vars are loaded. If emails still don't send:"
    echo "   1. Check n8n logs: docker compose logs n8n | grep -i smtp"
    echo "   2. Try restarting n8n: docker compose restart n8n"
    echo "   3. Check n8n version: docker compose exec n8n n8n --version"
fi













