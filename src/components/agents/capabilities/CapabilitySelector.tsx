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
        return <FiTool className="text-blue-400" data-oid="i90bly_" />;
      case "reasoning":
        return <FiBrain className="text-purple-400" data-oid="gms9cc1" />;
      case "knowledge":
        return <FiDatabase className="text-green-400" data-oid="bz8kzb." />;
      case "communication":
        return (
          <FiMessageCircle className="text-yellow-400" data-oid="mfiw_vv" />
        );

      default:
        return <FiPlusCircle className="text-gray-400" data-oid="yd6id44" />;
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
        data-oid="3_tf5sl"
      >
        {/* 选中状态图标 */}
        {isSelected && (
          <div className="absolute top-2 right-2" data-oid="t175cjf">
            <FiCheckCircle className="text-blue-400" data-oid="d9i-8qx" />
          </div>
        )}

        {/* 能力图标和名称 */}
        <div className="flex items-center space-x-2 mb-2" data-oid="rq4t1z9">
          {getCapabilityIcon(capability.type)}
          <h3 className="font-medium text-white" data-oid="hdnf62q">
            {capability.name}
          </h3>
        </div>

        {/* 能力描述 */}
        <p className="text-sm text-gray-300 mb-3" data-oid="lw7mz1g">
          {capability.description}
        </p>

        {/* 能力类型标签 */}
        <div
          className="text-xs px-2 py-1 rounded bg-gray-700 inline-block text-gray-300"
          data-oid="nowpnm7"
        >
          {capability.type}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`bg-gray-900 rounded-lg p-4 ${className}`}
      data-oid="7jfha0r"
    >
      {/* 标题和工具栏 */}
      <div
        className="flex justify-between items-center mb-4"
        data-oid="48o:wln"
      >
        <h2 className="text-lg font-medium text-white" data-oid="4q.e04c">
          代理能力
        </h2>

        <div className="flex space-x-2" data-oid="_:nqngx">
          {/* 如果提供了agentRole，显示推荐按钮 */}
          {agentRole && (
            <button
              className="text-xs flex items-center space-x-1 px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              onClick={loadRecommendedCapabilities}
              disabled={loading}
              data-oid="jv1dtte"
            >
              <FiRefreshCw
                className={loading ? "animate-spin" : ""}
                data-oid="ea0.cil"
              />

              <span data-oid="nmyicdw">推荐能力</span>
            </button>
          )}

          {/* 刷新按钮 */}
          <button
            className="p-1 rounded-full hover:bg-gray-700 transition-colors"
            onClick={loadCapabilities}
            disabled={loading}
            title="刷新能力列表"
            data-oid="77f.785"
          >
            <FiRefreshCw
              className={loading ? "animate-spin" : ""}
              data-oid="mbk4z3k"
            />
          </button>
        </div>
      </div>

      {/* 搜索和筛选区域 */}
      {(showSearch || showFilter) && (
        <div
          className="mb-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
          data-oid="8-x6m0."
        >
          {/* 搜索框 */}
          {showSearch && (
            <div className="relative flex-1" data-oid="kbnlb_:">
              <FiSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                data-oid="fld_.sc"
              />

              <input
                type="text"
                placeholder="搜索能力..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-oid="xs9t5hd"
              />
            </div>
          )}

          {/* 类型筛选 */}
          {showFilter && (
            <div className="flex items-center space-x-1" data-oid="iioo64w">
              <FiFilter className="text-gray-400" data-oid="w-7v.c8" />
              <button
                className={`px-2 py-1 text-sm rounded ${activeFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
                onClick={() => setActiveFilter("all")}
                data-oid="dwf4tf7"
              >
                全部
              </button>
              <button
                className={`px-2 py-1 text-sm rounded ${activeFilter === "tool" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
                onClick={() => setActiveFilter("tool")}
                data-oid="t.yeqfs"
              >
                <FiTool className="inline mr-1" data-oid="7ar8-.f" />
                工具
              </button>
              <button
                className={`px-2 py-1 text-sm rounded ${activeFilter === "reasoning" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
                onClick={() => setActiveFilter("reasoning")}
                data-oid="eh:dl17"
              >
                <FiBrain className="inline mr-1" data-oid="dnlim.z" />
                推理
              </button>
              <button
                className={`px-2 py-1 text-sm rounded ${activeFilter === "knowledge" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
                onClick={() => setActiveFilter("knowledge")}
                data-oid="65o_y7a"
              >
                <FiDatabase className="inline mr-1" data-oid="of38ypk" />
                知识
              </button>
              <button
                className={`px-2 py-1 text-sm rounded ${activeFilter === "communication" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
                onClick={() => setActiveFilter("communication")}
                data-oid="1fcdz96"
              >
                <FiMessageCircle className="inline mr-1" data-oid="b66g42y" />
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
          data-oid="6scx_k5"
        >
          {error}
        </div>
      )}

      {/* 加载中状态 */}
      {loading && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          data-oid=".bryizb"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="p-4 border border-gray-700 rounded-lg animate-pulse"
              data-oid="nc6.9ln"
            >
              <div
                className="h-4 bg-gray-700 rounded w-3/4 mb-2"
                data-oid="0mas3o2"
              ></div>
              <div
                className="h-3 bg-gray-700 rounded w-full mb-1"
                data-oid="4fq8cnc"
              ></div>
              <div
                className="h-3 bg-gray-700 rounded w-5/6 mb-3"
                data-oid="78v-0fn"
              ></div>
              <div
                className="h-5 bg-gray-700 rounded w-1/4"
                data-oid="6-pdkfn"
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
              data-oid="_p871zz"
            >
              {filteredCapabilities.map((capability) =>
                renderCapabilityCard(capability),
              )}
            </div>
          ) : (
            <div className="py-10 text-center text-gray-400" data-oid="g7g3r4p">
              <p data-oid="mk-4sp8">没有找到符合条件的能力</p>
            </div>
          )}
        </>
      )}

      {/* 已选能力摘要 */}
      {selectedCapabilities.length > 0 && (
        <div className="mt-4 p-3 bg-gray-800 rounded-lg" data-oid="fg6zn41">
          <h3
            className="text-sm font-medium text-white mb-2"
            data-oid="1_x6bk_"
          >
            已选择 {selectedCapabilities.length} 个能力
          </h3>
          <div className="flex flex-wrap gap-2" data-oid=".x36nnq">
            {selectedCapabilities.map((id) => {
              const capability = capabilities.find((c) => c.id === id);
              if (!capability) return null;

              return (
                <div
                  key={id}
                  className="text-xs px-2 py-1 rounded-full bg-blue-900 text-blue-200 flex items-center"
                  data-oid="695ou5i"
                >
                  {getCapabilityIcon(capability.type)}
                  <span className="ml-1" data-oid="jum2tpx">
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
