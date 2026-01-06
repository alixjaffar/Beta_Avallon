#!/bin/bash

# Fix the N8N_EMAIL_MODE line that's showing in red
# Run this on your VPS

cd /opt/avallon-n8n

echo "🔍 Checking N8N_EMAIL_MODE line formatting..."
echo ""

# Show the exact line with special characters visible
echo "Current line (with special chars):"
grep "N8N_EMAIL_MODE" docker-compose.n8n.yml | cat -A

echo ""
echo "Checking indentation (should be 6 spaces + dash + space):"
grep "N8N_EMAIL_MODE" docker-compose.n8n.yml | sed 's/^/|/' | cat -A

echo ""
echo "Comparing with N8N_SECURE_COOKIE (should match):"
grep -E "(N8N_SECURE_COOKIE|N8N_EMAIL_MODE)" docker-compose.n8n.yml | sed 's/^/|/' | cat -A

echo ""
echo "💡 If N8N_EMAIL_MODE line doesn't start with exactly 6 spaces + '- ', fix it:"
echo "   It should look like: '      - N8N_EMAIL_MODE=smtp'"
echo "   (6 spaces, dash, space, then the variable)"













