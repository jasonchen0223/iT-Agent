/**
 * 协作会话相关类型定义
 */

/**
 * 会话状态枚举
 */
export enum SessionStatus {
  Planning = 'planning',   // 规划中
  Active = 'active',       // 进行中
  Paused = 'paused',       // 已暂停
  Completed = 'completed', // 已完成
  Failed = 'failed'        // 失败
}

/**
 * 消息类型枚举
 */
export enum MessageType {
  Text = 'text',           // 文本消息
  Code = 'code',           // 代码消息
  Image = 'image',         // 图片消息
  File = 'file',           // 文件消息
  System = 'system',       // 系统消息
  Error = 'error',         // 错误消息
  Result = 'result'        // 结果消息
}

/**
 * 会话类型接口
 */
export interface ISession {
  id: string;
  name: string;
  description: string;
  status: SessionStatus;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
  agentIds: string[];      // 参与的代理IDs
  goal?: string;           // 会话目标
  contextItems?: string[]; // 上下文内容IDs
}

/**
 * 消息类型接口
 */
export interface IMessage {
  id: string;
  sessionId: string;
  senderId: string;        // 发送者ID (用户或代理ID)
  senderType: 'user' | 'agent';
  content: string;
  type: MessageType;
  timestamp: Date;
  replyToId?: string;      // 回复哪条消息
  metadata?: Record<string, any>; // 附加元数据
}

/**
 * 创建会话输入接口
 */
export interface ICreateSessionInput {
  name: string;
  description: string;
  projectId: string;
  agentIds: string[];
  goal?: string;
  contextItems?: string[];
}

/**
 * 发送消息输入接口
 */
export interface ISendMessageInput {
  sessionId: string;
  content: string;
  type: MessageType;
  replyToId?: string;
  metadata?: Record<string, any>;
} 