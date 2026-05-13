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
  /** 落款署名（可选）。留空时根据 tone + 收信人关系自动选默认。 */
  signature?: string;
}

// ── 落款署名 ──────────────────────────────────────────────
// 真侨批底部都有"儿 xx 谨上""孙 拜上""夫 上"这样的落款。
// 用户没填时按 tone + 用户输入的 "to" 字段猜一个合适的默认值。

export function defaultSignature(opts: { tone: LetterTone; to: string }): string {
  const { tone, to } = opts;
  const t = (to || "").trim();

  // 旧式家书：按称谓选自称 + 敬语
  if (tone === "classical") {
    if (/(母|妈|娘)/.test(t)) return "儿 谨上";
    if (/(父|爸|爹)/.test(t)) return "不肖男 拜上";
    if (/(嬷|奶奶|外婆|祖母)/.test(t)) return "孙 拜上";
    if (/(祖父|爷爷|公公)/.test(t)) return "孙 谨上";
    if (/(妻|内子|夫人)/.test(t)) return "夫 上";
    if (/(夫|官人)/.test(t)) return "妻 上";
    if (/(兄|哥)/.test(t)) return "弟 谨上";
    if (/(弟)/.test(t)) return "兄 上";
    if (/(姊|姐)/.test(t)) return "妹 上";
    if (/(妹)/.test(t)) return "兄 上";
    if (/(儿|子|孩)/.test(t)) return "父 上";
    return "晚辈 谨上";
  }

  // 温柔家书
  if (tone === "gentle") {
    return "—— 想念你的人";
  }
  // 克制含蓄
  if (tone === "restrained") {
    return "——";
  }
  // 现代白话
  return "——  写信的人";
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
