import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

console.log("⭐️ANALYZE:", process.env.ANALYZE);

const nextConfig: NextConfig = {
  images: {
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
