# Caddy SSL Setup for n8n

This guide will help you set up Caddy with automatic SSL/HTTPS for your n8n instance.

## Quick Setup

### Option 1: Automated Deployment (Recommended)

```bash
export VPS_USER=root
export VPS_IP=159.89.113.242
export N8N_DOMAIN=n8n.avallon.ca  # or avallon.ca
export LETSENCRYPT_EMAIL=your-email@avallon.ca

./infra/deploy-caddy-ssl.sh
```

### Option 2: Manual Deployment

1. **Copy the script to your VPS:**
   ```bash
   scp infra/setup-caddy-ssl.sh root@159.89.113.242:/tmp/
   ```

2. **SSH into your VPS:**
   ```bash
   ssh root@159.89.113.242
   ```

3. **Run the setup script:**
   ```bash
   chmod +x /tmp/setup-caddy-ssl.sh
   N8N_DOMAIN=n8n.avallon.ca LETSENCRYPT_EMAIL=your-email@avallon.ca /tmp/setup-caddy-ssl.sh
   ```

## What the Script Does

1. ✅ **Installs Caddy** - Automatic HTTPS reverse proxy
2. ✅ **Configures Firewall** - Opens ports 80 and 443
3. ✅ **Creates Caddyfile** - Reverse proxy configuration
4. ✅ **Updates n8n Configuration** - Sets correct environment variables:
   - `N8N_HOST` - Your domain
   - `WEBHOOK_URL` - HTTPS webhook URL
   - `N8N_PROTOCOL` - Set to `https`
   - `GENERIC_TIMEZONE` - America/Toronto
5. ✅ **Restarts Containers** - Applies new configuration
6. ✅ **Starts Caddy** - Enables automatic SSL

## Domain Options

You can use either:
- `n8n.avallon.ca` (subdomain - recommended)
- `avallon.ca` (root domain)

The script will prompt you to confirm or change the domain.

## Environment Variables

The script configures n8n with:
- **N8N_HOST**: Your chosen domain
- **WEBHOOK_URL**: `https://your-domain/`
- **N8N_PROTOCOL**: `https`
- **GENERIC_TIMEZONE**: `America/Toronto`
- **N8N_BASIC_AUTH_ACTIVE**: `true` (security)
- **N8N_API_KEY_ENABLED**: `true` (for backend integration)

## After Setup

1. **Access n8n**: https://your-domain
2. **Login** with credentials shown at the end of setup
3. **Create API Key**: Settings → API → Create API Key
4. **Update Backend**: Add to `backend/.env`:
   ```bash
   N8N_BASE_URL=https://your-domain
   N8N_API_KEY=your_api_key_here
   ```

## Management Commands

### View Logs
```bash
# n8n logs
cd /opt/avallon-n8n
docker compose logs -f

# Caddy logs
journalctl -u caddy -f
```

### Restart Services
```bash
# Restart n8n
cd /opt/avallon-n8n
docker compose restart

# Restart Caddy
systemctl restart caddy
```

### Check Status
```bash
# Check containers
cd /opt/avallon-n8n
docker compose ps

# Check Caddy
systemctl status caddy

# Test SSL
curl -I https://your-domain
```

## Troubleshooting

### SSL Certificate Not Issued

**Quick Fix**: Run the automated diagnostic and fix scripts:

```bash
# Copy scripts to server
scp infra/diagnose-caddy-ssl.sh root@159.89.113.242:/tmp/
scp infra/fix-caddy-ssl.sh root@159.89.113.242:/tmp/

# SSH into server
ssh root@159.89.113.242

# Run diagnostic
chmod +x /tmp/diagnose-caddy-ssl.sh
/tmp/diagnose-caddy-ssl.sh

# Run fix script (if needed)
chmod +x /tmp/fix-caddy-ssl.sh
/tmp/fix-caddy-ssl.sh
```

**Common Issues:**

1. **DNS Not Configured**: Ensure DNS A record points to `159.89.113.242`
   ```bash
   dig agents.avallon.ca
   # Should return: 159.89.113.242
   ```

2. **Cloud Provider Firewall**: Most common issue!
   - **DigitalOcean**: Networking → Firewalls → Add rule for ports 80 and 443
   - **AWS**: EC2 → Security Groups → Inbound rules for ports 80 and 443
   - **GCP**: VPC Network → Firewall Rules → Allow HTTP/HTTPS
   - **Azure**: Network Security Groups → Inbound rules
   - Test: `curl -I http://159.89.113.242` (should work from external network)

3. **Local Firewall (UFW)**: Ensure ports 80 and 443 are open
   ```bash
   ufw status
   ufw allow 80/tcp
   ufw allow 443/tcp
   ```

4. **Check Caddy Logs**:
   ```bash
   journalctl -u caddy -n 50 -f
   ```

5. **Manually Test HTTP**:
   ```bash
   curl -I http://agents.avallon.ca
   curl -I http://159.89.113.242
   ```

### n8n Not Accessible

1. **Check if containers are running**:
   ```bash
   cd /opt/avallon-n8n
   docker compose ps
   ```

2. **Check n8n logs**:
   ```bash
   docker compose logs n8n
   ```

3. **Verify Caddy is proxying**:
   ```bash
   curl -I https://your-domain
   ```

### Caddy Not Starting

1. **Check Caddyfile syntax**:
   ```bash
   caddy validate --config /etc/caddy/Caddyfile
   ```

2. **Check Caddy status**:
   ```bash
   systemctl status caddy
   ```

3. **View detailed logs**:
   ```bash
   journalctl -u caddy -n 100 --no-pager
   ```

## Architecture

```
Internet
   │
   ▼
Caddy (Port 443, Automatic SSL)
   │
   ▼
n8n Container (Port 5678)
   │
   ▼
PostgreSQL Container (Port 5432)
```

## Security Features

- ✅ Automatic SSL/TLS encryption
- ✅ HTTP to HTTPS redirect
- ✅ Secure headers configured
- ✅ Basic authentication enabled
- ✅ API key authentication enabled
- ✅ Firewall configured (ports 22, 80, 443)

## Backup

Credentials and configuration are saved to:
- `/opt/avallon-n8n/.env.secrets`

Backup this file along with your Docker volumes.

