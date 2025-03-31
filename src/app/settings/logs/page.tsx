"use client";

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Download, Filter, RefreshCw, Search, Info, AlertCircle, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

/**
 * 日志条目类型
 */
interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'success';
  component: string;
  message: string;
  details?: string;
}

/**
 * 系统日志页面
 */
export default function LogsPage() {
  // 日志数据
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  
  // 过滤条件
  const [filters, setFilters] = useState({
    search: '',
    level: 'all',
    component: 'all',
    dateFrom: '',
    dateTo: '',
  });
  
  // 页面状态
  const [isLoading, setIsLoading] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  
  // 加载日志数据
  useEffect(() => {
    const loadLogs = async () => {
      setIsLoading(true);
      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 模拟日志数据
        const mockLogs: LogEntry[] = [
          {
            id: '1',
            timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5分钟前
            level: 'info',
            component: '认证服务',
            message: '用户登录成功',
            details: '用户ID: usr_123456, IP: 192.168.1.1, 设备: Chrome/Windows',
          },
          {
            id: '2',
            timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15分钟前
            level: 'warning',
            component: '文件系统',
            message: '存储空间不足警告',
            details: '当前使用率: 85%, 阈值: 80%, 可用空间: 15.5GB',
          },
          {
            id: '3',
            timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30分钟前
            level: 'error',
            component: '数据库',
            message: '数据库连接失败',
            details: '错误代码: CONN_TIMEOUT, 已尝试重连: 3次',
          },
          {
            id: '4',
            timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45分钟前
            level: 'success',
            component: '备份系统',
            message: '系统备份完成',
            details: '备份大小: 256MB, 耗时: 45秒, 备份ID: BKP_789012',
          },
          {
            id: '5',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
            level: 'info',
            component: '任务调度器',
            message: '计划任务执行',
            details: '任务ID: TSK_345678, 类型: 数据清理, 状态: 已完成',
          },
          {
            id: '6',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3小时前
            level: 'warning',
            component: 'API服务',
            message: 'API请求率接近限制',
            details: '当前请求率: 950/分钟, 限制: 1000/分钟, 客户端IP: 203.0.113.1',
          },
          {
            id: '7',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5小时前
            level: 'error',
            component: '邮件服务',
            message: '邮件发送失败',
            details: '收件人: user@example.com, 错误: SMTP连接拒绝',
          },
          {
            id: '8',
            timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8小时前
            level: 'success',
            component: '系统更新',
            message: '系统更新完成',
            details: '版本: v2.3.0, 更新项: 15个问题修复, 3个新功能',
          },
          {
            id: '9',
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12小时前
            level: 'info',
            component: '用户管理',
            message: '新用户注册',
            details: '用户ID: usr_567890, 注册源: 网站表单',
          },
          {
            id: '10',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1天前
            level: 'warning',
            component: '安全服务',
            message: '多次失败登录尝试',
            details: '用户名: admin, IP: 198.51.100.1, 尝试次数: 5',
          },
        ];
        
        setLogs(mockLogs);
        setFilteredLogs(mockLogs);
      } catch (error) {
        console.error('加载日志数据失败:', error);
        toast({
          title: '加载失败',
          description: '无法加载系统日志',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLogs();
  }, []);
  
  // 应用过滤器
  const applyFilters = () => {
    setIsFiltering(true);
    
    try {
      let result = [...logs];
      
      // 搜索筛选
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        result = result.filter(log => 
          log.message.toLowerCase().includes(searchTerm) || 
          (log.details && log.details.toLowerCase().includes(searchTerm)) ||
          log.component.toLowerCase().includes(searchTerm)
        );
      }
      
      // 级别筛选
      if (filters.level !== 'all') {
        result = result.filter(log => log.level === filters.level);
      }
      
      // 组件筛选
      if (filters.component !== 'all') {
        result = result.filter(log => log.component === filters.component);
      }
      
      // 日期范围筛选
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        result = result.filter(log => log.timestamp >= fromDate);
      }
      
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999); // 设置为当天的结束时间
        result = result.filter(log => log.timestamp <= toDate);
      }
      
      setFilteredLogs(result);
    } catch (error) {
      console.error('筛选日志失败:', error);
      toast({
        title: '筛选失败',
        description: '无法应用筛选条件',
        variant: 'destructive'
      });
    } finally {
      setIsFiltering(false);
    }
  };
  
  // 重置过滤器
  const resetFilters = () => {
    setFilters({
      search: '',
      level: 'all',
      component: 'all',
      dateFrom: '',
      dateTo: '',
    });
    
    setFilteredLogs(logs);
  };
  
  // 处理过滤器变更
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // 获取日志级别图标
  const getLevelIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-indigo-400" />;
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
  
  // 导出日志
  const handleExportLogs = () => {
    toast({
      title: '导出开始',
      description: '系统日志导出已启动',
    });
    
    // 模拟导出完成
    setTimeout(() => {
      toast({
        title: '导出完成',
        description: '系统日志已导出为CSV文件',
      });
    }, 1500);
  };
  
  // 刷新日志
  const handleRefreshLogs = async () => {
    setIsLoading(true);
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: '刷新成功',
        description: '系统日志已更新',
      });
      
      // 在实际应用中，应该重新获取日志数据
      // 这里简单地模拟一条新日志
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        level: 'info',
        component: '日志服务',
        message: '日志已刷新',
        details: '用户请求刷新日志，IP: 127.0.0.1',
      };
      
      const updatedLogs = [newLog, ...logs];
      setLogs(updatedLogs);
      
      // 重新应用过滤器
      applyFilters();
    } catch (error) {
      console.error('刷新日志失败:', error);
      toast({
        title: '刷新失败',
        description: '无法刷新系统日志',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // 获取唯一的组件列表
  const getUniqueComponents = () => {
    const components = logs.map(log => log.component);
    return ['all', ...new Set(components)];
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader 
          title="系统日志" 
          description="查看和管理系统日志记录"
        />
        <div className="flex gap-2">
          <Button
            onClick={handleRefreshLogs}
            disabled={isLoading}
            variant="outline"
            className="gap-1.5"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            刷新
          </Button>
          <Button
            onClick={handleExportLogs}
            disabled={isLoading}
            className="gap-1.5"
          >
            <Download className="h-4 w-4" />
            导出日志
          </Button>
        </div>
      </div>
      
      {/* 过滤器 */}
      <Card className="bg-gradient-to-b from-indigo-950/40 to-black/40 border border-indigo-800/30">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-indigo-100 flex items-center gap-2">
            <Filter className="h-5 w-5 text-indigo-400" />
            日志过滤器
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* 搜索 */}
            <div className="space-y-2">
              <label htmlFor="search" className="text-xs text-indigo-200">
                搜索
              </label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-indigo-500" />
                <Input
                  id="search"
                  placeholder="搜索消息或详情"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-8 bg-indigo-950/50 border-indigo-800/40"
                />
              </div>
            </div>
            
            {/* 日志级别 */}
            <div className="space-y-2">
              <label htmlFor="level" className="text-xs text-indigo-200">
                日志级别
              </label>
              <Select
                value={filters.level}
                onValueChange={(value) => handleFilterChange('level', value)}
              >
                <SelectTrigger 
                  id="level" 
                  className="bg-indigo-950/50 border-indigo-800/40"
                >
                  <SelectValue placeholder="选择级别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部级别</SelectItem>
                  <SelectItem value="info">信息</SelectItem>
                  <SelectItem value="warning">警告</SelectItem>
                  <SelectItem value="error">错误</SelectItem>
                  <SelectItem value="success">成功</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* 组件 */}
            <div className="space-y-2">
              <label htmlFor="component" className="text-xs text-indigo-200">
                组件
              </label>
              <Select
                value={filters.component}
                onValueChange={(value) => handleFilterChange('component', value)}
              >
                <SelectTrigger 
                  id="component" 
                  className="bg-indigo-950/50 border-indigo-800/40"
                >
                  <SelectValue placeholder="选择组件" />
                </SelectTrigger>
                <SelectContent>
                  {getUniqueComponents().map((component) => (
                    <SelectItem key={component} value={component}>
                      {component === 'all' ? '全部组件' : component}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* 起始日期 */}
            <div className="space-y-2">
              <label htmlFor="dateFrom" className="text-xs text-indigo-200 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                起始日期
              </label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="bg-indigo-950/50 border-indigo-800/40"
              />
            </div>
            
            {/* 结束日期 */}
            <div className="space-y-2">
              <label htmlFor="dateTo" className="text-xs text-indigo-200 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                结束日期
              </label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="bg-indigo-950/50 border-indigo-800/40"
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-4 gap-2">
            <Button
              variant="outline"
              onClick={resetFilters}
              disabled={isLoading || isFiltering}
            >
              重置
            </Button>
            <Button
              onClick={applyFilters}
              disabled={isLoading || isFiltering}
              className="gap-1.5"
            >
              {isFiltering ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  筛选中...
                </>
              ) : (
                <>
                  <Filter className="h-4 w-4" />
                  应用筛选
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* 日志表格 */}
      <Card className="bg-gradient-to-b from-indigo-950/40 to-black/40 border border-indigo-800/30">
        <CardContent className="pt-6">
          <div className="rounded-md overflow-hidden border border-indigo-800/30">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">时间</TableHead>
                  <TableHead className="w-[100px]">级别</TableHead>
                  <TableHead className="w-[150px]">组件</TableHead>
                  <TableHead>消息</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow 
                    key={log.id}
                    className="cursor-pointer hover:bg-indigo-900/30"
                    onClick={() => {
                      toast({
                        title: `${log.level.charAt(0).toUpperCase() + log.level.slice(1)}: ${log.message}`,
                        description: log.details || '无详细信息',
                      });
                    }}
                  >
                    <TableCell className="font-mono text-xs">
                      {formatDate(log.timestamp)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {getLevelIcon(log.level)}
                        <span
                          className={`text-xs ${
                            log.level === 'info'
                              ? 'text-blue-400'
                              : log.level === 'warning'
                              ? 'text-amber-400'
                              : log.level === 'error'
                              ? 'text-red-400'
                              : 'text-green-400'
                          }`}
                        >
                          {log.level === 'info'
                            ? '信息'
                            : log.level === 'warning'
                            ? '警告'
                            : log.level === 'error'
                            ? '错误'
                            : '成功'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-indigo-200">
                      {log.component}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{log.message}</span>
                        {log.details && (
                          <span className="text-xs text-indigo-400 truncate max-w-md">
                            {log.details}
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-indigo-400">
                      {isLoading ? '加载日志中...' : '无匹配的日志记录'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 text-xs text-indigo-400 flex justify-between items-center">
            <div>显示 {filteredLogs.length} 条日志 (共 {logs.length} 条)</div>
            {filteredLogs.length < logs.length && (
              <div>已应用筛选器，部分日志未显示</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 