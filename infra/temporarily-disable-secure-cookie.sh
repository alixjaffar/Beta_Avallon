#!/bin/bash

# Temporarily disable secure cookie for HTTP access
# Run this on your VPS

cd /opt/avallon-n8n

echo "🔧 Temporarily disabling N8N_SECURE_COOKIE for HTTP access..."
echo ""

# Check current value
if grep -q "N8N_SECURE_COOKIE=true" docker-compose.yml; then
    # Replace with false
    sed -i 's/N8N_SECURE_COOKIE=true/N8N_SECURE_COOKIE=false/' docker-compose.yml
    echo "✅ Changed N8N_SECURE_COOKIE to false"
    echo ""
    echo "🔄 Restarting n8n container..."
    docker compose restart n8n
    echo ""
    echo "✅ Done! You can now access n8n via HTTP"
    echo ""
    echo "⚠️  Remember to re-enable secure cookies after testing:"
    echo "   sed -i 's/N8N_SECURE_COOKIE=false/N8N_SECURE_COOKIE=true/' docker-compose.yml"
    echo "   docker compose restart n8n"
else
    echo "N8N_SECURE_COOKIE is already false or not found"
fi













