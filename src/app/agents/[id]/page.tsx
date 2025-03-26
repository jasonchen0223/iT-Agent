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
      <div className="container mx-auto py-8 text-center" data-oid="50igztf">
        <p className="text-indigo-100" data-oid="hkalk:y">
          加载中...
        </p>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="container mx-auto py-8" data-oid="s1-l85u">
        <Card data-oid="tchswq0">
          <CardTitle data-oid="x8ep5ij">找不到代理</CardTitle>
          <CardContent data-oid="g5d3fuj">
            <p className="mb-4" data-oid=".vpkmtz">
              无法找到ID为 {params.id} 的代理。
            </p>
            <Button onClick={() => router.push("/agents")} data-oid="-e9x2s_">
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
    <div className="container mx-auto py-8" data-oid="euu:v9e">
      {/* 代理信息栏 */}
      <div
        className="mb-6 border-b border-indigo-800/30 pb-6"
        data-oid="4g6zfur"
      >
        <div className="flex items-center" data-oid="psjhc_x">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mr-4 text-white font-semibold text-xl"
            style={{ backgroundColor: agent.color }}
            data-oid="pe031yv"
          >
            {getInitials(agent.name)}
          </div>
          <div data-oid=".0b4egt">
            <h1
              className="text-2xl font-bold text-indigo-100"
              data-oid="l-jn_:w"
            >
              {agent.name}
            </h1>
            <div className="flex items-center mt-1" data-oid="k6gqpj8">
              <span
                className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(agent.status)}`}
                data-oid="rfdf-t9"
              >
                {statusText[agent.status]}
              </span>
              <span className="mx-2 text-indigo-300/50" data-oid="f1s4:aj">
                •
              </span>
              <span className="text-indigo-300/70" data-oid="v_gifq.">
                {roleText[agent.role]}
              </span>
            </div>
          </div>
          <div className="ml-auto flex gap-2" data-oid=".0b5j1o">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/agents/${agent.id}/edit`)}
              data-oid=".:zxtrd"
            >
              编辑
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                router.push(`/collaboration/new?agent=${agent.id}`)
              }
              data-oid="2vevc4g"
            >
              开始会话
            </Button>
          </div>
        </div>
      </div>

      {/* 页面内容 */}
      <div
        className="grid grid-cols-1 md:grid-cols-12 gap-6"
        data-oid="dcrc6e_"
      >
        {/* 左侧导航 */}
        <div className="md:col-span-2" data-oid="3tv0d6c">
          <Card className="p-0 overflow-hidden" data-oid="vqdt5c1">
            <nav data-oid="d8n0z00">
              <button
                onClick={() => setActiveTab("info")}
                className={`w-full text-left px-4 py-3 ${
                  activeTab === "info"
                    ? "bg-indigo-700/30 text-white"
                    : "text-indigo-300 hover:bg-indigo-700/20"
                }`}
                data-oid="07dqat5"
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
                data-oid="of:kl:."
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
                data-oid="2lmzfmn"
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
                data-oid="n16jpw."
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
                data-oid="cmknkul"
              >
                历史记录
              </button>
            </nav>
          </Card>
        </div>

        {/* 中央详情区 */}
        <div className="md:col-span-7" data-oid="32k8m6:">
          <Card data-oid="zz5.e0p">
            {activeTab === "info" && (
              <>
                <CardTitle data-oid="sj.2pl8">基本信息</CardTitle>
                <CardContent className="space-y-4" data-oid="i4pgwbp">
                  <div data-oid="zuuq3ph">
                    <h3
                      className="text-indigo-100 font-medium mb-1"
                      data-oid=".t4tyhl"
                    >
                      描述
                    </h3>
                    <p data-oid=":g7lnrj">{agent.description}</p>
                  </div>
                  <div data-oid="c_9dirk">
                    <h3
                      className="text-indigo-100 font-medium mb-1"
                      data-oid="c8ywdg1"
                    >
                      角色
                    </h3>
                    <p data-oid="21yu2ch">{roleText[agent.role]}</p>
                  </div>
                  <div data-oid="1c:eca3">
                    <h3
                      className="text-indigo-100 font-medium mb-1"
                      data-oid="hdkm8xd"
                    >
                      状态
                    </h3>
                    <div className="flex items-center" data-oid="4pcy4z8">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(agent.status)}`}
                        data-oid="uu176gi"
                      >
                        {statusText[agent.status]}
                      </span>
                    </div>
                  </div>
                  <div data-oid="kj7zs.1">
                    <h3
                      className="text-indigo-100 font-medium mb-1"
                      data-oid="btxu9-2"
                    >
                      ID
                    </h3>
                    <p className="font-mono" data-oid="l14ozzl">
                      {agent.id}
                    </p>
                  </div>
                </CardContent>
              </>
            )}

            {activeTab === "capabilities" && (
              <>
                <CardTitle data-oid="8-twhg4">能力配置</CardTitle>
                <CardContent className="space-y-6" data-oid="_5:y9fe">
                  <div data-oid="bi4d.8_">
                    <h3
                      className="text-indigo-100 font-medium mb-3"
                      data-oid="06xdjqp"
                    >
                      专长领域
                    </h3>
                    <div className="flex flex-wrap gap-2" data-oid="pr.0cir">
                      {agent.capability.map((cap: string) => (
                        <span
                          key={cap}
                          className="px-3 py-1 bg-indigo-900/30 text-indigo-300 text-sm rounded-full"
                          data-oid="571n-un"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div data-oid="ml3vghy">
                    <h3
                      className="text-indigo-100 font-medium mb-3"
                      data-oid="vsow:q8"
                    >
                      能力评分
                    </h3>
                    <div
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      data-oid="siikrut"
                    >
                      {agent.capability.map((cap: string, index: number) => (
                        <div
                          key={index}
                          className="p-4 bg-indigo-900/20 rounded-md"
                          data-oid="koq8uz7"
                        >
                          <h4
                            className="text-indigo-100 mb-2"
                            data-oid="ob0fjxe"
                          >
                            {cap}
                          </h4>
                          <div
                            className="w-full bg-indigo-900/30 h-3 rounded-full"
                            data-oid="a_u:s9r"
                          >
                            <div
                              className="h-3 rounded-full"
                              style={{
                                width: `${70 + Math.floor(Math.random() * 30)}%`,
                                backgroundColor: agent.color,
                              }}
                              data-oid="t.y:gvm"
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div data-oid="bezar8e">
                    <h3
                      className="text-indigo-100 font-medium mb-3"
                      data-oid="_2bq9:3"
                    >
                      参数设置
                    </h3>
                    <div className="space-y-4" data-oid="1n6d.4b">
                      <div className="space-y-2" data-oid="sa9_zzw">
                        <label
                          className="text-indigo-100 block"
                          data-oid="mdj22q4"
                        >
                          温度系数
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          defaultValue="30"
                          className="w-full"
                          data-oid="ct64bht"
                        />

                        <div
                          className="flex justify-between text-indigo-300/70 text-xs"
                          data-oid="smk55ej"
                        >
                          <span data-oid="o994rl.">精确 (0.0)</span>
                          <span data-oid="j3stv31">0.3</span>
                          <span data-oid="4o-o4ae">创意 (1.0)</span>
                        </div>
                      </div>

                      <div className="space-y-2" data-oid="3vo96c4">
                        <label
                          className="text-indigo-100 block"
                          data-oid="1ef7i5d"
                        >
                          最大令牌数
                        </label>
                        <input
                          type="number"
                          defaultValue="4096"
                          className="w-full bg-indigo-900/20 text-indigo-100 p-2 rounded-md border border-indigo-800/30"
                          data-oid="gbocsyk"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </>
            )}

            {activeTab === "prompts" && (
              <>
                <CardTitle data-oid="9w:nvz9">提示词设置</CardTitle>
                <CardContent className="space-y-4" data-oid="z:8.e6s">
                  <div data-oid="l:71ujw">
                    <h3
                      className="text-indigo-100 font-medium mb-2"
                      data-oid="22o1z22"
                    >
                      系统消息
                    </h3>
                    <textarea
                      className="w-full h-40 bg-indigo-900/20 border border-indigo-800/30 rounded-md p-3 text-indigo-100"
                      placeholder="输入该代理的系统消息..."
                      defaultValue={`你是一个专业的${agent.name}，${agent.description}`}
                      data-oid="4.i:a-6"
                    ></textarea>
                  </div>
                  <div className="pt-2" data-oid="z-bbo2p">
                    <Button size="sm" data-oid="orqwwy2">
                      保存系统消息
                    </Button>
                  </div>
                </CardContent>
              </>
            )}

            {activeTab === "tools" && (
              <>
                <CardTitle data-oid="qxa:389">工具集成</CardTitle>
                <CardContent className="space-y-4" data-oid="lrmoyxp">
                  <p className="text-indigo-300/70 mb-4" data-oid="gtbwbp1">
                    选择该代理可以使用的工具
                  </p>

                  <div className="space-y-3" data-oid="cwvc-by">
                    <div
                      className="flex items-center p-3 bg-indigo-900/20 border border-indigo-800/30 rounded-md"
                      data-oid="fccey.f"
                    >
                      <input
                        type="checkbox"
                        id="tool-1"
                        className="mr-3"
                        data-oid="e.zu57:"
                      />

                      <label
                        htmlFor="tool-1"
                        className="flex-1"
                        data-oid="hzz394q"
                      >
                        <div className="text-indigo-100" data-oid="hu02-95">
                          代码生成工具
                        </div>
                        <div
                          className="text-indigo-300/70 text-sm"
                          data-oid="liwx3mn"
                        >
                          生成和修改代码的工具
                        </div>
                      </label>
                    </div>

                    <div
                      className="flex items-center p-3 bg-indigo-900/20 border border-indigo-800/30 rounded-md"
                      data-oid="b-9_j3-"
                    >
                      <input
                        type="checkbox"
                        id="tool-2"
                        className="mr-3"
                        checked
                        data-oid="msdoy1p"
                      />

                      <label
                        htmlFor="tool-2"
                        className="flex-1"
                        data-oid="wezf0md"
                      >
                        <div className="text-indigo-100" data-oid="pnt:8gu">
                          网络搜索
                        </div>
                        <div
                          className="text-indigo-300/70 text-sm"
                          data-oid="m83tyjn"
                        >
                          允许代理搜索互联网获取信息
                        </div>
                      </label>
                    </div>

                    <div
                      className="flex items-center p-3 bg-indigo-900/20 border border-indigo-800/30 rounded-md"
                      data-oid="6:6.yak"
                    >
                      <input
                        type="checkbox"
                        id="tool-3"
                        className="mr-3"
                        data-oid="ym94tic"
                      />

                      <label
                        htmlFor="tool-3"
                        className="flex-1"
                        data-oid="_ky:ij5"
                      >
                        <div className="text-indigo-100" data-oid="xl9oorm">
                          图表生成
                        </div>
                        <div
                          className="text-indigo-300/70 text-sm"
                          data-oid="lhgog1o"
                        >
                          生成各种类型的图表
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="pt-2" data-oid=":1ias0m">
                    <Button size="sm" data-oid="t3dc84l">
                      保存工具配置
                    </Button>
                  </div>
                </CardContent>
              </>
            )}

            {activeTab === "history" && (
              <>
                <CardTitle data-oid="ahkw49.">历史记录</CardTitle>
                <CardContent className="space-y-4" data-oid="20oh4m.">
                  <div className="space-y-3" data-oid="mgp46wt">
                    <div
                      className="p-3 bg-indigo-900/20 rounded-md"
                      data-oid="qf02yma"
                    >
                      <div
                        className="flex justify-between items-center mb-2"
                        data-oid="57i5x3t"
                      >
                        <h3 className="text-indigo-100" data-oid="8hca888">
                          项目规划讨论
                        </h3>
                        <span
                          className="text-indigo-300/70 text-xs"
                          data-oid="kfv18al"
                        >
                          30分钟前
                        </span>
                      </div>
                      <p
                        className="text-indigo-300/70 text-sm"
                        data-oid="38gkaa2"
                      >
                        参与了关于新功能开发的讨论
                      </p>
                    </div>

                    <div
                      className="p-3 bg-indigo-900/20 rounded-md"
                      data-oid="e47yhyn"
                    >
                      <div
                        className="flex justify-between items-center mb-2"
                        data-oid="1nrs5km"
                      >
                        <h3 className="text-indigo-100" data-oid="7fgbm8w">
                          需求分析
                        </h3>
                        <span
                          className="text-indigo-300/70 text-xs"
                          data-oid="s7v_z9q"
                        >
                          2小时前
                        </span>
                      </div>
                      <p
                        className="text-indigo-300/70 text-sm"
                        data-oid="0pfj403"
                      >
                        分析了用户需求并提供了功能建议
                      </p>
                    </div>

                    <div
                      className="p-3 bg-indigo-900/20 rounded-md"
                      data-oid="s_:m3fp"
                    >
                      <div
                        className="flex justify-between items-center mb-2"
                        data-oid="stm9l4o"
                      >
                        <h3 className="text-indigo-100" data-oid="kml6wsb">
                          原型评审
                        </h3>
                        <span
                          className="text-indigo-300/70 text-xs"
                          data-oid="s11f7qz"
                        >
                          昨天
                        </span>
                      </div>
                      <p
                        className="text-indigo-300/70 text-sm"
                        data-oid=".u1dr9n"
                      >
                        评审了产品原型并提供了改进意见
                      </p>
                    </div>
                  </div>

                  <div className="text-center pt-3" data-oid="-jgp5sw">
                    <button
                      className="text-indigo-400 hover:text-indigo-300 text-sm"
                      data-oid="cf2-qmq"
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
        <div className="md:col-span-3" data-oid="2fccyrh">
          <Card data-oid="ints:4y">
            <CardTitle data-oid="hogzoxt">状态和统计</CardTitle>
            <CardContent data-oid="_lr0i1j">
              <div className="space-y-4" data-oid="_i8hvxx">
                <div data-oid="zq9ph9h">
                  <h3
                    className="text-indigo-100 font-medium mb-1"
                    data-oid="b4rm_as"
                  >
                    当前任务
                  </h3>
                  {agent.status === TAgentStatus.IDLE ? (
                    <p data-oid="nderb.4">暂无任务</p>
                  ) : (
                    <div
                      className="p-2 bg-indigo-900/20 rounded"
                      data-oid="r6xjrik"
                    >
                      <p className="text-indigo-100 text-sm" data-oid="_oaopzn">
                        正在分析项目需求
                      </p>
                      <div
                        className="w-full bg-indigo-900/30 h-1 rounded-full mt-2"
                        data-oid="4vfhzxl"
                      >
                        <div
                          className="bg-blue-500 h-1 rounded-full animate-pulse"
                          style={{ width: "60%" }}
                          data-oid="a-cmyz8"
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div data-oid="ded7eic">
                  <h3
                    className="text-indigo-100 font-medium mb-1"
                    data-oid="t2paea-"
                  >
                    使用统计
                  </h3>
                  <div
                    className="grid grid-cols-2 gap-2 text-center"
                    data-oid="uqg:a6d"
                  >
                    <div
                      className="p-2 bg-indigo-900/20 rounded"
                      data-oid="6loyx_p"
                    >
                      <p
                        className="text-2xl font-semibold text-indigo-100"
                        data-oid="wkwymls"
                      >
                        24
                      </p>
                      <p
                        className="text-indigo-300/70 text-xs"
                        data-oid="fe.erse"
                      >
                        完成任务
                      </p>
                    </div>
                    <div
                      className="p-2 bg-indigo-900/20 rounded"
                      data-oid=":s-2rdb"
                    >
                      <p
                        className="text-2xl font-semibold text-indigo-100"
                        data-oid="f7bz024"
                      >
                        14
                      </p>
                      <p
                        className="text-indigo-300/70 text-xs"
                        data-oid="0mom7x:"
                      >
                        协作次数
                      </p>
                    </div>
                    <div
                      className="p-2 bg-indigo-900/20 rounded"
                      data-oid="oikvrjg"
                    >
                      <p
                        className="text-2xl font-semibold text-indigo-100"
                        data-oid="xraawmy"
                      >
                        3.2h
                      </p>
                      <p
                        className="text-indigo-300/70 text-xs"
                        data-oid="5qib-q9"
                      >
                        平均响应
                      </p>
                    </div>
                    <div
                      className="p-2 bg-indigo-900/20 rounded"
                      data-oid="8runrgw"
                    >
                      <p
                        className="text-2xl font-semibold text-indigo-100"
                        data-oid="1x78w2i"
                      >
                        98%
                      </p>
                      <p
                        className="text-indigo-300/70 text-xs"
                        data-oid="ay8pe.1"
                      >
                        完成率
                      </p>
                    </div>
                  </div>
                </div>

                <div data-oid="cdrslgv">
                  <h3
                    className="text-indigo-100 font-medium mb-1"
                    data-oid="0qa.zrt"
                  >
                    最近会话
                  </h3>
                  <div className="space-y-2" data-oid="w7yokj9">
                    <Link
                      href="/collaboration/xyz123"
                      className="block p-2 bg-indigo-900/20 rounded text-sm hover:bg-indigo-900/30"
                      data-oid="_ojno:l"
                    >
                      <p className="text-indigo-100" data-oid="yx47ig3">
                        核心功能讨论
                      </p>
                      <p
                        className="text-indigo-300/70 text-xs"
                        data-oid="1z7rh7k"
                      >
                        今天 10:30
                      </p>
                    </Link>
                    <Link
                      href="/collaboration/abc456"
                      className="block p-2 bg-indigo-900/20 rounded text-sm hover:bg-indigo-900/30"
                      data-oid="-bq1xus"
                    >
                      <p className="text-indigo-100" data-oid="-ggqnom">
                        项目启动会议
                      </p>
                      <p
                        className="text-indigo-300/70 text-xs"
                        data-oid="0lr_79i"
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
