#!/bin/bash

# Script to verify SMTP configuration in docker-compose.yml
# Run this on your VPS

COMPOSE_FILE="/opt/avallon-n8n/docker-compose.n8n.yml"

echo "🔍 Checking SMTP Configuration in docker-compose.n8n.yml"
echo "=========================================================="
echo ""

# Check for EMAIL_MODE
echo "1. Checking for N8N_EMAIL_MODE:"
if grep -q "N8N_EMAIL_MODE" "$COMPOSE_FILE"; then
    echo "   ✅ Found:"
    grep "N8N_EMAIL_MODE" "$COMPOSE_FILE" | sed 's/^/      /'
else
    echo "   ❌ NOT FOUND - Need to add it!"
fi
echo ""

# Check for SMTP_HOST
echo "2. Checking for N8N_SMTP_HOST:"
if grep -q "N8N_SMTP_HOST" "$COMPOSE_FILE"; then
    echo "   ✅ Found:"
    grep "N8N_SMTP_HOST" "$COMPOSE_FILE" | sed 's/^/      /'
else
    echo "   ❌ NOT FOUND"
fi
echo ""

# Show all SMTP-related lines
echo "3. All SMTP-related configuration:"
echo "   ---------------------------------"
grep -E "N8N_(EMAIL_MODE|SMTP)" "$COMPOSE_FILE" | sed 's/^/      /'
echo ""

# Check if it's commented out
echo "4. Checking for commented lines:"
if grep -E "^[[:space:]]*#[[:space:]]*N8N_EMAIL_MODE" "$COMPOSE_FILE"; then
    echo "   ⚠️  N8N_EMAIL_MODE is commented out (starts with #)"
    echo "   Need to uncomment it!"
fi
echo ""

# Show context around SMTP settings
echo "5. Context around SMTP settings (10 lines before and after):"
echo "   -----------------------------------------------------------"
grep -A 10 -B 10 "N8N_SMTP_HOST" "$COMPOSE_FILE" | head -25
echo ""

echo "✅ Verification complete!"
echo ""
echo "If N8N_EMAIL_MODE is missing or commented, add it before N8N_SMTP_HOST"













