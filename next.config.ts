import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  headers: async () => {
    return [
      {
        headers: [
          { "key": "Access-Control-Allow-Origin", "value": "*" },
          { "key": "Access-Control-Allow-Methods", "value": "GET, POST, OPTIONS" },
          { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization" },
          { "key": "Access-Control-Allow-Credentials", "value": "true" }
        ],
        source: "/api/(.*)"
      },
      {
        headers: [
          { "key": "Access-Control-Allow-Origin", "value": "*" },
          { "key": "Access-Control-Allow-Methods", "value": "GET, OPTIONS" },
          { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization" },
          { "key": "Access-Control-Allow-Credentials", "value": "true" }
        ],
        source: "/f/(.*)"
      }
    ]
  },
  images: {
    remotePatterns: [
      {
        hostname: "ik.imagekit.io",
        pathname: '/q3ksr5fk3/**'
      }
    ]

  }
};

export default nextConfig;
