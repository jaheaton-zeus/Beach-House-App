import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // R2-backed photos are served through our own route handler, and the
    // static heroes live in /public — no remote loaders needed.
    unoptimized: true,
  },
};

export default nextConfig;

// Makes the Cloudflare bindings (DB, PHOTOS) available during `next dev`.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
