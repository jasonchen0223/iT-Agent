"use client";

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BellRing, Mail, MessageSquare, Globe, RefreshCw, Smartphone, Clock, Save, AlertTriangle, FileText } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';

/**
 * 通知设置对象类型
 */
interface NotificationSettings {
  channels: {
    inApp: boolean;
    email: boolean;
    sms: boolean;
    desktop: boolean;
  };
  events: {
    systemAlerts: boolean;
    newMessages: boolean;
    taskUpdates: boolean;
    securityAlerts: boolean;
    maintenanceAlerts: boolean;
  };
  frequency: 'realtime' | 'digest' | 'scheduled';
  schedule: {
    time: string;
    days: string[];
  };
  customEmails: string[];
}

/**
 * 通知设置页面
 * 
 * 用于管理系统通知偏好和频率
 */
export default function NotificationsPage() {
  // 通知设置
  const [settings, setSettings] = useState<NotificationSettings>({
    channels: {
      inApp: true,
      email: true,
      sms: false,
      desktop: false,
    },
    events: {
      systemAlerts: true,
      newMessages: true,
      taskUpdates: true,
      securityAlerts: true,
      maintenanceAlerts: false,
    },
    frequency: 'realtime',
    schedule: {
      time: '09:00',
      days: ['1', '3', '5'], // Monday, Wednesday, Friday
    },
    customEmails: []
  });
  
  // 自定义邮箱输入
  const [newEmail, setNewEmail] = useState('');
  
  // 页面状态
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // 加载通知设置
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 模拟从服务器加载的数据
        // 实际应用中应该从API获取
        setSettings({
          channels: {
            inApp: true,
            email: true,
            sms: false,
            desktop: false,
          },
          events: {
            systemAlerts: true,
            newMessages: true,
            taskUpdates: true,
            securityAlerts: true,
            maintenanceAlerts: false,
          },
          frequency: 'realtime',
          schedule: {
            time: '09:00',
            days: ['1', '3', '5'], // Monday, Wednesday, Friday
          },
          customEmails: ['support@example.com']
        });
      } catch (error) {
        console.error('加载通知设置失败:', error);
        toast({
          title: '加载失败',
          description: '无法加载通知设置',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  // 处理通知渠道切换
  const handleChannelToggle = (channel: keyof typeof settings.channels, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: value
      }
    }));
  };
  
  // 处理事件通知切换
  const handleEventToggle = (event: keyof typeof settings.events, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      events: {
        ...prev.events,
        [event]: value
      }
    }));
  };
  
  // 处理频率变更
  const handleFrequencyChange = (value: NotificationSettings['frequency']) => {
    setSettings(prev => ({
      ...prev,
      frequency: value
    }));
  };
  
  // 处理日程时间变更
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        time: e.target.value
      }
    }));
  };
  
  // 处理日程天数变更
  const handleDayToggle = (day: string) => {
    setSettings(prev => {
      const days = [...prev.schedule.days];
      if (days.includes(day)) {
        return {
          ...prev,
          schedule: {
            ...prev.schedule,
            days: days.filter(d => d !== day)
          }
        };
      } else {
        return {
          ...prev,
          schedule: {
            ...prev.schedule,
            days: [...days, day].sort()
          }
        };
      }
    });
  };
  
  // 添加自定义邮箱
  const handleAddEmail = () => {
    if (!newEmail || !newEmail.includes('@')) {
      toast({
        title: '无效邮箱',
        description: '请输入有效的电子邮箱地址',
        variant: 'destructive'
      });
      return;
    }
    
    if (settings.customEmails.includes(newEmail)) {
      toast({
        title: '邮箱已存在',
        description: '此邮箱地址已添加',
        variant: 'destructive'
      });
      return;
    }
    
    setSettings(prev => ({
      ...prev,
      customEmails: [...prev.customEmails, newEmail]
    }));
    setNewEmail('');
  };
  
  // 移除自定义邮箱
  const handleRemoveEmail = (email: string) => {
    setSettings(prev => ({
      ...prev,
      customEmails: prev.customEmails.filter(e => e !== email)
    }));
  };
  
  // 保存通知设置
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 实际应用中应该调用API保存设置
      // await fetch('/api/notification/settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // });
      
      toast({
        title: '保存成功',
        description: '通知设置已更新',
      });
    } catch (error) {
      console.error('保存通知设置失败:', error);
      toast({
        title: '保存失败',
        description: '无法保存通知设置',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // 获取星期几名称
  const getDayName = (day: string) => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[parseInt(day, 10)];
  };
  
  // 测试通知发送
  const handleTestNotification = () => {
    toast({
      title: '测试通知已发送',
      description: '请检查所有已启用的通知渠道',
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader 
          title="通知设置" 
          description="管理系统通知和提醒方式"
        />
        <Button
          onClick={handleSaveSettings}
          disabled={isLoading || isSaving}
          className="gap-1.5"
        >
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              保存中...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              保存设置
            </>
          )}
        </Button>
      </div>
      
      <Tabs defaultValue="channels">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="channels">通知渠道</TabsTrigger>
          <TabsTrigger value="events">通知事件</TabsTrigger>
          <TabsTrigger value="schedule">通知频率</TabsTrigger>
        </TabsList>
        
        {/* 通知渠道 */}
        <TabsContent value="channels">
          <Card className="bg-gradient-to-b from-indigo-950/40 to-black/40 border border-indigo-800/30">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-indigo-100 flex items-center gap-2">
                <BellRing className="h-5 w-5 text-indigo-400" />
                通知渠道设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 应用内通知 */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-indigo-100 flex items-center gap-2">
                    <BellRing className="h-4 w-4 text-indigo-400" />
                    应用内通知
                  </Label>
                  <p className="text-xs text-indigo-400">
                    在系统内接收通知和提醒
                  </p>
                </div>
                <Switch
                  checked={settings.channels.inApp}
                  onCheckedChange={(value) => handleChannelToggle('inApp', value)}
                  disabled={isLoading}
                />
              </div>
              
              <Separator className="bg-indigo-800/30" />
              
              {/* 电子邮件通知 */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-indigo-100 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-indigo-400" />
                    电子邮件通知
                  </Label>
                  <p className="text-xs text-indigo-400">
                    通过电子邮件接收通知
                  </p>
                </div>
                <Switch
                  checked={settings.channels.email}
                  onCheckedChange={(value) => handleChannelToggle('email', value)}
                  disabled={isLoading}
                />
              </div>
              
              {settings.channels.email && (
                <div className="ml-6 mt-2 space-y-4 bg-indigo-900/20 p-3 rounded-md border border-indigo-800/30">
                  <div className="text-sm text-indigo-100">自定义通知邮箱</div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="输入邮箱地址"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="bg-indigo-950/50 border-indigo-800/40"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddEmail}
                      disabled={isLoading}
                    >
                      添加
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {settings.customEmails.map(email => (
                      <div key={email} className="flex justify-between items-center bg-indigo-950/50 p-2 rounded-md">
                        <span className="text-sm text-indigo-200">{email}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveEmail(email)}
                          className="h-6 w-6 p-0 text-indigo-400 hover:text-indigo-200"
                        >
                          &times;
                        </Button>
                      </div>
                    ))}
                    {settings.customEmails.length === 0 && (
                      <p className="text-xs text-indigo-500 italic">未添加自定义邮箱</p>
                    )}
                  </div>
                </div>
              )}
              
              <Separator className="bg-indigo-800/30" />
              
              {/* 短信通知 */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-indigo-100 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-indigo-400" />
                    短信通知
                  </Label>
                  <p className="text-xs text-indigo-400">
                    通过短信接收重要通知
                  </p>
                </div>
                <Switch
                  checked={settings.channels.sms}
                  onCheckedChange={(value) => handleChannelToggle('sms', value)}
                  disabled={isLoading}
                />
              </div>
              
              <Separator className="bg-indigo-800/30" />
              
              {/* 桌面通知 */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-indigo-100 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-indigo-400" />
                    桌面通知
                  </Label>
                  <p className="text-xs text-indigo-400">
                    在浏览器中接收推送通知
                  </p>
                </div>
                <Switch
                  checked={settings.channels.desktop}
                  onCheckedChange={(value) => handleChannelToggle('desktop', value)}
                  disabled={isLoading}
                />
              </div>
              
              <Separator className="bg-indigo-800/30" />
              
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={handleTestNotification}
                  disabled={isLoading}
                  className="gap-1.5"
                >
                  <BellRing className="h-4 w-4" />
                  测试通知
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 通知事件 */}
        <TabsContent value="events">
          <Card className="bg-gradient-to-b from-indigo-950/40 to-black/40 border border-indigo-800/30">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-indigo-100 flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-400" />
                通知事件设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 系统提醒 */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-indigo-100 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-indigo-400" />
                    系统提醒
                  </Label>
                  <p className="text-xs text-indigo-400">
                    系统公告、更新和重要通知
                  </p>
                </div>
                <Switch
                  checked={settings.events.systemAlerts}
                  onCheckedChange={(value) => handleEventToggle('systemAlerts', value)}
                  disabled={isLoading}
                />
              </div>
              
              <Separator className="bg-indigo-800/30" />
              
              {/* 新消息 */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-indigo-100 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-indigo-400" />
                    新消息
                  </Label>
                  <p className="text-xs text-indigo-400">
                    聊天消息、评论和回复
                  </p>
                </div>
                <Switch
                  checked={settings.events.newMessages}
                  onCheckedChange={(value) => handleEventToggle('newMessages', value)}
                  disabled={isLoading}
                />
              </div>
              
              <Separator className="bg-indigo-800/30" />
              
              {/* 任务更新 */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-indigo-100 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-indigo-400" />
                    任务更新
                  </Label>
                  <p className="text-xs text-indigo-400">
                    任务分配、状态更改和截止日期提醒
                  </p>
                </div>
                <Switch
                  checked={settings.events.taskUpdates}
                  onCheckedChange={(value) => handleEventToggle('taskUpdates', value)}
                  disabled={isLoading}
                />
              </div>
              
              <Separator className="bg-indigo-800/30" />
              
              {/* 安全提醒 */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-indigo-100 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-indigo-400" />
                    安全提醒
                  </Label>
                  <p className="text-xs text-indigo-400">
                    新设备登录、密码更改和安全事件
                  </p>
                </div>
                <Switch
                  checked={settings.events.securityAlerts}
                  onCheckedChange={(value) => handleEventToggle('securityAlerts', value)}
                  disabled={isLoading}
                />
              </div>
              
              <Separator className="bg-indigo-800/30" />
              
              {/* 维护通知 */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-indigo-100 flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-indigo-400" />
                    维护通知
                  </Label>
                  <p className="text-xs text-indigo-400">
                    计划维护、系统停机和服务状态更新
                  </p>
                </div>
                <Switch
                  checked={settings.events.maintenanceAlerts}
                  onCheckedChange={(value) => handleEventToggle('maintenanceAlerts', value)}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 通知频率 */}
        <TabsContent value="schedule">
          <Card className="bg-gradient-to-b from-indigo-950/40 to-black/40 border border-indigo-800/30">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-indigo-100 flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-400" />
                通知频率设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-indigo-100">接收通知方式</Label>
                
                <RadioGroup 
                  value={settings.frequency} 
                  onValueChange={(value) => handleFrequencyChange(value as NotificationSettings['frequency'])}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="realtime" id="realtime" disabled={isLoading} />
                    <Label htmlFor="realtime" className="text-indigo-100">
                      实时通知
                    </Label>
                    <span className="text-xs text-indigo-400 ml-2">
                      (立即接收每个通知)
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="digest" id="digest" disabled={isLoading} />
                    <Label htmlFor="digest" className="text-indigo-100">
                      每日摘要
                    </Label>
                    <span className="text-xs text-indigo-400 ml-2">
                      (每天接收所有通知的摘要)
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="scheduled" id="scheduled" disabled={isLoading} />
                    <Label htmlFor="scheduled" className="text-indigo-100">
                      定时通知
                    </Label>
                    <span className="text-xs text-indigo-400 ml-2">
                      (在设定的时间接收通知汇总)
                    </span>
                  </div>
                </RadioGroup>
              </div>
              
              {settings.frequency === 'scheduled' && (
                <div className="ml-6 space-y-4 bg-indigo-900/20 p-3 rounded-md border border-indigo-800/30">
                  <div>
                    <Label htmlFor="time" className="text-indigo-100">时间</Label>
                    <Input
                      id="time"
                      type="time"
                      value={settings.schedule.time}
                      onChange={handleTimeChange}
                      disabled={isLoading}
                      className="bg-indigo-950/50 border-indigo-800/40 mt-1 w-36"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-indigo-100">日期</Label>
                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: 7 }, (_, i) => i.toString()).map((day) => (
                        <div
                          key={day}
                          className={`
                            flex flex-col items-center justify-center p-2 rounded-md cursor-pointer
                            ${settings.schedule.days.includes(day)
                              ? 'bg-indigo-700/40 border border-indigo-500/50'
                              : 'bg-indigo-950/30 border border-indigo-800/30 hover:bg-indigo-900/30'
                            }
                          `}
                          onClick={() => handleDayToggle(day)}
                        >
                          <span className="text-xs font-medium text-indigo-200">
                            {getDayName(day)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <Separator className="bg-indigo-800/30" />
              
              <div className="space-y-3">
                <h3 className="text-md font-medium text-indigo-100">
                  优先级通知例外
                </h3>
                <p className="text-xs text-indigo-400">
                  无论您选择的通知频率如何，以下类型的通知始终会立即发送：
                </p>
                <ul className="list-disc list-inside text-sm text-indigo-300 space-y-1 ml-2">
                  <li>安全提醒</li>
                  <li>关键系统错误</li>
                  <li>紧急事件通知</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 