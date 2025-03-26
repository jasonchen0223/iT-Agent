// app/projects/page.tsx
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function ProjectsPage() {
  return (
    <div className="container mx-auto py-8" data-oid=":ic16q1">
      <div
        className="flex justify-between items-center mb-6"
        data-oid="jmixkrw"
      >
        <h1 className="text-2xl font-bold text-indigo-100" data-oid="jholi6w">
          项目管理
        </h1>
        <Button data-oid="m1q8o.9">创建新项目</Button>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        data-oid="p_dre_p"
      >
        {/* 项目卡片 */}
        <Link
          href="/projects/1"
          className="space-card hover:border-indigo-500 transition-colors"
          data-oid="0fvtuov"
        >
          <h2
            className="text-xl font-semibold text-indigo-100 mb-2"
            data-oid="85camh7"
          >
            智能代理系统
          </h2>
          <p className="text-indigo-300/70 mb-4" data-oid="8lsshaf">
            基于AutoGen构建的多智能代理协作系统
          </p>
          <div className="flex justify-between items-center" data-oid="kk6ldzo">
            <span
              className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full"
              data-oid="wt-3du2"
            >
              进行中
            </span>
            <span className="text-indigo-300/70 text-sm" data-oid=":j7vnny">
              更新于 2小时前
            </span>
          </div>
        </Link>

        <Link
          href="/projects/2"
          className="space-card hover:border-indigo-500 transition-colors"
          data-oid="fele1g_"
        >
          <h2
            className="text-xl font-semibold text-indigo-100 mb-2"
            data-oid="zrtn3:g"
          >
            个人网站重构
          </h2>
          <p className="text-indigo-300/70 mb-4" data-oid="72q0sur">
            响应式设计的个人博客与作品集
          </p>
          <div className="flex justify-between items-center" data-oid="w87j7jf">
            <span
              className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full"
              data-oid="rzppkl_"
            >
              规划中
            </span>
            <span className="text-indigo-300/70 text-sm" data-oid="vgk3r:y">
              更新于 昨天
            </span>
          </div>
        </Link>

        <Link
          href="/projects/3"
          className="space-card hover:border-indigo-500 transition-colors"
          data-oid="6ohoksb"
        >
          <h2
            className="text-xl font-semibold text-indigo-100 mb-2"
            data-oid="55beqav"
          >
            数据可视化工具
          </h2>
          <p className="text-indigo-300/70 mb-4" data-oid="5tw-n4q">
            使用D3.js的交互式数据分析平台
          </p>
          <div className="flex justify-between items-center" data-oid="im5d1w:">
            <span
              className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full"
              data-oid="12s3q0l"
            >
              已完成
            </span>
            <span className="text-indigo-300/70 text-sm" data-oid=":ujhq0:">
              更新于 上周
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
