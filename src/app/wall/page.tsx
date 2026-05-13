"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { THEMES, type Letter, type LetterTheme } from "@/lib/types";
import { loadPublicLetters } from "@/lib/wallApi";
import RedSeal from "@/components/RedSeal";

type Filter = "全部" | LetterTheme;
const FILTERS: Filter[] = ["全部", ...THEMES];

export default function WallPage() {
  const [allLetters, setAllLetters] = useState<Letter[]>([]);
  const [filter, setFilter] = useState<Filter>("全部");
  const [selected, setSelected] = useState<Letter | null>(null);
  const [serverConfigured, setServerConfigured] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    loadPublicLetters({ limit: 80 })
      .then((r) => {
        if (cancelled) return;
        setAllLetters(r.letters);
        setServerConfigured(r.serverConfigured);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // 按主题筛选
  const all = useMemo(() => {
    if (filter === "全部") return allLetters;
    return allLetters.filter((l) => l.theme === filter);
  }, [allLetters, filter]);

  return (
    <div className="px-4 py-12 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        className="text-center max-w-xl mx-auto mb-10 sm:mb-14"
      >
        <div className="font-serif text-ink-300 text-xs sm:text-sm tracking-[0.5em] mb-4">
          侨 批 墙
        </div>
        <h1 className="font-serif text-ink-500 text-3xl sm:text-4xl mb-3 tracking-wide">
          有人来过，<br className="sm:hidden" />写过一些什么
        </h1>
        <p className="text-ink-400 text-sm sm:text-base tracking-wider leading-loose">
          这些信都是匿名的。<br className="sm:hidden" />
          它们曾经被写下，<br className="sm:hidden" />然后挂在了这里。
        </p>
        {/* 数据源状态 */}
        {!loading && (
          <div className="mt-5 text-ink-300 text-[11px] sm:text-xs tracking-widest font-serif">
            {serverConfigured ? (
              <span>※ 任何访问者写下的信都会出现在这里 ※</span>
            ) : (
              <span>※ 云端未启用：只有你在本浏览器写过的信会被加进墙上 ※</span>
            )}
          </div>
        )}
      </motion.div>

      {/* 筛选 */}
      <div className="mx-auto max-w-3xl mb-10 sm:mb-14 flex flex-wrap gap-2 justify-center">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-4 py-2 font-serif text-sm tracking-wider border transition-colors ${
              filter === f
                ? "bg-ink-500 text-paper-100 border-ink-500"
                : "bg-transparent text-ink-400 border-ink-300/40 hover:border-ink-400"
            }`}
          >
            {f}
            {f !== "全部" && (
              <span className="ml-1 text-xs opacity-60">
                {allLetters.filter((l) => l.theme === f).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 列表（瀑布流：CSS columns） */}
      <div className="mx-auto max-w-5xl">
        {loading ? (
          <div className="text-center py-20 text-ink-400 font-serif tracking-wider">
            正在把墙上的信取下来…
          </div>
        ) : all.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <div
            style={{
              columnGap: "1.25rem",
            }}
            className="columns-1 sm:columns-2 lg:columns-3"
          >
            {all.map((l) => (
              <Card key={l.id} letter={l} onClick={() => setSelected(l)} />
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <Link href="/write" className="btn-seal">
          也写一封 →
        </Link>
      </div>

      {/* 大图查看 */}
      <AnimatePresence>
        {selected && <LetterModal letter={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}

function Card({ letter, onClick }: { letter: Letter; onClick: () => void }) {
  const date = new Date(letter.createdAt);
  const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}.${String(date.getDate()).padStart(2, "0")}`;
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{ duration: 1.0, ease: [0.4, 0, 0.2, 1] }}
      onClick={onClick}
      type="button"
      className="block w-full text-left mb-5 break-inside-avoid group relative"
    >
      <div
        className="relative px-5 py-6 sm:px-6 sm:py-7 border border-ink-300/30 group-hover:border-ink-400/60 transition-colors"
        style={{
          background:
            "linear-gradient(180deg, #f3e8ce 0%, #e8dbb6 100%)",
          boxShadow:
            "inset 0 0 50px rgba(80,50,20,0.12), 0 8px 20px -10px rgba(40,25,10,0.3)",
        }}
      >
        {/* 主题小标 */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-seal-500 text-xs tracking-widest font-serif">
            · {letter.theme} ·
          </span>
          <span className="text-ink-300 text-xs tracking-wider">{dateStr}</span>
        </div>

        {/* 收信人 */}
        <h3 className="font-serif text-ink-500 text-lg sm:text-xl mb-3 tracking-wider">
          致 {letter.to}
        </h3>

        {/* 正文摘要 */}
        <p className="font-serif text-ink-400 text-[14px] leading-[2] whitespace-pre-line line-clamp-6">
          {letter.body}
        </p>

        {/* 寄出地 */}
        <div className="mt-4 pt-3 border-t border-ink-300/20 text-ink-300 text-xs tracking-widest flex justify-between">
          <span>寄自 · {letter.from}</span>
          <span>→ {letter.destination}</span>
        </div>

        {/* 装饰小印 */}
        <div className="absolute -top-2 -right-2 opacity-80 group-hover:opacity-100 transition-opacity">
          <RedSeal text={letter.theme.slice(0, 2)} size={42} rotate={-6} />
        </div>
      </div>
    </motion.button>
  );
}

function LetterModal({ letter, onClose }: { letter: Letter; onClose: () => void }) {
  // ESC 关闭
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const date = new Date(letter.createdAt);
  const dateStr = `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 bg-ink-700/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-xl w-full my-12"
      >
        <div
          className="relative px-7 py-10 sm:px-12 sm:py-14 border border-ink-300/30"
          style={{
            background:
              "linear-gradient(180deg, #f3e8ce 0%, #e8dbb6 100%)",
            boxShadow:
              "inset 0 0 60px rgba(80,50,20,0.15), 0 30px 60px -20px rgba(40,25,10,0.5)",
          }}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-ink-300 text-xs tracking-widest mb-1">
                寄自 · {letter.from}
              </div>
              <div className="text-ink-300 text-xs tracking-widest">
                发往 · {letter.destination}
              </div>
            </div>
            <span className="text-seal-500 text-xs tracking-widest font-serif">
              · {letter.theme} ·
            </span>
          </div>

          <h3 className="font-serif text-ink-500 text-2xl mb-6 tracking-wider">
            致 {letter.to}：
          </h3>

          <div className="font-serif text-ink-500 text-[16px] sm:text-[17px] leading-[2.2] whitespace-pre-wrap">
            {letter.body}
          </div>

          <div className="mt-8 text-right text-ink-400 text-sm leading-loose">
            {dateStr}
          </div>

          <div className="absolute -top-3 -right-3">
            <RedSeal text="如晤" size={68} rotate={-8} />
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-4 mx-auto block text-ink-300 text-sm tracking-widest hover:text-ink-500 transition-colors"
        >
          ※ 合上 ※
        </button>
      </motion.div>
    </motion.div>
  );
}

function EmptyState({ filter }: { filter: Filter }) {
  return (
    <div className="text-center py-16">
      <p className="text-ink-400 text-base leading-loose">
        这一类还没有人写过{filter !== "全部" ? `（${filter}）` : ""}。
        <br />
        要不要做第一个？
      </p>
      <Link href="/write" className="btn-secondary mt-6 inline-flex">
        写一封 →
      </Link>
    </div>
  );
}
