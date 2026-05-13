// 拍一张线上的首页（含底部 made by charlielam）
import puppeteer from "puppeteer-core";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const URL = "https://qiaopi-letters.vercel.app/";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(URL, { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 1500));

// 滚到底部触发动画
const h = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < h; y += 500) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);
  await new Promise((r) => setTimeout(r, 400));
}
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await new Promise((r) => setTimeout(r, 1200));

await page.screenshot({ path: "./.screenshots/13-live-home.png", fullPage: true });

// 单独拍一张 footer 局部
await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
await new Promise((r) => setTimeout(r, 800));
const footer = await page.$("footer");
if (footer) {
  await footer.screenshot({ path: "./.screenshots/14-live-footer.png" });
}

await browser.close();
console.log("done");
