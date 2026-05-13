"use client";

/**
 * 全站底层水印：一张极淡的"东亚-南洋海图"。
 *
 * - 用 SVG 路径勾勒中国东南沿海 / 中南半岛 / 马来半岛 / 苏门答腊 / 婆罗洲 / 爪哇 / 菲律宾。
 * - 加几条经纬度参考线 + 罗盘。
 * - position: fixed 在 body 最底层，opacity 极低，pointer-events: none。
 *   不影响交互，不影响阅读，只在余光里告诉你这是一张"放在旧海图上的网页"。
 */
export default function MapWatermark() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 select-none"
      style={{ mixBlendMode: "multiply" }}
    >
      <svg
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        <defs>
          <filter id="mw-rough">
            <feTurbulence baseFrequency="0.02" numOctaves="2" seed="9" />
            <feDisplacementMap in="SourceGraphic" scale="2" />
          </filter>
        </defs>

        {/* 经纬度参考网格（很淡）*/}
        <g stroke="#5c4631" strokeWidth="0.6" opacity="0.08" strokeDasharray="2 6">
          {[100, 200, 300, 400, 500, 600, 700].map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2="1200" y2={y} />
          ))}
          {[150, 300, 450, 600, 750, 900, 1050].map((x) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="800" />
          ))}
        </g>

        {/* 陆地轮廓（不填色，只勾线）—— 极淡 */}
        <g
          fill="none"
          stroke="#3a2818"
          strokeWidth="1.4"
          opacity="0.09"
          filter="url(#mw-rough)"
        >
          {/* 中国东南沿海 */}
          <path d="M 720 -10 C 800 30, 900 60, 1020 70 C 1100 80, 1180 110, 1210 150 L 1210 -10 Z" />
          {/* 海南岛 */}
          <path d="M 650 220 C 690 215, 740 225, 760 245 C 770 270, 740 295, 695 290 C 660 280, 645 245, 650 220 Z" />
          {/* 中南半岛 */}
          <path d="M 280 30 C 240 110, 270 220, 330 320 C 380 380, 460 410, 540 390 C 590 370, 610 320, 600 260 C 580 180, 480 80, 280 30 Z" />
          {/* 马来半岛 */}
          <path d="M 480 380 C 440 460, 400 510, 340 530 C 280 540, 230 510, 230 470 C 230 410, 300 380, 400 380 C 450 380, 480 380, 480 380 Z" />
          {/* 苏门答腊 */}
          <path d="M 60 460 C 30 530, 80 600, 180 615 C 270 625, 350 595, 360 560 C 365 520, 320 480, 240 470 C 150 460, 70 460, 60 460 Z" />
          {/* 爪哇（横长岛屿）*/}
          <path d="M 350 650 C 460 640, 590 645, 720 655 C 820 660, 880 660, 920 665" />
          {/* 婆罗洲 */}
          <path d="M 610 420 C 590 480, 620 545, 700 575 C 790 590, 870 565, 905 510 C 925 460, 890 420, 800 405 C 700 395, 625 405, 610 420 Z" />
          {/* 菲律宾 吕宋 */}
          <path d="M 930 270 C 905 340, 935 410, 975 435 C 1015 450, 1045 410, 1045 360 C 1045 310, 1015 265, 975 265 C 955 265, 940 268, 930 270 Z" />
          {/* 菲律宾 棉兰老（简化）*/}
          <path d="M 980 490 C 970 530, 990 565, 1030 565 C 1060 560, 1075 525, 1060 490 C 1050 465, 1010 463, 980 490 Z" />
        </g>

        {/* 几条若有若无的航线 */}
        <g
          fill="none"
          stroke="#5c4631"
          strokeWidth="1"
          opacity="0.07"
          strokeDasharray="1 8"
        >
          <path d="M 480 540 Q 700 380, 920 130" />
          <path d="M 280 480 Q 500 320, 880 140" />
          <path d="M 590 720 Q 750 480, 900 140" />
          <path d="M 1000 380 Q 970 230, 960 100" />
        </g>

        {/* 罗盘 */}
        <g
          transform="translate(80,700)"
          stroke="#3a2818"
          fill="none"
          strokeWidth="0.8"
          opacity="0.16"
        >
          <circle r="34" />
          <circle r="26" strokeDasharray="2 3" />
          <path d="M 0 -26 L 4 0 L 0 26 L -4 0 Z" fill="#8b2c2c" opacity="0.5" />
          <text
            y="-38"
            textAnchor="middle"
            fontSize="11"
            fill="#3a2818"
            fontFamily="serif"
          >
            N
          </text>
        </g>
      </svg>
    </div>
  );
}
