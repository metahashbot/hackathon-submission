import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // 添加这一行
  
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
