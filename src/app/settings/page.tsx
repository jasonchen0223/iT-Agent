"use client";

import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cog, KeyRound, FileText, Sliders, ChevronRight } from 'lucide-react';

interface SettingCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const SettingCard = ({ title, description, icon, href }: SettingCardProps) => {
  return (
    <Link href={href}>
      <Card className="bg-gradient-to-b from-indigo-950/40 to-black/40 border border-indigo-800/30 hover:from-indigo-900/60 hover:to-indigo-950/30 hover:border-indigo-700/50 transition-all cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="mt-1 p-2 bg-indigo-900/50 rounded-lg">
                {icon}
              </div>
              <div>
                <h3 className="text-lg font-medium text-indigo-100">{title}</h3>
                <p className="text-indigo-300/80 mt-1">{description}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-indigo-400" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

/**
 * 设置页面
 * 
 * 提供系统各项设置的入口
 */
export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="系统设置" 
        description="配置系统参数和用户偏好"
      />
      
      <div className="grid gap-4 md:grid-cols-2">
        <SettingCard 
          title="通用设置" 
          description="系统语言、时区和日期格式" 
          icon={<Cog className="h-6 w-6 text-indigo-100" />}
          href="/settings"
        />
        
        <SettingCard 
          title="API 配置" 
          description="管理API密钥和连接设置" 
          icon={<KeyRound className="h-6 w-6 text-indigo-100" />}
          href="/settings/api"
        />
        
        <SettingCard 
          title="用户偏好" 
          description="个性化界面和行为设置" 
          icon={<Sliders className="h-6 w-6 text-indigo-100" />}
          href="/settings/preferences"
        />
        
        <SettingCard 
          title="系统日志" 
          description="查看系统操作和事件记录" 
          icon={<FileText className="h-6 w-6 text-indigo-100" />}
          href="/settings/logs"
        />
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-indigo-100 mb-4">常用设置</h2>
        
        <Card className="bg-gradient-to-b from-indigo-950/40 to-black/40 border border-indigo-800/30">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-indigo-100 block">系统语言</label>
                <select className="w-full bg-indigo-900/20 text-indigo-100 p-2.5 rounded-md border border-indigo-800/30 focus:outline-none focus:border-indigo-500">
                  <option value="zh-CN">简体中文</option>
                  <option value="en-US">English (US)</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-indigo-100 block">时区</label>
                <select className="w-full bg-indigo-900/20 text-indigo-100 p-2.5 rounded-md border border-indigo-800/30 focus:outline-none focus:border-indigo-500">
                  <option value="Asia/Shanghai">Asia/Shanghai (GMT+8)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (GMT-7)</option>
                  <option value="Europe/London">Europe/London (GMT+0)</option>
                </select>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button>保存基本设置</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}