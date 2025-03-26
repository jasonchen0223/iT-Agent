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
      <StarBackground data-oid="48p2a9j" />
      <div className="min-h-screen flex flex-col" data-oid="w:sfij-">
        {/* 项目信息栏 */}
        <div className="border-b border-indigo-800/20 py-4" data-oid="0avf2m3">
          <div
            className="container mx-auto flex justify-between items-center"
            data-oid="8m49em."
          >
            <div data-oid="o5d2ph-">
              <h1
                className="text-2xl font-bold text-indigo-100"
                data-oid="n_:oqtu"
              >
                智能代理系统
              </h1>
              <p className="text-indigo-300/70" data-oid="-:p7m34">
                进行中 • 上次更新: 今天
              </p>
            </div>
            <div className="flex space-x-3" data-oid="t8bp9ne">
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                data-oid="o.6jo0n"
              >
                开始协作
              </button>
              <button
                className="px-4 py-2 border border-indigo-500 text-indigo-100 rounded-md"
                data-oid="oa12a-g"
              >
                设置
              </button>
            </div>
          </div>
        </div>

        {/* 三列布局主体 */}
        <main className="flex-1 container mx-auto py-6" data-oid="-i8_t8:">
          <div
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
            data-oid="i3l_n3x"
          >
            {/* 左侧导航 */}
            <div className="md:col-span-2 space-card" data-oid="1nbg2c.">
              <nav className="space-y-2" data-oid="jb0a8o0">
                <Link
                  href={`/projects/${params.id}`}
                  className="block p-2 bg-indigo-700/30 rounded-md text-white"
                  data-oid=":okyxy9"
                >
                  概览
                </Link>
                <Link
                  href={`/projects/${params.id}/requirements`}
                  className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                  data-oid="cm-9q7u"
                >
                  需求
                </Link>
                <Link
                  href={`/projects/${params.id}/tasks`}
                  className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                  data-oid="lk_sxzx"
                >
                  任务
                </Link>
                <Link
                  href={`/projects/${params.id}/code`}
                  className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                  data-oid="rhjbxte"
                >
                  代码
                </Link>
                <Link
                  href={`/projects/${params.id}/docs`}
                  className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                  data-oid="ihqnixi"
                >
                  文档
                </Link>
              </nav>
            </div>

            {/* 中央工作区 */}
            <div className="md:col-span-7 space-card" data-oid="i2ht8._">
              <div className="mb-4" data-oid="2o_nvvc">
                <div
                  className="flex border-b border-indigo-800/20"
                  data-oid="etm-l0e"
                >
                  <button
                    className="px-4 py-2 text-indigo-100 border-b-2 border-indigo-500"
                    data-oid=".gc-_3e"
                  >
                    星系视图
                  </button>
                  <button
                    className="px-4 py-2 text-indigo-300/70"
                    data-oid="yl7v8iw"
                  >
                    表格视图
                  </button>
                  <button
                    className="px-4 py-2 text-indigo-300/70"
                    data-oid="8fpxk9p"
                  >
                    时间线
                  </button>
                </div>
              </div>

              {/* 星系视图内容 */}
              <div
                className="h-[500px] bg-indigo-950/50 rounded-lg flex items-center justify-center"
                data-oid="u8ff1do"
              >
                <p className="text-indigo-300" data-oid="9le1i:w">
                  代理星系视图
                </p>
              </div>
            </div>

            {/* 右侧上下文面板 */}
            <div className="md:col-span-3 space-card" data-oid="bk2.k9u">
              <h2
                className="text-xl font-semibold text-indigo-100 mb-4"
                data-oid="5fkrr67"
              >
                知识库
              </h2>
              <div className="space-y-3" data-oid="7f6o1dj">
                <div
                  className="p-3 bg-indigo-900/20 rounded-md"
                  data-oid="vommzz_"
                >
                  <h3 className="text-indigo-100" data-oid="4dmkf8-">
                    系统架构
                  </h3>
                  <p className="text-indigo-300/70 text-sm" data-oid="2j0vo5l">
                    核心组件与交互关系
                  </p>
                </div>
                <div
                  className="p-3 bg-indigo-900/20 rounded-md"
                  data-oid="00a3y11"
                >
                  <h3 className="text-indigo-100" data-oid="bpsnyaj">
                    UI设计系统
                  </h3>
                  <p className="text-indigo-300/70 text-sm" data-oid="-izk0zx">
                    靛青主题宇宙风格指南
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer data-oid="b7nbg_7" />
      </div>
    </>
  );
}
