'use client';

import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

/**
 * 页面标题组件
 * 
 * 提供统一的页面标题样式，包括标题、描述和可选的操作按钮
 * 
 * @param {PageHeaderProps} props - 组件属性
 * @returns {React.ReactElement} 页面标题组件
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold text-indigo-100">{title}</h1>
        {description && (
          <p className="text-indigo-300 mt-1">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex-shrink-0 flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}; 