import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    console.log('🔄 Adding credits column and setting all users to 20 credits...');
    
    // Execute SQL statements separately with delays to avoid prepared statement conflicts
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "credits" INTEGER NOT NULL DEFAULT 20;`);
      console.log('✅ Credits column added');
    } catch (e: any) {
      if (!e.message?.includes('already exists')) {
        throw e;
      }
      console.log('✅ Credits column already exists');
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const updateResult = await prisma.$executeRawUnsafe(`UPDATE "User" SET "credits" = 20 WHERE "credits" IS NULL OR "credits" < 20;`);
    console.log('✅ All users updated to 20 credits');
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ALTER COLUMN "credits" SET DEFAULT 20;`);
    console.log('✅ Default set to 20 for new users');
    
    // Verify
    const users = await prisma.$queryRaw<Array<{email: string, credits: number}>>`
      SELECT email, credits FROM "User" LIMIT 10
    `;
    
    const totalUsers = await prisma.$queryRaw<Array<{count: bigint}>>`
      SELECT COUNT(*) as count FROM "User"
    `;
    
    return NextResponse.json({
      success: true,
      message: `Updated all users to have 20 credits`,
      totalUsers: Number(totalUsers[0].count),
      sampleUsers: users,
    });
  } catch (error: any) {
    console.error('❌ Error updating credits:', error);
    return NextResponse.json(
      { error: error.message || "Failed to update credits" },
      { status: 500 }
    );
  }
}







