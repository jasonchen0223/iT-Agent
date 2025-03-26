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
        return <FiTool className="text-blue-400 text-2xl" data-oid="3-3fj1n" />;
      case "reasoning":
        return (
          <FiBrain className="text-purple-400 text-2xl" data-oid="n8mjyr6" />
        );

      case "knowledge":
        return (
          <FiDatabase className="text-green-400 text-2xl" data-oid="yy7a93w" />
        );

      case "communication":
        return (
          <FiMessageCircle
            className="text-yellow-400 text-2xl"
            data-oid=".66:cs-"
          />
        );

      default:
        return (
          <FiPlusCircle className="text-gray-400 text-2xl" data-oid="ppalhgt" />
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
        data-oid="xzl.gie"
      >
        <div
          className="h-6 bg-gray-700 rounded w-3/4 mb-4"
          data-oid="b_r4w3i"
        ></div>
        <div
          className="h-4 bg-gray-700 rounded w-full mb-3"
          data-oid="eedyjs1"
        ></div>
        <div
          className="h-4 bg-gray-700 rounded w-5/6 mb-6"
          data-oid="s6mbif0"
        ></div>
        <div className="h-20 bg-gray-800 rounded mb-4" data-oid="jhcb5ot"></div>
        <div className="h-5 bg-gray-700 rounded w-1/4" data-oid="8h-8atq"></div>
      </div>
    );
  }

  // 渲染错误状态
  if (error) {
    return (
      <div
        className={`bg-gray-900 rounded-lg p-6 border border-red-700 ${className}`}
        data-oid="_mi4ukb"
      >
        <div
          className="flex items-center justify-between mb-4"
          data-oid="da50ysm"
        >
          <div
            className="flex items-center space-x-2 text-red-400"
            data-oid="2o4lnvu"
          >
            <FiAlertCircle data-oid="83zb9z:" />
            <h2 className="font-bold" data-oid="s6ws69c">
              加载失败
            </h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
              data-oid="5dlssfs"
            >
              <FiX data-oid="9buydln" />
            </button>
          )}
        </div>
        <p className="text-gray-300 mb-3" data-oid="64g-iar">
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
        data-oid="0:-:k0g"
      >
        <div
          className="flex justify-between items-center mb-4"
          data-oid="r1j0od_"
        >
          <h2 className="text-lg font-bold text-white" data-oid="6nkupx3">
            未找到能力
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
              data-oid="r9s8s66"
            >
              <FiX data-oid=":--c07w" />
            </button>
          )}
        </div>
        <p className="text-gray-400" data-oid="4:10tvq">
          无法加载指定的代理能力信息
        </p>
      </div>
    );
  }

  return (
    <div
      className={`bg-gray-900 rounded-lg p-6 border border-gray-700 ${className}`}
      data-oid="bi.p80p"
    >
      {/* 标题和关闭按钮 */}
      <div
        className="flex justify-between items-center mb-4"
        data-oid="d6wdge4"
      >
        <div className="flex items-center space-x-3" data-oid="pbedbx4">
          {getCapabilityIcon(capability.type)}
          <h2 className="text-xl font-bold text-white" data-oid="tf:vqlp">
            {capability.name}
          </h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800"
            data-oid=".._tw1u"
          >
            <FiX data-oid="plqqw4." />
          </button>
        )}
      </div>

      {/* 能力类型标签 */}
      <div className="mb-4" data-oid=".ep3ss:">
        <span
          className={`text-xs px-3 py-1 rounded-full border ${getTypeStyle(capability.type)}`}
          data-oid="hy25wvq"
        >
          {capability.type}
        </span>
      </div>

      {/* 能力描述 */}
      <div className="mb-4" data-oid="aq27543">
        <h3
          className="text-sm font-medium text-gray-400 mb-1"
          data-oid="1x8ibm6"
        >
          描述
        </h3>
        <p className="text-white" data-oid="47dy0tt">
          {capability.description}
        </p>
      </div>

      {/* 标签信息 */}
      {capability.params?.tags && capability.params.tags.length > 0 && (
        <div className="mb-4" data-oid="qp:jfln">
          <h3
            className="text-sm font-medium text-gray-400 mb-2"
            data-oid="nlu8csw"
          >
            标签
          </h3>
          <div className="flex flex-wrap gap-2" data-oid=":mc1vg.">
            {capability.params.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300"
                data-oid="aop__q5"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 工具相关信息 */}
      {capability.type === "tool" && capability.params?.toolId && (
        <div className="mb-4" data-oid="xs-k4x7">
          <h3
            className="text-sm font-medium text-gray-400 mb-1"
            data-oid="q0uwrrv"
          >
            关联工具
          </h3>
          <div
            className="bg-gray-800 bg-opacity-50 p-3 rounded"
            data-oid="xw8.qgf"
          >
            <div className="text-white font-mono text-sm" data-oid="x4-jv94">
              {capability.params.toolId}
            </div>
          </div>
        </div>
      )}

      {/* 参数详情 */}
      {capability.params && Object.keys(capability.params).length > 0 && (
        <div className="mb-2" data-oid="w83u95f">
          <button
            className="flex items-center justify-between w-full text-sm font-medium text-gray-400 hover:text-white mb-2"
            onClick={() => setParamsExpanded(!paramsExpanded)}
            data-oid="ul_p3s1"
          >
            <span data-oid="aa7c-_9">详细参数</span>
            {paramsExpanded ? (
              <FiChevronUp data-oid="cl4ocfz" />
            ) : (
              <FiChevronDown data-oid="vh_p3i2" />
            )}
          </button>

          {paramsExpanded && (
            <div
              className="bg-gray-800 bg-opacity-50 p-3 rounded font-mono text-sm text-gray-300 overflow-auto max-h-40"
              data-oid="ee3hqq0"
            >
              <pre data-oid="hd_6dt1">
                {JSON.stringify(capability.params, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* 能力ID */}
      <div className="mt-4 pt-4 border-t border-gray-800" data-oid="747pk2z">
        <div
          className="flex items-center justify-between text-xs text-gray-500"
          data-oid="ehol34r"
        >
          <span data-oid="6:x2l-m">能力 ID</span>
          <span className="font-mono" data-oid="0c:lsd:">
            {capability.id}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CapabilityDetail;
