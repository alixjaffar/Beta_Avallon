# n8n Integration Setup Guide

This guide will help you integrate your Avallon backend with the n8n instance running at `https://agents.avallon.ca`.

## Step 1: Get n8n API Key

1. **Access n8n UI:**
   - Open `https://agents.avallon.ca` in your browser
   - Log in with your n8n credentials (if you haven't set up a user, you'll need to create one)

2. **Create API Key:**
   - Go to **Settings** → **API** (or navigate to `/settings/api`)
   - Click **"Create API Key"**
   - Give it a name (e.g., "Avallon Backend Integration")
   - Copy the API key (it will look like: `n8n_api_xxxxxxxxxxxxxxxxxxxxx`)
   - **Important:** Save this key securely - you won't be able to see it again!

## Step 2: Configure Backend Environment Variables

### If deploying on Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

   ```
   N8N_BASE_URL=https://agents.avallon.ca
   N8N_API_KEY=your_api_key_here
   N8N_WEBHOOK_URL=https://agents.avallon.ca/
   N8N_AUTO_ACTIVATE=true  # Set to "false" to require manual activation
   ```

4. **Important:** Make sure to set these for **Production**, **Preview**, and **Development** environments
5. Redeploy your application after adding the variables

### If running locally:

1. Create or edit `backend/.env` file:
   ```bash
   cd backend
   cp env.example .env
   ```

2. Edit `.env` and set:
   ```
   N8N_BASE_URL=https://agents.avallon.ca
   N8N_API_KEY=your_api_key_here
   N8N_WEBHOOK_URL=https://agents.avallon.ca/
   N8N_AUTO_ACTIVATE=true  # Set to "false" to require manual activation
   
   # Optional: Admin credentials for automatic user creation and invitations
   N8N_ADMIN_EMAIL=your-admin@example.com
   N8N_ADMIN_PASSWORD=your-admin-password
   N8N_SEND_INVITATIONS=true  # Enable automatic invitation emails
   ```
   
   **Or use the setup script:**
   ```bash
   cd backend
   ./setup-n8n-admin.sh
   ```

3. Restart your development server:
   ```bash
   pnpm dev
   ```

## Step 3: Test the Integration

### Test 1: Check Environment Variables

Create a test endpoint to verify the configuration:

```bash
# In your backend directory
curl http://localhost:3000/api/test/n8n-config
```

Or visit: `http://localhost:3000/api/test/n8n-config` in your browser

### Test 2: Create an Agent

1. Go to your Avallon frontend
2. Navigate to the Agents section
3. Click "Create Agent"
4. Fill in:
   - **Name:** Test Agent
   - **Prompt:** "You are a helpful assistant"
5. Click "Create"

**Expected Result:**
- Agent should be created successfully
- A workflow should appear in your n8n instance at `https://agents.avallon.ca`
- The agent should have an `n8nId` stored in your database

## Step 4: Verify Workflow Creation

1. Go to `https://agents.avallon.ca`
2. Navigate to **Workflows**
3. You should see a workflow with the name you gave your agent
4. The workflow should be **active** (automatically activated on creation)
5. Click on the workflow to see its structure:
   - Webhook node (receives requests)
   - OpenAI/AI Agent node (processes the prompt)
   - Respond to Webhook node (sends response)

## Troubleshooting

### Error: "Cannot connect to n8n"

**Check:**
- Is `N8N_BASE_URL` set correctly? (should be `https://agents.avallon.ca`)
- Can you access `https://agents.avallon.ca` in your browser?
- Is HTTPS working? (check Caddy SSL certificate)

### Error: "n8n API authentication failed (401 Unauthorized)"

**Check:**
- Is `N8N_API_KEY` set correctly?
- Did you copy the entire API key (no extra spaces or quotes)?
- Is the API key still valid? (check in n8n Settings → API)
- Try creating a new API key

### Error: "Agent created but no workflow in n8n"

**Check:**
- Check backend logs for errors
- Verify the API key has permission to create workflows
- Check n8n logs: `docker compose logs n8n` on the server

### Workflow Created But Not Active

By default, workflows are **automatically activated** when created. If you see an inactive workflow, check:
- Is `N8N_AUTO_ACTIVATE` set to `"false"` in your environment variables?
- Check backend logs for activation errors
- You can manually activate via the "Publish to n8n" button in the Avallon UI

To disable auto-activation, set `N8N_AUTO_ACTIVATE=false` in your environment variables.

## How It Works

1. **User creates agent** in Avallon frontend
2. **Frontend calls** `/api/n8n/agents` POST endpoint
3. **Backend creates agent** in database with `status: "active"` (or "inactive" if auto-activation is disabled)
4. **Backend calls n8n API** to create workflow:
   - Endpoint: `POST https://agents.avallon.ca/api/v1/workflows`
   - Headers: `X-N8N-API-KEY: <your_api_key>`
   - Body: Workflow definition with Webhook, AI Agent, and Response nodes
5. **Backend automatically activates workflow** (unless `N8N_AUTO_ACTIVATE=false`):
   - Endpoint: `PATCH https://agents.avallon.ca/api/v1/workflows/{workflowId}`
   - Body: `{ "active": true }`
6. **Backend updates agent** with `n8nId` (workflow ID) and `status: "active"`
7. **Agent is ready to use immediately** - no manual activation needed!

**Note:** If `N8N_AUTO_ACTIVATE=false`, workflows are created inactive and users can activate them later via the "Publish to n8n" button.

## Next Steps

- [ ] Get API key from n8n
- [ ] Set environment variables in Vercel (including `N8N_AUTO_ACTIVATE=true` if you want auto-activation)
- [ ] Test agent creation
- [ ] Verify workflow appears in n8n and is automatically activated
- [ ] Test agent functionality (should work immediately without manual activation)

## Auto-Activation Configuration

By default, workflows are **automatically activated** when agents are created. This means:
- ✅ Agents are ready to use immediately after creation
- ✅ No manual "Publish to n8n" step required
- ✅ Better user experience

To disable auto-activation (require manual approval):
- Set `N8N_AUTO_ACTIVATE=false` in your environment variables
- Workflows will be created as inactive
- Users can activate them via the "Publish to n8n" button in the UI

