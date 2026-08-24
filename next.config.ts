import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  productionBrowserSourceMaps: true,
  async redirects() {
    return [
      {
        source: "/cv",
        destination: "/en/cv",
        permanent: false,
      },
      {
        source: "/resume",
        destination: "/en/cv",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
