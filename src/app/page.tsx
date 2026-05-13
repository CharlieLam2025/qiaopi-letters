"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import RedSeal from "@/components/RedSeal";
import Postmark from "@/components/Postmark";
import FoldedLetter from "@/components/FoldedLetter";
import RedHeadShip from "@/components/decorations/RedHeadShip";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.4, delay, ease: [0.4, 0, 0.2, 1] as const },
  }),
};

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* 主屏 */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-16 sm:py-24">
        {/* 角落的装饰邮戳/印章 */}
        <motion.div
          className="absolute top-6 right-4 sm:top-10 sm:right-12 opacity-70"
          initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
          animate={{ opacity: 0.75, scale: 1, rotate: 12 }}
          transition={{ duration: 1.8, delay: 1.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <Postmark city="侨乡" date="1948.03.12" size={120} rotate={0} />
        </motion.div>
        <motion.div
          className="absolute bottom-10 left-4 sm:bottom-16 sm:left-12 opacity-70 hidden sm:block"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.7, scale: 1 }}
          transition={{ duration: 1.8, delay: 1.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <RedSeal text="如晤" size={110} rotate={-8} />
        </motion.div>

        <div className="mx-auto max-w-3xl text-center">
          {/* 一张折叠的信纸装饰 */}
          <motion.div
            className="mx-auto w-[180px] sm:w-[240px] mb-10 drift"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <FoldedLetter />
          </motion.div>

          {/* 小副标 */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            custom={0.2}
            className="font-serif text-ink-300 text-xs sm:text-sm tracking-[0.4em] mb-6"
          >
            一 座 线 上 纪 念 馆
          </motion.div>

          {/* 主标题 */}
          <motion.h1
            variants={fadeIn}
            initial="hidden"
            animate="show"
            custom={0.5}
            className="font-serif text-ink-500 text-4xl sm:text-6xl leading-tight tracking-wide mb-8"
          >
            《写给远方的
            <br className="sm:hidden" />
            一封侨批》
          </motion.h1>

          {/* 副标题 */}
          <motion.p
            variants={fadeIn}
            initial="hidden"
            animate="show"
            custom={0.9}
            className="text-ink-400 text-base sm:text-lg leading-[2.2] tracking-wide max-w-xl mx-auto"
          >
            有些话，
            <br className="sm:hidden" />
            当年漂洋过海才送到；
            <br />
            今天，
            <br className="sm:hidden" />
            我们重新把它写下来。
          </motion.p>

          {/* 分隔小符号 */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            custom={1.2}
            className="my-12 flex items-center justify-center gap-4"
          >
            <span className="h-px w-12 bg-ink-300/50" />
            <span className="text-ink-300 text-sm">※</span>
            <span className="h-px w-12 bg-ink-300/50" />
          </motion.div>

          {/* 按钮组 */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            custom={1.5}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center"
          >
            <Link href="/museum" className="btn-secondary w-full sm:w-auto">
              进入线上展馆
            </Link>
            <Link href="/write" className="btn-seal w-full sm:w-auto">
              写一封侨批
            </Link>
          </motion.div>

          {/* 灵感来源 */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            custom={1.9}
            className="mt-20 text-ink-300 text-xs sm:text-sm leading-loose tracking-wider"
          >
            灵感来自电影《给阿嬷的情书》
            <br />
            与列入联合国教科文组织世界记忆名录的"侨批档案"
          </motion.div>
        </div>
      </section>

      {/* 衔接装饰：一艘红头船向左漂 */}
      <section className="relative -mt-4 sm:-mt-12 pb-10 sm:pb-20 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 0.85, x: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 2.4, ease: [0.4, 0, 0.2, 1] }}
          className="mx-auto max-w-3xl drift"
        >
          <div className="flex justify-end pr-4 sm:pr-12">
            <RedHeadShip width={220} className="opacity-90" />
          </div>
          <div className="text-center text-ink-300 text-[11px] sm:text-xs tracking-[0.4em] font-serif mt-2">
            ※ 红 头 船 · 一 个 月 才 到 南 洋 ※
          </div>
        </motion.div>
      </section>

      {/* 第二屏：三句引言 */}
      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl space-y-20">
          {[
            {
              text: "一封侨批，一锭银，\n半个家庭的命运。",
              meta: "1880—1950 · 闽粤侨乡口述",
            },
            {
              text: "船开了一个月才到南洋，\n信走了两个月才回家。",
              meta: "海路 · 红头船时代",
            },
            {
              text: "我们今天还需要写信吗？\n也许不是给远方，\n是给那些没来得及说的话。",
              meta: "—— 写在 2026",
            },
          ].map((q, i) => (
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20% 0px" }}
              transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
              className="text-center"
            >
              <p className="font-serif text-ink-500 text-xl sm:text-2xl leading-[2.2] whitespace-pre-line">
                {q.text}
              </p>
              <footer className="mt-4 text-ink-300 text-xs sm:text-sm tracking-widest">
                {q.meta}
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </section>

      {/* 第三屏：原件库引导 */}
      <section className="px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
            className="grid sm:grid-cols-[1fr_auto] gap-8 sm:gap-12 items-center border-t border-b border-ink-300/40 py-12 sm:py-14"
          >
            <div>
              <div className="text-seal-500 text-xs sm:text-sm tracking-[0.4em] font-serif mb-3">
                原 · 件 · 库
              </div>
              <h3 className="font-serif text-ink-500 text-2xl sm:text-3xl tracking-wide leading-tight mb-4">
                先去翻一翻
                <br />
                别人留下的家书
              </h3>
              <p className="text-ink-400 text-sm sm:text-base leading-loose tracking-wide max-w-md">
                十二件占位样本，
                <br className="sm:hidden" />
                从光绪十九年的红头船时代，
                <br />
                到 1952 年战后的香港转汇。
                <br />
                每一件都附原文转写、白话解读、历史注释。
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <Link href="/archive" className="btn-secondary text-sm">
                翻阅原件 →
              </Link>
              <Link
                href="/map"
                className="text-ink-300 text-xs sm:text-sm tracking-widest font-serif hover:text-seal-500 transition-colors"
              >
                ※ 或者看一张地图 ※
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
