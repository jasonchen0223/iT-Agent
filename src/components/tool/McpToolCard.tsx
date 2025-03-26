/**
 * MCP工具卡片组件
 *
 * 专门用于展示MCP工具的卡片组件，包含工具状态和特殊样式
 */
"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TTool } from "@/types/tool-types";
import { cn } from "@/lib/utils";

/**
 * MCP工具卡片属性接口
 */
export interface IMcpToolCardProps {
  /**
   * 工具数据
   */
  tool: TTool;

  /**
   * 工具状态
   */
  status?: "active" | "idle";

  /**
   * 点击工具时的回调函数
   */
  onClick?: (toolId: string) => void;
}

/**
 * 工具状态徽章组件
 */
const ToolStatusBadge: React.FC<{ status: "active" | "idle" }> = ({
  status,
}) => {
  return (
    <Badge
      className={cn(
        "absolute top-3 right-3",
        status === "active"
          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
          : "bg-slate-500/20 text-slate-300 border-slate-500/50",
      )}
      data-oid="l362sn6"
    >
      {status === "active" ? "活跃" : "休眠"}
    </Badge>
  );
};

/**
 * MCP工具卡片组件
 *
 * @param {IMcpToolCardProps} props - 组件属性
 * @returns {React.ReactElement} MCP工具卡片组件
 */
export const McpToolCard: React.FC<IMcpToolCardProps> = ({
  tool,
  status = "idle",
  onClick,
}) => {
  // 处理点击事件
  const handleClick = () => {
    if (onClick) {
      onClick(tool.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn("cursor-pointer transition-all duration-300 group")}
      data-oid="5tm_vr0"
    >
      <Card
        className={cn(
          "relative overflow-hidden",
          "bg-gradient-to-br from-purple-900/80 to-slate-900/80",
          "border border-purple-500/30 hover:border-purple-400/50",
          "shadow-lg hover:shadow-purple-500/20",
        )}
        data-oid="z-zb64t"
      >
        <div
          className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors duration-300"
          data-oid="iirp2fe"
        />

        <CardHeader className="relative" data-oid="3rf5vaj">
          <CardTitle
            className="flex items-center text-white"
            data-oid="d9-.t1i"
          >
            {/* 这里可以添加工具图标 */}
            <span className="text-lg" data-oid="_zc75yv">
              {tool.name}
            </span>
          </CardTitle>
          <ToolStatusBadge status={status} data-oid="37m-48h" />
        </CardHeader>

        <CardContent data-oid=".-zx32y">
          <p
            className="text-slate-300 text-sm mb-4 line-clamp-2"
            data-oid="sr0_h.k"
          >
            {tool.description}
          </p>

          <div className="flex flex-wrap gap-2" data-oid="g6kp-ss">
            {tool.tags &&
              tool.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-purple-500/10 border-purple-500/30 text-purple-300"
                  data-oid="ed60fa5"
                >
                  {tag}
                </Badge>
              ))}
          </div>
        </CardContent>

        <CardFooter
          className="flex justify-between items-center"
          data-oid="e8tnvkr"
        >
          <Button
            variant="ghost"
            className="text-purple-300 hover:text-purple-200 hover:bg-purple-500/20"
            onClick={(e) => {
              e.stopPropagation();
              // 这里可以添加使用工具的逻辑
            }}
            data-oid="55og::9"
          >
            使用工具
          </Button>

          <Link
            href={`/tools/${tool.id}`}
            className="text-purple-400 hover:text-purple-300 text-sm font-medium"
            onClick={(e) => e.stopPropagation()}
            data-oid="m.nim5x"
          >
            详情
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default McpToolCard;
