// Script to set credits for a specific user
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setUserCredits() {
  try {
    const userEmail = process.argv[2] || 'alij123402@gmail.com';
    const credits = parseInt(process.argv[3] || '20');
    
    console.log(`🔄 Setting credits for user: ${userEmail} to ${credits}...`);
    
    // Use raw SQL to avoid Prisma schema issues
    // First check if user exists - use Prisma.$queryRaw with template literal
    const existingUsers = await prisma.$queryRaw<Array<{id: string, email: string, credits: number}>>`
      SELECT id, email, credits FROM "User" WHERE email = ${userEmail} LIMIT 1
    `;
    
    if (existingUsers.length === 0) {
      console.log(`❌ User not found. Creating user with email: ${userEmail}`);
      // Create user using raw SQL with template literal
      await prisma.$executeRaw`
        INSERT INTO "User" (id, email, credits, "createdAt", "updatedAt") 
        VALUES (gen_random_uuid()::text, ${userEmail}, ${credits}, NOW(), NOW())
      `;
      console.log(`✅ Created user with ${credits} credits`);
    } else {
      // Update existing user using raw SQL with template literal
      await prisma.$executeRaw`
        UPDATE "User" SET credits = ${credits}, "updatedAt" = NOW() WHERE email = ${userEmail}
      `;
      console.log(`✅ Updated user credits to ${credits}`);
    }
    
    // Verify the update
    const updatedUsers = await prisma.$queryRaw<Array<{id: string, email: string, credits: number}>>`
      SELECT id, email, credits FROM "User" WHERE email = ${userEmail}
    `;
    
    if (updatedUsers.length > 0) {
      console.log(`\n✅ User credits updated:`, {
        email: updatedUsers[0].email,
        credits: updatedUsers[0].credits,
      });
    }
    
    // Show all users for verification
    const allUsers = await prisma.$queryRaw<Array<{id: string, email: string, credits: number}>>`
      SELECT id, email, credits FROM "User" ORDER BY "createdAt" DESC
    `;
    
    console.log('\n📊 All users in database:');
    allUsers.forEach(u => {
      console.log(`  - ${u.email}: ${u.credits} credits`);
    });
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error setting credits:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setUserCredits();




