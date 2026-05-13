// 截图脚本：用本地 Chrome + puppeteer-core，等动画跑完再 fullPage 截
// 用法：node scripts/screenshot.mjs

import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT_DIR = path.resolve("./.screenshots");
fs.mkdirSync(OUT_DIR, { recursive: true });

const PAGES = [
  { url: "http://localhost:3000/",                file: "01-home.png",            vp: { width: 1440, height: 900 } },
  { url: "http://localhost:3000/museum",          file: "02-museum.png",          vp: { width: 1440, height: 900 } },
  { url: "http://localhost:3000/archive",         file: "03-archive.png",         vp: { width: 1440, height: 900 } },
  { url: "http://localhost:3000/archive/qp-001",  file: "04-archive-detail.png",  vp: { width: 1440, height: 900 } },
  { url: "http://localhost:3000/map",             file: "05-map.png",             vp: { width: 1440, height: 900 } },
  { url: "http://localhost:3000/write",           file: "06-write.png",           vp: { width: 1440, height: 900 } },
  { url: "http://localhost:3000/wall",            file: "07-wall.png",            vp: { width: 1440, height: 900 } },
  // 写信带 query 预填（从原件库跳来的状态）
  { url: "http://localhost:3000/write?to=%E6%AF%8D%E4%BA%B2&tone=classical&theme=%E6%83%B3%E5%BF%B5",
    file: "08-write-prefilled.png", vp: { width: 1440, height: 900 } },
  // 404 页（任何不存在的路径）
  { url: "http://localhost:3000/this-route-does-not-exist", file: "10-not-found.png", vp: { width: 1440, height: 900 } },
  // 生成页（需要预先把 pending letter 写进 sessionStorage）
  { url: "http://localhost:3000/generate",        file: "09-generate.png",        vp: { width: 1440, height: 900 },
    preload: {
      "qiaopi:pending:v1": JSON.stringify({
        id: "L_preview01",
        to: "阿嬷",
        from: "北京 朝阳",
        destination: "福建 泉州",
        body: "阿嬷：\n\n好久没回家陪您。\n\n您总说北京冷，让我多穿一件。我知道。\n您塞给我的那条围巾，去年冬天我天天戴着。\n\n等今年农历年，我一定回来。\n您要等我。",
        tone: "gentle",
        theme: "想念",
        isPublic: true,
        createdAt: new Date().toISOString(),
      }),
    },
  },
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});

for (const p of PAGES) {
  const page = await browser.newPage();
  await page.setViewport(p.vp);
  console.log(`→ ${p.url}`);
  try {
    // preload sessionStorage keys before navigation (for /generate)
    if (p.preload) {
      // 先 goto 同源域名一次拿到 sessionStorage 句柄
      await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
      await page.evaluate((kv) => {
        for (const [k, v] of Object.entries(kv)) sessionStorage.setItem(k, v);
      }, p.preload);
    }
    await page.goto(p.url, { waitUntil: "networkidle0", timeout: 60000 });
    // 等 mount 时的入场动画
    await new Promise((r) => setTimeout(r, 1200));
    // 详情页：等 OpenSeadragon 真正把 SVG 渲到 canvas
    if (p.url.includes("/archive/")) {
      try {
        await page.waitForSelector("canvas", { timeout: 8000 });
      } catch {}
      await new Promise((r) => setTimeout(r, 2500));
    }
    // 逐段慢滚一遍，让所有 whileInView (once:true) 元素被 IntersectionObserver 触发
    const height = await page.evaluate(() => document.body.scrollHeight);
    const viewportH = p.vp.height;
    const step = Math.floor(viewportH * 0.6);
    for (let y = 0; y < height; y += step) {
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);
      await new Promise((r) => setTimeout(r, 500));
    }
    // 滚回顶端再等一拍，让最后段稳定
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await new Promise((r) => setTimeout(r, 1200));
    const out = path.join(OUT_DIR, p.file);
    await page.screenshot({ path: out, fullPage: true });
    const sz = fs.statSync(out).size;
    console.log(`  ${p.file} (${(sz / 1024).toFixed(0)} KB)`);
  } catch (e) {
    console.error(`  ERR: ${e.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();
console.log("done");
