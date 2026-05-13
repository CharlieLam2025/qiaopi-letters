"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { QiaopiItem } from "@/lib/archiveTypes";

// ── 城市坐标 ────────────────────────────────────────────────
// 基于真实经纬度大致映射到 viewBox 1000×600；同义城市指向同一点
// (新加坡 / 牛车水 / 丝丝街 —— 都视作 "新加坡市内"，下同)
type Coord = { x: number; y: number; side: "from" | "to" };
const COORDS: Record<string, Coord> = {
  // ── 中国侨乡（"to" 端）──
  莆田: { x: 840, y: 56, side: "to" },
  兴化: { x: 840, y: 56, side: "to" },
  泉州: { x: 825, y: 82, side: "to" },
  南安: { x: 819, y: 78, side: "to" },
  晋江: { x: 829, y: 88, side: "to" },
  惠安: { x: 833, y: 75, side: "to" },
  安溪: { x: 800, y: 92, side: "to" },
  厦门: { x: 805, y: 105, side: "to" },
  漳州: { x: 778, y: 116, side: "to" },
  海澄: { x: 786, y: 122, side: "to" },
  龙海: { x: 794, y: 120, side: "to" },
  龙岩: { x: 770, y: 58, side: "to" },
  汕头: { x: 762, y: 138, side: "to" },
  潮安: { x: 758, y: 134, side: "to" },
  潮州: { x: 756, y: 132, side: "to" },
  潮阳: { x: 756, y: 144, side: "to" },
  揭阳: { x: 744, y: 146, side: "to" },
  海丰: { x: 700, y: 162, side: "to" },
  梅县: { x: 724, y: 142, side: "to" },
  嘉应州: { x: 724, y: 142, side: "to" },
  五华: { x: 712, y: 158, side: "to" },
  开平: { x: 622, y: 168, side: "to" },
  台山: { x: 620, y: 174, side: "to" },
  雷州: { x: 535, y: 200, side: "to" },
  文昌: { x: 578, y: 198, side: "to" },
  琼海: { x: 558, y: 215, side: "to" },
  // ── 南洋（"from" 端）──
  仰光: { x: 50, y: 175, side: "from" },
  缅甸: { x: 50, y: 175, side: "from" },
  西贡: { x: 432, y: 295, side: "from" },
  堤岸: { x: 432, y: 295, side: "from" },
  曼谷: { x: 292, y: 252, side: "from" },
  槟城: { x: 246, y: 384, side: "from" },
  槟榔屿: { x: 246, y: 384, side: "from" },
  怡保: { x: 260, y: 410, side: "from" },
  吉隆坡: { x: 280, y: 432, side: "from" },
  新加坡: { x: 384, y: 462, side: "from" },
  牛车水: { x: 384, y: 462, side: "from" },
  丝丝街: { x: 384, y: 462, side: "from" },
  雅加达: { x: 482, y: 556, side: "from" },
  万隆: { x: 482, y: 575, side: "from" },
  泗水: { x: 578, y: 558, side: "from" },
  马尼拉: { x: 806, y: 302, side: "from" },
  香港: { x: 720, y: 130, side: "from" },
  九龙: { x: 720, y: 130, side: "from" },
};

function findCoord(name: string): Coord | null {
  if (!name) return null;
  for (const k of Object.keys(COORDS)) if (name.includes(k)) return COORDS[k];
  return null;
}

// 在 a → b 之间画一条向"海域内侧"拱起的二次贝塞尔曲线
function curveBetween(a: Coord, b: Coord): string {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy) || 1;
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  // 法线方向，统一向"海"那侧抬高（海在 NE/N 方向 → 选 -dy/dist, dx/dist 的反向）
  const nx = dy / dist;
  const ny = -dx / dist;
  const lift = dist * 0.22;
  const cx = mx + nx * lift;
  const cy = my + ny * lift;
  return `M ${a.x} ${a.y} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x} ${b.y}`;
}

function shortCity(s: string): string {
  return s.replace(/[省市县区府都乡]/g, "").trim().slice(0, 5);
}

// ── 主组件 ──────────────────────────────────────────────────
export default function QiaopiMap({ items }: { items: QiaopiItem[] }) {
  const router = useRouter();
  const [hoverId, setHoverId] = useState<string | null>(null);

  const routes = useMemo(() => {
    return items
      .map((it) => {
        const from = findCoord(it.fromCity) ?? findCoord(it.fromCountry);
        const to =
          findCoord(it.toVillage) ?? findCoord(it.toCity) ?? findCoord(it.toProvince);
        if (!from || !to) return null;
        return { item: it, from, to, path: curveBetween(from, to) };
      })
      .filter(Boolean) as Array<{
      item: QiaopiItem;
      from: Coord;
      to: Coord;
      path: string;
    }>;
  }, [items]);

  // 端点合并：同坐标只画一次（label 取该坐标第一次出现时的城市名）
  const points = useMemo(() => {
    const map = new Map<
      string,
      { x: number; y: number; label: string; side: "from" | "to"; count: number }
    >();
    for (const r of routes) {
      const fk = `${r.from.x},${r.from.y}`;
      const tk = `${r.to.x},${r.to.y}`;
      if (!map.has(fk))
        map.set(fk, {
          x: r.from.x,
          y: r.from.y,
          label: shortCity(r.item.fromCity || r.item.fromCountry),
          side: "from",
          count: 1,
        });
      else map.get(fk)!.count += 1;
      if (!map.has(tk))
        map.set(tk, {
          x: r.to.x,
          y: r.to.y,
          label: shortCity(r.item.toCity || r.item.toProvince),
          side: "to",
          count: 1,
        });
      else map.get(tk)!.count += 1;
    }
    return Array.from(map.values());
  }, [routes]);

  const hovered = hoverId ? routes.find((r) => r.item.id === hoverId)?.item ?? null : null;

  return (
    <div className="relative">
      <svg
        viewBox="0 0 1000 600"
        className="w-full h-auto block select-none"
        role="img"
        aria-label="侨批地图：南洋寄出地与侨乡之间的路径"
      >
        <defs>
          <linearGradient id="qm-ocean" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ecdfbf" />
            <stop offset="100%" stopColor="#d8c896" />
          </linearGradient>
          <filter id="qm-noise">
            <feTurbulence baseFrequency="0.03" numOctaves="2" />
            <feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.22  0 0 0 0 0.1  0 0 0 0.35 0" />
          </filter>
        </defs>

        {/* 海面 */}
        <rect width="1000" height="600" fill="url(#qm-ocean)" />
        <rect width="1000" height="600" filter="url(#qm-noise)" opacity="0.35" />

        {/* 经纬度参考线（细，淡淡的） */}
        <g stroke="#5c4631" strokeWidth="0.4" opacity="0.18" strokeDasharray="2 5">
          {[150, 300, 450].map((y) => (
            <line key={y} x1="0" y1={y} x2="1000" y2={y} />
          ))}
          {[250, 500, 750].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="600" />
          ))}
        </g>

        {/* 陆地 */}
        <g fill="#d4c08e" stroke="#5c4631" strokeWidth="1.1" opacity="0.85">
          {/* 中国东南沿海 */}
          <path d="M 600 0 C 680 30, 760 55, 850 65 C 920 72, 970 95, 1000 130 L 1000 0 Z" />
          {/* 海南岛 */}
          <path d="M 540 178 C 565 172, 600 180, 615 195 C 625 215, 605 235, 575 232 C 552 222, 538 198, 540 178 Z" />
          {/* 中南半岛 */}
          <path d="M 200 30 C 180 110, 200 200, 245 280 C 285 335, 350 360, 410 345 C 450 325, 465 285, 455 230 C 445 170, 380 60, 240 30 L 200 30 Z" />
          {/* 马来半岛 */}
          <path d="M 380 350 C 350 410, 320 450, 282 470 C 245 482, 210 462, 210 432 C 210 392, 258 362, 322 355 C 360 350, 380 350, 380 350 Z" />
          {/* 苏门答腊 */}
          <path d="M 70 410 C 50 470, 90 525, 160 535 C 220 540, 280 515, 290 480 C 295 448, 260 418, 200 410 C 140 405, 80 405, 70 410 Z" />
          {/* 爪哇 */}
          <path d="M 320 560 C 400 552, 500 558, 600 562 C 660 565, 700 562, 730 565 L 730 600 L 280 600 Z" />
          {/* 婆罗洲 */}
          <path d="M 510 360 C 490 410, 510 462, 570 485 C 632 495, 690 472, 712 432 C 728 392, 700 360, 630 350 C 568 346, 520 352, 510 360 Z" />
          {/* 菲律宾吕宋 */}
          <path d="M 762 230 C 740 290, 762 350, 800 372 C 842 380, 870 350, 870 300 C 870 258, 842 222, 800 222 C 782 222, 768 226, 762 230 Z" />
          {/* 菲律宾米沙鄢/棉兰老（简化） */}
          <path d="M 810 410 C 800 440, 820 470, 855 472 C 880 470, 890 445, 880 420 C 868 400, 832 398, 810 410 Z" />
        </g>

        {/* 弧线（路径） */}
        {routes.map((r, i) => {
          const active = hoverId === r.item.id;
          const dim = hoverId && !active;
          return (
            <motion.path
              key={r.item.id}
              d={r.path}
              fill="none"
              stroke={active ? "#8b2c2c" : "#3a2818"}
              strokeWidth={active ? 2.6 : 1.4}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: dim ? 0.18 : active ? 0.95 : 0.6,
              }}
              transition={{
                pathLength: { duration: 2.0, delay: 0.2 + i * 0.12, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.4 },
              }}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHoverId(r.item.id)}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => router.push(`/archive/${r.item.id}`)}
            />
          );
        })}

        {/* 端点 */}
        {points.map((p) => {
          const isFrom = p.side === "from";
          const fillColor = isFrom ? "#8b2c2c" : "#2a1c10";
          return (
            <g key={`${p.x},${p.y}`}>
              {/* 外圈淡光 */}
              <circle
                cx={p.x}
                cy={p.y}
                r={p.count > 1 ? 12 : 9}
                fill="none"
                stroke={fillColor}
                strokeWidth="1"
                opacity="0.35"
              />
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={p.count > 1 ? 5 : 4}
                fill={fillColor}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.15 + Math.random() * 0.6 }}
              />
              <text
                x={p.x + (isFrom ? -10 : 10)}
                y={p.y + 4}
                fontSize="12"
                fontFamily="serif"
                fill="#2a1c10"
                textAnchor={isFrom ? "end" : "start"}
                fontWeight="600"
              >
                {p.label}
                {p.count > 1 && (
                  <tspan dx="4" fontSize="10" fill="#5c4631" fontWeight="400">
                    × {p.count}
                  </tspan>
                )}
              </text>
            </g>
          );
        })}

        {/* 罗盘 */}
        <g transform="translate(940, 540)" stroke="#3a2818" fill="none" strokeWidth="1.1">
          <circle r="28" />
          <circle r="22" strokeDasharray="2 3" />
          <path d="M 0 -22 L 3.5 0 L 0 22 L -3.5 0 Z" fill="#8b2c2c" />
          <text y="-32" textAnchor="middle" fontSize="11" fill="#3a2818" fontFamily="serif">
            N
          </text>
        </g>

        {/* 图例 */}
        <g transform="translate(20, 540)" fontFamily="serif" fontSize="12" fill="#3a2818">
          <g>
            <circle cx="0" cy="0" r="4" fill="#8b2c2c" />
            <text x="10" y="4">寄 出 地</text>
          </g>
          <g transform="translate(100, 0)">
            <circle cx="0" cy="0" r="4" fill="#2a1c10" />
            <text x="10" y="4">收 批 地</text>
          </g>
          <g transform="translate(200, 0)">
            <line x1="-6" y1="0" x2="14" y2="0" stroke="#3a2818" strokeWidth="1.4" />
            <text x="22" y="4">侨 批 一 件</text>
          </g>
        </g>
      </svg>

      {/* 悬浮卡片：使用条目时显示 */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="pointer-events-none absolute top-3 left-3 sm:top-6 sm:left-6 max-w-[280px] sm:max-w-sm bg-paper-100/95 border border-ink-400/40 shadow-[0_18px_40px_-20px_rgba(40,25,10,0.5)] px-4 py-4 sm:px-5 sm:py-5"
        >
          <div className="text-seal-500 text-xs tracking-widest font-serif mb-1">
            · {hovered.year} · {hovered.themes[0]} ·
          </div>
          <h4 className="font-serif text-ink-500 text-base sm:text-lg leading-snug mb-2 tracking-wider">
            {hovered.title}
          </h4>
          <div className="text-ink-400 text-xs sm:text-[13px] leading-loose">
            <div>寄自 · {hovered.fromCountry} {hovered.fromCity}</div>
            <div>寄往 · {hovered.toProvince} {hovered.toCity}</div>
          </div>
          <div className="mt-3 text-ink-300 text-[11px] tracking-wider font-serif">
            点击线条 → 查看原件
          </div>
        </motion.div>
      )}
    </div>
  );
}
