import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignore ESLint errors during production builds to avoid build-time
    // failures when dev-only plugins or configs aren't resolvable.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
