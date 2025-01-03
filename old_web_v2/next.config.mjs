import path from "path";
import { fileURLToPath } from "url";
import nextMDX from "@next/mdx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],

  webpack: (config, options) => {
    config.resolve.alias["@"] = path.join(__dirname, "src");

    config.module.rules.push({
      test: /\.(frag|vert|glsl)$/,
      type: "asset/source",
    });

    return config;
  },
};

export default nextMDX()(nextConfig);
