// Script to fix users with 0 credits - set them to 20
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixZeroCredits() {
  try {
    console.log('🔄 Fixing users with 0 or null credits...');
    
    // Update all users with 0, null, or credits < 20 to have 20 credits
    const result = await prisma.$executeRawUnsafe(`
      UPDATE "User" 
      SET credits = 20 
      WHERE credits IS NULL OR credits < 20
    `);
    
    console.log(`✅ Updated ${result} users to have 20 credits`);
    
    // Verify
    const users = await prisma.$queryRaw<Array<{email: string, credits: number}>>`
      SELECT email, credits FROM "User" WHERE credits < 20 OR credits IS NULL LIMIT 10
    `;
    
    if (users.length === 0) {
      console.log('✅ All users now have at least 20 credits!');
    } else {
      console.log(`⚠️  Found ${users.length} users still with low credits:`);
      users.forEach(user => {
        console.log(`  - ${user.email}: ${user.credits} credits`);
      });
    }
    
    // Show sample of all users
    const allUsers = await prisma.$queryRaw<Array<{email: string, credits: number}>>`
      SELECT email, credits FROM "User" ORDER BY "createdAt" DESC LIMIT 10
    `;
    
    console.log('\n📊 Sample user credits:');
    allUsers.forEach(user => {
      console.log(`  - ${user.email}: ${user.credits} credits`);
    });
    
    const totalUsers = await prisma.$queryRaw<Array<{count: bigint}>>`
      SELECT COUNT(*) as count FROM "User"
    `;
    
    console.log(`\n✅ Total users: ${totalUsers[0].count}`);
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error fixing credits:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

fixZeroCredits();




