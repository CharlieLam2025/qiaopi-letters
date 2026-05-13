"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  // 16:9 vs 3:4：信封正面用横向，内信和凭证更高
  aspect?: "portrait" | "landscape";
  // 可选：用于将来扩展（例如跨条目导航时强制重建）
  fadeKey?: string;
}

// OpenSeadragon 的 UI 图标资源，直接走 CDN 避免把二进制塞进 /public
const OSD_PREFIX = "https://cdn.jsdelivr.net/npm/openseadragon@4.1.1/build/openseadragon/images/";

export default function ArchiveViewer({ src, aspect = "portrait", fadeKey }: Props) {
  const elRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<unknown>(null); // OpenSeadragon.Viewer 实例
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初始化（只跑一次）
  useEffect(() => {
    let cancelled = false;
    let viewer: any;

    // 等容器拿到真实尺寸再初始化 OSD（否则 aspect-ratio 还没参与计算时
    // OSD 会用 clientHeight=1 创建 canvas，主图就渲不出来）
    function waitForSize(): Promise<void> {
      return new Promise((resolve) => {
        const el = elRef.current;
        if (!el) return resolve();
        if (el.clientWidth > 10 && el.clientHeight > 10) return resolve();
        const ro = new ResizeObserver(() => {
          if (el.clientWidth > 10 && el.clientHeight > 10) {
            ro.disconnect();
            resolve();
          }
        });
        ro.observe(el);
        // 兜底超时
        setTimeout(() => {
          ro.disconnect();
          resolve();
        }, 1500);
      });
    }

    (async () => {
      try {
        await waitForSize();
        if (cancelled) return;
        const OpenSeadragon = (await import("openseadragon")).default;
        if (cancelled || !elRef.current) return;

        viewer = OpenSeadragon({
          element: elRef.current,
          prefixUrl: OSD_PREFIX,
          tileSources: { type: "image", url: src },
          // 完全关闭 OSD 默认导航条：我们自己画了 +/−/○ 按钮。
          // 这样也避免去 CDN 拉 zoomin_rest.png 等图片造成 404。
          showNavigationControl: false,
          showNavigator: false,
          gestureSettingsMouse: { clickToZoom: false, dblClickToZoom: true },
          gestureSettingsTouch: { pinchToZoom: true, dragToPan: true },
          minZoomImageRatio: 1,
          maxZoomPixelRatio: 4,
          visibilityRatio: 1,
          constrainDuringPan: true,
          animationTime: 0.7,
          springStiffness: 8,
          immediateRender: false,
        });
        viewerRef.current = viewer;

        viewer.addHandler("open", () => setLoading(false));
        viewer.addHandler("open-failed", () => {
          setLoading(false);
          setError("加载失败");
        });
      } catch (e) {
        if (!cancelled) {
          setLoading(false);
          setError("OpenSeadragon 初始化失败");
          console.error(e);
        }
      }
    })();

    return () => {
      cancelled = true;
      try {
        viewer?.destroy?.();
      } catch {
        /* ignore */
      }
      viewerRef.current = null;
    };
    // 故意只在挂载时跑一次。src 切换通过下面的副作用处理。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 切换图源：复用 viewer，调用 open 切换
  useEffect(() => {
    const v = viewerRef.current as any;
    if (!v) return;
    setLoading(true);
    setError(null);
    try {
      v.open({ type: "image", url: src });
    } catch (e) {
      console.error(e);
      setError("切换图源失败");
      setLoading(false);
    }
  }, [src]);

  function zoomBy(factor: number) {
    const v = viewerRef.current as any;
    if (!v) return;
    v.viewport.zoomBy(factor);
    v.viewport.applyConstraints();
  }
  function reset() {
    const v = viewerRef.current as any;
    if (!v) return;
    v.viewport.goHome();
  }

  return (
    <div
      className={`relative w-full bg-ink-700/95 ${
        aspect === "portrait"
          ? "aspect-[3/4] min-h-[420px] sm:min-h-[560px] lg:min-h-[640px]"
          : "aspect-[4/3] min-h-[320px] sm:min-h-[420px] lg:min-h-[480px]"
      }`}
    >
      {/* 主舞台：用 w-full h-full 而不是 absolute inset-0 — OSD 接管时会改 position，
          absolute 会导致 container 实际高度归零，canvas 高度 1px。 */}
      <div ref={elRef} className="w-full h-full" />

      {/* 状态层 */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center text-paper-200 text-sm font-serif tracking-wider pointer-events-none">
          正在展开…
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-seal-400 text-sm font-serif">
          {error}
        </div>
      )}

      {/* 自定义控件：右下角竖排 */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1.5">
        <ToolButton onClick={() => zoomBy(1.4)} label="+" title="放大" />
        <ToolButton onClick={() => zoomBy(1 / 1.4)} label="−" title="缩小" />
        <ToolButton onClick={reset} label="○" title="复位" />
      </div>

      {/* 操作提示（仅初次） */}
      {!loading && !error && (
        <div className="absolute top-3 left-3 text-paper-200/70 text-[11px] tracking-wider font-serif pointer-events-none">
          双指 / 滚轮：缩放 · 拖动：移动
        </div>
      )}
    </div>
  );
}

function ToolButton({
  onClick,
  label,
  title,
}: {
  onClick: () => void;
  label: string;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className="h-9 w-9 flex items-center justify-center bg-paper-100/90 hover:bg-paper-200 text-ink-500 font-serif text-base border border-ink-300/50 transition-colors"
    >
      {label}
    </button>
  );
}
