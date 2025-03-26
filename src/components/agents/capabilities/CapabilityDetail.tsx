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
        return <FiTool className="text-blue-400 text-2xl" data-oid="xklnb16" />;
      case "reasoning":
        return (
          <FiBrain className="text-purple-400 text-2xl" data-oid="m48:cnq" />
        );

      case "knowledge":
        return (
          <FiDatabase className="text-green-400 text-2xl" data-oid=".wn72dz" />
        );

      case "communication":
        return (
          <FiMessageCircle
            className="text-yellow-400 text-2xl"
            data-oid="fupmse6"
          />
        );

      default:
        return (
          <FiPlusCircle className="text-gray-400 text-2xl" data-oid="o.t::c-" />
        );
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
        data-oid="jp::k38"
      >
        <div
          className="h-6 bg-gray-700 rounded w-3/4 mb-4"
          data-oid="4tgfjh3"
        ></div>
        <div
          className="h-4 bg-gray-700 rounded w-full mb-3"
          data-oid="4u5zuy7"
        ></div>
        <div
          className="h-4 bg-gray-700 rounded w-5/6 mb-6"
          data-oid="jy_s.az"
        ></div>
        <div className="h-20 bg-gray-800 rounded mb-4" data-oid="syf3tnm"></div>
        <div className="h-5 bg-gray-700 rounded w-1/4" data-oid="hgiz9cl"></div>
      </div>
    );
  }

  // 渲染错误状态
  if (error) {
    return (
      <div
        className={`bg-gray-900 rounded-lg p-6 border border-red-700 ${className}`}
        data-oid="anaumne"
      >
        <div
          className="flex items-center justify-between mb-4"
          data-oid="q.j5edh"
        >
          <div
            className="flex items-center space-x-2 text-red-400"
            data-oid="zd7extw"
          >
            <FiAlertCircle data-oid="xcoys:q" />
            <h2 className="font-bold" data-oid="-mm.hks">
              加载失败
            </h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
              data-oid="f3042xc"
            >
              <FiX data-oid="p8x:fe5" />
            </button>
          )}
        </div>
        <p className="text-gray-300 mb-3" data-oid="zqi22q7">
          {error}
        </p>
      </div>
    );
  }

  // 如果能力数据为空
  if (!capability) {
    return (
      <div
        className={`bg-gray-900 rounded-lg p-6 border border-gray-700 ${className}`}
        data-oid="tkf9j-v"
      >
        <div
          className="flex justify-between items-center mb-4"
          data-oid=".uy:2i4"
        >
          <h2 className="text-lg font-bold text-white" data-oid="4apwf5-">
            未找到能力
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
              data-oid="5af1pik"
            >
              <FiX data-oid="uyhnht3" />
            </button>
          )}
        </div>
        <p className="text-gray-400" data-oid="fwdxluw">
          无法加载指定的代理能力信息
        </p>
      </div>
    );
  }

  return (
    <div
      className={`bg-gray-900 rounded-lg p-6 border border-gray-700 ${className}`}
      data-oid="mp2fka9"
    >
      {/* 标题和关闭按钮 */}
      <div
        className="flex justify-between items-center mb-4"
        data-oid="tls0okh"
      >
        <div className="flex items-center space-x-3" data-oid=":hq4_z8">
          {getCapabilityIcon(capability.type)}
          <h2 className="text-xl font-bold text-white" data-oid="2n1p2mt">
            {capability.name}
          </h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800"
            data-oid=".04-31a"
          >
            <FiX data-oid="5b.n3d9" />
          </button>
        )}
      </div>

      {/* 能力类型标签 */}
      <div className="mb-4" data-oid="qfb5onv">
        <span
          className={`text-xs px-3 py-1 rounded-full border ${getTypeStyle(capability.type)}`}
          data-oid="nmxxsxi"
        >
          {capability.type}
        </span>
      </div>

      {/* 能力描述 */}
      <div className="mb-4" data-oid="jnd88w7">
        <h3
          className="text-sm font-medium text-gray-400 mb-1"
          data-oid="xt:u67_"
        >
          描述
        </h3>
        <p className="text-white" data-oid="zbt64z6">
          {capability.description}
        </p>
      </div>

      {/* 标签信息 */}
      {capability.params?.tags && capability.params.tags.length > 0 && (
        <div className="mb-4" data-oid="-t:kul6">
          <h3
            className="text-sm font-medium text-gray-400 mb-2"
            data-oid="fo335id"
          >
            标签
          </h3>
          <div className="flex flex-wrap gap-2" data-oid="d_cn:f.">
            {capability.params.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300"
                data-oid="q2v:1:m"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 工具相关信息 */}
      {capability.type === "tool" && capability.params?.toolId && (
        <div className="mb-4" data-oid="otdiuk2">
          <h3
            className="text-sm font-medium text-gray-400 mb-1"
            data-oid="tfkf6s_"
          >
            关联工具
          </h3>
          <div
            className="bg-gray-800 bg-opacity-50 p-3 rounded"
            data-oid="e7z2x44"
          >
            <div className="text-white font-mono text-sm" data-oid="l:8d:yj">
              {capability.params.toolId}
            </div>
          </div>
        </div>
      )}

      {/* 参数详情 */}
      {capability.params && Object.keys(capability.params).length > 0 && (
        <div className="mb-2" data-oid="b2dgooa">
          <button
            className="flex items-center justify-between w-full text-sm font-medium text-gray-400 hover:text-white mb-2"
            onClick={() => setParamsExpanded(!paramsExpanded)}
            data-oid="z0sn7pi"
          >
            <span data-oid="1xij-9u">详细参数</span>
            {paramsExpanded ? (
              <FiChevronUp data-oid="376m-qj" />
            ) : (
              <FiChevronDown data-oid="-vcz2ay" />
            )}
          </button>

          {paramsExpanded && (
            <div
              className="bg-gray-800 bg-opacity-50 p-3 rounded font-mono text-sm text-gray-300 overflow-auto max-h-40"
              data-oid="eos1bfz"
            >
              <pre data-oid="-zhh9.q">
                {JSON.stringify(capability.params, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* 能力ID */}
      <div className="mt-4 pt-4 border-t border-gray-800" data-oid=".hf3d6l">
        <div
          className="flex items-center justify-between text-xs text-gray-500"
          data-oid="e2do2a:"
        >
          <span data-oid="xixnmm4">能力 ID</span>
          <span className="font-mono" data-oid="1_lm-v_">
            {capability.id}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CapabilityDetail;
