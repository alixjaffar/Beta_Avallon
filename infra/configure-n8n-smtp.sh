#!/bin/bash

# Script to configure SMTP for n8n invitation emails
# This script updates the docker-compose file with SMTP settings

set -e

echo "📧 n8n SMTP Configuration Script"
echo "=================================="
echo ""

# Check if docker-compose file exists
COMPOSE_FILE="docker-compose.n8n.yml"
if [ ! -f "$COMPOSE_FILE" ]; then
    echo "❌ Error: $COMPOSE_FILE not found"
    echo "   Please run this script from the directory containing docker-compose.n8n.yml"
    exit 1
fi

# Configure for Hello@avallon.ca
echo "📝 Step 1: SMTP Configuration"
echo "-------------------------------"
echo ""
echo "Configuring SMTP for Hello@avallon.ca (Google Workspace)"
echo ""
echo "Using existing App Password from emailService.ts"
echo "App Password: oagq tgpx wcld yibn"
echo ""
read -p "Press Enter to continue with Hello@avallon.ca configuration..." 
SMTP_PASS="oagqtgpxwcldyibn"  # App password with spaces removed

if [ -z "$SMTP_PASS" ]; then
    echo "❌ Error: App password is required"
    exit 1
fi

# Remove spaces from app password (Gmail shows it with spaces)
SMTP_PASS=$(echo "$SMTP_PASS" | tr -d ' ')

if [ ${#SMTP_PASS} -ne 16 ]; then
    echo "⚠️  Warning: App password should be 16 characters (got ${#SMTP_PASS})"
    read -p "Continue anyway? (y/n): " confirm
    if [ "$confirm" != "y" ]; then
        exit 1
    fi
fi

echo ""
echo "✅ App password received"
echo ""

# Check if SMTP is already configured
if grep -q "N8N_SMTP_HOST" "$COMPOSE_FILE"; then
    echo "⚠️  SMTP configuration already exists in $COMPOSE_FILE"
    read -p "Update existing configuration? (y/n): " update
    if [ "$update" != "y" ]; then
        echo "❌ Cancelled"
        exit 1
    fi
    
    # Update existing SMTP_PASS line
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|N8N_SMTP_PASS=.*|N8N_SMTP_PASS=${SMTP_PASS}|" "$COMPOSE_FILE"
    else
        # Linux
        sed -i "s|N8N_SMTP_PASS=.*|N8N_SMTP_PASS=${SMTP_PASS}|" "$COMPOSE_FILE"
    fi
    
    echo "✅ Updated SMTP password in $COMPOSE_FILE"
else
    echo "📝 Adding SMTP configuration to $COMPOSE_FILE"
    
    # Find the line with N8N_SECURE_COOKIE and add SMTP config after it
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' '/N8N_SECURE_COOKIE=true/a\
      # SMTP Configuration for sending invitation emails\
      # Using Hello@avallon.ca (Google Workspace) via Gmail SMTP\
      - N8N_EMAIL_MODE=smtp\
      - N8N_SMTP_HOST=smtp.gmail.com\
      - N8N_SMTP_PORT=587\
      - N8N_SMTP_USER=Hello@avallon.ca\
      - N8N_SMTP_PASS='"${SMTP_PASS}"'\
      - N8N_SMTP_SENDER=Hello@avallon.ca\
      - N8N_SMTP_SECURE=false  # Use TLS
' "$COMPOSE_FILE"
    else
        # Linux
        sed -i '/N8N_SECURE_COOKIE=true/a\      # SMTP Configuration for sending invitation emails\n      # Using Hello@avallon.ca (Google Workspace) via Gmail SMTP\n      - N8N_EMAIL_MODE=smtp\n      - N8N_SMTP_HOST=smtp.gmail.com\n      - N8N_SMTP_PORT=587\n      - N8N_SMTP_USER=Hello@avallon.ca\n      - N8N_SMTP_PASS='"${SMTP_PASS}"'\n      - N8N_SMTP_SENDER=Hello@avallon.ca\n      - N8N_SMTP_SECURE=false  # Use TLS' "$COMPOSE_FILE"
    fi
    
    echo "✅ Added SMTP configuration to $COMPOSE_FILE"
fi

echo ""
echo "📋 Configuration Summary:"
echo "-------------------------"
echo "  SMTP Host: smtp.gmail.com"
echo "  SMTP Port: 587"
echo "  SMTP User: Hello@avallon.ca"
echo "  SMTP Pass: ${SMTP_PASS:0:4}****${SMTP_PASS: -4} (hidden)"
echo "  SMTP Sender: Hello@avallon.ca"
echo ""

# Ask if user wants to restart n8n
echo "🔄 Step 2: Restart n8n"
echo "----------------------"
echo ""
read -p "Restart n8n container now? (y/n): " restart

if [ "$restart" = "y" ]; then
    echo ""
    echo "🔄 Restarting n8n container..."
    
    if docker compose ps n8n > /dev/null 2>&1; then
        docker compose restart n8n
        echo "✅ n8n restarted successfully"
    elif docker ps | grep -q n8n; then
        docker restart n8n
        echo "✅ n8n restarted successfully"
    else
        echo "⚠️  Could not find n8n container"
        echo "   Please restart manually: docker compose restart n8n"
    fi
else
    echo ""
    echo "⏭️  Skipping restart"
    echo "   Remember to restart n8n manually: docker compose restart n8n"
fi

echo ""
echo "✅ SMTP configuration complete!"
echo ""
echo "📝 Next steps:"
echo "1. Test by creating a new user account in Avallon"
echo "2. Check the user's email for invitation"
echo "3. Or manually send invitation: cd ../backend && node manually-send-invitation.js user@example.com"
echo ""

