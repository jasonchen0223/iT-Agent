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
      icon: (
        <HiOutlineUsers
          className="w-6 h-6 text-indigo-400"
          data-oid="0.fepy0"
        />
      ),

      href: "/agents",
      color: "rgba(99, 102, 241, 0.7)",
    },
    {
      title: "工作流配置",
      description:
        "设计高效的代理协作工作流，自定义每个步骤和决策点，实现自动化处理。",
      icon: (
        <HiOutlineCog className="w-6 h-6 text-violet-400" data-oid="_xvqrdw" />
      ),

      href: "/workflows",
      color: "rgba(139, 92, 246, 0.7)",
    },
    {
      title: "会话与对话",
      description: "查看和管理智能代理之间的对话历史，分析交互模式和协作效果。",
      icon: (
        <HiOutlineChat className="w-6 h-6 text-indigo-400" data-oid="1eiao.e" />
      ),

      href: "/conversations",
      color: "rgba(99, 102, 241, 0.7)",
    },
    {
      title: "知识库管理",
      description:
        "创建和维护你的智能代理团队可访问的知识库，确保信息的准确性和时效性。",
      icon: (
        <HiOutlineDocumentText
          className="w-6 h-6 text-violet-400"
          data-oid="r0qwenm"
        />
      ),

      href: "/knowledge",
      color: "rgba(139, 92, 246, 0.7)",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8" data-oid="mibs-6h">
      <div className="mb-16 text-center" data-oid="tq26lj_">
        <SpaceTitle
          as="h1"
          size="xl"
          align="center"
          className="mb-4"
          data-oid="f6yj9px"
        >
          iT-Agent 智能代理协作系统
        </SpaceTitle>
        <p
          className="text-lg text-gray-300 max-w-2xl mx-auto"
          data-oid="qgm2epr"
        >
          欢迎使用智能代理协作系统，在这里你可以创建和管理多个AI代理，让它们协同工作，解决复杂问题。
        </p>
      </div>

      {/* 主要功能区 */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        data-oid="52rwhgw"
      >
        {features.map((feature, index) => (
          <Link href={feature.href} key={index} data-oid="8xvozpb">
            <GlowCard
              className="p-6 h-full cursor-pointer"
              glowColor={feature.color}
              glowSize="md"
              data-oid="ibz90ee"
            >
              <div className="flex items-start" data-oid="jgg6vqj">
                <div className="mr-4 mt-1" data-oid="ww-t:mi">
                  {feature.icon}
                </div>
                <div data-oid="oqkpfih">
                  <h3
                    className="text-xl font-semibold mb-2 text-white"
                    data-oid="-bp5c-z"
                  >
                    {feature.title}
                  </h3>
                  <p className="text-gray-300" data-oid="sfya5n2">
                    {feature.description}
                  </p>
                </div>
              </div>
            </GlowCard>
          </Link>
        ))}
      </div>

      {/* 活动状态区 */}
      <div className="mb-12" data-oid="lw43xsc">
        <SpaceTitle as="h2" size="lg" className="mb-6" data-oid="ejqmt9o">
          系统状态
        </SpaceTitle>
        <GlowCard
          className="p-6"
          glowColor="rgba(77, 109, 255, 0.7)"
          pulsating
          data-oid="hpgmmn8"
        >
          <div
            className="flex flex-col md:flex-row justify-between"
            data-oid="g4ys3ce"
          >
            <div className="mb-4 md:mb-0" data-oid="6gb::xs">
              <h3
                className="text-xl font-semibold mb-2 text-white"
                data-oid="arip5ip"
              >
                活动状态
              </h3>
              <div className="space-y-2" data-oid="_o8u0_o">
                <div className="flex items-center" data-oid="6t:af9x">
                  <div
                    className="w-3 h-3 rounded-full bg-green-400 mr-2 animate-pulse"
                    data-oid="196xrdw"
                  ></div>
                  <span className="text-gray-300" data-oid="j1dea53">
                    系统正常运行中
                  </span>
                </div>
                <div className="flex items-center" data-oid="oeujo-f">
                  <div
                    className="w-3 h-3 rounded-full bg-blue-400 mr-2"
                    data-oid="evk1f_-"
                  ></div>
                  <span className="text-gray-300" data-oid="lfcn9lw">
                    已连接API服务: 3/3
                  </span>
                </div>
                <div className="flex items-center" data-oid="dtso26x">
                  <div
                    className="w-3 h-3 rounded-full bg-yellow-400 mr-2"
                    data-oid="b5r0oi:"
                  ></div>
                  <span className="text-gray-300" data-oid="yabjqi1">
                    当前活跃工作流: 0
                  </span>
                </div>
              </div>
            </div>
            <div
              className="flex flex-col justify-center items-center"
              data-oid="x:d136n"
            >
              <div
                className="text-5xl font-bold text-white mb-2"
                data-oid="21hn9ut"
              >
                0
              </div>
              <div className="text-sm text-gray-400" data-oid="bv9x4n-">
                活跃代理
              </div>
            </div>
            <div
              className="flex flex-col justify-center items-center"
              data-oid="xkbshc9"
            >
              <div
                className="text-5xl font-bold text-white mb-2"
                data-oid="7xixna1"
              >
                0
              </div>
              <div className="text-sm text-gray-400" data-oid="mkztkdm">
                今日会话
              </div>
            </div>
            <div
              className="flex flex-col justify-center items-center"
              data-oid="s41bb1c"
            >
              <div
                className="text-5xl font-bold text-white mb-2"
                data-oid="bqxuy9c"
              >
                0
              </div>
              <div className="text-sm text-gray-400" data-oid="fpi07ex">
                已完成任务
              </div>
            </div>
          </div>
        </GlowCard>
      </div>

      {/* 快速操作区 */}
      <div data-oid="0rapdfa">
        <SpaceTitle as="h2" size="lg" className="mb-6" data-oid="2la6vft">
          快速操作
        </SpaceTitle>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          data-oid="v4z3sc."
        >
          <Link href="/agents/new" data-oid="-kbg:os">
            <GlowCard
              className="p-4 text-center h-full hover:bg-opacity-30"
              glowSize="sm"
              data-oid="n1wsta:"
            >
              <div
                className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-indigo-500 bg-opacity-20 mb-3"
                data-oid="sfzkme_"
              >
                <HiOutlineUsers
                  className="w-6 h-6 text-indigo-400"
                  data-oid="hbm6v--"
                />
              </div>
              <h3 className="text-lg font-medium mb-1" data-oid="0_s.uq_">
                创建新代理
              </h3>
              <p className="text-sm text-gray-400" data-oid="v_1xwxo">
                配置新的智能代理
              </p>
            </GlowCard>
          </Link>
          <Link href="/workflows/new" data-oid="mlg0w3a">
            <GlowCard
              className="p-4 text-center h-full hover:bg-opacity-30"
              glowSize="sm"
              data-oid="_aggftz"
            >
              <div
                className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-violet-500 bg-opacity-20 mb-3"
                data-oid="uq.55sf"
              >
                <HiOutlineCog
                  className="w-6 h-6 text-violet-400"
                  data-oid="v-bb23_"
                />
              </div>
              <h3 className="text-lg font-medium mb-1" data-oid="etqdn05">
                创建工作流
              </h3>
              <p className="text-sm text-gray-400" data-oid="j9__8g_">
                设计代理协作流程
              </p>
            </GlowCard>
          </Link>
          <Link href="/conversations/new" data-oid="7lan5l-">
            <GlowCard
              className="p-4 text-center h-full hover:bg-opacity-30"
              glowSize="sm"
              data-oid=":s8cehd"
            >
              <div
                className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-indigo-500 bg-opacity-20 mb-3"
                data-oid=":-4-2:6"
              >
                <HiOutlineChat
                  className="w-6 h-6 text-indigo-400"
                  data-oid=":lkgxdb"
                />
              </div>
              <h3 className="text-lg font-medium mb-1" data-oid="wei_nnl">
                开始对话
              </h3>
              <p className="text-sm text-gray-400" data-oid="2fewalk">
                与智能代理团队交流
              </p>
            </GlowCard>
          </Link>
          <Link href="/knowledge/new" data-oid="fh242sl">
            <GlowCard
              className="p-4 text-center h-full hover:bg-opacity-30"
              glowSize="sm"
              data-oid="1ntzi4g"
            >
              <div
                className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-violet-500 bg-opacity-20 mb-3"
                data-oid="49:qrz5"
              >
                <HiOutlineDocumentText
                  className="w-6 h-6 text-violet-400"
                  data-oid="gk2-2ip"
                />
              </div>
              <h3 className="text-lg font-medium mb-1" data-oid="sszw.fw">
                添加知识
              </h3>
              <p className="text-sm text-gray-400" data-oid="78uedl2">
                扩充代理知识库
              </p>
            </GlowCard>
          </Link>
        </div>
      </div>
    </div>
  );
}
