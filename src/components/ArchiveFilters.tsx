"use client";

import { useMemo } from "react";
import { DECADES, type QiaopiItem } from "@/lib/archiveTypes";

export interface FilterState {
  keyword: string;
  decade: string; // "全部" or DecadeBucket.key
  fromCity: string; // "全部" or fromCity 值
  toProvince: string; // "全部" or toProvince 值
  relation: string; // "全部" or receiverRelation 值
  theme: string; // "全部" or theme
}

export const INITIAL_FILTERS: FilterState = {
  keyword: "",
  decade: "全部",
  fromCity: "全部",
  toProvince: "全部",
  relation: "全部",
  theme: "全部",
};

interface Props {
  items: QiaopiItem[];
  value: FilterState;
  onChange: (v: FilterState) => void;
  resultCount: number;
}

// 用户可见的筛选条
export default function ArchiveFilters({ items, value, onChange, resultCount }: Props) {
  // 候选项从全部 items 中归纳（保留出现顺序，去重）
  const fromCities = useMemo(() => uniqueOf(items, (i) => i.fromCity), [items]);
  const toProvinces = useMemo(() => uniqueOf(items, (i) => i.toProvince), [items]);
  const relations = useMemo(() => uniqueOf(items, (i) => i.receiverRelation), [items]);
  const themes = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => i.themes.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [items]);

  function set<K extends keyof FilterState>(k: K, v: FilterState[K]) {
    onChange({ ...value, [k]: v });
  }

  return (
    <section className="border-t border-b border-ink-300/30 bg-paper-100/40 py-5 sm:py-6">
      <div className="mx-auto max-w-6xl px-4 space-y-4">
        {/* 搜索框 + 结果计数 */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end sm:justify-between">
          <div className="flex-1 max-w-md">
            <label className="block text-xs font-serif text-ink-300 tracking-widest mb-1">
              检索
            </label>
            <input
              type="text"
              value={value.keyword}
              onChange={(e) => set("keyword", e.target.value)}
              placeholder="按标题、收信人、地名、关键字检索…"
              className="w-full bg-transparent border-b border-ink-300/60 focus:border-seal-500 focus:outline-none text-ink-500 font-serif text-base py-2 transition-colors"
            />
          </div>
          <div className="text-ink-300 text-xs sm:text-sm font-serif tracking-widest">
            共 <span className="text-ink-500">{resultCount}</span> 件
          </div>
        </div>

        {/* 五行筛选 */}
        <FilterRow
          label="年代"
          options={[
            { key: "全部", label: "全部" },
            ...DECADES.map((d) => ({ key: d.key, label: d.label })),
          ]}
          value={value.decade}
          onChange={(v) => set("decade", v)}
        />
        <FilterRow
          label="寄出地"
          options={prependAll(fromCities)}
          value={value.fromCity}
          onChange={(v) => set("fromCity", v)}
        />
        <FilterRow
          label="收批地"
          options={prependAll(toProvinces)}
          value={value.toProvince}
          onChange={(v) => set("toProvince", v)}
        />
        <FilterRow
          label="收信人关系"
          options={prependAll(relations)}
          value={value.relation}
          onChange={(v) => set("relation", v)}
        />
        <FilterRow
          label="主题"
          options={prependAll(themes)}
          value={value.theme}
          onChange={(v) => set("theme", v)}
        />
      </div>
    </section>
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { key: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
      <div className="text-ink-300 text-xs font-serif tracking-widest min-w-[5em] sm:text-right">
        {label}
      </div>
      <div className="-mx-1 overflow-x-auto sm:overflow-visible">
        <div className="flex flex-nowrap sm:flex-wrap gap-1.5 px-1 sm:px-0 pb-1 sm:pb-0">
          {options.map((opt) => {
            const active = opt.key === value;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => onChange(opt.key)}
                className={`shrink-0 px-3 py-1.5 font-serif text-xs sm:text-[13px] tracking-wider border transition-colors whitespace-nowrap ${
                  active
                    ? "bg-ink-500 text-paper-100 border-ink-500"
                    : "bg-transparent text-ink-400 border-ink-300/40 hover:border-ink-400"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function uniqueOf(items: QiaopiItem[], pick: (i: QiaopiItem) => string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const i of items) {
    const v = pick(i);
    if (v && !seen.has(v)) {
      seen.add(v);
      out.push(v);
    }
  }
  return out;
}

function prependAll(arr: string[]): { key: string; label: string }[] {
  return [{ key: "全部", label: "全部" }, ...arr.map((v) => ({ key: v, label: v }))];
}

// 筛选 + 关键字检索：在列表页中调用
export function applyFilters(items: QiaopiItem[], f: FilterState): QiaopiItem[] {
  const kw = f.keyword.trim();
  const decade = DECADES.find((d) => d.key === f.decade);
  return items.filter((i) => {
    if (decade && !decade.match(i.year)) return false;
    if (f.fromCity !== "全部" && i.fromCity !== f.fromCity) return false;
    if (f.toProvince !== "全部" && i.toProvince !== f.toProvince) return false;
    if (f.relation !== "全部" && i.receiverRelation !== f.relation) return false;
    if (f.theme !== "全部" && !i.themes.includes(f.theme)) return false;
    if (kw) {
      const hay = [
        i.title,
        i.sender,
        i.receiver,
        i.fromCity,
        i.fromCountry,
        i.toProvince,
        i.toCity,
        i.toVillage,
        i.transcription,
        i.modernExplanation,
        i.themes.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(kw.toLowerCase())) return false;
    }
    return true;
  });
}
