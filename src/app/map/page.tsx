"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import QiaopiMap from "@/components/QiaopiMap";
import ArchiveViewSwitch from "@/components/ArchiveViewSwitch";
import { fetchArchiveItems } from "@/lib/archiveStore";
import type { QiaopiItem } from "@/lib/archiveTypes";

export default function MapPage() {
  const [items, setItems] = useState<QiaopiItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      {/* 标题 */}
      <section className="px-4 pt-12 pb-6 sm:pt-20 sm:pb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="font-serif text-ink-300 text-xs sm:text-sm tracking-[0.5em] mb-4">
            侨 批 地 图
          </div>
          <h1 className="font-serif text-ink-500 text-3xl sm:text-5xl tracking-wide mb-3">
            一张海图，<br className="sm:hidden" />一百年的来回
          </h1>
          <p className="text-ink-400 text-sm sm:text-base tracking-wider max-w-xl mx-auto leading-loose">
            每一条线，
            <br className="sm:hidden" />
            都是一封侨批走过的路。
          </p>
        </motion.div>

        <div className="mt-8 flex justify-center">
          <ArchiveViewSwitch current="map" />
        </div>
      </section>

      {/* 地图 */}
      <section className="px-4 pb-12 sm:pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.2 }}
          className="mx-auto max-w-6xl border border-ink-300/40 bg-paper-100/40 p-2 sm:p-4"
        >
          {loading ? (
            <div className="text-center py-20 text-ink-400 font-serif tracking-wider">
              正在展开海图…
            </div>
          ) : (
            <QiaopiMap items={items} />
          )}
        </motion.div>
        <div className="mt-4 text-center text-ink-300 text-xs tracking-widest">
          ※ 仅作示意 · 城市位置与航线均为简化呈现
        </div>
      </section>

      {/* 说明 */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-2xl space-y-5 text-ink-400 text-[15px] leading-[2]">
          <p>
            十九世纪到二十世纪中叶的一百多年里，
            数以百万计的福建、广东、海南人离开沿海村落，
            搭船去新加坡、槟城、雅加达、西贡、马尼拉⋯⋯
          </p>
          <p>
            他们在那里做工、卖布、教书、跑船。
            每隔一段时间，就有一封"批"，被托付给水客和批局，
            一路坐船回到大陆的村口。
          </p>
          <p>
            图上每一条弧线，
            就是其中一封信的路线。
            悬停或点击，能看到它的故事。
          </p>
        </div>
      </section>
    </div>
  );
}
