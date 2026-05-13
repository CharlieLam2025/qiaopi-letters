"use client";

import { forwardRef } from "react";
import RedSeal from "./RedSeal";
import Postmark from "./Postmark";
import type { Letter, LetterTone } from "@/lib/types";

interface Props {
  letter: Letter;
}

// 不同语气对应的字体类与字距
const toneStyle: Record<LetterTone, { font: string; letter: string; line: string }> = {
  modern: { font: "font-serif", letter: "tracking-normal", line: "leading-loose" },
  gentle: { font: "font-serif", letter: "tracking-wide", line: "leading-loose" },
  restrained: { font: "font-serif", letter: "tracking-widest", line: "leading-[2]" },
  classical: { font: "font-serif", letter: "tracking-wider", line: "leading-[2]" },
};

// 把 destination 切成 2~4 字的"邮戳"城市
function postmarkCity(dest: string): string {
  const cleaned = dest.replace(/[省市县区]/g, "").trim();
  const parts = cleaned.split(/\s+/);
  const last = parts[parts.length - 1] || "侨乡";
  return last.slice(0, 4);
}

// 让日期看起来像 1948.03.12 风格（保留真实年份）
function formatStampDate(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

function formatBodyDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

const LetterCanvas = forwardRef<HTMLDivElement, Props>(function LetterCanvas(
  { letter },
  ref
) {
  const t = toneStyle[letter.tone];
  return (
    <div
      ref={ref}
      // 固定宽度：800px。在小屏会被外层 transform: scale 等比缩小。
      // html2canvas 在固定像素下能输出更稳定的 PNG。
      style={{
        width: 800,
        minHeight: 1040,
        position: "relative",
        background:
          "linear-gradient(180deg, #f3e8ce 0%, #ecdfbf 45%, #e6d5af 100%)",
        boxShadow:
          "inset 0 0 90px rgba(80,50,20,0.18), inset 0 0 18px rgba(60,40,15,0.18), 0 30px 60px -20px rgba(40,25,10,0.45)",
        padding: "72px 64px 84px",
        overflow: "hidden",
        color: "#3a2818",
        fontFamily: "var(--font-noto-serif-sc), Georgia, serif",
      }}
    >
      {/* 纸面纹理：放在底部，避免遮文字 */}
      <svg
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.22,
          mixBlendMode: "multiply",
          pointerEvents: "none",
        }}
      >
        <filter id="letterPaperNoise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.12  0 0 0 0.5 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#letterPaperNoise)" />
      </svg>

      {/* 折痕（横向 + 纵向，淡淡的） */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "33%",
          height: 1,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(70,45,20,0.18) 30%, rgba(70,45,20,0.22) 70%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "67%",
          height: 1,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(70,45,20,0.14) 40%, rgba(70,45,20,0.2) 60%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "50%",
          width: 1,
          background:
            "linear-gradient(180deg, transparent 0%, rgba(70,45,20,0.1) 50%, transparent 100%)",
        }}
      />

      {/* 顶部信封信息条 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 36,
          position: "relative",
        }}
      >
        <div style={{ fontSize: 13, color: "#5c4631", lineHeight: 1.8 }}>
          <div style={{ letterSpacing: "0.2em", marginBottom: 4 }}>
            寄自 · {letter.from}
          </div>
          <div style={{ letterSpacing: "0.2em" }}>
            发往 · {letter.destination}
          </div>
        </div>
        <Postmark
          city={postmarkCity(letter.destination)}
          date={formatStampDate(letter.createdAt)}
          size={120}
          rotate={10}
        />
      </div>

      {/* 收信人 */}
      <div
        style={{
          fontSize: 26,
          fontWeight: 600,
          letterSpacing: "0.15em",
          marginBottom: 24,
          color: "#2a1c10",
        }}
      >
        致 {letter.to}：
      </div>

      {/* 正文 */}
      <div
        className={`${t.font} ${t.letter} ${t.line}`}
        style={{
          fontSize: 18,
          color: "#2a1c10",
          whiteSpace: "pre-wrap",
          textIndent: letter.tone === "classical" ? "2em" : 0,
          minHeight: 480,
          // 保留首行缩进与多段
          wordBreak: "break-word",
        }}
      >
        {letter.body}
      </div>

      {/* 落款区 */}
      <div
        style={{
          marginTop: 48,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          gap: 28,
          position: "relative",
        }}
      >
        <div style={{ textAlign: "right", fontSize: 14, lineHeight: 2, color: "#5c4631" }}>
          <div style={{ fontSize: 18, color: "#2a1c10", marginBottom: 6 }}>
            {letter.tone === "classical" ? "敬上" : "—— 一个想念你的人"}
          </div>
          <div>{formatBodyDate(letter.createdAt)}</div>
          <div style={{ fontSize: 12, color: "#80684a", marginTop: 4 }}>
            主题：{letter.theme}
          </div>
        </div>
        <RedSeal text="如晤" size={92} rotate={-8} />
      </div>

      {/* 右下角小印：侨批二字 */}
      <div style={{ position: "absolute", bottom: 28, right: 36 }}>
        <RedSeal text="侨批" size={56} rotate={4} />
      </div>

      {/* 左下角：编号（伪造的批局编号，增加历史感） */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: 64,
          fontSize: 11,
          color: "#80684a",
          letterSpacing: "0.15em",
        }}
      >
        批号 · No. {letter.id.slice(-6).toUpperCase()}
      </div>
    </div>
  );
});

export default LetterCanvas;
