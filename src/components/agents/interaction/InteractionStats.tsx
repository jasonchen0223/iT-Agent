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
        data-oid="4vcbbor"
      >
        <div
          className="flex justify-between items-center mb-4"
          data-oid="0x628-6"
        >
          <div
            className="h-6 bg-gray-700 rounded w-1/4"
            data-oid="j-b8:d3"
          ></div>
          <div
            className="h-4 bg-gray-700 rounded w-24"
            data-oid="btogm3z"
          ></div>
        </div>
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          data-oid="_a-go9v"
        >
          <div
            className="h-32 bg-gray-800 bg-opacity-50 rounded-lg"
            data-oid="_erl3pq"
          ></div>
          <div
            className="h-32 bg-gray-800 bg-opacity-50 rounded-lg"
            data-oid="j1r-n02"
          ></div>
          <div
            className="h-40 bg-gray-800 bg-opacity-50 rounded-lg"
            data-oid="3ty6700"
          ></div>
          <div
            className="h-40 bg-gray-800 bg-opacity-50 rounded-lg"
            data-oid="0fn9n7g"
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
        data-oid="9awqxp:"
      >
        <div
          className="flex items-center space-x-2 text-red-400 mb-4"
          data-oid="omkxt6m"
        >
          <FiAlertCircle data-oid="ajr.yig" />
          <h2 className="font-bold" data-oid="g9-xirs">
            统计加载失败
          </h2>
        </div>
        <p className="text-gray-300 mb-3" data-oid="xuf4amb">
          {error}
        </p>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors flex items-center space-x-1"
          data-oid="tgc.7r2"
        >
          <FiRefreshCw data-oid="7p-j9.q" />
          <span data-oid="5wzjl66">重试</span>
        </button>
      </div>
    );
  }

  // 如果没有统计数据
  if (!stats) {
    return (
      <div
        className={`bg-gradient-to-br from-gray-900 to-indigo-900 rounded-lg shadow-xl p-6 ${className}`}
        data-oid="t2o6bny"
      >
        <div className="text-center text-gray-400 py-8" data-oid="0mqt5vr">
          <p data-oid="i:nutf8">暂无统计数据</p>
          <button
            onClick={fetchStats}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors inline-flex items-center space-x-1"
            data-oid="szv2nmz"
          >
            <FiRefreshCw data-oid="o772u_b" />
            <span data-oid="khgl.l5">刷新</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-br from-gray-900 to-indigo-900 rounded-lg shadow-xl p-6 ${className}`}
      data-oid="vcb.vfn"
    >
      {/* 标题和刷新按钮 */}
      <div
        className="flex justify-between items-center mb-6"
        data-oid="cte64la"
      >
        <h2
          className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
          data-oid="xzdvzkw"
        >
          交互统计
        </h2>

        <div className="flex items-center space-x-3" data-oid="covqv8l">
          {lastUpdated && (
            <span className="text-xs text-gray-400" data-oid="sz301m2">
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
            data-oid="-j:e4rh"
          >
            <FiRefreshCw
              className={loading ? "animate-spin" : ""}
              data-oid="8vftzcg"
            />
          </button>
        </div>
      </div>

      {/* 总览卡片 */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        data-oid="uzjn4u:"
      >
        <div
          className="bg-gray-800 bg-opacity-50 p-4 rounded-lg flex flex-col justify-between"
          data-oid="sn0m6lh"
        >
          <div className="text-gray-400 text-xs" data-oid="75tmr6i">
            总交互数
          </div>
          <div className="flex items-center space-x-2" data-oid="808zdf7">
            <FiActivity
              className="text-indigo-400 text-2xl"
              data-oid="tl633_9"
            />

            <span className="text-2xl font-bold text-white" data-oid="rkr5isi">
              {stats.totalInteractions}
            </span>
          </div>
        </div>

        <div
          className="bg-gray-800 bg-opacity-50 p-4 rounded-lg flex flex-col justify-between"
          data-oid="3aaioq7"
        >
          <div className="text-gray-400 text-xs" data-oid="oz0uk.n">
            平均响应时间
          </div>
          <div className="flex items-center space-x-2" data-oid="xt4zaz4">
            <FiClock className="text-indigo-400 text-2xl" data-oid="-vxcbca" />
            <span className="text-xl font-bold text-white" data-oid="3v-oe5o">
              {formatResponseTime(stats.averageResponseTime)}
            </span>
          </div>
        </div>

        <div
          className="bg-gray-800 bg-opacity-50 p-4 rounded-lg flex flex-col justify-between"
          data-oid="uz63.jg"
        >
          <div className="text-gray-400 text-xs" data-oid="rdw2yn2">
            消息类型数
          </div>
          <div className="flex items-center space-x-2" data-oid="36cl97d">
            <FiPieChart
              className="text-indigo-400 text-2xl"
              data-oid="k-:og2p"
            />

            <span className="text-2xl font-bold text-white" data-oid="aq1f1gu">
              {Object.keys(stats.byType).length}
            </span>
          </div>
        </div>

        <div
          className="bg-gray-800 bg-opacity-50 p-4 rounded-lg flex flex-col justify-between"
          data-oid="uw9tvf1"
        >
          <div className="text-gray-400 text-xs" data-oid="d7iqjtj">
            交互角色数
          </div>
          <div className="flex items-center space-x-2" data-oid="ee8.vwr">
            <FiUsers className="text-indigo-400 text-2xl" data-oid="po90.m4" />
            <span className="text-2xl font-bold text-white" data-oid=":a53py_">
              {Object.keys(stats.byAgentRole).length}
            </span>
          </div>
        </div>
      </div>

      {/* 详细统计图表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-oid="rpzznpm">
        {/* 按消息类型分布 */}
        <div
          className="bg-gray-800 bg-opacity-50 p-4 rounded-lg"
          data-oid="_4jncl_"
        >
          <h3 className="text-indigo-400 mb-4 font-medium" data-oid="63tqrmz">
            按消息类型分布
          </h3>

          <div className="space-y-3" data-oid="lh1ya37">
            {Object.entries(stats.byType)
              .sort((a, b) => b[1] - a[1])
              .map(([type, count], index) => (
                <div key={type} data-oid="w79di_3">
                  <div
                    className="flex justify-between items-center mb-1"
                    data-oid="z2n-sd0"
                  >
                    <span className="text-gray-300" data-oid="9v98qeo">
                      {type}
                    </span>
                    <div
                      className="flex items-center space-x-2"
                      data-oid="jsocgjp"
                    >
                      <span
                        className="text-gray-400 text-sm"
                        data-oid="ptqdba3"
                      >
                        {count}
                      </span>
                      <span
                        className="text-gray-500 text-xs"
                        data-oid="q5pzsg."
                      >
                        ({calculatePercentage(count, stats.totalInteractions)})
                      </span>
                    </div>
                  </div>
                  <div
                    className="w-full bg-gray-700 rounded-full h-2"
                    data-oid="g-q.civ"
                  >
                    <div
                      className={`${getColor(index)} h-2 rounded-full`}
                      style={{
                        width: calculatePercentage(
                          count,
                          stats.totalInteractions,
                        ),
                      }}
                      data-oid=":-kxz4e"
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* 按角色分布 */}
        <div
          className="bg-gray-800 bg-opacity-50 p-4 rounded-lg"
          data-oid="r-zbqs2"
        >
          <h3 className="text-indigo-400 mb-4 font-medium" data-oid="0kq7x.u">
            按角色分布
          </h3>

          <div className="space-y-3" data-oid="-vkaeok">
            {Object.entries(stats.byAgentRole)
              .sort((a, b) => b[1] - a[1])
              .map(([role, count], index) => (
                <div key={role} data-oid="qi4.gua">
                  <div
                    className="flex justify-between items-center mb-1"
                    data-oid="jqo3iz7"
                  >
                    <span className="text-gray-300" data-oid="umn3:cf">
                      {role}
                    </span>
                    <div
                      className="flex items-center space-x-2"
                      data-oid="297td6y"
                    >
                      <span
                        className="text-gray-400 text-sm"
                        data-oid="lug.rgr"
                      >
                        {count}
                      </span>
                      <span
                        className="text-gray-500 text-xs"
                        data-oid="da.w5bc"
                      >
                        ({calculatePercentage(count, stats.totalInteractions)})
                      </span>
                    </div>
                  </div>
                  <div
                    className="w-full bg-gray-700 rounded-full h-2"
                    data-oid="5jdae65"
                  >
                    <div
                      className={`${getColor(index + 5)} h-2 rounded-full`}
                      style={{
                        width: calculatePercentage(
                          count,
                          stats.totalInteractions,
                        ),
                      }}
                      data-oid="-kn.7fu"
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* 按时间分布 */}
        <div
          className="bg-gray-800 bg-opacity-50 p-4 rounded-lg md:col-span-2"
          data-oid="cj5c2rc"
        >
          <h3 className="text-indigo-400 mb-4 font-medium" data-oid="8-itohq">
            24小时活动分布
          </h3>

          <div className="relative h-40 mt-2" data-oid="qcp3k6s">
            {/* 时间轴 */}
            <div
              className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500"
              data-oid="ie5x71:"
            >
              {[0, 6, 12, 18, 23].map((hour) => (
                <div key={hour} className="text-center" data-oid="a2o:fxi">
                  {hour}:00
                </div>
              ))}
            </div>

            {/* 柱状图 */}
            <div
              className="absolute bottom-6 left-0 right-0 flex items-end h-32"
              data-oid="v1qi5ov"
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
                    data-oid="x0p1g83"
                  >
                    <div
                      className={`${
                        hour >= 8 && hour <= 18
                          ? "bg-indigo-500"
                          : "bg-purple-600"
                      } rounded-t hover:bg-opacity-90 transition-all duration-200`}
                      style={{ height: `${height}%` }}
                      data-oid="uj959is"
                    ></div>

                    {/* 悬停提示 */}
                    <div
                      className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
                      data-oid="0m3l4il"
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
