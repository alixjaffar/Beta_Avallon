#!/bin/bash

# Get detailed email error messages from n8n
# Run this on your VPS

cd /opt/avallon-n8n

echo "🔍 Getting Detailed Email Error Logs"
echo "====================================="
echo ""

echo "1. Full error context around 'Failed to send email':"
docker compose logs n8n 2>&1 | grep -A 10 -B 5 "Failed to send email" | head -100
echo ""

echo "2. Checking for SMTP authentication errors:"
docker compose logs n8n 2>&1 | grep -i -E "(auth|authentication|login|credential)" | tail -20
echo ""

echo "3. Checking for connection errors:"
docker compose logs n8n 2>&1 | grep -i -E "(connection|timeout|refused|connect)" | tail -20
echo ""

echo "4. Recent full log entries (last 100 lines):"
docker compose logs n8n 2>&1 | tail -100 | grep -E "(error|Error|ERROR|failed|Failed|FAILED)"
echo ""













