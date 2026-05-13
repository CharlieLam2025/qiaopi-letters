// 用最新视觉拍信封正面（envelope-front）
import puppeteer from "puppeteer-core";
import path from "node:path";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox"],
});

const ids = ["qp-001", "qp-017", "qp-020"];
for (const id of ids) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:3000/archive/${id}`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1500));

  // 切到"信封正面"缩略图
  const switched = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find((b) =>
      /信封正面/.test(b.textContent || "")
    );
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  await new Promise((r) => setTimeout(r, 2500));
  const out = path.resolve(`./.screenshots/12-envelope-${id}.png`);
  await page.screenshot({ path: out, fullPage: true });
  console.log(`  ${out} (switched=${switched})`);
  await page.close();
}

await browser.close();
