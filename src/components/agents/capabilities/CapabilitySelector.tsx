"use client";

import React, { useState, useEffect } from "react";
import { IAgentCapability } from "@/types/agent-types";
import {
  FiTool,
  FiBrain,
  FiDatabase,
  FiMessageCircle,
  FiPlusCircle,
  FiCheckCircle,
  FiSearch,
  FiFilter,
  FiRefreshCw,
} from "react-icons/fi";

/**
 * 代理能力选择器组件属性
 */
interface CapabilitySelectorProps {
  /**
   * 已选择的能力ID列表
   */
  selectedCapabilities: string[];

  /**
   * 能力选择改变时的回调
   */
  onChange: (capabilityIds: string[]) => void;

  /**
   * 代理角色，用于推荐能力
   */
  agentRole?: string;

  /**
   * 是否包含搜索框
   */
  showSearch?: boolean;

  /**
   * 是否显示筛选选项
   */
  showFilter?: boolean;

  /**
   * 组件类名
   */
  className?: string;
}

/**
 * 代理能力选择器组件
 */
const CapabilitySelector: React.FC<CapabilitySelectorProps> = ({
  selectedCapabilities = [],
  onChange,
  agentRole,
  showSearch = true,
  showFilter = true,
  className = "",
}) => {
  // 所有可用能力列表
  const [capabilities, setCapabilities] = useState<IAgentCapability[]>([]);

  // 过滤后的能力列表
  const [filteredCapabilities, setFilteredCapabilities] = useState<
    IAgentCapability[]
  >([]);

  // 加载状态
  const [loading, setLoading] = useState<boolean>(true);

  // 搜索关键词
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 当前筛选类型
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // 错误信息
  const [error, setError] = useState<string | null>(null);

  // 加载所有能力
  const loadCapabilities = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/agents/capabilities");

      if (!response.ok) {
        throw new Error("获取代理能力失败");
      }

      const data = await response.json();

      if (data.success) {
        setCapabilities(data.data);
        setFilteredCapabilities(data.data);
      } else {
        throw new Error(data.error || "获取代理能力失败");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载失败");
      console.error("加载能力失败:", err);
    } finally {
      setLoading(false);
    }
  };

  // 加载推荐能力
  const loadRecommendedCapabilities = async () => {
    if (!agentRole) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/agents/capabilities/recommend?role=${agentRole}`,
      );

      if (!response.ok) {
        throw new Error("获取推荐能力失败");
      }

      const data = await response.json();

      if (data.success) {
        // 获取推荐能力ID列表
        const recommendedIds = data.data.capabilities.map(
          (cap: IAgentCapability) => cap.id,
        );

        // 添加到已选择的能力中
        const newSelectedIds = [
          ...new Set([...selectedCapabilities, ...recommendedIds]),
        ];

        onChange(newSelectedIds);
      } else {
        throw new Error(data.error || "获取推荐能力失败");
      }
    } catch (err) {
      console.error("加载推荐能力失败:", err);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadCapabilities();
  }, []);

  // 筛选能力
  useEffect(() => {
    let filtered = capabilities;

    // 应用搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (cap) =>
          cap.name.toLowerCase().includes(query) ||
          cap.description.toLowerCase().includes(query),
      );
    }

    // 应用类型过滤
    if (activeFilter !== "all") {
      filtered = filtered.filter((cap) => cap.type === activeFilter);
    }

    setFilteredCapabilities(filtered);
  }, [capabilities, searchQuery, activeFilter]);

  // 切换能力选择状态
  const toggleCapability = (capabilityId: string) => {
    const isSelected = selectedCapabilities.includes(capabilityId);

    if (isSelected) {
      // 从选择中移除
      onChange(selectedCapabilities.filter((id) => id !== capabilityId));
    } else {
      // 添加到选择中
      onChange([...selectedCapabilities, capabilityId]);
    }
  };

  // 根据能力类型获取图标
  const getCapabilityIcon = (type: string) => {
    switch (type) {
      case "tool":
        return <FiTool className="text-blue-400" data-oid="w4er9u-" />;
      case "reasoning":
        return <FiBrain className="text-purple-400" data-oid="v42cpms" />;
      case "knowledge":
        return <FiDatabase className="text-green-400" data-oid="-v8gfuq" />;
      case "communication":
        return (
          <FiMessageCircle className="text-yellow-400" data-oid="nc9_x:i" />
        );

      default:
        return <FiPlusCircle className="text-gray-400" data-oid="3vw4v7m" />;
    }
  };

  // 渲染能力卡片
  const renderCapabilityCard = (capability: IAgentCapability) => {
    const isSelected = selectedCapabilities.includes(capability.id);

    return (
      <div
        key={capability.id}
        className={`relative p-4 border rounded-lg transition-all cursor-pointer ${
          isSelected
            ? "border-blue-500 bg-blue-900 bg-opacity-20"
            : "border-gray-700 hover:border-gray-500 bg-gray-800 bg-opacity-30"
        }`}
        onClick={() => toggleCapability(capability.id)}
        data-oid="1xtk41t"
      >
        {/* 选中状态图标 */}
        {isSelected && (
          <div className="absolute top-2 right-2" data-oid="9zuo7tt">
            <FiCheckCircle className="text-blue-400" data-oid="plkdeb7" />
          </div>
        )}

        {/* 能力图标和名称 */}
        <div className="flex items-center space-x-2 mb-2" data-oid="s.rcty:">
          {getCapabilityIcon(capability.type)}
          <h3 className="font-medium text-white" data-oid="5r37lro">
            {capability.name}
          </h3>
        </div>

        {/* 能力描述 */}
        <p className="text-sm text-gray-300 mb-3" data-oid="4gpctuj">
          {capability.description}
        </p>

        {/* 能力类型标签 */}
        <div
          className="text-xs px-2 py-1 rounded bg-gray-700 inline-block text-gray-300"
          data-oid="ogsuitu"
        >
          {capability.type}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`bg-gray-900 rounded-lg p-4 ${className}`}
      data-oid="szcj9wm"
    >
      {/* 标题和工具栏 */}
      <div
        className="flex justify-between items-center mb-4"
        data-oid="k30bo_1"
      >
        <h2 className="text-lg font-medium text-white" data-oid="wj.:ovh">
          代理能力
        </h2>

        <div className="flex space-x-2" data-oid="p.v5vvv">
          {/* 如果提供了agentRole，显示推荐按钮 */}
          {agentRole && (
            <button
              className="text-xs flex items-center space-x-1 px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              onClick={loadRecommendedCapabilities}
              disabled={loading}
              data-oid="vnqrokf"
            >
              <FiRefreshCw
                className={loading ? "animate-spin" : ""}
                data-oid="45vi_w0"
              />

              <span data-oid="g3g24kr">推荐能力</span>
            </button>
          )}

          {/* 刷新按钮 */}
          <button
            className="p-1 rounded-full hover:bg-gray-700 transition-colors"
            onClick={loadCapabilities}
            disabled={loading}
            title="刷新能力列表"
            data-oid="qci23cz"
          >
            <FiRefreshCw
              className={loading ? "animate-spin" : ""}
              data-oid="kmy-4n4"
            />
          </button>
        </div>
      </div>

      {/* 搜索和筛选区域 */}
      {(showSearch || showFilter) && (
        <div
          className="mb-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
          data-oid=":ol5:qv"
        >
          {/* 搜索框 */}
          {showSearch && (
            <div className="relative flex-1" data-oid="cjyag6a">
              <FiSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                data-oid="0ajzzcj"
              />

              <input
                type="text"
                placeholder="搜索能力..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-oid="wn6nsa:"
              />
            </div>
          )}

          {/* 类型筛选 */}
          {showFilter && (
            <div className="flex items-center space-x-1" data-oid="71q0:6m">
              <FiFilter className="text-gray-400" data-oid="k-mgu_7" />
              <button
                className={`px-2 py-1 text-sm rounded ${activeFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
                onClick={() => setActiveFilter("all")}
                data-oid="zrshnpw"
              >
                全部
              </button>
              <button
                className={`px-2 py-1 text-sm rounded ${activeFilter === "tool" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
                onClick={() => setActiveFilter("tool")}
                data-oid="aplsnk3"
              >
                <FiTool className="inline mr-1" data-oid="73c5vuf" />
                工具
              </button>
              <button
                className={`px-2 py-1 text-sm rounded ${activeFilter === "reasoning" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
                onClick={() => setActiveFilter("reasoning")}
                data-oid="hj52uwt"
              >
                <FiBrain className="inline mr-1" data-oid="o4wj:jj" />
                推理
              </button>
              <button
                className={`px-2 py-1 text-sm rounded ${activeFilter === "knowledge" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
                onClick={() => setActiveFilter("knowledge")}
                data-oid="vyt57m7"
              >
                <FiDatabase className="inline mr-1" data-oid="3a:.3y-" />
                知识
              </button>
              <button
                className={`px-2 py-1 text-sm rounded ${activeFilter === "communication" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
                onClick={() => setActiveFilter("communication")}
                data-oid="vr2c93x"
              >
                <FiMessageCircle className="inline mr-1" data-oid="op8tjba" />
                通信
              </button>
            </div>
          )}
        </div>
      )}

      {/* 错误信息 */}
      {error && (
        <div
          className="mb-4 p-3 bg-red-900 bg-opacity-30 border border-red-700 rounded-lg text-red-200"
          data-oid="62o494z"
        >
          {error}
        </div>
      )}

      {/* 加载中状态 */}
      {loading && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          data-oid="elakle2"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="p-4 border border-gray-700 rounded-lg animate-pulse"
              data-oid="wz91nq0"
            >
              <div
                className="h-4 bg-gray-700 rounded w-3/4 mb-2"
                data-oid="yinw.64"
              ></div>
              <div
                className="h-3 bg-gray-700 rounded w-full mb-1"
                data-oid="lio7zv1"
              ></div>
              <div
                className="h-3 bg-gray-700 rounded w-5/6 mb-3"
                data-oid=".l1vom9"
              ></div>
              <div
                className="h-5 bg-gray-700 rounded w-1/4"
                data-oid="7w8eavw"
              ></div>
            </div>
          ))}
        </div>
      )}

      {/* 能力列表 */}
      {!loading && (
        <>
          {filteredCapabilities.length > 0 ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              data-oid="sp-f_mt"
            >
              {filteredCapabilities.map((capability) =>
                renderCapabilityCard(capability),
              )}
            </div>
          ) : (
            <div className="py-10 text-center text-gray-400" data-oid="agabc6a">
              <p data-oid="li:te5f">没有找到符合条件的能力</p>
            </div>
          )}
        </>
      )}

      {/* 已选能力摘要 */}
      {selectedCapabilities.length > 0 && (
        <div className="mt-4 p-3 bg-gray-800 rounded-lg" data-oid="fxc3ux9">
          <h3
            className="text-sm font-medium text-white mb-2"
            data-oid="bxmnhe5"
          >
            已选择 {selectedCapabilities.length} 个能力
          </h3>
          <div className="flex flex-wrap gap-2" data-oid=".agtpzp">
            {selectedCapabilities.map((id) => {
              const capability = capabilities.find((c) => c.id === id);
              if (!capability) return null;

              return (
                <div
                  key={id}
                  className="text-xs px-2 py-1 rounded-full bg-blue-900 text-blue-200 flex items-center"
                  data-oid="ls24xbd"
                >
                  {getCapabilityIcon(capability.type)}
                  <span className="ml-1" data-oid="hiu8sjq">
                    {capability.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CapabilitySelector;
