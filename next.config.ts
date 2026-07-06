import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // site estatico: `next build` gera a pasta `out/` com tudo pronto, sem runtime.
  output: "export",
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
