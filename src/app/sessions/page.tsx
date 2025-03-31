'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

/**
 * 会话管理页面
 * 
 * 用于列出和管理所有会话
 */
export default function SessionsPage() {
  const router = useRouter();
  
  // 添加模拟会话数据
  const sessions = [
    {
      id: '1',
      title: '网站开发计划会话',
      lastActive: '10分钟前',
      participants: ['产品经理', '开发工程师', '设计师'],
      status: 'active'
    },
    {
      id: '2',
      title: '数据分析任务',
      lastActive: '1小时前',
      participants: ['数据科学家', '业务分析师'],
      status: 'active'
    },
    {
      id: '3',
      title: '代码审查会话',
      lastActive: '昨天',
      participants: ['高级开发工程师', '代码审查员'],
      status: 'completed'
    }
  ]; // 未来会从API获取数据
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-100">会话管理</h1>
        <Button onClick={() => router.push('/sessions/new')}>
          创建新会话
        </Button>
      </div>
      
      {sessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 渲染会话列表 */}
          {sessions.map(session => (
            <Card key={session.id} className="overflow-hidden hover:shadow-glow transition-all cursor-pointer" onClick={() => router.push(`/sessions/${session.id}`)}>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-indigo-200 mb-2">{session.title}</h3>
                <div className="flex justify-between text-indigo-300/70 mb-4">
                  <span>上次活动：{session.lastActive}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    session.status === 'active' ? 'bg-green-900/30 text-green-400' : 'bg-purple-900/30 text-purple-400'
                  }`}>
                    {session.status === 'active' ? '进行中' : '已完成'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {session.participants.map((participant, index) => (
                    <span key={index} className="px-2 py-1 bg-indigo-900/40 rounded-md text-xs text-indigo-300">
                      {participant}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <h3 className="text-xl font-semibold text-indigo-200 mb-2">暂无会话</h3>
          <p className="text-indigo-300/70 mb-4">开始创建您的第一个会话</p>
          <Button onClick={() => router.push('/sessions/new')}>
            创建新会话
          </Button>
        </Card>
      )}
    </div>
  );
} 