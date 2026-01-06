-- CHANGELOG: 2025-01-27 - Change default free credits from 15 to 5
-- This migration updates the default value for the credits column
ALTER TABLE "User" ALTER COLUMN "credits" SET DEFAULT 5;







