// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',          // ← これが新方式
  images: { unoptimized: true }, // next/image を使っている場合は必須
  // trailingSlash: true,     // 必要なら有効に（相対パスで困るとき）
};
module.exports = nextConfig;
