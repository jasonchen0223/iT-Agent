// app/collaboration/[id]/page.tsx
import Footer from "@/components/ui/Footer";
import StarBackground from "@/components/ui/StarBackground";

export default function CollaborationSession({
  params,
}: {
  params: { id: string };
}) {
  return (
    <>
      <StarBackground />
      <div className="min-h-screen flex flex-col">
        {/* 会话信息栏 */}
        <div className="border-b border-indigo-800/20 py-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold text-indigo-100">
              前端开发协作会话
            </h1>
            <p className="text-indigo-300/70">目标: 实现首页UI组件 • 进行中</p>
          </div>
        </div>

        {/* 三列布局主体 */}
        <main className="flex-1 container mx-auto py-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* 左侧参与代理列表 */}
            <div className="md:col-span-2 space-card">
              <h2 className="text-lg font-semibold text-indigo-100 mb-3">
                参与代理
              </h2>
              <div className="space-y-3">
                <div className="flex items-center p-2 bg-indigo-900/30 rounded-md">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-indigo-100">产品经理</span>
                </div>
                <div className="flex items-center p-2 bg-indigo-900/30 rounded-md">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-indigo-100">架构师</span>
                </div>
                <div className="flex items-center p-2 bg-indigo-900/30 rounded-md">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-indigo-100">前端开发</span>
                </div>
                <div className="flex items-center p-2 bg-indigo-900/20 rounded-md">
                  <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                  <span className="text-indigo-300/70">测试工程师</span>
                </div>
              </div>
            </div>

            {/* 中央消息流 */}
            <div className="md:col-span-7 space-card">
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {/* 代理消息 */}
                <div className="flex">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center mr-2">
                    <span className="text-xs text-white">PM</span>
                  </div>
                  <div className="bg-indigo-900/30 p-3 rounded-tl-sm rounded-tr-lg rounded-br-lg rounded-bl-lg max-w-[80%]">
                    <p className="text-indigo-100">
                      我们需要根据UI设计系统实现首页的三列布局
                    </p>
                  </div>
                </div>

                {/* 另一个代理消息 */}
                <div className="flex">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                    <span className="text-xs text-white">AR</span>
                  </div>
                  <div className="bg-indigo-900/30 p-3 rounded-tl-sm rounded-tr-lg rounded-br-lg rounded-bl-lg max-w-[80%]">
                    <p className="text-indigo-100">
                      建议使用Grid布局实现，确保响应式效果
                    </p>
                  </div>
                </div>

                {/* 用户消息 */}
                <div className="flex justify-end">
                  <div className="bg-indigo-600/50 p-3 rounded-tl-lg rounded-tr-sm rounded-br-sm rounded-bl-lg max-w-[80%]">
                    <p className="text-white">好的，请提供具体的实现方案</p>
                  </div>
                </div>
              </div>

              {/* 输入区域 */}
              <div className="mt-4 border-t border-indigo-800/20 pt-4">
                <div className="flex">
                  <input
                    type="text"
                    className="flex-1 bg-indigo-900/20 text-indigo-100 p-3 rounded-l-md border border-indigo-800/30 focus:outline-none focus:border-indigo-500"
                    placeholder="输入消息..."
                  />

                  <button className="bg-indigo-600 text-white px-4 rounded-r-md">
                    发送
                  </button>
                </div>
              </div>
            </div>

            {/* 右侧上下文面板 */}
            <div className="md:col-span-3 space-card">
              <h2 className="text-lg font-semibold text-indigo-100 mb-3">
                上下文资料
              </h2>
              <div className="space-y-3">
                <div className="p-3 bg-indigo-900/20 rounded-md">
                  <h3 className="text-indigo-100 text-sm font-medium">
                    首页设计稿
                  </h3>
                  <p className="text-indigo-300/70 text-xs">
                    包含三列布局的设计规范
                  </p>
                </div>
                <div className="p-3 bg-indigo-900/20 rounded-md">
                  <h3 className="text-indigo-100 text-sm font-medium">
                    组件库文档
                  </h3>
                  <p className="text-indigo-300/70 text-xs">
                    shadcn/ui组件使用参考
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
