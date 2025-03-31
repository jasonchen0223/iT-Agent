"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TaskCreateForm } from '@/components/task/TaskCreateForm';
import { ICreateTaskRequest } from '@/types/task';

/**
 * 创建任务页面
 * 
 * 允许用户创建新任务，可以独立创建或关联到会话
 */
export default function CreateTaskPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const parentTaskId = searchParams.get('parentTaskId');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 创建任务
  const handleCreateTask = async (taskData: ICreateTaskRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      // 如果是关联到会话的任务
      let response;
      if (sessionId) {
        response = await fetch(`/api/sessions/${sessionId}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData),
        });
      } else {
        // 独立任务
        response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData),
        });
      }
      
      if (!response.ok) {
        throw new Error('创建任务失败');
      }
      
      const result = await response.json();
      
      if (result.success) {
        // 创建成功，跳转到任务详情页
        router.push(`/tasks/${result.data.id}`);
      } else {
        throw new Error(result.error || '创建任务失败');
      }
    } catch (err) {
      console.error('创建任务错误:', err);
      setError('创建任务失败，请重试');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
        >
          返回
        </Button>
        <h1 className="text-3xl font-bold text-indigo-100">
          创建新任务
        </h1>
      </div>
      
      {error && (
        <Card className="bg-red-900/20 border-red-700 mb-6">
          <CardContent className="py-4">
            <p className="text-red-300">{error}</p>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardContent className="pt-6">
          <TaskCreateForm 
            onSubmit={handleCreateTask}
            sessionId={sessionId || undefined}
            parentTaskId={parentTaskId || undefined}
            isLoading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
} 