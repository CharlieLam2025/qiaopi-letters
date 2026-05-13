import puppeteer from "puppeteer-core";
import path from "node:path";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = "https://qiaopi-letters.vercel.app";

const pages = [
  { url: "/", file: "20-live-home.png" },
  { url: "/museum", file: "21-live-museum.png" },
  { url: "/archive", file: "22-live-archive.png" },
  { url: "/wall", file: "23-live-wall.png" },
  { url: "/write", file: "24-live-write.png" },
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox"],
});

for (const p of pages) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(BASE + p.url, { waitUntil: "networkidle0", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1500));
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 500) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);
    await new Promise((r) => setTimeout(r, 300));
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await new Promise((r) => setTimeout(r, 1200));
  const out = path.resolve("./.screenshots/" + p.file);
  await page.screenshot({ path: out, fullPage: true });
  console.log("  " + p.file);
  await page.close();
}

await browser.close();
