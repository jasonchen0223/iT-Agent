"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ITool, TToolStatus } from '@/types/tool';
import { cn } from '@/lib/utils';

// 工具状态徽章颜色映射
const statusColorMap: Record<TToolStatus, string> = {
  available: 'bg-green-500',
  running: 'bg-blue-500',
  error: 'bg-red-500',
  disabled: 'bg-gray-500',
  initializing: 'bg-yellow-500'
};

// 工具类型图标映射
const typeIconMap: Record<string, string> = {
  web: '🌐',
  file: '📁',
  database: '💾',
  code: '👨‍💻',
  ai: '🤖',
  utility: '🔧',
  system: '⚙️',
  custom: '🔌'
};

/**
 * 工具卡片组件属性
 */
interface ToolCardProps {
  tool: ITool;
  onClick?: (tool: ITool) => void;
  onExecute?: (tool: ITool) => void;
  onConfigure?: (tool: ITool) => void;
  isSelected?: boolean;
  className?: string;
}

/**
 * 工具卡片组件
 * 
 * 显示工具的基本信息并提供交互功能
 * 
 * @param {ToolCardProps} props - 组件属性
 * @returns {React.ReactElement} 组件渲染结果
 */
export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onClick,
  onExecute,
  onConfigure,
  isSelected = false,
  className
}) => {
  // 获取工具类型图标
  const typeIcon = tool.icon || typeIconMap[tool.type] || '🔧';
  
  // 处理点击事件
  const handleClick = () => {
    if (onClick) {
      onClick(tool);
    }
  };
  
  // 处理执行按钮点击
  const handleExecute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onExecute && tool.status === 'available') {
      onExecute(tool);
    }
  };
  
  // 处理配置按钮点击
  const handleConfigure = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onConfigure) {
      onConfigure(tool);
    }
  };
  
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected ? "ring-2 ring-primary" : "",
        className
      )} 
      onClick={handleClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{typeIcon}</span>
            <CardTitle className="text-lg">{tool.name}</CardTitle>
          </div>
          <Badge className={cn(statusColorMap[tool.status])}>
            {tool.status}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {tool.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs">
            {tool.type}
          </Badge>
          {tool.version && (
            <Badge variant="outline" className="text-xs">
              v{tool.version}
            </Badge>
          )}
          {tool.source && (
            <Badge variant="outline" className="text-xs">
              {tool.source}
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between">
        <Button 
          size="sm" 
          variant="outline"
          onClick={handleConfigure}
        >
          配置
        </Button>
        <Button 
          size="sm"
          disabled={tool.status !== 'available'}
          onClick={handleExecute}
        >
          执行
        </Button>
      </CardFooter>
    </Card>
  );
}; 