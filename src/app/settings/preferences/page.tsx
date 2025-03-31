"use client";

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, RefreshCw, RotateCcw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

/**
 * 用户偏好设置页面
 * 
 * 用于管理用户界面和行为设置
 */
export default function PreferencesPage() {
  // 界面设置
  const [uiSettings, setUiSettings] = useState({
    theme: 'system',
    sidebarCollapsed: false,
    enableAnimations: true,
    codeHighlightTheme: 'dracula',
    fontSize: 14,
    lineHeight: 1.6,
    showAvatars: true,
    denseMode: false
  });
  
  // 行为设置
  const [behaviorSettings, setBehaviorSettings] = useState({
    defaultLLM: 'gpt-4',
    autoSave: true,
    autoSaveInterval: 5,
    enableNotifications: true,
    confirmBeforeClosing: true,
    showHints: true,
    streamingResponses: true,
    maxTokensPerResponse: 4000
  });
  
  // 加载状态
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // 模拟加载设置
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // 模拟从服务器加载的数据
        // 实际应用中应该从API获取
        // const response = await fetch('/api/settings/preferences');
        // const data = await response.json();
        
        // setUiSettings(data.ui);
        // setBehaviorSettings(data.behavior);
      } catch (error) {
        console.error('加载设置失败:', error);
        toast({
          title: '加载失败',
          description: '无法加载用户设置',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  // 处理UI设置变更
  const handleUiSettingChange = (key: string, value: any) => {
    setUiSettings(prev => ({ ...prev, [key]: value }));
  };
  
  // 处理行为设置变更
  const handleBehaviorSettingChange = (key: string, value: any) => {
    setBehaviorSettings(prev => ({ ...prev, [key]: value }));
  };
  
  // 保存设置
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 实际应用中应该调用API保存设置
      // await fetch('/api/settings/preferences', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ui: uiSettings,
      //     behavior: behaviorSettings
      //   })
      // });
      
      toast({
        title: '设置已保存',
        description: '您的偏好设置已成功更新',
      });
      
      // 应用某些需要立即生效的设置
      // 例如侧边栏状态
      if (typeof document !== 'undefined') {
        document.cookie = `sidebar-collapsed=${uiSettings.sidebarCollapsed}; path=/; max-age=31536000`;
      }
      
    } catch (error) {
      console.error('保存设置失败:', error);
      toast({
        title: '保存失败',
        description: '无法保存偏好设置',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // 重置为默认设置
  const handleResetSettings = () => {
    // 默认UI设置
    setUiSettings({
      theme: 'system',
      sidebarCollapsed: false,
      enableAnimations: true,
      codeHighlightTheme: 'dracula',
      fontSize: 14,
      lineHeight: 1.6,
      showAvatars: true,
      denseMode: false
    });
    
    // 默认行为设置
    setBehaviorSettings({
      defaultLLM: 'gpt-4',
      autoSave: true,
      autoSaveInterval: 5,
      enableNotifications: true,
      confirmBeforeClosing: true,
      showHints: true,
      streamingResponses: true,
      maxTokensPerResponse: 4000
    });
    
    toast({
      title: '设置已重置',
      description: '所有设置已恢复为默认值',
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader 
          title="偏好设置" 
          description="自定义界面和系统行为"
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleResetSettings}
            disabled={isLoading || isSaving}
            className="gap-1.5"
          >
            <RotateCcw className="h-4 w-4" />
            重置
          </Button>
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
      </div>
      
      <Tabs defaultValue="interface">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="interface">界面设置</TabsTrigger>
          <TabsTrigger value="behavior">行为设置</TabsTrigger>
        </TabsList>
        
        {/* 界面设置 */}
        <TabsContent value="interface">
          <Card className="bg-gradient-to-b from-indigo-950/40 to-black/40 border border-indigo-800/30">
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-indigo-100">外观</h2>
                
                {/* 主题 */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="theme">主题</Label>
                    <p className="text-xs text-indigo-400">
                      选择系统主题或暗色模式
                    </p>
                  </div>
                  <Select
                    value={uiSettings.theme}
                    onValueChange={(value) => handleUiSettingChange('theme', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="选择主题" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">跟随系统</SelectItem>
                      <SelectItem value="dark">暗色模式</SelectItem>
                      <SelectItem value="light">亮色模式</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* 代码高亮主题 */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="codeHighlightTheme">代码高亮主题</Label>
                    <p className="text-xs text-indigo-400">
                      代码块的语法高亮风格
                    </p>
                  </div>
                  <Select
                    value={uiSettings.codeHighlightTheme}
                    onValueChange={(value) => handleUiSettingChange('codeHighlightTheme', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="代码高亮主题" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dracula">Dracula</SelectItem>
                      <SelectItem value="github-dark">GitHub Dark</SelectItem>
                      <SelectItem value="monokai">Monokai</SelectItem>
                      <SelectItem value="nord">Nord</SelectItem>
                      <SelectItem value="one-dark-pro">One Dark Pro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator className="bg-indigo-800/30" />
                
                {/* 字体大小 */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="fontSize">字体大小</Label>
                    <span className="text-sm text-indigo-300">{uiSettings.fontSize}px</span>
                  </div>
                  <Slider
                    id="fontSize"
                    min={12}
                    max={20}
                    step={1}
                    value={[uiSettings.fontSize]}
                    onValueChange={(value) => handleUiSettingChange('fontSize', value[0])}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-indigo-400">
                    调整界面文本的大小
                  </p>
                </div>
                
                {/* 行高 */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="lineHeight">行高</Label>
                    <span className="text-sm text-indigo-300">{uiSettings.lineHeight.toFixed(1)}</span>
                  </div>
                  <Slider
                    id="lineHeight"
                    min={1.2}
                    max={2.0}
                    step={0.1}
                    value={[uiSettings.lineHeight]}
                    onValueChange={(value) => handleUiSettingChange('lineHeight', value[0])}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-indigo-400">
                    调整文本行高，增加或减少文本间距
                  </p>
                </div>
                
                <Separator className="bg-indigo-800/30" />
                
                {/* 界面行为 */}
                <h2 className="text-lg font-semibold text-indigo-100">界面行为</h2>
                
                {/* 侧边栏收起 */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sidebarCollapsed">默认收起侧边栏</Label>
                    <p className="text-xs text-indigo-400">
                      启动应用时是否收起侧边栏
                    </p>
                  </div>
                  <Switch
                    id="sidebarCollapsed"
                    checked={uiSettings.sidebarCollapsed}
                    onCheckedChange={(value) => handleUiSettingChange('sidebarCollapsed', value)}
                    disabled={isLoading}
                  />
                </div>
                
                {/* 启用动画 */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableAnimations">启用界面动画</Label>
                    <p className="text-xs text-indigo-400">
                      界面过渡和交互动画效果
                    </p>
                  </div>
                  <Switch
                    id="enableAnimations"
                    checked={uiSettings.enableAnimations}
                    onCheckedChange={(value) => handleUiSettingChange('enableAnimations', value)}
                    disabled={isLoading}
                  />
                </div>
                
                {/* 显示头像 */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="showAvatars">显示头像</Label>
                    <p className="text-xs text-indigo-400">
                      在消息中显示代理头像
                    </p>
                  </div>
                  <Switch
                    id="showAvatars"
                    checked={uiSettings.showAvatars}
                    onCheckedChange={(value) => handleUiSettingChange('showAvatars', value)}
                    disabled={isLoading}
                  />
                </div>
                
                {/* 紧凑模式 */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="denseMode">紧凑模式</Label>
                    <p className="text-xs text-indigo-400">
                      减少内容间距，在同一屏幕显示更多信息
                    </p>
                  </div>
                  <Switch
                    id="denseMode"
                    checked={uiSettings.denseMode}
                    onCheckedChange={(value) => handleUiSettingChange('denseMode', value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 行为设置 */}
        <TabsContent value="behavior">
          <Card className="bg-gradient-to-b from-indigo-950/40 to-black/40 border border-indigo-800/30">
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-indigo-100">AI设置</h2>
                
                {/* 默认语言模型 */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="defaultLLM">默认语言模型</Label>
                    <p className="text-xs text-indigo-400">
                      新建代理使用的默认语言模型
                    </p>
                  </div>
                  <Select
                    value={behaviorSettings.defaultLLM}
                    onValueChange={(value) => handleBehaviorSettingChange('defaultLLM', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="选择默认模型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                      <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                      <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* 流式响应 */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="streamingResponses">流式响应</Label>
                    <p className="text-xs text-indigo-400">
                      逐字显示AI响应而非一次性加载
                    </p>
                  </div>
                  <Switch
                    id="streamingResponses"
                    checked={behaviorSettings.streamingResponses}
                    onCheckedChange={(value) => handleBehaviorSettingChange('streamingResponses', value)}
                    disabled={isLoading}
                  />
                </div>
                
                {/* 最大令牌数 */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="maxTokensPerResponse">最大令牌数</Label>
                    <span className="text-sm text-indigo-300">{behaviorSettings.maxTokensPerResponse}</span>
                  </div>
                  <Slider
                    id="maxTokensPerResponse"
                    min={500}
                    max={8000}
                    step={500}
                    value={[behaviorSettings.maxTokensPerResponse]}
                    onValueChange={(value) => handleBehaviorSettingChange('maxTokensPerResponse', value[0])}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-indigo-400">
                    限制每次AI响应的最大令牌数
                  </p>
                </div>
                
                <Separator className="bg-indigo-800/30" />
                
                <h2 className="text-lg font-semibold text-indigo-100">应用行为</h2>
                
                {/* 自动保存 */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoSave">自动保存</Label>
                    <p className="text-xs text-indigo-400">
                      自动保存会话和项目修改
                    </p>
                  </div>
                  <Switch
                    id="autoSave"
                    checked={behaviorSettings.autoSave}
                    onCheckedChange={(value) => handleBehaviorSettingChange('autoSave', value)}
                    disabled={isLoading}
                  />
                </div>
                
                {/* 自动保存间隔 */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="autoSaveInterval">自动保存间隔 (分钟)</Label>
                    <span className="text-sm text-indigo-300">{behaviorSettings.autoSaveInterval}</span>
                  </div>
                  <Slider
                    id="autoSaveInterval"
                    min={1}
                    max={15}
                    step={1}
                    value={[behaviorSettings.autoSaveInterval]}
                    onValueChange={(value) => handleBehaviorSettingChange('autoSaveInterval', value[0])}
                    disabled={isLoading || !behaviorSettings.autoSave}
                  />
                  <p className="text-xs text-indigo-400">
                    自动保存的时间间隔
                  </p>
                </div>
                
                {/* 启用通知 */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableNotifications">启用通知</Label>
                    <p className="text-xs text-indigo-400">
                      显示系统操作和事件的通知
                    </p>
                  </div>
                  <Switch
                    id="enableNotifications"
                    checked={behaviorSettings.enableNotifications}
                    onCheckedChange={(value) => handleBehaviorSettingChange('enableNotifications', value)}
                    disabled={isLoading}
                  />
                </div>
                
                {/* 关闭前确认 */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="confirmBeforeClosing">关闭前确认</Label>
                    <p className="text-xs text-indigo-400">
                      关闭应用前显示确认对话框
                    </p>
                  </div>
                  <Switch
                    id="confirmBeforeClosing"
                    checked={behaviorSettings.confirmBeforeClosing}
                    onCheckedChange={(value) => handleBehaviorSettingChange('confirmBeforeClosing', value)}
                    disabled={isLoading}
                  />
                </div>
                
                {/* 显示提示 */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="showHints">显示提示</Label>
                    <p className="text-xs text-indigo-400">
                      在应用中显示功能提示和帮助信息
                    </p>
                  </div>
                  <Switch
                    id="showHints"
                    checked={behaviorSettings.showHints}
                    onCheckedChange={(value) => handleBehaviorSettingChange('showHints', value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 