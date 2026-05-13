// 原件库的数据访问层。
// - 优先尝试 Supabase（如果环境变量已配置）
// - 失败 / 表为空 / 未配置时回退到 MOCK_ARCHIVE_ITEMS
// 让 UI 层（list / detail page）完全不关心数据来源。

import type { QiaopiItem } from "./archiveTypes";
import { MOCK_ARCHIVE_ITEMS } from "./archiveMock";
import { supabase } from "./supabaseClient";

const TABLE = "qiaopi_items";

export async function fetchArchiveItems(): Promise<QiaopiItem[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from(TABLE).select("*").order("year", { ascending: true });
      if (!error && data && data.length > 0) {
        return data as unknown as QiaopiItem[];
      }
    } catch {
      // 静默回退
    }
  }
  return MOCK_ARCHIVE_ITEMS;
}

export async function fetchArchiveItemById(id: string): Promise<QiaopiItem | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (!error && data) {
        return data as unknown as QiaopiItem;
      }
    } catch {
      // 静默回退
    }
  }
  return MOCK_ARCHIVE_ITEMS.find((i) => i.id === id) ?? null;
}
