// app/projects/page.tsx
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function ProjectsPage() {
  return (
    <div className="container mx-auto py-8" data-oid="ituxdwc">
      <div
        className="flex justify-between items-center mb-6"
        data-oid="rwcng4f"
      >
        <h1 className="text-2xl font-bold text-indigo-100" data-oid="_5o-y48">
          项目管理
        </h1>
        <Button data-oid="o-x6njw">创建新项目</Button>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        data-oid="u7::-xw"
      >
        {/* 项目卡片 */}
        <Link
          href="/projects/1"
          className="space-card hover:border-indigo-500 transition-colors"
          data-oid="39oaww2"
        >
          <h2
            className="text-xl font-semibold text-indigo-100 mb-2"
            data-oid="r-_dhm2"
          >
            智能代理系统
          </h2>
          <p className="text-indigo-300/70 mb-4" data-oid="44s:-1q">
            基于AutoGen构建的多智能代理协作系统
          </p>
          <div className="flex justify-between items-center" data-oid="xgwlg6e">
            <span
              className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full"
              data-oid="hunb1b_"
            >
              进行中
            </span>
            <span className="text-indigo-300/70 text-sm" data-oid="r8v.u:1">
              更新于 2小时前
            </span>
          </div>
        </Link>

        <Link
          href="/projects/2"
          className="space-card hover:border-indigo-500 transition-colors"
          data-oid="5bu:9y6"
        >
          <h2
            className="text-xl font-semibold text-indigo-100 mb-2"
            data-oid="-c:q4e3"
          >
            个人网站重构
          </h2>
          <p className="text-indigo-300/70 mb-4" data-oid="yp5ncwy">
            响应式设计的个人博客与作品集
          </p>
          <div className="flex justify-between items-center" data-oid="ysfbebm">
            <span
              className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full"
              data-oid="ywnhpoc"
            >
              规划中
            </span>
            <span className="text-indigo-300/70 text-sm" data-oid="rs-_45e">
              更新于 昨天
            </span>
          </div>
        </Link>

        <Link
          href="/projects/3"
          className="space-card hover:border-indigo-500 transition-colors"
          data-oid="_345vws"
        >
          <h2
            className="text-xl font-semibold text-indigo-100 mb-2"
            data-oid="3vcb2l."
          >
            数据可视化工具
          </h2>
          <p className="text-indigo-300/70 mb-4" data-oid="kya6m42">
            使用D3.js的交互式数据分析平台
          </p>
          <div className="flex justify-between items-center" data-oid="o9g9-:d">
            <span
              className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full"
              data-oid="v640glm"
            >
              已完成
            </span>
            <span className="text-indigo-300/70 text-sm" data-oid="s6eth0q">
              更新于 上周
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
