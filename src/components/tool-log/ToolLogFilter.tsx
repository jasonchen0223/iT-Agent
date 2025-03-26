"use client";

/**
 * 工具调用日志过滤组件
 *
 * 提供过滤工具调用日志的表单
 */
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toolService } from "@/services/tool-service";
import { ITool } from "@/types/tool";

/**
 * 工具调用日志过滤组件
 *
 * @returns 组件渲染结果
 */
export default function ToolLogFilter() {
  // 获取路由和查询参数
  const router = useRouter();
  const searchParams = useSearchParams();

  // 状态定义
  const [toolId, setToolId] = useState(searchParams.get("toolId") || "");
  const [sessionId, setSessionId] = useState(
    searchParams.get("sessionId") || "",
  );
  const [agentId, setAgentId] = useState(searchParams.get("agentId") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [startDate, setStartDate] = useState(
    searchParams.get("startDate") || "",
  );
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");
  const [onlyRecent, setOnlyRecent] = useState(searchParams.has("recent"));
  const [recentCount, setRecentCount] = useState(
    searchParams.get("recent") || "10",
  );

  // 工具列表
  const [tools, setTools] = useState<ITool[]>([]);
  const [loadingTools, setLoadingTools] = useState(false);

  // 获取工具列表
  useEffect(() => {
    async function fetchTools() {
      setLoadingTools(true);
      try {
        const response = await fetch("/api/tools");
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setTools(data.data || []);
          }
        }
      } catch (error) {
        console.error("获取工具列表失败:", error);
      } finally {
        setLoadingTools(false);
      }
    }

    fetchTools();
  }, []);

  // 构建过滤参数
  const buildFilterQuery = () => {
    const params = new URLSearchParams();

    if (toolId) params.set("toolId", toolId);
    if (sessionId) params.set("sessionId", sessionId);
    if (agentId) params.set("agentId", agentId);
    if (status) params.set("status", status);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);

    if (onlyRecent) {
      params.set("recent", recentCount);
    }

    return params.toString();
  };

  // 应用过滤条件
  const applyFilter = () => {
    const query = buildFilterQuery();
    router.push(`/tool-logs${query ? `?${query}` : ""}`);
  };

  // 重置过滤条件
  const resetFilter = () => {
    setToolId("");
    setSessionId("");
    setAgentId("");
    setStatus("");
    setStartDate("");
    setEndDate("");
    setOnlyRecent(false);
    setRecentCount("10");

    router.push("/tool-logs");
  };

  // 最近日志切换处理
  const handleRecentToggle = (checked: boolean) => {
    setOnlyRecent(checked);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-blue-400">过滤条件</h2>

      <div className="space-y-4">
        {/* 最近日志切换 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="recent-logs"
              checked={onlyRecent}
              onCheckedChange={handleRecentToggle}
            />

            <Label htmlFor="recent-logs">只显示最近日志</Label>
          </div>
        </div>

        {/* 最近日志数量 */}
        {onlyRecent && (
          <div className="space-y-2">
            <Label htmlFor="recent-count">数量</Label>
            <Select value={recentCount} onValueChange={setRecentCount}>
              <SelectTrigger id="recent-count">
                <SelectValue placeholder="选择数量" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5条</SelectItem>
                <SelectItem value="10">10条</SelectItem>
                <SelectItem value="20">20条</SelectItem>
                <SelectItem value="50">50条</SelectItem>
                <SelectItem value="100">100条</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* 详细过滤条件 */}
        {!onlyRecent && (
          <>
            {/* 工具ID */}
            <div className="space-y-2">
              <Label htmlFor="tool-id">工具</Label>
              <Select value={toolId} onValueChange={setToolId}>
                <SelectTrigger id="tool-id">
                  <SelectValue placeholder="选择工具" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">全部工具</SelectItem>
                  {tools.map((tool) => (
                    <SelectItem key={tool.id} value={tool.id}>
                      {tool.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 会话ID */}
            <div className="space-y-2">
              <Label htmlFor="session-id">会话ID</Label>
              <Input
                id="session-id"
                placeholder="输入会话ID"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
              />
            </div>

            {/* 代理ID */}
            <div className="space-y-2">
              <Label htmlFor="agent-id">代理ID</Label>
              <Input
                id="agent-id"
                placeholder="输入代理ID"
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
              />
            </div>

            {/* 状态 */}
            <div className="space-y-2">
              <Label htmlFor="status">状态</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">全部状态</SelectItem>
                  <SelectItem value="success">成功</SelectItem>
                  <SelectItem value="error">失败</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 开始日期 */}
            <div className="space-y-2">
              <Label htmlFor="start-date">开始日期</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* 结束日期 */}
            <div className="space-y-2">
              <Label htmlFor="end-date">结束日期</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </>
        )}

        {/* 操作按钮 */}
        <div className="flex space-x-2 pt-4">
          <button
            onClick={applyFilter}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
          >
            应用过滤
          </button>

          <button
            onClick={resetFilter}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition"
          >
            重置
          </button>
        </div>
      </div>
    </div>
  );
}
