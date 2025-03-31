"use client";

import React from 'react';
import { ToastProvider } from '@/components/ui/toast-unified';
import { Sidebar } from '@/components/layout/Sidebar';

interface ClientLayoutProps {
  children: React.ReactNode;
  sidebarCollapsed: boolean;
}

/**
 * 客户端布局组件
 * 
 * 处理需要在客户端运行的UI组件，如侧边栏和Toast提示
 */
export default function ClientLayout({ children, sidebarCollapsed }: ClientLayoutProps) {
  return (
    <ToastProvider>
      {/* 顶部固定标题栏 */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-indigo-950 to-purple-950 border-b border-indigo-800/30 z-50 flex items-center px-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-100">iT-Agent</h1>
        </div>
      </header>
      
      <div className="flex min-h-screen pt-16">
        {/* 侧边栏 - 接收从服务端传递的初始状态 */}
        <Sidebar collapsed={sidebarCollapsed} />
        
        {/* 主内容区域 */}
        <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          <main className="container mx-auto px-4 py-6">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
} 