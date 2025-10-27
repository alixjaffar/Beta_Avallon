// Temporarily disable Clerk middleware for testing
// import { clerkMiddleware } from "@clerk/nextjs/server";

// export default clerkMiddleware();

export default function middleware() {
  // No authentication required for now
}

export const config = { matcher: [] };
