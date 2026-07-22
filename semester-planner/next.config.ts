import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false, // temporary: testing whether Strict Mode's dev-only double-effect-invoke is what triggers the dnd-kit crash on first interaction
};

export default nextConfig;
