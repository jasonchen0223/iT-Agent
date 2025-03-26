/**
 * MCP工具列表组件
 *
 * 用于展示和管理MCP工具列表，支持搜索和过滤功能
 */
"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { TTool } from "@/types/tool-types";
import McpToolCard from "./McpToolCard";

/**
 * MCP工具列表属性接口
 */
export interface IMcpToolListProps {
  /**
   * 工具列表数据
   */
  tools: TTool[];

  /**
   * 选择工具时的回调函数
   */
  onToolSelect?: (toolId: string) => void;
}

/**
 * MCP工具列表组件
 *
 * @param {IMcpToolListProps} props - 组件属性
 * @returns {React.ReactElement} MCP工具列表组件
 */
export const McpToolList: React.FC<IMcpToolListProps> = ({
  tools,
  onToolSelect,
}) => {
  // 搜索关键词状态
  const [searchQuery, setSearchQuery] = useState("");

  // 根据搜索关键词过滤工具列表
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) {
      return tools;
    }

    const query = searchQuery.toLowerCase();
    return tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.tags?.some((tag) => tag.toLowerCase().includes(query)),
    );
  }, [tools, searchQuery]);

  return (
    <div className="space-y-6" data-oid="k--jav:">
      {/* 搜索栏 */}
      <div className="relative" data-oid="sk0crj7">
        <Input
          type="search"
          placeholder="搜索MCP工具..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-slate-900/50 border-purple-500/30 text-white placeholder:text-slate-400
                             focus:border-purple-400/50 focus:ring-purple-400/20"
          data-oid="wweto1:"
        />
      </div>

      {/* 工具列表网格 */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        data-oid="kxri8q0"
      >
        {filteredTools.map((tool) => (
          <McpToolCard
            key={tool.id}
            tool={tool}
            onClick={onToolSelect}
            data-oid="7q3nzel"
          />
        ))}
      </div>

      {/* 无结果提示 */}
      {filteredTools.length === 0 && (
        <div className="text-center py-8" data-oid="mx5snwh">
          <p className="text-slate-400" data-oid="u:u4qfe">
            没有找到匹配的MCP工具
          </p>
        </div>
      )}
    </div>
  );
};

export default McpToolList;
