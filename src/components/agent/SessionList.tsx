import React from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

/**
 * 会话项接口
 */
export interface ISessionItem {
  /**
   * 会话ID
   */
  id: string;
  /**
   * 会话名称
   */
  name: string;
  /**
   * 会话描述
   */
  description?: string;
  /**
   * 代理数量
   */
  agentCount: number;
  /**
   * 创建时间
   */
  createdAt: Date | string;
}

/**
 * 会话列表属性接口
 */
export interface ISessionListProps {
  /**
   * 会话列表
   */
  sessions: ISessionItem[];
  /**
   * 是否加载中
   */
  isLoading?: boolean;
  /**
   * 会话点击事件
   */
  onSessionClick?: (sessionId: string) => void;
  /**
   * 创建会话事件
   */
  onCreateSession?: () => void;
}

/**
 * 会话列表组件
 *
 * 显示会话列表并提供会话操作
 *
 * @param {ISessionListProps} props - 会话列表属性
 * @returns {React.ReactElement} 会话列表组件
 */
const SessionList: React.FC<ISessionListProps> = ({
  sessions,
  isLoading = false,
  onSessionClick,
  onCreateSession,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-indigo-300">会话列表</h2>
        <Button
          variant="default"
          size="sm"
          onClick={onCreateSession}
          disabled={isLoading}
        >
          创建会话
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : sessions.length === 0 ? (
        <Card className="text-center py-10">
          <p className="text-gray-400 mb-4">暂无会话</p>
          <Button variant="outline" onClick={onCreateSession}>
            创建第一个会话
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <Card
              key={session.id}
              className="cursor-pointer hover:shadow-glow transition-shadow p-4"
              onClick={() => onSessionClick?.(session.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {session.name}
                  </h3>
                  {session.description && (
                    <p className="text-sm text-gray-300 mt-1">
                      {session.description}
                    </p>
                  )}
                </div>
                <div className="bg-indigo-900 px-2 py-1 rounded text-xs text-indigo-200">
                  {session.agentCount}个代理
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-400">
                创建于:{" "}
                {typeof session.createdAt === "string"
                  ? session.createdAt
                  : session.createdAt.toLocaleString("zh-CN")}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionList;
