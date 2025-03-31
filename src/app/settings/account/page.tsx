"use client";

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Save, RefreshCw, Upload, User, KeyRound, Mail, Shield, Bell } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

/**
 * 用户类型
 */
interface User {
  name: string;
  email: string;
  username: string;
  avatarUrl: string;
  role: string;
  bio: string;
  notifications: {
    email: boolean;
    system: boolean;
    updates: boolean;
  };
}

/**
 * 账户设置页面
 * 
 * 用于管理用户个人资料和账户信息
 */
export default function AccountPage() {
  // 用户数据
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    username: '',
    avatarUrl: '',
    role: '',
    bio: '',
    notifications: {
      email: true,
      system: true,
      updates: false,
    }
  });
  
  // 页面状态
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // 模拟加载用户数据
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 模拟从服务器加载的数据
        // 实际应用中应该从API获取
        setUser({
          name: '张三',
          email: 'zhangsan@example.com',
          username: 'zhangsan',
          avatarUrl: '',
          role: '管理员',
          bio: '全栈开发者，专注于人工智能和自动化系统开发。',
          notifications: {
            email: true,
            system: true,
            updates: false,
          }
        });
      } catch (error) {
        console.error('加载用户数据失败:', error);
        toast({
          title: '加载失败',
          description: '无法加载用户数据',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, []);
  
  // 处理输入变更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 处理通知设置变更
  const handleNotificationChange = (key: keyof typeof user.notifications, value: boolean) => {
    setUser(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };
  
  // 保存用户数据
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 实际应用中应该调用API保存数据
      // await fetch('/api/user/profile', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(user)
      // });
      
      toast({
        title: '保存成功',
        description: '您的个人资料已更新',
      });
    } catch (error) {
      console.error('保存用户数据失败:', error);
      toast({
        title: '保存失败',
        description: '无法保存个人资料',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // 处理头像上传
  const handleAvatarUpload = () => {
    // 模拟文件上传
    // 实际应用中应该调用文件上传API
    toast({
      title: '功能开发中',
      description: '头像上传功能即将推出',
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader 
          title="账户设置" 
          description="管理个人资料和账户信息"
        />
        <Button
          onClick={handleSaveProfile}
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
      
      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="profile">个人资料</TabsTrigger>
          <TabsTrigger value="account">账户安全</TabsTrigger>
          <TabsTrigger value="notifications">通知设置</TabsTrigger>
        </TabsList>
        
        {/* 个人资料 */}
        <TabsContent value="profile">
          <Card className="bg-gradient-to-b from-indigo-950/40 to-black/40 border border-indigo-800/30">
            <CardContent className="pt-6 space-y-6">
              {/* 头像 */}
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="h-24 w-24 border-2 border-indigo-500/50">
                    {user.avatarUrl ? (
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                    ) : (
                      <AvatarFallback className="text-2xl bg-indigo-900 text-indigo-200">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAvatarUpload}
                    className="gap-1.5"
                  >
                    <Upload className="h-4 w-4" />
                    上传头像
                  </Button>
                </div>
                
                <div className="flex-1 space-y-4">
                  {/* 姓名 */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-indigo-100">姓名</Label>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-indigo-400" />
                      <Input
                        id="name"
                        name="name"
                        placeholder="输入您的姓名"
                        value={user.name}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  {/* 用户名 */}
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-indigo-100">用户名</Label>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-indigo-400" />
                      <Input
                        id="username"
                        name="username"
                        placeholder="输入您的用户名"
                        value={user.username}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                    </div>
                    <p className="text-xs text-indigo-400">
                      用户名将用于登录和系统中显示
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator className="bg-indigo-800/30" />
              
              {/* 邮箱 */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-indigo-100">电子邮箱</Label>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-indigo-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="输入您的电子邮箱"
                    value={user.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-indigo-400">
                  邮箱用于通知和账户恢复
                </p>
              </div>
              
              {/* 角色 */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-indigo-100">角色</Label>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-indigo-400" />
                  <Input
                    id="role"
                    name="role"
                    placeholder="用户角色"
                    value={user.role}
                    disabled={true}
                    className="bg-indigo-950/50"
                  />
                </div>
                <p className="text-xs text-indigo-400">
                  用户角色由系统管理员分配
                </p>
              </div>
              
              {/* 个人简介 */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-indigo-100">个人简介</Label>
                <textarea
                  id="bio"
                  name="bio"
                  placeholder="简单介绍自己"
                  value={user.bio}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full h-24 bg-indigo-900/20 text-indigo-100 p-3 rounded-md border border-indigo-800/30 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 账户安全 */}
        <TabsContent value="account">
          <Card className="bg-gradient-to-b from-indigo-950/40 to-black/40 border border-indigo-800/30">
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-indigo-100 flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-indigo-400" />
                  安全设置
                </h3>
                <p className="text-sm text-indigo-400">
                  管理密码和账户安全选项
                </p>
              </div>
              
              <Separator className="bg-indigo-800/30" />
              
              {/* 修改密码 */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-indigo-100">修改密码</h4>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="text-indigo-100">当前密码</Label>
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="输入当前密码"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-indigo-100">新密码</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="输入新密码"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-indigo-100">确认新密码</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="再次输入新密码"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <Button
                    variant="outline"
                    className="w-full mt-2 gap-1.5"
                    disabled={isLoading}
                  >
                    <KeyRound className="h-4 w-4" />
                    更新密码
                  </Button>
                </div>
              </div>
              
              <Separator className="bg-indigo-800/30" />
              
              {/* 两步验证 */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-md font-medium text-indigo-100">两步验证</h4>
                    <p className="text-sm text-indigo-400">启用两步验证增强账户安全</p>
                  </div>
                  <Button variant="outline" disabled={isLoading}>
                    设置
                  </Button>
                </div>
              </div>
              
              <Separator className="bg-indigo-800/30" />
              
              {/* 会话管理 */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-md font-medium text-indigo-100">活动会话</h4>
                    <p className="text-sm text-indigo-400">查看和管理当前登录的设备</p>
                  </div>
                  <Button variant="outline" disabled={isLoading}>
                    管理
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 通知设置 */}
        <TabsContent value="notifications">
          <Card className="bg-gradient-to-b from-indigo-950/40 to-black/40 border border-indigo-800/30">
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-indigo-100 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-indigo-400" />
                  通知偏好
                </h3>
                <p className="text-sm text-indigo-400">
                  管理系统通知和提醒方式
                </p>
              </div>
              
              <Separator className="bg-indigo-800/30" />
              
              {/* 电子邮件通知 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-indigo-100">电子邮件通知</Label>
                    <p className="text-xs text-indigo-400">
                      接收重要更新和事件的电子邮件通知
                    </p>
                  </div>
                  <Switch
                    checked={user.notifications.email}
                    onCheckedChange={(value) => handleNotificationChange('email', value)}
                    disabled={isLoading}
                  />
                </div>
                
                {/* 系统通知 */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-indigo-100">系统通知</Label>
                    <p className="text-xs text-indigo-400">
                      在系统内接收实时通知和提醒
                    </p>
                  </div>
                  <Switch
                    checked={user.notifications.system}
                    onCheckedChange={(value) => handleNotificationChange('system', value)}
                    disabled={isLoading}
                  />
                </div>
                
                {/* 产品更新 */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-indigo-100">产品更新</Label>
                    <p className="text-xs text-indigo-400">
                      接收关于产品新功能和更新的通知
                    </p>
                  </div>
                  <Switch
                    checked={user.notifications.updates}
                    onCheckedChange={(value) => handleNotificationChange('updates', value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <Separator className="bg-indigo-800/30" />
              
              {/* 通知频率 */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-indigo-100">通知频率</h4>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="freq-realtime" name="notification-frequency" defaultChecked className="text-indigo-600" />
                    <label htmlFor="freq-realtime" className="text-indigo-100">实时</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="freq-daily" name="notification-frequency" className="text-indigo-600" />
                    <label htmlFor="freq-daily" className="text-indigo-100">每日摘要</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="freq-weekly" name="notification-frequency" className="text-indigo-600" />
                    <label htmlFor="freq-weekly" className="text-indigo-100">每周摘要</label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 