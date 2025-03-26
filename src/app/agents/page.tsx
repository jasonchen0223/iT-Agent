// app/agents/page.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Search } from "@/components/ui/Search";
import { Card } from "@/components/ui/Card";
import { AgentList } from "@/components/agent/AgentList";
import { TAgentRole, TAgentStatus } from "@/types/agent";
import { useRouter } from "next/navigation";

// 示例代理数据
const SAMPLE_AGENTS = [
  {
    id: "product-manager",
    name: "产品经理代理",
    role: TAgentRole.PLANNER,
    description: "专注于需求分析和功能规划，擅长用户需求挖掘和产品功能设计。",
    status: TAgentStatus.IDLE,
    color: "#8b5cf6",
    icon: "/icons/product-manager.svg",
    systemMessage: "",
    capability: ["需求分析", "功能规划", "用户调研"],
  },
  {
    id: "architect",
    name: "架构师代理",
    role: TAgentRole.ORCHESTRATOR,
    description: "负责系统设计和技术选型，构建可扩展、高性能的系统架构方案。",
    status: TAgentStatus.IDLE,
    color: "#3b82f6",
    icon: "/icons/architect.svg",
    systemMessage: "",
    capability: ["架构设计", "技术选型", "性能优化"],
  },
  {
    id: "developer",
    name: "开发者代理",
    role: TAgentRole.CODER,
    description: "前端与后端实现专家，精通多种编程语言和前后端技术。",
    status: TAgentStatus.WORKING,
    color: "#10b981",
    icon: "/icons/developer.svg",
    systemMessage: "",
    capability: ["前端开发", "后端开发", "代码审查"],
  },
  {
    id: "tester",
    name: "测试工程师代理",
    role: TAgentRole.TESTER,
    description:
      "专注于质量保障，设计测试用例并执行自动化测试，确保产品可靠性。",
    status: TAgentStatus.WAITING,
    color: "#059669",
    icon: "/icons/tester.svg",
    systemMessage: "",
    capability: ["测试用例设计", "自动化测试", "性能测试"],
  },
  {
    id: "devops",
    name: "DevOps工程师代理",
    role: TAgentRole.EXECUTOR,
    description:
      "自动化部署与运维专家，负责持续集成、持续交付流程的实施与优化。",
    status: TAgentStatus.DONE,
    color: "#ef4444",
    icon: "/icons/devops.svg",
    systemMessage: "",
    capability: ["自动化部署", "持续集成", "容器化"],
  },
  {
    id: "doc-writer",
    name: "文档工程师代理",
    role: TAgentRole.REVIEWER,
    description: "专注于技术文档撰写与维护，确保文档的准确性、完整性和可读性。",
    status: TAgentStatus.ERROR,
    color: "#f97316",
    icon: "/icons/doc-writer.svg",
    systemMessage: "",
    capability: ["技术文档", "API文档", "用户指南"],
  },
];

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [agents, setAgents] = useState(SAMPLE_AGENTS);
  const router = useRouter();

  // 根据搜索查询过滤代理
  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.capability.some((cap) =>
        cap.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  // 处理代理点击
  const handleAgentClick = (agentId: string) => {
    router.push(`/agents/${agentId}`);
  };

  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-indigo-100">智能代理</h1>
          <p className="text-indigo-300/70 mt-1">管理您的多智能代理团队</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Search
            placeholder="搜索代理..."
            onSearch={handleSearch}
            className="w-full sm:w-64"
          />

          <Button onClick={() => router.push("/agents/create")}>
            创建代理
          </Button>
        </div>
      </div>

      {/* 过滤器和状态指示器 */}
      <Card className="mb-6 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-indigo-300/70">过滤器:</span>
          <span className="px-3 py-1 bg-indigo-900/40 text-indigo-300 text-sm rounded-full cursor-pointer hover:bg-indigo-900/60">
            全部
          </span>
          <span className="px-3 py-1 bg-indigo-900/20 text-indigo-300 text-sm rounded-full cursor-pointer hover:bg-indigo-900/40">
            在线
          </span>
          <span className="px-3 py-1 bg-indigo-900/20 text-indigo-300 text-sm rounded-full cursor-pointer hover:bg-indigo-900/40">
            工作中
          </span>
          <span className="px-3 py-1 bg-indigo-900/20 text-indigo-300 text-sm rounded-full cursor-pointer hover:bg-indigo-900/40">
            错误
          </span>

          <div className="ml-auto flex items-center">
            <span className="text-sm text-indigo-300/70 mr-2">
              显示 {filteredAgents.length} 个代理
            </span>
          </div>
        </div>
      </Card>

      {/* 代理列表 */}
      {filteredAgents.length > 0 ? (
        <AgentList agents={filteredAgents} onAgentClick={handleAgentClick} />
      ) : (
        <div className="bg-indigo-900/20 border border-indigo-800/30 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-indigo-100 mb-2">
            未找到代理
          </h3>
          <p className="text-indigo-300/70 mb-4">
            尝试调整搜索条件或创建新的代理
          </p>
          <Button onClick={() => router.push("/agents/create")}>
            创建代理
          </Button>
        </div>
      )}
    </div>
  );
}
