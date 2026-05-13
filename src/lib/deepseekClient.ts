// 只在服务端（API route）调用 —— 千万不要 import 到 "use client" 组件，
// 否则 DEEPSEEK_API_KEY 会被 webpack 打到浏览器里。
//
// DeepSeek 的 HTTP API 兼容 OpenAI Chat Completions schema。
// 这里不依赖 openai sdk，直接用 fetch 保持依赖最小化。

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface DeepseekChatOptions {
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

const DEFAULT_MODEL = "deepseek-chat";

export function isDeepseekConfigured(): boolean {
  return !!process.env.DEEPSEEK_API_KEY;
}

export async function callDeepseekChat(opts: DeepseekChatOptions): Promise<string> {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) throw new Error("DEEPSEEK_API_KEY 未配置");

  const base = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";
  const url = base.replace(/\/$/, "") + "/chat/completions";
  const model = opts.model || process.env.DEEPSEEK_MODEL || DEFAULT_MODEL;

  const ac = new AbortController();
  const timeout = setTimeout(() => ac.abort(), 30_000);

  let resp: Response;
  try {
    resp = await fetch(url, {
      method: "POST",
      signal: ac.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages: opts.messages,
        max_tokens: opts.maxTokens ?? 600,
        temperature: opts.temperature ?? 0.85,
        stream: false,
      }),
    });
  } catch (e: unknown) {
    clearTimeout(timeout);
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`DeepSeek 连接失败：${msg}`);
  }
  clearTimeout(timeout);

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`DeepSeek ${resp.status}：${text.slice(0, 300)}`);
  }

  type ChatResponse = {
    choices?: Array<{ message?: { content?: string } }>;
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };
  const data = (await resp.json()) as ChatResponse;
  const out = data?.choices?.[0]?.message?.content ?? "";
  return out.trim();
}
