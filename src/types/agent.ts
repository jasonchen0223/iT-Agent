/**
 * 代理类型定义
 */

/**
 * 代理角色枚举
 */
export enum TAgentRole {
    USER = 'user',
    ASSISTANT = 'assistant',
    ORCHESTRATOR = 'orchestrator',
    EXECUTOR = 'executor',
    PLANNER = 'planner',
    CRITIC = 'critic',
    RESEARCHER = 'researcher',
    CODER = 'coder',
    TESTER = 'tester',
    REVIEWER = 'reviewer',
    CUSTOM = 'custom'
}

/**
 * 代理状态枚举
 */
export enum TAgentStatus {
    IDLE = 'idle',         // 空闲
    THINKING = 'thinking', // 思考中
    WORKING = 'working',   // 工作中
    WAITING = 'waiting',   // 等待中
    DONE = 'done',         // 完成
    ERROR = 'error',       // 错误
}

/**
 * 代理定义接口
 */
export interface IAgentConfig {
    /**
     * 代理ID
     */
    id?: string;
    /**
     * 代理名称
     */
    name: string;
    /**
     * 代理角色
     */
    role: TAgentRole;
    /**
     * 代理描述
     */
    description: string;
    /**
     * 系统消息
     */
    systemMessage: string;
    /**
     * 代理图标
     */
    icon: string;
    /**
     * 代理颜色
     */
    color: string;
    /**
     * 模型名称
     */
    model?: string;
    /**
     * 温度参数
     */
    temperature?: number;
    /**
     * 最大令牌数
     */
    maxTokens?: number;
    /**
     * 代理能力列表
     */
    capability: string[];
    /**
     * 代理设置
     */
    settings?: Record<string, any>;
    /**
     * 代理状态
     */
    status?: TAgentStatus;
}

/**
 * 代理实例接口
 */
export interface IAgent extends IAgentConfig {
    /**
     * 代理ID
     */
    id: string;
    /**
     * 发送消息方法
     */
    sendMessage?: (content: string, receiverId: string) => Promise<IAgentMessage>;
    /**
     * 接收消息方法
     */
    receiveMessage?: (message: IAgentMessage) => Promise<void>;
    /**
     * 调用工具方法
     */
    callTool?: (toolName: string, parameters: any) => Promise<any>;
}

/**
 * 代理消息类型
 */
export type TMessageType = 'text' | 'code' | 'tool_call' | 'tool_result' | 'error';

/**
 * 代理消息接口
 */
export interface IAgentMessage {
    /**
     * 消息ID
     */
    id: string;
    /**
     * 发送者ID
     */
    senderId: string;
    /**
     * 接收者ID
     */
    receiverId: string;
    /**
     * 消息内容
     */
    content: string;
    /**
     * 消息类型
     */
    type: TMessageType;
    /**
     * 创建时间
     */
    createdAt: Date;
    /**
     * 元数据
     */
    metadata?: Record<string, any>;
} 