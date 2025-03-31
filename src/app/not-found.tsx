"use client";

import Link from 'next/link';
import { Button } from '@/components/ui';

/**
 * 全局404页面
 * 
 * 当访问不存在的路由时显示
 */
export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="space-y-6 max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-blue-500">404</h1>
        <h2 className="text-2xl font-semibold">页面未找到</h2>
        <p className="text-gray-300">
          您访问的页面不存在或已被移动到其他位置。
        </p>
        <div className="pt-4">
          <Link href="/">
            <Button>返回首页</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
