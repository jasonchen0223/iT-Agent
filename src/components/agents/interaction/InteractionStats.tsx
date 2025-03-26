"use client";

import React, { useState, useEffect } from "react";
import {
  FiActivity,
  FiClock,
  FiPieChart,
  FiUsers,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";

interface InteractionStatsProps {
  agentId: string;
  timeRange?: number;
  refreshInterval?: number;
  className?: string;
}

interface StatsData {
  totalInteractions: number;
  byType: Record<string, number>;
  byAgentRole: Record<string, number>;
  averageResponseTime: number;
  timeDistribution: Record<string, number>;
}

/**
 * 代理交互统计组件
 */
const InteractionStats: React.FC<InteractionStatsProps> = ({
  agentId,
  timeRange = 30,
  refreshInterval = 0, // 默认不自动刷新，值为毫秒
  className = "",
}) => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // 加载统计数据
  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/agents/${agentId}/interactions?timeRange=${timeRange}`,
        {
          method: "HEAD",
        },
      );

      if (!response.ok) {
        throw new Error("获取统计数据失败");
      }

      const data = await response.json();
      setStats(data.data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载失败");
    } finally {
      setLoading(false);
    }
  };

  // 初始加载和自动刷新
  useEffect(() => {
    fetchStats();

    let intervalId: NodeJS.Timeout | null = null;

    if (refreshInterval > 0) {
      intervalId = setInterval(fetchStats, refreshInterval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [agentId, timeRange, refreshInterval]);

  // 计算百分比
  const calculatePercentage = (value: number, total: number): string => {
    if (total === 0) return "0%";
    return `${Math.round((value / total) * 100)}%`;
  };

  // 格式化响应时间
  const formatResponseTime = (milliseconds: number): string => {
    if (milliseconds < 1000) {
      return `${Math.round(milliseconds)}毫秒`;
    } else if (milliseconds < 60000) {
      return `${(milliseconds / 1000).toFixed(1)}秒`;
    } else {
      return `${(milliseconds / 60000).toFixed(1)}分钟`;
    }
  };

  // 生成颜色
  const getColor = (index: number): string => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-cyan-500",
    ];

    return colors[index % colors.length];
  };

  // 渲染加载中状态
  if (loading && !stats) {
    return (
      <div
        className={`bg-gradient-to-br from-gray-900 to-indigo-900 rounded-lg shadow-xl p-6 animate-pulse ${className}`}
        data-oid="8xzj6o7"
      >
        <div
          className="flex justify-between items-center mb-4"
          data-oid=":a.ur88"
        >
          <div
            className="h-6 bg-gray-700 rounded w-1/4"
            data-oid="mqh:_ck"
          ></div>
          <div
            className="h-4 bg-gray-700 rounded w-24"
            data-oid="7nezhz5"
          ></div>
        </div>
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          data-oid="feno.4o"
        >
          <div
            className="h-32 bg-gray-800 bg-opacity-50 rounded-lg"
            data-oid="1ua1tkw"
          ></div>
          <div
            className="h-32 bg-gray-800 bg-opacity-50 rounded-lg"
            data-oid="8pfdnmu"
          ></div>
          <div
            className="h-40 bg-gray-800 bg-opacity-50 rounded-lg"
            data-oid="7i:1e:f"
          ></div>
          <div
            className="h-40 bg-gray-800 bg-opacity-50 rounded-lg"
            data-oid="gku96sr"
          ></div>
        </div>
      </div>
    );
  }

  // 渲染错误状态
  if (error && !stats) {
    return (
      <div
        className={`bg-gradient-to-br from-gray-900 to-indigo-900 rounded-lg shadow-xl p-6 ${className}`}
        data-oid="0unwps:"
      >
        <div
          className="flex items-center space-x-2 text-red-400 mb-4"
          data-oid="y8eds42"
        >
          <FiAlertCircle data-oid="cfpe_-f" />
          <h2 className="font-bold" data-oid="gtidcdn">
            统计加载失败
          </h2>
        </div>
        <p className="text-gray-300 mb-3" data-oid=":gzcmc8">
          {error}
        </p>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors flex items-center space-x-1"
          data-oid="p0km2_k"
        >
          <FiRefreshCw data-oid="wwozrlp" />
          <span data-oid="d9_z9z:">重试</span>
        </button>
      </div>
    );
  }

  // 如果没有统计数据
  if (!stats) {
    return (
      <div
        className={`bg-gradient-to-br from-gray-900 to-indigo-900 rounded-lg shadow-xl p-6 ${className}`}
        data-oid="sgjjeaj"
      >
        <div className="text-center text-gray-400 py-8" data-oid="y31r79f">
          <p data-oid="gcmsnte">暂无统计数据</p>
          <button
            onClick={fetchStats}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors inline-flex items-center space-x-1"
            data-oid="lk:4no:"
          >
            <FiRefreshCw data-oid="2_q99mc" />
            <span data-oid="r11p066">刷新</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-br from-gray-900 to-indigo-900 rounded-lg shadow-xl p-6 ${className}`}
      data-oid=":4_f3t_"
    >
      {/* 标题和刷新按钮 */}
      <div
        className="flex justify-between items-center mb-6"
        data-oid="n694n6:"
      >
        <h2
          className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
          data-oid="ci8frzm"
        >
          交互统计
        </h2>

        <div className="flex items-center space-x-3" data-oid="nuaw:ld">
          {lastUpdated && (
            <span className="text-xs text-gray-400" data-oid="aneugj_">
              最后更新: {lastUpdated.toLocaleTimeString("zh-CN")}
            </span>
          )}

          <button
            onClick={fetchStats}
            disabled={loading}
            className={`p-2 rounded-full ${
              loading
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            } text-white transition-colors`}
            title="刷新数据"
            data-oid="t84.hxq"
          >
            <FiRefreshCw
              className={loading ? "animate-spin" : ""}
              data-oid="::qe9ov"
            />
          </button>
        </div>
      </div>

      {/* 总览卡片 */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        data-oid="k14t.oa"
      >
        <div
          className="bg-gray-800 bg-opacity-50 p-4 rounded-lg flex flex-col justify-between"
          data-oid="tg7mnil"
        >
          <div className="text-gray-400 text-xs" data-oid="lkjy2ms">
            总交互数
          </div>
          <div className="flex items-center space-x-2" data-oid="hjnzl-r">
            <FiActivity
              className="text-indigo-400 text-2xl"
              data-oid="dlq9oms"
            />

            <span className="text-2xl font-bold text-white" data-oid="5yr34sx">
              {stats.totalInteractions}
            </span>
          </div>
        </div>

        <div
          className="bg-gray-800 bg-opacity-50 p-4 rounded-lg flex flex-col justify-between"
          data-oid="qofwiwy"
        >
          <div className="text-gray-400 text-xs" data-oid="v-adup7">
            平均响应时间
          </div>
          <div className="flex items-center space-x-2" data-oid="ia2n5c-">
            <FiClock className="text-indigo-400 text-2xl" data-oid="odfeoxp" />
            <span className="text-xl font-bold text-white" data-oid="76f2qlo">
              {formatResponseTime(stats.averageResponseTime)}
            </span>
          </div>
        </div>

        <div
          className="bg-gray-800 bg-opacity-50 p-4 rounded-lg flex flex-col justify-between"
          data-oid="pw1.78_"
        >
          <div className="text-gray-400 text-xs" data-oid=".inszbr">
            消息类型数
          </div>
          <div className="flex items-center space-x-2" data-oid="0rt03:a">
            <FiPieChart
              className="text-indigo-400 text-2xl"
              data-oid="e38aluc"
            />

            <span className="text-2xl font-bold text-white" data-oid="nd213fm">
              {Object.keys(stats.byType).length}
            </span>
          </div>
        </div>

        <div
          className="bg-gray-800 bg-opacity-50 p-4 rounded-lg flex flex-col justify-between"
          data-oid="eezmy81"
        >
          <div className="text-gray-400 text-xs" data-oid="0pk3tyz">
            交互角色数
          </div>
          <div className="flex items-center space-x-2" data-oid="f1ik7yn">
            <FiUsers className="text-indigo-400 text-2xl" data-oid="3on.y.o" />
            <span className="text-2xl font-bold text-white" data-oid=":6-z428">
              {Object.keys(stats.byAgentRole).length}
            </span>
          </div>
        </div>
      </div>

      {/* 详细统计图表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-oid="t3lr8sh">
        {/* 按消息类型分布 */}
        <div
          className="bg-gray-800 bg-opacity-50 p-4 rounded-lg"
          data-oid="y4qo1vo"
        >
          <h3 className="text-indigo-400 mb-4 font-medium" data-oid="efqyvs4">
            按消息类型分布
          </h3>

          <div className="space-y-3" data-oid="v-dmge-">
            {Object.entries(stats.byType)
              .sort((a, b) => b[1] - a[1])
              .map(([type, count], index) => (
                <div key={type} data-oid="llb4ti5">
                  <div
                    className="flex justify-between items-center mb-1"
                    data-oid="_3zjbv."
                  >
                    <span className="text-gray-300" data-oid="7hw-nd1">
                      {type}
                    </span>
                    <div
                      className="flex items-center space-x-2"
                      data-oid="1.-x8lr"
                    >
                      <span
                        className="text-gray-400 text-sm"
                        data-oid="xnknuo:"
                      >
                        {count}
                      </span>
                      <span
                        className="text-gray-500 text-xs"
                        data-oid="_au:hjm"
                      >
                        ({calculatePercentage(count, stats.totalInteractions)})
                      </span>
                    </div>
                  </div>
                  <div
                    className="w-full bg-gray-700 rounded-full h-2"
                    data-oid="tz7gtl_"
                  >
                    <div
                      className={`${getColor(index)} h-2 rounded-full`}
                      style={{
                        width: calculatePercentage(
                          count,
                          stats.totalInteractions,
                        ),
                      }}
                      data-oid="15sb5u9"
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* 按角色分布 */}
        <div
          className="bg-gray-800 bg-opacity-50 p-4 rounded-lg"
          data-oid="nvm88d4"
        >
          <h3 className="text-indigo-400 mb-4 font-medium" data-oid="e_t59g.">
            按角色分布
          </h3>

          <div className="space-y-3" data-oid="5xfj0g8">
            {Object.entries(stats.byAgentRole)
              .sort((a, b) => b[1] - a[1])
              .map(([role, count], index) => (
                <div key={role} data-oid="zcxvz3g">
                  <div
                    className="flex justify-between items-center mb-1"
                    data-oid="4ap-5jc"
                  >
                    <span className="text-gray-300" data-oid="8lx_q.7">
                      {role}
                    </span>
                    <div
                      className="flex items-center space-x-2"
                      data-oid="9wi1guc"
                    >
                      <span
                        className="text-gray-400 text-sm"
                        data-oid="u9k:95b"
                      >
                        {count}
                      </span>
                      <span
                        className="text-gray-500 text-xs"
                        data-oid="u4p8t.-"
                      >
                        ({calculatePercentage(count, stats.totalInteractions)})
                      </span>
                    </div>
                  </div>
                  <div
                    className="w-full bg-gray-700 rounded-full h-2"
                    data-oid="rpgvw5."
                  >
                    <div
                      className={`${getColor(index + 5)} h-2 rounded-full`}
                      style={{
                        width: calculatePercentage(
                          count,
                          stats.totalInteractions,
                        ),
                      }}
                      data-oid=".ycepmg"
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* 按时间分布 */}
        <div
          className="bg-gray-800 bg-opacity-50 p-4 rounded-lg md:col-span-2"
          data-oid="6k8:4u6"
        >
          <h3 className="text-indigo-400 mb-4 font-medium" data-oid="9a2.zak">
            24小时活动分布
          </h3>

          <div className="relative h-40 mt-2" data-oid="c16rmkc">
            {/* 时间轴 */}
            <div
              className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500"
              data-oid="05rkt3c"
            >
              {[0, 6, 12, 18, 23].map((hour) => (
                <div key={hour} className="text-center" data-oid="__lpmel">
                  {hour}:00
                </div>
              ))}
            </div>

            {/* 柱状图 */}
            <div
              className="absolute bottom-6 left-0 right-0 flex items-end h-32"
              data-oid="omlp0e-"
            >
              {Array.from({ length: 24 }).map((_, hour) => {
                const hourKey = `${hour}:00`;
                const count = stats.timeDistribution[hourKey] || 0;
                const maxCount = Math.max(
                  ...Object.values(stats.timeDistribution),
                );
                const height = maxCount > 0 ? (count / maxCount) * 100 : 0;

                return (
                  <div
                    key={hour}
                    className="flex-1 mx-px group relative"
                    data-oid="5j1rf6i"
                  >
                    <div
                      className={`${
                        hour >= 8 && hour <= 18
                          ? "bg-indigo-500"
                          : "bg-purple-600"
                      } rounded-t hover:bg-opacity-90 transition-all duration-200`}
                      style={{ height: `${height}%` }}
                      data-oid="g-3g0p_"
                    ></div>

                    {/* 悬停提示 */}
                    <div
                      className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
                      data-oid="5n:u5h8"
                    >
                      {hourKey}: {count}次
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractionStats;
