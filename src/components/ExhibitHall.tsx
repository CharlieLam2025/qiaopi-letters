"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  number: string; // "一" "二" ...
  title: string;
  subtitle?: string;
  children: ReactNode;
  id?: string;
}

export default function ExhibitHall({ number, title, subtitle, children, id }: Props) {
  return (
    <section id={id} className="py-20 sm:py-28 px-4 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          className="mb-10 sm:mb-14"
        >
          <div className="flex items-baseline gap-4 mb-3">
            <span className="font-serif text-seal-500 text-sm tracking-[0.3em]">
              展厅 {number}
            </span>
            <span className="h-px flex-1 bg-ink-300/30" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink-500 mb-3 leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-ink-400/80 text-base sm:text-lg leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
