import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // TypeScript strict mode
  typescript: {
    tsconfigPath: './tsconfig.json',
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Enable strict mode for catching errors
  reactStrictMode: true,

  // Configure headers for performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Redirects configuration (add as needed)
  async redirects() {
    return [];
  },

  // Rewrites configuration (add as needed)
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
