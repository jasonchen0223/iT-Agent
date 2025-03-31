import { Starfield } from '@/components/ui/Starfield';

/**
 * 全局加载状态组件
 * 
 * 当页面加载时显示的UI
 */
export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center relative">
      <div className="absolute inset-0 z-0">
        <Starfield starsCount={300} speed={0.5} />
      </div>
      <div className="z-10 flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        <p className="text-xl font-semibold text-blue-400">加载中...</p>
      </div>
    </div>
  );
}
