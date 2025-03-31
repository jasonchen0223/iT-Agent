"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ITask } from '@/types/task';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TaskStatusBadge } from '@/components/task/TaskStatusBadge';
import { TaskPriorityBadge } from '@/components/task/TaskPriorityBadge';
import { TaskTypeBadge } from '@/components/task/TaskTypeBadge';
import { TaskList } from '@/components/task/TaskList';
import { formatDistanceToNow, format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import Link from 'next/link';
import { ArrowLeft, Calendar, AlertCircle, Check, X, Play, RefreshCw } from 'lucide-react';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const [task, setTask] = useState<ITask | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 获取任务详情
  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/tasks/${taskId}`);
        
        if (!res.ok) {
          throw new Error(`获取任务失败: ${res.status}`);
        }
        
        const data = await res.json();
        setTask(data.data);
      } catch (err) {
        console.error('获取任务详情错误:', err);
        setError(err instanceof Error ? err.message : '获取任务失败');
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  // 更新任务状态
  const updateTaskStatus = async (newStatus: ITask['status']) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          ...(newStatus === 'completed' ? { completedAt: new Date() } : {}),
        }),
      });

      if (!res.ok) {
        throw new Error(`更新任务状态失败: ${res.status}`);
      }

      const data = await res.json();
      setTask(data.data);
    } catch (err) {
      console.error('更新任务状态错误:', err);
      setError(err instanceof Error ? err.message : '更新任务状态失败');
    }
  };

  // 格式化相对时间
  const formatRelativeTime = (date: Date | string | undefined) => {
    if (!date) return '--';
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: zhCN
      });
    } catch (error) {
      console.error('日期格式化错误:', error);
      return '未知时间';
    }
  };

  // 格式化日期时间
  const formatDateTime = (date: Date | string | undefined) => {
    if (!date) return '--';
    try {
      return format(new Date(date), 'yyyy-MM-dd HH:mm:ss', {
        locale: zhCN
      });
    } catch (error) {
      console.error('日期格式化错误:', error);
      return '未知时间';
    }
  };

  // 获取任务状态对应的操作按钮
  const getActionButtons = () => {
    if (!task) return null;

    switch (task.status) {
      case 'pending':
        return (
          <>
            <Button 
              onClick={() => updateTaskStatus('assigned')} 
              className="gap-1 bg-indigo-600 hover:bg-indigo-700"
            >
              <Play size={16} /> 分配任务
            </Button>
            <Button 
              onClick={() => updateTaskStatus('cancelled')} 
              variant="outline" 
              className="gap-1 border-red-700/30 text-red-400 hover:text-red-300 hover:bg-red-950/20"
            >
              <X size={16} /> 取消任务
            </Button>
          </>
        );
      case 'assigned':
        return (
          <>
            <Button 
              onClick={() => updateTaskStatus('running')} 
              className="gap-1 bg-blue-600 hover:bg-blue-700"
            >
              <Play size={16} /> 开始任务
            </Button>
            <Button 
              onClick={() => updateTaskStatus('pending')} 
              variant="outline" 
              className="gap-1"
            >
              <RefreshCw size={16} /> 重置为待处理
            </Button>
          </>
        );
      case 'running':
        return (
          <>
            <Button 
              onClick={() => updateTaskStatus('completed')} 
              className="gap-1 bg-green-600 hover:bg-green-700"
            >
              <Check size={16} /> 完成任务
            </Button>
            <Button 
              onClick={() => updateTaskStatus('failed')} 
              variant="outline" 
              className="gap-1 border-red-700/30 text-red-400 hover:text-red-300 hover:bg-red-950/20"
            >
              <AlertCircle size={16} /> 标记为失败
            </Button>
          </>
        );
      case 'completed':
      case 'failed':
      case 'cancelled':
        return (
          <Button 
            onClick={() => updateTaskStatus('pending')} 
            variant="outline" 
            className="gap-1"
          >
            <RefreshCw size={16} /> 重新打开任务
          </Button>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64 bg-indigo-900/30" />
          <Skeleton className="h-10 w-24 bg-indigo-900/30" />
        </div>
        <Skeleton className="h-40 w-full bg-indigo-900/20" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-20 w-full bg-indigo-900/20" />
          <Skeleton className="h-20 w-full bg-indigo-900/20" />
        </div>
        <Skeleton className="h-60 w-full bg-indigo-900/20" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="h-24 w-24 text-red-400 mb-4">
          <AlertCircle size={96} />
        </div>
        <h2 className="text-xl font-semibold text-red-300 mb-2">获取任务失败</h2>
        <p className="text-indigo-300 max-w-md mb-4">{error}</p>
        <Button onClick={() => router.push('/tasks')}>
          返回任务列表
        </Button>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="h-24 w-24 text-indigo-400 mb-4">
          <AlertCircle size={96} />
        </div>
        <h2 className="text-xl font-semibold text-indigo-100 mb-2">未找到任务</h2>
        <p className="text-indigo-300 max-w-md mb-4">
          无法找到ID为 {taskId} 的任务。该任务可能已被删除或您没有访问权限。
        </p>
        <Button onClick={() => router.push('/tasks')}>
          返回任务列表
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader 
          title={task.name}
          description={
            <div className="flex items-center gap-2">
              <TaskStatusBadge status={task.status} />
              <TaskPriorityBadge priority={task.priority} />
              <TaskTypeBadge type={task.type} />
            </div>
          }
        />
        <Link href="/tasks" passHref>
          <Button variant="outline" className="gap-1">
            <ArrowLeft size={16} /> 返回列表
          </Button>
        </Link>
      </div>

      {/* 任务详情卡片 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 主要信息 */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-b from-indigo-950/40 to-black/40 border border-indigo-800/30 rounded-lg p-6 space-y-4">
            <div className="pb-4 border-b border-indigo-800/30">
              <h2 className="text-lg font-semibold text-indigo-100 mb-2">任务描述</h2>
              <p className="text-indigo-300 whitespace-pre-wrap">
                {task.description || '无描述'}
              </p>
            </div>

            {task.subTasks && task.subTasks.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-indigo-100 mb-4">子任务</h2>
                <TaskList 
                  tasks={task.subTasks as any[]} 
                  groupBy="status"
                  onTaskClick={(subtask) => router.push(`/tasks/${subtask.id}`)}
                />
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex flex-wrap gap-2 pt-4">
              {getActionButtons()}
            </div>
          </div>
        </div>

        {/* 侧边信息 */}
        <div className="space-y-6">
          {/* 任务信息卡片 */}
          <div className="bg-gradient-to-b from-indigo-950/40 to-black/40 border border-indigo-800/30 rounded-lg p-6 space-y-3">
            <h2 className="text-lg font-semibold text-indigo-100 mb-2">任务信息</h2>
            
            <div className="grid grid-cols-1 gap-3">
              <div>
                <div className="text-xs text-indigo-400 mb-1">任务ID</div>
                <div className="text-sm text-indigo-200 break-all">{task.id}</div>
              </div>
              
              {task.sessionId && (
                <div>
                  <div className="text-xs text-indigo-400 mb-1">所属会话</div>
                  <Link href={`/sessions/${task.sessionId}`} className="text-sm text-blue-400 hover:text-blue-300 break-all">
                    {task.sessionId}
                  </Link>
                </div>
              )}
              
              {task.parentTaskId && (
                <div>
                  <div className="text-xs text-indigo-400 mb-1">父任务</div>
                  <Link href={`/tasks/${task.parentTaskId}`} className="text-sm text-blue-400 hover:text-blue-300 break-all">
                    {task.parentTaskId}
                  </Link>
                </div>
              )}
              
              {task.agentId && (
                <div>
                  <div className="text-xs text-indigo-400 mb-1">执行代理</div>
                  <Link href={`/agents/${task.agentId}`} className="text-sm text-blue-400 hover:text-blue-300">
                    {task.agentId}
                  </Link>
                </div>
              )}
              
              {task.userId && (
                <div>
                  <div className="text-xs text-indigo-400 mb-1">所属用户</div>
                  <div className="text-sm text-indigo-200">{task.userId}</div>
                </div>
              )}
            </div>
          </div>
          
          {/* 时间信息卡片 */}
          <div className="bg-gradient-to-b from-indigo-950/40 to-black/40 border border-indigo-800/30 rounded-lg p-6 space-y-3">
            <h2 className="text-lg font-semibold text-indigo-100 mb-2">时间信息</h2>
            
            <div className="grid grid-cols-1 gap-3">
              <div>
                <div className="text-xs text-indigo-400 mb-1">创建时间</div>
                <div className="text-sm text-indigo-200 flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDateTime(task.createdAt)}
                </div>
                <div className="text-xs text-indigo-400/70 mt-1">
                  {formatRelativeTime(task.createdAt)}
                </div>
              </div>
              
              <div>
                <div className="text-xs text-indigo-400 mb-1">最后更新</div>
                <div className="text-sm text-indigo-200 flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDateTime(task.updatedAt)}
                </div>
                <div className="text-xs text-indigo-400/70 mt-1">
                  {formatRelativeTime(task.updatedAt)}
                </div>
              </div>
              
              {task.completedAt && (
                <div>
                  <div className="text-xs text-indigo-400 mb-1">完成时间</div>
                  <div className="text-sm text-indigo-200 flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDateTime(task.completedAt)}
                  </div>
                  <div className="text-xs text-indigo-400/70 mt-1">
                    {formatRelativeTime(task.completedAt)}
                  </div>
                </div>
              )}
              
              {task.dueDate && (
                <div>
                  <div className="text-xs text-indigo-400 mb-1">截止日期</div>
                  <div className="text-sm text-indigo-200 flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDateTime(task.dueDate)}
                  </div>
                  <div className="text-xs text-indigo-400/70 mt-1">
                    {formatRelativeTime(task.dueDate)}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* 元数据信息 */}
          {task.metadata && Object.keys(task.metadata).length > 0 && (
            <div className="bg-gradient-to-b from-indigo-950/40 to-black/40 border border-indigo-800/30 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-indigo-100 mb-2">元数据</h2>
              <pre className="text-xs text-indigo-300 overflow-auto p-2 bg-indigo-950/30 rounded border border-indigo-800/30">
                {JSON.stringify(task.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 