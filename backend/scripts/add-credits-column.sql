-- Add credits column if it doesn't exist and set default to 20
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "credits" INTEGER NOT NULL DEFAULT 20;

-- Update all existing users to have 20 credits
UPDATE "User" SET "credits" = 20 WHERE "credits" IS NULL OR "credits" < 20;

-- Set default value to 20 for future users
ALTER TABLE "User" ALTER COLUMN "credits" SET DEFAULT 20;







