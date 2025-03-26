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