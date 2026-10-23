import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The admin panel and API are fully dynamic (every page reads the database), so we use the
  // classic request-time rendering model instead of Cache Components.
  experimental: {
    serverActions: { bodySizeLimit: "8mb" },
  },
  serverExternalPackages: ["sharp", "mysql2"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
