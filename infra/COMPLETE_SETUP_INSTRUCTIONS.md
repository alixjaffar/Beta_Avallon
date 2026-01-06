# Complete n8n + Caddy Setup Instructions

## Prerequisites
- ✅ SSL certificate is working (HTTPS enabled)
- ✅ Caddy is installed and running
- ✅ n8n containers are running
- ⚠️ Need to expose port 5678 and verify configuration

## Complete Setup Steps

### Option 1: Automated Setup (Recommended)

**From your local machine:**

```bash
# Copy the setup script to your VPS
scp infra/complete-n8n-caddy-setup.sh root@159.89.113.242:/tmp/

# SSH into your VPS
ssh root@159.89.113.242

# Run the setup script
chmod +x /tmp/complete-n8n-caddy-setup.sh
/tmp/complete-n8n-caddy-setup.sh
```

The script will:
1. ✅ Verify/add port mapping in docker-compose.yml
2. ✅ Verify/update Caddyfile configuration
3. ✅ Restart n8n containers
4. ✅ Wait for services to be ready
5. ✅ Test all connections
6. ✅ Show status and next steps

### Option 2: Manual Setup

**SSH into your VPS:**
```bash
ssh root@159.89.113.242
```

**Step 1: Verify/Add Port Mapping**

```bash
cd /opt/avallon-n8n

# Check if port mapping exists
grep -A 2 "ports:" docker-compose.yml | grep "5678"

# If not found, add it using Python
python3 <<'PYEOF'
import yaml

with open('/opt/avallon-n8n/docker-compose.yml', 'r') as f:
    data = yaml.safe_load(f)

if 'services' in data and 'n8n' in data['services']:
    if 'ports' not in data['services']['n8n']:
        data['services']['n8n']['ports'] = ['127.0.0.1:5678:5678']
    
    with open('/opt/avallon-n8n/docker-compose.yml', 'w') as f:
        yaml.dump(data, f, default_flow_style=False, sort_keys=False, allow_unicode=True)
    print("✅ Port mapping added")
PYEOF
```

**Step 2: Verify Caddyfile**

```bash
cat > /etc/caddy/Caddyfile <<'EOF'
agents.avallon.ca {
    reverse_proxy 127.0.0.1:5678 {
        header_up Host {host}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
        header_up X-Forwarded-Proto {scheme}
        header_up Connection {>Connection}
        header_up Upgrade {>Upgrade}
    }
    handle /healthz {
        respond "healthy"
    }
    log {
        output file /var/log/caddy/access.log
        format json
    }
}
EOF

# Validate
caddy validate --config /etc/caddy/Caddyfile
```

**Step 3: Restart Services**

```bash
# Restart n8n containers
cd /opt/avallon-n8n
docker compose down
docker compose up -d

# Wait for n8n to start (30-60 seconds)
echo "Waiting for n8n to start..."
sleep 45

# Restart Caddy
systemctl reload caddy
```

**Step 4: Verify Everything Works**

```bash
# Check port is exposed
ss -tuln | grep 5678
# Should show: tcp LISTEN ... 127.0.0.1:5678

# Test n8n directly
curl -I http://127.0.0.1:5678
# Should return HTTP 200, 302, or 401

# Test through Caddy
curl -I https://agents.avallon.ca
# Should return HTTP 200, 302, or 401

# Check container status
cd /opt/avallon-n8n
docker compose ps
# Both containers should be "Up"
```

## Verification Checklist

After setup, verify:

- [ ] Port 5678 is listening: `ss -tuln | grep 5678` shows `127.0.0.1:5678`
- [ ] n8n responds: `curl -I http://127.0.0.1:5678` returns HTTP 200/302/401
- [ ] HTTPS works: `curl -I https://agents.avallon.ca` returns HTTP 200/302/401
- [ ] Containers are running: `docker compose ps` shows both containers "Up"
- [ ] Caddy is running: `systemctl status caddy` shows "active (running)"

## Troubleshooting

### Port 5678 not exposed
```bash
cd /opt/avallon-n8n
# Check docker-compose.yml has:
# ports:
#   - "127.0.0.1:5678:5678"
cat docker-compose.yml | grep -A 2 "ports:"
```

### n8n not responding
```bash
# Check n8n logs
cd /opt/avallon-n8n
docker compose logs n8n | tail -50

# Check if n8n is running
docker compose ps

# Restart n8n
docker compose restart n8n
```

### Caddy can't connect to n8n
```bash
# Check Caddy logs
journalctl -u caddy -n 50 --no-pager

# Verify Caddyfile
caddy validate --config /etc/caddy/Caddyfile

# Check if port is accessible
curl -v http://127.0.0.1:5678
```

### HTTPS not working
```bash
# Check SSL certificate
echo | openssl s_client -servername agents.avallon.ca -connect agents.avallon.ca:443 2>/dev/null | openssl x509 -noout -dates

# Check Caddy status
systemctl status caddy

# Restart Caddy
systemctl restart caddy
```

## Expected Results

When everything is working:

1. **Port Status:**
   ```
   tcp   LISTEN  0  4096  127.0.0.1:5678  0.0.0.0:*
   tcp   LISTEN  0  4096  *:80            *:*
   tcp   LISTEN  0  4096  *:443           *:*
   ```

2. **n8n Direct Test:**
   ```
   HTTP/1.1 302 Found
   Location: /login
   ```

3. **HTTPS Test:**
   ```
   HTTP/2 302
   location: /login
   ```

4. **Browser Access:**
   - Navigate to: `https://agents.avallon.ca`
   - Should see n8n login page
   - Login with credentials from `.env.secrets`

## Next Steps

1. **Access n8n:** Open `https://agents.avallon.ca` in your browser
2. **Login:** Use credentials from `/opt/avallon-n8n/.env.secrets`
3. **Create API Key:** Settings → API → Create API Key
4. **Update Backend:** Add API key to your backend configuration

## Useful Commands

```bash
# View n8n logs
cd /opt/avallon-n8n && docker compose logs -f n8n

# View Caddy logs
journalctl -u caddy -f

# Restart n8n
cd /opt/avallon-n8n && docker compose restart

# Restart Caddy
systemctl restart caddy

# Check all services
systemctl status caddy
cd /opt/avallon-n8n && docker compose ps
```
















