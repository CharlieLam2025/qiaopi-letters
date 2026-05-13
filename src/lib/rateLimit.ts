// 极简内存级 rate-limit。用于保护 /api/compose 和 /api/wall 不被薅 token。
// 注意：单实例进程内有效；要做更严肃的限流上 Redis / Vercel KV / Upstash。

type Bucket = { times: number[]; daily: { count: number; resetAt: number } };
const store = new Map<string, Bucket>();

function getBucket(key: string): Bucket {
  let b = store.get(key);
  if (!b) {
    b = { times: [], daily: { count: 0, resetAt: nextDayUtc() } };
    store.set(key, b);
  }
  return b;
}

function nextDayUtc(): number {
  const d = new Date();
  d.setUTCHours(24, 0, 0, 0);
  return d.getTime();
}

interface Window {
  windowMs: number;
  max: number;
}

export interface CheckResult {
  ok: boolean;
  reason?: string;
  retryAfterMs?: number;
}

/**
 * 同时检查 短窗口 + 全天 两层限制。
 * 任何一层超限就返回 ok: false。
 */
export function check(
  key: string,
  shortWindow: Window,
  dailyMax: number
): CheckResult {
  const now = Date.now();
  const b = getBucket(key);

  // 短窗口
  b.times = b.times.filter((t) => now - t < shortWindow.windowMs);
  if (b.times.length >= shortWindow.max) {
    const oldest = b.times[0] ?? now;
    return {
      ok: false,
      reason: `请稍后再试，${Math.ceil(shortWindow.windowMs / 1000)} 秒内最多 ${shortWindow.max} 次。`,
      retryAfterMs: shortWindow.windowMs - (now - oldest),
    };
  }

  // 全天
  if (b.daily.resetAt < now) {
    b.daily = { count: 0, resetAt: nextDayUtc() };
  }
  if (b.daily.count >= dailyMax) {
    return {
      ok: false,
      reason: `今天已达上限（${dailyMax} 次），明天再来。`,
      retryAfterMs: b.daily.resetAt - now,
    };
  }

  b.times.push(now);
  b.daily.count += 1;
  return { ok: true };
}

// 把 Next.js Request 的 IP 抠出来，作为 rate-limit 的 key
export function clientKey(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xri = req.headers.get("x-real-ip");
  if (xri) return xri;
  return "anon";
}
