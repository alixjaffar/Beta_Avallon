import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { PLAN_CREDITS, setCredits } from "@/lib/billing/credits";
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DEFAULT_CREDITS = PLAN_CREDITS.free; // 30 credits for free plan
const USER_CREDITS_FILE = join(process.cwd(), 'user-credits.json');

export async function POST(req: NextRequest) {
  try {
    console.log(`🔄 Setting all users to ${DEFAULT_CREDITS} credits...`);
    
    // 1. Update database
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "credits" INTEGER NOT NULL DEFAULT ${DEFAULT_CREDITS};`);
      console.log('✅ Credits column added');
    } catch (e: any) {
      if (!e.message?.includes('already exists')) {
        throw e;
      }
      console.log('✅ Credits column already exists');
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Update all users who have fewer credits than the default
    await prisma.$executeRawUnsafe(`UPDATE "User" SET "credits" = ${DEFAULT_CREDITS} WHERE "credits" IS NULL OR "credits" < ${DEFAULT_CREDITS};`);
    console.log(`✅ Database: All users updated to ${DEFAULT_CREDITS} credits`);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ALTER COLUMN "credits" SET DEFAULT ${DEFAULT_CREDITS};`);
    console.log(`✅ Database: Default set to ${DEFAULT_CREDITS} for new users`);
    
    // 2. Update file-based credits storage
    let fileUpdatedCount = 0;
    try {
      if (existsSync(USER_CREDITS_FILE)) {
        const data = readFileSync(USER_CREDITS_FILE, 'utf-8');
        const userCredits = JSON.parse(data);
        
        // Update all users who have fewer credits than default
        for (const key of Object.keys(userCredits)) {
          if (userCredits[key].credits < DEFAULT_CREDITS) {
            userCredits[key].credits = DEFAULT_CREDITS;
            userCredits[key].lastUpdated = new Date().toISOString();
            fileUpdatedCount++;
          }
        }
        
        writeFileSync(USER_CREDITS_FILE, JSON.stringify(userCredits, null, 2));
        console.log(`✅ File storage: Updated ${fileUpdatedCount} users to ${DEFAULT_CREDITS} credits`);
      } else {
        console.log('ℹ️ No file-based credits storage found (will be created on first use)');
      }
    } catch (fileError: any) {
      console.error('⚠️ Error updating file-based storage:', fileError.message);
    }
    
    // 3. Verify database
    const users = await prisma.$queryRaw<Array<{email: string, credits: number}>>`
      SELECT email, credits FROM "User" LIMIT 10
    `;
    
    const totalUsers = await prisma.$queryRaw<Array<{count: bigint}>>`
      SELECT COUNT(*) as count FROM "User"
    `;
    
    return NextResponse.json({
      success: true,
      message: `Updated all users to have ${DEFAULT_CREDITS} credits`,
      defaultCredits: DEFAULT_CREDITS,
      database: {
        totalUsers: Number(totalUsers[0].count),
        sampleUsers: users,
      },
      fileStorage: {
        usersUpdated: fileUpdatedCount,
      },
    });
  } catch (error: any) {
    console.error('❌ Error updating credits:', error);
    return NextResponse.json(
      { error: error.message || "Failed to update credits" },
      { status: 500 }
    );
  }
}







