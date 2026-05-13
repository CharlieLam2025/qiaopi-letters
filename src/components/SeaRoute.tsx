"use client";

import { motion } from "framer-motion";

// 海路地图：把"南洋 → 香港 → 汕头/厦门 → 侨乡"用 SVG 折线画出来
// 不追求地理精确，只追求"穿越大海"的视觉意象
export default function SeaRoute() {
  return (
    <svg
      viewBox="0 0 800 480"
      className="w-full h-auto"
      role="img"
      aria-label="侨批海路示意图：南洋经香港抵达侨乡"
    >
      <defs>
        <filter id="seaTex">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="2" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.25  0 0 0 0 0.18  0 0 0 0 0.08  0 0 0 0.4 0"
          />
        </filter>
      </defs>
      {/* 海面纹理 */}
      <rect width="800" height="480" fill="#ecdfbf" />
      <rect width="800" height="480" filter="url(#seaTex)" opacity="0.4" />

      {/* 等高线/海岸：用浅墨色画几个不规则形状代表陆地 */}
      <g fill="#dccea4" stroke="#5c4631" strokeWidth="1.2" opacity="0.7">
        {/* 中国东南沿海 */}
        <path d="M 480 40 C 540 60, 600 80, 650 70 C 720 60, 770 90, 790 130 L 790 0 L 480 0 Z" />
        {/* 海南岛 */}
        <path d="M 600 180 C 620 175, 640 185, 650 200 C 655 215, 640 230, 615 225 C 600 215, 595 195, 600 180 Z" />
        {/* 中南半岛 */}
        <path d="M 300 80 C 280 140, 290 200, 310 260 C 330 300, 360 320, 400 310 C 430 300, 440 270, 430 230 C 420 180, 380 100, 300 80 Z" />
        {/* 马来半岛 + 苏门答腊 */}
        <path d="M 340 300 C 320 360, 280 400, 240 420 C 200 430, 160 410, 140 380 C 130 350, 150 320, 200 310 C 260 305, 320 300, 340 300 Z" />
        {/* 爪哇 */}
        <path d="M 280 430 C 320 425, 380 430, 430 440 C 480 445, 530 440, 560 445 L 560 480 L 240 480 Z" />
      </g>

      {/* 城市点 */}
      <CityDot x={680} y={110} label="厦门" align="end" />
      <CityDot x={620} y={140} label="汕头" align="end" />
      <CityDot x={560} y={160} label="香港" align="end" />
      <CityDot x={300} y={420} label="新加坡" align="start" />
      <CityDot x={220} y={400} label="槟城" align="end" />
      <CityDot x={400} y={460} label="雅加达" align="start" />
      <CityDot x={400} y={280} label="西贡" align="start" />
      <CityDot x={360} y={170} label="曼谷" align="start" />

      {/* 海路路径：从南洋汇向香港，再分发到侨乡 */}
      <RoutePath d="M 300 420 Q 420 320, 560 160" delay={0.2} />
      <RoutePath d="M 220 400 Q 350 280, 560 160" delay={0.5} />
      <RoutePath d="M 400 460 Q 480 320, 560 160" delay={0.8} />
      <RoutePath d="M 360 170 Q 460 160, 560 160" delay={1.1} />
      <RoutePath d="M 400 280 Q 480 220, 560 160" delay={1.4} />
      {/* 香港 → 汕头/厦门 */}
      <RoutePath d="M 560 160 Q 590 145, 620 140" delay={1.8} dashed />
      <RoutePath d="M 560 160 Q 620 130, 680 110" delay={2.0} dashed />

      {/* 罗盘 */}
      <g transform="translate(700, 380)" stroke="#3a2818" fill="none" strokeWidth="1.2">
        <circle r="34" />
        <circle r="28" strokeDasharray="2 3" />
        <path d="M 0 -28 L 4 0 L 0 28 L -4 0 Z" fill="#8b2c2c" />
        <text y="-40" textAnchor="middle" fontSize="11" fill="#3a2818" fontFamily="serif">
          N
        </text>
      </g>
    </svg>
  );
}

function CityDot({
  x,
  y,
  label,
  align = "start",
}: {
  x: number;
  y: number;
  label: string;
  align?: "start" | "end" | "middle";
}) {
  const dx = align === "start" ? 8 : align === "end" ? -8 : 0;
  return (
    <g>
      <motion.circle
        cx={x}
        cy={y}
        r={4}
        fill="#8b2c2c"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      />
      <circle cx={x} cy={y} r={9} fill="none" stroke="#8b2c2c" opacity="0.3" />
      <text
        x={x + dx}
        y={y - 8}
        textAnchor={align}
        fontSize="13"
        fontFamily="serif"
        fill="#3a2818"
        fontWeight="600"
      >
        {label}
      </text>
    </g>
  );
}

function RoutePath({
  d,
  delay = 0,
  dashed = false,
}: {
  d: string;
  delay?: number;
  dashed?: boolean;
}) {
  return (
    <motion.path
      d={d}
      stroke="#5c4631"
      strokeWidth="1.6"
      fill="none"
      strokeDasharray={dashed ? "4 4" : undefined}
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 0.85 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 2.2, delay, ease: [0.4, 0, 0.2, 1] }}
    />
  );
}
