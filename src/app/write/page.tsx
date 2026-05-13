"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  TONE_LABELS,
  TONE_HINTS,
  THEMES,
  defaultSignature,
  type Letter,
  type LetterTone,
  type LetterTheme,
} from "@/lib/types";
import { loadDraft, saveDraft, newId } from "@/lib/storage";

// 把"旧式家书"放第一位 —— 这是侨批最自然的语气，也是默认选中的那个
const TONE_KEYS: LetterTone[] = ["classical", "gentle", "restrained", "modern"];

const TONE_PLACEHOLDERS: Record<LetterTone, string> = {
  modern:
    "你好啊，\n好久没跟你说话了。\n最近其实想了你很多次……",
  gentle:
    "外婆：\n上次回家是三年前的春天。\n您塞给我的那包茶叶，我还没舍得喝完……",
  restrained:
    "我想说的，从来没多。\n只是这一句，过去了二十年。\n今天，写下来。",
  classical:
    "母亲大人膝下：\n  儿在外一切平安，勿念。\n  今寄银若干，望阿母收讫……\n  敬颂福安",
};

export default function WritePage() {
  return (
    <Suspense fallback={null}>
      <WriteForm />
    </Suspense>
  );
}

function WriteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [destination, setDestination] = useState("");
  const [body, setBody] = useState("");
  const [signature, setSignature] = useState("");
  const [tone, setTone] = useState<LetterTone>("classical");
  const [theme, setTheme] = useState<LetterTheme>("想念");
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contextHint, setContextHint] = useState<string | null>(null);
  // AI 写信状态
  const [composing, setComposing] = useState(false);
  const [previousBody, setPreviousBody] = useState<string | null>(null); // 用于"撤销"
  const [aiHint, setAiHint] = useState<string | null>(null);

  // 加载草稿 + 读 query 预填（query 优先级最高）
  useEffect(() => {
    const d = loadDraft();
    const qTo = searchParams.get("to");
    const qTone = searchParams.get("tone") as LetterTone | null;
    const qTheme = searchParams.get("theme") as LetterTheme | null;
    const fromArchive = !!(qTo || qTone || qTheme);

    if (qTo) setTo(qTo);
    else if (d?.to) setTo(d.to);

    if (d?.from) setFrom(d.from);
    if (d?.destination) setDestination(d.destination);
    // 重要：从原件库跳来时，正文应该是空白的（让用户重新写）；
    // 但保留 from/destination 这类位置信息（可能是用户日常的住地）
    if (!fromArchive && d?.body) setBody(d.body);
    if (!fromArchive && d?.signature) setSignature(d.signature);

    if (qTone && TONE_KEYS.includes(qTone)) setTone(qTone);
    else if (d?.tone) setTone(d.tone);

    if (qTheme && THEMES.includes(qTheme)) setTheme(qTheme);
    else if (d?.theme) setTheme(d.theme);

    if (typeof d?.isPublic === "boolean") setIsPublic(d.isPublic);

    if (fromArchive) {
      setContextHint(
        `从原件库带来：致 ${qTo ?? "—"} · ${TONE_LABELS[(qTone ?? "classical") as LetterTone]} · ${qTheme ?? "想念"}`
      );
    }
    // 这里只想跑一次（mount 时同步 query + draft）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 自动保存草稿（节流：300ms 后）
  useEffect(() => {
    const t = setTimeout(() => {
      saveDraft({ to, from, destination, body, signature, tone, theme, isPublic });
    }, 300);
    return () => clearTimeout(t);
  }, [to, from, destination, body, signature, tone, theme, isPublic]);

  // 让 DeepSeek 帮忙润色 / 代写
  async function handleAiCompose() {
    if (composing) return;
    setError(null);
    setAiHint(null);
    setComposing(true);
    try {
      const resp = await fetch("/api/compose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, from, destination, body, tone, theme }),
      });
      const data = await resp.json().catch(() => null);
      if (!resp.ok) {
        setError(data?.error || `服务暂不可用（${resp.status}）。`);
        return;
      }
      const composed = String(data?.composed ?? "").trim();
      if (!composed) {
        setError("AI 没写出东西，请重试。");
        return;
      }
      setPreviousBody(body); // 备份
      setBody(composed);
      setAiHint(
        body.trim().length >= 20
          ? "已用那个年代的笔触改写。你可以再改，或者点「还原」回到原稿。"
          : "已替你拟了一封。你可以再改，或者点「还原」清空重写。"
      );
    } catch (e) {
      setError("网络出了点问题，稍后再试。");
    } finally {
      setComposing(false);
    }
  }

  function handleUndoCompose() {
    if (previousBody == null) return;
    setBody(previousBody);
    setPreviousBody(null);
    setAiHint(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!to.trim()) return setError("请写上「写给谁」。");
    if (!body.trim()) return setError("正文不能空白。");
    setError(null);

    const letter: Letter = {
      id: newId(),
      to: to.trim(),
      from: from.trim() || "远方",
      destination: destination.trim() || "故乡",
      body: body.trim(),
      signature: signature.trim() || undefined,
      tone,
      theme,
      isPublic,
      createdAt: new Date().toISOString(),
    };

    // 把待生成的信暂存到 sessionStorage，generate 页读取
    sessionStorage.setItem("qiaopi:pending:v1", JSON.stringify(letter));
    router.push("/generate");
  }

  return (
    <div className="px-4 py-12 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="font-serif text-ink-300 text-xs sm:text-sm tracking-[0.5em] mb-4">
            写 一 封 侨 批
          </div>
          <h1 className="font-serif text-ink-500 text-3xl sm:text-4xl mb-3 tracking-wide">
            写给那个，
            <br className="sm:hidden" />
            一直没来得及说的人
          </h1>
          <p className="text-ink-400 text-sm sm:text-base tracking-wider leading-loose max-w-md mx-auto">
            慢一点，不要急。
            <br />
            想清楚再下笔。
          </p>
          {contextHint && (
            <div className="mt-6 inline-block border border-seal-500/40 px-4 py-2 text-[12px] sm:text-xs text-seal-500 font-serif tracking-wider">
              ※ {contextHint}
            </div>
          )}
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="space-y-8"
        >
          <Field label="写给谁" hint="可以是名字，也可以是身份：阿母、阿嬷、远方的你">
            <input
              className="field-input"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="阿嬷"
              maxLength={20}
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-6">
            <Field label="从哪里寄出">
              <input
                className="field-input"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="新加坡 牛车水"
                maxLength={30}
              />
            </Field>
            <Field label="寄往哪里">
              <input
                className="field-input"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="福建 泉州"
                maxLength={30}
              />
            </Field>
          </div>

          <Field
            label="语气"
            hint={TONE_HINTS[tone]}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
              {TONE_KEYS.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setTone(k)}
                  className={`px-3 py-2.5 font-serif text-sm tracking-wider border transition-colors ${
                    tone === k
                      ? "bg-ink-500 text-paper-100 border-ink-500"
                      : "bg-transparent text-ink-400 border-ink-300/50 hover:border-ink-400"
                  }`}
                >
                  {TONE_LABELS[k]}
                </button>
              ))}
            </div>
          </Field>

          <Field label="想说的话" hint="可以分段。短一点也没关系，一句也是一封信。">
            <textarea
              className="field-textarea min-h-[260px] leading-[2.2]"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={TONE_PLACEHOLDERS[tone]}
              maxLength={1200}
              style={{
                // 朱丝栏：旧时信纸的竖向淡红细线
                backgroundImage:
                  "repeating-linear-gradient(90deg, transparent 0, transparent 39px, rgba(139,44,44,0.12) 40px, transparent 41px), " +
                  // 红色边线（左右各一条粗一点的）
                  "linear-gradient(90deg, rgba(139,44,44,0.18) 1px, transparent 1px), " +
                  "linear-gradient(270deg, rgba(139,44,44,0.18) 1px, transparent 1px)",
                backgroundPosition: "0 0, 0 0, 100% 0",
                backgroundRepeat: "repeat, no-repeat, no-repeat",
              }}
            />
            {/* AI 写信助手 */}
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAiCompose}
                  disabled={composing}
                  className="inline-flex items-center gap-2 text-sm font-serif tracking-wider px-3 py-1.5 border border-seal-500/60 text-seal-500 hover:bg-seal-500/5 transition-colors disabled:opacity-50"
                  title="按当前主题和语气，让 AI 模仿那个年代的笔触替你写"
                >
                  {composing ? (
                    <>
                      <span className="inline-block h-2 w-2 rounded-full bg-seal-500/70 animate-pulse" />
                      <span>正在落笔…</span>
                    </>
                  ) : (
                    <>
                      <span>✦</span>
                      <span>{body.trim().length >= 20 ? "让那个年代的人帮我润色" : "让那个年代的人帮我写"}</span>
                    </>
                  )}
                </button>
                {previousBody != null && !composing && (
                  <button
                    type="button"
                    onClick={handleUndoCompose}
                    className="text-xs font-serif tracking-wider text-ink-300 hover:text-ink-500 underline underline-offset-4"
                  >
                    还原原稿
                  </button>
                )}
              </div>
              <div className="text-right text-ink-300 text-xs">
                {body.length} / 1200
              </div>
            </div>
            {aiHint && (
              <div className="mt-2 text-xs text-ink-400 font-serif tracking-wider leading-relaxed border-l-2 border-seal-500/40 pl-3">
                {aiHint}
              </div>
            )}
          </Field>

          <Field label="主题" hint="如果决定公开，这是侨批墙上的归类。">
            <div className="flex flex-wrap gap-2">
              {THEMES.map((th) => (
                <button
                  key={th}
                  type="button"
                  onClick={() => setTheme(th)}
                  className={`px-4 py-2 font-serif text-sm tracking-wider border transition-colors ${
                    theme === th
                      ? "bg-seal-500 text-paper-100 border-seal-500"
                      : "bg-transparent text-ink-400 border-ink-300/50 hover:border-ink-400"
                  }`}
                >
                  {th}
                </button>
              ))}
            </div>
          </Field>

          <Field
            label="署名"
            hint={`留空就用建议默认：「${defaultSignature({ tone, to })}」。也可以写自己的：如「儿 阿成 谨上」「孙 敬贤 拜上」`}
          >
            <input
              className="field-input"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder={defaultSignature({ tone, to })}
              maxLength={24}
            />
          </Field>

          <Field label="是否匿名公开">
            <label className="flex items-start gap-3 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="mt-1 h-4 w-4 accent-seal-500"
              />
              <span className="text-ink-400 text-[15px] leading-relaxed">
                匿名公开到「侨批墙」，
                <br className="sm:hidden" />
                让其他人也能读到这封信。
                <span className="block text-ink-300 text-xs mt-1">
                  默认不公开，仅在你本人的浏览器里存为草稿。
                </span>
              </span>
            </label>
          </Field>

          {error && (
            <div className="text-seal-500 text-sm font-serif">{error}</div>
          )}

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-end items-stretch">
            <button type="submit" className="btn-seal">
              折成一封侨批 →
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
      {hint && (
        <div className="text-ink-300 text-xs mt-2 leading-relaxed">{hint}</div>
      )}
    </div>
  );
}
