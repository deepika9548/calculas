import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  turbopack: {
    // Set root so Turbopack reads package-lock.json from the project directory
    root: path.resolve(__dirname),
    rules: {
      // Process CSS files through @tailwindcss/turbopack (Tailwind CSS v4)
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
