// 用 puppeteer 把一个 SVG 渲染成 PWA 需要的几种 PNG。
//   icon-192.png        Android 主屏图标
//   icon-512.png        启动画面 / 应用商店
//   icon-maskable.png    Android 自适应图标（安全区内）
//   apple-touch-icon.png iOS 主屏图标（180×180）
//   favicon-32.png       浏览器标签页
//
// 设计：暗红朱印底 + 米黄"侨批"二字。直接对应网站的红印章美学。

import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = path.resolve("./public/icons");
fs.mkdirSync(OUT, { recursive: true });

// "侨批" 主图标（占满整个画布；用于 favicon、apple-touch-icon、安卓常规图标）
const FULL_SVG = (size) => `<!DOCTYPE html><html><head><style>
  html,body{margin:0;padding:0;background:transparent}
</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
  <defs>
    <filter id="sealEdge"><feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="2.5"/></filter>
    <filter id="sealInk"><feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="1" seed="7"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.2 1.1"/><feComposite in2="SourceGraphic" operator="in"/></filter>
  </defs>
  <!-- 米黄底（让"侨批"两字浮在纸面上的感觉）-->
  <rect width="100" height="100" fill="#ecdfbf"/>
  <!-- 红印章 -->
  <g filter="url(#sealEdge)">
    <rect x="10" y="10" width="80" height="80" rx="2" fill="none" stroke="#8b2c2c" stroke-width="3.5"/>
    <rect x="14" y="14" width="72" height="72" fill="#8b2c2c"/>
  </g>
  <!-- 侨 批 二字 -->
  <text x="34" y="58" text-anchor="middle" dominant-baseline="middle" font-size="36" font-family="serif" font-weight="700" fill="#f5ecd7">侨</text>
  <text x="66" y="58" text-anchor="middle" dominant-baseline="middle" font-size="36" font-family="serif" font-weight="700" fill="#f5ecd7">批</text>
  <!-- 不均匀的盖印纹理 -->
  <rect width="100" height="100" filter="url(#sealInk)" opacity="0.5"/>
</svg>
</body></html>`;

// "maskable" 版：图章缩到 safe area（68%）内，外圈是米黄
const MASKABLE_SVG = (size) => `<!DOCTYPE html><html><head><style>
  html,body{margin:0;padding:0;background:transparent}
</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
  <defs>
    <filter id="sealEdge2"><feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="2"/></filter>
    <filter id="sealInk2"><feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="1" seed="7"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.2 1.1"/><feComposite in2="SourceGraphic" operator="in"/></filter>
  </defs>
  <!-- 米黄整面背景（占满 maskable safe area 外） -->
  <rect width="100" height="100" fill="#ecdfbf"/>
  <!-- 印章缩到中心 60×60，留 20px padding（安卓 maskable 推荐 80% 安全区） -->
  <g transform="translate(20,20)" filter="url(#sealEdge2)">
    <rect x="0" y="0" width="60" height="60" rx="1.5" fill="none" stroke="#8b2c2c" stroke-width="2.6"/>
    <rect x="3" y="3" width="54" height="54" fill="#8b2c2c"/>
  </g>
  <text x="38" y="49" text-anchor="middle" dominant-baseline="middle" font-size="22" font-family="serif" font-weight="700" fill="#f5ecd7">侨</text>
  <text x="62" y="49" text-anchor="middle" dominant-baseline="middle" font-size="22" font-family="serif" font-weight="700" fill="#f5ecd7">批</text>
  <rect x="20" y="20" width="60" height="60" filter="url(#sealInk2)" opacity="0.5"/>
</svg>
</body></html>`;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox"],
});

async function render(html, size, file) {
  const page = await browser.newPage();
  await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
  await page.setContent(html(size), { waitUntil: "networkidle0" });
  const out = path.join(OUT, file);
  await page.screenshot({
    path: out,
    type: "png",
    omitBackground: false,
    clip: { x: 0, y: 0, width: size, height: size },
  });
  console.log(`  ${file}  (${size}×${size}, ${(fs.statSync(out).size / 1024).toFixed(1)} KB)`);
  await page.close();
}

await render(FULL_SVG, 192, "icon-192.png");
await render(FULL_SVG, 512, "icon-512.png");
await render(FULL_SVG, 180, "apple-touch-icon.png");
await render(FULL_SVG, 32, "favicon-32.png");
await render(MASKABLE_SVG, 192, "icon-maskable-192.png");
await render(MASKABLE_SVG, 512, "icon-maskable-512.png");

await browser.close();
console.log("done");
