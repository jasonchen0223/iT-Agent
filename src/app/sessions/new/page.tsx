'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

/**
 * 创建新会话页面
 */
export default function NewSessionPage() {
  const router = useRouter();
  
  // 处理返回按钮点击
  const handleBack = () => {
    router.back();
  };
  
  // 处理创建会话
  const handleCreate = () => {
    alert('会话创建功能正在开发中');
    // 未来会实际创建会话并导航到会话详情页
    router.push('/sessions');
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <button 
          onClick={handleBack}
          className="mr-4 text-indigo-400 hover:text-indigo-300"
        >
          ← 返回
        </button>
        <h1 className="text-2xl font-bold text-indigo-100">创建新会话</h1>
      </div>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-indigo-300 mb-4">会话信息</h2>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-indigo-200 mb-1">
              会话名称
            </label>
            <input 
              type="text" 
              className="w-full px-3 py-2 bg-indigo-950/50 border border-indigo-800/30 rounded-md text-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="输入会话名称..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-indigo-200 mb-1">
              会话描述
            </label>
            <textarea 
              className="w-full px-3 py-2 bg-indigo-950/50 border border-indigo-800/30 rounded-md text-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="输入会话描述（可选）..."
              rows={3}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" className="mr-2" onClick={handleBack}>
            取消
          </Button>
          <Button onClick={handleCreate}>
            创建会话
          </Button>
        </div>
      </Card>
    </div>
  );
} 