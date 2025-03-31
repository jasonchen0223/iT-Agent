'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/common/PageHeader';
import { CollaborationVisualizer } from '@/components/collaboration/CollaborationVisualizer';
import { Button } from '@/components/ui/button';
import { ICollaborationSession } from '@/types/collaboration';
import { ArrowLeft, Pause, Play, StopCircle } from 'lucide-react';
import Link from 'next/link';

/**
 * 代理协作详情页面
 * 
 * 展示特定代理协作会话的详细信息
 * 
 * @returns {React.ReactElement} 代理协作详情页面
 */
export default function CollaborationDetailPage() {
    const params = useParams();
    const id = (params?.id as string) || '';
    
    const [session, setSession] = useState<ICollaborationSession | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // 模拟加载协作会话数据
    useEffect(() => {
        const loadCollaborationSession = async () => {
            try {
                setLoading(true);
                // 模拟API调用延迟
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // 模拟数据
                const mockSession: ICollaborationSession = {
                    id,
                    name: '多代理协作分析项目',
                    description: '由不同专长的代理共同协作完成项目分析任务',
                    status: 'active',
                    startTime: '2023-12-15 14:30',
                    messageCount: 86,
                    taskCount: 12,
                    nodes: [
                        {
                            id: 'agent1',
                            name: '项目经理',
                            type: 'leader',
                            status: 'active',
                            description: '负责协调和分配任务',
                            messageCount: 32,
                            capabilities: ['任务分配', '进度管理', '风险评估']
                        },
                        {
                            id: 'agent2',
                            name: '需求分析师',
                            type: 'specialist',
                            status: 'active',
                            description: '分析和整理项目需求',
                            messageCount: 24,
                            capabilities: ['需求分析', '用户故事', '场景设计']
                        },
                        {
                            id: 'agent3',
                            name: '架构师',
                            type: 'specialist',
                            status: 'active',
                            description: '负责系统架构设计',
                            messageCount: 18,
                            capabilities: ['架构设计', '技术选型', '性能优化']
                        },
                        {
                            id: 'agent4',
                            name: '开发协调员',
                            type: 'coordinator',
                            status: 'active',
                            description: '协调开发任务和资源',
                            messageCount: 20,
                            capabilities: ['任务协调', '资源分配', '进度跟踪']
                        },
                        {
                            id: 'agent5',
                            name: '前端专家',
                            type: 'executor',
                            status: 'active',
                            description: '负责前端实现',
                            messageCount: 15,
                            capabilities: ['UI设计', '前端开发', '用户体验']
                        },
                        {
                            id: 'agent6',
                            name: '后端专家',
                            type: 'executor',
                            status: 'active',
                            description: '负责后端实现',
                            messageCount: 13,
                            capabilities: ['API设计', '数据库', '性能优化']
                        },
                        {
                            id: 'agent7',
                            name: '测试专家',
                            type: 'executor',
                            status: 'active',
                            description: '负责测试和质量保证',
                            messageCount: 10,
                            capabilities: ['测试策略', '自动化测试', '质量评估']
                        }
                    ],
                    links: [
                        {
                            id: 'link1',
                            source: 'agent1',
                            target: 'agent2',
                            type: 'command',
                            label: '任务分配',
                            messageCount: 10,
                            color: '#6d28d9'
                        },
                        {
                            id: 'link2',
                            source: 'agent1',
                            target: 'agent3',
                            type: 'command',
                            label: '任务分配',
                            messageCount: 8,
                            color: '#6d28d9'
                        },
                        {
                            id: 'link3',
                            source: 'agent1',
                            target: 'agent4',
                            type: 'command',
                            label: '协调要求',
                            messageCount: 12,
                            color: '#6d28d9'
                        },
                        {
                            id: 'link4',
                            source: 'agent2',
                            target: 'agent3',
                            type: 'communication',
                            label: '需求交流',
                            messageCount: 15,
                            color: '#2563eb'
                        },
                        {
                            id: 'link5',
                            source: 'agent4',
                            target: 'agent5',
                            type: 'command',
                            label: '任务分配',
                            messageCount: 8,
                            color: '#10b981'
                        },
                        {
                            id: 'link6',
                            source: 'agent4',
                            target: 'agent6',
                            type: 'command',
                            label: '任务分配',
                            messageCount: 7,
                            color: '#10b981'
                        },
                        {
                            id: 'link7',
                            source: 'agent4',
                            target: 'agent7',
                            type: 'command',
                            label: '测试安排',
                            messageCount: 6,
                            color: '#10b981'
                        },
                        {
                            id: 'link8',
                            source: 'agent5',
                            target: 'agent6',
                            type: 'collaboration',
                            label: '接口协作',
                            messageCount: 18,
                            color: '#f59e0b'
                        },
                        {
                            id: 'link9',
                            source: 'agent3',
                            target: 'agent5',
                            type: 'communication',
                            label: '架构指导',
                            messageCount: 5,
                            color: '#2563eb'
                        },
                        {
                            id: 'link10',
                            source: 'agent3',
                            target: 'agent6',
                            type: 'communication',
                            label: '架构指导',
                            messageCount: 6,
                            color: '#2563eb'
                        },
                        {
                            id: 'link11',
                            source: 'agent7',
                            target: 'agent5',
                            type: 'collaboration',
                            label: '测试协作',
                            messageCount: 4,
                            color: '#f59e0b'
                        },
                        {
                            id: 'link12',
                            source: 'agent7',
                            target: 'agent6',
                            type: 'collaboration',
                            label: '测试协作',
                            messageCount: 5,
                            color: '#f59e0b'
                        }
                    ]
                };
                
                setSession(mockSession);
            } catch (err) {
                console.error('加载协作会话数据失败:', err);
                setError('加载协作会话数据失败，请稍后重试');
            } finally {
                setLoading(false);
            }
        };
        
        loadCollaborationSession();
    }, [id]);
    
    // 刷新协作会话数据
    const handleRefresh = () => {
        setLoading(true);
        // 模拟刷新
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };
    
    // 暂停协作会话
    const handlePause = () => {
        if (!session) return;
        
        setSession({
            ...session,
            status: 'paused'
        });
    };
    
    // 继续协作会话
    const handleResume = () => {
        if (!session) return;
        
        setSession({
            ...session,
            status: 'active'
        });
    };
    
    // 结束协作会话
    const handleStop = () => {
        if (!session) return;
        
        setSession({
            ...session,
            status: 'completed'
        });
    };
    
    // 显示加载状态
    if (loading && !session) {
        return (
            <div className="container mx-auto py-8">
                <div className="flex items-center mb-6">
                    <Link href="/collaboration" className="text-indigo-400 mr-4">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold text-indigo-100">加载协作会话...</h1>
                </div>
                
                <div className="space-card p-8 text-center">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-indigo-900/40 rounded w-1/3 mx-auto"></div>
                        <div className="h-4 bg-indigo-900/40 rounded w-2/3 mx-auto"></div>
                        <div className="h-64 bg-indigo-900/30 rounded mt-8"></div>
                    </div>
                </div>
            </div>
        );
    }
    
    // 显示错误状态
    if (error) {
        return (
            <div className="container mx-auto py-8">
                <div className="flex items-center mb-6">
                    <Link href="/collaboration" className="text-indigo-400 mr-4">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold text-indigo-100">协作会话</h1>
                </div>
                
                <div className="space-card p-8 text-center">
                    <p className="text-red-400 mb-4">{error}</p>
                    <Button onClick={handleRefresh}>重试</Button>
                </div>
            </div>
        );
    }
    
    if (!session) return null;
    
    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <Link href="/collaboration" className="text-indigo-400 mr-4">
                        <ArrowLeft size={20} />
                    </Link>
                    <PageHeader 
                        title={session.name}
                        description={session.description || '代理协作会话详情'}
                    />
                </div>
                
                <div className="flex gap-2">
                    {session.status === 'active' ? (
                        <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={handlePause}
                        >
                            <Pause size={16} />
                            暂停
                        </Button>
                    ) : session.status === 'paused' ? (
                        <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={handleResume}
                        >
                            <Play size={16} />
                            继续
                        </Button>
                    ) : null}
                    
                    {(session.status === 'active' || session.status === 'paused') && (
                        <Button 
                            variant="default" 
                            size="sm"
                            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white"
                            onClick={handleStop}
                        >
                            <StopCircle size={16} />
                            结束
                        </Button>
                    )}
                </div>
            </div>
            
            <CollaborationVisualizer 
                session={session}
                onRefresh={handleRefresh}
            />
        </div>
    );
}
