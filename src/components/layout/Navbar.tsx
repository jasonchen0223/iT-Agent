"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * 导航链接项
 */
interface NavItem {
  /**
   * 链接标题
   */
  title: string;
  /**
   * 链接地址
   */
  href: string;
  /**
   * 链接图标
   */
  icon?: React.ReactNode;
}

/**
 * 导航栏组件
 *
 * 提供应用的主导航功能
 */
export default function Navbar() {
  const pathname = usePathname() || "";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  // 导航链接列表
  const navItems: NavItem[] = [
    { title: "系统仪表盘", href: "/dashboard" },
    { title: "会话管理", href: "/sessions" },
    { title: "代理配置", href: "/agents-dashboard" },
    { title: "工具库", href: "/tools" },
    { title: "设置", href: "/settings" },
  ];

  // 判断链接是否激活
  const isActive = useCallback(
    (href: string) => {
      if (href === "/dashboard" && pathname === "/") {
        return true;
      }
      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname],
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-space-darker via-space-dark to-space-darker border-b border-indigo-950/50 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* 品牌标志和标题 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-glow group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold group-hover:shadow-glow transition-all duration-300">
                iT
              </div>
              <span className="ml-2 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-100 to-indigo-300">
                智能代理协作系统
              </span>
            </Link>
          </div>

          {/* 桌面端导航链接 */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? "bg-indigo-900/50 text-white shadow-inner"
                    : "text-indigo-200 hover:bg-indigo-900/30 hover:text-white"
                }`}
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* 移动端菜单按钮 */}
          <div className="flex md:hidden items-center">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-300 hover:text-white hover:bg-indigo-900/30 focus:outline-none transition-colors duration-200"
              onClick={toggleMobileMenu}
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">打开主菜单</span>
              <svg
                className={`${mobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${mobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 - 使用Portal确保正确的层叠顺序 */}
      <div
        className={`${mobileMenuOpen ? "fixed" : "hidden"} inset-0 z-40 md:hidden`}
        style={{ top: "64px" }}
        aria-label="移动菜单"
      >
        {/* 背景遮罩 */}
        <div
          className="absolute inset-0 bg-space-darker/80 backdrop-blur-md"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        ></div>

        {/* 菜单内容 */}
        <div className="relative h-full flex flex-col bg-space-dark bg-opacity-95 shadow-xl">
          <div className="pt-5 pb-4 px-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? "bg-indigo-900/50 text-white shadow-inner"
                    : "text-indigo-200 hover:bg-indigo-900/30 hover:text-white"
                }`}
                onClick={toggleMobileMenu}
              >
                {item.title}
              </Link>
            ))}
          </div>
          <div className="mt-auto p-4 border-t border-indigo-950/50">
            <button
              className="space-button w-full py-3"
              onClick={toggleMobileMenu}
            >
              关闭菜单
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
