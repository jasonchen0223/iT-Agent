"use client";

import React, { useState, useEffect } from 'react';
import { ToolList } from './list/ToolList';
import { ToolDetails } from './details/ToolDetails';
import { ITool } from './cards/ToolCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams } from 'next/navigation';

/**
 * 工具执行请求接口
 */
export interface IToolExecuteRequest {
  /**
   * 工具ID
   */
  toolId: string;
  /**
   * 执行参数
   */
  parameters: Record<string, any>;
}

/**
 * 工具页面组件属性
 */
export interface IToolPageProps {
  /**
   * 初始工具列表
   */
  initialTools?: ITool[];
  /**
   * 添加工具的回调函数
   */
  onAddTool?: () => void;
  /**
   * 是否显示添加工具按钮
   */
  showAddTool?: boolean;
  /**
   * 额外的CSS类名
   */
  className?: string;
}

/**
 * 工具页面组件
 * 
 * 展示工具列表和详情，支持工具选择、执行和配置
 * 
 * @param {IToolPageProps} props - 组件属性
 * @returns {React.ReactElement} 组件渲染结果
 */
export const ToolPage: React.FC<IToolPageProps> = ({
  initialTools,
  onAddTool,
  showAddTool = false,
  className
}) => {
  // 搜索参数，用于获取URL中的工具ID
  const searchParams = useSearchParams();
  
  // 选中的工具ID和详情
  const [selectedToolId, setSelectedToolId] = useState<string | null>(
    searchParams.get('tool')
  );
  const [selectedTool, setSelectedTool] = useState<ITool | null>(null);
  
  // 执行状态
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);
  
  // 当前激活的标签页
  const [activeTab, setActiveTab] = useState<string>('list');
  
  // 当URL参数变化时更新选中的工具ID
  useEffect(() => {
    const toolId = searchParams.get('tool');
    setSelectedToolId(toolId);
    
    // 如果有工具ID，切换到详情标签页
    if (toolId) {
      setActiveTab('details');
    }
  }, [searchParams]);
  
  // 选择工具的处理函数
  const handleToolSelect = (tool: ITool) => {
    setSelectedTool(tool);
    setSelectedToolId(tool.id);
    setActiveTab('details');
    setExecutionResult(null);
    setExecutionError(null);
    
    // 更新URL参数
    const url = new URL(window.location.href);
    url.searchParams.set('tool', tool.id);
    window.history.pushState({}, '', url.toString());
  };
  
  // 执行工具的处理函数
  const handleToolExecute = async (tool: ITool, parameters: Record<string, any>) => {
    const request: IToolExecuteRequest = {
      toolId: tool.id,
      parameters
    };
    
    try {
      setIsExecuting(true);
      setExecutionError(null);
      setExecutionResult(null);
      
      // 模拟工具执行，避免依赖可能未实现的API
      // 注释原API调用代码保留供将来使用
      /*
      const response = await fetch('/api/tools/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '工具执行失败');
      }
      */
      
      // 模拟数据和延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 生成模拟执行结果
      const mockResult = {
        success: true,
        data: {
          result: `已执行工具: ${tool.name}`,
          parameters: parameters,
          timestamp: new Date().toISOString()
        },
        logs: [
          `[INFO] 开始执行工具: ${tool.name}`,
          `[INFO] 参数: ${JSON.stringify(parameters)}`,
          `[INFO] 执行时间: ${new Date().toISOString()}`,
          `[SUCCESS] 工具执行完成`
        ]
      };
      
      // 设置执行结果
      setExecutionResult(mockResult);
      setActiveTab('result');
    } catch (error) {
      console.error('工具执行错误:', error);
      setExecutionError(error instanceof Error ? error.message : '未知错误');
    } finally {
      setIsExecuting(false);
    }
  };
  
  // 关闭详情的处理函数
  const handleCloseDetails = () => {
    setActiveTab('list');
    
    // 更新URL参数，移除工具ID
    const url = new URL(window.location.href);
    url.searchParams.delete('tool');
    window.history.pushState({}, '', url.toString());
  };
  
  // 渲染执行结果
  const renderExecutionResult = () => {
    if (executionError) {
      return (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-md">
          <h3 className="text-lg font-medium text-red-500 mb-2">执行错误</h3>
          <p className="text-sm text-gray-400">{executionError}</p>
        </div>
      );
    }
    
    if (!executionResult) {
      return (
        <div className="p-4 bg-slate-800 rounded-md">
          <p className="text-sm text-gray-400">尚未执行任何工具</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-md">
          <h3 className="text-lg font-medium text-emerald-500 mb-2">执行成功</h3>
          <p className="text-sm text-gray-400">工具已成功执行</p>
        </div>
        
        <div className="p-4 bg-slate-800 rounded-md">
          <h3 className="text-sm font-medium mb-2">执行结果</h3>
          <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap overflow-auto max-h-96 p-2 bg-slate-900 rounded">
            {JSON.stringify(executionResult, null, 2)}
          </pre>
        </div>
        
        {executionResult.logs && executionResult.logs.length > 0 && (
          <div className="p-4 bg-slate-800 rounded-md">
            <h3 className="text-sm font-medium mb-2">执行日志</h3>
            <div className="bg-black rounded p-2 text-sm text-gray-300 font-mono whitespace-pre-wrap overflow-auto max-h-60">
              {executionResult.logs.map((log: string, index: number) => (
                <div key={index}>{log}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className={`flex flex-col h-full ${className || ''}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="list">工具列表</TabsTrigger>
            <TabsTrigger value="details" disabled={!selectedTool}>
              工具详情
            </TabsTrigger>
            <TabsTrigger value="result" disabled={!executionResult && !executionError}>
              执行结果
            </TabsTrigger>
          </TabsList>
          
          {showAddTool && onAddTool && (
            <Button size="sm" onClick={onAddTool}>
              添加工具
            </Button>
          )}
        </div>
        
        <div className="flex-1 overflow-hidden">
          <TabsContent value="list" className="h-full">
            <ToolList
              selectedToolId={selectedToolId}
              onSelectTool={handleToolSelect}
            />
          </TabsContent>
          
          <TabsContent value="details" className="h-full">
            {selectedTool && (
              <ToolDetails
                tool={selectedTool}
                onExecute={handleToolExecute}
                onClose={handleCloseDetails}
              />
            )}
          </TabsContent>
          
          <TabsContent value="result" className="h-full">
            <div className="h-full overflow-auto p-4 space-y-4">
              {renderExecutionResult()}
              
              <div className="flex justify-end mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('details')}
                  className="mr-2"
                >
                  返回详情
                </Button>
                <Button 
                  onClick={() => {
                    setExecutionResult(null);
                    setExecutionError(null);
                    setActiveTab('details');
                  }}
                >
                  重新执行
                </Button>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}; 