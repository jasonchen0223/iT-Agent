"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { Card, CardContent } from '@/components/ui/card';
import { ICreateTaskRequest, TTaskStatus, TTaskPriority, TTaskType } from '@/types/task';
import { ArrowLeft, Calendar, Save } from 'lucide-react';
import Link from 'next/link';

export default function CreateTaskPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 表单状态
  const [formData, setFormData] = useState<ICreateTaskRequest>({
    name: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    type: 'manual',
    sessionId: '',
    metadata: {}
  });
  
  // 日期相关
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [showDueDate, setShowDueDate] = useState(false);
  
  // 处理表单变更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // 处理选择框变更
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // 处理日期变更
  const handleDueDateChange = (date: Date | undefined) => {
    setDueDate(date);
    if (date) {
      setFormData(prev => ({ ...prev, dueDate: date }));
    } else {
      const newFormData = { ...formData };
      delete newFormData.dueDate;
      setFormData(newFormData);
    }
  };
  
  // 处理任务创建
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `创建任务失败: ${res.status}`);
      }
      
      const data = await res.json();
      
      // 跳转到任务详情页
      router.push(`/tasks/${data.data.id}`);
    } catch (err) {
      console.error('创建任务错误:', err);
      setError(err instanceof Error ? err.message : '创建任务失败');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader 
          title="创建任务" 
          description="创建新的任务并分配给代理或用户"
        />
        <Link href="/tasks" passHref>
          <Button variant="outline" className="gap-1">
            <ArrowLeft size={16} /> 返回列表
          </Button>
        </Link>
      </div>
      
      <Card className="bg-gradient-to-b from-indigo-950/40 to-black/40 border border-indigo-800/30">
        <CardContent className="pt-6">
          <form onSubmit={handleCreateTask} className="space-y-6">
            {/* 基本信息 */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-indigo-100">基本信息</h2>
              
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm text-indigo-300">
                  任务名称 <span className="text-red-400">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="输入任务名称"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm text-indigo-300">
                  任务描述
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  placeholder="输入任务描述"
                  rows={4}
                />
              </div>
            </div>
            
            {/* 任务属性 */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-indigo-100">任务属性</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm text-indigo-300">
                    状态
                  </label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">待处理</SelectItem>
                      <SelectItem value="assigned">已分配</SelectItem>
                      <SelectItem value="running">进行中</SelectItem>
                      <SelectItem value="completed">已完成</SelectItem>
                      <SelectItem value="failed">失败</SelectItem>
                      <SelectItem value="cancelled">已取消</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="priority" className="text-sm text-indigo-300">
                    优先级
                  </label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleSelectChange('priority', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择优先级" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">低</SelectItem>
                      <SelectItem value="medium">中</SelectItem>
                      <SelectItem value="high">高</SelectItem>
                      <SelectItem value="urgent">紧急</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm text-indigo-300">
                    类型
                  </label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleSelectChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">手动</SelectItem>
                      <SelectItem value="auto">自动</SelectItem>
                      <SelectItem value="development">开发</SelectItem>
                      <SelectItem value="design">设计</SelectItem>
                      <SelectItem value="testing">测试</SelectItem>
                      <SelectItem value="planning">规划</SelectItem>
                      <SelectItem value="research">研究</SelectItem>
                      <SelectItem value="review">审查</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDueDate(!showDueDate)}
                    className="gap-1"
                  >
                    <Calendar size={16} />
                    {showDueDate ? '移除截止日期' : '添加截止日期'}
                  </Button>
                </div>
                
                {showDueDate && (
                  <div className="pt-2">
                    <DateTimePicker
                      date={dueDate}
                      setDate={handleDueDateChange}
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* 关联信息 */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-indigo-100">关联信息</h2>
              
              <div className="space-y-2">
                <label htmlFor="sessionId" className="text-sm text-indigo-300">
                  会话ID
                </label>
                <Input
                  id="sessionId"
                  name="sessionId"
                  value={formData.sessionId || ''}
                  onChange={handleInputChange}
                  placeholder="输入关联的会话ID"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="parentTaskId" className="text-sm text-indigo-300">
                  父任务ID
                </label>
                <Input
                  id="parentTaskId"
                  name="parentTaskId"
                  value={formData.parentTaskId || ''}
                  onChange={handleInputChange}
                  placeholder="输入父任务ID（如果是子任务）"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="agentId" className="text-sm text-indigo-300">
                  代理ID
                </label>
                <Input
                  id="agentId"
                  name="agentId"
                  value={formData.agentId || ''}
                  onChange={handleInputChange}
                  placeholder="输入执行代理ID"
                />
              </div>
            </div>
            
            {/* 错误信息 */}
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-700/40 rounded-md text-red-300 text-sm">
                {error}
              </div>
            )}
            
            {/* 表单按钮 */}
            <div className="flex justify-end gap-3 pt-4">
              <Link href="/tasks" passHref>
                <Button variant="outline" type="button">
                  取消
                </Button>
              </Link>
              <Button 
                type="submit" 
                disabled={loading}
                className="gap-1"
              >
                {loading ? '创建中...' : (
                  <>
                    <Save size={16} /> 创建任务
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 