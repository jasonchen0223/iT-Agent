import React, { useState, useEffect } from 'react';
import { 
  Button,
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/components/ui';

// 任务类型选项
const TASK_TYPES = [
  { value: 'development', label: '开发' },
  { value: 'design', label: '设计' },
  { value: 'testing', label: '测试' },
  { value: 'planning', label: '规划' },
  { value: 'research', label: '研究' },
  { value: 'review', label: '评审' },
  { value: 'other', label: '其他' },
];

// 优先级选项
const PRIORITY_OPTIONS = [
  { value: 'low', label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' },
  { value: 'urgent', label: '紧急' },
];

// 状态选项
const STATUS_OPTIONS = [
  { value: 'pending', label: '等待中' },
  { value: 'assigned', label: '已分配' },
  { value: 'running', label: '进行中' },
  { value: 'completed', label: '已完成' },
  { value: 'failed', label: '失败' },
  { value: 'cancelled', label: '已取消' },
];

export interface Agent {
  id: string;
  name: string;
}

export interface TaskFormData {
  id?: string;
  name: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  assignedAgentId?: string;
  deadline?: string; // ISO 格式的日期字符串
}

export interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  initialData?: Partial<TaskFormData>;
  availableAgents: Agent[];
  isEditing?: boolean;
}

/**
 * 任务表单组件
 * 
 * 用于创建或编辑任务
 */
export function TaskForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = {},
  availableAgents = [],
  isEditing = false
}: TaskFormProps) {
  // 表单状态
  const [formData, setFormData] = useState<TaskFormData>({
    name: '',
    description: '',
    type: 'development',
    status: 'pending',
    priority: 'medium',
    assignedAgentId: '',
    deadline: '',
    ...initialData
  });
  
  // 表单验证错误
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // 表单状态重置
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        description: '',
        type: 'development',
        status: 'pending',
        priority: 'medium',
        assignedAgentId: '',
        deadline: '',
        ...initialData
      });
      setErrors({});
    }
  }, [isOpen, initialData]);

  // 表单字段更新处理
  const handleChange = (
    field: keyof TaskFormData,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  // 表单提交处理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '任务名称不能为空';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // 提交表单数据
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? '编辑任务' : '创建新任务'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            {/* 基本信息 */}
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-2">
                <Label htmlFor="name">任务名称 <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  placeholder="输入任务名称"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">任务描述</Label>
                <Textarea
                  id="description"
                  placeholder="输入任务描述"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            
            {/* 任务类型和优先级 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">任务类型</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择任务类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">优先级</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => handleChange('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择优先级" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_OPTIONS.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* 状态和代理分配 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isEditing && (
                <div className="space-y-2">
                  <Label htmlFor="status">状态</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="assignedAgentId">分配代理</Label>
                <Select 
                  value={formData.assignedAgentId || ''} 
                  onValueChange={(value) => handleChange('assignedAgentId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择代理" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">不分配</SelectItem>
                    {availableAgents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deadline">截止日期</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline ? formData.deadline.slice(0, 10) : ''}
                  onChange={(e) => handleChange('deadline', e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              取消
            </Button>
            <Button type="submit">
              {isEditing ? '保存修改' : '创建任务'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 