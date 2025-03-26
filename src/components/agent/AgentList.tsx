"use client";

import React from "react";
import { IAgentConfig } from "@/types/agent";
import { AgentCard } from "./AgentCard";

/**
 * 代理列表属性接口
 */
interface AgentListProps {
  /**
   * 代理配置数组
   */
  agents: IAgentConfig[];
  /**
   * 代理点击事件处理
   */
  onAgentClick?: (agentId: string) => void;
}

/**
 * 代理列表组件
 *
 * 显示多个代理卡片的网格布局
 *
 * @param {AgentListProps} props - 代理列表属性
 * @returns {React.ReactElement} 代理列表组件
 */
export const AgentList: React.FC<AgentListProps> = ({
  agents,
  onAgentClick,
}) => {
  if (agents.length === 0) {
    return (
      <div
        className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 text-center"
        data-oid="te.9c9v"
      >
        <p className="text-gray-400" data-oid="prxgj7:">
          暂无代理配置
        </p>
        <p className="text-sm text-gray-500 mt-1" data-oid="7c58vx-">
          点击"创建新代理"按钮添加您的第一个代理
        </p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      data-oid="cn7l485"
    >
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          onClick={() => onAgentClick && onAgentClick(agent.id || "")}
          data-oid="_h1f_dk"
        />
      ))}
    </div>
  );
};
