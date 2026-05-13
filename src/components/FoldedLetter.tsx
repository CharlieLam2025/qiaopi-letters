"use client";

import { motion } from "framer-motion";

// 装饰用的折叠信纸图示：一张被折成三段的纸
export default function FoldedLetter({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 240 160"
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.6, ease: [0.4, 0, 0.2, 1] }}
      aria-hidden
    >
      <defs>
        <linearGradient id="foldPaper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3e8ce" />
          <stop offset="100%" stopColor="#e6d5af" />
        </linearGradient>
      </defs>
      {/* 主体 */}
      <rect
        x="20"
        y="30"
        width="200"
        height="100"
        fill="url(#foldPaper)"
        stroke="#5c4631"
        strokeWidth="0.8"
      />
      {/* 折痕：上下两条 */}
      <line x1="20" y1="63" x2="220" y2="63" stroke="#5c4631" strokeWidth="0.6" opacity="0.5" />
      <line x1="20" y1="96" x2="220" y2="96" stroke="#5c4631" strokeWidth="0.6" opacity="0.5" />
      {/* 横线模拟字 */}
      {[40, 48, 56, 73, 81, 89, 106, 114, 122].map((y) => (
        <line
          key={y}
          x1="36"
          y1={y}
          x2={36 + 140 + (y % 7) * 4}
          y2={y}
          stroke="#5c4631"
          strokeWidth="0.7"
          opacity="0.35"
        />
      ))}
      {/* 红印章 */}
      <rect
        x="178"
        y="100"
        width="22"
        height="22"
        fill="#8b2c2c"
        opacity="0.85"
        transform="rotate(-6 189 111)"
      />
    </motion.svg>
  );
}
