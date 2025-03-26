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
            data-oid="vqhceu3"
          >
            工作流
          </span>
        );

      case TeamType.CONVERSATION:
        return (
          <span
            className="space-badge text-xs px-2 py-1 bg-green-900/40 text-green-300 border border-green-500"
            data-oid="cp-yo9z"
          >
            会话
          </span>
        );

      case TeamType.PARALLEL:
        return (
          <span
            className="space-badge text-xs px-2 py-1 bg-purple-900/40 text-purple-300 border border-purple-500"
            data-oid=":kuokj:"
          >
            并行
          </span>
        );

      default:
        return (
          <span
            className="space-badge text-xs px-2 py-1 bg-gray-800 text-gray-300 border border-gray-600"
            data-oid="k__e-81"
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
            data-oid="v9iz07r"
          >
            活跃
          </span>
        );

      case TeamStatus.INACTIVE:
        return (
          <span
            className="space-badge text-xs px-2 py-1 bg-gray-800 text-gray-300"
            data-oid="d_n64f3"
          >
            非活跃
          </span>
        );

      case TeamStatus.ARCHIVED:
        return (
          <span
            className="space-badge text-xs px-2 py-1 bg-amber-900/40 text-amber-300"
            data-oid=".51rysy"
          >
            已归档
          </span>
        );

      default:
        return (
          <span
            className="space-badge text-xs px-2 py-1 bg-gray-800 text-gray-300"
            data-oid="xdwe15i"
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
    <div className={`${className}`} data-oid="vacg27y">
      {/* 筛选栏 */}
      <div className="space-card p-4 mb-5" data-oid="-0p3-f1">
        <div className="flex flex-wrap gap-3" data-oid="h-2dcf.">
          <div className="flex-1 min-w-[200px]" data-oid="6lf1oxb">
            <input
              type="text"
              value={filter.search}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, search: e.target.value }))
              }
              placeholder="搜索团队..."
              className="space-input w-full"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              data-oid="7b6u6kz"
            />
          </div>
          <div className="w-40" data-oid="s14qtmy">
            <select
              value={filter.type}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, type: e.target.value }))
              }
              className="space-select w-full"
              data-oid="1kxgq38"
            >
              <option value="" data-oid="bkjqs12">
                所有类型
              </option>
              <option value={TeamType.WORKFLOW} data-oid="bc229q-">
                工作流
              </option>
              <option value={TeamType.CONVERSATION} data-oid=":g5qdja">
                会话
              </option>
              <option value={TeamType.PARALLEL} data-oid="pbzdsk2">
                并行
              </option>
            </select>
          </div>
          <div className="w-40" data-oid="n9xpmh0">
            <select
              value={filter.status}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, status: e.target.value }))
              }
              className="space-select w-full"
              data-oid="r4qlzih"
            >
              <option value="" data-oid="4vf:twf">
                所有状态
              </option>
              <option value={TeamStatus.ACTIVE} data-oid="e6042e4">
                活跃
              </option>
              <option value={TeamStatus.INACTIVE} data-oid="0wzl:_1">
                非活跃
              </option>
              <option value={TeamStatus.ARCHIVED} data-oid="h6jcoin">
                已归档
              </option>
            </select>
          </div>
          <div className="flex gap-2" data-oid="pktsgr0">
            <button
              onClick={handleSearch}
              className="space-button bg-indigo-600 text-white"
              data-oid="qd402b4"
            >
              搜索
            </button>
            <button
              onClick={resetFilters}
              className="space-button bg-slate-700 text-white"
              data-oid="o1y5trs"
            >
              重置
            </button>
          </div>
        </div>
      </div>

      {/* 错误显示 */}
      {error && (
        <div className="space-card p-4 mb-5 border-red-500" data-oid="27s8f7:">
          <p className="text-red-400" data-oid="gaw2i:3">
            {error}
          </p>
        </div>
      )}

      {/* 团队列表 */}
      {loading ? (
        <div className="space-card p-8 text-center" data-oid="4ezhiyl">
          <div className="flex items-center justify-center" data-oid="z47sikh">
            <div
              className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"
              data-oid="alei:9."
            ></div>
            <span className="ml-2" data-oid="m.wsnr3">
              加载中...
            </span>
          </div>
        </div>
      ) : teams.length === 0 ? (
        <div className="space-card p-8 text-center" data-oid="65k5t5k">
          <p className="text-slate-400" data-oid="0mxxdz6">
            暂无团队数据
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          data-oid="hywc:ru"
        >
          {teams.map((team) => (
            <div
              key={team.id}
              className="space-card relative group"
              data-oid="q6xut5f"
            >
              <div className="p-5" data-oid="z--bu8b">
                <div
                  className="flex justify-between items-start mb-3"
                  data-oid="-wuzhuz"
                >
                  <h3
                    className="text-lg font-semibold text-indigo-300 truncate"
                    data-oid="4t-8d4u"
                  >
                    {team.name}
                  </h3>
                  <div className="flex space-x-1" data-oid="488s0o8">
                    {getTeamTypeLabel(team.type)}
                    {getTeamStatusLabel(team.status)}
                  </div>
                </div>

                <p
                  className="text-sm text-slate-300 mb-4 line-clamp-2"
                  data-oid="qkpkuau"
                >
                  {team.description || "没有描述"}
                </p>

                <div
                  className="flex items-center text-xs text-slate-400 mb-4"
                  data-oid="hmlooof"
                >
                  <FiCalendar className="mr-1" data-oid="8ge.wjd" />
                  <span data-oid="nwggx6n">
                    创建于: {new Date(team.createdAt).toLocaleString("zh-CN")}
                  </span>
                </div>

                {team.members && team.members.length > 0 && (
                  <div className="mb-4" data-oid="-:_9eft">
                    <div
                      className="text-xs text-slate-400 mb-2 flex items-center"
                      data-oid="vy5wj0i"
                    >
                      <FiUsers className="mr-1" data-oid="x04n.d4" />
                      <span data-oid="dj_vqu-">
                        成员 ({team.members.length})
                      </span>
                    </div>
                    <div
                      className="flex -space-x-2 overflow-hidden"
                      data-oid="m.c.v_-"
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
                          data-oid="b0d-_pp"
                        >
                          {member.config.name.slice(0, 1).toUpperCase()}
                        </div>
                      ))}
                      {team.members.length > 5 && (
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs bg-slate-600 border-2 border-space-dark"
                          data-oid="0bucl7:"
                        >
                          +{team.members.length - 5}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2 mt-4" data-oid="1lxjr81">
                  <button
                    onClick={() => startTeam(team.id)}
                    className="space-button text-xs px-3 py-1.5 bg-indigo-600 text-white flex items-center"
                    disabled={loading}
                    data-oid="3mq5z1o"
                  >
                    <FiPlay className="mr-1" data-oid="o134-61" />
                    启动
                  </button>

                  <Link
                    href={`/agents/teams/${team.id}`}
                    className="space-button text-xs px-3 py-1.5 bg-slate-700 text-white flex items-center"
                    data-oid=".7l4jxl"
                  >
                    <FiEdit className="mr-1" data-oid="8nxc_rd" />
                    编辑
                  </Link>

                  <button
                    onClick={() => setDeleteConfirm(team.id)}
                    className="space-button text-xs px-3 py-1.5 bg-red-800 text-white flex items-center"
                    disabled={loading}
                    data-oid="c636gkx"
                  >
                    <FiTrash2 className="mr-1" data-oid="tb.nz.c" />
                    删除
                  </button>
                </div>
              </div>

              {/* 删除确认 */}
              {deleteConfirm === team.id && (
                <div
                  className="absolute inset-0 bg-space-dark/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-10"
                  data-oid="3gq5.ns"
                >
                  <p className="text-center mb-4" data-oid="pvuo27t">
                    确定要删除"{team.name}"团队吗？
                  </p>
                  <div className="flex space-x-3" data-oid="uu8eqpe">
                    <button
                      onClick={() => deleteTeam(team.id)}
                      className="space-button bg-red-600 text-white"
                      disabled={loading}
                      data-oid="jfi-52w"
                    >
                      确认删除
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="space-button bg-slate-700 text-white"
                      data-oid="_6qls-q"
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
          data-oid="7pot5k:"
        >
          <div className="text-sm text-slate-400" data-oid="4kh1o3:">
            共 {pagination.total} 个团队
          </div>
          <div className="flex space-x-2" data-oid="rixyaal">
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.max(1, prev.page - 1),
                }))
              }
              disabled={pagination.page <= 1}
              className="space-button bg-slate-700 text-white disabled:opacity-50"
              data-oid="zeqmj9e"
            >
              上一页
            </button>
            <span
              className="space-card px-4 py-2 inline-flex items-center"
              data-oid="-nh-wkx"
            >
              第 {pagination.page} 页
            </span>
            <button
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              disabled={pagination.page * pagination.limit >= pagination.total}
              className="space-button bg-slate-700 text-white disabled:opacity-50"
              data-oid="v.0asap"
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
