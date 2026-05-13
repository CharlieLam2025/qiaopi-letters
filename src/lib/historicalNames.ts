// 把"现代地名"转成"1880—1950 年代侨批里的叫法"。
//
// 设计原则：
// 1. 只替换有明显时代差异的（新加坡 → 叻埠）。如果现代名与旧名相同 / 接近
//    （潮州、揭阳、文昌等），保持现代名以免显得做作。
// 2. 优先匹配较长的字符串，避免 "深圳市" 中的 "圳" 被误替换。
// 3. 替换时在原字符串里做整段 replace，保留前后缀（如 "新加坡 牛车水" → "叻埠 牛车水"）。
//
// 这是一份**示意性映射**，并不严格还原历史每一个时期的称谓。
// 真正侨批里同一地点也可能用多种叫法（叻埠/石叻/新加坡都见过）。

interface NameMapping {
  modern: string;
  historical: string;
  /** 是否需要在主名旁加一个简短注解（如"美国"→"花旗国"） */
  showAka?: boolean;
}

// 顺序：长的在前面，避免短名抢匹配
const MAP: NameMapping[] = [
  // ── 南洋（寄出地）──────────────────────
  { modern: "新加坡市", historical: "叻埠" },
  { modern: "新加坡", historical: "叻埠" },
  { modern: "槟城", historical: "槟榔屿" },
  { modern: "雅加达", historical: "巴城" },
  { modern: "曼谷", historical: "暹京" },
  { modern: "马尼拉", historical: "岷里拉" },
  { modern: "西贡市", historical: "西贡" },
  { modern: "胡志明市", historical: "西贡" },
  { modern: "金边", historical: "金边" }, // 一致
  { modern: "万象", historical: "万象" }, // 一致
  { modern: "仰光", historical: "仰光" }, // 一致
  { modern: "怡保", historical: "怡保" }, // 一致
  { modern: "吉隆坡", historical: "吉隆坡" }, // 一致
  { modern: "万隆", historical: "万隆" }, // 一致
  { modern: "泗水", historical: "泗水" }, // 一致
  { modern: "棉兰", historical: "棉兰" }, // 一致

  // 国家
  { modern: "印度尼西亚", historical: "荷属东印度" },
  { modern: "印尼", historical: "荷属东印" },
  { modern: "马来西亚", historical: "马来亚" },
  { modern: "马来亚", historical: "马来亚" },
  { modern: "越南", historical: "安南" },
  { modern: "缅甸", historical: "缅甸" },
  { modern: "泰国", historical: "暹罗" },
  { modern: "菲律宾", historical: "菲律宾" },
  { modern: "美国", historical: "花旗国" },
  { modern: "英国", historical: "英吉利" },
  { modern: "日本", historical: "东瀛" },

  // 中国大城市（侨民出发或中转地）
  { modern: "深圳", historical: "宝安" },
  { modern: "广州", historical: "羊城" },
  { modern: "上海", historical: "申江" },
  { modern: "北京", historical: "北平" },
  { modern: "天津", historical: "津门" },
  { modern: "杭州", historical: "武林" },
  { modern: "苏州", historical: "姑苏" },
  { modern: "南京", historical: "金陵" },
  { modern: "成都", historical: "锦官城" },
  { modern: "重庆", historical: "渝州" },
  { modern: "武汉", historical: "鄂城" },
  { modern: "香港", historical: "香江" },
  { modern: "澳门", historical: "濠镜" },
  { modern: "台北", historical: "艋舺" },

  // ── 侨乡（收件地）──────────────────────
  { modern: "厦门", historical: "鹭岛" },
  { modern: "福州", historical: "三山" },
  { modern: "汕头", historical: "鮀城" },
  { modern: "梅州", historical: "嘉应州" },
  { modern: "梅县", historical: "嘉应州" },
  { modern: "台山", historical: "新宁" },
  { modern: "莆田", historical: "兴化" },
];

// 长度倒序排序确保长名先匹配
const SORTED = [...MAP].sort((a, b) => b.modern.length - a.modern.length);

/**
 * 把字符串里所有出现的现代地名替换成那个年代的叫法。
 * 如果某个匹配项 modern === historical，等于什么都不改。
 */
export function toHistoricalPlace(input: string): string {
  if (!input) return input;
  let out = input;
  for (const m of SORTED) {
    if (m.modern === m.historical) continue;
    if (out.includes(m.modern)) {
      out = out.split(m.modern).join(m.historical);
    }
  }
  return out;
}

/** 取一个简短的城市名（去掉省/国家前缀，截断），用于邮戳印 */
export function shortHistoricalCity(input: string): string {
  const h = toHistoricalPlace(input);
  return h.replace(/[省市县区府国岛屿都]/g, "").trim().slice(0, 4) || "侨乡";
}
