"use client";

import React, { useState, useEffect, memo, useCallback } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";

// 创建NavItem组件以优化侧边栏每个项的渲染
const NavItem = memo(
  ({
    href,
    icon: Icon,
    label,
    collapsed,
  }: {
    href: string;
    icon: React.ElementType;
    label: string;
    collapsed: boolean;
  }) => (
    <Link
      href={href}
      className="flex items-center p-2 my-1 rounded-md transition-all hover:bg-indigo-900/40 text-indigo-200 hover:text-white group relative"
    >
      <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
      {!collapsed && <span>{label}</span>}
      {collapsed && (
        <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-950 text-sm invisible opacity-0 -translate-x-3 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 z-50 shadow-glow-sm">
          {label}
        </span>
      )}
    </Link>
  ),
);

NavItem.displayName = "NavItem";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

/**
 * 侧边栏组件
 *
 * 提供应用程序的主要导航
 *
 * @param {SidebarProps} props - 组件属性
 * @returns {React.ReactElement} 侧边栏组件
 */
const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  // 记录挂载状态，避免SSR和CSR不匹配的问题
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log("Sidebar 已挂载", Date.now());

    return () => {
      console.log("Sidebar 已卸载", Date.now());
    };
  }, []);

  // 优化切换侧边栏函数
  const handleToggleCollapse = useCallback(() => {
    onToggleCollapse();
  }, [onToggleCollapse]);

  // 如果未挂载，返回空占位符
  if (!mounted) {
    return (
      <aside className="hidden md:block w-64 transition-all duration-300 shrink-0" />
    );
  }

  // 导航项定义
  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "系统仪表盘" },
    { href: "/sessions", icon: MessageSquare, label: "会话管理" },
    { href: "/agents", icon: Users, label: "代理配置" },
    { href: "/tools", icon: Wrench, label: "工具库" },
    { href: "/settings", icon: Settings, label: "设置" },
  ];

  return (
    <aside
      id="sidebar"
      className={`fixed left-0 top-16 h-[calc(100vh-64px)] bg-gradient-to-b from-indigo-950 to-purple-950 border-r border-indigo-800/30 shadow-md backdrop-blur-md transition-all duration-300 z-40 hidden md:block ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-3 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <h2 className="text-lg font-semibold text-indigo-200">导航菜单</h2>
          )}
          <button
            onClick={handleToggleCollapse}
            className="p-1.5 rounded-md bg-indigo-900/40 hover:bg-indigo-800/60 text-indigo-200 transition-colors"
            aria-label={collapsed ? "展开侧边栏" : "收起侧边栏"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item, index) => (
            <NavItem
              key={`nav-item-${index}`}
              href={item.href}
              icon={item.icon}
              label={item.label}
              collapsed={collapsed}
            />
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-indigo-800/30">
          <div
            className={`flex items-center ${collapsed ? "justify-center" : "space-x-3"}`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-glow">
              <span className="text-white text-xs font-bold">iT</span>
            </div>
            {!collapsed && (
              <div>
                <p className="text-sm text-indigo-200">iT-Agent</p>
                <p className="text-xs text-indigo-400">v0.1.0</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 移动端侧边栏切换按钮 */}
      <button
        className="fixed bottom-4 right-4 md:hidden p-3 rounded-full bg-indigo-900 text-white shadow-glow z-50"
        aria-label="切换侧边栏"
      >
        <Menu size={24} />
      </button>
    </aside>
  );
};

export default memo(Sidebar);
