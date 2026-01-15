import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '.next',
  experimental: { 
    serverActions: { bodySizeLimit: '2mb' },
  },
  // Mark problematic packages as external to prevent bundling issues
  serverExternalPackages: [
    'puppeteer',
    'puppeteer-core',
    '@puppeteer/browsers',
    '@google-cloud/vertexai',
    'google-auth-library',
    'cheerio',
    'undici',
  ],
  turbopack: {
    root: __dirname,
  },
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/generated-websites/**'],
    };
    
    // Externalize problematic packages to prevent File API reference errors during build
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'puppeteer': 'commonjs puppeteer',
        'puppeteer-core': 'commonjs puppeteer-core',
        '@puppeteer/browsers': 'commonjs @puppeteer/browsers',
        '@google-cloud/vertexai': 'commonjs @google-cloud/vertexai',
        'google-auth-library': 'commonjs google-auth-library',
        'cheerio': 'commonjs cheerio',
        'undici': 'commonjs undici',
      });
    }
    
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
