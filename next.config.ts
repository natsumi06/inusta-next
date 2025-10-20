import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 2592000,
    remotePatterns: [
      new URL("https://ssgbsuhzqhcrqfoe.public.blob.vercel-storage.com/**"),
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "45mb",
    },
  },
};

export default withBundleAnalyzer(nextConfig);
