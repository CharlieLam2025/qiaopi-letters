import puppeteer from "puppeteer-core";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("https://qiaopi-letters.vercel.app/wall", { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 2000));

// 滚一遍触发动画
const h = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < h; y += 500) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);
  await new Promise((r) => setTimeout(r, 350));
}
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await new Promise((r) => setTimeout(r, 1500));
await page.screenshot({ path: "./.screenshots/15-live-wall.png", fullPage: true });
console.log("done");
await browser.close();
