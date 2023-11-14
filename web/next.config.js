const path = require("path");
const { withContentlayer } = require("next-contentlayer");

/** @type {import('next').NextConfig} */

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

module.exports = withContentlayer(nextConfig);
