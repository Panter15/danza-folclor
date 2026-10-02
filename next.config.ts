import type { NextConfig } from "next";

// GitHub Pages serves the site under /<repo-name>, so the deploy workflow sets
// PAGES_BASE_PATH. Locally it is empty and the site runs at the root.
const basePath = process.env.PAGES_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
