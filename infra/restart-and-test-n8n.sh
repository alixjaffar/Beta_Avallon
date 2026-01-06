#!/bin/bash

# Quick script to restart n8n and check SMTP
# Run this on your VPS

echo "🔄 Restarting n8n..."
docker compose restart n8n

echo ""
echo "⏳ Waiting 5 seconds for n8n to start..."
sleep 5

echo ""
echo "📋 Checking n8n logs for SMTP..."
docker compose logs n8n | grep -i smtp | tail -10

echo ""
echo "📋 Recent n8n logs:"
docker compose logs n8n | tail -20

echo ""
echo "✅ Done! Check the logs above for any SMTP errors."
echo ""
echo "💡 If you see SMTP connection errors, verify:"
echo "   1. App password is correct: oagqtgpxwcldyibn"
echo "   2. Hello@avallon.ca has 2FA enabled"
echo "   3. Firewall allows outbound port 587"













