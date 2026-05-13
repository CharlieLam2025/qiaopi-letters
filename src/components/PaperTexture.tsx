"use client";

import type { CSSProperties } from "react";

interface Props {
  className?: string;
  intensity?: "soft" | "medium" | "heavy";
  style?: CSSProperties;
}

// 纯 CSS/SVG 的旧纸纹理：
// - 底色用米黄渐变
// - 叠加点状/纤维状噪点
// - 四角加深做"翻阅久了"的边缘氧化感
export default function PaperTexture({
  className = "",
  intensity = "medium",
  style,
}: Props) {
  const noiseOpacity = intensity === "heavy" ? 0.35 : intensity === "soft" ? 0.12 : 0.22;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={style}
    >
      {/* 底色：米黄 + 不均匀渐变 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #f3e8ce 0%, #ecdfbf 45%, #e6d5af 100%)",
        }}
      />
      {/* 大块色斑：模拟纸张吸水不均 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 15% 25%, rgba(120,80,40,0.08), transparent 70%)," +
            "radial-gradient(ellipse 40% 30% at 80% 75%, rgba(140,100,60,0.07), transparent 70%)," +
            "radial-gradient(ellipse 70% 50% at 50% 90%, rgba(90,60,30,0.06), transparent 70%)",
        }}
      />
      {/* 颗粒噪点：用 SVG turbulence */}
      <svg
        className="absolute inset-0 h-full w-full"
        style={{ opacity: noiseOpacity, mixBlendMode: "multiply" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="paperNoise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.12  0 0 0 0.5 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#paperNoise)" />
      </svg>
      {/* 四周阴影：模拟纸的厚度与边缘氧化 */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow:
            "inset 0 0 80px rgba(80,50,20,0.18), inset 0 0 14px rgba(60,40,15,0.15)",
        }}
      />
    </div>
  );
}
