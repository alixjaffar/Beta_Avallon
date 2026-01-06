#!/bin/bash
# Fix docker-compose.yml to add N8N_TRUST_PROXY properly

set -e

cd /opt/avallon-n8n

# Backup
cp docker-compose.yml docker-compose.yml.backup.$(date +%s)

# Use awk to add the line with proper indentation
awk '
/N8N_LOG_LEVEL=warn/ {
    print
    # Extract indentation (spaces before the dash)
    match($0, /^[ ]*/)
    indent = substr($0, 1, RLENGTH)
    print indent "- N8N_TRUST_PROXY=true"
    next
}
{ print }
' docker-compose.yml > docker-compose.yml.tmp

mv docker-compose.yml.tmp docker-compose.yml

echo "Fixed docker-compose.yml"
echo "Verifying..."
docker compose config > /dev/null && echo "✅ YAML is valid" || echo "❌ YAML error"
















