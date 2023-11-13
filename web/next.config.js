const path = require("path");
const withMDX = require("@next/mdx")();

/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "standalone",

  // Configure `pageExtensions` to include MDX files
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

module.exports = withMDX(nextConfig);
