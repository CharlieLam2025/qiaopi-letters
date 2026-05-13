// 直接在线上注入一封带 signature 的 pending letter，看 generate 页效果
import puppeteer from "puppeteer-core";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

const pending = {
  id: "L_signtest1",
  to: "阿嬷",
  from: "新加坡 牛车水",
  destination: "厦门 鼓浪屿",
  body: "阿嬷大人膝下\n敬禀者\n孙在叻埠牛车水谋生\n寝食皆安\n勿念\n今寄叻币五十元\n请阿嬷收讫\n鼓浪屿日来天热\n阿嬷多饮凉茶\n午后勿独行\n余惟祈阿嬷珍重\n敬颂福安",
  signature: "孙 敬贤 拜上",
  tone: "classical",
  theme: "想念",
  isPublic: false,
  createdAt: new Date().toISOString(),
};

// 先 goto 同源页让 sessionStorage 可写
await page.goto("https://qiaopi-letters.vercel.app/", { waitUntil: "domcontentloaded" });
await page.evaluate((p) => sessionStorage.setItem("qiaopi:pending:v1", JSON.stringify(p)), pending);
await page.goto("https://qiaopi-letters.vercel.app/generate", { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 2500));

const h = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < h; y += 500) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);
  await new Promise((r) => setTimeout(r, 350));
}
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await new Promise((r) => setTimeout(r, 1500));

await page.screenshot({ path: "./.screenshots/30-live-signature.png", fullPage: true });
console.log("done");
await browser.close();
