// GET  /api/wall/letters?theme=想念&limit=30&offset=0   公开侨批墙读
// POST /api/wall/letters                                 提交一封信
//
// 后端用 Supabase 表 public_letters（schema 在 supabase/schema.sql）。
// 没配 Supabase 时：GET 返回空 [] + ok:false，让前端 fallback 到 localStorage + mock；
//                  POST 返回 503，前端 fallback 到 localStorage。
//
// 严格 rate-limit（防滥用）：
//   POST 短窗口：60s 内最多 1 次；全天 5 次（一个人不该一天发 5 封以上公开信）
//   GET  短窗口：60s 内最多 30 次；全天 5000 次

import { NextResponse } from "next/server";
import { isSupabaseServerConfigured, supabaseServer } from "@/lib/supabaseServer";
import { check, clientKey } from "@/lib/rateLimit";
import { THEMES, type Letter, type LetterTheme, type LetterTone } from "@/lib/types";

const TABLE = "public_letters";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TONE_KEYS: LetterTone[] = ["modern", "gentle", "restrained", "classical"];

// ────────────────────────── GET ──────────────────────────

export async function GET(req: Request) {
  const key = clientKey(req);
  const gate = check(`wallGet:${key}`, { windowMs: 60_000, max: 30 }, 5000);
  if (!gate.ok) {
    return NextResponse.json({ error: gate.reason }, { status: 429 });
  }

  if (!isSupabaseServerConfigured || !supabaseServer) {
    // 没配数据库：让前端走 localStorage + mock
    return NextResponse.json({ ok: false, letters: [], configured: false });
  }

  const url = new URL(req.url);
  const theme = url.searchParams.get("theme") as LetterTheme | null;
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 50) || 50, 100);
  const offset = Math.max(Number(url.searchParams.get("offset") ?? 0) || 0, 0);

  let q = supabaseServer
    .from(TABLE)
    .select("id, to_field, from_field, destination, body, tone, theme, created_at")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (theme && THEMES.includes(theme)) q = q.eq("theme", theme);

  const { data, error } = await q;
  if (error) {
    console.error("[wall GET]", error);
    return NextResponse.json({ ok: false, letters: [], error: error.message });
  }

  const letters: Letter[] = (data ?? []).map((r: any) => ({
    id: r.id,
    to: r.to_field,
    from: r.from_field,
    destination: r.destination,
    body: r.body,
    tone: r.tone,
    theme: r.theme,
    isPublic: true,
    createdAt: r.created_at,
  }));

  return NextResponse.json({ ok: true, letters, configured: true });
}

// ────────────────────────── POST ──────────────────────────

export async function POST(req: Request) {
  const key = clientKey(req);
  const gate = check(`wallPost:${key}`, { windowMs: 60_000, max: 1 }, 5);
  if (!gate.ok) {
    return NextResponse.json(
      { ok: false, error: gate.reason },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((gate.retryAfterMs ?? 60_000) / 1000)) },
      }
    );
  }

  if (!isSupabaseServerConfigured || !supabaseServer) {
    return NextResponse.json(
      { ok: false, error: "服务端未配置数据库；本封信将仅保存在你的浏览器。", configured: false },
      { status: 503 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "请求格式有误。" }, { status: 400 });
  }

  // 校验
  const to = String(body?.to ?? "").trim().slice(0, 40);
  const from = String(body?.from ?? "").trim().slice(0, 60);
  const destination = String(body?.destination ?? "").trim().slice(0, 60);
  const bodyText = String(body?.body ?? "").trim();
  const tone = body?.tone as LetterTone;
  const theme = body?.theme as LetterTheme;

  if (!to) return NextResponse.json({ ok: false, error: "缺少收信人。" }, { status: 400 });
  if (!bodyText) return NextResponse.json({ ok: false, error: "正文不能为空。" }, { status: 400 });
  if (bodyText.length > 2000)
    return NextResponse.json({ ok: false, error: "正文超过 2000 字。" }, { status: 400 });
  if (!TONE_KEYS.includes(tone))
    return NextResponse.json({ ok: false, error: "tone 不合法。" }, { status: 400 });
  if (!THEMES.includes(theme))
    return NextResponse.json({ ok: false, error: "theme 不合法。" }, { status: 400 });

  const insertRow = {
    to_field: to,
    from_field: from || "远方",
    destination: destination || "故乡",
    body: bodyText,
    tone,
    theme,
  };

  const { data, error } = await supabaseServer
    .from(TABLE)
    .insert(insertRow)
    .select("id, created_at")
    .single();

  if (error) {
    console.error("[wall POST]", error);
    return NextResponse.json(
      { ok: false, error: "保存失败，稍后再试。" },
      { status: 500 }
    );
  }

  const letter: Letter = {
    id: data.id,
    ...insertRow,
    to: insertRow.to_field,
    from: insertRow.from_field,
    isPublic: true,
    createdAt: data.created_at,
  } as Letter;

  return NextResponse.json({ ok: true, letter });
}
