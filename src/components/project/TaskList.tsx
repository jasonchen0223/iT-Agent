import React, { useState, useMemo } from 'react';
import { TaskCard, TaskCardProps } from './TaskCard';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui';
import { Input } from '@/components/ui';

export interface TaskListProps {
  tasks: TaskCardProps[];
  onTaskClick?: (id: string) => void;
}

/**
 * 任务列表组件
 * 
 * 展示多个任务卡片，支持过滤和排序功能
 */
export function TaskList({ tasks, onTaskClick }: TaskListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('deadline');

  // 应用过滤和排序逻辑
  const filteredAndSortedTasks = useMemo(() => {
    // 过滤
    let filtered = tasks.filter(task => {
      // 搜索过滤
      const matchesSearch = 
        !searchQuery || 
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      // 状态过滤
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      
      // 优先级过滤
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
    
    // 排序
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'priority':
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'status':
          return a.status.localeCompare(b.status);
        case 'deadline':
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return a.deadline.getTime() - b.deadline.getTime();
        case 'createdAt':
          return b.createdAt.getTime() - a.createdAt.getTime();
        default:
          return 0;
      }
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter, sortBy]);

  return (
    <div className="space-y-4">
      {/* 过滤和排序控件 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Input
            placeholder="搜索任务..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="状态筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有状态</SelectItem>
              <SelectItem value="pending">等待中</SelectItem>
              <SelectItem value="assigned">已分配</SelectItem>
              <SelectItem value="running">进行中</SelectItem>
              <SelectItem value="completed">已完成</SelectItem>
              <SelectItem value="failed">失败</SelectItem>
              <SelectItem value="cancelled">已取消</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="优先级筛选" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有优先级</SelectItem>
              <SelectItem value="urgent">紧急</SelectItem>
              <SelectItem value="high">高</SelectItem>
              <SelectItem value="medium">中</SelectItem>
              <SelectItem value="low">低</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="排序方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deadline">按截止日期</SelectItem>
              <SelectItem value="priority">按优先级</SelectItem>
              <SelectItem value="name">按名称</SelectItem>
              <SelectItem value="status">按状态</SelectItem>
              <SelectItem value="createdAt">按创建时间</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* 任务列表 */}
      {filteredAndSortedTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              {...task} 
              onClick={onTaskClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">没有找到匹配的任务</p>
        </div>
      )}
    </div>
  );
} 