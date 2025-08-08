import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@digonto/shared-schemas"],
  experimental: {
    // Enable this to allow importing from outside root
    externalDir: true,
  },
};

export default nextConfig;
