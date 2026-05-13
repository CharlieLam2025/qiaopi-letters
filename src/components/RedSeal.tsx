"use client";

interface Props {
  text?: string; // 印章内的字，建议 2 或 4 字
  size?: number;
  rotate?: number; // 度
  className?: string;
}

// 红色印章：略带不规则边缘 + 内圈文字
// 用 SVG 的 turbulence + displacement 让边缘有"墨迹溅出"的破损感
export default function RedSeal({
  text = "侨批",
  size = 96,
  rotate = -6,
  className = "",
}: Props) {
  const chars = text.split("");
  const isFour = chars.length === 4;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-label={`印章：${text}`}
    >
      <defs>
        <filter id="sealEdge">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="2.5" />
        </filter>
        <filter id="sealInk">
          <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="1" seed="7" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.2 1.1"
          />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      {/* 外框（带破损） */}
      <g filter="url(#sealEdge)">
        <rect
          x="6"
          y="6"
          width="88"
          height="88"
          rx="2"
          fill="none"
          stroke="#8b2c2c"
          strokeWidth="3.5"
        />
        {/* 实心填充：用红色矩形 + 镂空文字效果（伪：直接画白字在红块上） */}
        <rect x="10" y="10" width="80" height="80" fill="#8b2c2c" opacity="0.95" />
      </g>
      {/* 文字 */}
      <g>
        {isFour ? (
          <>
            <text
              x="32"
              y="44"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="26"
              fontFamily="serif"
              fontWeight="700"
              fill="#f5ecd7"
            >
              {chars[0]}
            </text>
            <text
              x="68"
              y="44"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="26"
              fontFamily="serif"
              fontWeight="700"
              fill="#f5ecd7"
            >
              {chars[1]}
            </text>
            <text
              x="32"
              y="74"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="26"
              fontFamily="serif"
              fontWeight="700"
              fill="#f5ecd7"
            >
              {chars[2]}
            </text>
            <text
              x="68"
              y="74"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="26"
              fontFamily="serif"
              fontWeight="700"
              fill="#f5ecd7"
            >
              {chars[3]}
            </text>
          </>
        ) : (
          chars.map((c, i) => (
            <text
              key={i}
              x="50"
              y={chars.length === 1 ? 60 : 32 + i * 36}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={chars.length === 1 ? 56 : 36}
              fontFamily="serif"
              fontWeight="700"
              fill="#f5ecd7"
            >
              {c}
            </text>
          ))
        )}
      </g>
      {/* 墨色不均：在表面叠一层噪声做"未盖匀"的感觉 */}
      <rect x="0" y="0" width="100" height="100" filter="url(#sealInk)" opacity="0.5" />
    </svg>
  );
}
