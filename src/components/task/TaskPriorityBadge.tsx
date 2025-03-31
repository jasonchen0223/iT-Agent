"use client";

import React from 'react';
import { TTaskPriority } from '@/types/task';

interface TaskPriorityBadgeProps {
  priority: TTaskPriority;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 任务优先级徽章组件
 * 
 * 显示任务优先级的彩色徽章
 * 
 * @param {TaskPriorityBadgeProps} props - 组件属性
 * @returns {React.ReactElement} 渲染结果
 */
export function TaskPriorityBadge({ priority, size = 'md' }: TaskPriorityBadgeProps) {
  // 优先级映射配置
  const priorityConfig: Record<TTaskPriority, { label: string; className: string }> = {
    low: {
      label: '低',
      className: 'bg-gray-800/30 text-gray-300 border-gray-700/50'
    },
    medium: {
      label: '中',
      className: 'bg-blue-900/30 text-blue-300 border-blue-700/50'
    },
    high: {
      label: '高',
      className: 'bg-yellow-900/30 text-yellow-300 border-yellow-700/50'
    },
    urgent: {
      label: '紧急',
      className: 'bg-red-900/30 text-red-300 border-red-700/50'
    }
  };

  // 尺寸映射
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1'
  };

  const { label, className } = priorityConfig[priority] || priorityConfig.medium;

  return (
    <span className={`
      inline-flex items-center justify-center rounded-full
      border ${className} ${sizeClasses[size]}
      font-medium
    `}>
      {label}
    </span>
  );
} 