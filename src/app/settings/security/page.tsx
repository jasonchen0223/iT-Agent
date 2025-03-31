"use client";

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Lock, RefreshCw, LogOut, AlertTriangle, Eye, Clock, Users, History } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

/**
 * 安全审计日志项目
 */
interface SecurityLog {
  id: string;
  timestamp: Date;
  action: string;
  ip: string;
  userAgent: string;
  status: 'success' | 'failure';
}

/**
 * 安全设置页面
 * 
 * 用于管理系统安全选项、访问控制和审计日志
 */
export default function SecurityPage() {
  // 安全设置
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    ipRestriction: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginNotifications: true,
    activityLogs: true,
  });
  
  // 审计日志
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  
  // 页面状态
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // 模拟加载数据
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 模拟设置数据
        setSecuritySettings({
          twoFactorAuth: false,
          ipRestriction: false,
          sessionTimeout: 30,
          passwordExpiry: 90,
          loginNotifications: true,
          activityLogs: true,
        });
        
        // 模拟审计日志数据
        setSecurityLogs([
          {
            id: '1',
            timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5分钟前
            action: '登录',
            ip: '192.168.1.1',
            userAgent: 'Chrome 98.0.4758.102 / macOS',
            status: 'success',
          },
          {
            id: '2',
            timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1小时前
            action: '修改密码',
            ip: '192.168.1.1',
            userAgent: 'Chrome 98.0.4758.102 / macOS',
            status: 'success',
          },
          {
            id: '3',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
            action: '登录',
            ip: '203.0.113.1',
            userAgent: 'Firefox 97.0 / Windows',
            status: 'failure',
          },
          {
            id: '4',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1天前
            action: '登录',
            ip: '192.168.1.1',
            userAgent: 'Safari 15.3 / iOS',
            status: 'success',
          },
          {
            id: '5',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3天前
            action: '密码重置',
            ip: '192.168.1.1',
            userAgent: 'Chrome 98.0.4758.102 / macOS',
            status: 'success',
          },
        ]);
      } catch (error) {
        console.error('加载安全数据失败:', error);
        toast({
          title: '加载失败',
          description: '无法加载安全设置数据',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // 处理切换开关
  const handleToggle = (key: keyof typeof securitySettings, value: boolean) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // 处理输入变更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecuritySettings(prev => ({
      ...prev,
      [name]: parseInt(value, 10) || 0
    }));
  };
  
  // 保存安全设置
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 实际应用中应该调用API保存设置
      // await fetch('/api/security/settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(securitySettings)
      // });
      
      toast({
        title: '保存成功',
        description: '安全设置已更新',
      });
    } catch (error) {
      console.error('保存安全设置失败:', error);
      toast({
        title: '保存失败',
        description: '无法保存安全设置',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // 格式化日期
  const formatDate = (date: Date) => {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  // 注销所有会话
  const handleLogoutAllSessions = () => {
    toast({
      title: '操作成功',
      description: '所有会话已注销，其他设备需要重新登录',
    });
  };
  
  // 导出审计日志
  const handleExportLogs = () => {
    toast({
      title: '导出开始',
      description: '审计日志导出已启动，稍后将提供下载链接',
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader 
          title="安全设置" 
          description="管理系统安全选项和访问控制"
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
              <Shield className="h-4 w-4" />
              保存设置
            </>
          )}
        </Button>
      </div>
      
      {/* 安全设置部分 */}
      <Card className="bg-gradient-to-b from-indigo-950/40 to-black/40 border border-indigo-800/30">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-indigo-100 flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-400" />
            安全控制
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 两步验证 */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-indigo-100 flex items-center gap-2">
                <Lock className="h-4 w-4 text-indigo-400" />
                两步验证
              </Label>
              <p className="text-xs text-indigo-400">
                使用验证器应用或短信验证码增强账户安全
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={securitySettings.twoFactorAuth}
                onCheckedChange={(value) => handleToggle('twoFactorAuth', value)}
                disabled={isLoading}
              />
              <Button
                variant="outline"
                size="sm"
                disabled={isLoading || !securitySettings.twoFactorAuth}
              >
                配置
              </Button>
            </div>
          </div>
          
          <Separator className="bg-indigo-800/30" />
          
          {/* IP限制 */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-indigo-100 flex items-center gap-2">
                <Shield className="h-4 w-4 text-indigo-400" />
                IP地址限制
              </Label>
              <p className="text-xs text-indigo-400">
                限制只允许特定IP地址访问系统
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={securitySettings.ipRestriction}
                onCheckedChange={(value) => handleToggle('ipRestriction', value)}
                disabled={isLoading}
              />
              <Button
                variant="outline"
                size="sm"
                disabled={isLoading || !securitySettings.ipRestriction}
              >
                管理IP
              </Button>
            </div>
          </div>
          
          <Separator className="bg-indigo-800/30" />
          
          {/* 会话超时 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="sessionTimeout" className="text-indigo-100 flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-400" />
                会话超时（分钟）
              </Label>
              <p className="text-xs text-indigo-400">
                设置不活动后自动注销的时间
              </p>
            </div>
            <div className="w-full sm:w-64">
              <Input
                id="sessionTimeout"
                name="sessionTimeout"
                type="number"
                min={1}
                max={1440}
                value={securitySettings.sessionTimeout}
                onChange={handleInputChange}
                disabled={isLoading}
                className="bg-indigo-900/20"
              />
            </div>
          </div>
          
          <Separator className="bg-indigo-800/30" />
          
          {/* 密码过期 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="passwordExpiry" className="text-indigo-100 flex items-center gap-2">
                <Lock className="h-4 w-4 text-indigo-400" />
                密码过期（天）
              </Label>
              <p className="text-xs text-indigo-400">
                设置密码多久后需要更新（0表示永不过期）
              </p>
            </div>
            <div className="w-full sm:w-64">
              <Input
                id="passwordExpiry"
                name="passwordExpiry"
                type="number"
                min={0}
                max={365}
                value={securitySettings.passwordExpiry}
                onChange={handleInputChange}
                disabled={isLoading}
                className="bg-indigo-900/20"
              />
            </div>
          </div>
          
          <Separator className="bg-indigo-800/30" />
          
          {/* 登录通知 */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-indigo-100 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-indigo-400" />
                登录通知
              </Label>
              <p className="text-xs text-indigo-400">
                接收新设备或新位置登录的电子邮件通知
              </p>
            </div>
            <Switch
              checked={securitySettings.loginNotifications}
              onCheckedChange={(value) => handleToggle('loginNotifications', value)}
              disabled={isLoading}
            />
          </div>
          
          <Separator className="bg-indigo-800/30" />
          
          {/* 活动日志 */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-indigo-100 flex items-center gap-2">
                <History className="h-4 w-4 text-indigo-400" />
                记录活动日志
              </Label>
              <p className="text-xs text-indigo-400">
                记录用户操作和系统活动的详细日志
              </p>
            </div>
            <Switch
              checked={securitySettings.activityLogs}
              onCheckedChange={(value) => handleToggle('activityLogs', value)}
              disabled={isLoading}
            />
          </div>
          
          <Separator className="bg-indigo-800/30" />
          
          {/* 会话管理 */}
          <div className="pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-md font-medium text-indigo-100 flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-400" />
                  活动会话管理
                </h3>
                <p className="text-xs text-indigo-400 mt-1">
                  管理所有当前登录的设备和会话
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogoutAllSessions}
                className="gap-1.5"
                disabled={isLoading}
              >
                <LogOut className="h-4 w-4" />
                注销所有会话
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 安全审计日志 */}
      <Card className="bg-gradient-to-b from-indigo-950/40 to-black/40 border border-indigo-800/30">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl font-semibold text-indigo-100 flex items-center gap-2">
            <History className="h-5 w-5 text-indigo-400" />
            安全审计日志
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportLogs}
            className="gap-1.5 mt-2 sm:mt-0"
            disabled={isLoading}
          >
            <Eye className="h-4 w-4" />
            导出日志
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">时间</TableHead>
                <TableHead>操作</TableHead>
                <TableHead>IP地址</TableHead>
                <TableHead className="hidden md:table-cell">用户代理</TableHead>
                <TableHead className="w-[100px] text-center">状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {securityLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs">
                    {formatDate(log.timestamp)}
                  </TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell className="font-mono">{log.ip}</TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-indigo-300">
                    {log.userAgent}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`inline-flex items-center justify-center px-2 py-1 text-xs rounded-full ${
                        log.status === 'success'
                          ? 'bg-green-950/40 text-green-400 border border-green-500/30'
                          : 'bg-red-950/40 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {log.status === 'success' ? '成功' : '失败'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {securityLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-indigo-400">
                    无审计日志记录
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 