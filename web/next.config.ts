import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.resolve.alias["@gateway"] = path.resolve(__dirname, "../gateway");
    return config;
  },
  experimental: {
    // Enable this to allow importing from outside root
    externalDir: true,
  },
};

export default nextConfig;
