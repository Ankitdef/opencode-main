import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
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
