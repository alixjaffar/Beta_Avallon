#!/bin/bash

# Quick script to remove obsolete version field from docker-compose.yml
# Run this on your VPS

COMPOSE_FILE="/opt/avallon-n8n/docker-compose.n8n.yml"

if [ ! -f "$COMPOSE_FILE" ]; then
    echo "❌ docker-compose.n8n.yml not found"
    exit 1
fi

echo "🔧 Removing obsolete 'version' field from docker-compose.yml..."

# Remove version line (works on both macOS and Linux)
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' '/^version:/d' "$COMPOSE_FILE"
else
    # Linux
    sed -i '/^version:/d' "$COMPOSE_FILE"
fi

# Also remove blank line after version if it exists
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' '/^$/N;/^\n$/d' "$COMPOSE_FILE" 2>/dev/null || true
else
    sed -i '/^$/N;/^\n$/d' "$COMPOSE_FILE" 2>/dev/null || true
fi

echo "✅ Removed 'version' field"
echo ""
echo "The warning will be gone on next docker compose command!"













