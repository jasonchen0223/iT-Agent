"use client";

import React from 'react';
import { LayoutDashboard, Clock, GitBranch, Users, Wrench, ArrowRight } from 'lucide-react';
import Link from 'next/link';

/**
 * 仪表盘页面
 * 
 * 系统的主要功能仪表盘，提供系统概览和快捷操作
 * 
 * @returns {React.ReactElement} 仪表盘页面组件
 */
export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-indigo-100">系统仪表盘</h1>
        <p className="text-indigo-300 mt-1">
          欢迎使用iT-Agent智能代理协作系统
        </p>
      </div>
      
      {/* 状态卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard 
          title="活跃会话" 
          value="3" 
          icon={<Clock className="w-6 h-6 text-indigo-300" />} 
          description="当前进行中的会话"
        />
        <DashboardCard 
          title="代理总数" 
          value="12" 
          icon={<Users className="w-6 h-6 text-indigo-300" />} 
          description="已配置的代理数量"
        />
        <DashboardCard 
          title="工具数量" 
          value="24" 
          icon={<Wrench className="w-6 h-6 text-indigo-300" />} 
          description="可用的工具数量"
        />
        <DashboardCard 
          title="任务数量" 
          value="8" 
          icon={<GitBranch className="w-6 h-6 text-indigo-300" />} 
          description="当前待处理任务"
        />
      </div>
      
      {/* 快速操作区域 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-indigo-100 mb-4">快速操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/tools" className="group">
            <div className="bg-indigo-900/30 border border-indigo-800/30 rounded-lg p-5 shadow-glow-sm hover:bg-indigo-900/50 transition-all">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-indigo-200">工具中心</h3>
                  <p className="text-indigo-300 text-sm mt-1">访问和管理所有智能工具</p>
                </div>
                <div className="bg-indigo-950/50 p-3 rounded-lg group-hover:bg-indigo-800/70 transition-all">
                  <Wrench className="w-6 h-6 text-indigo-300" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-indigo-400 group-hover:text-indigo-200 transition-colors">
                <span className="text-sm mr-2">立即访问</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
          
          <Link href="/agents" className="group">
            <div className="bg-indigo-900/30 border border-indigo-800/30 rounded-lg p-5 shadow-glow-sm hover:bg-indigo-900/50 transition-all">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-indigo-200">代理管理</h3>
                  <p className="text-indigo-300 text-sm mt-1">配置和管理智能代理</p>
                </div>
                <div className="bg-indigo-950/50 p-3 rounded-lg group-hover:bg-indigo-800/70 transition-all">
                  <Users className="w-6 h-6 text-indigo-300" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-indigo-400 group-hover:text-indigo-200 transition-colors">
                <span className="text-sm mr-2">立即访问</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
          
          <Link href="/sessions" className="group">
            <div className="bg-indigo-900/30 border border-indigo-800/30 rounded-lg p-5 shadow-glow-sm hover:bg-indigo-900/50 transition-all">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-indigo-200">会话中心</h3>
                  <p className="text-indigo-300 text-sm mt-1">查看和管理代理协作会话</p>
                </div>
                <div className="bg-indigo-950/50 p-3 rounded-lg group-hover:bg-indigo-800/70 transition-all">
                  <Clock className="w-6 h-6 text-indigo-300" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-indigo-400 group-hover:text-indigo-200 transition-colors">
                <span className="text-sm mr-2">立即访问</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>
      
      {/* 主要内容区域 - 三列布局 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* 左侧 - 项目导航 */}
        <div className="md:col-span-3 space-card">
          <h2 className="text-xl font-semibold text-indigo-100 mb-4">最近项目</h2>
          <div className="space-y-2">
            {/* 项目列表项 */}
            <Link href="/projects/1">
              <div className="p-3 bg-indigo-900/20 rounded-md hover:bg-indigo-900/40 transition-colors cursor-pointer">
                <h3 className="text-indigo-100">个人网站开发</h3>
                <p className="text-indigo-300/70 text-sm">上次编辑: 2小时前</p>
              </div>
            </Link>
            <Link href="/projects/2">
              <div className="p-3 bg-indigo-900/20 rounded-md hover:bg-indigo-900/40 transition-colors cursor-pointer">
                <h3 className="text-indigo-100">智能代理系统</h3>
                <p className="text-indigo-300/70 text-sm">上次编辑: 昨天</p>
              </div>
            </Link>
          </div>
        </div>
        
        {/* 中间 - 项目宇宙图 */}
        <div className="md:col-span-6 space-card min-h-[400px]">
          <h2 className="text-xl font-semibold text-indigo-100 mb-4">项目宇宙</h2>
          <div className="w-full h-[300px] bg-indigo-950/50 rounded-lg flex items-center justify-center">
            <p className="text-indigo-300">项目宇宙图可视化区域</p>
          </div>
        </div>
        
        {/* 右侧 - 通知与活动 */}
        <div className="md:col-span-3 space-card">
          <h2 className="text-xl font-semibold text-indigo-100 mb-4">最近活动</h2>
          <div className="space-y-3">
            <div className="p-3 bg-indigo-900/20 rounded-md">
              <p className="text-indigo-100 text-sm">产品经理代理完成了需求分析</p>
              <p className="text-indigo-300/70 text-xs">30分钟前</p>
            </div>
            <div className="p-3 bg-indigo-900/20 rounded-md">
              <p className="text-indigo-100 text-sm">架构师代理提出了7新方案</p>
              <p className="text-indigo-300/70 text-xs">2小时前</p>
            </div>
            <div className="p-3 bg-indigo-900/20 rounded-md">
              <p className="text-indigo-100 text-sm">开发代理创建了新任务</p>
              <p className="text-indigo-300/70 text-xs">3小时前</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 仪表盘卡片组件
function DashboardCard({ title, value, icon, description }) {
  return (
    <div className="bg-indigo-900/20 border border-indigo-800/30 rounded-lg p-4 shadow-glow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-indigo-200">{title}</h3>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          <p className="text-indigo-300 text-sm mt-1">{description}</p>
        </div>
        <div className="bg-indigo-950/50 p-3 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
} 