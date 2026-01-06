/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '.next',
  experimental: { serverActions: { bodySizeLimit: '2mb' } },
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/generated-websites/**'],
    };
    return config;
  },
  outputFileTracingRoot: process.cwd(),
  async rewrites() {
    return [
      // Serve frontend static files
      {
        source: '/static/:path*',
        destination: '/api/static/:path*',
      },
      // Serve backend admin routes
      {
        source: '/admin/emails',
        destination: '/admin/emails',
      },
      // Serve frontend for all other non-API routes
      {
        source: '/((?!api|_next).*)',
        destination: '/api/frontend',
      },
    ];
  },
  // CORS headers are now handled at the route level via getCorsHeaders()
  // to support credentials-based requests (cannot use wildcard '*' with credentials)
};
export default nextConfig;
