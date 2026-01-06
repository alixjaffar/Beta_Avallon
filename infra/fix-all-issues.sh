#!/bin/bash

# Fix version field and ensure SMTP is loaded
# Run this on your VPS

cd /opt/avallon-n8n

echo "🔧 Fixing all issues..."
echo ""

# Check which compose file exists
if [ -f "docker-compose.yml" ]; then
    COMPOSE_FILE="docker-compose.yml"
    echo "📁 Using: docker-compose.yml"
elif [ -f "docker-compose.n8n.yml" ]; then
    COMPOSE_FILE="docker-compose.n8n.yml"
    echo "📁 Using: docker-compose.n8n.yml"
else
    echo "❌ No docker-compose file found!"
    exit 1
fi

# Remove version field from correct file
echo ""
echo "1. Removing version field..."
sed -i '/^version:/d' "$COMPOSE_FILE"
echo "✅ Removed version field"
echo ""

# Verify SMTP config exists
echo "2. Checking SMTP configuration..."
if grep -q "N8N_SMTP_HOST" "$COMPOSE_FILE"; then
    echo "✅ SMTP config found in file"
    echo ""
    echo "SMTP config:"
    grep -A 6 "N8N_SMTP_HOST" "$COMPOSE_FILE" | head -7
else
    echo "❌ SMTP config NOT found! Adding it..."
    # Add SMTP config after N8N_SECURE_COOKIE
    sed -i '/N8N_SECURE_COOKIE=true/a\      # SMTP Configuration\n      - N8N_EMAIL_MODE=smtp\n      - N8N_SMTP_HOST=smtp.gmail.com\n      - N8N_SMTP_PORT=587\n      - N8N_SMTP_USER=Hello@avallon.ca\n      - N8N_SMTP_PASS=oagqtgpxwcldyibn\n      - N8N_SMTP_SENDER=Hello@avallon.ca\n      - N8N_SMTP_SECURE=false' "$COMPOSE_FILE"
    echo "✅ Added SMTP config"
fi

echo ""
echo "3. Recreating container to load SMTP..."
docker compose down
docker compose up -d

echo ""
echo "⏳ Waiting for n8n to start..."
sleep 10

echo ""
echo "4. Verifying SMTP env vars are loaded..."
if docker compose exec n8n env | grep -q "N8N_SMTP_HOST"; then
    echo "✅ SMTP environment variables are loaded!"
    echo ""
    docker compose exec n8n env | grep -E "N8N_(EMAIL|SMTP)" | sort
else
    echo "❌ SMTP variables still not loaded!"
    echo ""
    echo "Troubleshooting:"
    echo "1. Check file: $COMPOSE_FILE"
    echo "2. Verify SMTP config is correct"
    echo "3. Check indentation (should be 6 spaces + dash)"
fi

echo ""
echo "✅ Done!"













