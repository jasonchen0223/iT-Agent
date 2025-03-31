'use client';

import React, { useState } from 'react';
import { IAgentNode, ICollaborationLink, ICollaborationSession } from '@/types/collaboration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { CollaborationNetwork } from './CollaborationNetwork';

/**
 * 协作可视化组件属性接口
 */
interface CollaborationVisualizerProps {
    /** 协作会话数据 */
    session: ICollaborationSession;
    /** 刷新回调函数 */
    onRefresh?: () => void;
}

/**
 * 协作可视化组件
 * 
 * 展示代理协作网络、详情和日志
 * 
 * @param {CollaborationVisualizerProps} props - 组件属性
 * @returns {React.ReactElement} 协作可视化组件
 */
export const CollaborationVisualizer: React.FC<CollaborationVisualizerProps> = ({
    session,
    onRefresh
}) => {
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>('network');
    
    // 获取选中节点
    const selectedNode = selectedNodeId 
        ? session.nodes.find(node => node.id === selectedNodeId) 
        : null;
    
    // 处理节点点击事件
    const handleNodeSelect = (nodeId: string) => {
        setSelectedNodeId(nodeId);
        setActiveTab('details');
    };
    
    // 获取与选中节点相关的连接
    const getRelatedLinks = (nodeId: string) => {
        return session.links.filter(
            link => link.source === nodeId || link.target === nodeId
        );
    };
    
    // 获取与选中节点相关的其他节点
    const getRelatedNodes = (nodeId: string) => {
        const relatedLinks = getRelatedLinks(nodeId);
        const relatedNodeIds = new Set<string>();
        
        relatedLinks.forEach(link => {
            if (link.source !== nodeId) relatedNodeIds.add(link.source);
            if (link.target !== nodeId) relatedNodeIds.add(link.target);
        });
        
        return Array.from(relatedNodeIds).map(id => 
            session.nodes.find(node => node.id === id)
        ).filter(Boolean) as IAgentNode[];
    };
    
    // 获取连接类型的图标和颜色
    const getLinkTypeInfo = (type: string) => {
        switch (type) {
            case 'command':
                return { color: 'text-purple-500 bg-purple-950/30', label: '指令' };
            case 'communication':
                return { color: 'text-blue-500 bg-blue-950/30', label: '交流' };
            case 'collaboration':
                return { color: 'text-orange-500 bg-orange-950/30', label: '协作' };
            default:
                return { color: 'text-gray-500 bg-gray-950/30', label: '未知' };
        }
    };
    
    // 获取代理类型的标签名称
    const getAgentTypeLabel = (type: string) => {
        switch (type) {
            case 'leader':
                return '领导者';
            case 'coordinator':
                return '协调者';
            case 'specialist':
                return '专家';
            case 'executor':
                return '执行者';
            default:
                return '未知类型';
        }
    };
    
    // 获取代理状态的标签和颜色
    const getAgentStatusInfo = (status: string) => {
        switch (status) {
            case 'active':
                return { color: 'text-green-500 bg-green-950/30', label: '活跃' };
            case 'paused':
                return { color: 'text-yellow-500 bg-yellow-950/30', label: '暂停' };
            case 'inactive':
                return { color: 'text-gray-500 bg-gray-950/30', label: '不活跃' };
            case 'completed':
                return { color: 'text-blue-500 bg-blue-950/30', label: '已完成' };
            default:
                return { color: 'text-gray-500 bg-gray-950/30', label: '未知' };
        }
    };
    
    // 获取会话状态的标签和颜色
    const getSessionStatusInfo = (status: string) => {
        switch (status) {
            case 'active':
                return { color: 'bg-green-600/20 text-green-400', label: '进行中' };
            case 'paused':
                return { color: 'bg-yellow-600/20 text-yellow-400', label: '已暂停' };
            case 'completed':
                return { color: 'bg-blue-600/20 text-blue-400', label: '已完成' };
            default:
                return { color: 'bg-gray-600/20 text-gray-400', label: '未知状态' };
        }
    };
    
    const sessionStatusInfo = getSessionStatusInfo(session.status);
    
    return (
        <Card className="border-indigo-800/20 bg-indigo-950/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        协作可视化
                        {session.status && (
                            <Badge variant="outline" className={`ml-2 text-xs ${sessionStatusInfo.color}`}>
                                {sessionStatusInfo.label}
                            </Badge>
                        )}
                    </CardTitle>
                    <CardDescription className="text-indigo-300">
                        {session.nodes.length} 个代理 · {session.links.length} 个连接
                        {session.startTime && ` · 开始于 ${session.startTime}`}
                    </CardDescription>
                </div>
                
                {onRefresh && (
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1 text-indigo-300"
                        onClick={onRefresh}
                    >
                        <RefreshCw size={14} />
                        刷新
                    </Button>
                )}
            </CardHeader>
            
            <CardContent className="px-0 pb-0">
                <Tabs 
                    defaultValue="network" 
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <div className="px-6">
                        <TabsList className="bg-indigo-900/20">
                            <TabsTrigger value="network" className="data-[state=active]:bg-indigo-800/30">
                                网络
                            </TabsTrigger>
                            <TabsTrigger 
                                value="details" 
                                className="data-[state=active]:bg-indigo-800/30" 
                                disabled={!selectedNodeId}
                            >
                                代理详情
                            </TabsTrigger>
                            <TabsTrigger value="log" className="data-[state=active]:bg-indigo-800/30">
                                互动日志
                            </TabsTrigger>
                        </TabsList>
                    </div>
                    
                    <TabsContent value="network" className="pt-4">
                        <div className="w-full h-[500px]">
                            <CollaborationNetwork 
                                session={session}
                                selectedNodeId={selectedNodeId || undefined}
                                onNodeSelect={handleNodeSelect}
                            />
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="details" className="pt-4 px-6">
                        {selectedNode ? (
                            <div className="space-y-6">
                                {/* 代理信息 */}
                                <div className="p-4 bg-indigo-900/20 rounded-lg space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium text-indigo-100">{selectedNode.name}</h3>
                                        
                                        <div className="flex gap-2">
                                            <Badge className="bg-indigo-800/30 text-xs">
                                                {getAgentTypeLabel(selectedNode.type)}
                                            </Badge>
                                            <Badge 
                                                className={`text-xs ${getAgentStatusInfo(selectedNode.status).color}`}
                                                variant="outline"
                                            >
                                                {getAgentStatusInfo(selectedNode.status).label}
                                            </Badge>
                                        </div>
                                    </div>
                                    
                                    <p className="text-indigo-300 text-sm">{selectedNode.description}</p>
                                    
                                    {selectedNode.capabilities && selectedNode.capabilities.length > 0 && (
                                        <div className="mt-2">
                                            <p className="text-xs text-indigo-400 mb-1">能力</p>
                                            <div className="flex flex-wrap gap-1">
                                                {selectedNode.capabilities.map((capability, index) => (
                                                    <Badge 
                                                        key={index}
                                                        variant="outline" 
                                                        className="bg-indigo-900/30 text-indigo-300 text-xs"
                                                    >
                                                        {capability}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="flex justify-between text-xs text-indigo-400">
                                        <span>消息数量: {selectedNode.messageCount || 0}</span>
                                        <span>ID: {selectedNode.id}</span>
                                    </div>
                                </div>
                                
                                {/* 连接信息 */}
                                <div>
                                    <h4 className="text-sm font-medium text-indigo-100 mb-2">相关连接</h4>
                                    
                                    {getRelatedLinks(selectedNode.id).length > 0 ? (
                                        <div className="space-y-2">
                                            {getRelatedLinks(selectedNode.id).map(link => {
                                                const isSource = link.source === selectedNode.id;
                                                const otherNodeId = isSource ? link.target : link.source;
                                                const otherNode = session.nodes.find(n => n.id === otherNodeId);
                                                const typeInfo = getLinkTypeInfo(link.type);
                                                
                                                if (!otherNode) return null;
                                                
                                                return (
                                                    <div 
                                                        key={link.id} 
                                                        className="p-3 bg-indigo-900/20 rounded-md flex justify-between items-center"
                                                    >
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-1">
                                                                {isSource ? (
                                                                    <span className="text-sm text-indigo-100">
                                                                        <span className="text-indigo-400">发送至:</span> {otherNode.name}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-sm text-indigo-100">
                                                                        <span className="text-indigo-400">接收自:</span> {otherNode.name}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            
                                                            <div className="text-xs text-indigo-300 mt-1">
                                                                {link.label || `${link.type} 连接`} · {link.messageCount || 0} 条消息
                                                            </div>
                                                        </div>
                                                        
                                                        <Badge 
                                                            variant="outline" 
                                                            className={`ml-2 ${typeInfo.color}`}
                                                        >
                                                            {typeInfo.label}
                                                        </Badge>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center p-4 bg-indigo-900/20 rounded-md text-indigo-400 text-sm">
                                            此代理没有与其他代理的连接
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-8 text-indigo-400">
                                请在网络图中选择一个代理节点以查看详情
                            </div>
                        )}
                    </TabsContent>
                    
                    <TabsContent value="log" className="pt-4 px-6">
                        <div className="bg-indigo-900/20 p-4 rounded-lg text-center">
                            <p className="text-indigo-400">互动日志功能正在开发中...</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}; 