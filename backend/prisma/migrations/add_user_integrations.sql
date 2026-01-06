-- Add UserIntegration table for storing user's external app integrations
-- This stores encrypted API keys for services like Stripe, Twilio, etc.

CREATE TABLE IF NOT EXISTS "UserIntegration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "credentials" JSONB NOT NULL,
    "metadata" JSONB,
    "connectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Unique constraint: one integration per provider per user
CREATE UNIQUE INDEX IF NOT EXISTS "UserIntegration_userId_provider_key" ON "UserIntegration"("userId", "provider");

-- Index for looking up user's integrations
CREATE INDEX IF NOT EXISTS "UserIntegration_userId_idx" ON "UserIntegration"("userId");

-- Index for looking up by provider
CREATE INDEX IF NOT EXISTS "UserIntegration_provider_idx" ON "UserIntegration"("provider");

