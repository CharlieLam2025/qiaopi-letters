"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { resolveImageUrl } from "@/lib/archiveImage";
import type { QiaopiItem } from "@/lib/archiveTypes";
import CornerStamp from "./decorations/CornerStamp";

interface Props {
  item: QiaopiItem;
}

// 列表卡片：像一个旧档案盒上的标签 + 一张缩略图
export default function ArchiveCard({ item }: Props) {
  // 缩略图：用内信的版式（thumbnail 模式，体积小且不闪烁）
  const thumb = useMemo(
    () =>
      resolveImageUrl(item, "letter", {
        width: 400,
        height: 540,
        thumbnail: true,
      }),
    [item.id]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.0, ease: [0.4, 0, 0.2, 1] }}
    >
      <Link
        href={`/archive/${item.id}`}
        className="group relative block border border-ink-300/30 hover:border-ink-400/70 bg-paper-100/40 transition-colors shadow-[0_2px_8px_-4px_rgba(40,25,10,0.18)] hover:shadow-[0_10px_22px_-12px_rgba(40,25,10,0.45)]"
      >
        {/* 右上贴角邮票 —— 给"档案盒标签"质感 */}
        <div className="absolute -top-2 -right-2 z-20 drop-shadow-[0_3px_4px_rgba(40,25,10,0.35)]">
          <CornerStamp
            size={44}
            text={item.themes[0]?.slice(0, 1) || "侨"}
            red={item.themes[0] === "想念" || item.themes[0] === "告别"}
            rotate={item.id.charCodeAt(item.id.length - 1) % 2 === 0 ? -8 : 6}
          />
        </div>

        {/* 缩略图区 —— 像档案盒上的小窗 */}
        <div className="relative aspect-[3/4] overflow-hidden bg-paper-200/30 border-b border-ink-300/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumb}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-1000 ease-out"
            loading="lazy"
            draggable={false}
          />
          {/* 年代 · 角标 */}
          <div className="absolute top-2 left-2 bg-paper-100/85 border border-ink-300/40 px-2 py-1 font-serif text-ink-500 text-xs tracking-wider">
            {item.year}
          </div>
        </div>

        {/* 文字区 */}
        <div className="p-4 sm:p-5">
          <h3 className="font-serif text-ink-500 text-base sm:text-lg leading-snug mb-2 tracking-wider">
            {item.title}
          </h3>
          <div className="text-ink-400 text-xs sm:text-[13px] leading-relaxed space-y-0.5">
            <div className="flex items-center gap-1">
              <span className="text-ink-300">寄自</span>
              <span>{item.fromCountry} · {item.fromCity}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-ink-300">寄往</span>
              <span>{item.toProvince} · {item.toCity}</span>
            </div>
          </div>
          {/* 主题标签 */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {item.themes.slice(0, 3).map((t) => (
              <span
                key={t}
                className="inline-block px-2 py-0.5 text-[11px] font-serif text-seal-500 border border-seal-500/40 tracking-wider"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
