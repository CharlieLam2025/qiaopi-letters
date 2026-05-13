// 监听 detail 页的 console + network，看 OSD 在做什么
import puppeteer from "puppeteer-core";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

page.on("console", (msg) => {
  console.log(`[${msg.type()}] ${msg.text()}`);
});
page.on("pageerror", (err) => console.log("PAGE ERROR:", err.message));
page.on("requestfailed", (req) => console.log("REQ FAIL:", req.url(), req.failure()?.errorText));

await page.goto("http://localhost:3000/archive/qp-001", { waitUntil: "networkidle0" });
console.log("--- loaded ---");
await new Promise((r) => setTimeout(r, 4000));

// 看 viewer 的内部状态
const state = await page.evaluate(() => {
  const canvases = document.querySelectorAll("canvas");
  const osdCtn = document.querySelector(".openseadragon-container");
  const archiveBox = osdCtn?.parentElement?.parentElement;
  return {
    canvasCount: canvases.length,
    canvasInfo: Array.from(canvases).map((c) => ({
      w: c.width,
      h: c.height,
      cssW: c.style.width,
      cssH: c.style.height,
    })),
    osdContainer: osdCtn ? {
      clientW: osdCtn.clientWidth,
      clientH: osdCtn.clientHeight,
      offsetH: osdCtn.offsetHeight,
    } : null,
    parent: archiveBox ? {
      tag: archiveBox.tagName,
      cls: archiveBox.className,
      clientW: archiveBox.clientWidth,
      clientH: archiveBox.clientHeight,
    } : null,
  };
});
console.log("STATE:", JSON.stringify(state, null, 2));

await browser.close();
