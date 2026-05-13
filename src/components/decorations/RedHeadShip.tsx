"use client";

/**
 * 红头船剪影 —— 19 世纪福建广东沿海开往南洋的著名木帆船。
 * 用纯 SVG 路径画一个三桅帆船 + 红色船头。
 * 用在首页 hero 区 / 展厅三 / 写信页等地方，做装饰。
 */
interface Props {
  width?: number;
  className?: string;
  /** 朝向：left = 朝左航行（默认）；right = 朝右 */
  facing?: "left" | "right";
}

export default function RedHeadShip({
  width = 220,
  className = "",
  facing = "left",
}: Props) {
  return (
    <svg
      viewBox="0 0 320 200"
      width={width}
      className={className}
      style={{ transform: facing === "right" ? "scaleX(-1)" : undefined }}
      aria-hidden
    >
      <defs>
        <filter id="ship-rough">
          <feTurbulence baseFrequency="0.03" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="1.2" />
        </filter>
      </defs>

      {/* 水面（淡淡的波纹）*/}
      <g stroke="#5c4631" strokeWidth="0.8" fill="none" opacity="0.35">
        <path d="M 10 165 Q 40 162, 70 165 T 130 165 T 200 165 T 280 165 T 310 165" />
        <path d="M 20 175 Q 50 172, 80 175 T 140 175 T 210 175 T 290 175" opacity="0.6" />
      </g>

      {/* 船身（深棕） */}
      <g fill="#3a2818" opacity="0.92" filter="url(#ship-rough)">
        {/* 主船体 */}
        <path d="M 30 140 L 290 140 L 270 160 L 50 160 Z" />
        {/* 船头微翘 */}
        <path d="M 285 140 L 305 130 L 305 145 L 295 150 Z" />
      </g>

      {/* 红色船头（"红头船"的标志）—— 真实的"红头船"是船头漆红 */}
      <g fill="#8b2c2c" opacity="0.95">
        <path d="M 280 135 L 305 128 L 305 148 L 290 150 Z" />
        {/* 船头眼睛（潮汕船头常画一对眼，避邪） */}
        <ellipse cx="298" cy="138" rx="2.5" ry="1.6" fill="#f5ecd7" />
        <circle cx="298" cy="138" r="0.9" fill="#1a1208" />
      </g>

      {/* 三根桅杆 */}
      <g stroke="#3a2818" strokeWidth="2" fill="none">
        <line x1="80" y1="140" x2="80" y2="50" />
        <line x1="155" y1="140" x2="155" y2="30" />
        <line x1="225" y1="140" x2="225" y2="55" />
      </g>

      {/* 帆（米黄色，半透明）*/}
      <g fill="#e8dbb6" stroke="#5c4631" strokeWidth="0.8" opacity="0.85">
        {/* 前帆 */}
        <path d="M 80 55 L 50 80 L 50 130 L 80 135 Z" />
        {/* 主帆（大）*/}
        <path d="M 155 35 L 105 65 L 105 135 L 155 138 Z" />
        <path d="M 155 35 L 205 65 L 205 135 L 155 138 Z" />
        {/* 后帆 */}
        <path d="M 225 60 L 250 85 L 250 132 L 225 135 Z" />
      </g>

      {/* 帆横线（让帆看起来是分段的）*/}
      <g stroke="#5c4631" strokeWidth="0.5" opacity="0.55">
        <line x1="105" y1="80" x2="205" y2="80" />
        <line x1="105" y1="100" x2="205" y2="100" />
        <line x1="105" y1="118" x2="205" y2="118" />
        <line x1="50" y1="100" x2="80" y2="100" />
        <line x1="225" y1="100" x2="250" y2="100" />
      </g>

      {/* 桅顶旗（红，小三角）*/}
      <g fill="#8b2c2c">
        <path d="M 155 30 L 165 32 L 155 38 Z" />
      </g>
    </svg>
  );
}
