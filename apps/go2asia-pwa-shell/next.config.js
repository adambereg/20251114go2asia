/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.go2asia.space',
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
  images: {
    domains: ['cdn.go2asia.space', 'images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
  },
  webpack: (config) => {
    // Настройка алиаса @ для packages/ui
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../../packages/ui/src'),
    };
    return config;
  },
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
            value: 'DENY',
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
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  experimental: {
    optimizePackageImports: ['@go2asia/ui', '@go2asia/sdk'],
  },
};

module.exports = nextConfig;

