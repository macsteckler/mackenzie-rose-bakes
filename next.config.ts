import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    dangerouslyAllowSVG: false,
  },
  experimental: {
    serverActions: {
      // The admin dashboard uploads several full-resolution photos per
      // request via a Server Action; raise the default 1MB body limit.
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
