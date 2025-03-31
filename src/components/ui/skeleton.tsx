'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * 骨架屏组件
 * 
 * 用于内容加载时显示的骨架占位
 * 
 * @param {SkeletonProps} props - 组件属性
 * @returns {React.ReactElement} 骨架屏组件
 */
export function Skeleton({
  className,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-indigo-950/70 dark:bg-indigo-900/20",
        className
      )}
      {...props}
    />
  );
} 