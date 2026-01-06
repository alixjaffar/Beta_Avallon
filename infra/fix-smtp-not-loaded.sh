#!/bin/bash

# Fix SMTP not being loaded in n8n container
# Run this on your VPS

cd /opt/avallon-n8n

echo "🔍 Step 1: Verifying SMTP config in docker-compose.yml..."
if grep -q "N8N_SMTP_HOST" docker-compose.n8n.yml; then
    echo "✅ SMTP config found in file"
    echo ""
    echo "Current SMTP config:"
    grep -A 6 "N8N_SMTP_HOST" docker-compose.n8n.yml
    echo ""
else
    echo "❌ SMTP config NOT found in docker-compose.yml!"
    echo "Please add it first."
    exit 1
fi

echo "🔄 Step 2: Stopping containers..."
docker compose down

echo ""
echo "🔄 Step 3: Starting containers with new config..."
docker compose up -d

echo ""
echo "⏳ Step 4: Waiting for n8n to start..."
sleep 10

echo ""
echo "🔍 Step 5: Verifying SMTP env vars are loaded..."
if docker compose exec n8n env | grep -q "N8N_SMTP_HOST"; then
    echo "✅ SMTP environment variables are loaded!"
    echo ""
    echo "SMTP variables in container:"
    docker compose exec n8n env | grep -E "N8N_(EMAIL|SMTP)" | sort
else
    echo "❌ SMTP variables still not loaded!"
    echo ""
    echo "Troubleshooting:"
    echo "1. Check docker-compose.n8n.yml has SMTP config"
    echo "2. Make sure indentation is correct (6 spaces + dash)"
    echo "3. Try: docker compose down && docker compose up -d"
fi

echo ""
echo "✅ Done!"













