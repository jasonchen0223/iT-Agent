"use client";

import React, { useState } from 'react';
import { ITool, IToolExecuteRequest, IToolParameter } from '@/types/tool';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * 工具详情组件属性
 */
interface ToolDetailsProps {
  tool: ITool;
  onExecute?: (request: IToolExecuteRequest) => void;
  onClose?: () => void;
  isExecuting?: boolean;
  className?: string;
}

/**
 * 工具详情组件
 * 
 * 显示工具的详细信息和执行参数配置
 * 
 * @param {ToolDetailsProps} props - 组件属性
 * @returns {React.ReactElement} 组件渲染结果
 */
export const ToolDetails: React.FC<ToolDetailsProps> = ({
  tool,
  onExecute,
  onClose,
  isExecuting = false,
  className
}) => {
  // 当前选中的选项卡
  const [currentTab, setCurrentTab] = useState('info');
  
  // 执行参数状态
  const [parameters, setParameters] = useState<Record<string, any>>({});
  
  // 更新参数值
  const updateParameter = (name: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 执行工具
  const handleExecute = () => {
    if (onExecute) {
      const request: IToolExecuteRequest = {
        toolId: tool.id,
        action: 'run',
        parameters
      };
      
      onExecute(request);
    }
  };
  
  // 获取工具的参数定义
  const getToolParameters = (): IToolParameter[] => {
    return (tool.metadata?.parameters as IToolParameter[]) || [];
  };
  
  // 渲染参数输入控件
  const renderParameterInput = (param: IToolParameter) => {
    const { name, type, description, required, options, default: defaultValue } = param;
    
    // 如果参数有默认值且当前没有设置值，使用默认值
    if (defaultValue !== undefined && parameters[name] === undefined) {
      updateParameter(name, defaultValue);
    }
    
    switch (type) {
      case 'string':
        return options ? (
          <Select
            value={parameters[name] || ''}
            onValueChange={(value) => updateParameter(name, value)}
            disabled={isExecuting}
          >
            <SelectTrigger>
              <SelectValue placeholder={`选择${name}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            value={parameters[name] || ''}
            onChange={(e) => updateParameter(name, e.target.value)}
            placeholder={description}
            disabled={isExecuting}
          />
        );
        
      case 'number':
        return (
          <Input
            type="number"
            value={parameters[name] || ''}
            onChange={(e) => updateParameter(name, parseFloat(e.target.value))}
            placeholder={description}
            disabled={isExecuting}
          />
        );
        
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`param-${name}`}
              checked={!!parameters[name]}
              onCheckedChange={(checked) => updateParameter(name, checked)}
              disabled={isExecuting}
            />
            <label
              htmlFor={`param-${name}`}
              className="text-sm font-medium leading-none cursor-pointer"
            >
              {description}
            </label>
          </div>
        );
        
      case 'array':
      case 'object':
        return (
          <Textarea
            value={parameters[name] ? JSON.stringify(parameters[name], null, 2) : ''}
            onChange={(e) => {
              try {
                const value = JSON.parse(e.target.value);
                updateParameter(name, value);
              } catch {
                // 在解析错误时仍然更新文本内容以允许用户继续编辑
                updateParameter(name, e.target.value);
              }
            }}
            placeholder={`${description} (JSON格式)`}
            rows={5}
            disabled={isExecuting}
          />
        );
        
      default:
        return (
          <Input
            value={parameters[name] || ''}
            onChange={(e) => updateParameter(name, e.target.value)}
            placeholder={description}
            disabled={isExecuting}
          />
        );
    }
  };
  
  return (
    <Card className={`h-full flex flex-col ${className || ''}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{tool.name}</CardTitle>
            <CardDescription>{tool.description}</CardDescription>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              ✕
            </Button>
          )}
        </div>
      </CardHeader>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="flex-grow flex flex-col">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="info">工具信息</TabsTrigger>
          <TabsTrigger value="execute">执行工具</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="flex-grow">
          <TabsContent value="info" className="p-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">基本信息</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">ID</div>
                <div className="truncate">{tool.id}</div>
                
                <div className="font-medium">类型</div>
                <div>
                  <Badge variant="outline">{tool.type}</Badge>
                </div>
                
                <div className="font-medium">状态</div>
                <div>
                  <Badge
                    variant={tool.status === 'available' ? 'default' : 'secondary'}
                  >
                    {tool.status}
                  </Badge>
                </div>
                
                <div className="font-medium">版本</div>
                <div>{tool.version || 'N/A'}</div>
                
                <div className="font-medium">来源</div>
                <div>{tool.source || 'internal'}</div>
                
                <div className="font-medium">创建时间</div>
                <div>{new Date(tool.createdAt).toLocaleString()}</div>
                
                <div className="font-medium">最后更新</div>
                <div>{new Date(tool.updatedAt).toLocaleString()}</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">权限</h3>
              <div className="flex flex-wrap gap-1">
                {tool.permissions.map((permission) => (
                  <Badge key={permission} variant="outline">
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>
            
            {tool.metadata && Object.keys(tool.metadata).length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">元数据</h3>
                <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-x-auto">
                  {JSON.stringify(tool.metadata, null, 2)}
                </pre>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="execute" className="p-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">执行参数</h3>
              
              {getToolParameters().length > 0 ? (
                <div className="space-y-4">
                  {getToolParameters().map((param) => (
                    <div key={param.name} className="space-y-2">
                      <Label htmlFor={`param-${param.name}`}>
                        {param.name}
                        {param.required && <span className="text-red-500"> *</span>}
                      </Label>
                      <div className="text-xs text-gray-500 mb-1">
                        {param.description}
                      </div>
                      {renderParameterInput(param)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  该工具没有需要配置的参数
                </div>
              )}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
      
      <CardFooter className="border-t bg-gray-50 dark:bg-gray-900 p-4">
        {currentTab === 'execute' && (
          <Button 
            onClick={handleExecute} 
            disabled={isExecuting || tool.status !== 'available'}
            className="w-full"
          >
            {isExecuting ? '执行中...' : '执行工具'}
          </Button>
        )}
        
        {currentTab === 'info' && onClose && (
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full"
          >
            关闭
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}; 