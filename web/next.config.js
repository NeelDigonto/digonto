/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  output: "standalone",
  webpack: (config, options) => {
    config.resolve.alias["@"] = path.join(__dirname, "src");

    config.module.rules.push({
      test: /\.(frag|vert|glsl)$/,
      type: "asset/source",
    });

    return config;
  },
};

module.exports = nextConfig;
