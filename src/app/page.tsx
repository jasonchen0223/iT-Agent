// app/page.tsx
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import StarBackground from "@/components/ui/StarBackground";

export default function HomePage() {
  return (
    <>
      <StarBackground data-oid="sdo99xk" />
      <div className="min-h-screen flex flex-col" data-oid="gbpw.cy">
        <Header data-oid="v43-_xs" />

        {/* 主要内容 - 三列布局 */}
        <main className="flex-1 container mx-auto py-8" data-oid="-3yx2x2">
          <div
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
            data-oid="_9d_95s"
          >
            {/* 左侧 - 项目导航 */}
            <div className="md:col-span-3 space-card" data-oid="pm-x1ff">
              <h2
                className="text-xl font-semibold text-indigo-100 mb-4"
                data-oid="mr6j8pv"
              >
                最近项目
              </h2>
              <div className="space-y-2" data-oid="s7km200">
                {/* 项目列表项 */}
                <div
                  className="p-3 bg-indigo-900/20 rounded-md"
                  data-oid="_t5gn3u"
                >
                  <h3 className="text-indigo-100" data-oid="gszcdx6">
                    个人网站开发
                  </h3>
                  <p className="text-indigo-300/70 text-sm" data-oid="_ml5jgf">
                    上次编辑: 2小时前
                  </p>
                </div>
                <div
                  className="p-3 bg-indigo-900/20 rounded-md"
                  data-oid="svmgu55"
                >
                  <h3 className="text-indigo-100" data-oid="zd95ftt">
                    智能代理系统
                  </h3>
                  <p className="text-indigo-300/70 text-sm" data-oid="s51tml4">
                    上次编辑: 昨天
                  </p>
                </div>
              </div>
            </div>

            {/* 中间 - 项目宇宙图 */}
            <div
              className="md:col-span-6 space-card min-h-[400px]"
              data-oid="fme6xv8"
            >
              <h2
                className="text-xl font-semibold text-indigo-100 mb-4"
                data-oid="ws826y1"
              >
                项目宇宙
              </h2>
              <div
                className="w-full h-[300px] bg-indigo-950/50 rounded-lg flex items-center justify-center"
                data-oid="5q_tg9q"
              >
                <p className="text-indigo-300" data-oid="v0b:xs5">
                  项目宇宙图可视化区域
                </p>
              </div>
            </div>

            {/* 右侧 - 通知与活动 */}
            <div className="md:col-span-3 space-card" data-oid="6z1t.v0">
              <h2
                className="text-xl font-semibold text-indigo-100 mb-4"
                data-oid="n4fg3t_"
              >
                最近活动
              </h2>
              <div className="space-y-3" data-oid="h:yurhi">
                <div
                  className="p-3 bg-indigo-900/20 rounded-md"
                  data-oid="zdtn_fj"
                >
                  <p className="text-indigo-100 text-sm" data-oid="bd:gcm2">
                    产品经理代理完成了需求分析
                  </p>
                  <p className="text-indigo-300/70 text-xs" data-oid="cj1mb7u">
                    30分钟前
                  </p>
                </div>
                <div
                  className="p-3 bg-indigo-900/20 rounded-md"
                  data-oid="r_oh_y0"
                >
                  <p className="text-indigo-100 text-sm" data-oid="9er12au">
                    架构师代理提出了新方案
                  </p>
                  <p className="text-indigo-300/70 text-xs" data-oid="2r:qnpw">
                    2小时前
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer data-oid="r4o9_qq" />
      </div>
    </>
  );
}
