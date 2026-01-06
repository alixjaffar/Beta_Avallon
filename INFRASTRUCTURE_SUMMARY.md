# Avallon Infrastructure Summary

## ✅ Completed Setup

### 1. Database Migration Fixed
- Created migration file: `backend/prisma/migrations/20250123_add_agent_table/migration.sql`
- **Action Required**: Run `npx prisma migrate deploy` when database is accessible to create the Agent table

### 2. n8n VPS Infrastructure
- ✅ Automated provisioning script: `infra/provision_n8n_droplet.sh`
- ✅ Docker Compose setup with Traefik + SSL
- ✅ n8n authentication configured
- ✅ Multi-tenant architecture documented

### 3. Documentation
- ✅ `infra/README.md` - Quick start guide
- ✅ `infra/N8N_SETUP_GUIDE.md` - Complete production setup guide
- ✅ Environment variable examples updated

## 🚀 Quick Start

### Step 1: Run Database Migration

```bash
cd backend
npx prisma migrate deploy
# Or for development:
npx prisma migrate dev
```

This will create the `Agent` table and fix the 500 error.

### Step 2: Provision n8n VPS

```bash
# Ensure .env.infra is configured
cp .env.infra.example .env.infra
# Edit .env.infra with your DigitalOcean token and domain

# Run provisioning script
chmod +x infra/provision_n8n_droplet.sh
./infra/provision_n8n_droplet.sh
```

### Step 3: Configure Backend

After n8n is provisioned:

1. SSH into the server and get the admin password:
   ```bash
   ssh root@<droplet-ip>
   cat /opt/avallon-n8n/.env.secrets
   ```

2. Login to n8n at `https://agents.avallon.ca` and create an API key

3. Update `backend/.env`:
   ```bash
   N8N_BASE_URL=https://agents.avallon.ca
   N8N_API_KEY=your_api_key_here
   N8N_WEBHOOK_URL=https://agents.avallon.ca/
   ```

### Step 4: Test Agent Creation

The agent creation should now work! The backend will:
1. Create agent record in database
2. Create workflow in n8n via API
3. Return embed code to frontend

## 📋 Architecture

```
User → Avallon Frontend → Avallon Backend → n8n API → n8n Instance
                                              ↓
                                         Workflow Execution
```

**Key Points:**
- Users never access n8n UI directly
- Backend uses API key authentication
- Each user's workflows are isolated
- Multi-tenant by design

## 🔧 Troubleshooting

### Agent Creation Fails (500 Error)

**Issue**: `table public.Agent does not exist`

**Solution**: Run database migration
```bash
cd backend
npx prisma migrate deploy
```

### n8n Not Accessible

1. Check DNS: `dig agents.avallon.ca`
2. Check SSL: `curl -I https://agents.avallon.ca`
3. Check containers: `ssh root@<ip> && docker compose ps`

### API Key Not Working

1. Verify key in n8n Settings → API
2. Check backend logs for auth errors
3. Ensure `N8N_BASE_URL` uses `https://`

## 📚 Documentation Files

- `infra/README.md` - Infrastructure automation guide
- `infra/N8N_SETUP_GUIDE.md` - Complete n8n setup guide
- `backend/prisma/migrations/` - Database migrations

## 🎯 Next Steps

1. ✅ Fix Agent table migration
2. ✅ Set up n8n VPS infrastructure
3. 🔄 Run migration when database is accessible
4. 🔄 Provision n8n VPS
5. 🔄 Test end-to-end agent creation
6. 🔄 Implement workflow templates
7. 🔄 Add monitoring and alerts


















