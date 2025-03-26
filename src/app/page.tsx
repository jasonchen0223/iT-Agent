// app/page.tsx
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import StarBackground from "@/components/ui/StarBackground";

export default function HomePage() {
  return (
    <>
      <StarBackground />
      <div className="min-h-screen flex flex-col">
        <Header />

        {/* 主要内容 - 三列布局 */}
        <main className="flex-1 container mx-auto py-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* 左侧 - 项目导航 */}
            <div className="md:col-span-3 space-card">
              <h2 className="text-xl font-semibold text-indigo-100 mb-4">
                最近项目
              </h2>
              <div className="space-y-2">
                {/* 项目列表项 */}
                <div className="p-3 bg-indigo-900/20 rounded-md">
                  <h3 className="text-indigo-100">个人网站开发</h3>
                  <p className="text-indigo-300/70 text-sm">
                    上次编辑: 2小时前
                  </p>
                </div>
                <div className="p-3 bg-indigo-900/20 rounded-md">
                  <h3 className="text-indigo-100">智能代理系统</h3>
                  <p className="text-indigo-300/70 text-sm">上次编辑: 昨天</p>
                </div>
              </div>
            </div>

            {/* 中间 - 项目宇宙图 */}
            <div className="md:col-span-6 space-card min-h-[400px]">
              <h2 className="text-xl font-semibold text-indigo-100 mb-4">
                项目宇宙
              </h2>
              <div className="w-full h-[300px] bg-indigo-950/50 rounded-lg flex items-center justify-center">
                <p className="text-indigo-300">项目宇宙图可视化区域</p>
              </div>
            </div>

            {/* 右侧 - 通知与活动 */}
            <div className="md:col-span-3 space-card">
              <h2 className="text-xl font-semibold text-indigo-100 mb-4">
                最近活动
              </h2>
              <div className="space-y-3">
                <div className="p-3 bg-indigo-900/20 rounded-md">
                  <p className="text-indigo-100 text-sm">
                    产品经理代理完成了需求分析
                  </p>
                  <p className="text-indigo-300/70 text-xs">30分钟前</p>
                </div>
                <div className="p-3 bg-indigo-900/20 rounded-md">
                  <p className="text-indigo-100 text-sm">
                    架构师代理提出了新方案
                  </p>
                  <p className="text-indigo-300/70 text-xs">2小时前</p>
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
