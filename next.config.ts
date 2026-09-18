import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 2592000,
    remotePatterns: [
      new URL("https://tin8j995p60dzs6k.public.blob.vercel-storage.com/**"),
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "45mb",
    },
  },
};

export default withBundleAnalyzer(nextConfig);
