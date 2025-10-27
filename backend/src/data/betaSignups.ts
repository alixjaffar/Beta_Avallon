import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateBetaSignupInput {
  name: string;
  email: string;
  birthday: string;
  emailSubscription: boolean;
}

export interface BetaSignupStats {
  totalSignups: number;
  emailSubscribers: number;
  signupsToday: number;
  signupsThisWeek: number;
  signupsThisMonth: number;
}

export async function createBetaSignup(data: CreateBetaSignupInput) {
  try {
    const signup = await prisma.betaSignup.create({
      data: {
        name: data.name,
        email: data.email,
        birthday: data.birthday,
        emailSubscription: data.emailSubscription,
      },
    });
    return signup;
  } catch (error) {
    console.error('Error creating beta signup:', error);
    throw error;
  }
}

export async function getBetaSignupStats(): Promise<BetaSignupStats> {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalSignups,
      emailSubscribers,
      signupsToday,
      signupsThisWeek,
      signupsThisMonth,
    ] = await Promise.all([
      prisma.betaSignup.count(),
      prisma.betaSignup.count({ where: { emailSubscription: true } }),
      prisma.betaSignup.count({ where: { createdAt: { gte: today } } }),
      prisma.betaSignup.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.betaSignup.count({ where: { createdAt: { gte: monthAgo } } }),
    ]);

    return {
      totalSignups,
      emailSubscribers,
      signupsToday,
      signupsThisWeek,
      signupsThisMonth,
    };
  } catch (error) {
    console.error('Error getting beta signup stats:', error);
    throw error;
  }
}

export async function getAllBetaSignups() {
  try {
    const signups = await prisma.betaSignup.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return signups;
  } catch (error) {
    console.error('Error getting all beta signups:', error);
    throw error;
  }
}

export async function getEmailSubscribers() {
  try {
    const subscribers = await prisma.betaSignup.findMany({
      where: { emailSubscription: true },
      select: { email: true, name: true },
      orderBy: { createdAt: 'desc' },
    });
    return subscribers;
  } catch (error) {
    console.error('Error getting email subscribers:', error);
    throw error;
  }
}

export async function getBetaSignupByEmail(email: string) {
  try {
    const signup = await prisma.betaSignup.findUnique({
      where: { email },
    });
    return signup;
  } catch (error) {
    console.error('Error getting beta signup by email:', error);
    throw error;
  }
}
