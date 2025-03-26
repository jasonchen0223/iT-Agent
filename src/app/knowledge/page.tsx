// app/knowledge/page.tsx
import { Button } from "@/components/ui/Button";

export default function KnowledgeBasePage() {
  return (
    <div className="container mx-auto py-8" data-oid="wp:yg.-">
      <div
        className="flex justify-between items-center mb-6"
        data-oid="9w6v8.9"
      >
        <h1 className="text-2xl font-bold text-indigo-100" data-oid="twgkz7_">
          知识库
        </h1>
        <div className="flex space-x-3" data-oid="fvlsnrc">
          <div className="relative" data-oid="xtzvye7">
            <input
              type="text"
              className="pl-10 pr-4 py-2 bg-indigo-900/20 text-indigo-100 rounded-md border border-indigo-800/30 focus:outline-none focus:border-indigo-500 w-64"
              placeholder="搜索知识库..."
              data-oid="ai.7:xr"
            />

            <svg
              className="w-5 h-5 absolute left-3 top-2.5 text-indigo-300/70"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              data-oid="8pkn90t"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                data-oid=".z766a."
              />
            </svg>
          </div>
          <Button data-oid=":c:qu51">添加资料</Button>
        </div>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-12 gap-6"
        data-oid="5yre6iq"
      >
        {/* 左侧目录 */}
        <div className="md:col-span-3 space-card" data-oid="6b069_l">
          <h2
            className="text-lg font-semibold text-indigo-100 mb-3"
            data-oid="meqxbq7"
          >
            知识分类
          </h2>
          <nav className="space-y-1" data-oid="vcn23-0">
            <a
              href="#"
              className="block p-2 bg-indigo-700/30 rounded-md text-white"
              data-oid="ny8da7g"
            >
              技术文档
            </a>
            <a
              href="#"
              className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
              data-oid="0yzxg4_"
            >
              设计规范
            </a>
            <a
              href="#"
              className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
              data-oid=".2lbpmz"
            >
              项目案例
            </a>
            <a
              href="#"
              className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
              data-oid="n_ajor9"
            >
              工具使用指南
            </a>
            <a
              href="#"
              className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
              data-oid="wte.vfu"
            >
              常见问题
            </a>
          </nav>

          <h3
            className="text-lg font-semibold text-indigo-100 mt-6 mb-3"
            data-oid="n-cceww"
          >
            标签
          </h3>
          <div className="flex flex-wrap gap-2" data-oid="p1n6fqi">
            <span
              className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full"
              data-oid="sfumbo7"
            >
              前端
            </span>
            <span
              className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full"
              data-oid="dww4rsu"
            >
              React
            </span>
            <span
              className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full"
              data-oid="qf:yc38"
            >
              设计
            </span>
            <span
              className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full"
              data-oid="1.j:bo0"
            >
              架构
            </span>
            <span
              className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full"
              data-oid="hw81may"
            >
              AutoGen
            </span>
            <span
              className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full"
              data-oid="-s10yii"
            >
              工具
            </span>
          </div>
        </div>

        {/* 中央文档列表 */}
        <div className="md:col-span-9 space-card" data-oid="bnfyyfe">
          <h2
            className="text-xl font-semibold text-indigo-100 mb-4"
            data-oid="ggc0zbo"
          >
            技术文档
          </h2>

          <div className="space-y-4" data-oid="dj_i-yh">
            <div
              className="p-4 bg-indigo-900/20 rounded-md hover:bg-indigo-900/30"
              data-oid="a:108zu"
            >
              <div className="flex justify-between" data-oid="54tllqa">
                <h3 className="text-indigo-100 font-medium" data-oid="yxch6w9">
                  AutoGen 多代理协作框架指南
                </h3>
                <span className="text-indigo-300/70 text-sm" data-oid="c:71kpo">
                  2天前更新
                </span>
              </div>
              <p className="text-indigo-300/70 mt-2" data-oid="6axzcw7">
                详细介绍AutoGen框架的核心概念、代理类型及协作模式，包含实际案例。
              </p>
              <div className="flex mt-3" data-oid="qs9ep91">
                <span
                  className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full mr-2"
                  data-oid="2-bgiq6"
                >
                  AutoGen
                </span>
                <span
                  className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full"
                  data-oid="ihf3ck1"
                >
                  架构
                </span>
              </div>
            </div>

            <div
              className="p-4 bg-indigo-900/20 rounded-md hover:bg-indigo-900/30"
              data-oid="m38nk5n"
            >
              <div className="flex justify-between" data-oid="0262hgi">
                <h3 className="text-indigo-100 font-medium" data-oid="73c_sod">
                  Next.js App Router开发指南
                </h3>
                <span className="text-indigo-300/70 text-sm" data-oid=":a3ggf:">
                  1周前更新
                </span>
              </div>
              <p className="text-indigo-300/70 mt-2" data-oid="6cweo_6">
                介绍Next.js App
                Router的使用方法，包括路由结构、数据获取和页面渲染策略。
              </p>
              <div className="flex mt-3" data-oid="fgpzp6_">
                <span
                  className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full mr-2"
                  data-oid="i75-l3y"
                >
                  前端
                </span>
                <span
                  className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full"
                  data-oid="e:.90az"
                >
                  React
                </span>
              </div>
            </div>

            <div
              className="p-4 bg-indigo-900/20 rounded-md hover:bg-indigo-900/30"
              data-oid="-u:o62j"
            >
              <div className="flex justify-between" data-oid="b3jm7b6">
                <h3 className="text-indigo-100 font-medium" data-oid="1s-c6xf">
                  智能代理UI设计系统规范
                </h3>
                <span className="text-indigo-300/70 text-sm" data-oid="vc4kt3-">
                  2周前更新
                </span>
              </div>
              <p className="text-indigo-300/70 mt-2" data-oid=".pnpjvy">
                基于shadcn/ui的靛青主题宇宙星空设计系统详细规范，包含色彩、排版和组件设计准则。
              </p>
              <div className="flex mt-3" data-oid="h-hxse.">
                <span
                  className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full mr-2"
                  data-oid="y8ptynq"
                >
                  设计
                </span>
                <span
                  className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full"
                  data-oid="wtlf_88"
                >
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
