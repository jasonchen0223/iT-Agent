/**
 * 工具卡片组件
 *
 * 展示单个工具信息和操作
 */
"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { TTool, TToolCategory } from "@/types/tool-types";

/**
 * 工具卡片接口
 */
export interface ITool {
  id: string;
  name: string;
  description: string;
  category: TToolCategory;
  tags?: string[];
  isBuiltin?: boolean;
}

/**
 * 工具卡片属性接口
 */
export interface IToolCardProps {
  /**
   * 工具数据
   */
  tool: TTool;
  /**
   * 点击工具时的回调函数
   */
  onClick?: (toolId: string) => void;
}

/**
 * 工具卡片组件
 *
 * 在工具库中显示单个工具的卡片组件
 *
 * @param {IToolCardProps} props - 组件属性
 * @returns {React.ReactElement} 工具卡片组件
 */
export const ToolCard: React.FC<IToolCardProps> = ({ tool, onClick }) => {
  // 类别颜色映射
  const categoryColorMap: Record<TToolCategory, string> = {
    [TToolCategory.AI]: "bg-purple-500",
    [TToolCategory.DEVELOPMENT]: "bg-blue-500",
    [TToolCategory.PRODUCTIVITY]: "bg-green-500",
    [TToolCategory.COMMUNICATION]: "bg-yellow-500",
    [TToolCategory.ANALYSIS]: "bg-red-500",
    [TToolCategory.SYSTEM]: "bg-gray-500",
  };

  // 处理点击事件
  const handleClick = () => {
    if (onClick) {
      onClick(tool.id);
    }
  };

  return (
    <div
      className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={handleClick}
      data-oid="tai70m8"
    >
      <div className="p-5" data-oid="mfl_s0l">
        <div
          className="flex items-center justify-between mb-3"
          data-oid="s6mt6_-"
        >
          <h3
            className="text-lg font-semibold text-white truncate"
            data-oid="3isymdo"
          >
            {tool.name}
          </h3>
          <Badge data-oid="vkrfnn2">{tool.category}</Badge>
        </div>

        <p
          className="text-slate-300 text-sm mb-4 line-clamp-2"
          data-oid="kr-95lv"
        >
          {tool.description}
        </p>

        <div className="flex justify-between items-center" data-oid="feguh95">
          <div className="flex space-x-2" data-oid="bj11lt5">
            {tool.tags &&
              tool.tags.map((tag, index) => (
                <Badge key={index} variant="outline" data-oid="pdkn696">
                  {tag}
                </Badge>
              ))}
          </div>

          <Link
            href={`/tools/${tool.id}`}
            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
            onClick={(e) => e.stopPropagation()}
            data-oid="aa.:ho:"
          >
            详情
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
