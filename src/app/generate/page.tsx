"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import LetterCanvas from "@/components/LetterCanvas";
import type { Letter } from "@/lib/types";
import { clearDraft, saveLetter } from "@/lib/storage";
import { submitPublicLetter } from "@/lib/wallApi";

export default function GeneratePage() {
  const router = useRouter();
  const [letter, setLetter] = useState<Letter | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedSource, setSavedSource] = useState<"server" | "local" | null>(null);
  const [savingToWall, setSavingToWall] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [innerHeight, setInnerHeight] = useState(1040);

  // 读取待生成信件
  useEffect(() => {
    const raw = sessionStorage.getItem("qiaopi:pending:v1");
    if (!raw) {
      router.replace("/write");
      return;
    }
    try {
      const l = JSON.parse(raw) as Letter;
      setLetter(l);
      // 用户在表单里选了公开 → 自动挂上侨批墙
      if (l.isPublic) {
        (async () => {
          const r = await submitPublicLetter(l);
          setSaved(true);
          setSavedSource(r.source);
        })();
      }
    } catch {
      router.replace("/write");
    }
  }, [router]);

  // 自适应缩放：把 800px 宽的信纸缩放到容器宽度
  useEffect(() => {
    function recalc() {
      // 信纸固定宽度 800，最大显示 720（桌面），手机时 padding 16
      const maxWidth = Math.min(window.innerWidth - 32, 720);
      setScale(Math.min(1, maxWidth / 800));
    }
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, []);

  // 测量信纸真实高度，让外层容器跟着缩放后的高度走，避免下方留白
  useLayoutEffect(() => {
    if (!canvasRef.current) return;
    const el = canvasRef.current;
    const ro = new ResizeObserver(() => {
      setInnerHeight(el.offsetHeight);
    });
    ro.observe(el);
    setInnerHeight(el.offsetHeight);
    return () => ro.disconnect();
  }, [letter]);

  async function handleDownload() {
    if (!canvasRef.current || !letter) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: null,
        scale: 2, // 2x 高清
        useCORS: true,
        logging: false,
        windowWidth: 800,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      const safeName = letter.to.replace(/[\\/:*?"<>|]/g, "_").slice(0, 10);
      a.href = dataUrl;
      a.download = `侨批_给${safeName}_${letter.id.slice(-6)}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert("生成图片失败，请稍后再试。");
    } finally {
      setDownloading(false);
    }
  }

  function handleEdit() {
    router.push("/write");
  }

  async function handleSaveToWall() {
    if (!letter || saved || savingToWall) return;
    setSavingToWall(true);
    const next: Letter = { ...letter, isPublic: true };
    try {
      const r = await submitPublicLetter(next);
      // submitPublicLetter 内部已经写了 localStorage（无论 server 成败），所以这里不用再 saveLetter
      setLetter(r.letter ?? next);
      setSaved(true);
      setSavedSource(r.source);
    } catch {
      // fallback to localStorage
      saveLetter(next);
      setLetter(next);
      setSaved(true);
      setSavedSource("local");
    } finally {
      setSavingToWall(false);
    }
  }

  function handleNew() {
    sessionStorage.removeItem("qiaopi:pending:v1");
    clearDraft();
    router.push("/write");
  }

  if (!letter) {
    return (
      <div className="px-4 py-32 text-center text-ink-400">
        正在准备这封信…
      </div>
    );
  }

  return (
    <div className="px-4 py-12 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        className="text-center max-w-xl mx-auto mb-10 sm:mb-14"
      >
        <div className="font-serif text-ink-300 text-xs sm:text-sm tracking-[0.5em] mb-4">
          已 折 好 一 封 侨 批
        </div>
        <h1 className="font-serif text-ink-500 text-2xl sm:text-3xl mb-3 tracking-wide">
          请把它收好，<br className="sm:hidden" />或者，让远方的人也读到。
        </h1>
      </motion.div>

      {/* 信纸预览（响应式缩放） */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
        className="mx-auto mb-12 sm:mb-16 overflow-hidden"
        style={{
          width: 800 * scale,
          height: innerHeight * scale,
        }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: 800,
          }}
          className="png-target"
        >
          <LetterCanvas ref={canvasRef} letter={letter} />
        </div>
      </motion.div>

      {/* 操作区 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.3 }}
        className="max-w-md mx-auto"
      >
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="btn-seal disabled:opacity-50"
          >
            {downloading ? "正在生成图片…" : "下载这封信 (PNG)"}
          </button>
          <button type="button" onClick={handleEdit} className="btn-secondary">
            返回修改
          </button>
        </div>

        {/* 侨批墙状态 */}
        <div className="border border-ink-300/30 bg-paper-100/40 p-5 text-center">
          {saved ? (
            <div className="text-ink-400 text-sm leading-relaxed">
              ※ 这封信已匿名挂上 <Link href="/wall" className="text-seal-500 underline underline-offset-4">侨批墙</Link>。
              {savedSource === "local" && (
                <div className="text-ink-300 text-xs mt-2 leading-relaxed">
                  （服务端云端存储未开启，本封暂时只在你的浏览器里可见）
                </div>
              )}
              {savedSource === "server" && (
                <div className="text-ink-300 text-xs mt-2 leading-relaxed">
                  （已写入云端，任何访问者都能在墙上看到）
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-ink-400 text-sm leading-relaxed">
                你写的时候选择了 <span className="text-ink-500">不公开</span>。
                <br />
                如果改变主意，也可以现在挂上去。
              </p>
              <button
                type="button"
                onClick={handleSaveToWall}
                disabled={savingToWall}
                className="btn-secondary text-sm disabled:opacity-50"
              >
                {savingToWall ? "正在贴上去…" : "匿名挂到侨批墙"}
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-10">
          <button
            type="button"
            onClick={handleNew}
            className="text-ink-300 text-sm tracking-widest hover:text-ink-500 transition-colors"
          >
            ※ 再写一封 ※
          </button>
        </div>
      </motion.div>
    </div>
  );
}
