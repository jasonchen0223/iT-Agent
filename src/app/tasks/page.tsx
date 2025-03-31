"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/PageHeader';
import { TaskList } from '@/components/task/TaskList';
import { TaskFilter } from '@/components/task/TaskFilter';
import { ITask, TTaskStatus, TTaskPriority, TTaskType } from '@/types/task';
import { Plus } from 'lucide-react';

/**
 * 任务列表页面
 * 
 * 显示系统中的所有任务，支持过滤和分组
 */
export default function TasksPage() {
  const router = useRouter();
  
  // 状态
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 过滤器
  const [filters, setFilters] = useState({
    status: [] as TTaskStatus[],
    priority: [] as TTaskPriority[],
    type: [] as TTaskType[],
    sessionId: '',
  });
  
  // 分组方式
  const [groupBy, setGroupBy] = useState<'status' | 'priority' | 'type' | 'session' | 'none'>('status');
  
  // 加载任务数据
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        // 构建查询参数
        const queryParams = new URLSearchParams();
        
        if (filters.status.length > 0) {
          filters.status.forEach(status => {
            queryParams.append('status', status);
          });
        }
        
        if (filters.priority.length > 0) {
          filters.priority.forEach(priority => {
            queryParams.append('priority', priority);
          });
        }
        
        if (filters.type.length > 0) {
          filters.type.forEach(type => {
            queryParams.append('type', type);
          });
        }
        
        if (filters.sessionId) {
          queryParams.append('sessionId', filters.sessionId);
        }
        
        const url = `/api/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const res = await fetch(url);
        
        if (!res.ok) {
          throw new Error(`获取任务失败: ${res.status}`);
        }
        
        const data = await res.json();
        setTasks(data.data || []);
      } catch (err) {
        console.error('获取任务列表错误:', err);
        setError(err instanceof Error ? err.message : '获取任务失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, [filters]);
  
  // 处理过滤器变更
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };
  
  // 处理分组方式变更
  const handleGroupChange = (newGroupBy: typeof groupBy) => {
    setGroupBy(newGroupBy);
  };
  
  // 处理任务点击
  const handleTaskClick = (task: ITask) => {
    router.push(`/tasks/${task.id}`);
  };
  
  // 处理创建任务
  const handleCreateTask = () => {
    router.push('/tasks/create');
  };
  
  // 获取过滤后的任务列表
  const filteredTasks = tasks;
  
  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <PageHeader 
            title="任务列表" 
            description="查看和管理系统中的所有任务"
          />
          <Button onClick={handleCreateTask} className="gap-1">
            <Plus size={16} /> 创建任务
          </Button>
        </div>
        
        <TaskFilter 
          filters={filters}
          onFilterChange={handleFilterChange}
          groupBy={groupBy}
          onGroupChange={handleGroupChange}
        />
        
        {error ? (
          <div className="p-6 bg-red-900/20 border border-red-700/40 rounded-lg text-center">
            <p className="text-red-300">{error}</p>
            <Button 
              variant="outline"
              className="mt-4"
              onClick={() => {
                setError('');
                setLoading(true);
                // 重新加载任务
                fetch('/api/tasks')
                  .then(res => res.json())
                  .then(data => {
                    setTasks(data.data || []);
                    setLoading(false);
                  })
                  .catch(err => {
                    console.error('重新加载任务错误:', err);
                    setError('重新加载任务失败');
                    setLoading(false);
                  });
              }}
            >
              重试
            </Button>
          </div>
        ) : (
          <TaskList 
            tasks={filteredTasks}
            groupBy={groupBy}
            isLoading={loading}
            onTaskClick={handleTaskClick}
          />
        )}
      </div>
    </div>
  );
} 