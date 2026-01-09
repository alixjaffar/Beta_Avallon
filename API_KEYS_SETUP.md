# 🔑 API Keys & Setup Guide

## 📋 Quick Start - Minimum Required

To run the **Agent Builder** (website generation + n8n agent), you need:

### ✅ **REQUIRED** (Minimum to get started):

1. **Claude API Key** (Anthropic) - For website generation
2. **n8n Instance** - For agent creation (can be self-hosted or cloud)
3. **PostgreSQL Database** - For storing sites and agents
4. **Clerk Authentication** - For user authentication

---

## 🔑 API Keys Needed

### 1. **Gemini API Key (Google)** ⭐ REQUIRED (Primary)

**What it's for:** Website generation using AI (based on open-source AI Website Builder)

**How to get it:**
1. Go to https://ai.google.dev/
2. Sign up or log in with your Google account
3. Navigate to **Get API Key** or **API Keys** section
4. Click **Create API Key** in new project (or select existing project)
5. Copy the key

**Cost:** Free tier available, then pay-as-you-go (very affordable)

**Environment Variable:**
```bash
GEMINI_API_KEY="your_gemini_api_key_here"
```


---

### 1b. **Claude API Key (Anthropic)** ⭐ OPTIONAL (Fallback)

**What it's for:** Fallback website generation using Claude AI (if Gemini is not available)

**How to get it:**
1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to **API Keys** section
4. Click **Create Key**
5. Copy the key (starts with `sk-ant-api03-...`)

**Cost:** Pay-as-you-go, ~$0.008 per 1K tokens (very affordable)

**Environment Variable:**
```bash
CLAUDE_API_KEY="sk-ant-api03-..."
# OR
ANTHROPIC_API_KEY="sk-ant-api03-..."
```

---

### 2. **n8n API Key** ⭐ REQUIRED (for agent creation)

**What it's for:** Creating AI agents that help manage websites

**How to get it:**

**Option A: Self-hosted n8n (Free)**
1. Install n8n: `npm install n8n -g` or use Docker
2. Start n8n: `n8n start`
3. Access at `http://localhost:5678`
4. Go to **Settings** → **API**
5. Create an API key

**Option B: n8n Cloud (Paid)**
1. Sign up at https://n8n.io/
2. Create a workflow
3. Go to **Settings** → **API**
4. Generate API key

**Environment Variables:**
```bash
N8N_BASE_URL="http://localhost:5678"  # Your n8n instance URL
N8N_API_KEY="your_n8n_api_key"
N8N_USE_AI_AGENT_NODE="true"  # Optional: Use advanced AI Agent node
```

---

### 3. **PostgreSQL Database** ⭐ REQUIRED

**What it's for:** Storing websites, agents, and user data

**How to get it:**

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL
brew install postgresql  # macOS
# or
sudo apt-get install postgresql  # Linux

# Create database
createdb avallon
```

**Option B: Free Cloud Database**
- **Supabase** (Free tier): https://supabase.com/
- **Neon** (Free tier): https://neon.tech/
- **Railway** (Free tier): https://railway.app/

**Environment Variable:**
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/avallon"
# Or for cloud:
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
```

---

### 4. **Clerk Authentication** ⭐ REQUIRED

**What it's for:** User authentication and authorization

**How to get it:**
1. Go to https://clerk.com/
2. Sign up (free tier available)
3. Create a new application
4. Copy your keys from the dashboard

**Environment Variables:**
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

---

## 🎯 Optional API Keys (for full functionality)

### 5. **GitHub Token** (Optional - for repository creation)

**What it's for:** Automatically creating GitHub repos for generated websites

**How to get it:**
1. Go to https://github.com/settings/tokens
2. Click **Generate new token (classic)**
3. Select scopes: `repo`, `workflow`
4. Copy the token (starts with `ghp_...`)

**Environment Variable:**
```bash
GITHUB_TOKEN="ghp_..."
GITHUB_ORG=""  # Optional: Your GitHub org name
```

---

### 6. **Vercel Token** (Optional - for automatic deployment)

**What it's for:** Automatically deploying websites to Vercel

**How to get it:**
1. Go to https://vercel.com/account/tokens
2. Click **Create Token**
3. Copy the token

**Environment Variable:**
```bash
VERCEL_API_TOKEN="..."
VERCEL_TEAM_ID=""  # Optional: Your team ID
```

---

### 7. **Lovable API Key** (Optional - if available)

**What it's for:** Direct Lovable API integration (currently uses Claude as fallback)

**Note:** Lovable doesn't have a public API yet, so this is optional. The system uses Claude API with Lovable-style prompts instead.

**Environment Variable:**
```bash
LOVABLE_BASE_URL="https://api.lovable.dev"  # If/when available
LOVABLE_API_KEY="your-lovable-api-key"  # If/when available
```

---

## 📝 Complete `.env` File Template

Create a file at `backend/.env`:

```bash
# ============================================
# REQUIRED - Minimum Setup
# ============================================

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/avallon"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# AI Generation (Gemini) - REQUIRED for website generation (Primary)
# Get your API key from: https://ai.google.dev/
GEMINI_API_KEY="your_gemini_api_key_here"

# AI Generation (Claude) - OPTIONAL (Fallback)
CLAUDE_API_KEY="sk-ant-api03-..."
# OR
ANTHROPIC_API_KEY="sk-ant-api03-..."

# n8n - REQUIRED for agent creation
N8N_BASE_URL="http://localhost:5678"
N8N_API_KEY="your_n8n_api_key"
N8N_USE_AI_AGENT_NODE="true"  # Optional: Use AI Agent node

# ============================================
# OPTIONAL - For Full Functionality
# ============================================

# GitHub (for repository creation)
GITHUB_TOKEN="ghp_..."
GITHUB_ORG=""  # Optional

# Vercel (for automatic deployment)
VERCEL_API_TOKEN="..."
VERCEL_TEAM_ID=""  # Optional

# Lovable (if available)
LOVABLE_BASE_URL="https://api.lovable.dev"
LOVABLE_API_KEY="your-lovable-api-key"

# Stripe (for billing - if needed)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Namecheap (for domain management - if needed)
NAMECHEAP_API_USER="your_api_user"
NAMECHEAP_API_KEY="your_api_key"
NAMECHEAP_USERNAME="your_username"
NAMECHEAP_CLIENT_IP="127.0.0.1"
```

---

## 🚀 Quick Setup Steps

### Step 1: Install Dependencies

```bash
# Install all dependencies
npm run install:all
```

### Step 2: Set Up Database

```bash
cd backend

# Run migrations
npx prisma migrate dev

# Or if using existing database
npx prisma generate
```

### Step 3: Configure Environment Variables

1. Copy `backend/env.example` to `backend/.env`
2. Fill in the **REQUIRED** keys:
   - `GEMINI_API_KEY` (Primary - get from https://ai.google.dev/)
   - `CLAUDE_API_KEY` (Optional - fallback)
   - `N8N_BASE_URL` and `N8N_API_KEY`
   - `DATABASE_URL`
   - Clerk keys

### Step 4: Start n8n (if self-hosting)

```bash
# Install n8n globally
npm install -g n8n

# Start n8n
n8n start

# Or with Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  n8nio/n8n
```

### Step 5: Start the Application

```bash
# Start both backend and frontend
npm run dev

# Or separately:
npm run dev:backend   # Backend on http://localhost:3000
npm run dev:frontend  # Frontend on http://localhost:5173
```

### Step 6: Access the Agent Builder

Navigate to: **http://localhost:5173/agent-builder**

---

## 💰 Cost Estimates

### Free Tier Available:
- ✅ **Claude API**: Free tier available, then pay-as-you-go (~$0.008/1K tokens)
- ✅ **n8n**: Self-hosted is free, cloud has free tier
- ✅ **PostgreSQL**: Free tiers on Supabase, Neon, Railway
- ✅ **Clerk**: Free tier available
- ✅ **GitHub**: Free for public repos
- ✅ **Vercel**: Free tier available

### Estimated Monthly Cost (for moderate use):
- Claude API: $5-20/month (depending on usage)
- n8n Cloud: $0-20/month (or free if self-hosted)
- Database: $0 (free tier) or $5-10/month
- **Total: ~$5-50/month** for full functionality

---

## 🧪 Testing Without All Keys

You can test with **minimum setup**:

1. ✅ **Claude API Key** - Required for website generation
2. ✅ **n8n** - Required for agent creation (can use mock mode)
3. ✅ **Database** - Required for storing data
4. ✅ **Clerk** - Required for authentication

**Without GitHub/Vercel:** Websites will still generate, but won't auto-deploy to GitHub/Vercel. You'll get the generated code files.

**Without n8n:** Set `createAgent: false` in the API call to skip agent creation.

---

## 🔍 Verify Your Setup

### Check if Claude API is working:
```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: YOUR_CLAUDE_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-3-haiku-20240307","max_tokens":10,"messages":[{"role":"user","content":"Hello"}]}'
```

### Check if n8n is accessible:
```bash
curl http://localhost:5678/healthz
# Should return: {"status":"ok"}
```

### Check if database is connected:
```bash
cd backend
npx prisma db pull
```

---

## 🆘 Troubleshooting

### "Gemini API Key not found"
- Make sure `GEMINI_API_KEY` is set in `backend/.env`
- Get your API key from: https://ai.google.dev/
- Restart your backend server after adding the key

### "Claude API Key not found" (if using fallback)
- Make sure `CLAUDE_API_KEY` or `ANTHROPIC_API_KEY` is set in `backend/.env`
- Restart your backend server after adding the key

### "n8n connection failed"
- Make sure n8n is running: `n8n start`
- Check `N8N_BASE_URL` matches your n8n instance URL
- Verify `N8N_API_KEY` is correct in n8n settings

### "Database connection failed"
- Check `DATABASE_URL` format: `postgresql://user:pass@host:port/dbname`
- Make sure PostgreSQL is running
- Run migrations: `npx prisma migrate dev`

### "Clerk authentication not working"
- Verify Clerk keys are correct
- Make sure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` starts with `pk_`
- Check Clerk dashboard for correct application

---

## 📚 Additional Resources

- **Claude API Docs**: https://docs.anthropic.com/
- **n8n Setup Guide**: https://docs.n8n.io/hosting/installation/
- **Clerk Docs**: https://clerk.com/docs
- **Prisma Docs**: https://www.prisma.io/docs

---

## ✅ Checklist

Before running, make sure you have:

- [ ] Gemini API Key (`GEMINI_API_KEY`) - Primary
- [ ] Claude API Key (`CLAUDE_API_KEY` or `ANTHROPIC_API_KEY`) - Optional fallback
- [ ] n8n instance running (`N8N_BASE_URL` and `N8N_API_KEY`)
- [ ] PostgreSQL database (`DATABASE_URL`)
- [ ] Clerk authentication keys
- [ ] Created `backend/.env` file with all keys
- [ ] Run database migrations (`npx prisma migrate dev`)
- [ ] Started n8n (if self-hosting)
- [ ] Started backend and frontend servers

Once you have these, you're ready to generate websites! 🚀



