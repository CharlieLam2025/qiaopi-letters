// Cloudflare Pages 部署的"半自动驾驶"。
// 启动一个 headed Chrome（独立 profile，保留登录态），不会因 waitForFunction 卡死。
// 主循环每 2 秒做一次：刷新当前 URL 状态 + 检查 .deploy-cmd.txt 是否有新指令。

import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PROFILE = path.resolve("./.chrome-cf-profile");
const STATE = path.resolve("./.deploy-state.txt");
const CMD = path.resolve("./.deploy-cmd.txt");

function setState(s) {
  fs.writeFileSync(STATE, `${new Date().toISOString()}  ${s}\n`);
  console.log(`[state] ${s}`);
}

function readCmd() {
  try {
    if (!fs.existsSync(CMD)) return null;
    const s = fs.readFileSync(CMD, "utf-8").trim();
    return s || null;
  } catch {
    return null;
  }
}
function clearCmd() {
  try {
    fs.unlinkSync(CMD);
  } catch {}
}

let browser;
try {
  setState("launching browser…");
  browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: false,
    args: [
      "--no-sandbox",
      "--start-maximized",
      "--no-first-run",
      "--no-default-browser-check",
    ],
    userDataDir: PROFILE,
    defaultViewport: null,
  });
} catch (e) {
  setState(`launch-failed: ${e.message}`);
  process.exit(1);
}

// 浏览器关掉时自动退出脚本
browser.on("disconnected", () => {
  setState("browser-closed-by-user");
  process.exit(0);
});

let page = (await browser.pages())[0];
if (!page) page = await browser.newPage();

try {
  await page.goto("https://dash.cloudflare.com", {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });
} catch (e) {
  setState(`initial-nav-error: ${e.message}`);
}

setState("ready");

// 主循环：观察 URL + 接收外部指令
async function safeUrl() {
  try {
    return await page.evaluate(() => window.location.href);
  } catch {
    return "<unreachable>";
  }
}

async function goto(url) {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    return true;
  } catch (e) {
    setState(`goto-error: ${e.message}`);
    return false;
  }
}

async function click(selector) {
  try {
    await page.waitForSelector(selector, { timeout: 10000 });
    await page.click(selector);
    return true;
  } catch (e) {
    return false;
  }
}

async function fillByLabel(labelText, value) {
  // 找到包含 label 的元素，定位附近的 input
  try {
    return await page.evaluate(
      ({ label, val }) => {
        const labels = Array.from(document.querySelectorAll("label, span, div"));
        const target = labels.find((el) =>
          (el.textContent || "").trim().toLowerCase().includes(label.toLowerCase())
        );
        if (!target) return false;
        let input = target.querySelector("input,textarea");
        if (!input) {
          const parent = target.closest("div");
          if (parent) input = parent.querySelector("input,textarea");
        }
        if (!input) return false;
        const setter = Object.getOwnPropertyDescriptor(
          input.tagName === "TEXTAREA"
            ? HTMLTextAreaElement.prototype
            : HTMLInputElement.prototype,
          "value"
        ).set;
        setter.call(input, val);
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
      },
      { label: labelText, val: value }
    );
  } catch {
    return false;
  }
}

// 通过 .deploy-cmd.txt 接收指令
async function handleCmd(c) {
  setState(`exec: ${c}`);
  const [op, ...args] = c.split(" ");
  if (op === "url") {
    const u = await safeUrl();
    setState(`url=${u}`);
    return;
  }
  if (op === "goto") {
    const u = args.join(" ");
    const ok = await goto(u);
    setState(ok ? `goto-ok: ${u}` : `goto-fail: ${u}`);
    return;
  }
  if (op === "screenshot") {
    const f = args[0] || "./.cf-screenshot.png";
    try {
      await page.screenshot({ path: f, fullPage: false });
      setState(`screenshot: ${f}`);
    } catch (e) {
      setState(`screenshot-err: ${e.message}`);
    }
    return;
  }
  setState(`unknown-cmd: ${c}`);
}

let lastUrl = "";
while (true) {
  // 1. 看是否有指令
  const cmd = readCmd();
  if (cmd) {
    clearCmd();
    await handleCmd(cmd);
  }
  // 2. 报告 URL 变化
  const u = await safeUrl();
  if (u !== lastUrl) {
    setState(`url-change: ${u}`);
    lastUrl = u;
  }
  await new Promise((r) => setTimeout(r, 2000));
}
