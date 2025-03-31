"use client";

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Database, RefreshCw, Save, Calendar, Upload, History, FileText, Archive, HardDrive, Clock } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

/**
 * 备份记录类型
 */
interface BackupRecord {
  id: string;
  name: string;
  date: Date;
  size: string;
  type: '自动' | '手动';
  status: '完成' | '进行中' | '失败';
}

/**
 * 备份设置类型
 */
interface BackupSettings {
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  backupTime: string;
  backupDay: string;
  retentionPeriod: number;
  includeAttachments: boolean;
  includeSystemLogs: boolean;
  compressionLevel: 'low' | 'medium' | 'high';
}

/**
 * 数据备份与导出页面
 */
export default function BackupPage() {
  // 备份记录
  const [backupRecords, setBackupRecords] = useState<BackupRecord[]>([]);
  
  // 备份设置
  const [settings, setSettings] = useState<BackupSettings>({
    autoBackup: true,
    backupFrequency: 'weekly',
    backupTime: '02:00',
    backupDay: '0', // 周日
    retentionPeriod: 30,
    includeAttachments: true,
    includeSystemLogs: true,
    compressionLevel: 'medium',
  });
  
  // 页面状态
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [exportFormat, setExportFormat] = useState('json');
  
  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 模拟备份记录数据
        setBackupRecords([
          {
            id: '1',
            name: '每周备份',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2天前
            size: '256 MB',
            type: '自动',
            status: '完成',
          },
          {
            id: '2',
            name: '紧急备份',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5天前
            size: '245 MB',
            type: '手动',
            status: '完成',
          },
          {
            id: '3',
            name: '部署前备份',
            date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12天前
            size: '238 MB',
            type: '手动',
            status: '完成',
          },
          {
            id: '4',
            name: '每周备份',
            date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9天前
            size: '240 MB',
            type: '自动',
            status: '完成',
          },
          {
            id: '5',
            name: '每月备份',
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30天前
            size: '220 MB',
            type: '自动',
            status: '完成',
          },
        ]);
        
        // 模拟设置数据
        setSettings({
          autoBackup: true,
          backupFrequency: 'weekly',
          backupTime: '02:00',
          backupDay: '0', // 周日
          retentionPeriod: 30,
          includeAttachments: true,
          includeSystemLogs: true,
          compressionLevel: 'medium',
        });
      } catch (error) {
        console.error('加载备份数据失败:', error);
        toast({
          title: '加载失败',
          description: '无法加载备份数据',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // 保存备份设置
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 实际应用中应该调用API保存设置
      // await fetch('/api/backup/settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // });
      
      toast({
        title: '保存成功',
        description: '备份设置已更新',
      });
    } catch (error) {
      console.error('保存备份设置失败:', error);
      toast({
        title: '保存失败',
        description: '无法保存备份设置',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // 开始手动备份
  const handleBackupNow = async () => {
    setIsBackingUp(true);
    setBackupProgress(0);
    
    try {
      // 模拟备份进度更新
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // 添加新备份记录
          const newBackup: BackupRecord = {
            id: Date.now().toString(),
            name: '手动备份',
            date: new Date(),
            size: '250 MB',
            type: '手动',
            status: '完成',
          };
          
          setBackupRecords(prev => [newBackup, ...prev]);
          
          // 完成备份
          setTimeout(() => {
            setIsBackingUp(false);
            toast({
              title: '备份完成',
              description: '系统数据已成功备份',
            });
          }, 500);
        }
        setBackupProgress(Math.floor(progress));
      }, 800);
      
      // 实际应用中应该调用API执行备份
      // await fetch('/api/backup/create', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ type: 'manual' })
      // });
    } catch (error) {
      console.error('执行备份失败:', error);
      toast({
        title: '备份失败',
        description: '无法完成系统备份',
        variant: 'destructive'
      });
      setIsBackingUp(false);
    }
  };
  
  // 导出数据
  const handleExportData = () => {
    toast({
      title: '导出开始',
      description: `正在准备${exportFormat.toUpperCase()}格式的数据导出`,
    });
    
    // 模拟导出完成
    setTimeout(() => {
      toast({
        title: '导出完成',
        description: '数据导出文件已准备好下载',
      });
    }, 2000);
  };
  
  // 处理设置变更
  const handleSettingChange = (key: keyof BackupSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // 下载备份
  const handleDownloadBackup = (id: string) => {
    toast({
      title: '开始下载',
      description: '备份文件准备下载中...',
    });
    
    // 模拟下载完成
    setTimeout(() => {
      toast({
        title: '下载完成',
        description: '备份文件已下载完成',
      });
    }, 1500);
  };
  
  // 格式化日期
  const formatDate = (date: Date) => {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // 获取星期几名称
  const getDayName = (day: string) => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[parseInt(day, 10)];
  };
  
  // 恢复备份
  const handleRestoreBackup = (id: string) => {
    toast({
      title: '确认恢复',
      description: '备份恢复将覆盖当前数据，请谨慎操作',
      variant: 'destructive'
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader 
          title="数据备份与导出" 
          description="管理系统数据备份和导出选项"
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
      
      {/* 备份操作卡片 */}
      <Card className="bg-gradient-to-b from-indigo-950/40 to-black/40 border border-indigo-800/30">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-indigo-100 flex items-center gap-2">
            <Database className="h-5 w-5 text-indigo-400" />
            备份操作
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* 手动备份 */}
            <div className="space-y-4 bg-indigo-900/20 p-4 rounded-md border border-indigo-800/30">
              <h3 className="text-md font-medium text-indigo-100 flex items-center gap-2">
                <Archive className="h-4 w-4 text-indigo-400" />
                创建备份
              </h3>
              <p className="text-xs text-indigo-400">
                立即创建系统数据的完整备份。请确保您有足够的存储空间。
              </p>
              
              {isBackingUp ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-indigo-300">
                    <span>备份进行中...</span>
                    <span>{backupProgress}%</span>
                  </div>
                  <Progress value={backupProgress} className="h-2" />
                </div>
              ) : (
                <Button
                  onClick={handleBackupNow}
                  disabled={isLoading}
                  className="w-full gap-1.5"
                >
                  <Database className="h-4 w-4" />
                  立即备份
                </Button>
              )}
            </div>
            
            {/* 数据导出 */}
            <div className="space-y-4 bg-indigo-900/20 p-4 rounded-md border border-indigo-800/30">
              <h3 className="text-md font-medium text-indigo-100 flex items-center gap-2">
                <Download className="h-4 w-4 text-indigo-400" />
                导出数据
              </h3>
              <p className="text-xs text-indigo-400">
                以选定的格式导出系统数据，用于报告、分析或迁移。
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="exportFormat" className="text-xs text-indigo-200">
                  导出格式
                </Label>
                <Select
                  value={exportFormat}
                  onValueChange={setExportFormat}
                  disabled={isLoading}
                >
                  <SelectTrigger 
                    id="exportFormat" 
                    className="bg-indigo-950/50 border-indigo-800/40"
                  >
                    <SelectValue placeholder="选择格式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="xlsx">Excel</SelectItem>
                    <SelectItem value="xml">XML</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                onClick={handleExportData}
                disabled={isLoading}
                variant="outline"
                className="w-full gap-1.5"
              >
                <Download className="h-4 w-4" />
                导出数据
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 备份设置卡片 */}
      <Card className="bg-gradient-to-b from-indigo-950/40 to-black/40 border border-indigo-800/30">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-indigo-100 flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-indigo-400" />
            备份设置
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 自动备份 */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-indigo-100 flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-400" />
                自动备份
              </Label>
              <p className="text-xs text-indigo-400">
                定期自动备份系统数据
              </p>
            </div>
            <Switch
              checked={settings.autoBackup}
              onCheckedChange={(value) => handleSettingChange('autoBackup', value)}
              disabled={isLoading}
            />
          </div>
          
          {settings.autoBackup && (
            <div className="ml-6 space-y-4 bg-indigo-900/20 p-3 rounded-md border border-indigo-800/30">
              {/* 备份频率 */}
              <div className="space-y-2">
                <Label htmlFor="backupFrequency" className="text-xs text-indigo-200">
                  备份频率
                </Label>
                <Select
                  value={settings.backupFrequency}
                  onValueChange={(value) => handleSettingChange('backupFrequency', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger 
                    id="backupFrequency" 
                    className="bg-indigo-950/50 border-indigo-800/40"
                  >
                    <SelectValue placeholder="选择频率" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">每日</SelectItem>
                    <SelectItem value="weekly">每周</SelectItem>
                    <SelectItem value="monthly">每月</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* 备份时间 */}
              <div className="space-y-2">
                <Label htmlFor="backupTime" className="text-xs text-indigo-200">
                  备份时间
                </Label>
                <Input
                  id="backupTime"
                  type="time"
                  value={settings.backupTime}
                  onChange={(e) => handleSettingChange('backupTime', e.target.value)}
                  disabled={isLoading}
                  className="bg-indigo-950/50 border-indigo-800/40 w-36"
                />
              </div>
              
              {/* 备份日 (仅当频率为每周或每月时) */}
              {settings.backupFrequency !== 'daily' && (
                <div className="space-y-2">
                  <Label htmlFor="backupDay" className="text-xs text-indigo-200">
                    {settings.backupFrequency === 'weekly' ? '星期几' : '每月几号'}
                  </Label>
                  {settings.backupFrequency === 'weekly' ? (
                    <Select
                      value={settings.backupDay}
                      onValueChange={(value) => handleSettingChange('backupDay', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger 
                        id="backupDay" 
                        className="bg-indigo-950/50 border-indigo-800/40"
                      >
                        <SelectValue placeholder="选择星期" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 7 }, (_, i) => i.toString()).map((day) => (
                          <SelectItem key={day} value={day}>
                            {getDayName(day)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Select
                      value={settings.backupDay}
                      onValueChange={(value) => handleSettingChange('backupDay', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger 
                        id="backupDay" 
                        className="bg-indigo-950/50 border-indigo-800/40"
                      >
                        <SelectValue placeholder="选择日期" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 28 }, (_, i) => (i + 1).toString()).map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}日
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}
            </div>
          )}
          
          <Separator className="bg-indigo-800/30" />
          
          {/* 保留期限 */}
          <div className="space-y-2">
            <Label htmlFor="retentionPeriod" className="text-indigo-100 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-400" />
              保留期限 (天)
            </Label>
            <p className="text-xs text-indigo-400">
              自动备份的保留时间，超过该时间的备份将被自动删除
            </p>
            <Input
              id="retentionPeriod"
              type="number"
              min={1}
              max={365}
              value={settings.retentionPeriod}
              onChange={(e) => handleSettingChange('retentionPeriod', parseInt(e.target.value) || 30)}
              disabled={isLoading}
              className="bg-indigo-900/20 w-full sm:w-64"
            />
          </div>
          
          <Separator className="bg-indigo-800/30" />
          
          {/* 包含附件 */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-indigo-100 flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-400" />
                包含附件和媒体文件
              </Label>
              <p className="text-xs text-indigo-400">
                在备份中包含上传的文件、图像和其他媒体
              </p>
            </div>
            <Switch
              checked={settings.includeAttachments}
              onCheckedChange={(value) => handleSettingChange('includeAttachments', value)}
              disabled={isLoading}
            />
          </div>
          
          <Separator className="bg-indigo-800/30" />
          
          {/* 包含系统日志 */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-indigo-100 flex items-center gap-2">
                <History className="h-4 w-4 text-indigo-400" />
                包含系统日志
              </Label>
              <p className="text-xs text-indigo-400">
                在备份中包含系统日志和审计记录
              </p>
            </div>
            <Switch
              checked={settings.includeSystemLogs}
              onCheckedChange={(value) => handleSettingChange('includeSystemLogs', value)}
              disabled={isLoading}
            />
          </div>
          
          <Separator className="bg-indigo-800/30" />
          
          {/* 压缩级别 */}
          <div className="space-y-2">
            <Label htmlFor="compressionLevel" className="text-indigo-100 flex items-center gap-2">
              <Archive className="h-4 w-4 text-indigo-400" />
              压缩级别
            </Label>
            <p className="text-xs text-indigo-400">
              备份文件的压缩级别，高压缩可节省空间但需要更多处理时间
            </p>
            <Select
              value={settings.compressionLevel}
              onValueChange={(value) => handleSettingChange('compressionLevel', value)}
              disabled={isLoading}
            >
              <SelectTrigger 
                id="compressionLevel" 
                className="bg-indigo-900/20 w-full sm:w-64"
              >
                <SelectValue placeholder="选择压缩级别" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">低 (快速，较大文件)</SelectItem>
                <SelectItem value="medium">中 (平衡)</SelectItem>
                <SelectItem value="high">高 (慢速，最小文件)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* 备份历史 */}
      <Card className="bg-gradient-to-b from-indigo-950/40 to-black/40 border border-indigo-800/30">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-indigo-100 flex items-center gap-2">
            <History className="h-5 w-5 text-indigo-400" />
            备份历史
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md overflow-hidden border border-indigo-800/30">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>备份名称</TableHead>
                  <TableHead>日期</TableHead>
                  <TableHead>大小</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backupRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium text-indigo-200">
                      {record.name}
                    </TableCell>
                    <TableCell>{formatDate(record.date)}</TableCell>
                    <TableCell>{record.size}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                          record.type === '自动'
                            ? 'bg-blue-950/40 text-blue-400 border border-blue-500/30'
                            : 'bg-purple-950/40 text-purple-400 border border-purple-500/30'
                        }`}
                      >
                        {record.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                          record.status === '完成'
                            ? 'bg-green-950/40 text-green-400 border border-green-500/30'
                            : record.status === '进行中'
                            ? 'bg-orange-950/40 text-orange-400 border border-orange-500/30'
                            : 'bg-red-950/40 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {record.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-indigo-400 hover:text-indigo-100"
                          onClick={() => handleDownloadBackup(record.id)}
                        >
                          <Download className="h-4 w-4" />
                          <span className="sr-only">下载</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-indigo-400 hover:text-indigo-100"
                          onClick={() => handleRestoreBackup(record.id)}
                        >
                          <Upload className="h-4 w-4" />
                          <span className="sr-only">恢复</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {backupRecords.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-indigo-400">
                      暂无备份记录
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between text-xs text-indigo-400 border-t border-indigo-800/30 pt-4">
          <div>显示最近 {backupRecords.length} 条备份记录</div>
          <Button variant="link" size="sm" className="text-indigo-400 p-0 h-auto">
            查看所有备份
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 