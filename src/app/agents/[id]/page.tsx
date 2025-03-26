// app/agents/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TAgentRole, TAgentStatus } from "@/types/agent";
import { useRouter } from "next/navigation";
import Link from "next/link";

// 示例代理数据
const SAMPLE_AGENTS = [
  {
    id: "product-manager",
    name: "产品经理代理",
    role: TAgentRole.PLANNER,
    description: "专注于需求分析和功能规划，擅长用户需求挖掘和产品功能设计。",
    status: TAgentStatus.IDLE,
    color: "#8b5cf6",
    icon: "/icons/product-manager.svg",
    systemMessage: "",
    capability: ["需求分析", "功能规划", "用户调研"],
  },
  {
    id: "architect",
    name: "架构师代理",
    role: TAgentRole.ORCHESTRATOR,
    description: "负责系统设计和技术选型，构建可扩展、高性能的系统架构方案。",
    status: TAgentStatus.IDLE,
    color: "#3b82f6",
    icon: "/icons/architect.svg",
    systemMessage: "",
    capability: ["架构设计", "技术选型", "性能优化"],
  },
  {
    id: "developer",
    name: "开发者代理",
    role: TAgentRole.CODER,
    description: "前端与后端实现专家，精通多种编程语言和前后端技术。",
    status: TAgentStatus.WORKING,
    color: "#10b981",
    icon: "/icons/developer.svg",
    systemMessage: "",
    capability: ["前端开发", "后端开发", "代码审查"],
  },
  {
    id: "tester",
    name: "测试工程师代理",
    role: TAgentRole.TESTER,
    description:
      "专注于质量保障，设计测试用例并执行自动化测试，确保产品可靠性。",
    status: TAgentStatus.WAITING,
    color: "#059669",
    icon: "/icons/tester.svg",
    systemMessage: "",
    capability: ["测试用例设计", "自动化测试", "性能测试"],
  },
  {
    id: "devops",
    name: "DevOps工程师代理",
    role: TAgentRole.EXECUTOR,
    description:
      "自动化部署与运维专家，负责持续集成、持续交付流程的实施与优化。",
    status: TAgentStatus.DONE,
    color: "#ef4444",
    icon: "/icons/devops.svg",
    systemMessage: "",
    capability: ["自动化部署", "持续集成", "容器化"],
  },
  {
    id: "doc-writer",
    name: "文档工程师代理",
    role: TAgentRole.REVIEWER,
    description: "专注于技术文档撰写与维护，确保文档的准确性、完整性和可读性。",
    status: TAgentStatus.ERROR,
    color: "#f97316",
    icon: "/icons/doc-writer.svg",
    systemMessage: "",
    capability: ["技术文档", "API文档", "用户指南"],
  },
];

// 将状态映射为中文显示文本
const statusText = {
  [TAgentStatus.IDLE]: "空闲",
  [TAgentStatus.THINKING]: "思考中",
  [TAgentStatus.WORKING]: "工作中",
  [TAgentStatus.WAITING]: "等待中",
  [TAgentStatus.DONE]: "完成",
  [TAgentStatus.ERROR]: "错误",
};

// 将角色映射为中文显示文本
const roleText = {
  [TAgentRole.USER]: "用户",
  [TAgentRole.ASSISTANT]: "助手",
  [TAgentRole.ORCHESTRATOR]: "协调者",
  [TAgentRole.EXECUTOR]: "执行者",
  [TAgentRole.PLANNER]: "规划者",
  [TAgentRole.CRITIC]: "评论者",
  [TAgentRole.RESEARCHER]: "研究者",
  [TAgentRole.CODER]: "编码者",
  [TAgentRole.TESTER]: "测试者",
  [TAgentRole.REVIEWER]: "审查者",
  [TAgentRole.CUSTOM]: "自定义",
};

export default function AgentDetail({ params }: { params: { id: string } }) {
  const [agent, setAgent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 模拟从API获取代理数据
    const foundAgent = SAMPLE_AGENTS.find((a) => a.id === params.id);
    if (foundAgent) {
      setAgent(foundAgent);
    }
    setLoading(false);
  }, [params.id]);

  const getStatusBadgeClass = (status: TAgentStatus) => {
    switch (status) {
      case TAgentStatus.IDLE:
        return "bg-blue-500/20 text-blue-400";
      case TAgentStatus.THINKING:
        return "bg-purple-500/20 text-purple-400";
      case TAgentStatus.WORKING:
        return "bg-green-500/20 text-green-400";
      case TAgentStatus.WAITING:
        return "bg-yellow-500/20 text-yellow-400";
      case TAgentStatus.DONE:
        return "bg-indigo-500/20 text-indigo-400";
      case TAgentStatus.ERROR:
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center" data-oid="ccybzfx">
        <p className="text-indigo-100" data-oid="-wk1xzl">
          加载中...
        </p>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="container mx-auto py-8" data-oid="rc2-.w:">
        <Card data-oid="ymf45on">
          <CardTitle data-oid="b5:jpy4">找不到代理</CardTitle>
          <CardContent data-oid="w8891ss">
            <p className="mb-4" data-oid="rh-7ztv">
              无法找到ID为 {params.id} 的代理。
            </p>
            <Button onClick={() => router.push("/agents")} data-oid="7lo_moj">
              返回代理列表
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 获取首字母作为头像
  const getInitials = (name: string) => {
    return name.substring(0, 2);
  };

  return (
    <div className="container mx-auto py-8" data-oid="c71.y3-">
      {/* 代理信息栏 */}
      <div
        className="mb-6 border-b border-indigo-800/30 pb-6"
        data-oid="teewco1"
      >
        <div className="flex items-center" data-oid="_bhz9tu">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mr-4 text-white font-semibold text-xl"
            style={{ backgroundColor: agent.color }}
            data-oid="ro6mzc1"
          >
            {getInitials(agent.name)}
          </div>
          <div data-oid="_edlows">
            <h1
              className="text-2xl font-bold text-indigo-100"
              data-oid="o8kxc9p"
            >
              {agent.name}
            </h1>
            <div className="flex items-center mt-1" data-oid="mc0ri9u">
              <span
                className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(agent.status)}`}
                data-oid="ak:wk0x"
              >
                {statusText[agent.status]}
              </span>
              <span className="mx-2 text-indigo-300/50" data-oid="f2rmpz4">
                •
              </span>
              <span className="text-indigo-300/70" data-oid="ibwr9gk">
                {roleText[agent.role]}
              </span>
            </div>
          </div>
          <div className="ml-auto flex gap-2" data-oid="b1k9acz">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/agents/${agent.id}/edit`)}
              data-oid="whadfvy"
            >
              编辑
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                router.push(`/collaboration/new?agent=${agent.id}`)
              }
              data-oid="7et0w9g"
            >
              开始会话
            </Button>
          </div>
        </div>
      </div>

      {/* 页面内容 */}
      <div
        className="grid grid-cols-1 md:grid-cols-12 gap-6"
        data-oid="a2_p4d4"
      >
        {/* 左侧导航 */}
        <div className="md:col-span-2" data-oid="z2hfi0m">
          <Card className="p-0 overflow-hidden" data-oid="3uy4c-l">
            <nav data-oid="rt2h13f">
              <button
                onClick={() => setActiveTab("info")}
                className={`w-full text-left px-4 py-3 ${
                  activeTab === "info"
                    ? "bg-indigo-700/30 text-white"
                    : "text-indigo-300 hover:bg-indigo-700/20"
                }`}
                data-oid="jxa5zv6"
              >
                基本信息
              </button>
              <button
                onClick={() => setActiveTab("capabilities")}
                className={`w-full text-left px-4 py-3 ${
                  activeTab === "capabilities"
                    ? "bg-indigo-700/30 text-white"
                    : "text-indigo-300 hover:bg-indigo-700/20"
                }`}
                data-oid="czolfz9"
              >
                能力配置
              </button>
              <button
                onClick={() => setActiveTab("prompts")}
                className={`w-full text-left px-4 py-3 ${
                  activeTab === "prompts"
                    ? "bg-indigo-700/30 text-white"
                    : "text-indigo-300 hover:bg-indigo-700/20"
                }`}
                data-oid="3.-9zwu"
              >
                提示词设置
              </button>
              <button
                onClick={() => setActiveTab("tools")}
                className={`w-full text-left px-4 py-3 ${
                  activeTab === "tools"
                    ? "bg-indigo-700/30 text-white"
                    : "text-indigo-300 hover:bg-indigo-700/20"
                }`}
                data-oid="tkitwsm"
              >
                工具集成
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`w-full text-left px-4 py-3 ${
                  activeTab === "history"
                    ? "bg-indigo-700/30 text-white"
                    : "text-indigo-300 hover:bg-indigo-700/20"
                }`}
                data-oid="glhvfl7"
              >
                历史记录
              </button>
            </nav>
          </Card>
        </div>

        {/* 中央详情区 */}
        <div className="md:col-span-7" data-oid="9fl3i_h">
          <Card data-oid="7m98e7y">
            {activeTab === "info" && (
              <>
                <CardTitle data-oid="81oyr2p">基本信息</CardTitle>
                <CardContent className="space-y-4" data-oid="rp0kc1j">
                  <div data-oid="xb4-64c">
                    <h3
                      className="text-indigo-100 font-medium mb-1"
                      data-oid="m-doh7:"
                    >
                      描述
                    </h3>
                    <p data-oid="5.cg5cu">{agent.description}</p>
                  </div>
                  <div data-oid="_iv9-sx">
                    <h3
                      className="text-indigo-100 font-medium mb-1"
                      data-oid="0-l3aks"
                    >
                      角色
                    </h3>
                    <p data-oid="id-6iys">{roleText[agent.role]}</p>
                  </div>
                  <div data-oid="-11co8q">
                    <h3
                      className="text-indigo-100 font-medium mb-1"
                      data-oid="p9a_ul6"
                    >
                      状态
                    </h3>
                    <div className="flex items-center" data-oid="g3ppxw3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(agent.status)}`}
                        data-oid="7:.zkm3"
                      >
                        {statusText[agent.status]}
                      </span>
                    </div>
                  </div>
                  <div data-oid="8nsypra">
                    <h3
                      className="text-indigo-100 font-medium mb-1"
                      data-oid="gx9z7h:"
                    >
                      ID
                    </h3>
                    <p className="font-mono" data-oid="csrml12">
                      {agent.id}
                    </p>
                  </div>
                </CardContent>
              </>
            )}

            {activeTab === "capabilities" && (
              <>
                <CardTitle data-oid="6ijdekk">能力配置</CardTitle>
                <CardContent className="space-y-6" data-oid="509:4.o">
                  <div data-oid="9aqicl4">
                    <h3
                      className="text-indigo-100 font-medium mb-3"
                      data-oid="_nqw6y:"
                    >
                      专长领域
                    </h3>
                    <div className="flex flex-wrap gap-2" data-oid="e6qd41z">
                      {agent.capability.map((cap: string) => (
                        <span
                          key={cap}
                          className="px-3 py-1 bg-indigo-900/30 text-indigo-300 text-sm rounded-full"
                          data-oid="x6:htfl"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div data-oid="s-5o4yo">
                    <h3
                      className="text-indigo-100 font-medium mb-3"
                      data-oid="y01v-6q"
                    >
                      能力评分
                    </h3>
                    <div
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      data-oid="ejbt3p6"
                    >
                      {agent.capability.map((cap: string, index: number) => (
                        <div
                          key={index}
                          className="p-4 bg-indigo-900/20 rounded-md"
                          data-oid="ilghgmw"
                        >
                          <h4
                            className="text-indigo-100 mb-2"
                            data-oid="puevhwa"
                          >
                            {cap}
                          </h4>
                          <div
                            className="w-full bg-indigo-900/30 h-3 rounded-full"
                            data-oid="ooi9p12"
                          >
                            <div
                              className="h-3 rounded-full"
                              style={{
                                width: `${70 + Math.floor(Math.random() * 30)}%`,
                                backgroundColor: agent.color,
                              }}
                              data-oid="-1bt5b5"
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div data-oid="jiuxghu">
                    <h3
                      className="text-indigo-100 font-medium mb-3"
                      data-oid="-g09dr8"
                    >
                      参数设置
                    </h3>
                    <div className="space-y-4" data-oid="jdd286u">
                      <div className="space-y-2" data-oid="t.71jrs">
                        <label
                          className="text-indigo-100 block"
                          data-oid="1d6d-41"
                        >
                          温度系数
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          defaultValue="30"
                          className="w-full"
                          data-oid="1_hq0ej"
                        />

                        <div
                          className="flex justify-between text-indigo-300/70 text-xs"
                          data-oid="1.5n6:m"
                        >
                          <span data-oid="ukx6vbu">精确 (0.0)</span>
                          <span data-oid="tw71:7x">0.3</span>
                          <span data-oid="3r0ec5g">创意 (1.0)</span>
                        </div>
                      </div>

                      <div className="space-y-2" data-oid="nu.wlbo">
                        <label
                          className="text-indigo-100 block"
                          data-oid="hte:d.l"
                        >
                          最大令牌数
                        </label>
                        <input
                          type="number"
                          defaultValue="4096"
                          className="w-full bg-indigo-900/20 text-indigo-100 p-2 rounded-md border border-indigo-800/30"
                          data-oid="5pz5ayf"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </>
            )}

            {activeTab === "prompts" && (
              <>
                <CardTitle data-oid="dnwpqfd">提示词设置</CardTitle>
                <CardContent className="space-y-4" data-oid="knl75y7">
                  <div data-oid="paleeyq">
                    <h3
                      className="text-indigo-100 font-medium mb-2"
                      data-oid="b3ha7kn"
                    >
                      系统消息
                    </h3>
                    <textarea
                      className="w-full h-40 bg-indigo-900/20 border border-indigo-800/30 rounded-md p-3 text-indigo-100"
                      placeholder="输入该代理的系统消息..."
                      defaultValue={`你是一个专业的${agent.name}，${agent.description}`}
                      data-oid=":qgct3i"
                    ></textarea>
                  </div>
                  <div className="pt-2" data-oid="4zo7brp">
                    <Button size="sm" data-oid="gn1m:12">
                      保存系统消息
                    </Button>
                  </div>
                </CardContent>
              </>
            )}

            {activeTab === "tools" && (
              <>
                <CardTitle data-oid="0bm0t7c">工具集成</CardTitle>
                <CardContent className="space-y-4" data-oid="l1qopok">
                  <p className="text-indigo-300/70 mb-4" data-oid="e2-7r5z">
                    选择该代理可以使用的工具
                  </p>

                  <div className="space-y-3" data-oid="0_bxv1x">
                    <div
                      className="flex items-center p-3 bg-indigo-900/20 border border-indigo-800/30 rounded-md"
                      data-oid="wcoyrru"
                    >
                      <input
                        type="checkbox"
                        id="tool-1"
                        className="mr-3"
                        data-oid="v_p37j."
                      />

                      <label
                        htmlFor="tool-1"
                        className="flex-1"
                        data-oid="ut60:ws"
                      >
                        <div className="text-indigo-100" data-oid="7pcn-g2">
                          代码生成工具
                        </div>
                        <div
                          className="text-indigo-300/70 text-sm"
                          data-oid="cmofj0t"
                        >
                          生成和修改代码的工具
                        </div>
                      </label>
                    </div>

                    <div
                      className="flex items-center p-3 bg-indigo-900/20 border border-indigo-800/30 rounded-md"
                      data-oid="frkzrw4"
                    >
                      <input
                        type="checkbox"
                        id="tool-2"
                        className="mr-3"
                        checked
                        data-oid="0ygd0j8"
                      />

                      <label
                        htmlFor="tool-2"
                        className="flex-1"
                        data-oid="ddpjsqz"
                      >
                        <div className="text-indigo-100" data-oid="l4mfs-y">
                          网络搜索
                        </div>
                        <div
                          className="text-indigo-300/70 text-sm"
                          data-oid="eeseyd7"
                        >
                          允许代理搜索互联网获取信息
                        </div>
                      </label>
                    </div>

                    <div
                      className="flex items-center p-3 bg-indigo-900/20 border border-indigo-800/30 rounded-md"
                      data-oid="aholo70"
                    >
                      <input
                        type="checkbox"
                        id="tool-3"
                        className="mr-3"
                        data-oid="oqn:t2j"
                      />

                      <label
                        htmlFor="tool-3"
                        className="flex-1"
                        data-oid="73xc7.h"
                      >
                        <div className="text-indigo-100" data-oid="wg2xjh0">
                          图表生成
                        </div>
                        <div
                          className="text-indigo-300/70 text-sm"
                          data-oid="bt4elo0"
                        >
                          生成各种类型的图表
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="pt-2" data-oid="shx3_ci">
                    <Button size="sm" data-oid="9922cpk">
                      保存工具配置
                    </Button>
                  </div>
                </CardContent>
              </>
            )}

            {activeTab === "history" && (
              <>
                <CardTitle data-oid="rx3q7hq">历史记录</CardTitle>
                <CardContent className="space-y-4" data-oid="8bd7cma">
                  <div className="space-y-3" data-oid="9zg1x:q">
                    <div
                      className="p-3 bg-indigo-900/20 rounded-md"
                      data-oid="2fzbc2t"
                    >
                      <div
                        className="flex justify-between items-center mb-2"
                        data-oid="dmqkm8p"
                      >
                        <h3 className="text-indigo-100" data-oid="u-_j5ey">
                          项目规划讨论
                        </h3>
                        <span
                          className="text-indigo-300/70 text-xs"
                          data-oid="xn89eqi"
                        >
                          30分钟前
                        </span>
                      </div>
                      <p
                        className="text-indigo-300/70 text-sm"
                        data-oid="slbgjm2"
                      >
                        参与了关于新功能开发的讨论
                      </p>
                    </div>

                    <div
                      className="p-3 bg-indigo-900/20 rounded-md"
                      data-oid="6c2:h:4"
                    >
                      <div
                        className="flex justify-between items-center mb-2"
                        data-oid="ulfy:pg"
                      >
                        <h3 className="text-indigo-100" data-oid="1eyxshh">
                          需求分析
                        </h3>
                        <span
                          className="text-indigo-300/70 text-xs"
                          data-oid="1dl5923"
                        >
                          2小时前
                        </span>
                      </div>
                      <p
                        className="text-indigo-300/70 text-sm"
                        data-oid="it6_.02"
                      >
                        分析了用户需求并提供了功能建议
                      </p>
                    </div>

                    <div
                      className="p-3 bg-indigo-900/20 rounded-md"
                      data-oid="i:s6eul"
                    >
                      <div
                        className="flex justify-between items-center mb-2"
                        data-oid="vqc2o64"
                      >
                        <h3 className="text-indigo-100" data-oid="u6sz-kw">
                          原型评审
                        </h3>
                        <span
                          className="text-indigo-300/70 text-xs"
                          data-oid="3lu.09i"
                        >
                          昨天
                        </span>
                      </div>
                      <p
                        className="text-indigo-300/70 text-sm"
                        data-oid="1vt9wf."
                      >
                        评审了产品原型并提供了改进意见
                      </p>
                    </div>
                  </div>

                  <div className="text-center pt-3" data-oid="fsi9t80">
                    <button
                      className="text-indigo-400 hover:text-indigo-300 text-sm"
                      data-oid="w_gh-wj"
                    >
                      加载更多历史记录
                    </button>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </div>

        {/* 右侧状态面板 */}
        <div className="md:col-span-3" data-oid="tk1n9wf">
          <Card data-oid="su4wv:2">
            <CardTitle data-oid="eu_.bha">状态和统计</CardTitle>
            <CardContent data-oid="y58bshw">
              <div className="space-y-4" data-oid="i-0757e">
                <div data-oid="-h.q7j6">
                  <h3
                    className="text-indigo-100 font-medium mb-1"
                    data-oid="zpi1v3y"
                  >
                    当前任务
                  </h3>
                  {agent.status === TAgentStatus.IDLE ? (
                    <p data-oid="7b4:9q1">暂无任务</p>
                  ) : (
                    <div
                      className="p-2 bg-indigo-900/20 rounded"
                      data-oid="5tl5_:j"
                    >
                      <p className="text-indigo-100 text-sm" data-oid="j7e:awl">
                        正在分析项目需求
                      </p>
                      <div
                        className="w-full bg-indigo-900/30 h-1 rounded-full mt-2"
                        data-oid="_2zsko0"
                      >
                        <div
                          className="bg-blue-500 h-1 rounded-full animate-pulse"
                          style={{ width: "60%" }}
                          data-oid="r4olvag"
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div data-oid="k5m3rcq">
                  <h3
                    className="text-indigo-100 font-medium mb-1"
                    data-oid="iri:rp1"
                  >
                    使用统计
                  </h3>
                  <div
                    className="grid grid-cols-2 gap-2 text-center"
                    data-oid="ep9om-g"
                  >
                    <div
                      className="p-2 bg-indigo-900/20 rounded"
                      data-oid="kr2mnt5"
                    >
                      <p
                        className="text-2xl font-semibold text-indigo-100"
                        data-oid="dfk72t4"
                      >
                        24
                      </p>
                      <p
                        className="text-indigo-300/70 text-xs"
                        data-oid="w9.mg37"
                      >
                        完成任务
                      </p>
                    </div>
                    <div
                      className="p-2 bg-indigo-900/20 rounded"
                      data-oid="n1q2t0n"
                    >
                      <p
                        className="text-2xl font-semibold text-indigo-100"
                        data-oid="798yz-1"
                      >
                        14
                      </p>
                      <p
                        className="text-indigo-300/70 text-xs"
                        data-oid="s1ro9wr"
                      >
                        协作次数
                      </p>
                    </div>
                    <div
                      className="p-2 bg-indigo-900/20 rounded"
                      data-oid="wisc:h5"
                    >
                      <p
                        className="text-2xl font-semibold text-indigo-100"
                        data-oid="1prrwk5"
                      >
                        3.2h
                      </p>
                      <p
                        className="text-indigo-300/70 text-xs"
                        data-oid="up:sw6k"
                      >
                        平均响应
                      </p>
                    </div>
                    <div
                      className="p-2 bg-indigo-900/20 rounded"
                      data-oid=".c.bxr-"
                    >
                      <p
                        className="text-2xl font-semibold text-indigo-100"
                        data-oid="hh58gn0"
                      >
                        98%
                      </p>
                      <p
                        className="text-indigo-300/70 text-xs"
                        data-oid="3zc2hdv"
                      >
                        完成率
                      </p>
                    </div>
                  </div>
                </div>

                <div data-oid="rmczkpu">
                  <h3
                    className="text-indigo-100 font-medium mb-1"
                    data-oid="mlao556"
                  >
                    最近会话
                  </h3>
                  <div className="space-y-2" data-oid="o9bi0fl">
                    <Link
                      href="/collaboration/xyz123"
                      className="block p-2 bg-indigo-900/20 rounded text-sm hover:bg-indigo-900/30"
                      data-oid="3:59prz"
                    >
                      <p className="text-indigo-100" data-oid="o:-mw77">
                        核心功能讨论
                      </p>
                      <p
                        className="text-indigo-300/70 text-xs"
                        data-oid="c9s0dvz"
                      >
                        今天 10:30
                      </p>
                    </Link>
                    <Link
                      href="/collaboration/abc456"
                      className="block p-2 bg-indigo-900/20 rounded text-sm hover:bg-indigo-900/30"
                      data-oid="8bsdull"
                    >
                      <p className="text-indigo-100" data-oid="bvz_p9h">
                        项目启动会议
                      </p>
                      <p
                        className="text-indigo-300/70 text-xs"
                        data-oid="n:r3x87"
                      >
                        昨天 14:15
                      </p>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
