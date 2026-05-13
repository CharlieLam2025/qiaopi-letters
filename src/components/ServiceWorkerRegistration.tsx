"use client";

import { useEffect } from "react";

/**
 * 客户端注册 /sw.js。
 * 只在 production 上注册（dev 不要，避免开发热重载冲突）。
 */
export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;
    const onLoad = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // 忽略：失败也不影响主功能
      });
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);
  return null;
}
