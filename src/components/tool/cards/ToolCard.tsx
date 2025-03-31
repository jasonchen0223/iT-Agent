"use client";

import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlayCircle, Settings, Info } from 'lucide-react';

/**
 * 工具状态类型
 */
export type TToolStatus = 'available' | 'disabled' | 'error' | 'initializing' | 'running';

/**
 * 工具参数接口
 */
export interface IToolParameter {
  /**
   * 参数名称
   */
  name: string;
  /**
   * 参数描述
   */
  description?: string;
  /**
   * 参数类型
   */
  type?: string;
  /**
   * 是否必填
   */
  required?: boolean;
  /**
   * 可选值列表
   */
  options?: string[];
  /**
   * 默认值
   */
  default?: any;
}

/**
 * 工具接口
 */
export interface ITool {
  /**
   * 工具ID
   */
  id: string;
  /**
   * 工具名称
   */
  name: string;
  /**
   * 工具描述
   */
  description: string;
  /**
   * 工具类型
   */
  type: string;
  /**
   * 工具类别
   */
  category?: string;
  /**
   * 工具状态
   */
  status?: TToolStatus;
  /**
   * 相关标签
   */
  tags?: string[];
  /**
   * 是否为内置工具
   */
  isBuiltin?: boolean;
  /**
   * 版本信息
   */
  version?: string;
  /**
   * 参数列表
   */
  parameters?: IToolParameter[];
  /**
   * 使用示例
   */
  examples?: string[];
  /**
   * 需要的权限
   */
  permissions?: string[];
  /**
   * 工具图标（可选）
   */
  icon?: string;
  /**
   * 工具来源
   */
  source?: string;
}

/**
 * 工具卡片属性接口
 */
export interface IToolCardProps {
  /**
   * 工具数据
   */
  tool: ITool;
  /**
   * 点击回调
   */
  onClick: (tool: ITool) => void;
  /**
   * 执行回调
   */
  onExecute?: (tool: ITool) => void;
  /**
   * 配置回调
   */
  onConfigure?: (tool: ITool) => void;
  /**
   * 是否选中
   */
  isSelected?: boolean;
}

/**
 * 工具卡片组件
 * 
 * 显示工具信息和提供交互的卡片组件
 * 
 * @param {IToolCardProps} props - 组件属性
 * @returns {React.ReactElement} 组件渲染结果
 */
export const ToolCard: React.FC<IToolCardProps> = ({
  tool,
  onClick,
  onExecute,
  onConfigure,
  isSelected = false
}) => {
  // 获取状态样式
  const getStatusStyle = () => {
    switch (tool.status) {
      case 'available':
        return "bg-green-500/10 text-green-500 border-green-500/30";
      case 'running':
        return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      case 'error':
        return "bg-red-500/10 text-red-500 border-red-500/30";
      case 'disabled':
        return "bg-gray-500/10 text-gray-500 border-gray-500/30";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/30";
    }
  };

  // 获取状态文本
  const getStatusText = () => {
    switch (tool.status) {
      case 'available':
        return "可用";
      case 'running':
        return "运行中";
      case 'error':
        return "错误";
      case 'disabled':
        return "已禁用";
      case 'initializing':
        return "初始化中";
      default:
        return "未知";
    }
  };

  // 卡片点击处理
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(tool);
  };

  // 执行按钮点击处理
  const handleExecuteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onExecute) {
      onExecute(tool);
    }
  };

  // 配置按钮点击处理
  const handleConfigureClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onConfigure) {
      onConfigure(tool);
    }
  };

  return (
    <Card 
      className={`cursor-pointer hover:bg-indigo-900/20 transition-colors duration-200 overflow-hidden
        ${isSelected ? 'ring-2 ring-indigo-500 bg-indigo-950/50' : 'bg-indigo-950/40 border-indigo-700/30'}`}
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg text-indigo-100">{tool.name}</h3>
            <p className="text-sm text-indigo-300 mt-1 line-clamp-2">{tool.description}</p>
          </div>
          
          {tool.status && (
            <Badge className={`${getStatusStyle()} ml-2`}>
              {getStatusText()}
            </Badge>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {tool.isBuiltin && (
            <Badge variant="secondary" className="bg-indigo-900/40">内置</Badge>
          )}
          
          {tool.category && (
            <Badge variant="outline" className="border-indigo-600/30 text-indigo-300">
              {tool.category}
            </Badge>
          )}
          
          {tool.tags && tool.tags.length > 0 && (
            <Badge variant="outline" className="border-indigo-600/30 text-indigo-300">
              {tool.tags[0]}{tool.tags.length > 1 ? ` +${tool.tags.length - 1}` : ''}
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-2 pt-0 flex justify-end border-t border-indigo-800/20 mt-2">
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-indigo-300 hover:text-indigo-100 hover:bg-indigo-800/40"
            onClick={handleConfigureClick}
          >
            <Settings className="h-4 w-4 mr-1" />
            配置
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-indigo-300 hover:text-indigo-100 hover:bg-indigo-800/40"
            onClick={handleExecuteClick}
          >
            <PlayCircle className="h-4 w-4 mr-1" />
            执行
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}; 