"use client";

/**
 * 工具调用日志列表组件
 *
 * 展示工具调用日志列表，支持分页和状态指示
 */
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { IToolCallLog } from "@/services/tool-log-service";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Clock, AlertCircle, CheckCircle } from "lucide-react";

/**
 * 工具调用日志列表属性接口
 */
interface IToolLogListProps {
  /**
   * 初始日志数据
   */
  initialLogs?: IToolCallLog[];
}

/**
 * 工具调用日志列表组件
 *
 * @param props 组件属性
 * @returns 组件渲染结果
 */
export default function ToolLogList({ initialLogs }: IToolLogListProps) {
  // 状态定义
  const [logs, setLogs] = useState<IToolCallLog[]>(initialLogs || []);
  const [loading, setLoading] = useState<boolean>(!initialLogs);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // 获取URL参数
  const searchParams = useSearchParams();

  // 每页日志数量
  const PAGE_SIZE = 10;

  // 获取日志数据
  useEffect(() => {
    if (initialLogs) return;

    async function fetchLogs() {
      setLoading(true);
      setError(null);

      try {
        // 构建API URL
        let url = "/api/tool-logs?";

        // 添加过滤参数
        const toolId = searchParams.get("toolId");
        if (toolId) url += `toolId=${toolId}&`;

        const sessionId = searchParams.get("sessionId");
        if (sessionId) url += `sessionId=${sessionId}&`;

        const agentId = searchParams.get("agentId");
        if (agentId) url += `agentId=${agentId}&`;

        const status = searchParams.get("status");
        if (status) url += `status=${status}&`;

        const startDate = searchParams.get("startDate");
        if (startDate) url += `startTime=${startDate}&`;

        const endDate = searchParams.get("endDate");
        if (endDate) url += `endTime=${endDate}&`;

        // 添加最近日志参数
        const recent = searchParams.get("recent");
        if (recent) url += `recent=${recent}&`;

        // 获取日志数据
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("获取日志数据失败");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "获取日志数据失败");
        }

        setLogs(data.data || []);
        setTotalPages(Math.ceil((data.data?.length || 0) / PAGE_SIZE));
      } catch (err) {
        setError(err instanceof Error ? err.message : "获取日志数据失败");
        console.error("获取日志数据失败:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, [searchParams, initialLogs]);

  // 获取当前页的日志
  const currentPageLogs = logs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // 格式化日期
  const formatDate = (date: Date): string => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: zhCN,
    });
  };

  // 翻页处理
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // 渲染状态徽章
  const renderStatusBadge = (status: "success" | "error") => {
    if (status === "success") {
      return (
        <Badge className="bg-green-500">
          <CheckCircle className="w-3 h-3 mr-1" />
          成功
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-500">
          <AlertCircle className="w-3 h-3 mr-1" />
          失败
        </Badge>
      );
    }
  };

  // 渲染内容
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">加载失败！</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-800 rounded-lg">
        <p className="text-gray-400">暂无工具调用日志</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 日志列表 */}
      <div className="space-y-3">
        {currentPageLogs.map((log) => (
          <Link
            href={`/tool-logs/${log.id}`}
            key={log.id}
            className="block hover:bg-gray-800 rounded-lg p-4 border border-gray-700 transition duration-300"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="font-semibold text-lg">{log.toolId}</div>
              {renderStatusBadge(log.status)}
            </div>

            <div className="flex text-sm text-gray-400 space-x-4 mb-2">
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatDate(log.startTime)}
              </span>
              <span>执行时间: {log.executionTime}ms</span>
            </div>

            <div className="grid grid-cols-12 gap-2 text-sm mb-2">
              <div className="col-span-3 md:col-span-2 text-gray-500">
                会话ID:
              </div>
              <div className="col-span-9 md:col-span-10 truncate">
                {log.sessionId}
              </div>

              <div className="col-span-3 md:col-span-2 text-gray-500">
                代理ID:
              </div>
              <div className="col-span-9 md:col-span-10 truncate">
                {log.agentId}
              </div>
            </div>

            <div className="flex justify-between items-center mt-2">
              <div className="text-xs text-gray-500">
                {log.error
                  ? `错误: ${log.error.substring(0, 50)}...`
                  : "执行成功"}
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </div>
          </Link>
        ))}
      </div>

      {/* 分页控制 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
          >
            上一页
          </button>

          <span className="text-gray-400">
            第 {page} 页 / 共 {totalPages} 页
          </span>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}
