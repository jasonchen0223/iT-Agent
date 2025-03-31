import React from 'react';
import { ToolPage } from '@/components/tool';

/**
 * 工具页面
 * 
 * 统一展示所有可用工具
 * 
 * @returns {React.ReactElement} 工具页面组件
 */
export default function ToolsPage() {
  return (
    <div className="container mx-auto py-6 h-full">
      <div className="flex flex-col h-[calc(100vh-120px)]">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-indigo-100">工具中心</h1>
          <p className="text-indigo-300 mt-1">
            发现、使用和管理智能工具
          </p>
        </div>
        
        <div className="flex-1 bg-indigo-950/30 rounded-lg border border-indigo-800/30 p-4 overflow-hidden">
          <ToolPage />
        </div>
      </div>
    </div>
  );
} 