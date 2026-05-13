export type ArchiveImageKind =
  | "envelope-front"
  | "envelope-back"
  | "letter"
  | "remittance";

export interface ArchiveImage {
  kind: ArchiveImageKind;
  label: string;
  // url 形式：
  //   "generated:<kind>" —— 由本地 SVG 生成器渲染（mock 阶段使用）
  //   完整 URL          —— 后续接 Supabase Storage / R2 时填入
  url: string;
  width?: number;
  height?: number;
}

export interface QiaopiItem {
  id: string;
  title: string;
  year: string; // "1928" / "约1893"
  dateText: string; // 原档上的日期表述，如 "戊辰年冬月初十"
  fromCountry: string; // 寄出国家/属地
  fromCity: string; // 寄出城市/区
  toProvince: string; // 收批省
  toCity: string; // 收批府/市/县
  toVillage: string; // 收批乡/村
  sender: string;
  receiver: string;
  receiverRelation: string; // "母亲" / "妻子" / "兄长" ...
  amount: string; // 数字字符串，留空白代表未注明
  currency: string; // "叻币" / "大洋" / "国币" / "港币" ...
  qiaopiOffice: string; // 批局名（mock 中均为示例性表述）
  themes: string[];
  images: ArchiveImage[];
  transcription: string; // 原文转写（保留换行，作为竖排呈现）
  modernExplanation: string; // 白话解读
  historicalNotes: string; // 历史注释
  sourceName: string;
  sourceUrl: string;
  rightsNote: string;
}

export const KIND_LABELS: Record<ArchiveImageKind, string> = {
  "envelope-front": "信封正面",
  "envelope-back": "信封背面",
  letter: "内信",
  remittance: "汇款凭证",
};

// 列表页可用作筛选选项
export const ARCHIVE_THEMES = [
  "报平安",
  "汇款",
  "想念",
  "告别",
  "家事",
  "抗战",
  "学业",
  "商务",
  "宗族",
  "病故",
] as const;

export type ArchiveTheme = (typeof ARCHIVE_THEMES)[number];

// 年代分桶（按 30 年为段，覆盖 1880–1959）
export interface DecadeBucket {
  key: string;
  label: string;
  match: (year: string) => boolean;
}

export const DECADES: DecadeBucket[] = [
  {
    key: "1880-1909",
    label: "1880—1909（红头船时代）",
    match: (y) => parseYear(y) >= 1880 && parseYear(y) <= 1909,
  },
  {
    key: "1910-1929",
    label: "1910—1929",
    match: (y) => parseYear(y) >= 1910 && parseYear(y) <= 1929,
  },
  {
    key: "1930-1945",
    label: "1930—1945（抗战时期）",
    match: (y) => parseYear(y) >= 1930 && parseYear(y) <= 1945,
  },
  {
    key: "1946-1959",
    label: "1946—1959（战后）",
    match: (y) => parseYear(y) >= 1946 && parseYear(y) <= 1959,
  },
];

export function parseYear(y: string): number {
  const m = y.match(/\d{4}/);
  return m ? parseInt(m[0], 10) : 0;
}
