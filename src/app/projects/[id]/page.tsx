// app/projects/[id]/page.tsx
import Footer from '@/components/ui/footer';
import StarBackground from "@/components/ui/StarBackground";
import Link from "next/link";

export default function ProjectWorkspace({
  params,
}: {
  params: { id: string };
}) {
  return (
    <>
      <StarBackground data-oid="g0ghybm" />
      <div className="min-h-screen flex flex-col" data-oid="y3vu:zm">
        {/* 项目信息栏 */}
        <div className="border-b border-indigo-800/20 py-4" data-oid="1en14:5">
          <div
            className="container mx-auto flex justify-between items-center"
            data-oid="fhtb-8a"
          >
            <div data-oid="4qvgybo">
              <h1
                className="text-2xl font-bold text-indigo-100"
                data-oid="r1082g_"
              >
                智能代理系统
              </h1>
              <p className="text-indigo-300/70" data-oid="wc96.20">
                进行中 • 上次更新: 今天
              </p>
            </div>
            <div className="flex space-x-3" data-oid="-zsogav">
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                data-oid="kg4m3nc"
              >
                开始协作
              </button>
              <button
                className="px-4 py-2 border border-indigo-500 text-indigo-100 rounded-md"
                data-oid="zrkseq7"
              >
                设置
              </button>
            </div>
          </div>
        </div>

        {/* 三列布局主体 */}
        <main className="flex-1 container mx-auto py-6" data-oid="1bkdqxr">
          <div
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
            data-oid="duvlq-j"
          >
            {/* 左侧导航 */}
            <div className="md:col-span-2 space-card" data-oid="6qe9tbr">
              <nav className="space-y-2" data-oid="0g.cty7">
                <Link
                  href={`/projects/${params.id}`}
                  className="block p-2 bg-indigo-700/30 rounded-md text-white"
                  data-oid="o15k092"
                >
                  概览
                </Link>
                <Link
                  href={`/projects/${params.id}/requirements`}
                  className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                  data-oid="36-db38"
                >
                  需求
                </Link>
                <Link
                  href={`/projects/${params.id}/tasks`}
                  className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                  data-oid="g-hftyv"
                >
                  任务
                </Link>
                <Link
                  href={`/projects/${params.id}/code`}
                  className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                  data-oid="9:cblba"
                >
                  代码
                </Link>
                <Link
                  href={`/projects/${params.id}/docs`}
                  className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                  data-oid="5fkf9-7"
                >
                  文档
                </Link>
              </nav>
            </div>

            {/* 中央工作区 */}
            <div className="md:col-span-7 space-card" data-oid="qeaqwl4">
              <div className="mb-4" data-oid="ynq4t6i">
                <div
                  className="flex border-b border-indigo-800/20"
                  data-oid="pcmz5m1"
                >
                  <button
                    className="px-4 py-2 text-indigo-100 border-b-2 border-indigo-500"
                    data-oid="bx662za"
                  >
                    星系视图
                  </button>
                  <button
                    className="px-4 py-2 text-indigo-300/70"
                    data-oid="5p7xw88"
                  >
                    表格视图
                  </button>
                  <button
                    className="px-4 py-2 text-indigo-300/70"
                    data-oid="utbu4hj"
                  >
                    时间线
                  </button>
                </div>
              </div>

              {/* 星系视图内容 */}
              <div
                className="h-[500px] bg-indigo-950/50 rounded-lg flex items-center justify-center"
                data-oid="78.18tj"
              >
                <p className="text-indigo-300" data-oid="gd98r47">
                  代理星系视图
                </p>
              </div>
            </div>

            {/* 右侧上下文面板 */}
            <div className="md:col-span-3 space-card" data-oid="sq-lslh">
              <h2
                className="text-xl font-semibold text-indigo-100 mb-4"
                data-oid="9hp6gxn"
              >
                知识库
              </h2>
              <div className="space-y-3" data-oid="ee2t_tn">
                <div
                  className="p-3 bg-indigo-900/20 rounded-md"
                  data-oid="y2pd6v0"
                >
                  <h3 className="text-indigo-100" data-oid="8sqj8-p">
                    系统架构
                  </h3>
                  <p className="text-indigo-300/70 text-sm" data-oid="k-.2awb">
                    核心组件与交互关系
                  </p>
                </div>
                <div
                  className="p-3 bg-indigo-900/20 rounded-md"
                  data-oid="pyblp4v"
                >
                  <h3 className="text-indigo-100" data-oid="o8tr6:9">
                    UI设计系统
                  </h3>
                  <p className="text-indigo-300/70 text-sm" data-oid="r46-z92">
                    靛青主题宇宙风格指南
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer data-oid="cbiqh54" />
      </div>
    </>
  );
}
