'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Play, 
    PlusCircle, 
    Clock, 
    MessageSquare, 
    Users, 
    ArrowRight, 
    PauseCircle,
    Trash2
} from 'lucide-react';
import { ICollaborationSession } from '@/types/collaboration';

/**
 * 代理协作会话列表页面
 * 
 * 展示所有代理协作会话，并允许创建新会话
 * 
 * @returns {React.ReactElement} 代理协作会话列表页面
 */
export default function CollaborationListPage() {
    const router = useRouter();
    const [sessions, setSessions] = useState<ICollaborationSession[]>([
        {
            id: '1',
            name: '多代理协作分析项目',
            description: '由不同专长的代理共同协作完成项目分析任务',
            status: 'active',
            startTime: '2023-12-15 14:30',
            messageCount: 86,
            taskCount: 12,
            nodes: [],
            links: []
        },
        {
            id: '2',
            name: '前端开发协作会话',
            description: '前端组件开发与代码审查合作流程',
            status: 'paused',
            startTime: '2023-12-14 09:45',
            messageCount: 53,
            taskCount: 8,
            nodes: [],
            links: []
        },
        {
            id: '3',
            name: '数据分析团队协作',
            description: '多代理协作进行大规模数据集分析与可视化',
            status: 'completed',
            startTime: '2023-12-10 18:20',
            endTime: '2023-12-12 10:35',
            messageCount: 142,
            taskCount: 15,
            nodes: [],
            links: []
        }
    ]);
    
    // 创建新会话
    const handleCreateSession = () => {
        const newSession: ICollaborationSession = {
            id: Date.now().toString(),
            name: '新建协作会话',
            description: '描述你的代理协作目标和任务',
            status: 'active',
            startTime: new Date().toLocaleString('zh-CN'),
            messageCount: 0,
            taskCount: 0,
            nodes: [],
            links: []
        };
        
        setSessions(prev => [newSession, ...prev]);
        router.push(`/collaboration/${newSession.id}`);
    };
    
    // 暂停会话
    const handlePauseSession = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        setSessions(prev => prev.map(session => 
            session.id === id ? { ...session, status: 'paused' } : session
        ));
    };
    
    // 继续会话
    const handleResumeSession = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        setSessions(prev => prev.map(session => 
            session.id === id ? { ...session, status: 'active' } : session
        ));
    };
    
    // 删除会话
    const handleDeleteSession = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (confirm('确定要删除此协作会话吗？此操作无法撤销。')) {
            setSessions(prev => prev.filter(session => session.id !== id));
        }
    };
    
    // 获取状态样式
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return (
                    <Badge className="bg-green-600/20 text-green-400 hover:bg-green-600/30">
                        进行中
                    </Badge>
                );
            case 'paused':
                return (
                    <Badge className="bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30">
                        已暂停
                    </Badge>
                );
            case 'completed':
                return (
                    <Badge className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/30">
                        已完成
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-gray-600/20 text-gray-400 hover:bg-gray-600/30">
                        未知
                    </Badge>
                );
        }
    };
    
    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <PageHeader 
                    title="代理协作管理"
                    description="创建和管理多代理协作会话"
                />
                
                <Button className="gap-2" onClick={handleCreateSession}>
                    <PlusCircle size={16} />
                    创建协作会话
                </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map(session => (
                    <Link href={`/collaboration/${session.id}`} key={session.id}>
                        <Card className="border-indigo-800/20 bg-indigo-950/30 hover:bg-indigo-950/40 transition-all h-full flex flex-col">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg text-indigo-100">{session.name}</CardTitle>
                                    {getStatusBadge(session.status)}
                                </div>
                                <CardDescription className="text-indigo-300">
                                    {session.description}
                                </CardDescription>
                            </CardHeader>
                            
                            <CardContent className="flex-1">
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <Badge variant="outline" className="flex items-center gap-1 bg-indigo-900/30 text-indigo-300">
                                        <Users size={12} />
                                        {session.nodes?.length || 0} 代理
                                    </Badge>
                                    <Badge variant="outline" className="flex items-center gap-1 bg-indigo-900/30 text-indigo-300">
                                        <MessageSquare size={12} />
                                        {session.messageCount || 0} 消息
                                    </Badge>
                                    <Badge variant="outline" className="flex items-center gap-1 bg-indigo-900/30 text-indigo-300">
                                        <Clock size={12} />
                                        {session.startTime}
                                    </Badge>
                                </div>
                            </CardContent>
                            
                            <CardFooter className="flex justify-between pt-2 border-t border-indigo-800/20">
                                <div className="flex space-x-2">
                                    {session.status === 'active' ? (
                                        <Button 
                                            size="sm" 
                                            variant="outline"
                                            className="h-8 text-indigo-300" 
                                            onClick={(e) => handlePauseSession(session.id, e)}
                                        >
                                            <PauseCircle size={14} className="mr-1" />
                                            暂停
                                        </Button>
                                    ) : session.status === 'paused' ? (
                                        <Button 
                                            size="sm" 
                                            variant="outline"
                                            className="h-8 text-indigo-300" 
                                            onClick={(e) => handleResumeSession(session.id, e)}
                                        >
                                            <Play size={14} className="mr-1" />
                                            继续
                                        </Button>
                                    ) : null}
                                    
                                    <Button 
                                        size="sm"
                                        variant="outline"
                                        className="h-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                        onClick={(e) => handleDeleteSession(session.id, e)}
                                    >
                                        <Trash2 size={14} className="mr-1" />
                                        删除
                                    </Button>
                                </div>
                                
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="h-8 text-indigo-300"
                                >
                                    详情
                                    <ArrowRight size={14} className="ml-1" />
                                </Button>
                            </CardFooter>
                        </Card>
                    </Link>
                ))}
                
                {sessions.length === 0 && (
                    <div className="col-span-3 text-center py-20 space-card">
                        <p className="text-indigo-300 mb-4">暂无协作会话</p>
                        <Button onClick={handleCreateSession}>
                            <PlusCircle size={16} className="mr-2" />
                            创建第一个协作会话
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
} 