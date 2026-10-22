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
    // Pre-made WebP sizes in public/photos (see src/lib/image-loader.ts)
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
    deviceSizes: [640, 1080, 1440],
    imageSizes: [320, 480],
  },
  async redirects() {
    // The site lives under /en and /am; the bare domain opens the English page
    return [{ source: '/', destination: '/en', permanent: false }];
  },
};

export default nextConfig;
