#!/bin/bash

# Test SMTP configuration directly on VPS
# Run this on your VPS to verify SMTP is working

echo "🧪 Testing SMTP Configuration"
echo "=============================="
echo ""

# Check if SMTP env vars are set in container
echo "1. Checking SMTP environment variables in n8n container:"
docker compose exec n8n env | grep -E "N8N_(EMAIL|SMTP)" | sort
echo ""

# Check n8n logs for SMTP errors
echo "2. Checking n8n logs for SMTP/email errors:"
docker compose logs n8n 2>&1 | grep -i -E "(smtp|email|mail)" | tail -20
echo ""

# Try to test SMTP connection from container
echo "3. Testing SMTP connection from n8n container:"
echo "   (This will try to connect to smtp.gmail.com:587)"
docker compose exec n8n sh -c "timeout 5 nc -zv smtp.gmail.com 587 2>&1 || echo 'Connection test failed'"
echo ""

echo "✅ Check complete!"
echo ""
echo "If SMTP env vars are missing, n8n needs to be restarted after adding them."
echo "If connection test fails, check firewall rules."













