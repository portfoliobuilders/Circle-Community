import type { NextConfig } from "next";

const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/join", destination: "/membership", permanent: true },
      { source: "/pricing", destination: "/membership", permanent: true },
      {
        source: "/legal/community-guidelines",
        destination: "/guidelines",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.circlecommunity.in" }],
        destination: "https://circlecommunity.in/:path*",
        permanent: true,
      },
    ];
  },
  ...(staticExport ? { output: "export" as const, trailingSlash: true } : {}),
  images: {
    unoptimized: staticExport,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  cacheComponents: staticExport ? false : true,
  partialPrefetching: staticExport ? false : true,
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
