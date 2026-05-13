"use client";

import { motion } from "framer-motion";

interface Event {
  year: string;
  title: string;
  body: string;
}

const events: Event[] = [
  {
    year: "1840 年代",
    title: "鸦片战争后",
    body: "沿海民生凋敝，闽粤一带的青壮年开始把眼光投向海外，去寻一口饭吃。",
  },
  {
    year: "1860 年代",
    title: "清廷开放出洋",
    body: "海禁松动，劳工合法出洋。从此，南洋成了一种命运。",
  },
  {
    year: "1880–1920",
    title: "下南洋",
    body: "契约劳工、自由谋生者，乘坐「红头船」「猪仔船」漂向新加坡、马来亚、暹罗、爪哇。",
  },
  {
    year: "1930 年代",
    title: "抗战烽火",
    body: "海外华侨集体捐款救国。每一封侨批里，都夹着家国二字。",
  },
  {
    year: "1940–1950",
    title: "战乱与变迁",
    body: "战争阻隔了信路，许多侨批晚了一年才到，许多人，永远没等到。",
  },
];

export default function Timeline() {
  return (
    <div className="relative">
      {/* 中央竖线 */}
      <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-ink-300/40 -translate-x-1/2 sm:-translate-x-1/2" />

      <ul className="space-y-12 sm:space-y-20">
        {events.map((ev, i) => {
          const isLeft = i % 2 === 0;
          return (
            <motion.li
              key={ev.year}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
              className={`relative flex flex-col sm:flex-row ${
                isLeft ? "sm:justify-start" : "sm:justify-end"
              }`}
            >
              {/* 节点圆 */}
              <span className="absolute left-4 sm:left-1/2 top-2 -translate-x-1/2 z-10">
                <span className="block h-3 w-3 rounded-full bg-seal-500 ring-4 ring-paper-100" />
              </span>
              {/* 内容卡片 */}
              <div
                className={`pl-12 sm:pl-0 sm:w-[44%] ${
                  isLeft ? "sm:pr-10 sm:text-right" : "sm:pl-10"
                }`}
              >
                <div className="text-seal-500 font-serif text-sm tracking-widest mb-1">
                  {ev.year}
                </div>
                <h3 className="font-serif text-ink-500 text-xl mb-2">{ev.title}</h3>
                <p className="text-ink-400 leading-loose text-[15px]">{ev.body}</p>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
