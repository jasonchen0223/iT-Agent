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
      data-oid="75isqc9"
    >
      <h2
        className="text-xl font-semibold mb-4 text-blue-400"
        data-oid="9ipgz2q"
      >
        过滤条件
      </h2>

      <div className="space-y-4" data-oid="1jddtt.">
        {/* 最近日志切换 */}
        <div className="flex items-center justify-between" data-oid="l04:-e9">
          <div className="flex items-center space-x-2" data-oid="hx1ztk8">
            <Switch
              id="recent-logs"
              checked={onlyRecent}
              onCheckedChange={handleRecentToggle}
              data-oid="54m6m6."
            />

            <Label htmlFor="recent-logs" data-oid="cr0gaaz">
              只显示最近日志
            </Label>
          </div>
        </div>

        {/* 最近日志数量 */}
        {onlyRecent && (
          <div className="space-y-2" data-oid="2nf4-iw">
            <Label htmlFor="recent-count" data-oid="ole5w1h">
              数量
            </Label>
            <Select
              value={recentCount}
              onValueChange={setRecentCount}
              data-oid="d2bv6s0"
            >
              <SelectTrigger id="recent-count" data-oid="oxlq460">
                <SelectValue placeholder="选择数量" data-oid="82.:zen" />
              </SelectTrigger>
              <SelectContent data-oid="rch_8qo">
                <SelectItem value="5" data-oid="qgfwhi0">
                  5条
                </SelectItem>
                <SelectItem value="10" data-oid="p.noab9">
                  10条
                </SelectItem>
                <SelectItem value="20" data-oid="e5y61_l">
                  20条
                </SelectItem>
                <SelectItem value="50" data-oid="4m_g_2:">
                  50条
                </SelectItem>
                <SelectItem value="100" data-oid="22vian6">
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
            <div className="space-y-2" data-oid="0_2uppx">
              <Label htmlFor="tool-id" data-oid="ufjh4eo">
                工具
              </Label>
              <Select
                value={toolId}
                onValueChange={setToolId}
                data-oid=".qzc8mc"
              >
                <SelectTrigger id="tool-id" data-oid="_fv8r_j">
                  <SelectValue placeholder="选择工具" data-oid="wlg06ex" />
                </SelectTrigger>
                <SelectContent data-oid="-rl832m">
                  <SelectItem value="" data-oid="10it_xw">
                    全部工具
                  </SelectItem>
                  {tools.map((tool) => (
                    <SelectItem
                      key={tool.id}
                      value={tool.id}
                      data-oid=":chpmbz"
                    >
                      {tool.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 会话ID */}
            <div className="space-y-2" data-oid="fzlupr5">
              <Label htmlFor="session-id" data-oid="40_fy33">
                会话ID
              </Label>
              <Input
                id="session-id"
                placeholder="输入会话ID"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                data-oid="wdu0f8a"
              />
            </div>

            {/* 代理ID */}
            <div className="space-y-2" data-oid="3-hh.bl">
              <Label htmlFor="agent-id" data-oid="0e_tv0m">
                代理ID
              </Label>
              <Input
                id="agent-id"
                placeholder="输入代理ID"
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                data-oid="mitxkad"
              />
            </div>

            {/* 状态 */}
            <div className="space-y-2" data-oid="2xz.-kg">
              <Label htmlFor="status" data-oid="ye7ewxc">
                状态
              </Label>
              <Select
                value={status}
                onValueChange={setStatus}
                data-oid="0odx_b."
              >
                <SelectTrigger id="status" data-oid="5ilvlz9">
                  <SelectValue placeholder="选择状态" data-oid="c1gwg:1" />
                </SelectTrigger>
                <SelectContent data-oid="yl8i9rb">
                  <SelectItem value="" data-oid="lkb:lep">
                    全部状态
                  </SelectItem>
                  <SelectItem value="success" data-oid="5.e:_hs">
                    成功
                  </SelectItem>
                  <SelectItem value="error" data-oid="wlne9ga">
                    失败
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 开始日期 */}
            <div className="space-y-2" data-oid="1kdio6p">
              <Label htmlFor="start-date" data-oid="tld5qk.">
                开始日期
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                data-oid="2xk_mdq"
              />
            </div>

            {/* 结束日期 */}
            <div className="space-y-2" data-oid="vcqr-ui">
              <Label htmlFor="end-date" data-oid="z3q0pi3">
                结束日期
              </Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                data-oid="88fktev"
              />
            </div>
          </>
        )}

        {/* 操作按钮 */}
        <div className="flex space-x-2 pt-4" data-oid="27a9y64">
          <button
            onClick={applyFilter}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
            data-oid="8xiw2tl"
          >
            应用过滤
          </button>

          <button
            onClick={resetFilter}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition"
            data-oid="r5czoka"
          >
            重置
          </button>
        </div>
      </div>
    </div>
  );
}
