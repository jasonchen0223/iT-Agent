"use client";

import React, { useState, useEffect } from "react";
import { IAgentCapability } from "@/types/agent-types";
import {
  FiTool,
  FiBrain,
  FiDatabase,
  FiMessageCircle,
  FiPlusCircle,
  FiAlertCircle,
  FiX,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

/**
 * 代理能力详情组件属性
 */
interface CapabilityDetailProps {
  /**
   * 能力ID
   */
  capabilityId: string;

  /**
   * 关闭详情面板的回调函数
   */
  onClose?: () => void;

  /**
   * 组件类名
   */
  className?: string;
}

/**
 * 代理能力详情组件
 */
const CapabilityDetail: React.FC<CapabilityDetailProps> = ({
  capabilityId,
  onClose,
  className = "",
}) => {
  // 能力详情
  const [capability, setCapability] = useState<IAgentCapability | null>(null);

  // 加载状态
  const [loading, setLoading] = useState<boolean>(true);

  // 错误信息
  const [error, setError] = useState<string | null>(null);

  // 参数展开状态
  const [paramsExpanded, setParamsExpanded] = useState<boolean>(false);

  // 加载能力详情
  useEffect(() => {
    const fetchCapabilityDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/agents/capabilities/${capabilityId}`,
        );

        if (!response.ok) {
          throw new Error("获取能力详情失败");
        }

        const data = await response.json();

        if (data.success) {
          setCapability(data.data);
        } else {
          throw new Error(data.error || "获取能力详情失败");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "加载失败");
        console.error("加载能力详情失败:", err);
      } finally {
        setLoading(false);
      }
    };

    if (capabilityId) {
      fetchCapabilityDetail();
    }
  }, [capabilityId]);

  // 根据能力类型获取图标
  const getCapabilityIcon = (type: string) => {
    switch (type) {
      case "tool":
        return <FiTool className="text-blue-400 text-2xl" />;
      case "reasoning":
        return <FiBrain className="text-purple-400 text-2xl" />;

      case "knowledge":
        return <FiDatabase className="text-green-400 text-2xl" />;

      case "communication":
        return <FiMessageCircle className="text-yellow-400 text-2xl" />;

      default:
        return <FiPlusCircle className="text-gray-400 text-2xl" />;
    }
  };

  // 获取能力类型标签样式
  const getTypeStyle = (type: string): string => {
    switch (type) {
      case "tool":
        return "bg-blue-900 bg-opacity-40 text-blue-300 border-blue-500";
      case "reasoning":
        return "bg-purple-900 bg-opacity-40 text-purple-300 border-purple-500";
      case "knowledge":
        return "bg-green-900 bg-opacity-40 text-green-300 border-green-500";
      case "communication":
        return "bg-yellow-900 bg-opacity-40 text-yellow-300 border-yellow-500";
      default:
        return "bg-gray-800 text-gray-300 border-gray-600";
    }
  };

  // 渲染加载状态
  if (loading) {
    return (
      <div
        className={`bg-gray-900 rounded-lg p-6 border border-gray-700 animate-pulse ${className}`}
      >
        <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-full mb-3"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6 mb-6"></div>
        <div className="h-20 bg-gray-800 rounded mb-4"></div>
        <div className="h-5 bg-gray-700 rounded w-1/4"></div>
      </div>
    );
  }

  // 渲染错误状态
  if (error) {
    return (
      <div
        className={`bg-gray-900 rounded-lg p-6 border border-red-700 ${className}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-red-400">
            <FiAlertCircle />
            <h2 className="font-bold">加载失败</h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <FiX />
            </button>
          )}
        </div>
        <p className="text-gray-300 mb-3">{error}</p>
      </div>
    );
  }

  // 如果能力数据为空
  if (!capability) {
    return (
      <div
        className={`bg-gray-900 rounded-lg p-6 border border-gray-700 ${className}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white">未找到能力</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <FiX />
            </button>
          )}
        </div>
        <p className="text-gray-400">无法加载指定的代理能力信息</p>
      </div>
    );
  }

  return (
    <div
      className={`bg-gray-900 rounded-lg p-6 border border-gray-700 ${className}`}
    >
      {/* 标题和关闭按钮 */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          {getCapabilityIcon(capability.type)}
          <h2 className="text-xl font-bold text-white">{capability.name}</h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800"
          >
            <FiX />
          </button>
        )}
      </div>

      {/* 能力类型标签 */}
      <div className="mb-4">
        <span
          className={`text-xs px-3 py-1 rounded-full border ${getTypeStyle(capability.type)}`}
        >
          {capability.type}
        </span>
      </div>

      {/* 能力描述 */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-400 mb-1">描述</h3>
        <p className="text-white">{capability.description}</p>
      </div>

      {/* 标签信息 */}
      {capability.params?.tags && capability.params.tags.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-400 mb-2">标签</h3>
          <div className="flex flex-wrap gap-2">
            {capability.params.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 工具相关信息 */}
      {capability.type === "tool" && capability.params?.toolId && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-400 mb-1">关联工具</h3>
          <div className="bg-gray-800 bg-opacity-50 p-3 rounded">
            <div className="text-white font-mono text-sm">
              {capability.params.toolId}
            </div>
          </div>
        </div>
      )}

      {/* 参数详情 */}
      {capability.params && Object.keys(capability.params).length > 0 && (
        <div className="mb-2">
          <button
            className="flex items-center justify-between w-full text-sm font-medium text-gray-400 hover:text-white mb-2"
            onClick={() => setParamsExpanded(!paramsExpanded)}
          >
            <span>详细参数</span>
            {paramsExpanded ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          {paramsExpanded && (
            <div className="bg-gray-800 bg-opacity-50 p-3 rounded font-mono text-sm text-gray-300 overflow-auto max-h-40">
              <pre>{JSON.stringify(capability.params, null, 2)}</pre>
            </div>
          )}
        </div>
      )}

      {/* 能力ID */}
      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>能力 ID</span>
          <span className="font-mono">{capability.id}</span>
        </div>
      </div>
    </div>
  );
};

export default CapabilityDetail;
