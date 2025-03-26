/**
 * 工具列表组件
 *
 * 展示工具列表，支持筛选和搜索
 */
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { TTool } from "@/types/tool-types";
import ToolCard from "./ToolCard";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

/**
 * 工具列表属性接口
 */
export interface IToolListProps {
  /**
   * 初始化工具列表
   */
  initialTools?: TTool[];
}

/**
 * 工具列表组件
 *
 * 显示工具列表，支持搜索和筛选
 *
 * @param {IToolListProps} props - 组件属性
 * @returns {React.ReactElement} 工具列表组件
 */
export const ToolList: React.FC<IToolListProps> = ({ initialTools = [] }) => {
  const [tools, setTools] = useState<TTool[]>(initialTools);
  const [filteredTools, setFilteredTools] = useState<TTool[]>(initialTools);
  const [isLoading, setIsLoading] = useState<boolean>(
    initialTools.length === 0,
  );
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const searchParams = useSearchParams();
  const { toast } = useToast();

  // 加载工具列表
  useEffect(() => {
    const fetchTools = async () => {
      if (initialTools.length > 0) {
        return; // 如果已有初始化数据则不请求
      }

      setIsLoading(true);
      setError(null);

      try {
        const category = searchParams.get("category");
        const apiUrl = category
          ? `/api/tools?category=${category}`
          : "/api/tools";

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error("获取工具列表失败");
        }

        const data = await response.json();

        if (data.success) {
          setTools(data.tools);
          setFilteredTools(data.tools);
        } else {
          throw new Error(data.error || "获取工具列表失败");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "获取工具列表时发生错误");
        toast({
          title: "加载失败",
          description: "获取工具列表时出现错误，请稍后重试。",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTools();
  }, [initialTools, searchParams, toast]);

  // 根据类别筛选工具
  useEffect(() => {
    const category = searchParams.get("category");

    if (!category) {
      setFilteredTools(
        tools.filter(
          (tool) =>
            tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
      return;
    }

    const filtered = tools.filter(
      (tool) =>
        tool.category === category &&
        (tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.toLowerCase())),
    );

    setFilteredTools(filtered);
  }, [tools, searchParams, searchQuery]);

  // 处理搜索
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 处理工具点击
  const handleToolClick = (toolId: string) => {
    console.log(`Tool clicked: ${toolId}`);
  };

  return (
    <div className="space-y-6">
      {/* 搜索框 */}
      <div className="relative">
        <Input
          type="text"
          placeholder="搜索工具..."
          value={searchQuery}
          onChange={handleSearch}
          className="bg-slate-800/40 border-slate-700 text-white placeholder:text-gray-400 focus-visible:ring-indigo-500"
        />
      </div>

      {/* 加载状态 */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {/* 错误状态 */}
      {error && !isLoading && (
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 text-red-300">
          <p className="text-center">{error}</p>
        </div>
      )}

      {/* 工具卡片列表 */}
      {!isLoading && !error && (
        <>
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} onClick={handleToolClick} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-400">没有找到匹配的工具</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ToolList;
