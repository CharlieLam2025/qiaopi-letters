"use client";

/**
 * 卡片右上贴角邮票：一张简化的小邮票，用于原件库列表卡片。
 * 比 archiveImage.ts 里的 postageStamp 更小、更克制。
 */
interface Props {
  size?: number;
  rotate?: number;
  text?: string;
  red?: boolean;
  className?: string;
}

export default function CornerStamp({
  size = 40,
  rotate = -8,
  text = "侨",
  red = false,
  className = "",
}: Props) {
  const fill = red ? "#8b2c2c" : "#3a4a5e";
  return (
    <svg
      viewBox="0 0 100 120"
      width={size}
      className={className}
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden
    >
      {/* 邮票底板 */}
      <rect width="100" height="120" fill="#f5ecd7" stroke="#5c4631" strokeWidth="1" />
      {/* 齿孔 */}
      {[12, 25, 38, 51, 64, 77, 90].map((y) => (
        <g key={y}>
          <circle cx="0" cy={y} r="3" fill="#ecdfbf" />
          <circle cx="100" cy={y} r="3" fill="#ecdfbf" />
        </g>
      ))}
      {[12, 25, 38, 51, 64, 77, 90].map((x) => (
        <g key={`x${x}`}>
          <circle cx={x} cy="0" r="3" fill="#ecdfbf" />
          <circle cx={x} cy="120" r="3" fill="#ecdfbf" />
        </g>
      ))}
      {/* 内框 */}
      <rect x="8" y="10" width="84" height="100" fill={fill} opacity="0.92" />
      {/* 中心字 */}
      <text
        x="50"
        y="68"
        textAnchor="middle"
        fontSize="56"
        fontFamily="serif"
        fontWeight="700"
        fill="#f5ecd7"
      >
        {text}
      </text>
      {/* 顶部小字 */}
      <text
        x="50"
        y="22"
        textAnchor="middle"
        fontSize="8"
        fontFamily="serif"
        fill="#f5ecd7"
        opacity="0.85"
        letterSpacing="0.5"
      >
        QIAO PI
      </text>
      {/* 底部小字 */}
      <text
        x="50"
        y="106"
        textAnchor="middle"
        fontSize="8"
        fontFamily="serif"
        fontWeight="700"
        fill="#f5ecd7"
      >
        1 分
      </text>
    </svg>
  );
}
