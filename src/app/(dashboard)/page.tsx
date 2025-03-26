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
          data-oid="r87l8hv"
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
        <HiOutlineCog className="w-6 h-6 text-violet-400" data-oid="n2w:fnb" />
      ),

      href: "/workflows",
      color: "rgba(139, 92, 246, 0.7)",
    },
    {
      title: "会话与对话",
      description: "查看和管理智能代理之间的对话历史，分析交互模式和协作效果。",
      icon: (
        <HiOutlineChat className="w-6 h-6 text-indigo-400" data-oid="t-kp_0:" />
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
          data-oid="t10i44a"
        />
      ),

      href: "/knowledge",
      color: "rgba(139, 92, 246, 0.7)",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8" data-oid="c:z5-_d">
      <div className="mb-16 text-center" data-oid="2gxd48v">
        <SpaceTitle
          as="h1"
          size="xl"
          align="center"
          className="mb-4"
          data-oid="q-qu.:f"
        >
          iT-Agent 智能代理协作系统
        </SpaceTitle>
        <p
          className="text-lg text-gray-300 max-w-2xl mx-auto"
          data-oid="k510t34"
        >
          欢迎使用智能代理协作系统，在这里你可以创建和管理多个AI代理，让它们协同工作，解决复杂问题。
        </p>
      </div>

      {/* 主要功能区 */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        data-oid="z4ap-ug"
      >
        {features.map((feature, index) => (
          <Link href={feature.href} key={index} data-oid="_:-:n6m">
            <GlowCard
              className="p-6 h-full cursor-pointer"
              glowColor={feature.color}
              glowSize="md"
              data-oid="zy09e8x"
            >
              <div className="flex items-start" data-oid="q-7_:o7">
                <div className="mr-4 mt-1" data-oid=".lxxzon">
                  {feature.icon}
                </div>
                <div data-oid="9zob9zx">
                  <h3
                    className="text-xl font-semibold mb-2 text-white"
                    data-oid="weoph.e"
                  >
                    {feature.title}
                  </h3>
                  <p className="text-gray-300" data-oid="i6d4t-k">
                    {feature.description}
                  </p>
                </div>
              </div>
            </GlowCard>
          </Link>
        ))}
      </div>

      {/* 活动状态区 */}
      <div className="mb-12" data-oid="w54.-oc">
        <SpaceTitle as="h2" size="lg" className="mb-6" data-oid="-8un4lp">
          系统状态
        </SpaceTitle>
        <GlowCard
          className="p-6"
          glowColor="rgba(77, 109, 255, 0.7)"
          pulsating
          data-oid="fz20lqk"
        >
          <div
            className="flex flex-col md:flex-row justify-between"
            data-oid="735d5.n"
          >
            <div className="mb-4 md:mb-0" data-oid="6-o2dh2">
              <h3
                className="text-xl font-semibold mb-2 text-white"
                data-oid="cfhsojd"
              >
                活动状态
              </h3>
              <div className="space-y-2" data-oid="om0g1qp">
                <div className="flex items-center" data-oid="dhz_p-v">
                  <div
                    className="w-3 h-3 rounded-full bg-green-400 mr-2 animate-pulse"
                    data-oid="uu.5ryo"
                  ></div>
                  <span className="text-gray-300" data-oid="nb4qx1p">
                    系统正常运行中
                  </span>
                </div>
                <div className="flex items-center" data-oid="nsckxz.">
                  <div
                    className="w-3 h-3 rounded-full bg-blue-400 mr-2"
                    data-oid="a5lc1j5"
                  ></div>
                  <span className="text-gray-300" data-oid=":d4jela">
                    已连接API服务: 3/3
                  </span>
                </div>
                <div className="flex items-center" data-oid=":ymxbz6">
                  <div
                    className="w-3 h-3 rounded-full bg-yellow-400 mr-2"
                    data-oid="phvly4d"
                  ></div>
                  <span className="text-gray-300" data-oid="oh_3f70">
                    当前活跃工作流: 0
                  </span>
                </div>
              </div>
            </div>
            <div
              className="flex flex-col justify-center items-center"
              data-oid="ht6v36f"
            >
              <div
                className="text-5xl font-bold text-white mb-2"
                data-oid="zvl67jw"
              >
                0
              </div>
              <div className="text-sm text-gray-400" data-oid="m3ln7zx">
                活跃代理
              </div>
            </div>
            <div
              className="flex flex-col justify-center items-center"
              data-oid="d0yii6y"
            >
              <div
                className="text-5xl font-bold text-white mb-2"
                data-oid="ffn.eh4"
              >
                0
              </div>
              <div className="text-sm text-gray-400" data-oid="g9uosal">
                今日会话
              </div>
            </div>
            <div
              className="flex flex-col justify-center items-center"
              data-oid="2gfx92x"
            >
              <div
                className="text-5xl font-bold text-white mb-2"
                data-oid="6t:s:8c"
              >
                0
              </div>
              <div className="text-sm text-gray-400" data-oid="jvdjjmn">
                已完成任务
              </div>
            </div>
          </div>
        </GlowCard>
      </div>

      {/* 快速操作区 */}
      <div data-oid="xekcjsx">
        <SpaceTitle as="h2" size="lg" className="mb-6" data-oid="3hnq.5b">
          快速操作
        </SpaceTitle>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          data-oid="hn5myhr"
        >
          <Link href="/agents/new" data-oid="5a9xe42">
            <GlowCard
              className="p-4 text-center h-full hover:bg-opacity-30"
              glowSize="sm"
              data-oid="1zh0w-y"
            >
              <div
                className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-indigo-500 bg-opacity-20 mb-3"
                data-oid="sz5g4ke"
              >
                <HiOutlineUsers
                  className="w-6 h-6 text-indigo-400"
                  data-oid="3eb98ho"
                />
              </div>
              <h3 className="text-lg font-medium mb-1" data-oid="dorc5p_">
                创建新代理
              </h3>
              <p className="text-sm text-gray-400" data-oid="v0k:_ei">
                配置新的智能代理
              </p>
            </GlowCard>
          </Link>
          <Link href="/workflows/new" data-oid="xkop5gk">
            <GlowCard
              className="p-4 text-center h-full hover:bg-opacity-30"
              glowSize="sm"
              data-oid=".ty_-b8"
            >
              <div
                className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-violet-500 bg-opacity-20 mb-3"
                data-oid=".8t6d-v"
              >
                <HiOutlineCog
                  className="w-6 h-6 text-violet-400"
                  data-oid="3hm68_3"
                />
              </div>
              <h3 className="text-lg font-medium mb-1" data-oid="7.xufv4">
                创建工作流
              </h3>
              <p className="text-sm text-gray-400" data-oid="1nzmeh:">
                设计代理协作流程
              </p>
            </GlowCard>
          </Link>
          <Link href="/conversations/new" data-oid="35xd-fd">
            <GlowCard
              className="p-4 text-center h-full hover:bg-opacity-30"
              glowSize="sm"
              data-oid="b_ebolz"
            >
              <div
                className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-indigo-500 bg-opacity-20 mb-3"
                data-oid="ru8dmkj"
              >
                <HiOutlineChat
                  className="w-6 h-6 text-indigo-400"
                  data-oid="jk_-8cf"
                />
              </div>
              <h3 className="text-lg font-medium mb-1" data-oid="rx0gr-b">
                开始对话
              </h3>
              <p className="text-sm text-gray-400" data-oid="z0jvnqw">
                与智能代理团队交流
              </p>
            </GlowCard>
          </Link>
          <Link href="/knowledge/new" data-oid="676.l7k">
            <GlowCard
              className="p-4 text-center h-full hover:bg-opacity-30"
              glowSize="sm"
              data-oid="h31wvoe"
            >
              <div
                className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-violet-500 bg-opacity-20 mb-3"
                data-oid="1uio5co"
              >
                <HiOutlineDocumentText
                  className="w-6 h-6 text-violet-400"
                  data-oid="s06nrox"
                />
              </div>
              <h3 className="text-lg font-medium mb-1" data-oid="rhf3uyu">
                添加知识
              </h3>
              <p className="text-sm text-gray-400" data-oid="vavb-4:">
                扩充代理知识库
              </p>
            </GlowCard>
          </Link>
        </div>
      </div>
    </div>
  );
}
