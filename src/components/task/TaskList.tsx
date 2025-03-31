"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import { ITask, TTaskStatus, TTaskPriority, TTaskType } from '@/types/task';
import { TaskItem } from './TaskItem';
import { Skeleton } from '@/components/ui/skeleton';

interface TaskListProps {
  tasks: ITask[];
  groupBy?: 'status' | 'priority' | 'type' | 'session' | 'none';
  isLoading?: boolean;
  onTaskClick?: (task: ITask) => void;
}

/**
 * 任务列表组件
 * 
 * 显示任务列表，支持按状态、优先级、类型或会话分组
 * 
 * @param {TaskListProps} props - 组件属性
 * @returns {React.ReactElement} 渲染结果
 */
export function TaskList({ 
  tasks, 
  groupBy = 'none',
  isLoading = false,
  onTaskClick 
}: TaskListProps) {
  // 状态分组标题
  const statusGroupTitles: Record<TTaskStatus, string> = {
    pending: '待处理',
    assigned: '已分配',
    running: '进行中',
    completed: '已完成',
    failed: '失败',
    cancelled: '已取消'
  };
  
  // 优先级分组标题
  const priorityGroupTitles: Record<TTaskPriority, string> = {
    low: '低优先级',
    medium: '中优先级',
    high: '高优先级',
    urgent: '紧急'
  };
  
  // 类型分组标题
  const typeGroupTitles: Record<TTaskType, string> = {
    manual: '手动任务',
    auto: '自动任务',
    development: '开发任务',
    design: '设计任务',
    testing: '测试任务',
    planning: '规划任务',
    research: '研究任务',
    review: '审查任务',
    other: '其他任务'
  };
  
  // 按分组方式对任务进行分组
  const groupedTasks = useMemo(() => {
    if (groupBy === 'none' || !tasks.length) {
      return { '所有任务': tasks };
    }
    
    const grouped: Record<string, ITask[]> = {};
    
    if (groupBy === 'status') {
      Object.keys(statusGroupTitles).forEach(status => {
        grouped[statusGroupTitles[status as TTaskStatus]] = [];
      });
      
      tasks.forEach(task => {
        const group = statusGroupTitles[task.status];
        if (!grouped[group]) {
          grouped[group] = [];
        }
        grouped[group].push(task);
      });
    } else if (groupBy === 'priority') {
      Object.keys(priorityGroupTitles).forEach(priority => {
        grouped[priorityGroupTitles[priority as TTaskPriority]] = [];
      });
      
      tasks.forEach(task => {
        const group = priorityGroupTitles[task.priority];
        if (!grouped[group]) {
          grouped[group] = [];
        }
        grouped[group].push(task);
      });
    } else if (groupBy === 'type') {
      Object.keys(typeGroupTitles).forEach(type => {
        grouped[typeGroupTitles[type as TTaskType]] = [];
      });
      
      tasks.forEach(task => {
        const group = typeGroupTitles[task.type];
        if (!grouped[group]) {
          grouped[group] = [];
        }
        grouped[group].push(task);
      });
    } else if (groupBy === 'session') {
      tasks.forEach(task => {
        const group = task.sessionId ? `会话: ${task.sessionId}` : '无会话';
        if (!grouped[group]) {
          grouped[group] = [];
        }
        grouped[group].push(task);
      });
    }
    
    // 过滤掉空分组
    return Object.fromEntries(
      Object.entries(grouped).filter(([_, tasks]) => tasks.length > 0)
    );
  }, [tasks, groupBy, statusGroupTitles, priorityGroupTitles, typeGroupTitles]);
  
  // 渲染加载状态
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-6 w-48 bg-indigo-900/30" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((j) => (
                <Skeleton key={j} className="h-44 w-full bg-indigo-900/20" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // 如果没有任务
  if (!tasks.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="h-24 w-24 text-indigo-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-indigo-100 mb-2">暂无任务</h3>
        <p className="text-indigo-300 max-w-md">
          当前没有符合条件的任务。您可以创建新任务或调整筛选条件以查看更多任务。
        </p>
      </div>
    );
  }
  
  // 处理任务点击
  const handleTaskClick = (task: ITask) => {
    if (onTaskClick) {
      onTaskClick(task);
    }
  };
  
  // 渲染任务列表
  return (
    <div className="space-y-8">
      {Object.entries(groupedTasks).map(([group, tasks]) => (
        <div key={group} className="space-y-3">
          <h2 className="text-xl font-semibold text-indigo-100 flex items-center">
            {group}
            <span className="ml-2 text-sm text-indigo-400 font-normal">
              ({tasks.length}个)
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tasks.map(task => (
              <div 
                key={task.id} 
                onClick={() => handleTaskClick(task)}
                className="cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-md"
              >
                <TaskItem task={task} showSession={groupBy !== 'session'} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 