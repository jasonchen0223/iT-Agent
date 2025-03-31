'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui';

/**
 * 错误边界组件
 * 
 * 当路由内发生错误时显示的UI
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 记录错误到错误报告服务
    console.error('路由错误:', error);
  }, [error]);

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
      <div className="space-y-6 max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-rose-500">出现了一些问题</h2>
        <p className="text-gray-300">
          很抱歉，加载此页面时发生了错误。我们已记录此问题，并将尽快修复。
        </p>
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={() => reset()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            重试
          </Button>
          <Button 
            onClick={() => window.location.href = '/'}
            variant="outline"
          >
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
}
