import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",     
        hostname: "localhost",  
        port: "5000",          
        pathname: "/uploads/products/**",
      }
    ],
  },
};

export default nextConfig;

