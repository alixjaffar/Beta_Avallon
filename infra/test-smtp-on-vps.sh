#!/bin/bash

# Test SMTP configuration on n8n VPS
# Run this on your VPS

cd /opt/avallon-n8n

echo "🔍 Testing SMTP Configuration\n"
echo "=" .repeat(60) + "\n"

echo "1. Checking SMTP environment variables in container:"
docker compose exec n8n env | grep -E "N8N_(EMAIL|SMTP)" | sort
echo ""

echo "2. Checking n8n logs for email-related errors:"
docker compose logs n8n | grep -i -E "(email|smtp|mail|invitation)" | tail -20
echo ""

echo "3. Testing SMTP connection (if possible):"
echo "   Note: n8n doesn't expose SMTP test endpoint, but we can check logs"
echo ""

echo "4. Checking if n8n is running:"
docker compose ps n8n
echo ""

echo "💡 If SMTP vars are set but emails aren't sending:"
echo "   1. Check Gmail app password is correct"
echo "   2. Verify 'Less secure app access' is enabled (if needed)"
echo "   3. Check n8n logs for SMTP connection errors"
echo "   4. Try restarting n8n container"













