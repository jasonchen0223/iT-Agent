"use client";

import React from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

/**
 * 简化版统一工具页面（临时版本）
 * 
 * 在安装所需依赖前的临时页面
 * 
 * @returns {React.ReactElement} 页面渲染结果
 */
export default function UnifiedToolsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4 text-indigo-100">工具中心</h1>
      <Card className="bg-indigo-950/40 border-indigo-700/30">
        <CardContent className="p-6">
          <CardTitle className="mb-4 text-indigo-100">工具页面正在构建中</CardTitle>
          <p className="text-indigo-200 mb-4">
            需要安装以下依赖才能完整显示工具页面：
          </p>
          <pre className="bg-indigo-900/50 p-4 rounded-md text-indigo-100 overflow-auto">
            npm install date-fns @radix-ui/react-scroll-area @radix-ui/react-toggle-group @radix-ui/react-toggle class-variance-authority
          </pre>
          <p className="mt-4 text-indigo-300">
            安装完成后，请重新启动开发服务器。
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 