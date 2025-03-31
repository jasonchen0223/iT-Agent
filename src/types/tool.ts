/**
 * 工具类型定义
 * 
 * 定义系统中使用的工具类型和接口
 */

/**
 * 工具类别枚举
 */
export enum TToolCategory {
    TERMINAL = 'terminal',         // 终端命令
    FILE_SYSTEM = 'file_system',   // 文件系统
    WEB = 'web',                   // 网络
    DATABASE = 'database',         // 数据库
    AI = 'ai',                     // 人工智能
    UTILITY = 'utility',           // 实用工具
    CUSTOM = 'custom',             // 自定义工具
    OTHER = 'other'                // 其他
}

/**
 * 工具参数类型枚举
 */
export enum TToolParamType {
    STRING = 'string',
    NUMBER = 'number',
    BOOLEAN = 'boolean',
    ARRAY = 'array',
    OBJECT = 'object',
    FILE = 'file'
}

/**
 * 工具参数接口
 */
export interface IToolParam {
    /**
     * 参数名称
     */
    name: string;
    /**
     * 参数类型
     */
    type: TToolParamType;
    /**
     * 参数描述
     */
    description: string;
    /**
     * 是否必需
     */
    required: boolean;
    /**
     * 默认值
     */
    default?: any;
    /**
     * 允许的枚举值
     */
    enum?: string[];
}

/**
 * 工具类型
 */
export type TToolType = 'web' | 'file' | 'database' | 'code' | 'ai' | 'utility' | 'system' | 'custom';

/**
 * 工具状态
 */
export type TToolStatus = 'available' | 'running' | 'error' | 'disabled' | 'initializing';

/**
 * 工具执行结果类型
 */
export type TToolResultType = 'text' | 'json' | 'file' | 'image' | 'error' | 'mixed';

/**
 * 工具操作类型
 */
export type TToolAction = 'run' | 'stop' | 'restart' | 'configure';

/**
 * 工具权限级别
 */
export type TToolPermission = 'read' | 'write' | 'execute' | 'admin';

/**
 * 工具接口
 */
export interface ITool {
    /**
     * 工具ID
     */
    id: string;
    /**
     * 工具名称
     */
    name: string;
    /**
     * 工具描述
     */
    description: string;
    /**
     * 工具类别
     */
    category: TToolCategory;
    /**
     * 工具图标
     */
    icon?: string;
    /**
     * 工具参数
     */
    params: IToolParam[];
    /**
     * 输出类型
     */
    outputType: string;
    /**
     * 是否启用
     */
    isEnabled: boolean;
    /**
     * 是否内置
     */
    isBuiltin: boolean;
    /**
     * 创建时间
     */
    createdAt: Date;
    /**
     * 更新时间
     */
    updatedAt: Date;
    /**
     * 创建者ID
     */
    createdBy?: string;
    /**
     * 工具类型
     */
    type: TToolType;
    /**
     * 工具状态
     */
    status: TToolStatus;
    /**
     * 版本
     */
    version?: string;
    /**
     * 来源
     */
    source?: 'internal' | 'external' | 'mcp';
    /**
     * 权限
     */
    permissions: TToolPermission[];
    /**
     * 元数据
     */
    metadata?: Record<string, any>;
}

/**
 * 工具调用记录接口
 */
export interface IToolCall {
    /**
     * 调用ID
     */
    id: string;
    /**
     * 工具ID
     */
    toolId: string;
    /**
     * 会话ID
     */
    sessionId: string;
    /**
     * 代理ID
     */
    agentId: string;
    /**
     * 调用参数
     */
    params: Record<string, any>;
    /**
     * 结果
     */
    result: any;
    /**
     * 状态
     */
    status: 'success' | 'error' | 'pending';
    /**
     * 开始时间
     */
    startTime: Date;
    /**
     * 结束时间
     */
    endTime?: Date;
    /**
     * 错误信息
     */
    error?: string;
}

/**
 * 工具调用结果接口
 */
export interface IToolCallResult {
    /**
     * 是否成功
     */
    success: boolean;
    /**
     * 结果数据
     */
    data?: any;
    /**
     * 错误信息
     */
    error?: string;
    /**
     * 执行时间
     */
    executionTime?: number;
}

/**
 * 工具参数定义
 */
export interface IToolParameter {
    /**
     * 参数名称
     */
    name: string;
    /**
     * 参数类型
     */
    type: 'string' | 'number' | 'boolean' | 'array' | 'object';
    /**
     * 参数描述
     */
    description: string;
    /**
     * 是否必需
     */
    required: boolean;
    /**
     * 默认值
     */
    default?: any;
    /**
     * 选项
     */
    options?: any[];
    /**
     * 验证
     */
    validation?: string;
}

/**
 * 工具配置定义
 */
export interface IToolConfig {
    /**
     * 配置ID
     */
    id: string;
    /**
     * 工具ID
     */
    toolId: string;
    /**
     * 参数
     */
    parameters: Record<string, any>;
    /**
     * 是否启用
     */
    enabled: boolean;
    /**
     * 创建时间
     */
    createdAt: Date;
    /**
     * 更新时间
     */
    updatedAt: Date;
}

/**
 * 工具执行请求定义
 */
export interface IToolExecuteRequest {
    /**
     * 工具ID
     */
    toolId: string;
    /**
     * 动作
     */
    action: TToolAction;
    /**
     * 参数
     */
    parameters?: Record<string, any>;
    /**
     * 超时
     */
    timeout?: number;
    /**
     * 代理ID
     */
    agentId?: string;
    /**
     * 会话ID
     */
    sessionId?: string;
    /**
     * 任务ID
     */
    taskId?: string;
    /**
     * 上下文
     */
    context?: Record<string, any>;
}

/**
 * 工具执行结果定义
 */
export interface IToolExecuteResult {
    /**
     * 结果ID
     */
    id: string;
    /**
     * 工具ID
     */
    toolId: string;
    /**
     * 状态
     */
    status: 'success' | 'error' | 'timeout' | 'cancelled';
    /**
     * 结果类型
     */
    resultType: TToolResultType;
    /**
     * 结果
     */
    result: any;
    /**
     * 错误信息
     */
    error?: string;
    /**
     * 开始时间
     */
    startTime: Date;
    /**
     * 结束时间
     */
    endTime?: Date;
    /**
     * 持续时间
     */
    duration?: number;
    /**
     * 元数据
     */
    metadata?: Record<string, any>;
}

/**
 * 工具注册请求定义
 */
export interface IToolRegisterRequest {
    /**
     * 名称
     */
    name: string;
    /**
     * 描述
     */
    description: string;
    /**
     * 类型
     */
    type: TToolType;
    /**
     * 图标
     */
    icon?: string;
    /**
     * 版本
     */
    version?: string;
    /**
     * 来源
     */
    source?: 'internal' | 'external' | 'mcp';
    /**
     * 参数
     */
    parameters?: IToolParameter[];
    /**
     * 权限
     */
    permissions?: TToolPermission[];
    /**
     * 元数据
     */
    metadata?: Record<string, any>;
}

/**
 * 工具更新请求定义
 */
export interface IToolUpdateRequest {
    /**
     * 名称
     */
    name?: string;
    /**
     * 描述
     */
    description?: string;
    /**
     * 类型
     */
    type?: TToolType;
    /**
     * 状态
     */
    status?: TToolStatus;
    /**
     * 图标
     */
    icon?: string;
    /**
     * 版本
     */
    version?: string;
    /**
     * 参数
     */
    parameters?: IToolParameter[];
    /**
     * 权限
     */
    permissions?: TToolPermission[];
    /**
     * 元数据
     */
    metadata?: Record<string, any>;
}

/**
 * MCP工具包装器接口
 */
export interface IMcpToolWrapper {
    /**
     * 包装器ID
     */
    id: string;
    /**
     * 包装器名称
     */
    name: string;
    /**
     * 包装器描述
     */
    description: string;
    /**
     * MCP工具ID
     */
    mcpToolId: string;
    /**
     * 请求模板
     */
    requestTemplate: Record<string, any>;
    /**
     * 响应映射
     */
    responseMapping: Record<string, string>;
    /**
     * 是否启用
     */
    enabled: boolean;
    /**
     * 元数据
     */
    metadata?: Record<string, any>;
    /**
     * 创建时间
     */
    createdAt: Date;
    /**
     * 更新时间
     */
    updatedAt: Date;
}

/**
 * 工具调用历史记录接口
 */
export interface IToolExecutionHistory {
    /**
     * 记录ID
     */
    id: string;
    /**
     * 工具ID
     */
    toolId: string;
    /**
     * 代理ID
     */
    agentId?: string;
    /**
     * 会话ID
     */
    sessionId?: string;
    /**
     * 任务ID
     */
    taskId?: string;
    /**
     * 动作
     */
    action: TToolAction;
    /**
     * 参数
     */
    parameters?: Record<string, any>;
    /**
     * 结果
     */
    result?: any;
    /**
     * 状态
     */
    status: 'success' | 'error' | 'timeout' | 'cancelled';
    /**
     * 开始时间
     */
    startTime: Date;
    /**
     * 结束时间
     */
    endTime?: Date;
    /**
     * 持续时间
     */
    duration?: number;
    /**
     * 错误信息
     */
    error?: string;
    /**
     * 创建时间
     */
    createdAt: Date;
} 