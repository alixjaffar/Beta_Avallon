// Script to give all existing users 20 credits
import { prisma } from '../src/lib/db';

async function giveAllUsers20Credits() {
  try {
    console.log('🔄 Updating all users to have 20 credits...');
    
    const result = await prisma.user.updateMany({
      data: {
        credits: 20,
      },
    });

    console.log(`✅ Updated ${result.count} users to have 20 credits`);
    
    // Verify
    const users = await prisma.user.findMany({
      select: {
        email: true,
        credits: true,
      },
    });
    
    console.log('\n📊 Current user credits:');
    users.forEach(user => {
      console.log(`  - ${user.email}: ${user.credits} credits`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating credits:', error);
    process.exit(1);
  }
}

giveAllUsers20Credits();







