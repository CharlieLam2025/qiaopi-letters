// 仅服务端使用的 Supabase 客户端（API route 用）。
// 用 service_role key，不走 RLS，可以做 rate-limit、过滤等服务端逻辑。
//
// 千万不要 import 到客户端组件！否则 service_role key 会被打包到浏览器里。

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
// 优先 service_role；如果没配，退回 anon（功能受 RLS 限制）
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseServer: SupabaseClient | null =
  url && key
    ? createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

export const isSupabaseServerConfigured = !!supabaseServer;
