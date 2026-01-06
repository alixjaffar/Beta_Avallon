#!/bin/bash

# Script to check and fix SMTP configuration on VPS
# Run this on your VPS: ssh root@159.89.113.242

echo "🔍 Checking SMTP Configuration..."
echo ""

COMPOSE_FILE="/opt/avallon-n8n/docker-compose.n8n.yml"

if [ ! -f "$COMPOSE_FILE" ]; then
    echo "❌ docker-compose.n8n.yml not found at $COMPOSE_FILE"
    exit 1
fi

# Check if SMTP is configured
if grep -q "N8N_SMTP_HOST" "$COMPOSE_FILE"; then
    echo "✅ SMTP configuration found in docker-compose.yml"
    echo ""
    echo "Current SMTP settings:"
    grep -A 6 "N8N_SMTP_HOST" "$COMPOSE_FILE" | head -7
    echo ""
    
    # Check if n8n needs restart
    echo "🔄 Checking if n8n needs restart..."
    echo ""
    echo "To apply SMTP changes, restart n8n:"
    echo "  docker compose restart n8n"
    echo ""
    echo "Then check logs:"
    echo "  docker compose logs n8n | tail -30"
else
    echo "❌ SMTP configuration NOT found!"
    echo ""
    echo "📝 Adding SMTP configuration..."
    echo ""
    
    # Find the line with N8N_SECURE_COOKIE and add SMTP after it
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' '/N8N_SECURE_COOKIE=true/a\
      # SMTP Configuration for sending invitation emails\
      # Using Hello@avallon.ca (Google Workspace) via Gmail SMTP\
      - N8N_EMAIL_MODE=smtp\
      - N8N_SMTP_HOST=smtp.gmail.com\
      - N8N_SMTP_PORT=587\
      - N8N_SMTP_USER=Hello@avallon.ca\
      - N8N_SMTP_PASS=oagqtgpxwcldyibn\
      - N8N_SMTP_SENDER=Hello@avallon.ca\
      - N8N_SMTP_SECURE=false
' "$COMPOSE_FILE"
    else
        # Linux
        sed -i '/N8N_SECURE_COOKIE=true/a\      # SMTP Configuration for sending invitation emails\n      # Using Hello@avallon.ca (Google Workspace) via Gmail SMTP\n      - N8N_EMAIL_MODE=smtp\n      - N8N_SMTP_HOST=smtp.gmail.com\n      - N8N_SMTP_PORT=587\n      - N8N_SMTP_USER=Hello@avallon.ca\n      - N8N_SMTP_PASS=oagqtgpxwcldyibn\n      - N8N_SMTP_SENDER=Hello@avallon.ca\n      - N8N_SMTP_SECURE=false' "$COMPOSE_FILE"
    fi
    
    echo "✅ SMTP configuration added!"
    echo ""
    echo "🔄 Now restart n8n:"
    echo "  docker compose restart n8n"
fi













