# n8n Production Setup Guide for Avallon

This guide walks you through setting up n8n on a VPS for production use with Avallon's multi-tenant architecture.

## Overview

Avallon uses n8n as the backend for AI agents, but **users don't access n8n directly**. Instead:

1. **Avallon Frontend** → Users create agents through Avallon's UI
2. **Avallon Backend** → Calls n8n API to create/manage workflows
3. **n8n Instance** → Runs workflows and executes agent logic

This multi-tenant approach ensures:
- Users can't access other users' workflows
- Avallon controls the agent creation flow
- Better security and isolation

## Step 1: Provision the VPS

Use the automated provisioning script:

```bash
cd /path/to/Beta_Avallon
cp .env.infra.example .env.infra
# Edit .env.infra with your values
./infra/provision_n8n_droplet.sh
```

Or manually:
1. Create a VPS (2 vCPU / 4GB RAM minimum)
2. Install Docker and Docker Compose
3. Configure firewall (ports 22, 80, 443)
4. Point your domain (e.g., `agents.avallon.ca`) to the VPS IP

## Step 2: Initial n8n Setup

After provisioning, SSH into your server:

```bash
ssh root@<droplet-ip>
cd /opt/avallon-n8n
```

### Access n8n Web UI

1. Open `https://agents.avallon.ca` in your browser
2. Login with:
   - Username: `admin`
   - Password: Check `/opt/avallon-n8n/.env.secrets` on the server

### Create API Key

1. In n8n, go to **Settings** → **API**
2. Click **Create API Key**
3. Give it a name (e.g., "Avallon Backend")
4. **Copy the API key** - you'll need it for the backend

## Step 3: Configure Avallon Backend

Update your backend `.env` file:

```bash
# n8n Configuration
N8N_BASE_URL=https://agents.avallon.ca
N8N_API_KEY=your_api_key_from_step_2
N8N_WEBHOOK_URL=https://agents.avallon.ca/
```

## Step 4: Multi-Tenant Architecture

### How It Works

1. **User creates agent in Avallon** → Frontend calls `/api/n8n/agents`
2. **Backend creates workflow in n8n** → Uses n8n API to create workflow
3. **Backend stores workflow ID** → Links n8n workflow ID to Avallon agent
4. **User triggers agent** → Backend calls n8n API to execute workflow

### Security Best Practices

1. **Disable Public Signup**: Already configured in docker-compose.yml
2. **Use API Keys**: Backend authenticates with API key, not user credentials
3. **Workflow Isolation**: Each user's workflows are separate in n8n
4. **Rate Limiting**: Implement rate limits in Avallon backend

## Step 5: Testing the Integration

### Test Agent Creation

```bash
# From your local machine
curl -X POST http://localhost:3000/api/n8n/agents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -d '{
    "name": "Test Agent",
    "prompt": "You are a helpful assistant"
  }'
```

### Verify Workflow Created

1. Login to n8n at `https://agents.avallon.ca`
2. Go to **Workflows**
3. You should see a workflow named "Test Agent"

## Step 6: Production Hardening

### Change Default Passwords

```bash
# SSH into server
ssh root@<droplet-ip>
cd /opt/avallon-n8n

# Edit docker-compose.yml
nano docker-compose.yml
# Change N8N_BASIC_AUTH_PASSWORD to a strong password

# Restart services
docker compose down
docker compose up -d
```

### Enable Additional Security

Add to `docker-compose.yml` n8n environment:

```yaml
- N8N_METRICS=false  # Disable metrics if not needed
- N8N_LOG_LEVEL=warn  # Reduce logging verbosity
- N8N_DISABLE_PRODUCTION_MAIN_PROCESS=false
```

### Backup Strategy

```bash
# Backup n8n data
docker exec n8n-postgres pg_dump -U n8n n8n > backup-$(date +%Y%m%d).sql

# Backup n8n workflows/config
docker exec n8n tar czf /tmp/n8n-backup.tar.gz /home/node/.n8n
docker cp n8n:/tmp/n8n-backup.tar.gz ./n8n-backup-$(date +%Y%m%d).tar.gz
```

## Troubleshooting

### n8n Not Accessible

```bash
# Check if containers are running
docker compose ps

# Check logs
docker compose logs n8n
docker compose logs traefik

# Check DNS
dig agents.avallon.ca
```

### API Key Not Working

1. Verify API key in n8n Settings → API
2. Check backend logs for authentication errors
3. Ensure `N8N_BASE_URL` includes `https://` protocol
4. Verify SSL certificate is valid

### Workflows Not Creating

1. Check backend logs: `cd backend && npm run dev`
2. Verify n8n API is accessible from backend
3. Check n8n logs for errors: `docker logs n8n`

## Architecture Diagram

```
┌─────────────────┐
│  Avallon User   │
│   (Frontend)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Avallon Backend │
│  (Next.js API)  │
└────────┬────────┘
         │
         │ API Key Auth
         ▼
┌─────────────────┐
│   n8n Instance  │
│ (agents.avallon │
│      .ca)       │
└─────────────────┘
```

## Next Steps

1. ✅ VPS provisioned and n8n running
2. ✅ API key created and configured in backend
3. ✅ Test agent creation works
4. 🔄 Implement workflow templates for common agent types
5. 🔄 Add monitoring and alerting
6. 🔄 Set up automated backups

## Support

For issues:
1. Check n8n logs: `docker logs n8n`
2. Check backend logs
3. Verify API connectivity: `curl https://agents.avallon.ca/healthz`


















