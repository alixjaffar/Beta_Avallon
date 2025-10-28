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
      // Serve frontend for all non-API routes
      {
        source: '/((?!api|admin|_next).*)',
        destination: '/api/frontend',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};
export default nextConfig;
