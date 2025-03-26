"use client";

import React from "react";
import { useRouter } from "next/navigation";

/**
 * 代理配置页面（仪表板）
 *
 * 用于展示代理概览和快速访问
 */
export default function AgentsDashboardPage() {
  const router = useRouter();

  // 重定向到主代理页面
  const handleCreateAgent = () => {
    router.push("/agents/create");
  };

  // 重定向到代理列表
  const handleViewAgents = () => {
    router.push("/agents");
  };

  return (
    <div className="container mx-auto px-4 py-8" data-oid="q1r-smn">
      <h1
        className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-100 to-indigo-300"
        data-oid="3h8gmb3"
      >
        代理概览
      </h1>

      <div className="space-card p-6" data-oid="-7b6:30">
        <h2
          className="text-xl font-semibold mb-3 text-indigo-300"
          data-oid="85jwqn-"
        >
          快速操作
        </h2>
        <button
          className="space-button mb-3 mr-3"
          onClick={handleCreateAgent}
          data-oid="1aqferc"
        >
          创建新代理
        </button>
        <button
          className="space-button"
          onClick={handleViewAgents}
          data-oid="cupbu1x"
        >
          查看所有代理
        </button>
      </div>

      <div className="mt-10 space-card p-6" data-oid="cqf9f2_">
        <h2
          className="text-xl font-semibold mb-3 text-indigo-300"
          data-oid="_k0iz4l"
        >
          最近活跃代理
        </h2>
        <p className="text-center py-8 text-slate-400" data-oid="xty:vda">
          暂无近期活跃代理
        </p>
      </div>
    </div>
  );
}
