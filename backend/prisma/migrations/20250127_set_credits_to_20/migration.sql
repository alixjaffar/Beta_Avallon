-- Set all users to 20 credits and update default
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "credits" INTEGER NOT NULL DEFAULT 20;
UPDATE "User" SET "credits" = 20 WHERE "credits" IS NULL OR "credits" < 20;
ALTER TABLE "User" ALTER COLUMN "credits" SET DEFAULT 20;







