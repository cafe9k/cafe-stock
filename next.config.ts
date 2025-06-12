import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // 为容器化部署优化
  // experimental: {
  //   optimizeCss: true, // 暂时禁用，避免 critters 依赖问题
  // },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  // 如果使用静态导出，取消注释以下配置
  // output: 'export',
  // trailingSlash: true,
};

export default nextConfig;
