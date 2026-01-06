#!/bin/bash
# Quick script to access n8n via SSH tunnel

echo "=== Accessing n8n via SSH Tunnel ==="
echo ""
echo "This will create an SSH tunnel so you can access n8n at http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop the tunnel when done"
echo ""
echo "Once the tunnel is running, open: http://localhost:8080"
echo ""

ssh -L 8080:127.0.0.1:5678 root@159.89.113.242
