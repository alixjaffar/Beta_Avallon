# Avallon Cloud - Tech Stack & Setup Guide

## 🛠️ Tech Stack Overview

### **Backend** (Port 3000)
- **Framework**: Next.js 15 (React 18)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **API**: REST API with Next.js API routes
- **AI**: Claude (Anthropic API) for site generation
- **Integrations**:
  - GitHub (repository creation)
  - Vercel (deployment)
  - Namecheap (domain management & email)
  - Stripe (billing/subscriptions)
  - n8n (automation workflows)
  - Gmail (email notifications)
- **Testing**: Vitest + Playwright

### **Frontend** (Port 5173 - Vite default)
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: Radix UI + shadcn/ui components
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Theming**: next-themes (dark/light mode)
- **Notifications**: Sonner + Radix Toast
- **Form Handling**: React Hook Form + Zod validation
- **Animations**: Framer Motion

### **Database**
- **PostgreSQL** (via Prisma)
- Models: User, Site, Agent, Domain, EmailAccount, Subscription, BetaSignup

---

## 📋 Required Environment Variables

### **Backend Environment Variables** (`.env` in `/backend` directory)

Create a file called `.env` in the `/backend` folder with the following variables:

```bash
# ============================================
# DATABASE
# ============================================
DATABASE_URL="postgresql://username:password@localhost:5432/avallon"

# ============================================
# AUTHENTICATION (Clerk)
# ============================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# ============================================
# AI GENERATION (Claude/Anthropic)
# ============================================
ANTHROPIC_API_KEY="sk-ant-api03-..."
# OR use these alternative variable names:
CLAUDE_API_KEY="sk-ant-api03-..."
CLAUDE_BASE_URL="https://api.anthropic.com/v1"

# ============================================
# GITHUB INTEGRATION
# ============================================
GITHUB_TOKEN="ghp_..."
GITHUB_ORG=""  # Optional: GitHub organization name

# ============================================
# VERCEL DEPLOYMENT
# ============================================
VERCEL_TOKEN="..."
# OR use:
VERCEL_API_TOKEN="..."
VERCEL_TEAM_ID=""  # Optional: Vercel team ID

# ============================================
# DOMAIN & EMAIL (Namecheap)
# ============================================
NAMECHEAP_API_USER="your_api_user"
NAMECHEAP_API_KEY="your_api_key"
NAMECHEAP_USERNAME="your_username"
NAMECHEAP_CLIENT_IP="127.0.0.1"  # Your server's IP address
NAMECHEAP_SANDBOX="true"  # Set to "false" for production

# ============================================
# AUTOMATION (n8n)
# ============================================
N8N_BASE_URL="http://localhost:5678"
N8N_API_KEY="your_n8n_api_key"
N8N_WEBHOOK_URL="https://your-domain.com/webhook"

# ============================================
# PAYMENTS (Stripe)
# ============================================
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# ============================================
# EMAIL NOTIFICATIONS (Gmail)
# ============================================
EMAIL_USER="your-gmail@gmail.com"
EMAIL_APP_PASSWORD="your-gmail-app-password"
# Note: You need to create an App Password in Gmail settings

# ============================================
# OPTIONAL: Supabase (if using)
# ============================================
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# ============================================
# NODE ENVIRONMENT
# ============================================
NODE_ENV="development"
```

### **Frontend Environment Variables** (Optional - uses defaults if not set)

Create a `.env` file in the `/frontend` directory if you want to customize:

```bash
# Backend API URL (auto-detected based on NODE_ENV)
VITE_API_URL="http://localhost:3000/api"  # Development
# Or set to your production backend URL

# Supabase (optional, has mock defaults)
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"

# Lovable API (optional - if using Lovable instead of Claude)
LOVABLE_API_KEY="your-api-key-here"
```

---

## 🚀 Quick Setup Steps

### 1. **Database Setup**
```bash
# Install PostgreSQL locally or use a cloud service (Supabase, Railway, etc.)
# Update DATABASE_URL in backend/.env with your connection string

cd backend
npx prisma generate
npx prisma migrate dev
```

### 2. **Install Dependencies**
```bash
# Root directory
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. **Set Up Environment Variables**
```bash
# Copy the example file and fill in your values
cd backend
cp env.example .env
# Edit .env with your actual API keys and credentials
```

### 4. **Run Development Servers**

**Option A: Run both together (from root)**
```bash
npm run dev
```

**Option B: Run separately**
```bash
# Terminal 1 - Backend (port 3000)
cd backend
npm run dev

# Terminal 2 - Frontend (port 5173)
cd frontend
npm run dev
```

---

## 🔑 Getting API Keys & Credentials

### **Required (Minimum to Run)**
1. **PostgreSQL Database** - Use Supabase (free tier) or local PostgreSQL
2. **Clerk Auth** - Sign up at [clerk.com](https://clerk.com) (free tier available)
3. **Claude API** - Get from [console.anthropic.com](https://console.anthropic.com)

### **Optional (For Full Functionality)**
4. **GitHub Token** - Create at [github.com/settings/tokens](https://github.com/settings/tokens)
   - Needs `repo` scope for creating repositories
5. **Vercel Token** - Get from [vercel.com/account/tokens](https://vercel.com/account/tokens)
6. **Namecheap API** - Get from [namecheap.com/apimanager](https://www.namecheap.com/support/api/apimanager/)
   - Requires account with API access enabled
7. **Stripe** - Sign up at [stripe.com](https://stripe.com) (test keys available)
8. **Gmail App Password** - Generate in Gmail Account Settings → Security → 2-Step Verification → App Passwords
9. **n8n** - Self-hosted or cloud at [n8n.io](https://n8n.io)

---

## 📝 Minimum Configuration to Run

**To just get the app running (without all features):**

```bash
# backend/.env - Minimum required
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
CLAUDE_API_KEY="sk-ant-api03-..."
NODE_ENV="development"
```

Everything else will work in "mock" mode or gracefully fail if not configured.

---

## ⚠️ Important Notes

1. **Database**: Make sure PostgreSQL is running before starting the backend
2. **Ports**: Backend runs on `3000`, Frontend runs on `5173` (Vite default)
3. **CORS**: Frontend is configured to call `http://localhost:3000/api` in development
4. **Production**: Update `API_BASE_URL` in `frontend/src/lib/api.ts` for production deployment

---

## 🧪 Testing the Setup

1. Visit `http://localhost:5173` - Should see the frontend
2. Visit `http://localhost:3000/api/test/key-check` - Check if backend is configured
3. Check backend logs for any missing environment variables

---

## 📚 Additional Resources

- Backend API routes: `/backend/src/app/api/`
- Frontend pages: `/frontend/src/pages/`
- Prisma schema: `/backend/prisma/schema.prisma`

