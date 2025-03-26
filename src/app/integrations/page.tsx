// app/integrations/page.tsx
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import StarBackground from "@/components/ui/StarBackground";

export default function IntegrationsPage() {
  return (
    <>
      <StarBackground />
      <div className="min-h-screen flex flex-col">
        <Header />

        {/* 工具集成导航栏 */}
        <div className="border-b border-indigo-800/20 py-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold text-indigo-100">工具集成</h1>
            <div className="flex space-x-4 mt-2">
              <button className="px-4 py-1 bg-indigo-700/50 text-white rounded-md">
                所有工具
              </button>
              <button className="px-4 py-1 text-indigo-300 hover:bg-indigo-700/20 rounded-md">
                开发工具
              </button>
              <button className="px-4 py-1 text-indigo-300 hover:bg-indigo-700/20 rounded-md">
                分析工具
              </button>
              <button className="px-4 py-1 text-indigo-300 hover:bg-indigo-700/20 rounded-md">
                通信工具
              </button>
            </div>
          </div>
        </div>

        {/* 三列布局主体 */}
        <main className="flex-1 container mx-auto py-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* 左侧工具目录 */}
            <div className="md:col-span-3 space-card">
              <h2 className="text-lg font-semibold text-indigo-100 mb-3">
                工具目录
              </h2>
              <div className="space-y-1">
                <div className="p-2 bg-indigo-700/30 rounded-md text-white">
                  MCP Agent
                </div>
                <div className="p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md">
                  代码分析器
                </div>
                <div className="p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md">
                  文档生成器
                </div>
                <div className="p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md">
                  API测试工具
                </div>
              </div>
            </div>

            {/* 中央工具详情 */}
            <div className="md:col-span-6 space-card">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-md bg-purple-600 flex items-center justify-center mr-3">
                  <span className="text-white font-semibold">M</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-indigo-100">
                    MCP Agent
                  </h2>
                  <p className="text-indigo-300/70">
                    Model Context Protocol 实现
                  </p>
                </div>
                <div className="ml-auto">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                    已连接
                  </span>
                </div>
              </div>

              <div className="p-4 bg-indigo-900/20 rounded-md mb-4">
                <p className="text-indigo-100">
                  MCP Agent
                  提供了丰富的工具集，帮助智能代理执行各种任务，包括代码操作、终端命令执行和外部API调用等。
                </p>
              </div>

              <h3 className="text-lg font-semibold text-indigo-100 mb-3">
                工具配置
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-indigo-100 block mb-1">
                      API密钥
                    </label>
                    <input
                      type="password"
                      defaultValue="********"
                      className="w-full bg-indigo-900/20 text-indigo-100 p-2 rounded-md border border-indigo-800/30"
                    />
                  </div>
                  <div>
                    <label className="text-indigo-100 block mb-1">
                      超时设置(秒)
                    </label>
                    <input
                      type="number"
                      defaultValue="60"
                      className="w-full bg-indigo-900/20 text-indigo-100 p-2 rounded-md border border-indigo-800/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-indigo-100 block mb-1">可用工具</label>
                  <div className="p-3 bg-indigo-900/30 rounded-md grid grid-cols-3 gap-2">
                    <span className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full text-center">
                      文件搜索
                    </span>
                    <span className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full text-center">
                      代码编辑
                    </span>
                    <span className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full text-center">
                      终端命令
                    </span>
                    <span className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full text-center">
                      网络搜索
                    </span>
                    <span className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full text-center">
                      API调用
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4 space-x-3">
                <button className="px-4 py-2 border border-indigo-500 text-indigo-100 rounded-md">
                  测试连接
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md">
                  保存配置
                </button>
              </div>
            </div>

            {/* 右侧状态监控 */}
            <div className="md:col-span-3 space-card">
              <h2 className="text-lg font-semibold text-indigo-100 mb-3">
                状态监控
              </h2>

              <div className="p-3 bg-indigo-900/20 rounded-md mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-indigo-100">CPU使用率</span>
                  <span className="text-indigo-300">23%</span>
                </div>
                <div className="w-full bg-indigo-900/30 h-2 rounded-full">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "23%" }}
                  ></div>
                </div>
              </div>

              <div className="p-3 bg-indigo-900/20 rounded-md mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-indigo-100">内存使用率</span>
                  <span className="text-indigo-300">45%</span>
                </div>
                <div className="w-full bg-indigo-900/30 h-2 rounded-full">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: "45%" }}
                  ></div>
                </div>
              </div>

              <h3 className="text-sm font-semibold text-indigo-100 mb-2">
                最近调用
              </h3>
              <div className="space-y-2">
                <div className="p-2 bg-indigo-900/20 rounded-md text-xs">
                  <p className="text-indigo-100">文件搜索: src/components/</p>
                  <p className="text-indigo-300/70">2分钟前</p>
                </div>
                <div className="p-2 bg-indigo-900/20 rounded-md text-xs">
                  <p className="text-indigo-100">代码编辑: app/page.tsx</p>
                  <p className="text-indigo-300/70">15分钟前</p>
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
