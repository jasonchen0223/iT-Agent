import React from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui';
import { Badge } from '@/components/ui';
import { format } from 'date-fns';

// 任务状态对应的颜色
const STATUS_COLORS = {
  pending: 'bg-yellow-500',
  assigned: 'bg-blue-500',
  running: 'bg-purple-500',
  completed: 'bg-green-500',
  failed: 'bg-red-500',
  cancelled: 'bg-gray-500'
};

// 优先级对应的颜色
const PRIORITY_COLORS = {
  low: 'bg-blue-200 text-blue-800',
  medium: 'bg-orange-200 text-orange-800',
  high: 'bg-red-200 text-red-800',
  urgent: 'bg-red-500 text-white'
};

// 任务类型对应的图标
const TYPE_ICONS = {
  development: '💻',
  design: '🎨',
  testing: '🧪',
  planning: '📋',
  research: '🔍',
  review: '👁️',
  other: '📌'
};

export interface TaskCardProps {
  id: string;
  name: string;
  description?: string;
  type: string;
  status: 'pending' | 'assigned' | 'running' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedAgent?: {
    id: string;
    name: string;
  };
  createdAt: Date;
  deadline?: Date;
  onClick?: (id: string) => void;
}

/**
 * 任务卡片组件
 * 
 * 展示任务的关键信息，包括名称、状态、优先级等
 */
export function TaskCard({
  id,
  name,
  description,
  type,
  status,
  priority,
  assignedAgent,
  createdAt,
  deadline,
  onClick
}: TaskCardProps) {
  // 处理点击事件
  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-md" 
      onClick={handleClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center">
            <span className="mr-2">{TYPE_ICONS[type as keyof typeof TYPE_ICONS] || TYPE_ICONS.other}</span>
            {name}
          </CardTitle>
          <Badge className={STATUS_COLORS[status]}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2 text-sm">
        {description && (
          <p className="text-muted-foreground line-clamp-2 mb-2">{description}</p>
        )}
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className={PRIORITY_COLORS[priority]}>
            {priority}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="pt-0 text-xs text-muted-foreground flex justify-between">
        <div>
          {assignedAgent ? `分配给：${assignedAgent.name}` : '未分配'}
        </div>
        <div className="flex items-center gap-2">
          <span>创建: {format(createdAt, 'MM/dd')}</span>
          {deadline && (
            <span className={`${new Date() > deadline ? 'text-red-500' : ''}`}>
              截止: {format(deadline, 'MM/dd')}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
} 