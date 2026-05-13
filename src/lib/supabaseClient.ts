import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Supabase 客户端：仅当环境变量配好时才创建实例
// 列表/详情页通过 archiveStore 间接使用；未配置时静默回退到 mock 数据
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseConfigured = !!supabase;
