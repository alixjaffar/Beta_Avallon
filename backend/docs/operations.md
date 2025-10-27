// CHANGELOG: 2025-10-12 - Add provider setup and incident runbook
# Operations Runbook

## Environment Checklist

- **Database**: Apply migrations via `npx prisma migrate deploy` (latest: `20251012_add_email_accounts_and_vercel_fields`).
- **Clerk**: Ensure `CLERK_SECRET_KEY` and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` set in dashboard.
- **Lovable**: Populate `LOVABLE_BASE_URL`, `LOVABLE_API_KEY` for site generation.
- **Vercel**: Supply `VERCEL_TOKEN` (and optional `VERCEL_TEAM_ID`) for deployment provisioning.
- **Namecheap**: Set `NAMECHEAP_API_USER`, `NAMECHEAP_API_KEY`, `NAMECHEAP_USERNAME`, `NAMECHEAP_CLIENT_IP`.
- **Zoho Mail**: Configure `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_REFRESH_TOKEN`, `ZOHO_DC`.
- **n8n**: Configure `N8N_BASE_URL`, `N8N_API_KEY`.
- **Stripe**: Provide secret key, webhook secret, and price IDs (`STRIPE_PRICE_*`).
- **Monitoring**: Optional `MONITORING_WEBHOOK_URL`, `SLACK_ALERT_WEBHOOK_URL`, `PAGERDUTY_ROUTING_KEY`.

## Deployment Steps

1. Install dependencies (`pnpm install`), run tests (`pnpm test`, `pnpm test:e2e`).
2. Apply database migrations.
3. Execute `ts-node scripts/backfill-vercel-metadata.ts` once on production to seed legacy sites.
4. Deploy application (Vercel recommended) and configure environment variables.
5. Register Stripe webhook to `/api/webhooks/stripe`.
6. Schedule cron (e.g., Vercel Cron) hitting `POST /api/jobs/poll-status` every 5 minutes.

## Incident Response

- **Deployment failures**: Check logs for `site.deployment.ready` events. Trigger manual redeploy via Vercel dashboard.
- **Domain verification stuck**: Ensure Namecheap DNS applied; poll job will mark active once both registrar/email verified.
- **Email provisioning issues**: Verify Zoho OAuth tokens and rerun `POST /api/email/verify` for diagnostics.
- **Billing discrepancies**: Inspect Stripe events in dashboard; replay webhook to `/api/webhooks/stripe` if needed.
- **Monitoring alerts**: Slack notifications or PagerDuty incidents include payload context; investigate underlying provider response.
