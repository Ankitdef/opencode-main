import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  turbopack: {
    // ponytail: outer repo has its own package-lock.json — pin the workspace root to this app
    root: path.resolve(import.meta.dirname),
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Security headers — note: headers() config doesn't work with output:"export"
  // These are applied via meta tags in layout.tsx instead.
};

export default nextConfig;
