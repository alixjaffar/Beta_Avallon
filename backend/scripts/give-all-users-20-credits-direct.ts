// Script to add credits column and give all users 20 credits
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function giveAllUsers20Credits() {
  try {
    console.log('🔄 Adding credits column and setting all users to 20 credits...');
    
    // Execute SQL statements separately
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "credits" INTEGER NOT NULL DEFAULT 20;`);
    console.log('✅ Credits column added');
    
    await prisma.$executeRawUnsafe(`UPDATE "User" SET "credits" = 20 WHERE "credits" IS NULL OR "credits" < 20;`);
    console.log('✅ All users updated to 20 credits');
    
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ALTER COLUMN "credits" SET DEFAULT 20;`);
    console.log('✅ Default set to 20 for new users');
    
    console.log('✅ Credits column added and all users updated to 20 credits');
    
    // Verify
    const users = await prisma.$queryRaw<Array<{email: string, credits: number}>>`
      SELECT email, credits FROM "User" LIMIT 10
    `;
    
    console.log('\n📊 Sample user credits:');
    users.forEach(user => {
      console.log(`  - ${user.email}: ${user.credits} credits`);
    });
    
    const totalUsers = await prisma.$queryRaw<Array<{count: bigint}>>`
      SELECT COUNT(*) as count FROM "User"
    `;
    
    console.log(`\n✅ Total users updated: ${totalUsers[0].count}`);
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error updating credits:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

giveAllUsers20Credits();

