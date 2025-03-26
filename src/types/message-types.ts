/**
 * 消息类型定义
 * 
 * 包含代理通信所需的消息类型定义
 */
import { TAgentRole } from './agent-types';

/**
 * 消息类型枚举
 */
export enum TMessageType {
    /**
     * 文本消息
     */
    TEXT = 'text',
    
    /**
     * 命令消息
     */
    COMMAND = 'command',
    
    /**
     * 工具调用消息
     */
    TOOL_CALL = 'tool_call',
    
    /**
     * 工具响应消息
     */
    TOOL_RESPONSE = 'tool_response',
    
    /**
     * 状态消息
     */
    STATUS = 'status',
    
    /**
     * 系统消息
     */
    SYSTEM = 'system',
    
    /**
     * 错误消息
     */
    ERROR = 'error',
    
    /**
     * JSON消息
     */
    JSON = 'json',
    
    /**
     * 图片消息
     */
    IMAGE = 'image',
    
    /**
     * 文件消息
     */
    FILE = 'file',
    
    /**
     * 思考消息
     */
    THINKING = 'thinking',
    
    /**
     * 自定义消息
     */
    CUSTOM = 'custom'
}

/**
 * 消息优先级枚举
 */
export enum TMessagePriority {
    /**
     * 低优先级
     */
    LOW = 'low',
    
    /**
     * 正常优先级
     */
    NORMAL = 'normal',
    
    /**
     * 高优先级
     */
    HIGH = 'high',
    
    /**
     * 紧急优先级
     */
    URGENT = 'urgent'
}

/**
 * 基础消息接口
 */
export interface IBaseMessage {
    /**
     * 消息ID
     */
    id: string;
    
    /**
     * 消息类型
     */
    type: TMessageType;
    
    /**
     * 发送者ID
     */
    senderId: string;
    
    /**
     * 发送者角色
     */
    senderRole: TAgentRole;
    
    /**
     * 接收者ID (空表示广播消息)
     */
    receiverId?: string;
    
    /**
     * 会话ID
     */
    sessionId: string;
    
    /**
     * 时间戳
     */
    timestamp: number;
    
    /**
     * 序列号（在会话中的顺序）
     */
    sequence: number;
    
    /**
     * 优先级
     */
    priority: TMessagePriority;
    
    /**
     * 父消息ID (回复时使用)
     */
    parentId?: string;
    
    /**
     * 元数据
     */
    metadata?: Record<string, any>;
}

/**
 * 文本消息接口
 */
export interface ITextMessage extends IBaseMessage {
    type: TMessageType.TEXT;
    data: {
        /**
         * 文本内容
         */
        content: string;
    };
}

/**
 * 命令消息接口
 */
export interface ICommandMessage extends IBaseMessage {
    type: TMessageType.COMMAND;
    data: {
        /**
         * 命令名称
         */
        command: string;
        
        /**
         * 命令参数
         */
        args: Record<string, any>;
    };
}

/**
 * 工具调用消息接口
 */
export interface IToolCallMessage extends IBaseMessage {
    type: TMessageType.TOOL_CALL;
    data: {
        /**
         * 工具ID
         */
        toolId: string;
        
        /**
         * 工具参数
         */
        params: Record<string, any>;
        
        /**
         * 调用ID（用于匹配响应）
         */
        callId: string;
    };
}

/**
 * 工具响应消息接口
 */
export interface IToolResponseMessage extends IBaseMessage {
    type: TMessageType.TOOL_RESPONSE;
    data: {
        /**
         * 工具ID
         */
        toolId: string;
        
        /**
         * 调用ID（用于匹配请求）
         */
        callId: string;
        
        /**
         * 结果
         */
        result: any;
        
        /**
         * 是否成功
         */
        success: boolean;
        
        /**
         * 错误信息（如果失败）
         */
        error?: string;
    };
}

/**
 * 系统消息接口
 */
export interface ISystemMessage extends IBaseMessage {
    type: TMessageType.SYSTEM;
    data: {
        /**
         * 消息内容
         */
        content: string;
        
        /**
         * 消息级别
         */
        level: 'info' | 'warning' | 'error';
        
        /**
         * 元数据
         */
        metadata?: Record<string, any>;
    };
}

/**
 * 思考消息接口
 */
export interface IThinkingMessage extends IBaseMessage {
    type: TMessageType.THINKING;
    data: {
        /**
         * 思考内容
         */
        content: string;
        
        /**
         * 思考阶段
         */
        stage: string;
        
        /**
         * 是否是最终思考
         */
        final: boolean;
    };
}

/**
 * 图片消息接口
 */
export interface IImageMessage extends IBaseMessage {
    type: TMessageType.IMAGE;
    data: {
        /**
         * 图片URL或Base64数据
         */
        src: string;
        
        /**
         * 图片类型
         */
        imageType: 'url' | 'base64';
        
        /**
         * 图片描述
         */
        alt?: string;
        
        /**
         * 图片宽度
         */
        width?: number;
        
        /**
         * 图片高度
         */
        height?: number;
    };
}

/**
 * 文件消息接口
 */
export interface IFileMessage extends IBaseMessage {
    type: TMessageType.FILE;
    data: {
        /**
         * 文件名
         */
        filename: string;
        
        /**
         * 文件类型
         */
        mimeType: string;
        
        /**
         * 文件大小（字节）
         */
        size: number;
        
        /**
         * 文件URL或Base64数据
         */
        content: string;
        
        /**
         * 内容类型
         */
        contentType: 'url' | 'base64';
    };
}

/**
 * 消息过滤接口
 */
export interface IMessageFilter {
    /**
     * 消息类型过滤
     */
    type?: TMessageType | TMessageType[];
    
    /**
     * 发送者ID过滤
     */
    senderId?: string | string[];
    
    /**
     * 发送者角色过滤
     */
    senderRole?: TAgentRole | TAgentRole[];
    
    /**
     * 接收者ID过滤
     */
    receiverId?: string | string[];
    
    /**
     * 会话ID过滤
     */
    sessionId?: string;
    
    /**
     * 优先级过滤
     */
    priority?: TMessagePriority | TMessagePriority[];
    
    /**
     * 自定义过滤函数
     */
    custom?: (message: TMessage) => boolean;
}

/**
 * 消息处理函数类型
 */
export type TMessageHandler = (message: TMessage) => void | Promise<void>;

/**
 * 消息类型联合
 */
export type TMessage = 
    | ITextMessage
    | ICommandMessage
    | IToolCallMessage
    | IToolResponseMessage
    | ISystemMessage
    | IThinkingMessage
    | IImageMessage
    | IFileMessage; 