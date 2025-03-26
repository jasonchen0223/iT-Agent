// app/knowledge/page.tsx
import { Button } from "@/components/ui/Button";

export default function KnowledgeBasePage() {
  return (
    <div className="container mx-auto py-8" data-oid="-49n.9s">
      <div
        className="flex justify-between items-center mb-6"
        data-oid="tcqrzgb"
      >
        <h1 className="text-2xl font-bold text-indigo-100" data-oid="7ulhx9u">
          知识库
        </h1>
        <div className="flex space-x-3" data-oid="3xu.ld_">
          <div className="relative" data-oid="jh__f9c">
            <input
              type="text"
              className="pl-10 pr-4 py-2 bg-indigo-900/20 text-indigo-100 rounded-md border border-indigo-800/30 focus:outline-none focus:border-indigo-500 w-64"
              placeholder="搜索知识库..."
              data-oid="vymr3c0"
            />

            <svg
              className="w-5 h-5 absolute left-3 top-2.5 text-indigo-300/70"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              data-oid="4jfgjex"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                data-oid="vzzwtxl"
              />
            </svg>
          </div>
          <Button data-oid="o0vllbz">添加资料</Button>
        </div>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-12 gap-6"
        data-oid="17qvw44"
      >
        {/* 左侧目录 */}
        <div className="md:col-span-3 space-card" data-oid="7sz6jzj">
          <h2
            className="text-lg font-semibold text-indigo-100 mb-3"
            data-oid="2wkytv."
          >
            知识分类
          </h2>
          <nav className="space-y-1" data-oid="2pbrkx7">
            <a
              href="#"
              className="block p-2 bg-indigo-700/30 rounded-md text-white"
              data-oid="axtre3f"
            >
              技术文档
            </a>
            <a
              href="#"
              className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
              data-oid="loli-of"
            >
              设计规范
            </a>
            <a
              href="#"
              className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
              data-oid="p8xrf2n"
            >
              项目案例
            </a>
            <a
              href="#"
              className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
              data-oid="d9n6rio"
            >
              工具使用指南
            </a>
            <a
              href="#"
              className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
              data-oid=":k:rb1j"
            >
              常见问题
            </a>
          </nav>

          <h3
            className="text-lg font-semibold text-indigo-100 mt-6 mb-3"
            data-oid="-mo93oq"
          >
            标签
          </h3>
          <div className="flex flex-wrap gap-2" data-oid="ozr8:mx">
            <span
              className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full"
              data-oid="p13z43g"
            >
              前端
            </span>
            <span
              className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full"
              data-oid="sdj2r-b"
            >
              React
            </span>
            <span
              className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full"
              data-oid="hlo5hu:"
            >
              设计
            </span>
            <span
              className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full"
              data-oid="lhubb3t"
            >
              架构
            </span>
            <span
              className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full"
              data-oid="s7:7swu"
            >
              AutoGen
            </span>
            <span
              className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full"
              data-oid=".z.6lsv"
            >
              工具
            </span>
          </div>
        </div>

        {/* 中央文档列表 */}
        <div className="md:col-span-9 space-card" data-oid="6-ocbjy">
          <h2
            className="text-xl font-semibold text-indigo-100 mb-4"
            data-oid="62v43k8"
          >
            技术文档
          </h2>

          <div className="space-y-4" data-oid="fguc0tk">
            <div
              className="p-4 bg-indigo-900/20 rounded-md hover:bg-indigo-900/30"
              data-oid="7zunqlf"
            >
              <div className="flex justify-between" data-oid="igzz2y3">
                <h3 className="text-indigo-100 font-medium" data-oid="yz3y0kg">
                  AutoGen 多代理协作框架指南
                </h3>
                <span className="text-indigo-300/70 text-sm" data-oid="ebu2csb">
                  2天前更新
                </span>
              </div>
              <p className="text-indigo-300/70 mt-2" data-oid="b-i40ii">
                详细介绍AutoGen框架的核心概念、代理类型及协作模式，包含实际案例。
              </p>
              <div className="flex mt-3" data-oid="bm48:-e">
                <span
                  className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full mr-2"
                  data-oid="irk9sbw"
                >
                  AutoGen
                </span>
                <span
                  className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full"
                  data-oid="ktw0cm0"
                >
                  架构
                </span>
              </div>
            </div>

            <div
              className="p-4 bg-indigo-900/20 rounded-md hover:bg-indigo-900/30"
              data-oid="cxpd6-r"
            >
              <div className="flex justify-between" data-oid="its86ku">
                <h3 className="text-indigo-100 font-medium" data-oid="-8zxd7.">
                  Next.js App Router开发指南
                </h3>
                <span className="text-indigo-300/70 text-sm" data-oid="ysecc0c">
                  1周前更新
                </span>
              </div>
              <p className="text-indigo-300/70 mt-2" data-oid="xbt:9sc">
                介绍Next.js App
                Router的使用方法，包括路由结构、数据获取和页面渲染策略。
              </p>
              <div className="flex mt-3" data-oid="y5fs7ef">
                <span
                  className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full mr-2"
                  data-oid="dhi7cit"
                >
                  前端
                </span>
                <span
                  className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full"
                  data-oid="wm45vcs"
                >
                  React
                </span>
              </div>
            </div>

            <div
              className="p-4 bg-indigo-900/20 rounded-md hover:bg-indigo-900/30"
              data-oid="0..xua0"
            >
              <div className="flex justify-between" data-oid="vagaxr8">
                <h3 className="text-indigo-100 font-medium" data-oid="wc0ob1_">
                  智能代理UI设计系统规范
                </h3>
                <span className="text-indigo-300/70 text-sm" data-oid="sk4_my_">
                  2周前更新
                </span>
              </div>
              <p className="text-indigo-300/70 mt-2" data-oid="qhf7hsg">
                基于shadcn/ui的靛青主题宇宙星空设计系统详细规范，包含色彩、排版和组件设计准则。
              </p>
              <div className="flex mt-3" data-oid="iskj.sg">
                <span
                  className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full mr-2"
                  data-oid="67_:8:z"
                >
                  设计
                </span>
                <span
                  className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-xs rounded-full"
                  data-oid="yvcs3og"
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
