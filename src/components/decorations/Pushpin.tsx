"use client";

/**
 * 图钉：给侨批墙卡片"贴在墙上"的感觉。
 * 用 SVG 渐变模拟铜质 / 红漆图钉。
 */
interface Props {
  size?: number;
  color?: "brass" | "red" | "ink";
  className?: string;
}

const PALETTE: Record<"brass" | "red" | "ink", { core: string; rim: string; hi: string }> = {
  brass: { core: "#c4a26b", rim: "#7a5a30", hi: "#f4e2b8" },
  red: { core: "#a04040", rim: "#5a1818", hi: "#e8b8b8" },
  ink: { core: "#3a2818", rim: "#1a1208", hi: "#80684a" },
};

export default function Pushpin({
  size = 22,
  color = "brass",
  className = "",
}: Props) {
  const { core, rim, hi } = PALETTE[color];
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      {/* 阴影 */}
      <ellipse cx="22" cy="26" rx="11" ry="3.5" fill="#1a1208" opacity="0.35" />
      {/* 钉头主体 */}
      <circle cx="20" cy="20" r="11" fill={core} stroke={rim} strokeWidth="1" />
      {/* 高光 */}
      <ellipse cx="16" cy="16" rx="4.5" ry="3" fill={hi} opacity="0.9" />
      {/* 中心小凹 */}
      <circle cx="20" cy="20" r="2" fill={rim} opacity="0.55" />
    </svg>
  );
}
