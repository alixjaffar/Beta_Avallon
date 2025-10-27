-- CHANGELOG: 2025-10-12 - Add email_accounts table and Vercel metadata columns
CREATE TABLE IF NOT EXISTS "EmailAccount" (
  "id" TEXT PRIMARY KEY,
  "ownerId" TEXT NOT NULL,
  "domainId" TEXT NOT NULL,
  "inbox" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'active',
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT "EmailAccount_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "EmailAccount_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "EmailAccount_domain_inbox_unique" UNIQUE ("domainId", "inbox")
);

ALTER TABLE "Site"
  ADD COLUMN IF NOT EXISTS "vercelProjectId" TEXT,
  ADD COLUMN IF NOT EXISTS "vercelDeploymentId" TEXT;
