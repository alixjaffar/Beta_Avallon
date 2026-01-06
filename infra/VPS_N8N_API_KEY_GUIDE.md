# Getting n8n API Key from VPS Instance

This guide will help you get the API key from your n8n instance running on your VPS and configure your Avallon backend.

## Quick Setup (Automated)

Run the setup script:

```bash
cd infra
./get-n8n-api-key-vps.sh
```

The script will:
1. Check if n8n is accessible
2. Guide you through getting the API key
3. Automatically update your `backend/.env` file

## Manual Setup

### Step 1: Access n8n UI

1. **Open your browser** and go to: `https://agents.avallon.ca`

2. **Log in to n8n:**
   - If you haven't created a user yet, n8n will prompt you to create one
   - Or if basic auth is enabled, use the credentials from your docker-compose.yml
     - Check: `N8N_BASIC_AUTH_USER` and `N8N_BASIC_AUTH_PASSWORD`

3. **If you can't access n8n:**
   - Check if HTTPS is working: `curl -I https://agents.avallon.ca`
   - Check Caddy logs: `journalctl -u caddy -f` on your VPS
   - Verify DNS: `dig agents.avallon.ca`

### Step 2: Get API Key

1. **Navigate to Settings:**
   - Click on your profile icon (top right)
   - Click **"Settings"**
   - Or go directly to: `https://agents.avallon.ca/settings/api`

2. **Create API Key:**
   - Click **"API"** in the left sidebar
   - Click **"Create API Key"** button
   - Enter a name: `Avallon Backend Integration`
   - Click **"Create"**

3. **Copy the API Key:**
   - The API key will be displayed (starts with `n8n_api_...`)
   - **⚠️ IMPORTANT:** Copy it immediately - you won't be able to see it again!
   - Save it securely

### Step 3: Configure Backend

#### Option A: Using the Script (Recommended)

```bash
cd infra
./get-n8n-api-key-vps.sh
```

#### Option B: Manual Configuration

1. **Edit backend/.env file:**
   ```bash
   cd backend
   nano .env
   # or
   code .env
   ```

2. **Add or update these lines:**
   ```env
   N8N_BASE_URL=https://agents.avallon.ca
   N8N_API_KEY=n8n_api_your_actual_key_here
   N8N_WEBHOOK_URL=https://agents.avallon.ca/
   ```

3. **Save the file**

### Step 4: Restart Backend

If your backend is running locally:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd backend
npm run dev
```

If deploying on Vercel:

1. Go to Vercel Dashboard → Your Project
2. Go to **Settings** → **Environment Variables**
3. Add:
   - `N8N_BASE_URL` = `https://agents.avallon.ca`
   - `N8N_API_KEY` = `your_api_key_here`
   - `N8N_WEBHOOK_URL` = `https://agents.avallon.ca/`
4. **Redeploy** your application

### Step 5: Test Configuration

1. **Test endpoint:**
   ```bash
   curl http://localhost:3000/api/test/n8n-config
   ```

   Should return:
   ```json
   {
     "configured": true,
     "n8nBaseUrl": "https://agents.avallon.ca",
     "n8nApiKey": "n8n_api_xxx...",
     "n8nApiKeyLength": 45
   }
   ```

2. **Test agent creation:**
   - Go to your Avallon frontend
   - Navigate to Agents section
   - Click "Create Agent"
   - Fill in name and prompt
   - Click "Create"
   - Check n8n workflows to verify it was created

## Troubleshooting

### Can't Access n8n UI

**Check HTTPS:**
```bash
curl -I https://agents.avallon.ca
```

**Check Caddy:**
```bash
ssh root@159.89.113.242
systemctl status caddy
journalctl -u caddy -n 50
```

**Check n8n Container:**
```bash
ssh root@159.89.113.242
cd /opt/avallon-n8n
docker compose ps
docker compose logs n8n
```

### API Key Not Working

1. **Verify API key format:**
   - Should start with `n8n_api_`
   - Should be around 40-50 characters long

2. **Check API key in n8n:**
   - Go to Settings → API
   - Verify the key exists and is active
   - Try creating a new key if needed

3. **Test API key directly:**
   ```bash
   curl -H "X-N8N-API-KEY: your_api_key_here" \
        https://agents.avallon.ca/api/v1/workflows
   ```
   
   Should return a list of workflows (or empty array if none exist)

### Backend Can't Connect to n8n

1. **Check environment variables:**
   ```bash
   cd backend
   cat .env | grep N8N
   ```

2. **Verify n8n is accessible from backend:**
   ```bash
   curl https://agents.avallon.ca/api/health
   ```

3. **Check backend logs:**
   - Look for connection errors
   - Check for authentication errors (401)

### Workflow Not Created

1. **Check backend logs** for errors
2. **Verify API key permissions** in n8n
3. **Check n8n logs:**
   ```bash
   ssh root@159.89.113.242
   cd /opt/avallon-n8n
   docker compose logs n8n | tail -50
   ```

## Security Notes

- ⚠️ **Never commit API keys to git**
- ✅ Keep `.env` file in `.gitignore`
- ✅ Use environment variables in production (Vercel)
- ✅ Rotate API keys periodically
- ✅ Use different keys for dev/staging/production

## Next Steps

After setting up the API key:

1. ✅ Test agent creation
2. ✅ Verify workflows appear in n8n
3. ✅ Test activating workflows
4. ✅ Test webhook endpoints

## Additional Resources

- [n8n API Documentation](https://docs.n8n.io/api/)
- [n8n API Key Guide](https://docs.n8n.io/api/authentication/)
- [Avallon n8n Integration Guide](./N8N_INTEGRATION_SETUP.md)
















