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
        <Badge className="bg-green-500" data-oid="adb9t3r">
          <CheckCircle className="w-3 h-3 mr-1" data-oid=":sjzeu:" />
          成功
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-500" data-oid="c-9jqh1">
          <AlertCircle className="w-3 h-3 mr-1" data-oid="yvdq8-w" />
          失败
        </Badge>
      );
    }
  };

  // 渲染内容
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64" data-oid="y7lfce_">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
          data-oid="8suyp4."
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
        data-oid="iscm0_k"
      >
        <strong className="font-bold" data-oid=":gt7pr.">
          加载失败！
        </strong>
        <span className="block sm:inline" data-oid="ikfpi3n">
          {" "}
          {error}
        </span>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div
        className="text-center py-12 bg-gray-800 rounded-lg"
        data-oid="p0t2xul"
      >
        <p className="text-gray-400" data-oid="apcx4dk">
          暂无工具调用日志
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-oid="zh8lzn4">
      {/* 日志列表 */}
      <div className="space-y-3" data-oid="_xic3_l">
        {currentPageLogs.map((log) => (
          <Link
            href={`/tool-logs/${log.id}`}
            key={log.id}
            className="block hover:bg-gray-800 rounded-lg p-4 border border-gray-700 transition duration-300"
            data-oid="hr17ajv"
          >
            <div
              className="flex justify-between items-start mb-2"
              data-oid="dx-jtta"
            >
              <div className="font-semibold text-lg" data-oid="6wv3prp">
                {log.toolId}
              </div>
              {renderStatusBadge(log.status)}
            </div>

            <div
              className="flex text-sm text-gray-400 space-x-4 mb-2"
              data-oid="m95.8er"
            >
              <span className="flex items-center" data-oid="nlv_afm">
                <Clock className="w-3 h-3 mr-1" data-oid="qx18672" />
                {formatDate(log.startTime)}
              </span>
              <span data-oid="ahedlnm">执行时间: {log.executionTime}ms</span>
            </div>

            <div
              className="grid grid-cols-12 gap-2 text-sm mb-2"
              data-oid="v:o8m4p"
            >
              <div
                className="col-span-3 md:col-span-2 text-gray-500"
                data-oid="osm-_08"
              >
                会话ID:
              </div>
              <div
                className="col-span-9 md:col-span-10 truncate"
                data-oid="566biry"
              >
                {log.sessionId}
              </div>

              <div
                className="col-span-3 md:col-span-2 text-gray-500"
                data-oid="2z6.n7q"
              >
                代理ID:
              </div>
              <div
                className="col-span-9 md:col-span-10 truncate"
                data-oid="hpuiv82"
              >
                {log.agentId}
              </div>
            </div>

            <div
              className="flex justify-between items-center mt-2"
              data-oid="lo_sbq5"
            >
              <div className="text-xs text-gray-500" data-oid="jhl746w">
                {log.error
                  ? `错误: ${log.error.substring(0, 50)}...`
                  : "执行成功"}
              </div>
              <ChevronRight
                className="w-5 h-5 text-gray-500"
                data-oid="hriouxv"
              />
            </div>
          </Link>
        ))}
      </div>

      {/* 分页控制 */}
      {totalPages > 1 && (
        <div
          className="flex justify-center items-center space-x-2 mt-6"
          data-oid="dvehktx"
        >
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
            data-oid="tl8ovun"
          >
            上一页
          </button>

          <span className="text-gray-400" data-oid="2xnl309">
            第 {page} 页 / 共 {totalPages} 页
          </span>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50"
            data-oid="16e-pgf"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}
