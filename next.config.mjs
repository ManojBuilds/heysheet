/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  images: {
    domains: ['lh3.googleusercontent.com'], // For Google profile images
  },
  
  // Configure headers for security
  headers: async () => [
    {
      source: '/(.*)',
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
      ],
    },
  ],
  
  experimental: {
    staleTimes: {
      dynamic: 30,  // 30 seconds for dynamic routes
      static: 180,  // 3 minutes for static routes
    },
  },
};

export default nextConfig;