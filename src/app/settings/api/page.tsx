"use client";

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy, Eye, EyeOff, RefreshCw, Save } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

/**
 * API设置页面
 * 
 * 用于管理API密钥和相关集成配置
 */
export default function ApiSettingsPage() {
  // API密钥状态
  const [apiKeys, setApiKeys] = useState({
    openaiKey: '',
    anthropicKey: '',
    neonKey: '',
    pineconeKey: '',
    huggingfaceKey: ''
  });
  
  // UI状态
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // 模拟加载API密钥
  useEffect(() => {
    const fetchApiKeys = async () => {
      setIsLoading(true);
      try {
        // 这里应该是从API获取数据
        // const response = await fetch('/api/settings/api-keys');
        // const data = await response.json();
        
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 模拟从服务器获取的数据
        // 实际应用中，这些应该被替换为实际的API调用
        setApiKeys({
          openaiKey: '***************************',
          anthropicKey: '***************************',
          neonKey: '***************************',
          pineconeKey: '***************************',
          huggingfaceKey: '***************************'
        });
      } catch (error) {
        console.error('加载API密钥失败:', error);
        toast({
          title: '加载失败',
          description: '无法加载API密钥设置',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApiKeys();
  }, []);
  
  // 处理API密钥变更
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApiKeys(prev => ({ ...prev, [name]: value }));
  };
  
  // 切换密钥可见性
  const toggleKeyVisibility = (keyName: string) => {
    setVisibleKeys(prev => ({ ...prev, [keyName]: !prev[keyName] }));
  };
  
  // 保存API密钥
  const handleSaveApiKeys = async () => {
    setIsSaving(true);
    try {
      // 这里应该是发送API请求
      // const response = await fetch('/api/settings/api-keys', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(apiKeys)
      // });
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: '保存成功',
        description: 'API设置已成功保存',
      });
    } catch (error) {
      console.error('保存API密钥失败:', error);
      toast({
        title: '保存失败',
        description: '无法保存API密钥设置',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // 复制到剪贴板
  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: '复制成功',
          description: `${keyName}已复制到剪贴板`,
        });
      })
      .catch(err => {
        console.error('复制失败:', err);
        toast({
          title: '复制失败',
          description: '无法复制到剪贴板',
          variant: 'destructive'
        });
      });
  };
  
  // 生成新的API密钥
  const generateNewApiKey = async (keyName: string) => {
    try {
      // 这里应该是生成新密钥的API调用
      // const response = await fetch(`/api/settings/generate-key/${keyName}`, { method: 'POST' });
      // const data = await response.json();
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 模拟生成的新密钥
      const newKey = 'sk_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      setApiKeys(prev => ({ ...prev, [keyName]: newKey }));
      setVisibleKeys(prev => ({ ...prev, [keyName]: true }));
      
      toast({
        title: '密钥已生成',
        description: `新的${getKeyDisplayName(keyName)}已生成`,
      });
    } catch (error) {
      console.error('生成新密钥失败:', error);
      toast({
        title: '生成失败',
        description: '无法生成新的API密钥',
        variant: 'destructive'
      });
    }
  };
  
  // 获取密钥显示名称
  const getKeyDisplayName = (keyName: string): string => {
    const displayNames: Record<string, string> = {
      'openaiKey': 'OpenAI API密钥',
      'anthropicKey': 'Anthropic API密钥',
      'neonKey': 'Neon数据库密钥',
      'pineconeKey': 'Pinecone API密钥',
      'huggingfaceKey': 'HuggingFace API密钥'
    };
    
    return displayNames[keyName] || keyName;
  };
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="API设置"
        description="管理API密钥和外部服务集成"
      />
      
      <Card className="bg-gradient-to-b from-indigo-950/40 to-black/40 border border-indigo-800/30">
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-indigo-100">API密钥</h2>
              <Button
                variant="outline"
                onClick={handleSaveApiKeys}
                disabled={isSaving || isLoading}
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
            
            <p className="text-sm text-indigo-300">
              设置以下API密钥以启用相应的功能。这些密钥将安全地存储并仅在需要时使用。
            </p>
            
            <Separator className="bg-indigo-800/30" />
            
            {/* OpenAI API密钥 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-indigo-300">
                OpenAI API密钥
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    name="openaiKey"
                    type={visibleKeys.openaiKey ? 'text' : 'password'}
                    value={apiKeys.openaiKey}
                    onChange={handleApiKeyChange}
                    placeholder="sk-..." 
                    disabled={isLoading}
                    className="pr-24"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <button
                      type="button"
                      onClick={() => toggleKeyVisibility('openaiKey')}
                      className="p-1 text-indigo-400 hover:text-indigo-300"
                    >
                      {visibleKeys.openaiKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(apiKeys.openaiKey, 'OpenAI API密钥')}
                      disabled={!apiKeys.openaiKey}
                      className="p-1 text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => generateNewApiKey('openaiKey')}
                  className="flex-shrink-0 gap-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  生成
                </Button>
              </div>
              <p className="text-xs text-indigo-400">
                用于GPT模型和嵌入。从OpenAI账户设置中获取。
              </p>
            </div>
            
            {/* Anthropic API密钥 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-indigo-300">
                Anthropic API密钥
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    name="anthropicKey"
                    type={visibleKeys.anthropicKey ? 'text' : 'password'}
                    value={apiKeys.anthropicKey}
                    onChange={handleApiKeyChange}
                    placeholder="sk-ant-..." 
                    disabled={isLoading}
                    className="pr-24"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <button
                      type="button"
                      onClick={() => toggleKeyVisibility('anthropicKey')}
                      className="p-1 text-indigo-400 hover:text-indigo-300"
                    >
                      {visibleKeys.anthropicKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(apiKeys.anthropicKey, 'Anthropic API密钥')}
                      disabled={!apiKeys.anthropicKey}
                      className="p-1 text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => generateNewApiKey('anthropicKey')}
                  className="flex-shrink-0 gap-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  生成
                </Button>
              </div>
              <p className="text-xs text-indigo-400">
                用于Claude模型。从Anthropic账户设置获取。
              </p>
            </div>
            
            {/* 数据库设置 */}
            <Separator className="bg-indigo-800/30 my-4" />
            <h3 className="text-md font-medium text-indigo-200">数据库设置</h3>
            
            {/* Neon数据库密钥 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-indigo-300">
                Neon数据库密钥
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    name="neonKey"
                    type={visibleKeys.neonKey ? 'text' : 'password'}
                    value={apiKeys.neonKey}
                    onChange={handleApiKeyChange}
                    placeholder="neon_api_..." 
                    disabled={isLoading}
                    className="pr-24"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <button
                      type="button"
                      onClick={() => toggleKeyVisibility('neonKey')}
                      className="p-1 text-indigo-400 hover:text-indigo-300"
                    >
                      {visibleKeys.neonKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(apiKeys.neonKey, 'Neon数据库密钥')}
                      disabled={!apiKeys.neonKey}
                      className="p-1 text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => generateNewApiKey('neonKey')}
                  className="flex-shrink-0 gap-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  生成
                </Button>
              </div>
              <p className="text-xs text-indigo-400">
                用于Neon Serverless Postgres数据库连接。
              </p>
            </div>
            
            {/* 向量存储设置 */}
            <Separator className="bg-indigo-800/30 my-4" />
            <h3 className="text-md font-medium text-indigo-200">向量存储设置</h3>
            
            {/* Pinecone API密钥 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-indigo-300">
                Pinecone API密钥
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    name="pineconeKey"
                    type={visibleKeys.pineconeKey ? 'text' : 'password'}
                    value={apiKeys.pineconeKey}
                    onChange={handleApiKeyChange}
                    placeholder="pinecone_..." 
                    disabled={isLoading}
                    className="pr-24"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <button
                      type="button"
                      onClick={() => toggleKeyVisibility('pineconeKey')}
                      className="p-1 text-indigo-400 hover:text-indigo-300"
                    >
                      {visibleKeys.pineconeKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(apiKeys.pineconeKey, 'Pinecone API密钥')}
                      disabled={!apiKeys.pineconeKey}
                      className="p-1 text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => generateNewApiKey('pineconeKey')}
                  className="flex-shrink-0 gap-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  生成
                </Button>
              </div>
              <p className="text-xs text-indigo-400">
                用于向量存储和知识库检索。
              </p>
            </div>
            
            {/* HuggingFace API密钥 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-indigo-300">
                HuggingFace API密钥
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    name="huggingfaceKey"
                    type={visibleKeys.huggingfaceKey ? 'text' : 'password'}
                    value={apiKeys.huggingfaceKey}
                    onChange={handleApiKeyChange}
                    placeholder="hf_..." 
                    disabled={isLoading}
                    className="pr-24"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <button
                      type="button"
                      onClick={() => toggleKeyVisibility('huggingfaceKey')}
                      className="p-1 text-indigo-400 hover:text-indigo-300"
                    >
                      {visibleKeys.huggingfaceKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(apiKeys.huggingfaceKey, 'HuggingFace API密钥')}
                      disabled={!apiKeys.huggingfaceKey}
                      className="p-1 text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => generateNewApiKey('huggingfaceKey')}
                  className="flex-shrink-0 gap-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  生成
                </Button>
              </div>
              <p className="text-xs text-indigo-400">
                用于开源模型和自定义嵌入。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 