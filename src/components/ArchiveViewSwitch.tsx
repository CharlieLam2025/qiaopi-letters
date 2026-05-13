"use client";

import Link from "next/link";

interface Props {
  current: "list" | "map";
}

// /archive 与 /map 之间的视图切换。
// 用 <Link> 而非按钮：路由本身就是状态，URL 可分享。
export default function ArchiveViewSwitch({ current }: Props) {
  const items: { key: "list" | "map"; href: string; label: string }[] = [
    { key: "list", href: "/archive", label: "卡片视图" },
    { key: "map", href: "/map", label: "地图视图" },
  ];
  return (
    <div className="inline-flex border border-ink-300/50">
      {items.map((it) => {
        const active = it.key === current;
        return (
          <Link
            key={it.key}
            href={it.href}
            className={`px-4 py-2 font-serif text-sm tracking-wider transition-colors ${
              active
                ? "bg-ink-500 text-paper-100"
                : "bg-transparent text-ink-400 hover:text-ink-500"
            }`}
          >
            {it.label}
          </Link>
        );
      })}
    </div>
  );
}
