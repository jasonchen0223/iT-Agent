"use client";

import React from 'react';
import { TTaskType } from '@/types/task';

interface TaskTypeBadgeProps {
  type: TTaskType;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 任务类型徽章组件
 * 
 * 显示任务的类型，使用不同颜色区分
 * 
 * @param {TaskTypeBadgeProps} props - 组件属性
 * @returns {React.ReactElement} 渲染结果
 */
export function TaskTypeBadge({ type, size = 'md' }: TaskTypeBadgeProps) {
  // 类型映射到显示文本
  const typeTextMap: Record<TTaskType, string> = {
    manual: '手动',
    auto: '自动',
    development: '开发',
    design: '设计',
    testing: '测试',
    planning: '规划',
    research: '研究',
    review: '审查',
    other: '其他'
  };
  
  // 类型映射到颜色样式
  const typeStyleMap: Record<TTaskType, string> = {
    manual: 'bg-indigo-600/20 text-indigo-300 border-indigo-600/30',
    auto: 'bg-purple-600/20 text-purple-300 border-purple-600/30',
    development: 'bg-green-600/20 text-green-300 border-green-600/30',
    design: 'bg-pink-600/20 text-pink-300 border-pink-600/30',
    testing: 'bg-yellow-600/20 text-yellow-300 border-yellow-600/30',
    planning: 'bg-blue-600/20 text-blue-300 border-blue-600/30',
    research: 'bg-teal-600/20 text-teal-300 border-teal-600/30',
    review: 'bg-orange-600/20 text-orange-300 border-orange-600/30',
    other: 'bg-gray-600/20 text-gray-300 border-gray-600/30'
  };
  
  // 尺寸映射到样式
  const sizeStyleMap = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1'
  };
  
  return (
    <div 
      className={`
        inline-flex items-center justify-center rounded-full 
        border ${typeStyleMap[type]} ${sizeStyleMap[size]}
        font-medium
      `}
    >
      {typeTextMap[type]}任务
    </div>
  );
} 