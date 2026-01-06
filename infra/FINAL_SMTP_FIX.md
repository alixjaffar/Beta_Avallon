# Final SMTP Fix - Connection Timeout Issue

## Problem
Still seeing "Connection timeout" errors even after port change.

## Step 1: Verify Port Was Changed

**On VPS, run:**
```bash
cd /opt/avallon-n8n
grep "N8N_SMTP_PORT" docker-compose.yml
```

**If it still shows 587, change it:**
```bash
sed -i 's/N8N_SMTP_PORT=587/N8N_SMTP_PORT=465/' docker-compose.yml
sed -i 's/N8N_SMTP_SECURE=false/N8N_SMTP_SECURE=true/' docker-compose.yml
docker compose down
docker compose up -d
sleep 30
```

## Step 2: Test Connectivity from Container

**Test if container can reach SMTP:**
```bash
docker compose exec n8n sh -c "timeout 5 nc -zv smtp.gmail.com 465"
```

**If this fails:** Firewall is blocking outbound SMTP connections.

## Step 3: Check Firewall Rules

**Check if firewall is blocking:**
```bash
# Check UFW
ufw status

# Check iptables
iptables -L -n | grep -E "(587|465|smtp)"

# Check if outbound connections work
docker compose exec n8n sh -c "timeout 5 ping -c 2 8.8.8.8"
```

## Step 4: Alternative Solution - Use External SMTP Service

If firewall blocks Gmail SMTP, use a service like:
- SendGrid
- Mailgun
- AWS SES
- Or configure firewall to allow SMTP

## Step 5: Workaround - Send Emails from Backend

Since SMTP works from your local machine, we can send invitations directly from the backend instead of n8n.













