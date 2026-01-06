#!/bin/bash

# Final verification and test of SMTP configuration
# Run this on your VPS

cd /opt/avallon-n8n

echo "🔄 Recreating container to load SMTP..."
docker compose down
docker compose up -d

echo ""
echo "⏳ Waiting for n8n to start..."
sleep 10

echo ""
echo "🔍 Verifying SMTP environment variables are loaded:"
echo "=================================================="
if docker compose exec n8n env | grep -q "N8N_SMTP_HOST"; then
    echo "✅ SUCCESS! SMTP variables are loaded:"
    echo ""
    docker compose exec n8n env | grep -E "N8N_(EMAIL|SMTP)" | sort
    echo ""
    echo "✅ SMTP is configured and ready!"
    echo ""
    echo "📧 Next step: Test invitation sending from your local machine:"
    echo "   cd backend && node manually-send-invitation.js iloveresolvio@gmail.com"
else
    echo "❌ SMTP variables still not loaded!"
    echo ""
    echo "Troubleshooting:"
    echo "1. Check docker-compose.yml has SMTP config"
    echo "2. Verify indentation is correct (6 spaces + dash)"
    echo "3. Check docker compose config: docker compose config | grep SMTP"
fi













