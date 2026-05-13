// 用 SVG 字符串模拟一封旧侨批的视觉（信封正背面 / 内信 / 汇款凭证）。
// 全部为占位图：纸张纹理、邮戳、印章、竖排文字都是程序生成，不引用任何真实档案。
// 后续要接 Supabase Storage / R2 时，只需在 QiaopiItem.images[i].url 写入真实 URL，
// archiveStore + 组件层会自动优先使用真实图片。

import type { ArchiveImageKind, QiaopiItem } from "./archiveTypes";

// ---------- 工具 ----------

function rng(seed: string): () => number {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  return () => {
    s = (s * 1103515245 + 12345) >>> 0;
    return (s >>> 0) / 0x100000000;
  };
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function shortCity(s: string): string {
  return s.replace(/[省市县区府]/g, "").trim().slice(0, 4) || "侨乡";
}

// 把 item.year（如 "1928"）+ id 派生出一个稳定的邮戳日期文本
function postmarkDate(item: QiaopiItem): string {
  const y = item.year.match(/\d{4}/)?.[0] ?? "";
  const seed = rng(item.id + ":date");
  const m = pad2(1 + Math.floor(seed() * 12));
  const d = pad2(1 + Math.floor(seed() * 28));
  return `${y}.${m}.${d}`;
}

// ---------- SVG 片段 ----------

function defsBlock(): string {
  return `<defs>
    <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f3e8ce"/>
      <stop offset="50%" stop-color="#ecdfbf"/>
      <stop offset="100%" stop-color="#e0d2a8"/>
    </linearGradient>
    <filter id="paperNoise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.12  0 0 0 0.45 0"/></filter>
    <filter id="sealEdge"><feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="2.5"/></filter>
    <filter id="sealInk"><feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="1" seed="7"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.2 1.1"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    <radialGradient id="stain"><stop offset="0%" stop-color="#967450" stop-opacity="0.28"/><stop offset="100%" stop-color="#967450" stop-opacity="0"/></radialGradient>
    <radialGradient id="wormhole"><stop offset="0%" stop-color="#1a1208" stop-opacity="0.78"/><stop offset="55%" stop-color="#3a2818" stop-opacity="0.35"/><stop offset="100%" stop-color="#3a2818" stop-opacity="0"/></radialGradient>
    <linearGradient id="stampInk" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a4a6a"/>
      <stop offset="100%" stop-color="#0a3550"/>
    </linearGradient>
    <linearGradient id="stampInkRed" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#a4322a"/>
      <stop offset="100%" stop-color="#7a2018"/>
    </linearGradient>
  </defs>`;
}

// ── 邮票 ─────────────────────────────────────────────────
// 用国家代码画一张时代邮票（齿孔 + 内框 + 国名 + 面值）。
// 没有具体复刻任何真实邮票图案，只走"看一眼像那个年代邮票"的程度。
function postageStamp(
  x: number,
  y: number,
  country: string,
  year: string,
  rand: () => number,
  rotate = -3
): string {
  // 国别 → 邮票"国名"
  const COUNTRY_NAME: Record<string, string> = {
    新加坡: "海峡邮票",
    海峡殖民地: "STRAITS",
    马来亚: "马来亚",
    暹罗: "SIAM",
    泰国: "SIAM",
    越南: "INDO-CHINE",
    印度尼西亚: "荷属东印",
    荷属东印度: "荷属东印",
    印尼: "荷属东印",
    缅甸: "BURMA",
    菲律宾: "FILIPINAS",
    香港: "香港邮政",
    美国: "U.S.A.",
  };
  let name = "POST";
  for (const k of Object.keys(COUNTRY_NAME)) {
    if (country.includes(k)) {
      name = COUNTRY_NAME[k];
      break;
    }
  }
  const stampW = 70;
  const stampH = 86;
  const colorRed = rand() > 0.5;
  const fill = colorRed ? "url(#stampInkRed)" : "url(#stampInk)";
  const denom = ["1¢", "2¢", "3¢", "5¢", "10¢", "壹分", "贰分"][Math.floor(rand() * 7)];

  // 齿孔（每条边小圆点）
  let perfs = "";
  const perfStep = 7;
  const perfR = 2.2;
  // 上下
  for (let i = perfStep; i < stampW; i += perfStep) {
    perfs += `<circle cx="${i}" cy="0" r="${perfR}" fill="#ecdfbf"/>`;
    perfs += `<circle cx="${i}" cy="${stampH}" r="${perfR}" fill="#ecdfbf"/>`;
  }
  for (let i = perfStep; i < stampH; i += perfStep) {
    perfs += `<circle cx="0" cy="${i}" r="${perfR}" fill="#ecdfbf"/>`;
    perfs += `<circle cx="${stampW}" cy="${i}" r="${perfR}" fill="#ecdfbf"/>`;
  }

  return `<g transform="translate(${x},${y}) rotate(${rotate})">
    <!-- 背板（白底带轻微氧化）-->
    <rect width="${stampW}" height="${stampH}" fill="#f5ecd7" stroke="#5c4631" stroke-width="0.8" opacity="0.95"/>
    ${perfs}
    <!-- 内框（彩色印花区）-->
    <rect x="6" y="8" width="${stampW - 12}" height="${stampH - 16}" fill="${fill}" opacity="0.92"/>
    <!-- 国名 -->
    <text x="${stampW / 2}" y="20" text-anchor="middle" font-family="serif" font-size="6.5" font-weight="700" fill="#f5ecd7" letter-spacing="0.5">${esc(name)}</text>
    <!-- 中央图：抽象侧面像（用两个椭圆叠加成轮廓）-->
    <g transform="translate(${stampW / 2}, ${stampH / 2 + 4})" fill="#f5ecd7" opacity="0.85">
      <ellipse cx="0" cy="0" rx="14" ry="18"/>
      <ellipse cx="-2" cy="-2" rx="10" ry="14" fill="${fill}" opacity="0.7"/>
      <circle cx="0" cy="-8" r="6"/>
    </g>
    <!-- 面值 -->
    <text x="${stampW / 2}" y="${stampH - 8}" text-anchor="middle" font-family="serif" font-size="10" font-weight="700" fill="#f5ecd7">${esc(denom)}</text>
    <!-- 邮票上的 cancellation —— 一条划过去的弧线 -->
    <path d="M -4 ${stampH * 0.3} Q ${stampW / 2} ${stampH * 0.45} ${stampW + 4} ${stampH * 0.65}" fill="none" stroke="#1a1208" stroke-width="1.3" opacity="0.55"/>
  </g>`;
}

// ── 红条标 ────────────────────────────────────────────────
// 真侨批信封正面常贴一条红色长条，写"X 元正"、批局名等。
function redStrip(
  x: number,
  y: number,
  amount: string,
  currency: string,
  office: string,
  rotate = 2
): string {
  const text = amount
    ? `${amount} ${currency || ""} 正`
    : "批　款";
  return `<g transform="translate(${x},${y}) rotate(${rotate})">
    <!-- 红色长条（轻微歪斜，模拟手贴）-->
    <rect width="180" height="32" fill="#8b2c2c" opacity="0.92" stroke="#5a1818" stroke-width="0.6"/>
    <rect width="180" height="32" filter="url(#sealInk)" opacity="0.32"/>
    <!-- 主文字：白色（实际为浅黄）烫字 -->
    <text x="14" y="22" font-family="serif" font-size="17" font-weight="700" fill="#f5ecd7" letter-spacing="2">${esc(text)}</text>
    <!-- 右侧批局短缩写 -->
    <text x="174" y="22" text-anchor="end" font-family="serif" font-size="10" fill="#f5ecd7" opacity="0.85">${esc(office.slice(0, 6))}</text>
  </g>`;
}

// ── 多重盖戳 ──────────────────────────────────────────────
// 真侨批常有 2-3 个戳记互相覆盖：发件地戳、批局戳、抵达戳
function tripleCancel(
  centerX: number,
  centerY: number,
  fromCity: string,
  arrivalCity: string,
  date: string,
  rand: () => number
): string {
  let s = "";
  // 主邮戳（发件地）
  s += `<g transform="translate(${centerX},${centerY}) rotate(${(-5 + rand() * 10).toFixed(0)})">${postmarkInner(fromCity, date)}</g>`;
  // 抵达戳（错位 + 旋转）
  const ox = 22 + rand() * 14;
  const oy = 18 + rand() * 12;
  s += `<g transform="translate(${centerX + ox},${centerY + oy}) rotate(${(15 + rand() * 18).toFixed(0)}) scale(0.85)" opacity="0.7">${postmarkInner(arrivalCity, date)}</g>`;
  return s;
}

// 把原 postmark() 的 svg 内容（不含外层 g/rotate）抽出来，方便嵌入
function postmarkInner(city: string, date: string): string {
  const chars = city.split("");
  const radius = 38;
  const startA = -Math.PI * 0.85;
  const endA = -Math.PI * 0.15;
  const step = chars.length > 1 ? (endA - startA) / (chars.length - 1) : 0;
  let texts = "";
  chars.forEach((c, i) => {
    const a = startA + step * i;
    const tx = 50 + radius * Math.cos(a);
    const ty = 50 + radius * Math.sin(a);
    const rot = (a * 180) / Math.PI + 90;
    texts += `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" transform="rotate(${rot.toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)})" font-family="serif" font-size="9" font-weight="600" fill="#3a2818">${esc(c)}</text>`;
  });
  return `<g filter="url(#sealEdge)" stroke="#3a2818" fill="none" stroke-width="2.2">
    <circle cx="50" cy="50" r="44"/>
    <circle cx="50" cy="50" r="38"/>
    <line x1="14" y1="50" x2="86" y2="50" stroke-width="1.5" stroke-dasharray="2 2"/>
  </g>${texts}
  <text x="50" y="68" text-anchor="middle" font-family="serif" font-size="8.5" font-weight="600" fill="#3a2818">${esc(date)}</text>
  <rect width="100" height="100" filter="url(#sealInk)" opacity="0.35"/>`;
}

// ── 虫蛀 + 边缘破损 ────────────────────────────────────────
function decay(W: number, H: number, rand: () => number): string {
  let s = "";
  // 2-3 个虫蛀小洞
  const holes = 2 + Math.floor(rand() * 2);
  for (let i = 0; i < holes; i++) {
    const cx = 40 + rand() * (W - 80);
    const cy = 40 + rand() * (H - 80);
    const r = 4 + rand() * 5;
    s += `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${r.toFixed(1)}" fill="url(#wormhole)"/>`;
  }
  // 边缘暗块：四条边各 1-2 个
  const edges = [
    { x: rand() * W * 0.6, y: 0, w: 30 + rand() * 30, h: 3 + rand() * 4 },
    { x: W - 30 - rand() * 30, y: H - 5, w: 30 + rand() * 30, h: 3 + rand() * 4 },
    { x: 0, y: rand() * H * 0.6, w: 3 + rand() * 4, h: 30 + rand() * 30 },
    { x: W - 5, y: H - 60 - rand() * 50, w: 3 + rand() * 4, h: 30 + rand() * 30 },
  ];
  for (const e of edges) {
    s += `<rect x="${e.x.toFixed(0)}" y="${e.y.toFixed(0)}" width="${e.w.toFixed(0)}" height="${e.h.toFixed(0)}" fill="#2a1c10" opacity="0.18"/>`;
  }
  return s;
}

function paperBg(w: number, h: number, rand: () => number): string {
  const stains: string[] = [];
  const n = 3 + Math.floor(rand() * 3);
  for (let i = 0; i < n; i++) {
    const cx = rand() * w;
    const cy = rand() * h;
    const rx = 40 + rand() * 70;
    const ry = 30 + rand() * 60;
    stains.push(
      `<ellipse cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" rx="${rx.toFixed(0)}" ry="${ry.toFixed(0)}" fill="url(#stain)"/>`
    );
  }
  // 折痕：横纵各一道
  const foldY = h * (0.32 + rand() * 0.06);
  const foldX = w * (0.48 + rand() * 0.04);
  return (
    `<rect width="${w}" height="${h}" fill="url(#paper)"/>` +
    `<rect width="${w}" height="${h}" filter="url(#paperNoise)" opacity="0.22"/>` +
    stains.join("") +
    `<line x1="0" y1="${foldY.toFixed(0)}" x2="${w}" y2="${foldY.toFixed(0)}" stroke="#5c4631" stroke-width="0.6" opacity="0.25"/>` +
    `<line x1="${foldX.toFixed(0)}" y1="0" x2="${foldX.toFixed(0)}" y2="${h}" stroke="#5c4631" stroke-width="0.6" opacity="0.18"/>` +
    `<rect x="2" y="2" width="${w - 4}" height="${h - 4}" fill="none" stroke="#5c4631" stroke-width="2" opacity="0.4"/>`
  );
}

function postmark(x: number, y: number, city: string, date: string, rotate = 12): string {
  const chars = city.split("");
  const radius = 38;
  const startA = -Math.PI * 0.85;
  const endA = -Math.PI * 0.15;
  const step = chars.length > 1 ? (endA - startA) / (chars.length - 1) : 0;
  let texts = "";
  chars.forEach((c, i) => {
    const a = startA + step * i;
    const tx = 50 + radius * Math.cos(a);
    const ty = 50 + radius * Math.sin(a);
    const rot = (a * 180) / Math.PI + 90;
    texts += `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" transform="rotate(${rot.toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)})" font-family="serif" font-size="9" font-weight="600" fill="#3a2818">${esc(c)}</text>`;
  });
  return `<g transform="translate(${x},${y}) rotate(${rotate})">
    <g filter="url(#sealEdge)" stroke="#3a2818" fill="none" stroke-width="2.2">
      <circle cx="50" cy="50" r="44"/>
      <circle cx="50" cy="50" r="38"/>
      <line x1="14" y1="50" x2="86" y2="50" stroke-width="1.5" stroke-dasharray="2 2"/>
    </g>
    ${texts}
    <text x="50" y="68" text-anchor="middle" font-family="serif" font-size="8.5" font-weight="600" fill="#3a2818">${esc(date)}</text>
    <rect width="100" height="100" filter="url(#sealInk)" opacity="0.35"/>
  </g>`;
}

function redSeal(x: number, y: number, size: number, text: string, rotate = -6): string {
  const chars = text.split("");
  const isFour = chars.length === 4;
  let textsSvg = "";
  if (isFour) {
    const pos = [
      { x: 32, y: 44 },
      { x: 68, y: 44 },
      { x: 32, y: 74 },
      { x: 68, y: 74 },
    ];
    chars.forEach((c, i) => {
      textsSvg += `<text x="${pos[i].x}" y="${pos[i].y}" text-anchor="middle" dominant-baseline="middle" font-size="26" font-family="serif" font-weight="700" fill="#f5ecd7">${esc(c)}</text>`;
    });
  } else {
    chars.forEach((c, i) => {
      const cy = chars.length === 1 ? 60 : 32 + i * 36;
      const fs = chars.length === 1 ? 56 : 36;
      textsSvg += `<text x="50" y="${cy}" text-anchor="middle" dominant-baseline="middle" font-size="${fs}" font-family="serif" font-weight="700" fill="#f5ecd7">${esc(c)}</text>`;
    });
  }
  const scale = size / 100;
  return `<g transform="translate(${x},${y}) rotate(${rotate}) scale(${scale})">
    <g filter="url(#sealEdge)">
      <rect x="6" y="6" width="88" height="88" rx="2" fill="none" stroke="#8b2c2c" stroke-width="3.5"/>
      <rect x="10" y="10" width="80" height="80" fill="#8b2c2c" opacity="0.95"/>
    </g>
    ${textsSvg}
    <rect width="100" height="100" filter="url(#sealInk)" opacity="0.5"/>
  </g>`;
}

// 竖排中文：右起逐列
function verticalText(
  text: string,
  startX: number,
  topY: number,
  bottomLimit: number,
  leftLimit: number,
  fontSize = 22,
  lineHeight = 30,
  rand?: () => number
): string {
  const lines = text.split("\n").map((l) => l.replace(/\s/g, "")).filter(Boolean);
  const colWidth = fontSize + 12;
  let svg = "";
  let curX = startX;
  for (const line of lines) {
    if (curX < leftLimit) break;
    let y = topY;
    for (const c of line) {
      if (y > bottomLimit) break;
      const ox = rand ? (rand() - 0.5) * 2 : 0;
      const oy = rand ? (rand() - 0.5) * 2 : 0;
      const op = rand ? 0.78 + rand() * 0.2 : 0.92;
      svg += `<text x="${(curX + ox).toFixed(1)}" y="${(y + oy).toFixed(1)}" text-anchor="middle" font-family="serif" font-size="${fontSize}" fill="#1a1208" opacity="${op.toFixed(2)}">${esc(c)}</text>`;
      y += lineHeight;
    }
    curX -= colWidth;
  }
  return svg;
}

// ---------- 主入口 ----------

export interface BuildOpts {
  width?: number;
  height?: number;
  thumbnail?: boolean;
}

export function buildQiaopiSvg(
  item: QiaopiItem,
  kind: ArchiveImageKind,
  opts: BuildOpts = {}
): string {
  const W = opts.width ?? 800;
  const H = opts.height ?? 1100;
  const thumb = opts.thumbnail ?? false;
  const rand = rng(item.id + ":" + kind);

  const city = shortCity(item.fromCity || item.fromCountry);
  const date = postmarkDate(item);

  let body = "";

  if (kind === "letter") {
    body += verticalText(
      item.transcription,
      W - 60,
      90,
      H - 140,
      80,
      thumb ? 18 : 22,
      thumb ? 22 : 30,
      thumb ? undefined : rand
    );
    body += postmark(20, 20, city, date, -8);
    body += redSeal(W - 130, H - 150, 90, "如晤", -6);
    // 落款日期（左下，横排）
    body += `<text x="60" y="${H - 50}" font-family="serif" font-size="${thumb ? 14 : 18}" fill="#3a2818" opacity="0.85">${esc(item.dateText)}</text>`;
    // 虫蛀（thumb 模式不加，太小看不见）
    if (!thumb) body += decay(W, H, rand);
  } else if (kind === "envelope-front") {
    // 主收件地址（竖排，居中偏右）
    body += verticalText(
      `${item.toProvince}${item.toCity}\n${item.toVillage}\n${item.receiver}${item.receiverRelation ? "（" + item.receiverRelation + "）" : ""}收`,
      W - 120,
      150,
      H - 200,
      W * 0.35,
      thumb ? 24 : 32,
      thumb ? 30 : 42
    );
    // 邮票 · 右上角
    body += postageStamp(W - 100, 26, item.fromCountry, item.year, rand, -4);
    // 在邮票下方再叠一个发件邮戳（部分压到邮票上）
    body += `<g transform="translate(${W - 175},${44}) rotate(8) scale(0.95)" opacity="0.85">${postmarkInner(city, date)}</g>`;
    // 抵达戳：盖在地址附近（错位、半透明）
    body += `<g transform="translate(${(W * 0.42).toFixed(0)},${H - 320}) rotate(-12) scale(0.78)" opacity="0.55">${postmarkInner(shortCity(item.toCity), date)}</g>`;
    // 红条标 · 信封中间偏左下
    body += redStrip(W * 0.08, H - 280, item.amount, item.currency, item.qiaopiOffice, -3);
    // 红印 · 左上："侨批"
    body += redSeal(36, 24, 76, "侨批", 8);
    // 左下：寄出人 + 经批局转
    body += `<text x="60" y="${H - 120}" font-family="serif" font-size="${thumb ? 13 : 16}" fill="#3a2818" opacity="0.8">寄自 · ${esc(item.fromCountry + " " + item.fromCity)}</text>`;
    body += `<text x="60" y="${H - 96}" font-family="serif" font-size="${thumb ? 13 : 16}" fill="#3a2818" opacity="0.8">寄批人 · ${esc(item.sender)}</text>`;
    body += `<text x="60" y="${H - 72}" font-family="serif" font-size="${thumb ? 11 : 13}" fill="#3a2818" opacity="0.6">经 ${esc(item.qiaopiOffice)} 转</text>`;
    // 虫蛀 + 边缘破损
    if (!thumb) body += decay(W, H, rand);
  } else if (kind === "envelope-back") {
    // 三角形封口纹路
    const cx = W / 2;
    body += `<polyline points="20,20 ${cx.toFixed(0)},${(H / 2 - 80).toFixed(0)} ${W - 20},20" fill="none" stroke="#5c4631" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.45"/>`;
    // 中部封口红印
    body += redSeal(cx - 45, H / 2 - 45, 90, "封", 12);
    // 寄批人信息 · 底部居中
    body += `<text x="${cx}" y="${H - 220}" text-anchor="middle" font-family="serif" font-size="${thumb ? 16 : 20}" fill="#3a2818" opacity="0.85">寄 批 人</text>`;
    body += `<text x="${cx}" y="${H - 178}" text-anchor="middle" font-family="serif" font-size="${thumb ? 20 : 26}" fill="#1a1208">${esc(item.sender)}</text>`;
    body += `<text x="${cx}" y="${H - 140}" text-anchor="middle" font-family="serif" font-size="${thumb ? 13 : 16}" fill="#3a2818" opacity="0.75">${esc(item.fromCountry + " · " + item.fromCity)}</text>`;
    body += `<text x="${cx}" y="${H - 110}" text-anchor="middle" font-family="serif" font-size="${thumb ? 12 : 14}" fill="#3a2818" opacity="0.6">经 ${esc(item.qiaopiOffice)} 转</text>`;
    if (!thumb) body += decay(W, H, rand);
  } else if (kind === "remittance") {
    // 表单标题
    body += `<text x="${W / 2}" y="100" text-anchor="middle" font-family="serif" font-size="${thumb ? 26 : 34}" font-weight="700" fill="#1a1208" letter-spacing="${thumb ? 6 : 10}">批 款 凭 据</text>`;
    body += `<text x="${W / 2}" y="138" text-anchor="middle" font-family="serif" font-size="${thumb ? 12 : 14}" fill="#5c4631" opacity="0.7">（示例 · 本条目为本站原创占位）</text>`;
    // 表单行
    const rows: [string, string][] = [
      ["收 批 人", `${item.receiver}（${item.receiverRelation}）`],
      ["收 批 地", `${item.toProvince} ${item.toCity} ${item.toVillage}`],
      ["寄 批 人", item.sender],
      ["寄 批 地", `${item.fromCountry} ${item.fromCity}`],
      ["批 　 银", item.amount ? `${item.amount} ${item.currency}` : "（未注明）"],
      ["批 　 局", item.qiaopiOffice],
      ["日 　 期", item.dateText],
    ];
    let ry = 200;
    const labelX = thumb ? 80 : 110;
    const valueX = thumb ? 240 : 320;
    for (const [label, value] of rows) {
      body += `<line x1="80" y1="${ry + 44}" x2="${W - 80}" y2="${ry + 44}" stroke="#5c4631" stroke-width="0.8" opacity="0.45"/>`;
      body += `<text x="${labelX}" y="${ry + 30}" font-family="serif" font-size="${thumb ? 16 : 20}" fill="#3a2818" opacity="0.85">${esc(label)}</text>`;
      body += `<text x="${valueX}" y="${ry + 30}" font-family="serif" font-size="${thumb ? 17 : 22}" fill="#1a1208">${esc(value)}</text>`;
      ry += 64;
    }
    // 收讫红印
    body += redSeal(W - 200, H - 240, 110, "收讫", -8);
    // 角落小批局戳
    body += `<g transform="translate(${W - 280},${180}) rotate(-6) scale(0.5)" opacity="0.6">${postmarkInner(item.qiaopiOffice.slice(0, 4) || "批馆", date)}</g>`;
    if (!thumb) body += decay(W, H, rand);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${defsBlock()}${paperBg(W, H, rand)}${body}</svg>`;
}

// 把 SVG 字符串编为 data URL —— 同时兼容浏览器与 SSR 环境
export function svgToDataUrl(svg: string): string {
  if (typeof window === "undefined") {
    return `data:image/svg+xml;base64,${Buffer.from(svg, "utf-8").toString("base64")}`;
  }
  // 浏览器：UTF-8 → percent-encoded → btoa
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

// 列表/详情统一入口：优先用真实 URL（来自 Supabase Storage 等），
// 检测到 "generated:" 前缀时再回退到 SVG 生成器。
export function resolveImageUrl(
  item: QiaopiItem,
  kind: ArchiveImageKind,
  opts?: BuildOpts
): string {
  const img = item.images.find((i) => i.kind === kind);
  if (img && img.url && !img.url.startsWith("generated:")) {
    return img.url;
  }
  return svgToDataUrl(buildQiaopiSvg(item, kind, opts));
}
