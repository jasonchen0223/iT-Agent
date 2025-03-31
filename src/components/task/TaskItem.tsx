"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ITask } from '@/types/task';
import { TaskStatusBadge } from './TaskStatusBadge';
import { TaskPriorityBadge } from './TaskPriorityBadge';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface TaskItemProps {
  task: ITask;
  showSession?: boolean;
}

/**
 * 任务项组件
 * 
 * 任务卡片，显示单个任务的摘要信息
 * 
 * @param {TaskItemProps} props - 组件属性
 * @returns {React.ReactElement} 渲染结果
 */
export function TaskItem({ task, showSession = false }: TaskItemProps) {
  // 获取任务状态背景色
  const getStatusBackgroundColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-900/10 border-green-700/30';
      case 'running':
        return 'bg-blue-900/10 border-blue-700/30';
      case 'failed':
        return 'bg-red-900/10 border-red-700/30';
      case 'cancelled':
        return 'bg-gray-800/30 border-gray-700/30';
      case 'assigned':
        return 'bg-purple-900/10 border-purple-700/30';
      default:
        return 'bg-gradient-to-b from-indigo-950/40 to-black/40 border-indigo-800/30';
    }
  };

  // 格式化相对时间
  const formatRelativeTime = (date: Date) => {
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

  // 截断描述文本
  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className={`h-full ${getStatusBackgroundColor(task.status)}`}>
      <CardContent className="p-4">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-indigo-100 line-clamp-2">
              {task.name}
            </h3>
            <TaskStatusBadge status={task.status} size="sm" />
          </div>
          
          {task.description && (
            <p className="text-indigo-300/70 text-sm mb-3 line-clamp-2">
              {truncateDescription(task.description)}
            </p>
          )}
          
          <div className="mt-auto pt-2">
            <div className="flex justify-between items-center">
              <TaskPriorityBadge priority={task.priority} size="sm" />
              <span className="text-xs text-indigo-300/50">
                {formatRelativeTime(task.createdAt)}
              </span>
            </div>
            
            {showSession && task.sessionId && (
              <div className="mt-2 pt-2 border-t border-indigo-800/20 text-xs text-indigo-300/50">
                会话: {task.sessionId}
              </div>
            )}
            
            {task.subTasks && task.subTasks.length > 0 && (
              <div className="mt-2 pt-2 border-t border-indigo-800/20 text-xs text-indigo-300/50">
                子任务: {task.subTasks.length}个
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 