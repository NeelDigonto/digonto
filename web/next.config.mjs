import path from 'path'
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, options) => {
    config.resolve.alias["@"] = path.join(__dirname, "src");

    config.module.rules.push({
      test: /\.(frag|vert|glsl)$/,
      type: "asset/source",
    });

    return config;
  },
};

export default nextConfig;
