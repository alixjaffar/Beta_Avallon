# VPS Deployment Guide for n8n

This guide will help you deploy n8n to your VPS at `159.9.113.242` with nginx reverse proxy and SSL.

## Prerequisites

- VPS IP: `159.9.113.242`
- Domain: `agents.avallon.ca` (DNS A record already configured)
- SSH access to the VPS

## Quick Deployment

### Option 1: Automated Deployment (Recommended)

1. **Set SSH credentials** (choose one method):

   **Method A: Using SSH key**
   ```bash
   export VPS_USER=root
   export SSH_KEY=~/.ssh/id_rsa  # or your SSH key path
   ```

   **Method B: Using password** (you'll be prompted)
   ```bash
   export VPS_USER=root
   ```

2. **Run the deployment script**:
   ```bash
   chmod +x infra/deploy-to-vps.sh
   ./infra/deploy-to-vps.sh
   ```

   The script will:
   - Connect to your VPS
   - Upload the setup script
   - Run the complete setup automatically
   - Display credentials when done

### Option 2: Manual Deployment

1. **Copy the setup script to your VPS**:
   ```bash
   scp infra/setup-n8n-vps.sh root@159.9.113.242:/tmp/
   ```

2. **SSH into your VPS**:
   ```bash
   ssh root@159.9.113.242
   ```

3. **Run the setup script**:
   ```bash
   chmod +x /tmp/setup-n8n-vps.sh
   /tmp/setup-n8n-vps.sh
   ```

## What Gets Installed

The setup script will:

1. ✅ **Update system packages**
2. ✅ **Install Docker and Docker Compose**
3. ✅ **Configure UFW firewall** (ports 22, 80, 443)
4. ✅ **Set up fail2ban** for SSH protection
5. ✅ **Install nginx** reverse proxy
6. ✅ **Deploy n8n** with PostgreSQL database
7. ✅ **Obtain SSL certificate** from Let's Encrypt
8. ✅ **Configure automatic SSL renewal**
9. ✅ **Set up persistent storage** for workflows and data

## Configuration Details

### n8n Configuration

- **Internal Port**: 5678
- **External URL**: https://agents.avallon.ca
- **Database**: PostgreSQL 15 (persistent)
- **Storage**: Docker volumes for persistence
- **Auto-restart**: Enabled
- **Timezone**: America/Toronto

### Security Features

- ✅ UFW firewall configured
- ✅ fail2ban for SSH protection
- ✅ SSL/TLS encryption (Let's Encrypt)
- ✅ Basic authentication enabled
- ✅ API key authentication enabled
- ✅ Security headers configured

## Accessing n8n

After deployment:

1. **Access n8n**: https://agents.avallon.ca
2. **Login credentials** will be displayed at the end of the setup script
3. **Credentials are also saved** to `/opt/avallon-n8n/.env.secrets` on the server

## Post-Deployment Steps

### 1. Create API Key in n8n

1. Login to n8n at https://agents.avallon.ca
2. Go to **Settings** → **API**
3. Click **Create API Key**
4. Give it a name (e.g., "Avallon Backend")
5. **Copy the API key**

### 2. Configure Backend

Add to your `backend/.env` file:

```bash
N8N_BASE_URL=https://agents.avallon.ca
N8N_API_KEY=your_api_key_from_step_1
N8N_WEBHOOK_URL=https://agents.avallon.ca/
```

### 3. Test the Connection

```bash
curl -H "X-N8N-API-KEY: your_api_key" https://agents.avallon.ca/api/v1/workflows
```

## Management Commands

### View Logs

```bash
ssh root@159.9.113.242
cd /opt/avallon-n8n
docker compose logs -f
```

### Restart Services

```bash
cd /opt/avallon-n8n
docker compose restart
```

### Stop Services

```bash
cd /opt/avallon-n8n
docker compose down
```

### Start Services

```bash
cd /opt/avallon-n8n
docker compose up -d
```

### Check Status

```bash
cd /opt/avallon-n8n
docker compose ps
```

## Backup

### Backup Database

```bash
ssh root@159.9.113.242
cd /opt/avallon-n8n
docker exec n8n-postgres pg_dump -U n8n n8n > backup-$(date +%Y%m%d).sql
```

### Backup Workflows

```bash
docker exec n8n tar czf /tmp/n8n-backup.tar.gz /home/node/.n8n
docker cp n8n:/tmp/n8n-backup.tar.gz ./n8n-backup-$(date +%Y%m%d).tar.gz
```

## Troubleshooting

### n8n Not Accessible

```bash
# Check if containers are running
ssh root@159.9.113.242
cd /opt/avallon-n8n
docker compose ps

# Check logs
docker compose logs n8n

# Check nginx
systemctl status nginx
nginx -t
```

### SSL Certificate Issues

```bash
# Check certificate status
certbot certificates

# Renew certificate manually
certbot renew

# Check nginx SSL configuration
nginx -t
```

### DNS Issues

```bash
# Verify DNS resolution
dig agents.avallon.ca
nslookup agents.avallon.ca

# Should return: 159.9.113.242
```

### Firewall Issues

```bash
# Check firewall status
ufw status

# Allow ports if needed
ufw allow 80/tcp
ufw allow 443/tcp
```

## File Locations

- **n8n directory**: `/opt/avallon-n8n`
- **docker-compose.yml**: `/opt/avallon-n8n/docker-compose.yml`
- **Credentials**: `/opt/avallon-n8n/.env.secrets`
- **nginx config**: `/etc/nginx/sites-available/n8n`
- **SSL certificates**: `/etc/letsencrypt/live/agents.avallon.ca/`

## Architecture

```
Internet
   │
   ▼
nginx (Port 443, SSL)
   │
   ▼
n8n Container (Port 5678)
   │
   ▼
PostgreSQL Container (Port 5432)
```

## Security Notes

- Default PostgreSQL password is randomly generated and saved to `.env.secrets`
- n8n admin password is randomly generated and saved to `.env.secrets`
- SSH key authentication is recommended over password
- fail2ban will ban IPs after 3 failed SSH attempts
- SSL certificates auto-renew via certbot timer

## Support

For issues:
1. Check logs: `docker compose logs -f`
2. Verify DNS: `dig agents.avallon.ca`
3. Test SSL: `curl -I https://agents.avallon.ca`
4. Check firewall: `ufw status`

