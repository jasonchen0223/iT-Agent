// app/knowledge/page.tsx
import { Button } from "@/components/ui/Button";

export default function KnowledgeBasePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-100">知识库</h1>
        <div className="flex space-x-3">
          <div className="relative">
            <input
              type="text"
              className="pl-10 pr-4 py-2 bg-indigo-900/20 text-indigo-100 rounded-md border border-indigo-800/30 focus:outline-none focus:border-indigo-500 w-64"
              placeholder="搜索知识库..."
            />

            <svg
              className="w-5 h-5 absolute left-3 top-2.5 text-indigo-300/70"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <Button>添加资料</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* 左侧目录 */}
        <div className="md:col-span-3 space-card">
          <h2 className="text-lg font-semibold text-indigo-100 mb-3">
            知识分类
          </h2>
          <nav className="space-y-1">
            <a
              href="#"
              className="block p-2 bg-indigo-700/30 rounded-md text-white"
            >
              技术文档
            </a>
            <a
              href="#"
              className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
            >
              设计规范
            </a>
            <a
              href="#"
              className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
            >
              项目案例
            </a>
            <a
              href="#"
              className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
            >
              工具使用指南
            </a>
            <a
              href="#"
              className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
            >
              常见问题
            </a>
          </nav>

          <h3 className="text-lg font-semibold text-indigo-100 mt-6 mb-3">
            标签
          </h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full">
              前端
            </span>
            <span className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full">
              React
            </span>
            <span className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full">
              设计
            </span>
            <span className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full">
              架构
            </span>
            <span className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full">
              AutoGen
            </span>
            <span className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full">
              工具
            </span>
          </div>
        </div>

        {/* 中央文档列表 */}
        <div className="md:col-span-9 space-card">
          <h2 className="text-xl font-semibold text-indigo-100 mb-4">
            技术文档
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-indigo-900/20 rounded-md hover:bg-indigo-900/30">
              <div className="flex justify-between">
                <h3 className="text-indigo-100 font-medium">
                  AutoGen 多代理协作框架指南
                </h3>
                <span className="text-indigo-300/70 text-sm">2天前更新</span>
              </div>
              <p className="text-indigo-300/70 mt-2">
                详细介绍AutoGen框架的核心概念、代理类型及协作模式，包含实际案例。
              </p>
              <div className="flex mt-3">
                <span className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full mr-2">
                  AutoGen
                </span>
                <span className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full">
                  架构
                </span>
              </div>
            </div>

            <div className="p-4 bg-indigo-900/20 rounded-md hover:bg-indigo-900/30">
              <div className="flex justify-between">
                <h3 className="text-indigo-100 font-medium">
                  Next.js App Router开发指南
                </h3>
                <span className="text-indigo-300/70 text-sm">1周前更新</span>
              </div>
              <p className="text-indigo-300/70 mt-2">
                介绍Next.js App
                Router的使用方法，包括路由结构、数据获取和页面渲染策略。
              </p>
              <div className="flex mt-3">
                <span className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full mr-2">
                  前端
                </span>
                <span className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full">
                  React
                </span>
              </div>
            </div>

            <div className="p-4 bg-indigo-900/20 rounded-md hover:bg-indigo-900/30">
              <div className="flex justify-between">
                <h3 className="text-indigo-100 font-medium">
                  智能代理UI设计系统规范
                </h3>
                <span className="text-indigo-300/70 text-sm">2周前更新</span>
              </div>
              <p className="text-indigo-300/70 mt-2">
                基于shadcn/ui的靛青主题宇宙星空设计系统详细规范，包含色彩、排版和组件设计准则。
              </p>
              <div className="flex mt-3">
                <span className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full mr-2">
                  设计
                </span>
                <span className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full">
                  UI
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
