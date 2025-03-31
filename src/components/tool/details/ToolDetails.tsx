"use client";

import React, { useState } from 'react';
import { ArrowLeft, PlayCircle, Settings, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ITool, TToolStatus } from '../cards/ToolCard';

/**
 * 工具详情属性接口
 */
export interface IToolDetailsProps {
  /**
   * 工具数据
   */
  tool: ITool;
  /**
   * 关闭详情回调
   */
  onClose: () => void;
  /**
   * 执行工具回调
   */
  onExecute?: (tool: ITool, parameters: Record<string, any>) => void;
}

/**
 * 工具详情组件
 * 
 * 展示工具的详细信息和操作选项
 * 
 * @param {IToolDetailsProps} props - 组件属性
 * @returns {React.ReactElement} 组件渲染结果
 */
export const ToolDetails: React.FC<IToolDetailsProps> = ({
  tool,
  onClose,
  onExecute
}) => {
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<string | null>(null);
  const [showParameters, setShowParameters] = useState(false);

  // 获取工具状态徽章
  const getStatusBadge = (status?: TToolStatus) => {
    switch (status) {
      case 'available':
        return <Badge variant="success">可用</Badge>;
      case 'disabled':
        return <Badge variant="outline">已禁用</Badge>;
      case 'error':
        return <Badge variant="destructive">错误</Badge>;
      case 'initializing':
        return <Badge variant="secondary">初始化中</Badge>;
      case 'running':
        return <Badge variant="info">运行中</Badge>;
      default:
        return <Badge variant="outline">未知</Badge>;
    }
  };

  // 参数变更处理
  const handleParameterChange = (key: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 执行工具处理
  const handleExecute = async () => {
    if (!onExecute) return;
    
    try {
      setIsExecuting(true);
      setExecutionResult(null);
      
      await onExecute(tool, parameters);
      
      // 这里可以处理执行结果，如显示成功消息等
      setExecutionResult("工具执行成功");
    } catch (error) {
      console.error('工具执行错误:', error);
      setExecutionResult(`执行失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden bg-indigo-950/40 border-indigo-700/30">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 text-center">
            <CardTitle className="text-indigo-100">{tool.name}</CardTitle>
            <div className="flex justify-center space-x-2 mt-1">
              {getStatusBadge(tool.status)}
              {tool.isBuiltin && <Badge variant="secondary">内置</Badge>}
              <Badge variant="outline">{tool.category}</Badge>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="mt-4 text-indigo-200 text-center">
          {tool.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto">
        {/* 标签显示 */}
        {tool.tags && tool.tags.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-medium mb-2 text-indigo-300">标签</div>
            <div className="flex flex-wrap gap-2">
              {tool.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-indigo-900/30">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* 工具类型 */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2 text-indigo-300">类型</div>
          <div className="text-indigo-100">{tool.type}</div>
        </div>
        
        {/* 参数区域 */}
        {tool.parameters && tool.parameters.length > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium text-indigo-300">参数</div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowParameters(!showParameters)}
                className="h-7 px-2 text-xs"
              >
                {showParameters ? '隐藏' : '显示'}
              </Button>
            </div>
            
            {showParameters && (
              <div className="space-y-3">
                {tool.parameters.map((param, index) => (
                  <div key={index} className="space-y-1">
                    <Label htmlFor={`param-${param.name}`} className="text-indigo-200">
                      {param.name}{param.required ? ' *' : ''}
                    </Label>
                    <Textarea
                      id={`param-${param.name}`}
                      placeholder={param.description || `输入${param.name}...`}
                      value={parameters[param.name] || ''}
                      onChange={(e) => handleParameterChange(param.name, e.target.value)}
                      className="bg-indigo-900/20 border-indigo-700/30 text-indigo-100 min-h-[80px]"
                    />
                    {param.description && (
                      <p className="text-xs text-indigo-300">{param.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* 使用示例 */}
        {tool.examples && tool.examples.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-medium mb-2 text-indigo-300">使用示例</div>
            <div className="space-y-2">
              {tool.examples.map((example, index) => (
                <div key={index} className="p-2 rounded bg-indigo-900/20 text-indigo-200 text-sm">
                  {example}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* 执行结果 */}
        {executionResult && (
          <div className={`p-3 rounded mb-4 ${
            executionResult.startsWith('执行失败') 
              ? 'bg-red-900/20 text-red-300' 
              : 'bg-green-900/20 text-green-300'
          }`}>
            {executionResult}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t border-indigo-800/30 pt-4">
        <div className="w-full flex justify-between">
          <Button 
            variant="outline"
            onClick={onClose}
            className="border-indigo-700/50 text-indigo-300 hover:bg-indigo-800/30"
          >
            关闭
          </Button>
          
          {tool.status === 'available' && onExecute && (
            <Button 
              onClick={handleExecute}
              disabled={isExecuting}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isExecuting ? (
                <>
                  <span className="animate-pulse mr-2">执行中</span>
                  <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                </>
              ) : (
                <>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  执行
                </>
              )}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}; 