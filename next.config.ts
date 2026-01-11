import type { NextConfig } from 'next';

// Determine if we're in development mode
const isDev = process.env.NODE_ENV !== 'production';

// CSP script-src directive:
// - Production: 'unsafe-inline' only (for styled-jsx and inline scripts)
// - Development: also includes 'unsafe-eval' for HMR/Fast Refresh
const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
  : "script-src 'self' 'unsafe-inline'";

const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      scriptSrc,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://ipfs.io https://gateway.pinata.cloud",
      "font-src 'self' data:",
      "connect-src 'self' https://api.8004.dev",
      "frame-ancestors 'none'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Disable production source maps for faster builds
  productionBrowserSourceMaps: false,
  // Experimental features for faster builds
  experimental: {
    // Enable parallel server compilation
    parallelServerCompiles: true,
    // Optimize package imports (tree-shaking)
    optimizePackageImports: ['lucide-react', '@tanstack/react-query', 'date-fns'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ipfs.io',
      },
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
      },
    ],
  },
};

export default nextConfig;
