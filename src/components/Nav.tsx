"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "首页" },
  { href: "/museum", label: "展馆" },
  { href: "/archive", label: "原件库" },
  { href: "/write", label: "写一封" },
  { href: "/wall", label: "侨批墙" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 backdrop-blur-sm bg-paper-100/70 border-b border-ink-300/20">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-serif text-ink-500 text-base sm:text-lg tracking-wider"
        >
          侨 · 批
        </Link>
        <ul className="flex gap-3 sm:gap-6 text-sm sm:text-base font-serif">
          {items.map((it) => {
            const active =
              pathname === it.href ||
              (it.href !== "/" && pathname.startsWith(it.href + "/"));
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  className={`relative transition-colors ${
                    active
                      ? "text-seal-500"
                      : "text-ink-400 hover:text-ink-500"
                  }`}
                >
                  {it.label}
                  {active && (
                    <span className="absolute -bottom-1 left-0 right-0 h-px bg-seal-500/60" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
