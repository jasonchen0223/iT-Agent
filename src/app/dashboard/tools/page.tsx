"use client";

import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ToolList } from '@/components/tools/ToolList';
import { ToolDetails } from '@/components/tools/ToolDetails';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from '@/components/ui/sheet';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusIcon, RotateCcwIcon, SettingsIcon } from 'lucide-react';
import { ITool, IToolExecuteRequest, IToolExecuteResult } from '@/types/tool';
import { toolService } from '@/services/tool-service';
import { PageHeader } from '@/components/ui/page-header';

/**
 * 工具管理页面
 * 
 * 提供工具浏览、执行和管理功能
 */
export default function ToolsPage() {
  // 状态管理
  const [tools, setTools] = useState<ITool[]>([]);
  const [selectedTool, setSelectedTool] = useState<ITool | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<IToolExecuteResult | null>(null);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  
  // Toast组件
  const { toast } = useToast();
  
  // 获取工具列表
  const fetchTools = async () => {
    setIsLoading(true);
    try {
      const toolList = await toolService.getAllTools();
      setTools(toolList);
    } catch (error) {
      console.error('获取工具列表失败:', error);
      toast({
        title: '获取工具列表失败',
        description: error instanceof Error ? error.message : '未知错误',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // 初始加载工具
  useEffect(() => {
    fetchTools();
  }, []);
  
  // 选择工具
  const handleToolSelect = (tool: ITool) => {
    setSelectedTool(tool);
    setIsDrawerOpen(true);
  };
  
  // 执行工具
  const handleToolExecute = async (request: IToolExecuteRequest) => {
    setIsExecuting(true);
    try {
      const result = await toolService.executeTool(request);
      setExecutionResult(result);
      setIsResultDialogOpen(true);
      
      // 刷新工具状态
      fetchTools();
    } catch (error) {
      console.error('执行工具失败:', error);
      toast({
        title: '执行工具失败',
        description: error instanceof Error ? error.message : '未知错误',
        variant: 'destructive'
      });
    } finally {
      setIsExecuting(false);
    }
  };
  
  // 渲染执行结果
  const renderExecutionResult = () => {
    if (!executionResult) return null;
    
    let content;
    
    // 根据结果类型渲染不同的内容
    switch (executionResult.resultType) {
      case 'json':
        content = (
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-x-auto max-h-96 text-sm">
            {JSON.stringify(executionResult.result, null, 2)}
          </pre>
        );
        break;
        
      case 'text':
        content = (
          <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-x-auto max-h-96 whitespace-pre-wrap text-sm">
            {executionResult.result}
          </div>
        );
        break;
        
      case 'error':
        content = (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded max-h-96 overflow-y-auto">
            <h4 className="font-medium">错误</h4>
            <p>{executionResult.error || '未知错误'}</p>
          </div>
        );
        break;
        
      default:
        content = (
          <div className="text-gray-500 dark:text-gray-400 p-4">
            结果类型 {executionResult.resultType} 不支持直接显示
          </div>
        );
    }
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="font-medium">状态</div>
          <div>{executionResult.status}</div>
          
          <div className="font-medium">开始时间</div>
          <div>{new Date(executionResult.startTime).toLocaleString()}</div>
          
          {executionResult.endTime && (
            <>
              <div className="font-medium">结束时间</div>
              <div>{new Date(executionResult.endTime).toLocaleString()}</div>
            </>
          )}
          
          {executionResult.duration !== undefined && (
            <>
              <div className="font-medium">执行时间</div>
              <div>{executionResult.duration}ms</div>
            </>
          )}
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-sm font-medium mb-2">执行结果</h3>
          {content}
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto p-4 space-y-4">
      <PageHeader
        title="工具管理"
        description="浏览、执行和管理系统工具"
        actions={
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchTools}
            >
              <RotateCcwIcon className="h-4 w-4 mr-2" />
              刷新
            </Button>
            <Button 
              size="sm" 
              onClick={() => setIsRegisterDialogOpen(true)}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              注册工具
            </Button>
          </div>
        }
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-gray-500">加载工具中...</p>
          </div>
        </div>
      ) : (
        <ToolList
          tools={tools}
          onToolSelect={handleToolSelect}
          onToolExecute={(tool) => handleToolSelect(tool)}
          selectedToolId={selectedTool?.id}
        />
      )}
      
      {/* 工具详情抽屉 */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto p-0">
          {selectedTool && (
            <ToolDetails
              tool={selectedTool}
              onExecute={handleToolExecute}
              onClose={() => setIsDrawerOpen(false)}
              isExecuting={isExecuting}
            />
          )}
        </SheetContent>
      </Sheet>
      
      {/* 执行结果对话框 */}
      <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>工具执行结果</DialogTitle>
            <DialogDescription>
              {selectedTool?.name} 工具的执行结果
            </DialogDescription>
          </DialogHeader>
          
          {renderExecutionResult()}
          
          <DialogFooter>
            <Button onClick={() => setIsResultDialogOpen(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 注册工具对话框 - 以后实现 */}
      <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>注册新工具</DialogTitle>
            <DialogDescription>
              该功能尚未实现，敬请期待。
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button onClick={() => setIsRegisterDialogOpen(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 