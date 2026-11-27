import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: [640, 1080, 1280, 1600, 2400],
    imageSizes: [320, 480],
  },
  trailingSlash: true,
};

export default nextConfig;
