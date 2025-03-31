'use client';
 
import { useEffect } from 'react';
import { Button } from '@/components/ui';
 
/**
 * 全局错误处理组件
 * 
 * 当根布局中出现错误时显示的UI
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 记录严重错误到错误报告服务
    console.error('全局错误:', error);
  }, [error]);
 
  return (
    <html lang="zh-CN">
      <body>
        <div className="min-h-screen flex items-center justify-center p-8 bg-gray-950 text-white">
          <div className="space-y-6 max-w-md mx-auto text-center">
            <h1 className="text-3xl font-bold text-rose-500">严重错误</h1>
            <p className="text-gray-300">
              应用程序遇到了严重问题。我们已记录此错误，并将尽快修复。
            </p>
            <p className="text-sm text-gray-400">
              错误代码：{error.digest}
            </p>
            <div className="pt-4">
              <Button 
                onClick={() => reset()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                重试
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
