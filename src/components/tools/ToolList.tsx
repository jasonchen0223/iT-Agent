"use client";

import React, { useState } from 'react';
import { ToolCard } from './ToolCard';
import { ITool, TToolType } from '@/types/tool';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * 工具列表组件属性
 */
interface ToolListProps {
  tools: ITool[];
  onToolSelect?: (tool: ITool) => void;
  onToolExecute?: (tool: ITool) => void;
  onToolConfigure?: (tool: ITool) => void;
  selectedToolId?: string;
  className?: string;
}

/**
 * 工具列表组件
 * 
 * 显示工具列表，支持搜索和筛选
 * 
 * @param {ToolListProps} props - 组件属性
 * @returns {React.ReactElement} 组件渲染结果
 */
export const ToolList: React.FC<ToolListProps> = ({
  tools,
  onToolSelect,
  onToolExecute,
  onToolConfigure,
  selectedToolId,
  className
}) => {
  // 搜索关键词状态
  const [searchText, setSearchText] = useState('');
  
  // 工具类型过滤器状态
  const [selectedTypes, setSelectedTypes] = useState<TToolType[]>([]);
  
  // 当前选项卡
  const [currentTab, setCurrentTab] = useState('all');
  
  // 根据搜索和过滤条件筛选工具
  const filteredTools = tools.filter(tool => {
    // 搜索文本过滤
    const matchesSearch = 
      searchText === '' || 
      tool.name.toLowerCase().includes(searchText.toLowerCase()) || 
      tool.description.toLowerCase().includes(searchText.toLowerCase());
    
    // 类型过滤
    const matchesType = 
      selectedTypes.length === 0 || 
      selectedTypes.includes(tool.type as TToolType);
    
    // 状态选项卡过滤
    const matchesTab = 
      currentTab === 'all' || 
      (currentTab === 'available' && tool.status === 'available') ||
      (currentTab === 'unavailable' && tool.status !== 'available');
    
    return matchesSearch && matchesType && matchesTab;
  });
  
  // 处理类型过滤变化
  const handleTypeFilterChange = (types: string[]) => {
    setSelectedTypes(types as TToolType[]);
  };
  
  // 计算所有可用的工具类型
  const availableTypes = [...new Set(tools.map(tool => tool.type))];
  
  return (
    <div className={`flex flex-col h-full ${className || ''}`}>
      <div className="p-4 space-y-4">
        {/* 搜索输入框 */}
        <Input
          placeholder="搜索工具..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full"
        />
        
        {/* 工具类型过滤器 */}
        <ScrollArea className="max-w-full pb-2">
          <ToggleGroup 
            type="multiple" 
            value={selectedTypes} 
            onValueChange={handleTypeFilterChange}
            className="flex space-x-1"
          >
            {availableTypes.map(type => (
              <ToggleGroupItem 
                key={type} 
                value={type} 
                size="sm"
                variant="outline"
                className="text-xs"
              >
                {type}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </ScrollArea>
        
        {/* 工具状态选项卡 */}
        <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="available">可用</TabsTrigger>
            <TabsTrigger value="unavailable">不可用</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* 工具列表 */}
      <ScrollArea className="flex-grow p-4">
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTools.map(tool => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onClick={onToolSelect}
                onExecute={onToolExecute}
                onConfigure={onToolConfigure}
                isSelected={selectedToolId === tool.id}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 text-gray-500">
            没有找到匹配的工具
          </div>
        )}
      </ScrollArea>
    </div>
  );
}; 