// POST /api/compose
// 让"那个年代的人"帮用户润色 / 代写一封侨批。
//
// 接收：{ to, from, destination, body, tone, theme }
// 返回：{ composed: "..." }
//
// 用 DeepSeek（便宜，~$0.0005/次）。加了双层 rate-limit：
//   - 短窗口：60s 内最多 4 次（防按按钮按疯）
//   - 全天：单 IP 最多 30 次

import { NextResponse } from "next/server";
import { callDeepseekChat, isDeepseekConfigured } from "@/lib/deepseekClient";
import { buildComposeMessages } from "@/lib/prompts";
import { check, clientKey } from "@/lib/rateLimit";
import { THEMES, type LetterTheme, type LetterTone } from "@/lib/types";

const TONE_KEYS: LetterTone[] = ["modern", "gentle", "restrained", "classical"];

// 跑在 Edge runtime —— 让 Cloudflare Pages / Vercel Edge 都能跑。
// Cloudflare Workers 不支持 Node.js runtime；Vercel Edge 也兼容。
export const runtime = "edge";
export const dynamic = "force-dynamic";

const MAX_INPUT_CHARS = 800;

export async function POST(req: Request) {
  if (!isDeepseekConfigured()) {
    return NextResponse.json(
      { error: "服务端未配置 DEEPSEEK_API_KEY。" },
      { status: 503 }
    );
  }

  const key = clientKey(req);
  const gate = check(`compose:${key}`, { windowMs: 60_000, max: 4 }, 30);
  if (!gate.ok) {
    return NextResponse.json(
      { error: gate.reason ?? "已达频率上限。" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((gate.retryAfterMs ?? 60_000) / 1000)) } }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "请求格式有误。" }, { status: 400 });
  }

  // 输入校验
  const tone = body?.tone as LetterTone;
  const theme = body?.theme as LetterTheme;
  const userBody = typeof body?.body === "string" ? body.body : "";

  if (!TONE_KEYS.includes(tone)) {
    return NextResponse.json({ error: "tone 不合法。" }, { status: 400 });
  }
  if (!THEMES.includes(theme)) {
    return NextResponse.json({ error: "theme 不合法。" }, { status: 400 });
  }
  if (userBody.length > MAX_INPUT_CHARS) {
    return NextResponse.json(
      { error: `草稿超过 ${MAX_INPUT_CHARS} 字，先精简一下再试。` },
      { status: 400 }
    );
  }

  const input = {
    to: String(body?.to ?? "").slice(0, 40),
    from: String(body?.from ?? "").slice(0, 60),
    destination: String(body?.destination ?? "").slice(0, 60),
    body: userBody,
    tone,
    theme,
  };

  const messages = buildComposeMessages(input);

  try {
    const composed = await callDeepseekChat({
      messages,
      maxTokens: 700,
      // 0.75 比 0.9 更接近 few-shot 范例的笔触，
      // 同时避免 AI 凭空发挥（如自加金额、自加角色）
      temperature: 0.75,
    });
    if (!composed) {
      return NextResponse.json({ error: "AI 返回为空，请重试。" }, { status: 502 });
    }
    return NextResponse.json({ composed });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[/api/compose]", msg);
    return NextResponse.json({ error: "AI 暂时联系不上，稍后再试。" }, { status: 502 });
  }
}
