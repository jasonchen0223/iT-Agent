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
        data-oid="y8l0m:-"
      >
        <div
          className="flex justify-between items-center mb-4"
          data-oid="914h3fk"
        >
          <div
            className="h-6 bg-gray-700 rounded w-1/4"
            data-oid="nvp.dgq"
          ></div>
          <div
            className="h-4 bg-gray-700 rounded w-24"
            data-oid="y8w:pgj"
          ></div>
        </div>
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          data-oid="plqfvq-"
        >
          <div
            className="h-32 bg-gray-800 bg-opacity-50 rounded-lg"
            data-oid="mgk-aft"
          ></div>
          <div
            className="h-32 bg-gray-800 bg-opacity-50 rounded-lg"
            data-oid="oah_l80"
          ></div>
          <div
            className="h-40 bg-gray-800 bg-opacity-50 rounded-lg"
            data-oid="2u-vznv"
          ></div>
          <div
            className="h-40 bg-gray-800 bg-opacity-50 rounded-lg"
            data-oid="9u4qgd1"
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
        data-oid="2krxtwo"
      >
        <div
          className="flex items-center space-x-2 text-red-400 mb-4"
          data-oid="fa7cva0"
        >
          <FiAlertCircle data-oid="mzlaet7" />
          <h2 className="font-bold" data-oid="bavlk.t">
            统计加载失败
          </h2>
        </div>
        <p className="text-gray-300 mb-3" data-oid="8ssvea.">
          {error}
        </p>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors flex items-center space-x-1"
          data-oid="wo1u76e"
        >
          <FiRefreshCw data-oid="huo-slp" />
          <span data-oid="jzzmbbx">重试</span>
        </button>
      </div>
    );
  }

  // 如果没有统计数据
  if (!stats) {
    return (
      <div
        className={`bg-gradient-to-br from-gray-900 to-indigo-900 rounded-lg shadow-xl p-6 ${className}`}
        data-oid="4u_o62m"
      >
        <div className="text-center text-gray-400 py-8" data-oid=":w47x0y">
          <p data-oid="27i:6xn">暂无统计数据</p>
          <button
            onClick={fetchStats}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors inline-flex items-center space-x-1"
            data-oid="36f-rij"
          >
            <FiRefreshCw data-oid="_t4rozb" />
            <span data-oid="n:xjn3q">刷新</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-br from-gray-900 to-indigo-900 rounded-lg shadow-xl p-6 ${className}`}
      data-oid="lf6mr.-"
    >
      {/* 标题和刷新按钮 */}
      <div
        className="flex justify-between items-center mb-6"
        data-oid="thu-iki"
      >
        <h2
          className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
          data-oid="b19dtfl"
        >
          交互统计
        </h2>

        <div className="flex items-center space-x-3" data-oid="jt_.-_:">
          {lastUpdated && (
            <span className="text-xs text-gray-400" data-oid="1h-10nl">
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
            data-oid="5id20vk"
          >
            <FiRefreshCw
              className={loading ? "animate-spin" : ""}
              data-oid="vbp70q6"
            />
          </button>
        </div>
      </div>

      {/* 总览卡片 */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        data-oid="_r0ocem"
      >
        <div
          className="bg-gray-800 bg-opacity-50 p-4 rounded-lg flex flex-col justify-between"
          data-oid="o_vdi-c"
        >
          <div className="text-gray-400 text-xs" data-oid="moh.mz.">
            总交互数
          </div>
          <div className="flex items-center space-x-2" data-oid="8:_ynig">
            <FiActivity
              className="text-indigo-400 text-2xl"
              data-oid="vbe2956"
            />

            <span className="text-2xl font-bold text-white" data-oid="w1tm8_6">
              {stats.totalInteractions}
            </span>
          </div>
        </div>

        <div
          className="bg-gray-800 bg-opacity-50 p-4 rounded-lg flex flex-col justify-between"
          data-oid=".0e:skg"
        >
          <div className="text-gray-400 text-xs" data-oid="fie2-mg">
            平均响应时间
          </div>
          <div className="flex items-center space-x-2" data-oid="i7m603z">
            <FiClock className="text-indigo-400 text-2xl" data-oid="8q6630r" />
            <span className="text-xl font-bold text-white" data-oid="f7lj89d">
              {formatResponseTime(stats.averageResponseTime)}
            </span>
          </div>
        </div>

        <div
          className="bg-gray-800 bg-opacity-50 p-4 rounded-lg flex flex-col justify-between"
          data-oid="6rb0jad"
        >
          <div className="text-gray-400 text-xs" data-oid="t1g2-de">
            消息类型数
          </div>
          <div className="flex items-center space-x-2" data-oid=":5vcmcu">
            <FiPieChart
              className="text-indigo-400 text-2xl"
              data-oid="1j-ku_d"
            />

            <span className="text-2xl font-bold text-white" data-oid="pm2eg:4">
              {Object.keys(stats.byType).length}
            </span>
          </div>
        </div>

        <div
          className="bg-gray-800 bg-opacity-50 p-4 rounded-lg flex flex-col justify-between"
          data-oid="7vlh93w"
        >
          <div className="text-gray-400 text-xs" data-oid=".f.uax_">
            交互角色数
          </div>
          <div className="flex items-center space-x-2" data-oid="e6_dq2_">
            <FiUsers className="text-indigo-400 text-2xl" data-oid="_vgzxsx" />
            <span className="text-2xl font-bold text-white" data-oid="3u5p.n2">
              {Object.keys(stats.byAgentRole).length}
            </span>
          </div>
        </div>
      </div>

      {/* 详细统计图表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-oid="0p7lt-q">
        {/* 按消息类型分布 */}
        <div
          className="bg-gray-800 bg-opacity-50 p-4 rounded-lg"
          data-oid="dlrxxik"
        >
          <h3 className="text-indigo-400 mb-4 font-medium" data-oid="gbo.1fh">
            按消息类型分布
          </h3>

          <div className="space-y-3" data-oid="__.mdzl">
            {Object.entries(stats.byType)
              .sort((a, b) => b[1] - a[1])
              .map(([type, count], index) => (
                <div key={type} data-oid="i3v7xt8">
                  <div
                    className="flex justify-between items-center mb-1"
                    data-oid="7auvw0v"
                  >
                    <span className="text-gray-300" data-oid="zvvdqok">
                      {type}
                    </span>
                    <div
                      className="flex items-center space-x-2"
                      data-oid="acy0jzv"
                    >
                      <span
                        className="text-gray-400 text-sm"
                        data-oid="lfvw72_"
                      >
                        {count}
                      </span>
                      <span
                        className="text-gray-500 text-xs"
                        data-oid="8i.k6xm"
                      >
                        ({calculatePercentage(count, stats.totalInteractions)})
                      </span>
                    </div>
                  </div>
                  <div
                    className="w-full bg-gray-700 rounded-full h-2"
                    data-oid="3ivd.cp"
                  >
                    <div
                      className={`${getColor(index)} h-2 rounded-full`}
                      style={{
                        width: calculatePercentage(
                          count,
                          stats.totalInteractions,
                        ),
                      }}
                      data-oid=".4ie187"
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* 按角色分布 */}
        <div
          className="bg-gray-800 bg-opacity-50 p-4 rounded-lg"
          data-oid="2.1y0_u"
        >
          <h3 className="text-indigo-400 mb-4 font-medium" data-oid="o:a_jfg">
            按角色分布
          </h3>

          <div className="space-y-3" data-oid="njlwea:">
            {Object.entries(stats.byAgentRole)
              .sort((a, b) => b[1] - a[1])
              .map(([role, count], index) => (
                <div key={role} data-oid="24ad_76">
                  <div
                    className="flex justify-between items-center mb-1"
                    data-oid="3w5uqq_"
                  >
                    <span className="text-gray-300" data-oid="an_rip9">
                      {role}
                    </span>
                    <div
                      className="flex items-center space-x-2"
                      data-oid="iz4l4pn"
                    >
                      <span
                        className="text-gray-400 text-sm"
                        data-oid="_4iy.u_"
                      >
                        {count}
                      </span>
                      <span
                        className="text-gray-500 text-xs"
                        data-oid="ozc7x2b"
                      >
                        ({calculatePercentage(count, stats.totalInteractions)})
                      </span>
                    </div>
                  </div>
                  <div
                    className="w-full bg-gray-700 rounded-full h-2"
                    data-oid="9o54hs3"
                  >
                    <div
                      className={`${getColor(index + 5)} h-2 rounded-full`}
                      style={{
                        width: calculatePercentage(
                          count,
                          stats.totalInteractions,
                        ),
                      }}
                      data-oid="3j8s3dm"
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* 按时间分布 */}
        <div
          className="bg-gray-800 bg-opacity-50 p-4 rounded-lg md:col-span-2"
          data-oid="l4fjc8:"
        >
          <h3 className="text-indigo-400 mb-4 font-medium" data-oid="1k1nq8p">
            24小时活动分布
          </h3>

          <div className="relative h-40 mt-2" data-oid="g7d3:xc">
            {/* 时间轴 */}
            <div
              className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500"
              data-oid="g.7219f"
            >
              {[0, 6, 12, 18, 23].map((hour) => (
                <div key={hour} className="text-center" data-oid=".nvucqj">
                  {hour}:00
                </div>
              ))}
            </div>

            {/* 柱状图 */}
            <div
              className="absolute bottom-6 left-0 right-0 flex items-end h-32"
              data-oid="3u.48v6"
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
                    data-oid="o.s-.ld"
                  >
                    <div
                      className={`${
                        hour >= 8 && hour <= 18
                          ? "bg-indigo-500"
                          : "bg-purple-600"
                      } rounded-t hover:bg-opacity-90 transition-all duration-200`}
                      style={{ height: `${height}%` }}
                      data-oid="ingn.0v"
                    ></div>

                    {/* 悬停提示 */}
                    <div
                      className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
                      data-oid="rluvk89"
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
