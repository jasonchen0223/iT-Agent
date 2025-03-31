"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  ClipboardList,
} from "lucide-react";
import { setCookie, getCookie } from 'cookies-next';
import { usePathname } from 'next/navigation';
// 移除导入 navLinks，避免循环引用
// import { navLinks } from '@/app/layout';

// 内部定义导航链接
const navLinks = [
  {
    title: '仪表盘',
    href: '/dashboard',
    icon: 'dashboard'
  },
  {
    title: '会话',
    href: '/sessions',
    icon: 'chat'
  },
  {
    title: '代理',
    href: '/agents',
    icon: 'robot'
  },
  {
    title: '项目',
    href: '/projects',
    icon: 'project'
  },
  {
    title: '协作',
    href: '/collaboration',
    icon: 'collaboration'
  },
  {
    title: '工具',
    href: '/tools',
    icon: 'tools'
  },
  {
    title: '任务',
    href: '/tasks',
    icon: 'task'
  },
  {
    title: '知识库',
    href: '/knowledge',
    icon: 'book'
  },
  {
    title: '设置',
    href: '/settings',
    icon: 'settings'
  }
];

// 创建NavItem组件以优化侧边栏每个项的渲染
const NavItem = React.memo(
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
      className="flex items-center p-2 my-1 rounded-md transition-all hover:bg-indigo-900/40 text-indigo-200 hover:text-white group relative cursor-pointer"
    >
      <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
      {!collapsed && <span>{label}</span>}
      {collapsed && (
        <span
          className="absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-950 text-sm invisible opacity-0 -translate-x-3 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 z-50 shadow-glow-sm"
        >
          {label}
        </span>
      )}
    </Link>
  ),
);

NavItem.displayName = "NavItem";

/**
 * 侧边栏组件参数接口
 */
interface SidebarProps {
    /**
     * 侧边栏是否折叠
     * @default false
     */
    collapsed?: boolean;
}

/**
 * 侧边栏组件
 * 
 * 提供应用程序的主导航功能，可折叠以节省空间
 */
export const Sidebar: React.FC<SidebarProps> = React.memo(({ collapsed: initialCollapsed = false }) => {
    const pathname = usePathname();
    // 内部状态管理，初始值从props获取，但也允许组件内部更新
    const [collapsed, setCollapsed] = useState<boolean>(initialCollapsed);

    // 组件加载时从cookie中读取折叠状态
    useEffect(() => {
        const savedState = getCookie('sidebar-collapsed');
        if (savedState !== undefined) {
            setCollapsed(savedState === 'true');
        }
    }, []);

    // 处理侧边栏折叠/展开切换
    const handleToggleCollapse = useCallback(() => {
        const newState = !collapsed;
        // 更新内部状态
        setCollapsed(newState);
        // 保存到cookie
        setCookie('sidebar-collapsed', String(newState), { expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) });
    }, [collapsed]);

    // 图标映射
    const iconMap: Record<string, React.ReactNode> = {
        dashboard: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
        chat: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
        ),
        robot: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
        ),
        project: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        ),
        collaboration: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
        tools: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        task: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
        ),
        book: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        ),
        settings: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    };

    return (
        <aside
            className={`fixed left-0 top-16 bottom-0 bg-indigo-950/90 border-r border-indigo-800/30 transition-all duration-300 ${
                collapsed ? 'w-16' : 'w-64'
            } z-40`}
        >
            <div className="flex flex-col h-full">
                <nav className="flex-1 py-4">
                    <ul className="space-y-1">
                        {navLinks.map((link, index) => (
                            <li key={index}>
                                <Link
                                    href={link.href}
                                    className={`flex items-center px-4 py-3 transition-colors ${
                                        pathname === link.href
                                            ? 'bg-purple-900/50 text-white'
                                            : 'text-indigo-300 hover:bg-indigo-900/40 hover:text-white'
                                    }`}
                                >
                                    <span className="inline-flex">{iconMap[link.icon]}</span>
                                    {!collapsed && <span className="ml-3">{link.title}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-4 border-t border-indigo-800/30">
                    <button 
                        type="button"
                        onClick={handleToggleCollapse}
                        className="w-full flex items-center justify-center text-indigo-300 hover:text-white transition-colors cursor-pointer"
                        aria-label={collapsed ? "展开侧边栏" : "收起侧边栏"}
                    >
                        {collapsed ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </aside>
    );
});

Sidebar.displayName = "Sidebar";
