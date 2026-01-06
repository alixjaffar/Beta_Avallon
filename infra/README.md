# Avallon Infrastructure Automation

This directory contains scripts and configuration files for automating the deployment of n8n on DigitalOcean.

## Prerequisites

- DigitalOcean account with API token
- `jq` installed (`brew install jq` on macOS, `apt-get install jq` on Ubuntu)
- SSH key pair (default: `~/.ssh/id_ed25519.pub`)
- Domain name configured with DNS access

## Setup

### 1. Create Environment File

Copy the example environment file and fill in your values:

```bash
cp infra/env.infra.example .env.infra
```

Edit `.env.infra` and set:
- `DIGITALOCEAN_API_TOKEN`: Your DigitalOcean API token
- `SSH_KEY_NAME`: Name for your SSH key in DigitalOcean (default: `avallon-macbook`)
- `SSH_PUBLIC_KEY_PATH`: Path to your SSH public key (default: `$HOME/.ssh/id_ed25519.pub`)
- `N8N_DOMAIN`: Your domain for n8n (e.g., `agents.avallon.ca`)
- `LETSENCRYPT_EMAIL`: Email for Let's Encrypt SSL certificates
- Other variables as needed

### 2. Run the Provisioning Script

Make the script executable and run it:

```bash
chmod +x infra/provision_n8n_droplet.sh
./infra/provision_n8n_droplet.sh
```

The script will:
1. Check/create SSH key in DigitalOcean
2. Create a new droplet (or use existing one)
3. Wait for the droplet to be ready
4. Install Docker and Docker Compose
5. Configure firewall (ports 22, 80, 443)
6. Deploy n8n with Traefik reverse proxy

### 3. Configure DNS

**⚠️ IMPORTANT:** Before SSL certificates can be issued, you must:

1. Create an A record in your DNS provider
2. Point `$N8N_DOMAIN` to the droplet's IP address (printed at the end of the script)
3. Wait for DNS propagation (usually 5-15 minutes)

After DNS propagation, Traefik will automatically obtain SSL certificates from Let's Encrypt.

## What Gets Deployed

The script deploys:
- **Traefik**: Reverse proxy with automatic SSL via Let's Encrypt
- **PostgreSQL**: Database for n8n
- **n8n**: Latest version of n8n with HTTPS enabled

All services run in Docker containers managed by Docker Compose.

## Accessing n8n

Once DNS is configured and SSL certificates are issued:
- **URL**: `https://$N8N_DOMAIN`
- **Username**: `admin`
- **Password**: Check `/opt/avallon-n8n/.env.secrets` on the server (generated during provisioning)

**Important**: After first login, create an API key in n8n Settings → API for Avallon backend integration.

See `N8N_SETUP_GUIDE.md` for complete setup instructions including multi-tenant configuration.

## Troubleshooting

### Check Droplet Status
```bash
ssh root@<droplet-ip>
cd /opt/avallon-n8n
docker compose ps
docker compose logs
```

### View Traefik Logs
```bash
docker logs traefik
```

### View n8n Logs
```bash
docker logs n8n
```

### Restart Services
```bash
cd /opt/avallon-n8n
docker compose restart
```

## Security Notes

- The default PostgreSQL password is `n8npassword` - change this in production
- SSH key authentication is required (password auth disabled)
- Firewall only allows ports 22, 80, and 443
- Consider setting up n8n authentication after initial setup

