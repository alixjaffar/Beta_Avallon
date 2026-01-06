#!/bin/bash

# Automatic fix for N8N_EMAIL_MODE line formatting
# Run this on your VPS: cd /opt/avallon-n8n && bash fix-email-mode-automatic.sh

cd /opt/avallon-n8n

COMPOSE_FILE="docker-compose.n8n.yml"

echo "🔧 Fixing N8N_EMAIL_MODE line formatting..."
echo ""

# Backup the file first
cp "$COMPOSE_FILE" "${COMPOSE_FILE}.backup"
echo "✅ Backup created: ${COMPOSE_FILE}.backup"
echo ""

# Find the line and fix it
# Remove any existing N8N_EMAIL_MODE line that might be malformed
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' '/^[[:space:]]*-[[:space:]]*N8N_EMAIL_MODE=/d' "$COMPOSE_FILE"
    sed -i '' '/^[[:space:]]*N8N_EMAIL_MODE=/d' "$COMPOSE_FILE"
else
    # Linux
    sed -i '/^[[:space:]]*-[[:space:]]*N8N_EMAIL_MODE=/d' "$COMPOSE_FILE"
    sed -i '/^[[:space:]]*N8N_EMAIL_MODE=/d' "$COMPOSE_FILE"
fi

# Find the line with N8N_SECURE_COOKIE and add properly formatted SMTP config after it
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS - insert after N8N_SECURE_COOKIE line
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
    # Linux - insert after N8N_SECURE_COOKIE line
    sed -i '/N8N_SECURE_COOKIE=true/a\      # SMTP Configuration for sending invitation emails\n      # Using Hello@avallon.ca (Google Workspace) via Gmail SMTP\n      - N8N_EMAIL_MODE=smtp\n      - N8N_SMTP_HOST=smtp.gmail.com\n      - N8N_SMTP_PORT=587\n      - N8N_SMTP_USER=Hello@avallon.ca\n      - N8N_SMTP_PASS=oagqtgpxwcldyibn\n      - N8N_SMTP_SENDER=Hello@avallon.ca\n      - N8N_SMTP_SECURE=false' "$COMPOSE_FILE"
fi

echo "✅ Fixed N8N_EMAIL_MODE line"
echo ""

# Verify the fix
echo "📋 Verifying fix:"
grep -A 7 "N8N_SECURE_COOKIE" "$COMPOSE_FILE" | head -10
echo ""

# Check if it's now properly formatted
if grep -q "^[[:space:]]\{6\}- N8N_EMAIL_MODE=smtp" "$COMPOSE_FILE"; then
    echo "✅ N8N_EMAIL_MODE line is now properly formatted!"
    echo ""
    echo "🔄 Recreating container to apply changes..."
    docker compose down
    docker compose up -d
    echo ""
    echo "⏳ Waiting for n8n to start..."
    sleep 10
    echo ""
    echo "🔍 Verifying SMTP env vars are loaded:"
    docker compose exec n8n env | grep -E "N8N_(EMAIL|SMTP)" | sort
    echo ""
    echo "✅ Done! SMTP should now be configured."
else
    echo "⚠️  Formatting might still be incorrect. Please check manually."
fi













