import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["randomuser.me"], // ✅ allow external image domain
  },
};

export default nextConfig;
