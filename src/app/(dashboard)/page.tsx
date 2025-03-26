"use client";

import React from "react";
import {
  HiOutlineUsers,
  HiOutlineCog,
  HiOutlineChat,
  HiOutlineDocumentText,
} from "react-icons/hi";
import { GlowCard } from "@/components/ui/GlowCard";
import { SpaceTitle } from "@/components/ui/SpaceTitle";
import Link from "next/link";
import Image from "next/image";

/**
 * 仪表盘首页
 */
export default function DashboardPage() {
  const features = [
    {
      title: "智能代理管理",
      description:
        "创建、配置和管理你的智能代理团队，设置它们的角色、行为和能力。",
      icon: <HiOutlineUsers className="w-6 h-6 text-indigo-400" />,

      href: "/agents",
      color: "rgba(99, 102, 241, 0.7)",
    },
    {
      title: "工作流配置",
      description:
        "设计高效的代理协作工作流，自定义每个步骤和决策点，实现自动化处理。",
      icon: <HiOutlineCog className="w-6 h-6 text-violet-400" />,

      href: "/workflows",
      color: "rgba(139, 92, 246, 0.7)",
    },
    {
      title: "会话与对话",
      description: "查看和管理智能代理之间的对话历史，分析交互模式和协作效果。",
      icon: <HiOutlineChat className="w-6 h-6 text-indigo-400" />,

      href: "/conversations",
      color: "rgba(99, 102, 241, 0.7)",
    },
    {
      title: "知识库管理",
      description:
        "创建和维护你的智能代理团队可访问的知识库，确保信息的准确性和时效性。",
      icon: <HiOutlineDocumentText className="w-6 h-6 text-violet-400" />,

      href: "/knowledge",
      color: "rgba(139, 92, 246, 0.7)",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-16 text-center">
        <SpaceTitle as="h1" size="xl" align="center" className="mb-4">
          iT-Agent 智能代理协作系统
        </SpaceTitle>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          欢迎使用智能代理协作系统，在这里你可以创建和管理多个AI代理，让它们协同工作，解决复杂问题。
        </p>
      </div>

      {/* 主要功能区 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {features.map((feature, index) => (
          <Link href={feature.href} key={index}>
            <GlowCard
              className="p-6 h-full cursor-pointer"
              glowColor={feature.color}
              glowSize="md"
            >
              <div className="flex items-start">
                <div className="mr-4 mt-1">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </div>
            </GlowCard>
          </Link>
        ))}
      </div>

      {/* 活动状态区 */}
      <div className="mb-12">
        <SpaceTitle as="h2" size="lg" className="mb-6">
          系统状态
        </SpaceTitle>
        <GlowCard className="p-6" glowColor="rgba(77, 109, 255, 0.7)" pulsating>
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-semibold mb-2 text-white">
                活动状态
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-400 mr-2 animate-pulse"></div>
                  <span className="text-gray-300">系统正常运行中</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                  <span className="text-gray-300">已连接API服务: 3/3</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                  <span className="text-gray-300">当前活跃工作流: 0</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <div className="text-5xl font-bold text-white mb-2">0</div>
              <div className="text-sm text-gray-400">活跃代理</div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <div className="text-5xl font-bold text-white mb-2">0</div>
              <div className="text-sm text-gray-400">今日会话</div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <div className="text-5xl font-bold text-white mb-2">0</div>
              <div className="text-sm text-gray-400">已完成任务</div>
            </div>
          </div>
        </GlowCard>
      </div>

      {/* 快速操作区 */}
      <div>
        <SpaceTitle as="h2" size="lg" className="mb-6">
          快速操作
        </SpaceTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/agents/new">
            <GlowCard
              className="p-4 text-center h-full hover:bg-opacity-30"
              glowSize="sm"
            >
              <div className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-indigo-500 bg-opacity-20 mb-3">
                <HiOutlineUsers className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-medium mb-1">创建新代理</h3>
              <p className="text-sm text-gray-400">配置新的智能代理</p>
            </GlowCard>
          </Link>
          <Link href="/workflows/new">
            <GlowCard
              className="p-4 text-center h-full hover:bg-opacity-30"
              glowSize="sm"
            >
              <div className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-violet-500 bg-opacity-20 mb-3">
                <HiOutlineCog className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-lg font-medium mb-1">创建工作流</h3>
              <p className="text-sm text-gray-400">设计代理协作流程</p>
            </GlowCard>
          </Link>
          <Link href="/conversations/new">
            <GlowCard
              className="p-4 text-center h-full hover:bg-opacity-30"
              glowSize="sm"
            >
              <div className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-indigo-500 bg-opacity-20 mb-3">
                <HiOutlineChat className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-medium mb-1">开始对话</h3>
              <p className="text-sm text-gray-400">与智能代理团队交流</p>
            </GlowCard>
          </Link>
          <Link href="/knowledge/new">
            <GlowCard
              className="p-4 text-center h-full hover:bg-opacity-30"
              glowSize="sm"
            >
              <div className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-violet-500 bg-opacity-20 mb-3">
                <HiOutlineDocumentText className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-lg font-medium mb-1">添加知识</h3>
              <p className="text-sm text-gray-400">扩充代理知识库</p>
            </GlowCard>
          </Link>
        </div>
      </div>
    </div>
  );
}
