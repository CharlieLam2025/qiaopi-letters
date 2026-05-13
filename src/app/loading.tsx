"use client";

// 全局 loading（Next.js App Router 自动在 page transitions 时显示）
export default function Loading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4 py-16">
      <div className="text-center">
        <div className="font-serif text-ink-300 text-xs sm:text-sm tracking-[0.5em] mb-3 animate-slow-pulse">
          ※ 正 在 展 开 纸 张 ※
        </div>
        <div className="text-ink-400/70 text-sm tracking-wider font-serif">
          慢一点，别急。
        </div>
      </div>
    </div>
  );
}
