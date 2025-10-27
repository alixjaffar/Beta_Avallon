// CHANGELOG: 2025-10-12 - Document billing upgrades and provider status alerts
# Avallon Cloud (Beta)
All-in-one platform: build websites (Lovable), create AI agents (n8n), provision hosting (Vercel), buy domains (Namecheap), and set up email (Zoho Mail) — in one dashboard with Stripe billing.

## Features ✅

### Core Platform
- ✅ **Authentication** - Clerk integration with automatic user provisioning
- ✅ **Database** - Prisma + PostgreSQL with full persistence
- ✅ **Testing** - Vitest with 10/10 tests passing
- ✅ **Logging** - Structured error-first logging throughout

### Provider Integrations (Swappable)
- ✅ **Sites** - Lovable API integration (mocked when not configured)
- ✅ **Agents** - n8n workflow creation with AI agent nodes + embed codes
- ✅ **Hosting** - Vercel project creation, deployment, domain attachment
- ✅ **Domains** - Namecheap purchase + DNS management (A/CNAME/TXT records)
- ✅ **Email** - Zoho Mail provisioning, domain verification, mailbox creation
- ✅ **Payments** - Stripe subscriptions with webhook handling

### Billing & Limits
- ✅ **Free Plan** - 1 site, 1 agent, no domains
- ✅ **Pro Plan** - 3 sites, 3 agents, 1 domain, 5 email accounts
- ✅ **Business Plan** - 25 sites, 25 agents, 5 domains, 50 email accounts
- ✅ **Usage Enforcement** - Server-side limit checks on all resources

### Studio Dashboards
- ✅ **Sites** - Create, list, view status, preview links
- ✅ **Agents** - Create n8n workflows, copy embed codes
- ✅ **Domains** - Purchase, verify DNS, set default records, connect to sites
- ✅ **Billing** - View usage and launch Stripe checkout for plan upgrades
- ✅ **Optimistic UI** - Loading states, error toasts, real-time updates

## Quickstart

### 1. Clone & Install
```bash
git clone <repo>
cd avallon-cloud
pnpm install
cp .env.example .env
```

### 2. Database Setup
```bash
# Create Postgres database (Neon, Railway, or local)
# Add DATABASE_URL to .env

npx prisma migrate dev --name init
npx prisma generate
```

### 3. Configure Providers

See `.env.example` for all required variables. At minimum, configure:

**Required:**
- `CLERK_SECRET_KEY` & `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `DATABASE_URL`

**Optional (gracefully mocks when not configured):**
- Namecheap: `NAMECHEAP_API_USER`, `NAMECHEAP_API_KEY`, etc.
- Zoho Mail: `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_REFRESH_TOKEN`
- Vercel: `VERCEL_TOKEN`
- n8n: `N8N_BASE_URL`, `N8N_API_KEY`
- Lovable: `LOVABLE_BASE_URL`, `LOVABLE_API_KEY`
- Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

### 4. Run Development Server
```bash
pnpm dev
```

Open `http://localhost:3000` and sign in with Clerk.

## Testing
- Run unit tests:
  ```bash
  pnpm test
  ```
- Run e2e smoke tests (requires dev server + auth env):
  ```bash
  pnpm test:e2e
  ```
- Example tests live under `src/__tests__`:
  - `slug.test.ts` covers `slugify` utility
  - `api.test.ts` covers basic API route success paths
  - `validation.test.ts` demonstrates Zod parse success/failure

## Architecture

### Folder Structure
```
src/
├── app/
│   ├── api/                    # Next.js API routes
│   │   ├── lovable/generate/   # Site creation
│   │   ├── n8n/agents/         # Agent workflows
│   │   ├── domains/            # Domain management
│   │   ├── email/              # Email provisioning
│   │   └── webhooks/stripe/    # Stripe webhooks
│   └── studio/                 # Dashboard pages
├── lib/
│   ├── providers/              # Provider interfaces & DI
│   │   └── impl/               # Real implementations
│   ├── billing/                # Usage limits & plans
│   ├── clients/                # Legacy axios clients
│   └── auth/                   # Clerk helpers
├── data/                       # Data access layer (Prisma)
└── __tests__/                  # Vitest unit tests
```

### Provider Pattern
All external services use a clean interface pattern with automatic fallback:
- Real implementation when ENV variables configured
- Graceful mocking when not configured (great for dev/testing)
- Easy to swap providers (e.g., Namecheap → Cloudflare)

Example: `getRegistrarProvider()` returns `NamecheapProvider` if keys exist, else `DefaultRegistrar` with mocked responses.

## Deployment

### Vercel (Recommended)
```bash
vercel --prod
```
Set environment variables in Vercel dashboard.

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
RUN npm run build
CMD ["npm", "start"]
```

### Environment Setup Checklist
- [ ] PostgreSQL database created
- [ ] Clerk app configured
- [ ] Stripe products created (Free/Pro/Business)
- [ ] Namecheap API access enabled (if using)
- [ ] Zoho OAuth tokens generated (if using)
- [ ] Vercel token created (if using)
- [ ] n8n instance deployed (if using)
- [ ] Stripe webhook endpoint configured

## Operations

- Review the [Operations Runbook](docs/operations.md) for provider setup, cron scheduling, and incident response workflows.

## Roadmap (Next)

### v1.1 - Reliability
- [ ] Background jobs with Inngest/BullMQ
- [ ] Rate limiting with Upstash Redis
- [ ] Deployment polling (Vercel status checks)
- [ ] DNS verification retry logic
- [ ] Enhanced error recovery

### v1.2 - Multi-tenant
- [ ] Organizations/workspaces model
- [ ] Team collaboration features
- [ ] Invite & role management
- [ ] Per-org usage tracking

### v1.3 - Agency Features
- [ ] White-label domains
- [ ] Client project handoff
- [ ] Bulk operations
- [ ] Custom branding

## Contributing
Contributions welcome! Follow these rules:
- Keep changes small and focused
- Add tests for new features
- Update CHANGELOG comments in edited files
- Maintain TypeScript strict mode
- Use Zod for all input validation
- 2025-10-12: Added Prisma migration `20251012_add_email_accounts_and_vercel_fields` for email inbox persistence and Vercel metadata columns. Run `npx prisma migrate deploy`.
