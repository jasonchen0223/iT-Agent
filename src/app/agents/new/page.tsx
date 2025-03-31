'use client';

import React from 'react';
import AgentForm from '@/components/agent/AgentForm';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';

/**
 * 创建代理页面
 * 
 * 提供创建新代理的表单界面
 */
export default function CreateAgentPage() {
  const router = useRouter();

  // 处理提交创建
  const handleSubmit = async (formData: any) => {
    try {
      // 这里应该调用API创建代理
      // const response = await fetch('/api/agents', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      
      // if (!response.ok) {
      //   throw new Error('创建代理失败');
      // }

      // 模拟创建成功
      console.log('提交的代理数据:', formData);
      
      // 重定向到代理列表页面
      router.push('/agents');
    } catch (error) {
      console.error('创建代理错误:', error);
      // 这里应该显示错误消息
    }
  };

  // 处理取消创建
  const handleCancel = () => {
    router.push('/agents');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-indigo-100">创建新代理</h1>
        <p className="text-indigo-300/70 mt-1">
          配置新的智能代理添加到您的团队
        </p>
      </div>
      
      <Card>
        <AgentForm 
          onSubmit={handleSubmit} 
          onCancel={handleCancel}
          isSubmitting={false}
        />
      </Card>
    </div>
  );
} 