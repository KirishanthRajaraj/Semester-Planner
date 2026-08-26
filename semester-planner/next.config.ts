import type { NextConfig } from "next";
import pkg from "./package.json";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false, // temporary: testing whether Strict Mode's dev-only double-effect-invoke is what triggers the dnd-kit crash on first interaction
  env: { NEXT_PUBLIC_APP_VERSION: pkg.version },
};

export default nextConfig;
