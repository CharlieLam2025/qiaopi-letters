"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import ArchiveViewer from "@/components/ArchiveViewer";
import { resolveImageUrl } from "@/lib/archiveImage";
import { fetchArchiveItems, fetchArchiveItemById } from "@/lib/archiveStore";
import {
  KIND_LABELS,
  type ArchiveImageKind,
  type QiaopiItem,
} from "@/lib/archiveTypes";
import RedSeal from "@/components/RedSeal";

// Cloudflare Pages 要求所有动态路由跑 edge runtime
export const runtime = "edge";

export default function ArchiveDetailPage() {
  const params = useParams();
  const id = String(params?.id ?? "");

  const [item, setItem] = useState<QiaopiItem | null | "loading">("loading");
  const [siblings, setSiblings] = useState<QiaopiItem[]>([]);
  const [activeKind, setActiveKind] = useState<ArchiveImageKind>("letter");

  useEffect(() => {
    let cancelled = false;
    if (!id) return;
    setItem("loading");
    setActiveKind("letter");
    (async () => {
      const [one, all] = await Promise.all([
        fetchArchiveItemById(id),
        fetchArchiveItems(),
      ]);
      if (cancelled) return;
      setItem(one);
      setSiblings(all);
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // 主显示图：当 item 或 activeKind 变化时重新生成 data URL
  const activeUrl = useMemo(() => {
    if (!item || item === "loading") return "";
    return resolveImageUrl(item, activeKind, { width: 1200, height: 1650 });
  }, [item, activeKind]);

  // 上一件 / 下一件
  const { prev, next } = useMemo(() => {
    if (!item || item === "loading" || siblings.length === 0) return { prev: null, next: null };
    const idx = siblings.findIndex((s) => s.id === item.id);
    return {
      prev: idx > 0 ? siblings[idx - 1] : null,
      next: idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null,
    };
  }, [item, siblings]);

  if (item === "loading") {
    return (
      <div className="px-4 py-20 text-center text-ink-400 font-serif tracking-wider">
        正在抽出这一只档案盒…
      </div>
    );
  }
  if (!item) {
    return <NotFoundState />;
  }

  return (
    <div className="px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        {/* 面包屑 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-ink-300 text-xs sm:text-sm font-serif tracking-wider mb-6"
        >
          <Link href="/archive" className="hover:text-ink-500 transition-colors">
            ← 返回原件库
          </Link>
          <span className="mx-2 text-ink-300/60">／</span>
          <span className="text-ink-400">{item.id.toUpperCase()}</span>
        </motion.div>

        {/* 标题 */}
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          className="mb-8 sm:mb-10"
        >
          <div className="text-seal-500 font-serif text-xs sm:text-sm tracking-[0.4em] mb-3">
            原 件 详 情
          </div>
          <h1 className="font-serif text-ink-500 text-2xl sm:text-4xl tracking-wide leading-tight">
            {item.title}
          </h1>
          <div className="mt-3 text-ink-400 text-sm tracking-wider">
            <span>{item.year}</span>
            <span className="mx-2 text-ink-300/60">·</span>
            <span>{item.fromCountry} {item.fromCity}</span>
            <span className="mx-2 text-ink-300/60">→</span>
            <span>{item.toProvince} {item.toCity}</span>
          </div>
        </motion.header>

        {/* 主体两栏 */}
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_4fr] gap-8 lg:gap-12">
          {/* 左栏：图像 */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="border border-ink-300/40 bg-paper-100/40">
              <ArchiveViewer src={activeUrl} aspect="portrait" fadeKey={item.id} />
              <div className="p-3 sm:p-4 border-t border-ink-300/30 text-center font-serif text-ink-400 text-sm tracking-widest">
                {KIND_LABELS[activeKind]}
              </div>
            </div>

            {/* 四张缩略图 · 切换 */}
            <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-3">
              {item.images.map((img) => {
                const active = img.kind === activeKind;
                const url = resolveImageUrl(item, img.kind, {
                  width: 240,
                  height: 320,
                  thumbnail: true,
                });
                return (
                  <button
                    key={img.kind}
                    type="button"
                    onClick={() => setActiveKind(img.kind)}
                    className={`group relative aspect-[3/4] border transition-colors overflow-hidden ${
                      active
                        ? "border-seal-500 ring-1 ring-seal-500"
                        : "border-ink-300/40 hover:border-ink-400"
                    }`}
                    aria-pressed={active}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={img.label}
                      className="absolute inset-0 w-full h-full object-cover"
                      draggable={false}
                    />
                    <span
                      className={`absolute bottom-0 left-0 right-0 px-1 py-0.5 text-[11px] font-serif tracking-wider text-center ${
                        active
                          ? "bg-seal-500/90 text-paper-100"
                          : "bg-paper-100/85 text-ink-500"
                      }`}
                    >
                      {img.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* 右栏：档案信息 */}
          <motion.aside
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-10"
          >
            {/* 档案信息表 */}
            <section>
              <SectionTitle text="档 案 信 息" />
              <dl className="grid grid-cols-[5em_1fr] sm:grid-cols-[6em_1fr] gap-y-3 gap-x-4 text-[15px]">
                <Row label="年代" value={`${item.year} · ${item.dateText}`} />
                <Row label="寄出" value={`${item.fromCountry} ${item.fromCity}`} />
                <Row
                  label="收批"
                  value={`${item.toProvince} ${item.toCity} ${item.toVillage}`}
                />
                <Row label="寄批人" value={item.sender} />
                <Row
                  label="收批人"
                  value={`${item.receiver}（${item.receiverRelation}）`}
                />
                <Row
                  label="批银"
                  value={
                    item.amount
                      ? `${item.amount} ${item.currency}`
                      : "（原件未注明）"
                  }
                />
                <Row label="批局" value={item.qiaopiOffice} />
              </dl>
              {/* 主题标签 */}
              <div className="mt-5 flex flex-wrap gap-1.5">
                {item.themes.map((t) => (
                  <span
                    key={t}
                    className="inline-block px-2.5 py-1 text-xs font-serif text-seal-500 border border-seal-500/50 tracking-wider"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>

            {/* 原文转写 */}
            <section>
              <SectionTitle text="原 文 转 写" />
              <div className="relative px-5 py-6 sm:px-7 sm:py-8 border border-ink-300/30 bg-paper-100/50">
                <div className="font-serif text-ink-500 text-[16px] sm:text-[17px] leading-[2.1] whitespace-pre-line tracking-wider">
                  {item.transcription}
                </div>
                <div className="absolute -top-2 -right-2 opacity-90">
                  <RedSeal text="转写" size={48} rotate={-6} />
                </div>
              </div>
            </section>

            {/* 白话解读 */}
            <section>
              <SectionTitle text="白 话 解 读" />
              <p className="text-ink-500 text-[15px] sm:text-base leading-[2] tracking-wide whitespace-pre-line">
                {item.modernExplanation}
              </p>
            </section>

            {/* 历史注释 */}
            <section>
              <SectionTitle text="历 史 注 释" />
              <p className="text-ink-400 text-[14px] sm:text-[15px] leading-[2] tracking-wide whitespace-pre-line">
                {item.historicalNotes}
              </p>
            </section>

            {/* 跨模块 CTA：用同样的语气写一封 */}
            <WriteCTA item={item} />

            {/* 来源/版权 */}
            <section className="border-t border-ink-300/30 pt-6 text-[12px] sm:text-[13px] text-ink-300 leading-loose">
              <div className="font-serif tracking-widest text-ink-400 mb-2">
                来 源 · 版 权
              </div>
              <div>
                来源：
                {item.sourceUrl ? (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-4 text-ink-500 hover:text-seal-500"
                  >
                    {item.sourceName}
                  </a>
                ) : (
                  <span className="text-ink-400">{item.sourceName}</span>
                )}
              </div>
              <div className="mt-1">{item.rightsNote}</div>
            </section>
          </motion.aside>
        </div>

        {/* 翻页 */}
        {(prev || next) && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="mt-16 sm:mt-20 pt-8 border-t border-ink-300/30 flex flex-col sm:flex-row justify-between gap-4 text-sm"
          >
            <div className="flex-1">
              {prev && (
                <Link
                  href={`/archive/${prev.id}`}
                  className="block group text-ink-400 hover:text-seal-500 transition-colors"
                >
                  <div className="text-ink-300 text-xs font-serif tracking-widest mb-1">
                    ← 上一件
                  </div>
                  <div className="font-serif text-base sm:text-lg">{prev.title}</div>
                </Link>
              )}
            </div>
            <div className="flex-1 sm:text-right">
              {next && (
                <Link
                  href={`/archive/${next.id}`}
                  className="block group text-ink-400 hover:text-seal-500 transition-colors"
                >
                  <div className="text-ink-300 text-xs font-serif tracking-widest mb-1">
                    下一件 →
                  </div>
                  <div className="font-serif text-base sm:text-lg">{next.title}</div>
                </Link>
              )}
            </div>
          </motion.nav>
        )}
      </div>
    </div>
  );
}

function SectionTitle({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <h2 className="font-serif text-ink-500 text-base sm:text-lg tracking-[0.35em]">
        {text}
      </h2>
      <span className="h-px flex-1 bg-ink-300/30" />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="font-serif text-ink-300 text-sm tracking-widest pt-0.5">
        {label}
      </dt>
      <dd className="font-serif text-ink-500 leading-relaxed">{value}</dd>
    </>
  );
}

// 把原件库条目的语气 / 主题 / 收信人关系映射到写信表单可识别的 query
function buildWriteHref(item: QiaopiItem): string {
  // 写信表单接受的 5 个主题；用一个简单 map 做兜底
  const themeMap: Record<string, string> = {
    报平安: "报平安",
    想念: "想念",
    告别: "告别",
    家事: "想念",
    汇款: "报平安",
    学业: "感谢",
    宗族: "感谢",
    病故: "亏欠",
    抗战: "告别",
    商务: "报平安",
  };
  const theme = themeMap[item.themes[0]] ?? "想念";
  // 12 条占位皆为旧式家书风格，默认 tone=classical
  const params = new URLSearchParams({
    to: item.receiverRelation || "远方的你",
    tone: "classical",
    theme,
  });
  return `/write?${params.toString()}`;
}

function WriteCTA({ item }: { item: QiaopiItem }) {
  const href = buildWriteHref(item);
  return (
    <section className="border-t border-b border-ink-300/30 py-6 sm:py-7 text-center">
      <p className="text-ink-400 text-sm sm:text-[15px] tracking-wider mb-4 leading-loose">
        被这封信触动？
        <br className="sm:hidden" />
        你也可以用同样的语气，<br className="sm:hidden" />写给那个还没说话的人。
      </p>
      <Link href={href} className="btn-seal text-sm">
        也写一封 · 致 {item.receiverRelation || "远方的你"} →
      </Link>
    </section>
  );
}

function NotFoundState() {
  return (
    <div className="px-4 py-24 text-center">
      <p className="font-serif text-ink-500 text-2xl mb-3">这只档案盒是空的。</p>
      <p className="text-ink-400 text-sm mb-6 tracking-widest">
        也许它从未被收入，也许被取走了。
      </p>
      <Link href="/archive" className="btn-secondary">
        回到原件库
      </Link>
    </div>
  );
}
