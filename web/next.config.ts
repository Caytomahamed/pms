import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
        // port: '9000',
        // pathname: '/account123/**',
        // search: '',
      },
    ],
  },
};

export default nextConfig;
