"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from "next/navigation";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToolCard, ITool, TToolStatus } from '../cards/ToolCard';

/**
 * 工具列表属性接口
 */
export interface IToolListProps {
  /**
   * 选中的工具ID
   */
  selectedToolId?: string;
  /**
   * 工具选择回调
   */
  onSelectTool: (tool: ITool) => void;
  /**
   * 过滤类别
   */
  filterCategory?: string;
}

/**
 * 工具列表组件
 * 
 * 展示工具列表，支持搜索和筛选
 * 
 * @param {IToolListProps} props - 组件属性
 * @returns {React.ReactElement} 组件渲染结果
 */
export const ToolList: React.FC<IToolListProps> = ({
  selectedToolId,
  onSelectTool,
  filterCategory
}) => {
  const searchParams = useSearchParams();
  const [tools, setTools] = useState<ITool[]>([]);
  const [filteredTools, setFilteredTools] = useState<ITool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 获取工具列表
  useEffect(() => {
    const fetchTools = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/tools');
        
        if (!response.ok) {
          throw new Error('获取工具列表失败');
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || '获取工具列表失败');
        }
        
        setTools(data.data);
        
        // 提取所有类别
        const categorySet = new Set<string>();
        data.data.forEach((tool: ITool) => {
          if (tool.category) {
            categorySet.add(tool.category);
          }
        });
        setCategories(Array.from(categorySet));
        
      } catch (error) {
        console.error('获取工具列表错误:', error);
        setError('获取工具列表失败，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTools();
  }, []);

  // 筛选工具
  useEffect(() => {
    let result = [...tools];
    
    // 应用搜索筛选
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(tool => 
        tool.name.toLowerCase().includes(term) || 
        tool.description.toLowerCase().includes(term) ||
        tool.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // 应用类别筛选
    if (activeTab !== 'all') {
      if (activeTab === 'builtin') {
        result = result.filter(tool => tool.isBuiltin);
      } else if (activeTab === 'addon') {
        result = result.filter(tool => !tool.isBuiltin);
      } else {
        result = result.filter(tool => tool.category === activeTab);
      }
    }
    
    setFilteredTools(result);
  }, [tools, searchTerm, activeTab]);

  // 工具卡片点击处理
  const handleToolCardClick = (tool: ITool) => {
    onSelectTool(tool);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-indigo-300 animate-pulse">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-red-400">{error}</div>
        <Button onClick={() => window.location.reload()}>
          重试
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 搜索栏 */}
      <div className="mb-4">
        <Input
          placeholder="搜索工具名称、描述或标签..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-indigo-950/40 border-indigo-700/30 text-indigo-100"
        />
      </div>
      
      {/* 类别标签 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList className="grid grid-cols-4 bg-indigo-950/40">
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="builtin">内置</TabsTrigger>
          <TabsTrigger value="addon">扩展</TabsTrigger>
          <TabsTrigger value="more">更多</TabsTrigger>
        </TabsList>
        
        <TabsContent value="more" className="mt-1 p-0">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeTab === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(category)}
                className="text-xs"
              >
                {category}
              </Button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* 工具列表 */}
      <div className="flex-1 overflow-y-auto pb-4 pr-2">
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onClick={handleToolCardClick}
                isSelected={tool.id === selectedToolId}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-40">
            <div className="text-indigo-300">
              {searchTerm ? '没有找到匹配的工具' : '暂无工具可用'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 