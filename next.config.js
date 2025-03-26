/** @type {import('next').NextConfig} */
const nextConfig = {
  // 禁用严格模式以避免开发中的双重渲染
  reactStrictMode: false,

  // 通过配置实验性选项优化路由处理
  experimental: {
    // 启用服务器端操作
    serverActions: true,
  },

  // 配置图片域名白名单
  images: {
    domains: [""],
  },

  // 环境变量配置
  env: {
    APP_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_NAME: "智能代理协作系统 (iT-Agent)",
    NEXT_PUBLIC_APP_VERSION: "0.1.0",
  },

  // 输出选项
  output: "standalone",

  // 静态资源处理
  assetPrefix: process.env.NODE_ENV === "production" ? "/" : undefined,

  // 禁用一些可能导致问题的优化
  poweredByHeader: false,

  // 构建缓存配置
  distDir: ".next",
  onDemandEntries: {
    // 缓存周期
    maxInactiveAge: 60 * 60 * 1000,
    // 同时保持活动的页面数
    pagesBufferLength: 5,
  },

  // webpack配置优化
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;
