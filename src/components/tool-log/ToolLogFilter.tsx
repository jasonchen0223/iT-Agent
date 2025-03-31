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
    <div
      className="bg-gray-800 rounded-lg p-4 border border-gray-700"
      data-oid="iepyfdh"
    >
      <h2
        className="text-xl font-semibold mb-4 text-blue-400"
        data-oid="1829fvt"
      >
        过滤条件
      </h2>

      <div className="space-y-4" data-oid="1__.7s-">
        {/* 最近日志切换 */}
        <div className="flex items-center justify-between" data-oid="zqo0dre">
          <div className="flex items-center space-x-2" data-oid="qa:ruma">
            <Switch
              id="recent-logs"
              checked={onlyRecent}
              onCheckedChange={handleRecentToggle}
              data-oid="8vnh85p"
            />

            <Label htmlFor="recent-logs" data-oid="kma3w97">
              只显示最近日志
            </Label>
          </div>
        </div>

        {/* 最近日志数量 */}
        {onlyRecent && (
          <div className="space-y-2" data-oid="9zwh-i1">
            <Label htmlFor="recent-count" data-oid="adbswk.">
              数量
            </Label>
            <Select
              value={recentCount}
              onValueChange={setRecentCount}
              data-oid="ed2xhq4"
            >
              <SelectTrigger id="recent-count" data-oid="ujmm2w9">
                <SelectValue placeholder="选择数量" data-oid="4zc7mwb" />
              </SelectTrigger>
              <SelectContent data-oid="q74emey">
                <SelectItem value="5" data-oid="wfn03cr">
                  5条
                </SelectItem>
                <SelectItem value="10" data-oid="bz4dg:0">
                  10条
                </SelectItem>
                <SelectItem value="20" data-oid="yq_y2fn">
                  20条
                </SelectItem>
                <SelectItem value="50" data-oid="3gdtozv">
                  50条
                </SelectItem>
                <SelectItem value="100" data-oid="9xj9wy5">
                  100条
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* 详细过滤条件 */}
        {!onlyRecent && (
          <>
            {/* 工具ID */}
            <div className="space-y-2" data-oid="fz.fdiy">
              <Label htmlFor="tool-id" data-oid="2lwx63a">
                工具
              </Label>
              <Select
                value={toolId}
                onValueChange={setToolId}
                data-oid="c82urv7"
              >
                <SelectTrigger id="tool-id" data-oid="6.gkocx">
                  <SelectValue placeholder="选择工具" data-oid="d66lym1" />
                </SelectTrigger>
                <SelectContent data-oid="flcy0um">
                  <SelectItem value="" data-oid="05v-egt">
                    全部工具
                  </SelectItem>
                  {tools.map((tool) => (
                    <SelectItem
                      key={tool.id}
                      value={tool.id}
                      data-oid="w.wpsqb"
                    >
                      {tool.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 会话ID */}
            <div className="space-y-2" data-oid=":a7a-i3">
              <Label htmlFor="session-id" data-oid="f:7upxo">
                会话ID
              </Label>
              <Input
                id="session-id"
                placeholder="输入会话ID"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                data-oid="ajacnbq"
              />
            </div>

            {/* 代理ID */}
            <div className="space-y-2" data-oid="0pdfr2-">
              <Label htmlFor="agent-id" data-oid="c-mpkr:">
                代理ID
              </Label>
              <Input
                id="agent-id"
                placeholder="输入代理ID"
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                data-oid="_ubp7up"
              />
            </div>

            {/* 状态 */}
            <div className="space-y-2" data-oid="lb2yz71">
              <Label htmlFor="status" data-oid="8fzkd4j">
                状态
              </Label>
              <Select
                value={status}
                onValueChange={setStatus}
                data-oid="-o5fyik"
              >
                <SelectTrigger id="status" data-oid="7cgrl-d">
                  <SelectValue placeholder="选择状态" data-oid="flyper-" />
                </SelectTrigger>
                <SelectContent data-oid="o7.6._c">
                  <SelectItem value="" data-oid="6rh0sdt">
                    全部状态
                  </SelectItem>
                  <SelectItem value="success" data-oid="ot7djww">
                    成功
                  </SelectItem>
                  <SelectItem value="error" data-oid="9b86g2s">
                    失败
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 开始日期 */}
            <div className="space-y-2" data-oid="98oa8jt">
              <Label htmlFor="start-date" data-oid="meymlu_">
                开始日期
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                data-oid="inj298e"
              />
            </div>

            {/* 结束日期 */}
            <div className="space-y-2" data-oid="2ybdfz1">
              <Label htmlFor="end-date" data-oid="7:03r2:">
                结束日期
              </Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                data-oid="2t.62nn"
              />
            </div>
          </>
        )}

        {/* 操作按钮 */}
        <div className="flex space-x-2 pt-4" data-oid="tk-82p.">
          <button
            onClick={applyFilter}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
            data-oid="-jww44v"
          >
            应用过滤
          </button>

          <button
            onClick={resetFilter}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition"
            data-oid="d._vpa-"
          >
            重置
          </button>
        </div>
      </div>
    </div>
  );
}
