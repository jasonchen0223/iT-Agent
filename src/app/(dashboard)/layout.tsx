"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";

/**
 * 仪表盘布局容器
 *
 * 为所有内部页面提供共享布局，包括导航栏
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      console.log("Dashboard布局已卸载");
    };
  }, []);

  if (!mounted) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        data-oid="bt4px5i"
      >
        <div className="space-card p-6 animate-pulse-light" data-oid="mg99cwj">
          <p className="text-indigo-300" data-oid="8x3vfbl">
            加载中...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" data-oid="rdbkeu:">
      <Navbar data-oid="g9z2_m." />
      <main
        className="flex-1 container mx-auto px-4 pt-16 pb-8"
        data-oid="txpf1ga"
      >
        {children}
      </main>
    </div>
  );
}
