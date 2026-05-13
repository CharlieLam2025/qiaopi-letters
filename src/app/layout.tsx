import type { Metadata, Viewport } from "next";
import { Noto_Serif_SC, Ma_Shan_Zheng, ZCOOL_XiaoWei } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import MapWatermark from "@/components/decorations/MapWatermark";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-serif-sc",
  display: "swap",
});

const maShanZheng = Ma_Shan_Zheng({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-ma-shan-zheng",
  display: "swap",
});

const zcool = ZCOOL_XiaoWei({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-zcool",
  display: "swap",
});

export const metadata: Metadata = {
  title: "写给远方的一封侨批",
  description:
    "电影《给阿嬷的情书》与侨批文化的线上纪念馆。有些话，当年漂洋过海才送到；今天，我们重新把它写下来。",
  applicationName: "侨批",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "侨批",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "写给远方的一封侨批",
    description:
      "1880—1950 南洋华侨家书的线上纪念馆 + AI 写信工具。仿照那个年代的笔触替你写，邮戳红印的旧信纸可下载。",
    type: "website",
    images: ["/icons/icon-512.png"],
    locale: "zh_CN",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ecdfbf",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${notoSerifSC.variable} ${maShanZheng.variable} ${zcool.variable}`}>
      <body className="antialiased">
        <ServiceWorkerRegistration />
        <MapWatermark />
        <Nav />
        <main className="relative z-10">{children}</main>
        <footer className="relative z-10 border-t border-ink-300/20 mt-24 py-10 px-4 text-center">
          <p className="font-serif text-ink-300 text-sm tracking-wider leading-loose">
            一座临时的线上纪念馆 · 为侨批，也为今天还在远方的人
            <br />
            <span className="text-ink-300/70 text-xs">
              所有信件均为用户匿名创作，本站不存储任何真实身份信息。
            </span>
          </p>
          <p className="mt-6 font-serif text-ink-300/70 text-[11px] tracking-[0.4em]">
            <span className="opacity-70">made by</span>{" "}
            <span className="text-ink-400">charlielam</span>
          </p>
        </footer>
      </body>
    </html>
  );
}
