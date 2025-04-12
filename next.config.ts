import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  /*serverActions: {
    bodySizeLimit: "2mb",
  },*/
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**/*",
      },
    ],
  },
};

export default nextConfig;
