#!/bin/bash

# Remove obsolete version field from docker-compose.yml
# Run this on your VPS

cd /opt/avallon-n8n

COMPOSE_FILE="docker-compose.n8n.yml"

echo "🔧 Removing obsolete 'version' field..."
echo ""

# Remove version line
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' '/^version:/d' "$COMPOSE_FILE"
    # Remove blank line after version if it exists
    sed -i '' '/^$/N;/^\n$/d' "$COMPOSE_FILE" 2>/dev/null || true
else
    # Linux
    sed -i '/^version:/d' "$COMPOSE_FILE"
    # Remove blank line after version if it exists
    sed -i '/^$/N;/^\n$/d' "$COMPOSE_FILE" 2>/dev/null || true
fi

echo "✅ Removed 'version' field"
echo ""
echo "The warning will be gone on next docker compose command!"













