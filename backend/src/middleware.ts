// Temporarily disable Clerk middleware for testing
// import { clerkMiddleware } from "@clerk/nextjs/server";

// export default clerkMiddleware();

import { NextRequest, NextResponse } from "next/server";
import { getCorsHeaders } from "./lib/cors";

export default function middleware(request: NextRequest) {
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    const corsHeaders = getCorsHeaders(request);
    
    return new NextResponse(null, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Access-Control-Max-Age': '86400', // Cache preflight for 24 hours
      },
    });
  }

  // For other requests, add CORS headers to the response
  const response = NextResponse.next();
  const corsHeaders = getCorsHeaders(request);
  
  // Set CORS headers on the response
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

export const config = { 
  matcher: '/api/:path*' 
};
