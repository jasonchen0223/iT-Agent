"use client";

import React from 'react';
import { TTaskStatus } from '@/types/task';

interface TaskStatusBadgeProps {
  status: TTaskStatus;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 任务状态徽章组件
 * 
 * 显示任务状态的彩色徽章
 * 
 * @param {TaskStatusBadgeProps} props - 组件属性
 * @returns {React.ReactElement} 渲染结果
 */
export function TaskStatusBadge({ status, size = 'md' }: TaskStatusBadgeProps) {
  // 状态映射配置
  const statusConfig: Record<TTaskStatus, { label: string; className: string }> = {
    pending: {
      label: '待处理',
      className: 'bg-yellow-900/30 text-yellow-300 border-yellow-700/50'
    },
    assigned: {
      label: '已分配',
      className: 'bg-purple-900/30 text-purple-300 border-purple-700/50'
    },
    running: {
      label: '进行中',
      className: 'bg-blue-900/30 text-blue-300 border-blue-700/50'
    },
    completed: {
      label: '已完成',
      className: 'bg-green-900/30 text-green-300 border-green-700/50'
    },
    failed: {
      label: '失败',
      className: 'bg-red-900/30 text-red-300 border-red-700/50'
    },
    cancelled: {
      label: '已取消',
      className: 'bg-gray-900/30 text-gray-300 border-gray-700/50'
    }
  };

  // 尺寸映射
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1'
  };

  const { label, className } = statusConfig[status] || statusConfig.pending;

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