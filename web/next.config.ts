import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 828, 1080, 1440, 1920, 2560],
  },
  async redirects() {
    // The site lives under /en and /am; the bare domain opens the English page
    return [{ source: '/', destination: '/en', permanent: false }];
  },
};

export default nextConfig;
