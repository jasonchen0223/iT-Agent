"use client";

import React, { useState } from 'react';
import { TTaskStatus, TTaskPriority, TTaskType } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

interface TaskFilterProps {
  filters: {
    status: TTaskStatus[];
    priority: TTaskPriority[];
    type: TTaskType[];
    sessionId: string;
  };
  onFilterChange: (filters: TaskFilterProps['filters']) => void;
  groupBy: 'status' | 'priority' | 'type' | 'session' | 'none';
  onGroupChange: (groupBy: TaskFilterProps['groupBy']) => void;
}

/**
 * 任务过滤组件
 * 
 * 允许用户按状态、优先级、类型和会话过滤任务
 * 
 * @param {TaskFilterProps} props - 组件属性
 * @returns {React.ReactElement} 渲染结果
 */
export function TaskFilter({ 
  filters, 
  onFilterChange,
  groupBy,
  onGroupChange
}: TaskFilterProps) {
  const [expanded, setExpanded] = useState(false);
  
  // 处理状态选择
  const handleStatusChange = (status: TTaskStatus) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    
    onFilterChange({
      ...filters,
      status: newStatus
    });
  };
  
  // 处理优先级选择
  const handlePriorityChange = (priority: TTaskPriority) => {
    const newPriority = filters.priority.includes(priority)
      ? filters.priority.filter(p => p !== priority)
      : [...filters.priority, priority];
    
    onFilterChange({
      ...filters,
      priority: newPriority
    });
  };
  
  // 处理类型选择
  const handleTypeChange = (type: TTaskType) => {
    const newType = filters.type.includes(type)
      ? filters.type.filter(t => t !== type)
      : [...filters.type, type];
    
    onFilterChange({
      ...filters,
      type: newType
    });
  };
  
  // 处理会话ID变更
  const handleSessionIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      sessionId: e.target.value
    });
  };
  
  // 处理分组方式变更
  const handleGroupChange = (newGroupBy: TaskFilterProps['groupBy']) => {
    onGroupChange(newGroupBy);
  };
  
  // 清空过滤器
  const handleClearFilters = () => {
    onFilterChange({
      status: [],
      priority: [],
      type: [],
      sessionId: ''
    });
  };
  
  // 状态选项
  const statusOptions: { value: TTaskStatus; label: string }[] = [
    { value: 'pending', label: '待处理' },
    { value: 'assigned', label: '已分配' },
    { value: 'running', label: '进行中' },
    { value: 'completed', label: '已完成' },
    { value: 'failed', label: '失败' },
    { value: 'cancelled', label: '已取消' }
  ];
  
  // 优先级选项
  const priorityOptions: { value: TTaskPriority; label: string }[] = [
    { value: 'low', label: '低优先级' },
    { value: 'medium', label: '中优先级' },
    { value: 'high', label: '高优先级' },
    { value: 'urgent', label: '紧急' }
  ];
  
  // 类型选项
  const typeOptions: { value: TTaskType; label: string }[] = [
    { value: 'manual', label: '手动任务' },
    { value: 'auto', label: '自动任务' },
    { value: 'development', label: '开发任务' },
    { value: 'design', label: '设计任务' },
    { value: 'testing', label: '测试任务' },
    { value: 'planning', label: '规划任务' },
    { value: 'research', label: '研究任务' },
    { value: 'review', label: '审查任务' },
    { value: 'other', label: '其他任务' }
  ];
  
  // 分组选项
  const groupOptions = [
    { value: 'status', label: '按状态分组' },
    { value: 'priority', label: '按优先级分组' },
    { value: 'type', label: '按类型分组' },
    { value: 'session', label: '按会话分组' },
    { value: 'none', label: '不分组' }
  ];
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-indigo-100">筛选条件</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? '收起' : '展开'}筛选
          </Button>
          {(filters.status.length > 0 || filters.priority.length > 0 || 
            filters.type.length > 0 || filters.sessionId) && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearFilters}
              className="text-red-400 hover:text-red-300 border-red-700 hover:bg-red-900/20"
            >
              清空筛选
            </Button>
          )}
        </div>
      </div>
      
      {expanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 状态过滤 */}
          <div>
            <h3 className="text-sm font-medium mb-2 text-indigo-200">状态</h3>
            <div className="space-y-1">
              {statusOptions.map(option => (
                <div key={option.value} className="flex items-center">
                  <Checkbox 
                    id={`status-${option.value}`}
                    checked={filters.status.includes(option.value)}
                    onCheckedChange={() => handleStatusChange(option.value)}
                  />
                  <label 
                    htmlFor={`status-${option.value}`}
                    className="ml-2 text-sm text-indigo-300"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* 优先级过滤 */}
          <div>
            <h3 className="text-sm font-medium mb-2 text-indigo-200">优先级</h3>
            <div className="space-y-1">
              {priorityOptions.map(option => (
                <div key={option.value} className="flex items-center">
                  <Checkbox 
                    id={`priority-${option.value}`}
                    checked={filters.priority.includes(option.value)}
                    onCheckedChange={() => handlePriorityChange(option.value)}
                  />
                  <label 
                    htmlFor={`priority-${option.value}`}
                    className="ml-2 text-sm text-indigo-300"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* 类型过滤 */}
          <div>
            <h3 className="text-sm font-medium mb-2 text-indigo-200">类型</h3>
            <div className="space-y-1">
              {typeOptions.map(option => (
                <div key={option.value} className="flex items-center">
                  <Checkbox 
                    id={`type-${option.value}`}
                    checked={filters.type.includes(option.value)}
                    onCheckedChange={() => handleTypeChange(option.value)}
                  />
                  <label 
                    htmlFor={`type-${option.value}`}
                    className="ml-2 text-sm text-indigo-300"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* 会话ID过滤和分组选项 */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2 text-indigo-200">会话ID</h3>
              <Input
                value={filters.sessionId}
                onChange={handleSessionIdChange}
                placeholder="输入会话ID"
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2 text-indigo-200">分组方式</h3>
              <div className="space-y-1">
                {groupOptions.map(option => (
                  <div key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      id={`group-${option.value}`}
                      name="groupBy"
                      checked={groupBy === option.value}
                      onChange={() => handleGroupChange(option.value as TaskFilterProps['groupBy'])}
                      className="accent-indigo-500"
                    />
                    <label
                      htmlFor={`group-${option.value}`}
                      className="ml-2 text-sm text-indigo-300"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 活动过滤器摘要 */}
      {!expanded && (filters.status.length > 0 || filters.priority.length > 0 || 
        filters.type.length > 0 || filters.sessionId) && (
        <div className="flex flex-wrap gap-1">
          {filters.status.length > 0 && (
            <div className="px-2 py-1 text-xs rounded-full bg-indigo-900/20 text-indigo-300 border border-indigo-700/30">
              状态: {filters.status.length}个已选
            </div>
          )}
          {filters.priority.length > 0 && (
            <div className="px-2 py-1 text-xs rounded-full bg-blue-900/20 text-blue-300 border border-blue-700/30">
              优先级: {filters.priority.length}个已选
            </div>
          )}
          {filters.type.length > 0 && (
            <div className="px-2 py-1 text-xs rounded-full bg-purple-900/20 text-purple-300 border border-purple-700/30">
              类型: {filters.type.length}个已选
            </div>
          )}
          {filters.sessionId && (
            <div className="px-2 py-1 text-xs rounded-full bg-green-900/20 text-green-300 border border-green-700/30">
              会话: {filters.sessionId}
            </div>
          )}
          <div className="px-2 py-1 text-xs rounded-full bg-gray-800/50 text-gray-300 border border-gray-700/30">
            分组: {groupOptions.find(option => option.value === groupBy)?.label || '无'}
          </div>
        </div>
      )}
    </div>
  );
} 