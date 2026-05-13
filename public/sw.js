// 最小可用的 Service Worker。
// 作用：让浏览器把站点识别为 "installable PWA"，从而触发"安装到桌面"提示。
// 策略：network-first，无主动缓存（避免 Next.js App Router 的 RSC 缓存被破坏）。
// 离线 fallback：navigation 失败时返回首页 HTML 的最后一次缓存。

const CACHE = "qiaopi-shell-v1";
const SHELL = ["/", "/manifest.json", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(SHELL).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  // 只处理同源 GET
  if (req.method !== "GET" || !req.url.startsWith(self.location.origin)) return;
  // 不缓存 API
  if (req.url.includes("/api/")) return;
  // navigation：先 network，失败回首页
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() =>
        caches.match("/").then((r) => r || new Response("离线了。请联网后再试。", { status: 503 }))
      )
    );
    return;
  }
});
