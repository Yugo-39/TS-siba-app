import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    output: "export",            // ← 静的書き出し
    images: { unoptimized: true } // ← next/image を静的対応
    // 緊急回避したいときだけ（恒久NG）
    // eslint: { ignoreDuringBuilds: true },
    // typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
