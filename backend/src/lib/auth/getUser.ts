// CHANGELOG: 2024-12-19 - Add getUser helper for Clerk auth integration
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function getUser() {
  // Temporarily return a mock user for testing
  return {
    id: 'mock_user_id',
    clerkId: 'mock_clerk_id',
    email: 'test@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
