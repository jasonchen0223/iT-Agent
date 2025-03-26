// app/projects/[id]/page.tsx
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import StarBackground from "@/components/ui/StarBackground";
import Link from "next/link";

export default function ProjectWorkspace({
  params,
}: {
  params: { id: string };
}) {
  return (
    <>
      <StarBackground />
      <div className="min-h-screen flex flex-col">
        {/* 项目信息栏 */}
        <div className="border-b border-indigo-800/20 py-4">
          <div className="container mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-indigo-100">
                智能代理系统
              </h1>
              <p className="text-indigo-300/70">进行中 • 上次更新: 今天</p>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md">
                开始协作
              </button>
              <button className="px-4 py-2 border border-indigo-500 text-indigo-100 rounded-md">
                设置
              </button>
            </div>
          </div>
        </div>

        {/* 三列布局主体 */}
        <main className="flex-1 container mx-auto py-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* 左侧导航 */}
            <div className="md:col-span-2 space-card">
              <nav className="space-y-2">
                <Link
                  href={`/projects/${params.id}`}
                  className="block p-2 bg-indigo-700/30 rounded-md text-white"
                >
                  概览
                </Link>
                <Link
                  href={`/projects/${params.id}/requirements`}
                  className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                >
                  需求
                </Link>
                <Link
                  href={`/projects/${params.id}/tasks`}
                  className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                >
                  任务
                </Link>
                <Link
                  href={`/projects/${params.id}/code`}
                  className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                >
                  代码
                </Link>
                <Link
                  href={`/projects/${params.id}/docs`}
                  className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                >
                  文档
                </Link>
              </nav>
            </div>

            {/* 中央工作区 */}
            <div className="md:col-span-7 space-card">
              <div className="mb-4">
                <div className="flex border-b border-indigo-800/20">
                  <button className="px-4 py-2 text-indigo-100 border-b-2 border-indigo-500">
                    星系视图
                  </button>
                  <button className="px-4 py-2 text-indigo-300/70">
                    表格视图
                  </button>
                  <button className="px-4 py-2 text-indigo-300/70">
                    时间线
                  </button>
                </div>
              </div>

              {/* 星系视图内容 */}
              <div className="h-[500px] bg-indigo-950/50 rounded-lg flex items-center justify-center">
                <p className="text-indigo-300">代理星系视图</p>
              </div>
            </div>

            {/* 右侧上下文面板 */}
            <div className="md:col-span-3 space-card">
              <h2 className="text-xl font-semibold text-indigo-100 mb-4">
                知识库
              </h2>
              <div className="space-y-3">
                <div className="p-3 bg-indigo-900/20 rounded-md">
                  <h3 className="text-indigo-100">系统架构</h3>
                  <p className="text-indigo-300/70 text-sm">
                    核心组件与交互关系
                  </p>
                </div>
                <div className="p-3 bg-indigo-900/20 rounded-md">
                  <h3 className="text-indigo-100">UI设计系统</h3>
                  <p className="text-indigo-300/70 text-sm">
                    靛青主题宇宙风格指南
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
