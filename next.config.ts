import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Link",
            value: '<https://learn.rajanmidun.com.np/:path*>; rel="canonical"',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
