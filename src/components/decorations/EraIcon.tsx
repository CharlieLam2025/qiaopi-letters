"use client";

/**
 * 时代图标：给展馆 Timeline 的每个节点配一个小图。
 *
 * - ship    红头船（1840—1900s 远渡南洋）
 * - bureau  批局（1900—1920s 批局制度成熟）
 * - sail    扬帆（1920—1930s 自由谋生）
 * - flag    抗战义旗（1930s—1945 南侨筹赈）
 * - wartorn 战乱（1940s 沦陷 / 邮路中断）
 *
 * 所有图标都用同一个 viewBox 60x60，方便在 Timeline 节点位置直接替换。
 */

type EraKey = "ship" | "bureau" | "sail" | "flag" | "wartorn";

const PATHS: Record<EraKey, JSX.Element> = {
  // 红头船（小帆船）
  ship: (
    <g>
      <path d="M 12 36 L 48 36 L 44 44 L 16 44 Z" fill="#3a2818" />
      <path d="M 44 36 L 50 33 L 50 41 L 46 43 Z" fill="#8b2c2c" />
      <line x1="30" y1="36" x2="30" y2="16" stroke="#3a2818" strokeWidth="1.5" />
      <path d="M 30 18 L 18 24 L 18 34 L 30 35 Z" fill="#e8dbb6" stroke="#5c4631" strokeWidth="0.6" />
      <path d="M 30 18 L 42 24 L 42 34 L 30 35 Z" fill="#e8dbb6" stroke="#5c4631" strokeWidth="0.6" />
      <path d="M 30 14 L 36 16 L 30 19 Z" fill="#8b2c2c" />
    </g>
  ),
  // 批局印章式房子
  bureau: (
    <g>
      <rect x="14" y="22" width="32" height="22" fill="#e8dbb6" stroke="#3a2818" strokeWidth="1.2" />
      <path d="M 12 22 L 30 12 L 48 22 Z" fill="#3a2818" />
      <rect x="26" y="30" width="8" height="14" fill="#8b2c2c" />
      <line x1="14" y1="44" x2="46" y2="44" stroke="#3a2818" strokeWidth="1.5" />
      <text x="30" y="20" textAnchor="middle" fontSize="6" fill="#f5ecd7" fontFamily="serif" fontWeight="700">批</text>
    </g>
  ),
  // 扬帆（自由远航）
  sail: (
    <g>
      <path d="M 10 42 L 50 42 L 46 48 L 14 48 Z" fill="#3a2818" />
      <line x1="30" y1="42" x2="30" y2="14" stroke="#3a2818" strokeWidth="1.5" />
      <path d="M 30 14 L 16 22 L 16 40 L 30 41 Z" fill="#e8dbb6" stroke="#5c4631" strokeWidth="0.6" />
      <path d="M 30 14 L 44 22 L 44 40 L 30 41 Z" fill="#e8dbb6" stroke="#5c4631" strokeWidth="0.6" />
      <g stroke="#5c4631" strokeWidth="0.4" opacity="0.6">
        <line x1="16" y1="26" x2="44" y2="26" />
        <line x1="16" y1="32" x2="44" y2="32" />
      </g>
    </g>
  ),
  // 抗战旗帜
  flag: (
    <g>
      <line x1="20" y1="12" x2="20" y2="50" stroke="#3a2818" strokeWidth="1.5" />
      <path d="M 20 14 L 46 18 L 46 30 L 20 32 Z" fill="#8b2c2c" stroke="#5c4631" strokeWidth="0.4" />
      <text x="33" y="27" textAnchor="middle" fontSize="8" fill="#f5ecd7" fontFamily="serif" fontWeight="700">国</text>
      <circle cx="20" cy="12" r="2" fill="#3a2818" />
    </g>
  ),
  // 战乱：断裂的信
  wartorn: (
    <g>
      <rect x="14" y="18" width="14" height="22" fill="#e8dbb6" stroke="#3a2818" strokeWidth="1" transform="rotate(-8 21 29)" />
      <rect x="32" y="22" width="14" height="22" fill="#e8dbb6" stroke="#3a2818" strokeWidth="1" transform="rotate(12 39 33)" />
      <path d="M 28 18 L 30 26 L 26 32 L 29 40" stroke="#3a2818" strokeWidth="1.4" fill="none" strokeDasharray="2 2" />
      <circle cx="44" cy="20" r="3" fill="#8b2c2c" opacity="0.85" />
    </g>
  ),
};

interface Props {
  era: EraKey;
  size?: number;
  className?: string;
}

export default function EraIcon({ era, size = 48, className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 60 60"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      {PATHS[era]}
    </svg>
  );
}

export type { EraKey };
