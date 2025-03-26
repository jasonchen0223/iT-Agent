/**
 * 工具调用日志详情页面
 *
 * 显示单个工具调用日志的详细信息
 */
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Terminal,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IToolCallLog } from "@/services/tool-log-service";
import { formatDistance } from "date-fns";
import { zhCN } from "date-fns/locale";

/**
 * 格式化日期
 *
 * @param date 日期对象
 * @returns 格式化后的日期字符串
 */
function formatDate(date: Date): string {
  const d = new Date(date);
  return d.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/**
 * 获取工具调用日志详情
 *
 * @param id 日志ID
 * @returns 日志详情
 */
async function getToolLogDetails(id: string): Promise<IToolCallLog> {
  try {
    // 在服务器端获取日志详情
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/tool-logs/${id}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error("获取日志详情失败");
    }

    const data = await response.json();

    if (!data.success || !data.data) {
      throw new Error(data.error || "获取日志详情失败");
    }

    return data.data;
  } catch (error) {
    console.error("获取日志详情失败:", error);
    throw error;
  }
}

/**
 * 渲染状态徽章
 *
 * @param status 调用状态
 * @returns 徽章组件
 */
function StatusBadge({ status }: { status: "success" | "error" }) {
  if (status === "success") {
    return (
      <Badge className="bg-green-500" data-oid="kh3985b">
        <CheckCircle className="w-3 h-3 mr-1" data-oid="6lt-a-y" />
        成功
      </Badge>
    );
  } else {
    return (
      <Badge className="bg-red-500" data-oid="_ezvkej">
        <AlertCircle className="w-3 h-3 mr-1" data-oid="-oc.kvm" />
        失败
      </Badge>
    );
  }
}

/**
 * 代码区块组件
 *
 * @param props 组件属性
 * @returns 组件渲染结果
 */
function CodeBlock({ title, content }: { title: string; content: any }) {
  const jsonContent =
    typeof content === "object" ? JSON.stringify(content, null, 2) : content;

  return (
    <div className="space-y-2" data-oid="hkf9im7">
      <h3 className="text-lg font-medium text-gray-300" data-oid="rej.6j_">
        {title}
      </h3>
      <div
        className="bg-gray-900 rounded-lg p-4 overflow-x-auto border border-gray-800"
        data-oid="1oteblv"
      >
        <pre
          className="text-sm text-gray-300 font-mono whitespace-pre-wrap"
          data-oid="3dppro-"
        >
          {jsonContent}
        </pre>
      </div>
    </div>
  );
}

/**
 * 工具调用日志详情页面组件
 *
 * @param props 组件属性
 * @returns 组件渲染结果
 */
export default async function ToolLogDetail({
  params,
}: {
  params: { id: string };
}) {
  try {
    const log = await getToolLogDetails(params.id);

    const executionDuration = formatDistance(
      new Date(log.endTime),
      new Date(log.startTime),
      { locale: zhCN, includeSeconds: true },
    );

    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl" data-oid="_pn5.8o">
        {/* 返回按钮 */}
        <Link
          href="/tool-logs"
          className="inline-flex items-center text-blue-400 hover:text-blue-500 mb-6"
          data-oid="w2x4-cc"
        >
          <ArrowLeft className="w-4 h-4 mr-2" data-oid="3v:8mar" />
          返回日志列表
        </Link>

        {/* 标题区域 */}
        <div
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
          data-oid="e5pi4u:"
        >
          <h1
            className="text-2xl font-bold mb-2 md:mb-0 text-blue-400"
            data-oid="7iuzn44"
          >
            工具调用详情
          </h1>
          <StatusBadge status={log.status} data-oid="ekyz953" />
        </div>

        {/* 主要信息卡片 */}
        <div
          className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700"
          data-oid=".0ielq5"
        >
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-6"
            data-oid="i758.ph"
          >
            <div data-oid="-xxwmka">
              <span className="text-gray-400" data-oid="3wn43d1">
                工具ID:
              </span>
              <span className="ml-2 font-medium" data-oid="_w5w0h8">
                {log.toolId}
              </span>
            </div>

            <div data-oid=":d079ep">
              <span className="text-gray-400" data-oid="f9a34is">
                日志ID:
              </span>
              <span className="ml-2 font-mono text-sm" data-oid="j98b0tk">
                {log.id}
              </span>
            </div>

            <div data-oid="rhd--6o">
              <span className="text-gray-400" data-oid="u5sr1xs">
                会话ID:
              </span>
              <span className="ml-2 font-mono text-sm" data-oid="z2u:l-.">
                {log.sessionId}
              </span>
            </div>

            <div data-oid="23yqp:h">
              <span className="text-gray-400" data-oid="z.skm0c">
                代理ID:
              </span>
              <span className="ml-2 font-mono text-sm" data-oid="5m2hevb">
                {log.agentId}
              </span>
            </div>

            <div className="flex items-center" data-oid="i-p4yc.">
              <span className="text-gray-400" data-oid="97rw5km">
                开始时间:
              </span>
              <span className="ml-2 flex items-center" data-oid="_5teflr">
                <Clock
                  className="w-3 h-3 mr-1 text-gray-500"
                  data-oid="129c6:w"
                />

                {formatDate(log.startTime)}
              </span>
            </div>

            <div className="flex items-center" data-oid="6y8.ww2">
              <span className="text-gray-400" data-oid="7cx_wdc">
                结束时间:
              </span>
              <span className="ml-2 flex items-center" data-oid=".3vsicu">
                <Clock
                  className="w-3 h-3 mr-1 text-gray-500"
                  data-oid="nmkf9n9"
                />

                {formatDate(log.endTime)}
              </span>
            </div>

            <div className="flex items-center" data-oid="vn7x9ec">
              <span className="text-gray-400" data-oid="0-y4wmr">
                执行时间:
              </span>
              <span className="ml-2" data-oid="pdrmse8">
                {log.executionTime}ms ({executionDuration})
              </span>
            </div>
          </div>
        </div>

        {/* 参数和结果 */}
        <div className="space-y-8" data-oid="02vj-.q">
          {/* 参数 */}
          <CodeBlock title="调用参数" content={log.params} data-oid="cd5:nap" />

          {/* 结果或错误 */}
          {log.status === "success" ? (
            <CodeBlock
              title="调用结果"
              content={log.result}
              data-oid="buctpn6"
            />
          ) : (
            <div className="space-y-2" data-oid="aqcg00d">
              <h3
                className="text-lg font-medium text-red-400"
                data-oid="hvhhe99"
              >
                错误信息
              </h3>
              <div
                className="bg-red-900/20 rounded-lg p-4 border border-red-800"
                data-oid="_b_jrp."
              >
                <div className="flex items-start" data-oid="0:1xbl7">
                  <AlertCircle
                    className="w-5 h-5 mr-2 text-red-500 mt-0.5"
                    data-oid="ynxvth6"
                  />

                  <p className="text-red-300" data-oid="-dgc4ar">
                    {log.error}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("加载日志详情失败:", error);
    notFound();
  }
}
