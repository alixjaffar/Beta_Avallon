-- CHANGELOG: 2025-01-27 - Add credits field to User model for AI website generation
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "credits" INTEGER NOT NULL DEFAULT 0;










