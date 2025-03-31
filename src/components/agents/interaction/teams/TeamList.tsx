"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FiUsers,
  FiUser,
  FiTag,
  FiCalendar,
  FiPlay,
  FiEdit,
  FiTrash2,
  FiArrowRight,
} from "react-icons/fi";
import { TeamType, TeamStatus } from "@/services/agent-team-service";

// 团队信息接口
interface ITeam {
  id: string;
  name: string;
  description: string | null;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  members: ITeamMember[];
}

// 团队成员接口
interface ITeamMember {
  id: string;
  teamId: string;
  configId: string;
  role: string;
  position: number;
  isRequired: boolean;
  metadata: any;
  config: {
    id: string;
    name: string;
    role: string;
    icon: string | null;
    color: string | null;
  };
}

// 筛选条件接口
interface IFilterOptions {
  search: string;
  type: string;
  status: string;
}

// 组件属性接口
interface TeamListProps {
  className?: string;
  onTeamSelect?: (teamId: string) => void;
}

/**
 * 代理团队列表组件
 */
const TeamList: React.FC<TeamListProps> = ({
  className = "",
  onTeamSelect,
}) => {
  // 团队列表
  const [teams, setTeams] = useState<ITeam[]>([]);

  // 加载状态
  const [loading, setLoading] = useState<boolean>(true);

  // 错误信息
  const [error, setError] = useState<string | null>(null);

  // 筛选条件
  const [filter, setFilter] = useState<IFilterOptions>({
    search: "",
    type: "",
    status: "",
  });

  // 分页信息
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  // 删除确认
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // 加载团队数据
  const loadTeams = async () => {
    try {
      setLoading(true);
      setError(null);

      // 构建查询参数
      const params = new URLSearchParams();
      if (filter.search) params.append("search", filter.search);
      if (filter.type) params.append("type", filter.type);
      if (filter.status) params.append("status", filter.status);
      params.append("page", pagination.page.toString());
      params.append("limit", pagination.limit.toString());

      const response = await fetch(`/api/agents/teams?${params.toString()}`);

      if (!response.ok) {
        throw new Error("获取团队列表失败");
      }

      const data = await response.json();

      if (data.success) {
        setTeams(data.data.items);
        setPagination((prev) => ({
          ...prev,
          total: data.data.total,
        }));
      } else {
        throw new Error(data.error || "获取团队列表失败");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载失败");
      console.error("加载团队列表失败:", err);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.type, filter.status, pagination.page, pagination.limit]);

  // 搜索处理
  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    loadTeams();
  };

  // 重置筛选
  const resetFilters = () => {
    setFilter({
      search: "",
      type: "",
      status: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // 删除团队
  const deleteTeam = async (teamId: string) => {
    try {
      setLoading(true);

      const response = await fetch(`/api/agents/teams/${teamId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("删除团队失败");
      }

      const data = await response.json();

      if (data.success) {
        // 从列表中移除
        setTeams(teams.filter((team) => team.id !== teamId));
        setDeleteConfirm(null);
      } else {
        throw new Error(data.error || "删除团队失败");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除失败");
      console.error("删除团队失败:", err);
    } finally {
      setLoading(false);
    }
  };

  // 启动团队
  const startTeam = async (teamId: string) => {
    try {
      setLoading(true);

      const response = await fetch(`/api/agents/teams/${teamId}/start`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("启动团队失败");
      }

      const data = await response.json();

      if (data.success) {
        // 如果有会话ID，可以跳转到会话页面
        if (data.data.sessionId && onTeamSelect) {
          onTeamSelect(data.data.sessionId);
        }
      } else {
        throw new Error(data.error || "启动团队失败");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "启动失败");
      console.error("启动团队失败:", err);
    } finally {
      setLoading(false);
    }
  };

  // 获取团队类型标签
  const getTeamTypeLabel = (type: string): JSX.Element => {
    switch (type) {
      case TeamType.WORKFLOW:
        return (
          <span
            className="space-badge text-xs px-2 py-1 bg-blue-900/40 text-blue-300 border border-blue-500"
            data-oid="0e-_336"
          >
            工作流
          </span>
        );

      case TeamType.CONVERSATION:
        return (
          <span
            className="space-badge text-xs px-2 py-1 bg-green-900/40 text-green-300 border border-green-500"
            data-oid="olk2_2w"
          >
            会话
          </span>
        );

      case TeamType.PARALLEL:
        return (
          <span
            className="space-badge text-xs px-2 py-1 bg-purple-900/40 text-purple-300 border border-purple-500"
            data-oid="ofnv3gc"
          >
            并行
          </span>
        );

      default:
        return (
          <span
            className="space-badge text-xs px-2 py-1 bg-gray-800 text-gray-300 border border-gray-600"
            data-oid="knuasyt"
          >
            {type}
          </span>
        );
    }
  };

  // 获取团队状态标签
  const getTeamStatusLabel = (status: string): JSX.Element => {
    switch (status) {
      case TeamStatus.ACTIVE:
        return (
          <span
            className="space-badge text-xs px-2 py-1 bg-green-900/40 text-green-300"
            data-oid=":3ghxol"
          >
            活跃
          </span>
        );

      case TeamStatus.INACTIVE:
        return (
          <span
            className="space-badge text-xs px-2 py-1 bg-gray-800 text-gray-300"
            data-oid="6yzw1ca"
          >
            非活跃
          </span>
        );

      case TeamStatus.ARCHIVED:
        return (
          <span
            className="space-badge text-xs px-2 py-1 bg-amber-900/40 text-amber-300"
            data-oid="5_u75gl"
          >
            已归档
          </span>
        );

      default:
        return (
          <span
            className="space-badge text-xs px-2 py-1 bg-gray-800 text-gray-300"
            data-oid="xa320t6"
          >
            {status}
          </span>
        );
    }
  };

  // 格式化日期
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // 计算总页数
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className={`${className}`} data-oid="bjv_uyn">
      {/* 筛选栏 */}
      <div className="space-card p-4 mb-5" data-oid="bp0ncaa">
        <div className="flex flex-wrap gap-3" data-oid="4npq9zz">
          <div className="flex-1 min-w-[200px]" data-oid="_ytse5-">
            <input
              type="text"
              value={filter.search}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, search: e.target.value }))
              }
              placeholder="搜索团队..."
              className="space-input w-full"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              data-oid="f4o_txi"
            />
          </div>
          <div className="w-40" data-oid="2pyvt55">
            <select
              value={filter.type}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, type: e.target.value }))
              }
              className="space-select w-full"
              data-oid="y18d_::"
            >
              <option value="" data-oid="m_.9j.g">
                所有类型
              </option>
              <option value={TeamType.WORKFLOW} data-oid="w2ztrkr">
                工作流
              </option>
              <option value={TeamType.CONVERSATION} data-oid="x05-7ht">
                会话
              </option>
              <option value={TeamType.PARALLEL} data-oid=".ltxws_">
                并行
              </option>
            </select>
          </div>
          <div className="w-40" data-oid="v17v2mn">
            <select
              value={filter.status}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, status: e.target.value }))
              }
              className="space-select w-full"
              data-oid="-yb4bu7"
            >
              <option value="" data-oid="wv8qdm2">
                所有状态
              </option>
              <option value={TeamStatus.ACTIVE} data-oid="pv7ffko">
                活跃
              </option>
              <option value={TeamStatus.INACTIVE} data-oid="1svoy6b">
                非活跃
              </option>
              <option value={TeamStatus.ARCHIVED} data-oid="wyy8dzi">
                已归档
              </option>
            </select>
          </div>
          <div className="flex gap-2" data-oid="eaq_7df">
            <button
              onClick={handleSearch}
              className="space-button bg-indigo-600 text-white"
              data-oid="04ygham"
            >
              搜索
            </button>
            <button
              onClick={resetFilters}
              className="space-button bg-slate-700 text-white"
              data-oid="1c2dshd"
            >
              重置
            </button>
          </div>
        </div>
      </div>

      {/* 错误显示 */}
      {error && (
        <div className="space-card p-4 mb-5 border-red-500" data-oid="t.64i66">
          <p className="text-red-400" data-oid="ev6i:ve">
            {error}
          </p>
        </div>
      )}

      {/* 团队列表 */}
      {loading ? (
        <div className="space-card p-8 text-center" data-oid="2..eh8u">
          <div className="flex items-center justify-center" data-oid="tva2hk-">
            <div
              className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"
              data-oid="3-j_ofg"
            ></div>
            <span className="ml-2" data-oid="4eiw9t2">
              加载中...
            </span>
          </div>
        </div>
      ) : teams.length === 0 ? (
        <div className="space-card p-8 text-center" data-oid="5vs7:26">
          <p className="text-slate-400" data-oid="s46t-0w">
            暂无团队数据
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          data-oid="4q5a4im"
        >
          {teams.map((team) => (
            <div
              key={team.id}
              className="space-card relative group"
              data-oid="xeuzab."
            >
              <div className="p-5" data-oid="49_k0e:">
                <div
                  className="flex justify-between items-start mb-3"
                  data-oid="ukhva.x"
                >
                  <h3
                    className="text-lg font-semibold text-indigo-300 truncate"
                    data-oid="bwfft0e"
                  >
                    {team.name}
                  </h3>
                  <div className="flex space-x-1" data-oid="8-krpq7">
                    {getTeamTypeLabel(team.type)}
                    {getTeamStatusLabel(team.status)}
                  </div>
                </div>

                <p
                  className="text-sm text-slate-300 mb-4 line-clamp-2"
                  data-oid="0sr85d1"
                >
                  {team.description || "没有描述"}
                </p>

                <div
                  className="flex items-center text-xs text-slate-400 mb-4"
                  data-oid="m.35bww"
                >
                  <FiCalendar className="mr-1" data-oid="g6a41:6" />
                  <span data-oid="ac2d8_p">
                    创建于: {new Date(team.createdAt).toLocaleString("zh-CN")}
                  </span>
                </div>

                {team.members && team.members.length > 0 && (
                  <div className="mb-4" data-oid="k5x5slj">
                    <div
                      className="text-xs text-slate-400 mb-2 flex items-center"
                      data-oid="2lvywd7"
                    >
                      <FiUsers className="mr-1" data-oid="c1qbjvd" />
                      <span data-oid="zq2:jdy">
                        成员 ({team.members.length})
                      </span>
                    </div>
                    <div
                      className="flex -space-x-2 overflow-hidden"
                      data-oid="ohm4bxw"
                    >
                      {team.members.slice(0, 5).map((member) => (
                        <div
                          key={member.id}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs border-2 border-space-dark bg-space-light"
                          title={member.config.name}
                          style={{
                            backgroundColor: member.config.color || "#374151",
                            color: "white",
                          }}
                          data-oid="q3_yhs0"
                        >
                          {member.config.name.slice(0, 1).toUpperCase()}
                        </div>
                      ))}
                      {team.members.length > 5 && (
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs bg-slate-600 border-2 border-space-dark"
                          data-oid="drydsww"
                        >
                          +{team.members.length - 5}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2 mt-4" data-oid="kxpd9-x">
                  <button
                    onClick={() => startTeam(team.id)}
                    className="space-button text-xs px-3 py-1.5 bg-indigo-600 text-white flex items-center"
                    disabled={loading}
                    data-oid="ari.o9z"
                  >
                    <FiPlay className="mr-1" data-oid="wpv_3t5" />
                    启动
                  </button>

                  <Link
                    href={`/agents/teams/${team.id}`}
                    className="space-button text-xs px-3 py-1.5 bg-slate-700 text-white flex items-center"
                    data-oid="8:w5_zj"
                  >
                    <FiEdit className="mr-1" data-oid="ghzwu9." />
                    编辑
                  </Link>

                  <button
                    onClick={() => setDeleteConfirm(team.id)}
                    className="space-button text-xs px-3 py-1.5 bg-red-800 text-white flex items-center"
                    disabled={loading}
                    data-oid="6qbt6y2"
                  >
                    <FiTrash2 className="mr-1" data-oid="tiiz0-m" />
                    删除
                  </button>
                </div>
              </div>

              {/* 删除确认 */}
              {deleteConfirm === team.id && (
                <div
                  className="absolute inset-0 bg-space-dark/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-10"
                  data-oid="0are1k2"
                >
                  <p className="text-center mb-4" data-oid="rpzzje9">
                    确定要删除"{team.name}"团队吗？
                  </p>
                  <div className="flex space-x-3" data-oid="8q4gx0l">
                    <button
                      onClick={() => deleteTeam(team.id)}
                      className="space-button bg-red-600 text-white"
                      disabled={loading}
                      data-oid="2u6yyu7"
                    >
                      确认删除
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="space-button bg-slate-700 text-white"
                      data-oid="lmjl4zm"
                    >
                      取消
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 分页控制 */}
      {teams.length > 0 && (
        <div
          className="space-card p-4 mt-5 flex items-center justify-between"
          data-oid="om7_0il"
        >
          <div className="text-sm text-slate-400" data-oid="wv6c9t4">
            共 {pagination.total} 个团队
          </div>
          <div className="flex space-x-2" data-oid="zv49-ad">
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.max(1, prev.page - 1),
                }))
              }
              disabled={pagination.page <= 1}
              className="space-button bg-slate-700 text-white disabled:opacity-50"
              data-oid="crczxgd"
            >
              上一页
            </button>
            <span
              className="space-card px-4 py-2 inline-flex items-center"
              data-oid="ozkuvoq"
            >
              第 {pagination.page} 页
            </span>
            <button
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              disabled={pagination.page * pagination.limit >= pagination.total}
              className="space-button bg-slate-700 text-white disabled:opacity-50"
              data-oid="er7hqit"
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamList;
