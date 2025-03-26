/**
 * 工具接口定义
 * 
 * 为系统中的所有工具提供统一的接口定义
 */

/**
 * 工具调用结果接口
 */
export interface IToolResult {
    /**
     * 调用是否成功
     */
    success: boolean;

    /**
     * 调用结果数据
     */
    data?: any;

    /**
     * 错误信息
     */
    error?: string;

    /**
     * 执行时间（毫秒）
     */
    executionTime?: number;
}

/**
 * 工具参数接口
 */
export interface IToolParameter {
    /**
     * 参数名称
     */
    name: string;

    /**
     * 参数描述
     */
    description: string;

    /**
     * 参数类型
     */
    type: 'string' | 'number' | 'boolean' | 'array' | 'object';

    /**
     * 参数是否必需
     */
    required: boolean;

    /**
     * 参数默认值
     */
    default?: any;

    /**
     * 参数示例值
     */
    example?: any;
}

/**
 * 工具配置接口
 */
export interface IToolConfig {
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
    category: string;

    /**
     * 工具函数名称（对于MCP工具）
     */
    functionName?: string;

    /**
     * 工具参数列表
     */
    parameters: IToolParameter[];

    /**
     * 工具标签
     */
    tags?: string[];

    /**
     * 是否需要用户确认
     */
    requireConfirmation?: boolean;

    /**
     * 工具图标
     */
    icon?: string;
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
    sessionId?: string;

    /**
     * 代理ID
     */
    agentId?: string;

    /**
     * 调用参数
     */
    params: Record<string, any>;

    /**
     * 调用结果
     */
    result?: any;

    /**
     * 调用状态
     */
    status: 'pending' | 'success' | 'error';

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

    /**
     * 执行时间（毫秒）
     */
    executionTime?: number;
}

/**
 * 工具服务接口
 */
export interface IToolService {
    /**
     * 注册工具
     * 
     * @param {IToolConfig} toolConfig - 工具配置
     * @param {Function} handler - 工具处理函数
     * @returns {boolean} 是否注册成功
     */
    registerTool(toolConfig: IToolConfig, handler: Function): boolean;

    /**
     * 获取所有工具
     * 
     * @param {string} [category] - 可选的工具类别
     * @returns {Promise<IToolConfig[]>} 工具配置列表
     */
    getAllTools(category?: string): Promise<IToolConfig[]>;

    /**
     * 根据ID获取工具
     * 
     * @param {string} toolId - 工具ID
     * @returns {Promise<IToolConfig | null>} 工具配置或null
     */
    getToolById(toolId: string): Promise<IToolConfig | null>;

    /**
     * 调用工具
     * 
     * @param {string} toolId - 工具ID
     * @param {Record<string, any>} params - 调用参数
     * @param {string} [sessionId] - 会话ID
     * @param {string} [agentId] - 代理ID
     * @returns {Promise<IToolResult>} 调用结果
     */
    callTool(
        toolId: string,
        params: Record<string, any>,
        sessionId?: string,
        agentId?: string
    ): Promise<IToolResult>;

    /**
     * 获取工具调用历史
     * 
     * @param {string} [sessionId] - 会话ID
     * @param {string} [agentId] - 代理ID
     * @param {string} [toolId] - 工具ID
     * @param {number} [limit] - 返回记录数量限制
     * @returns {Promise<IToolCall[]>} 工具调用记录列表
     */
    getToolCallHistory(
        sessionId?: string,
        agentId?: string,
        toolId?: string,
        limit?: number
    ): Promise<IToolCall[]>;
} 