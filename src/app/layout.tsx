// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "iT-Agent | 智能代理协作系统",
  description: "基于AutoGen构建的多智能代理协作系统",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" data-oid="m4twy79">
      <body
        className={`${inter.className} bg-gradient-to-b from-indigo-950 to-black min-h-screen text-indigo-100`}
        data-oid="q18swcm"
      >
        {children}
      </body>
    </html>
  );
}
