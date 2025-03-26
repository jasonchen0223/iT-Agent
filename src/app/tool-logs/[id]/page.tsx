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
      <Badge className="bg-green-500" data-oid="aektlpy">
        <CheckCircle className="w-3 h-3 mr-1" data-oid="gi5djh8" />
        成功
      </Badge>
    );
  } else {
    return (
      <Badge className="bg-red-500" data-oid="a401fz8">
        <AlertCircle className="w-3 h-3 mr-1" data-oid="0:.q5kp" />
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
    <div className="space-y-2" data-oid="2zih2:q">
      <h3 className="text-lg font-medium text-gray-300" data-oid="6lz913t">
        {title}
      </h3>
      <div
        className="bg-gray-900 rounded-lg p-4 overflow-x-auto border border-gray-800"
        data-oid="paj3tc6"
      >
        <pre
          className="text-sm text-gray-300 font-mono whitespace-pre-wrap"
          data-oid="9azxh9f"
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
      <div className="container mx-auto px-4 py-8 max-w-5xl" data-oid="_8v_xs1">
        {/* 返回按钮 */}
        <Link
          href="/tool-logs"
          className="inline-flex items-center text-blue-400 hover:text-blue-500 mb-6"
          data-oid="yjruf8m"
        >
          <ArrowLeft className="w-4 h-4 mr-2" data-oid="0w:w2nv" />
          返回日志列表
        </Link>

        {/* 标题区域 */}
        <div
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
          data-oid="q0s3o7f"
        >
          <h1
            className="text-2xl font-bold mb-2 md:mb-0 text-blue-400"
            data-oid="jcws1ij"
          >
            工具调用详情
          </h1>
          <StatusBadge status={log.status} data-oid="xiqq5uo" />
        </div>

        {/* 主要信息卡片 */}
        <div
          className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700"
          data-oid="buf27jx"
        >
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-6"
            data-oid="ys-psmh"
          >
            <div data-oid="wp5-f6t">
              <span className="text-gray-400" data-oid="zh3gzpv">
                工具ID:
              </span>
              <span className="ml-2 font-medium" data-oid="9ym6sfy">
                {log.toolId}
              </span>
            </div>

            <div data-oid=":g.v0w1">
              <span className="text-gray-400" data-oid="_duhvwm">
                日志ID:
              </span>
              <span className="ml-2 font-mono text-sm" data-oid="1d0b6nl">
                {log.id}
              </span>
            </div>

            <div data-oid="d5wrq56">
              <span className="text-gray-400" data-oid="ayw8maz">
                会话ID:
              </span>
              <span className="ml-2 font-mono text-sm" data-oid="bmipsbl">
                {log.sessionId}
              </span>
            </div>

            <div data-oid="p73yrp5">
              <span className="text-gray-400" data-oid="spk_r03">
                代理ID:
              </span>
              <span className="ml-2 font-mono text-sm" data-oid="nojg8nc">
                {log.agentId}
              </span>
            </div>

            <div className="flex items-center" data-oid="qx_3ujo">
              <span className="text-gray-400" data-oid="dhbisfx">
                开始时间:
              </span>
              <span className="ml-2 flex items-center" data-oid=".m82:4v">
                <Clock
                  className="w-3 h-3 mr-1 text-gray-500"
                  data-oid=":77p272"
                />

                {formatDate(log.startTime)}
              </span>
            </div>

            <div className="flex items-center" data-oid="6:7qxr9">
              <span className="text-gray-400" data-oid="u18sosz">
                结束时间:
              </span>
              <span className="ml-2 flex items-center" data-oid="mm2wil7">
                <Clock
                  className="w-3 h-3 mr-1 text-gray-500"
                  data-oid="e489:tz"
                />

                {formatDate(log.endTime)}
              </span>
            </div>

            <div className="flex items-center" data-oid="sa642js">
              <span className="text-gray-400" data-oid="4r_ctvs">
                执行时间:
              </span>
              <span className="ml-2" data-oid="2nh-w48">
                {log.executionTime}ms ({executionDuration})
              </span>
            </div>
          </div>
        </div>

        {/* 参数和结果 */}
        <div className="space-y-8" data-oid="462.gxc">
          {/* 参数 */}
          <CodeBlock title="调用参数" content={log.params} data-oid="2j8xbvx" />

          {/* 结果或错误 */}
          {log.status === "success" ? (
            <CodeBlock
              title="调用结果"
              content={log.result}
              data-oid=":2o2m.q"
            />
          ) : (
            <div className="space-y-2" data-oid="x8ze6xf">
              <h3
                className="text-lg font-medium text-red-400"
                data-oid="zlyjfri"
              >
                错误信息
              </h3>
              <div
                className="bg-red-900/20 rounded-lg p-4 border border-red-800"
                data-oid="f1jf_i5"
              >
                <div className="flex items-start" data-oid="gwll_zx">
                  <AlertCircle
                    className="w-5 h-5 mr-2 text-red-500 mt-0.5"
                    data-oid="zsqn0om"
                  />

                  <p className="text-red-300" data-oid="ch0xjaj">
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
