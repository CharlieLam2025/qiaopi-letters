// 客户端用：把"挂上侨批墙"和"读取墙上的信"都封到一个地方。
// 优先走 /api/wall/letters（服务端 Supabase）。
// 失败 / 未配置时安全回退到 localStorage —— 这样即使没接 Supabase，
// 用户也能看到自己写过的信 + 6 封 mock。

import { saveLetter, loadLetters } from "./storage";
import { MOCK_LETTERS } from "./mockData";
import type { Letter, LetterTheme } from "./types";

interface SubmitResult {
  ok: boolean;
  letter?: Letter;
  source: "server" | "local";
  message?: string;
}

/**
 * 提交一封信到公开侨批墙。
 * 服务端配好 Supabase 时存数据库；否则回退到 localStorage（仅本人可见）。
 */
export async function submitPublicLetter(letter: Letter): Promise<SubmitResult> {
  try {
    const resp = await fetch("/api/wall/letters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: letter.to,
        from: letter.from,
        destination: letter.destination,
        body: letter.body,
        signature: letter.signature,
        tone: letter.tone,
        theme: letter.theme,
      }),
    });
    const data = await resp.json().catch(() => null);

    if (resp.ok && data?.ok && data.letter) {
      // 同时写一份到 localStorage，让用户在自己的"侨批墙"上能看到自己刚发的（即使墙缓存还没刷新）
      saveLetter(data.letter as Letter);
      return { ok: true, letter: data.letter as Letter, source: "server" };
    }

    // 服务端拒绝（rate limit、未配置等）—— 回退到本地保存
    saveLetter(letter);
    return {
      ok: true,
      letter,
      source: "local",
      message: data?.error || "已保存在你的浏览器（服务端暂未启用云端存储）。",
    };
  } catch (e: unknown) {
    // 网络失败 —— 也回退到本地
    saveLetter(letter);
    return {
      ok: true,
      letter,
      source: "local",
      message: "暂时连不上服务器，已先保存在你的浏览器。",
    };
  }
}

/**
 * 读取侨批墙：
 *  - 先 GET /api/wall/letters（服务端列表）
 *  - 失败 / 未配置时，返回 localStorage + mock
 *  - 服务端成功时也合并本地（让用户自己的最近草稿不会丢）
 */
export async function loadPublicLetters(opts?: {
  theme?: LetterTheme;
  limit?: number;
}): Promise<{ letters: Letter[]; serverConfigured: boolean }> {
  const params = new URLSearchParams();
  if (opts?.theme) params.set("theme", opts.theme);
  if (opts?.limit) params.set("limit", String(opts.limit));

  let server: Letter[] = [];
  let serverConfigured = false;
  try {
    const resp = await fetch(`/api/wall/letters?${params.toString()}`, {
      cache: "no-store",
    });
    if (resp.ok) {
      const data = await resp.json();
      serverConfigured = !!data?.configured;
      if (Array.isArray(data?.letters)) server = data.letters as Letter[];
    }
  } catch {
    // 静默失败 → 用本地
  }

  // 本地 + mock：永远拼在后面
  const local = loadLetters().filter((l) => l.isPublic);
  const mocks = MOCK_LETTERS;

  // 去重：服务端有的，本地副本不重复
  const seen = new Set(server.map((l) => l.id));
  const merged: Letter[] = [
    ...server,
    ...local.filter((l) => !seen.has(l.id)),
    ...mocks.filter((l) => !seen.has(l.id)),
  ];

  return { letters: merged, serverConfigured };
}
