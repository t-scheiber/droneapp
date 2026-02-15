import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export removed - using server-side rendering
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
