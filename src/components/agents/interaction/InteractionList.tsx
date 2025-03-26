"use client";

import React, { useState, useEffect } from "react";
import {
  FiFilter,
  FiDownload,
  FiSearch,
  FiClock,
  FiMessageSquare,
  FiInfo,
} from "react-icons/fi";
import Link from "next/link";

interface Interaction {
  id: string;
  content: string;
  type: string;
  timestamp: string;
  sender: {
    id: string;
    name: string;
    role: string;
  };
  receiver: {
    id: string;
    name: string;
    role: string;
  };
  session: {
    id: string;
    name: string;
  };
}

interface InteractionListProps {
  agentId: string;
  initialInteractions?: Interaction[];
}

/**
 * 代理交互历史列表组件
 */
const InteractionList: React.FC<InteractionListProps> = ({
  agentId,
  initialInteractions = [],
}) => {
  const [interactions, setInteractions] =
    useState<Interaction[]>(initialInteractions);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [filter, setFilter] = useState({
    sessionId: "",
    types: [] as string[],
    startDate: "",
    endDate: "",
    keywords: "",
  });
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const limit = 20;

  // 加载交互历史数据
  const loadInteractions = async (reset: boolean = false) => {
    try {
      setLoading(true);

      // 构建查询参数
      const params = new URLSearchParams();
      if (filter.sessionId) params.append("sessionId", filter.sessionId);
      if (filter.types.length > 0)
        params.append("types", filter.types.join(","));
      if (filter.startDate) params.append("startDate", filter.startDate);
      if (filter.endDate) params.append("endDate", filter.endDate);
      if (filter.keywords) params.append("keywords", filter.keywords);

      const currentPage = reset ? 1 : page;
      params.append("limit", limit.toString());
      params.append("offset", ((currentPage - 1) * limit).toString());

      // 发送请求
      const response = await fetch(
        `/api/agents/${agentId}/interactions?${params.toString()}`,
      );
      if (!response.ok) {
        throw new Error("获取交互历史失败");
      }

      const data = await response.json();

      // 更新状态
      if (reset) {
        setInteractions(data.data);
        setPage(1);
      } else {
        setInteractions((prev) => [...prev, ...data.data]);
        setPage(currentPage + 1);
      }

      setHasMore(data.meta.hasMore);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载失败");
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    if (initialInteractions.length === 0) {
      loadInteractions();
    } else {
      setLoading(false);
    }
  }, [agentId]);

  // 应用过滤器
  const applyFilter = () => {
    loadInteractions(true);
    setShowFilter(false);
  };

  // 重置过滤器
  const resetFilter = () => {
    setFilter({
      sessionId: "",
      types: [],
      startDate: "",
      endDate: "",
      keywords: "",
    });
    loadInteractions(true);
    setShowFilter(false);
  };

  // 导出数据
  const exportData = (format: "json" | "csv") => {
    // 构建查询参数
    const params = new URLSearchParams();
    if (filter.sessionId) params.append("sessionId", filter.sessionId);
    if (filter.types.length > 0) params.append("types", filter.types.join(","));
    if (filter.startDate) params.append("startDate", filter.startDate);
    if (filter.endDate) params.append("endDate", filter.endDate);
    if (filter.keywords) params.append("keywords", filter.keywords);
    params.append("format", format);

    // 触发下载
    window.open(
      `/api/agents/${agentId}/interactions/export?${params.toString()}`,
    );
  };

  // 格式化内容显示（截断长内容）
  const formatContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substr(0, maxLength) + "...";
  };

  // 格式化时间显示
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleString("zh-CN");
  };

  // 渲染消息类型标签
  const renderTypeTag = (type: string) => {
    let color = "bg-gray-500";
    let icon = <FiMessageSquare className="mr-1" />;

    switch (type) {
      case "text":
        color = "bg-blue-500";
        break;
      case "code":
        color = "bg-green-500";
        break;
      case "tool_call":
        color = "bg-purple-500";
        break;
      case "tool_result":
        color = "bg-yellow-500";
        break;
      case "error":
        color = "bg-red-500";
        break;
    }

    return (
      <span
        className={`${color} text-white text-xs px-2 py-1 rounded flex items-center`}
      >
        {icon} {type}
      </span>
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-indigo-900 rounded-lg shadow-xl p-4 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          代理交互历史
        </h2>

        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            <FiFilter />
            <span>筛选</span>
          </button>

          <div className="relative group">
            <button className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition-colors">
              <FiDownload />
              <span>导出</span>
            </button>

            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg p-2 hidden group-hover:block z-10">
              <button
                onClick={() => exportData("json")}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
              >
                导出为 JSON
              </button>
              <button
                onClick={() => exportData("csv")}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
              >
                导出为 CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 过滤面板 */}
      {showFilter && (
        <div className="mb-6 p-4 bg-gray-800 bg-opacity-50 rounded-lg backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-4 text-white">筛选条件</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-gray-300 mb-1">关键词</label>
              <div className="flex items-center bg-gray-700 rounded-lg px-3 py-2">
                <FiSearch className="text-gray-400 mr-2" />
                <input
                  type="text"
                  value={filter.keywords}
                  onChange={(e) =>
                    setFilter({ ...filter, keywords: e.target.value })
                  }
                  placeholder="搜索关键词..."
                  className="bg-transparent border-none focus:outline-none text-white w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-1">会话ID</label>
              <input
                type="text"
                value={filter.sessionId}
                onChange={(e) =>
                  setFilter({ ...filter, sessionId: e.target.value })
                }
                placeholder="输入会话ID"
                className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">开始日期</label>
              <div className="flex items-center bg-gray-700 rounded-lg px-3 py-2">
                <FiClock className="text-gray-400 mr-2" />
                <input
                  type="date"
                  value={filter.startDate}
                  onChange={(e) =>
                    setFilter({ ...filter, startDate: e.target.value })
                  }
                  className="bg-transparent border-none focus:outline-none text-white w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-1">结束日期</label>
              <div className="flex items-center bg-gray-700 rounded-lg px-3 py-2">
                <FiClock className="text-gray-400 mr-2" />
                <input
                  type="date"
                  value={filter.endDate}
                  onChange={(e) =>
                    setFilter({ ...filter, endDate: e.target.value })
                  }
                  className="bg-transparent border-none focus:outline-none text-white w-full"
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-1">消息类型</label>
            <div className="flex flex-wrap gap-2">
              {["text", "code", "tool_call", "tool_result", "error"].map(
                (type) => (
                  <label key={type} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filter.types.includes(type)}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...filter.types, type]
                          : filter.types.filter((t) => t !== type);
                        setFilter({ ...filter, types: newTypes });
                      }}
                      className="rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500"
                    />

                    <span className="text-gray-300">{type}</span>
                  </label>
                ),
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={resetFilter}
              className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition-colors"
            >
              重置
            </button>
            <button
              onClick={applyFilter}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            >
              应用筛选
            </button>
          </div>
        </div>
      )}

      {/* 交互列表 */}
      {error ? (
        <div className="p-4 mb-4 text-red-400 bg-red-900 bg-opacity-30 rounded-lg">
          <p>{error}</p>
          <button
            onClick={() => loadInteractions(true)}
            className="mt-2 px-3 py-1 bg-red-700 hover:bg-red-600 rounded text-white"
          >
            重试
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {interactions.length === 0 && !loading ? (
              <div className="p-8 text-center text-gray-400 bg-gray-800 bg-opacity-30 rounded-lg">
                <FiInfo className="mx-auto mb-2 text-3xl" />
                <p>暂无交互历史记录</p>
              </div>
            ) : (
              interactions.map((interaction) => (
                <Link
                  key={interaction.id}
                  href={`/agents/${agentId}/interactions/${interaction.id}`}
                  className="block"
                >
                  <div className="bg-gray-800 bg-opacity-50 hover:bg-opacity-70 p-4 rounded-lg transition-all duration-200 transform hover:scale-[1.01]">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-3">
                        <div>{renderTypeTag(interaction.type)}</div>
                        <div className="text-sm text-purple-300">
                          {formatTime(interaction.timestamp)}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        ID: {interaction.id}
                      </div>
                    </div>

                    <div className="mb-3 text-white">
                      {formatContent(interaction.content)}
                    </div>

                    <div className="flex justify-between text-xs text-gray-400">
                      <div className="flex space-x-4">
                        <div>
                          <span className="text-gray-500">从:</span>{" "}
                          <span className="text-teal-400">
                            {interaction.sender.name}
                          </span>
                          <span className="text-gray-500 ml-1">
                            ({interaction.sender.role})
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">至:</span>{" "}
                          <span className="text-pink-400">
                            {interaction.receiver.name}
                          </span>
                          <span className="text-gray-500 ml-1">
                            ({interaction.receiver.role})
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">会话:</span>{" "}
                        <span className="text-blue-400">
                          {interaction.session.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* 加载更多按钮 */}
          {hasMore && (
            <div className="mt-6 text-center">
              <button
                onClick={() => loadInteractions()}
                disabled={loading}
                className={`px-6 py-2 rounded-lg ${
                  loading
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } text-white transition-colors`}
              >
                {loading ? "加载中..." : "加载更多"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InteractionList;
