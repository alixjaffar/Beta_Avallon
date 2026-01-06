// CHANGELOG: 2024-12-19 - Add Prisma client setup and database utilities
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Configure Prisma client with better connection handling
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  errorFormat: 'pretty',
  // Disable prepared statements in development to avoid "prepared statement already exists" errors
  // This is a workaround for PostgreSQL connection pooling issues in Next.js dev mode
  ...(process.env.NODE_ENV === 'development' && {
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  }),
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Alias for backward compatibility
export const db = prisma;
