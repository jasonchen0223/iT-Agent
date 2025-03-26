// app/page.tsx
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import StarBackground from "@/components/ui/StarBackground";

export default function HomePage() {
  return (
    <>
      <StarBackground data-oid="4ijgvj_" />
      <div className="min-h-screen flex flex-col" data-oid="0eyr09y">
        <Header data-oid="bqhcv:d" />

        {/* 主要内容 - 三列布局 */}
        <main className="flex-1 container mx-auto py-8" data-oid="7u2v7wx">
          <div
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
            data-oid="5a-cn09"
          >
            {/* 左侧 - 项目导航 */}
            <div className="md:col-span-3 space-card" data-oid="zy6fwxc">
              <h2
                className="text-xl font-semibold text-indigo-100 mb-4"
                data-oid="chgs6ov"
              >
                最近项目
              </h2>
              <div className="space-y-2" data-oid="0on8dep">
                {/* 项目列表项 */}
                <div
                  className="p-3 bg-indigo-900/20 rounded-md"
                  data-oid="nik73l3"
                >
                  <h3 className="text-indigo-100" data-oid="x3tmmzh">
                    个人网站开发
                  </h3>
                  <p className="text-indigo-300/70 text-sm" data-oid="trb0xlq">
                    上次编辑: 2小时前
                  </p>
                </div>
                <div
                  className="p-3 bg-indigo-900/20 rounded-md"
                  data-oid="2w57fml"
                >
                  <h3 className="text-indigo-100" data-oid="1ipeofh">
                    智能代理系统
                  </h3>
                  <p className="text-indigo-300/70 text-sm" data-oid="0jj:md4">
                    上次编辑: 昨天
                  </p>
                </div>
              </div>
            </div>

            {/* 中间 - 项目宇宙图 */}
            <div
              className="md:col-span-6 space-card min-h-[400px]"
              data-oid="59f1.xo"
            >
              <h2
                className="text-xl font-semibold text-indigo-100 mb-4"
                data-oid="q7y4yps"
              >
                项目宇宙
              </h2>
              <div
                className="w-full h-[300px] bg-indigo-950/50 rounded-lg flex items-center justify-center"
                data-oid="2kkoiez"
              >
                <p className="text-indigo-300" data-oid="og.y5gt">
                  项目宇宙图可视化区域
                </p>
              </div>
            </div>

            {/* 右侧 - 通知与活动 */}
            <div className="md:col-span-3 space-card" data-oid="_8cowim">
              <h2
                className="text-xl font-semibold text-indigo-100 mb-4"
                data-oid="93_h-ne"
              >
                最近活动
              </h2>
              <div className="space-y-3" data-oid="_:aot:b">
                <div
                  className="p-3 bg-indigo-900/20 rounded-md"
                  data-oid="pf1nqo_"
                >
                  <p className="text-indigo-100 text-sm" data-oid="si8fw1-">
                    产品经理代理完成了需求分析
                  </p>
                  <p className="text-indigo-300/70 text-xs" data-oid="n_-stxq">
                    30分钟前
                  </p>
                </div>
                <div
                  className="p-3 bg-indigo-900/20 rounded-md"
                  data-oid="hi0hak1"
                >
                  <p className="text-indigo-100 text-sm" data-oid="uuo8inv">
                    架构师代理提出了新方案
                  </p>
                  <p className="text-indigo-300/70 text-xs" data-oid="rcre5s-">
                    2小时前
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer data-oid="ewa.co9" />
      </div>
    </>
  );
}
