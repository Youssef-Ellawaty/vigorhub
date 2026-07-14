import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* image domains for placeholder avatars */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
