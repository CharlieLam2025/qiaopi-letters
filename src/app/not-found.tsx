"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Postmark from "@/components/Postmark";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
        className="text-center relative"
      >
        <div className="mx-auto w-32 mb-8 opacity-80">
          <Postmark city="无此地" date="—" size={128} rotate={-6} />
        </div>
        <div className="font-serif text-ink-300 text-xs sm:text-sm tracking-[0.5em] mb-3">
          这 封 信 寄 错 了
        </div>
        <h1 className="font-serif text-ink-500 text-3xl sm:text-4xl tracking-wide mb-6 leading-tight">
          没有找到这一页
        </h1>
        <p className="text-ink-400 text-sm sm:text-base leading-loose tracking-wider max-w-md mx-auto mb-10">
          也许是地址写错了，
          <br />
          也许这一页被风吹走了。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-secondary">
            回到首页
          </Link>
          <Link href="/archive" className="btn-seal">
            去翻一翻原件库 →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
