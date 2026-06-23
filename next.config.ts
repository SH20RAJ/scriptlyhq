import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard/creator",
        destination: "/creator",
        permanent: true,
      },
      {
        source: "/dashboard/creator/:path*",
        destination: "/creator/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
