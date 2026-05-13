"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ArchiveCard from "@/components/ArchiveCard";
import ArchiveFilters, {
  INITIAL_FILTERS,
  applyFilters,
  type FilterState,
} from "@/components/ArchiveFilters";
import ArchiveViewSwitch from "@/components/ArchiveViewSwitch";
import { fetchArchiveItems } from "@/lib/archiveStore";
import type { QiaopiItem } from "@/lib/archiveTypes";

export default function ArchiveListPage() {
  const [items, setItems] = useState<QiaopiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterState>(INITIAL_FILTERS);

  useEffect(() => {
    let cancelled = false;
    fetchArchiveItems()
      .then((d) => {
        if (cancelled) return;
        setItems(d);
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

  const filtered = useMemo(() => applyFilters(items, filter), [items, filter]);

  return (
    <div>
      {/* 顶部介绍 */}
      <section className="px-4 pt-12 pb-8 sm:pt-20 sm:pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="font-serif text-ink-300 text-xs sm:text-sm tracking-[0.5em] mb-4">
            原 件 库
          </div>
          <h1 className="font-serif text-ink-500 text-3xl sm:text-5xl tracking-wide mb-3">
            侨批原件库
          </h1>
          <p className="text-ink-400 text-sm sm:text-base tracking-wider max-w-xl mx-auto leading-loose">
            像在档案馆翻一只旧木箱：
            <br className="sm:hidden" />
            一封信、一份汇款单、一个盖在角落里的红印章。
          </p>

          <div className="mt-6 max-w-xl mx-auto inline-block text-[12px] sm:text-xs text-ink-300 border border-ink-300/40 px-4 py-2 leading-loose">
            ※ 本库目前展示的 12 件为本项目原创占位，仿照侨批文体编写；
            <br className="hidden sm:inline" />
            真实图像后续将仅接入授权来源。
          </div>

          <div className="mt-8 flex justify-center">
            <ArchiveViewSwitch current="list" />
          </div>
        </motion.div>
      </section>

      {/* 筛选 */}
      <ArchiveFilters
        items={items}
        value={filter}
        onChange={setFilter}
        resultCount={filtered.length}
      />

      {/* 列表 */}
      <section className="px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl">
          {loading ? (
            <div className="text-center py-20 text-ink-400 font-serif tracking-wider">
              正在取出档案盒…
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {filtered.map((item) => (
                <ArchiveCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <p className="font-serif text-ink-400 text-lg mb-2">这个角落空着。</p>
      <p className="text-ink-300 text-sm">换一组筛选条件试试。</p>
    </div>
  );
}
