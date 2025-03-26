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
      <StarBackground data-oid="f:z.3c2" />
      <div className="min-h-screen flex flex-col" data-oid=":aeey1g">
        {/* 项目信息栏 */}
        <div className="border-b border-indigo-800/20 py-4" data-oid="vjb3v_k">
          <div
            className="container mx-auto flex justify-between items-center"
            data-oid="qafe5qp"
          >
            <div data-oid="0_4.-n8">
              <h1
                className="text-2xl font-bold text-indigo-100"
                data-oid="8yro.66"
              >
                智能代理系统
              </h1>
              <p className="text-indigo-300/70" data-oid="0v9558j">
                进行中 • 上次更新: 今天
              </p>
            </div>
            <div className="flex space-x-3" data-oid="d38f.h5">
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                data-oid="9urtnvp"
              >
                开始协作
              </button>
              <button
                className="px-4 py-2 border border-indigo-500 text-indigo-100 rounded-md"
                data-oid="afze5ll"
              >
                设置
              </button>
            </div>
          </div>
        </div>

        {/* 三列布局主体 */}
        <main className="flex-1 container mx-auto py-6" data-oid="mwfh7rs">
          <div
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
            data-oid="_7pgb6b"
          >
            {/* 左侧导航 */}
            <div className="md:col-span-2 space-card" data-oid="ie3jw.3">
              <nav className="space-y-2" data-oid="fjz1xyo">
                <Link
                  href={`/projects/${params.id}`}
                  className="block p-2 bg-indigo-700/30 rounded-md text-white"
                  data-oid="d_:b7-e"
                >
                  概览
                </Link>
                <Link
                  href={`/projects/${params.id}/requirements`}
                  className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                  data-oid="2n_jm5x"
                >
                  需求
                </Link>
                <Link
                  href={`/projects/${params.id}/tasks`}
                  className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                  data-oid="v33qxjo"
                >
                  任务
                </Link>
                <Link
                  href={`/projects/${params.id}/code`}
                  className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                  data-oid="8-2k2::"
                >
                  代码
                </Link>
                <Link
                  href={`/projects/${params.id}/docs`}
                  className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                  data-oid=":l-co7a"
                >
                  文档
                </Link>
              </nav>
            </div>

            {/* 中央工作区 */}
            <div className="md:col-span-7 space-card" data-oid="x9yzk.6">
              <div className="mb-4" data-oid=".blpppi">
                <div
                  className="flex border-b border-indigo-800/20"
                  data-oid=".9mseia"
                >
                  <button
                    className="px-4 py-2 text-indigo-100 border-b-2 border-indigo-500"
                    data-oid="h7kl94j"
                  >
                    星系视图
                  </button>
                  <button
                    className="px-4 py-2 text-indigo-300/70"
                    data-oid="modopct"
                  >
                    表格视图
                  </button>
                  <button
                    className="px-4 py-2 text-indigo-300/70"
                    data-oid="e5_9vtb"
                  >
                    时间线
                  </button>
                </div>
              </div>

              {/* 星系视图内容 */}
              <div
                className="h-[500px] bg-indigo-950/50 rounded-lg flex items-center justify-center"
                data-oid="h2o8r3b"
              >
                <p className="text-indigo-300" data-oid="r.xig94">
                  代理星系视图
                </p>
              </div>
            </div>

            {/* 右侧上下文面板 */}
            <div className="md:col-span-3 space-card" data-oid="zxq.1op">
              <h2
                className="text-xl font-semibold text-indigo-100 mb-4"
                data-oid="75m-auw"
              >
                知识库
              </h2>
              <div className="space-y-3" data-oid="7o51wg4">
                <div
                  className="p-3 bg-indigo-900/20 rounded-md"
                  data-oid="vnf-_z2"
                >
                  <h3 className="text-indigo-100" data-oid="ku2ik6b">
                    系统架构
                  </h3>
                  <p className="text-indigo-300/70 text-sm" data-oid="bnc6f5t">
                    核心组件与交互关系
                  </p>
                </div>
                <div
                  className="p-3 bg-indigo-900/20 rounded-md"
                  data-oid="mq9v8xf"
                >
                  <h3 className="text-indigo-100" data-oid="x_wl_xo">
                    UI设计系统
                  </h3>
                  <p className="text-indigo-300/70 text-sm" data-oid="d8iepzv">
                    靛青主题宇宙风格指南
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer data-oid="7vwwt3i" />
      </div>
    </>
  );
}
