/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Optimize images from trusted domains
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
  
  // Enable experimental features for better performance
  experimental: {
    // Enable server actions for form submissions
    serverActions: true,
    
    // Configure caching for better performance
    staleTimes: {
      dynamic: 30,  // 30 seconds for dynamic routes
      static: 180,  // 3 minutes for static routes
    },
  },
};

export default nextConfig;