import type { Metadata, Viewport } from "next";
import { Noto_Serif_SC, Ma_Shan_Zheng, ZCOOL_XiaoWei } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

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
        <Nav />
        <main>{children}</main>
        <footer className="border-t border-ink-300/20 mt-24 py-10 px-4 text-center">
          <p className="font-serif text-ink-300 text-sm tracking-wider leading-loose">
            一座临时的线上纪念馆 · 为侨批，也为今天还在远方的人
            <br />
            <span className="text-ink-300/70 text-xs">
              所有信件均为用户匿名创作，本站不存储任何真实身份信息。
            </span>
          </p>
        </footer>
      </body>
    </html>
  );
}
