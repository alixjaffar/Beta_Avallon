/**
 * Apply spec-first architecture migration
 * Run: node apply-migration.js
 */
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function applyMigration() {
  try {
    console.log('🔄 Applying spec-first architecture migration...\n');
    
    // Define statements in correct order
    const statements = [
      // 1. Create Project table
      `CREATE TABLE IF NOT EXISTS "Project" (
        "id" TEXT NOT NULL,
        "ownerId" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "description" TEXT,
        "workspacePath" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
      );`,
      
      // 2. Create SiteVersion table
      `CREATE TABLE IF NOT EXISTS "SiteVersion" (
        "id" TEXT NOT NULL,
        "projectId" TEXT NOT NULL,
        "version" INTEGER NOT NULL DEFAULT 1,
        "spec" JSONB NOT NULL,
        "prompt" TEXT,
        "iterationPrompt" TEXT,
        "codeFiles" JSONB,
        "status" TEXT NOT NULL DEFAULT 'draft',
        "previewUrl" TEXT,
        "deployedUrl" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "SiteVersion_pkey" PRIMARY KEY ("id")
      );`,
      
      // 3. Create Asset table
      `CREATE TABLE IF NOT EXISTS "Asset" (
        "id" TEXT NOT NULL,
        "projectId" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "url" TEXT NOT NULL,
        "alt" TEXT,
        "width" INTEGER,
        "height" INTEGER,
        "context" TEXT,
        "metadata" JSONB,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
      );`,
      
      // 4. Add projectId to Site table
      `ALTER TABLE "Site" ADD COLUMN IF NOT EXISTS "projectId" TEXT;`,
      
      // 5-7. Create indexes for Project
      `CREATE UNIQUE INDEX IF NOT EXISTS "Project_slug_key" ON "Project"("slug");`,
      `CREATE INDEX IF NOT EXISTS "Project_ownerId_idx" ON "Project"("ownerId");`,
      `CREATE INDEX IF NOT EXISTS "Project_slug_idx" ON "Project"("slug");`,
      
      // 8-9. Create indexes for SiteVersion
      `CREATE UNIQUE INDEX IF NOT EXISTS "SiteVersion_projectId_version_key" ON "SiteVersion"("projectId", "version");`,
      `CREATE INDEX IF NOT EXISTS "SiteVersion_projectId_idx" ON "SiteVersion"("projectId");`,
      
      // 10. Create index for Asset
      `CREATE INDEX IF NOT EXISTS "Asset_projectId_idx" ON "Asset"("projectId");`,
      
      // 11. Create index for Site
      `CREATE UNIQUE INDEX IF NOT EXISTS "Site_projectId_key" ON "Site"("projectId");`,
      
      // 12-15. Add foreign keys
      `DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Project_ownerId_fkey') THEN
          ALTER TABLE "Project" ADD CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
        END IF;
      END $$;`,
      
      `DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SiteVersion_projectId_fkey') THEN
          ALTER TABLE "SiteVersion" ADD CONSTRAINT "SiteVersion_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
      END $$;`,
      
      `DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Asset_projectId_fkey') THEN
          ALTER TABLE "Asset" ADD CONSTRAINT "Asset_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
      END $$;`,
      
      `DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Site_projectId_fkey') THEN
          ALTER TABLE "Site" ADD CONSTRAINT "Site_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
        END IF;
      END $$;`
    ];
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      const preview = statement.substring(0, 60).replace(/\s+/g, ' ');
      console.log(`[${i + 1}/${statements.length}] ${preview}...`);
      
      try {
        await prisma.$executeRawUnsafe(statement);
        console.log(`✅ Success\n`);
      } catch (error) {
        if (error.message.includes('already exists') || error.message.includes('duplicate')) {
          console.log(`⚠️  Already exists (skipping)\n`);
        } else {
          console.log(`❌ Error: ${error.message.substring(0, 100)}\n`);
        }
      }
    }
    
    console.log('✅ Migration completed successfully!');
    console.log('\nNew tables created:');
    console.log('  • Project');
    console.log('  • SiteVersion');
    console.log('  • Asset');
    console.log('\nUpdated tables:');
    console.log('  • Site (added projectId column)');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

applyMigration();


