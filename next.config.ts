import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const uploadPattern = apiUrl ? new URL("/uploads/**", new URL(apiUrl).origin) : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: uploadPattern ? [uploadPattern] : [],
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
  },
};

export default nextConfig;
