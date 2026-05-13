// 端到端演示：填表 → 点 AI 按钮 → 等返回 → 截图带 AI 内容的 /write 页
import puppeteer from "puppeteer-core";
import path from "node:path";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const OUT = path.resolve("./.screenshots/11-write-ai-classical.png");

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

await page.goto(
  "http://localhost:3000/write?to=" + encodeURIComponent("阿嬷") + "&tone=classical&theme=" + encodeURIComponent("想念"),
  { waitUntil: "networkidle0" }
);
await new Promise((r) => setTimeout(r, 1200));

// 填正文（带具体细节的草稿）
await page.evaluate(() => {
  const ta = document.querySelector("textarea");
  if (!ta) return;
  const native = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value").set;
  native.call(ta, "好久没回家陪你。你说北方冷，让我多穿一件，我都记得。等过年，我一定回来。你要等我。");
  ta.dispatchEvent(new Event("input", { bubbles: true }));
});
await new Promise((r) => setTimeout(r, 300));

// 找 "让那个年代的人帮我..." 按钮并点击
const clicked = await page.evaluate(() => {
  const btn = Array.from(document.querySelectorAll("button")).find((b) =>
    /让那个年代的人/.test(b.textContent || "")
  );
  if (btn) {
    btn.click();
    return true;
  }
  return false;
});
console.log("clicked AI button:", clicked);

// 等 DeepSeek 返回并把正文替换（按钮 disabled 状态会消失）
await page.waitForFunction(
  () => {
    const btn = Array.from(document.querySelectorAll("button")).find((b) =>
      /让那个年代的人/.test(b.textContent || "")
    );
    return btn && !btn.disabled;
  },
  { timeout: 30000 }
);
await new Promise((r) => setTimeout(r, 800));

// 截图
await page.screenshot({ path: OUT, fullPage: true });
const body = await page.evaluate(() => document.querySelector("textarea")?.value || "");
console.log("---- composed body ----");
console.log(body);
console.log(`screenshot → ${OUT}`);

await browser.close();
