#!/bin/bash

# Debug why n8n invitation isn't sending even though SMTP is configured
# Run this on your VPS

cd /opt/avallon-n8n

echo "🔍 Debugging n8n Invitation Issue"
echo "=================================="
echo ""

echo "1. Checking n8n version:"
docker compose exec n8n n8n --version 2>/dev/null || echo "   Could not get version"
echo ""

echo "2. Checking user status (aleemacheema@gmail.com):"
# Try to get user info via API
echo "   Note: User should be 'pending' to receive invitation"
echo ""

echo "3. Checking n8n logs for email/invitation errors:"
docker compose logs n8n 2>&1 | grep -i -E "(email|smtp|invitation|mail|error)" | tail -30
echo ""

echo "4. Checking recent n8n logs (last 50 lines):"
docker compose logs n8n 2>&1 | tail -50
echo ""

echo "=================================="
echo ""
echo "💡 Possible fixes:"
echo "   1. Restart n8n: docker compose restart n8n"
echo "   2. Check if user is already activated (not pending)"
echo "   3. Try updating n8n to latest version"
echo "   4. Check n8n UI for any error messages when clicking 'Resend Invitation'"













