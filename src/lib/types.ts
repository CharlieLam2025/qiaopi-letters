export type LetterTone = "modern" | "gentle" | "restrained" | "classical";
export type LetterTheme = "想念" | "感谢" | "亏欠" | "告别" | "报平安";

export interface Letter {
  id: string;
  to: string;
  from: string;
  destination: string;
  body: string;
  tone: LetterTone;
  theme: LetterTheme;
  isPublic: boolean;
  createdAt: string; // ISO
}

export const TONE_LABELS: Record<LetterTone, string> = {
  modern: "现代白话",
  gentle: "温柔家书",
  restrained: "克制含蓄",
  classical: "旧式家书",
};

export const TONE_HINTS: Record<LetterTone, string> = {
  modern: "用你日常会说的话，把心里话讲出来。",
  gentle: "像在小声说话，多用'你''我'，不必押韵，温润就好。",
  restrained: "话不必说尽，留白也是话。",
  classical: "如旧式家书：开头称呼，结尾'敬颂台安'。",
};

export const THEMES: LetterTheme[] = ["想念", "感谢", "亏欠", "告别", "报平安"];
