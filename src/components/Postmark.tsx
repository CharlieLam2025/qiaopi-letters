"use client";

interface Props {
  city?: string;
  date?: string; // 例如 "1948.03.12"
  size?: number;
  rotate?: number;
  className?: string;
}

// 圆形邮戳：外圈城市名 + 中间日期 + 上下边线
// 用深棕色 + 半透明模拟盖印不匀
export default function Postmark({
  city = "汕头",
  date = "1948.03.12",
  size = 110,
  rotate = 12,
  className = "",
}: Props) {
  // 城市名沿圆弧排布
  const cityChars = city.split("");
  const radius = 38;
  const startAngle = -Math.PI * 0.85;
  const endAngle = -Math.PI * 0.15;
  const angleStep =
    cityChars.length > 1 ? (endAngle - startAngle) / (cityChars.length - 1) : 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-label={`邮戳：${city} ${date}`}
    >
      <defs>
        <filter id="postmarkBleed">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5" />
          <feDisplacementMap in="SourceGraphic" scale="1.5" />
        </filter>
        <filter id="postmarkInk">
          <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="1" seed="11" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.5 1.2"
          />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <g filter="url(#postmarkBleed)" stroke="#3a2818" fill="none" strokeWidth="2.2">
        <circle cx="50" cy="50" r="44" />
        <circle cx="50" cy="50" r="38" />
        <line x1="14" y1="50" x2="86" y2="50" strokeWidth="1.5" strokeDasharray="2 2" />
      </g>
      {/* 城市名沿上半圆 */}
      <g fill="#3a2818" fontFamily="serif" fontWeight="600" fontSize="9">
        {cityChars.map((c, i) => {
          const angle = startAngle + angleStep * i;
          const x = 50 + radius * Math.cos(angle);
          const y = 50 + radius * Math.sin(angle);
          const rotDeg = (angle * 180) / Math.PI + 90;
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${rotDeg} ${x} ${y})`}
            >
              {c}
            </text>
          );
        })}
      </g>
      {/* 日期居中下半部 */}
      <text
        x="50"
        y="68"
        textAnchor="middle"
        fontFamily="serif"
        fontSize="8.5"
        fill="#3a2818"
        fontWeight="600"
      >
        {date}
      </text>
      {/* 盖印不匀 */}
      <rect x="0" y="0" width="100" height="100" filter="url(#postmarkInk)" opacity="0.35" />
    </svg>
  );
}
