/**
 * Admin endpoint for managing user credits
 * SECURITY: Only accessible by authorized admin emails
 */
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";
import { prisma } from "@/lib/db";
import { setCredits, addCredits, getUserCredits, PLAN_CREDITS } from "@/lib/billing/credits";
import { logInfo, logError } from "@/lib/log";
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const USER_CREDITS_FILE = join(process.cwd(), 'user-credits.json');

// SECURITY: Only these emails can access admin endpoints
const ADMIN_EMAILS = [
  'alij123402@gmail.com',
];

function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

// Helper: generate the same pseudo userId that getUser() uses when only email is known
function getUserIdFromEmail(email: string): string {
  return `user_${Buffer.from(email).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 16)}`;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    
    if (!isAdmin(user?.email)) {
      logError('Unauthorized admin access attempt', null, { 
        email: user?.email,
        endpoint: '/api/admin/credits'
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get query params
    const { searchParams } = new URL(req.url);
    const targetEmail = searchParams.get('email');

    if (targetEmail) {
      // Try database first
      const targetUser = await prisma.user.findUnique({
        where: { email: targetEmail },
        select: { id: true, email: true, credits: true, createdAt: true },
      });

      // Always check file-based storage (source of truth for credits)
      const fallbackUserId = getUserIdFromEmail(targetEmail);
      const fileCredits = await getUserCredits(targetUser?.id || fallbackUserId, targetEmail);

      // If user doesn't exist in DB, still return file-based credits
      if (!targetUser) {
        return NextResponse.json({
          user: {
            id: fallbackUserId,
            email: targetEmail,
            credits: fileCredits,
            createdAt: null,
          },
          fileCredits,
          note: "User not found in database; using file-based credits only",
        });
      }

      return NextResponse.json({
        user: targetUser,
        fileCredits,
        note: fileCredits !== targetUser.credits ? "Database and file credits differ" : "In sync",
      });
    }

    // List all users with credits
    const users = await prisma.user.findMany({
      select: { id: true, email: true, credits: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const totalUsers = await prisma.user.count();

    return NextResponse.json({
      users,
      totalUsers,
      showing: users.length,
    });
  } catch (error: any) {
    logError('Admin credits GET failed', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    
    if (!isAdmin(user?.email)) {
      logError('Unauthorized admin access attempt', null, { 
        email: user?.email,
        endpoint: '/api/admin/credits POST'
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { email, action, amount } = body;

    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    if (!action || !['set', 'add', 'subtract'].includes(action)) {
      return NextResponse.json({ 
        error: "action is required and must be 'set', 'add', or 'subtract'" 
      }, { status: 400 });
    }

    if (typeof amount !== 'number' || amount < 0) {
      return NextResponse.json({ error: "amount must be a positive number" }, { status: 400 });
    }

    // Find target user in database (optional)
    const targetUser = await prisma.user.findUnique({
      where: { email },
    });

    // Determine previous credits from DB or file-based storage
    const fallbackUserId = getUserIdFromEmail(email);
    const previousCredits = targetUser
      ? (targetUser.credits ?? (await getUserCredits(targetUser.id, email)))
      : await getUserCredits(fallbackUserId, email);

    let newCredits: number;

    switch (action) {
      case 'set':
        newCredits = amount;
        break;
      case 'add':
        newCredits = previousCredits + amount;
        break;
      case 'subtract':
        newCredits = Math.max(0, previousCredits - amount);
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Update database if user exists there
    if (targetUser) {
      await prisma.user.update({
        where: { email },
        data: { credits: newCredits },
      });
    }

    // Update file-based storage (always source of truth for billing endpoints)
    const effectiveUserId = targetUser?.id || fallbackUserId;
    await setCredits(effectiveUserId, newCredits, `Admin ${action} by ${user.email}`, email);

    logInfo('Admin credits update', {
      adminEmail: user.email,
      targetEmail: email,
      action,
      amount,
      previousCredits,
      newCredits,
      hasDbUser: !!targetUser,
    });

    return NextResponse.json({
      success: true,
      user: {
        email,
        previousCredits,
        newCredits,
        action,
        amount,
      },
      updatedBy: user.email,
      hasDbUser: !!targetUser,
    });
  } catch (error: any) {
    logError('Admin credits POST failed', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * PUT - Bulk update all users (give everyone X credits)
 */
export async function PUT(req: NextRequest) {
  try {
    const user = await getUser();
    
    if (!isAdmin(user?.email)) {
      logError('Unauthorized admin access attempt', null, { 
        email: user?.email,
        endpoint: '/api/admin/credits PUT'
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { action, amount } = body;

    if (!action || !['set', 'add', 'ensure_minimum'].includes(action)) {
      return NextResponse.json({ 
        error: "action is required and must be 'set', 'add', or 'ensure_minimum'" 
      }, { status: 400 });
    }

    if (typeof amount !== 'number' || amount < 0) {
      return NextResponse.json({ error: "amount must be a positive number" }, { status: 400 });
    }

    let result;
    const defaultCredits = amount || PLAN_CREDITS.free;

    switch (action) {
      case 'set':
        // Set all users to exact amount
        result = await prisma.$executeRawUnsafe(
          `UPDATE "User" SET "credits" = ${defaultCredits}`
        );
        break;
      case 'add':
        // Add amount to all users
        result = await prisma.$executeRawUnsafe(
          `UPDATE "User" SET "credits" = "credits" + ${amount}`
        );
        break;
      case 'ensure_minimum':
        // Only update users below the minimum
        result = await prisma.$executeRawUnsafe(
          `UPDATE "User" SET "credits" = ${defaultCredits} WHERE "credits" IS NULL OR "credits" < ${defaultCredits}`
        );
        break;
    }

    // Also update file-based storage
    let fileUpdatedCount = 0;
    try {
      if (existsSync(USER_CREDITS_FILE)) {
        const data = readFileSync(USER_CREDITS_FILE, 'utf-8');
        const userCredits = JSON.parse(data);
        
        for (const key of Object.keys(userCredits)) {
          const currentCredits = userCredits[key].credits ?? 0;
          let newCredits = currentCredits;
          
          switch (action) {
            case 'set':
              newCredits = defaultCredits;
              break;
            case 'add':
              newCredits = currentCredits + amount;
              break;
            case 'ensure_minimum':
              if (currentCredits < defaultCredits) {
                newCredits = defaultCredits;
              }
              break;
          }
          
          if (newCredits !== currentCredits) {
            userCredits[key].credits = newCredits;
            userCredits[key].lastUpdated = new Date().toISOString();
            fileUpdatedCount++;
          }
        }
        
        writeFileSync(USER_CREDITS_FILE, JSON.stringify(userCredits, null, 2));
      }
    } catch (fileError: any) {
      logError('Error updating file-based storage', fileError);
    }

    const totalUsers = await prisma.user.count();

    logInfo('Admin bulk credits update', {
      adminEmail: user.email,
      action,
      amount: defaultCredits,
      totalUsers,
      fileUpdatedCount,
    });

    return NextResponse.json({
      success: true,
      action,
      amount: defaultCredits,
      totalUsers,
      fileUpdatedCount,
      updatedBy: user.email,
    });
  } catch (error: any) {
    logError('Admin credits PUT failed', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
