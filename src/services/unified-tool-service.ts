/**
 * 统一工具服务实现
 * 
 * 提供统一的工具注册、获取和调用接口
 */
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/lib/db';
import { 
    IToolService, 
    IToolConfig, 
    IToolParameter, 
    IToolResult, 
    IToolCall 
} from '@/types/tool-interface';
import * as mcpTools from '@/lib/mcp-tools';
import { ToolParameterValidationError } from '@/lib/errors';
import { fileTools, readFile, writeFile, appendFile, deleteFile, createDirectory, listDirectory, getFileInfo } from '@/tools/file-tools';
import { httpTools, httpGet, httpPost, httpPut, httpDelete, httpUploadFile } from '@/tools/http-tools';
import { dataTools, parseJson, stringifyJson, formatDate, calculateStats, getObjectValue, csvToJson, jsonToCsv } from '@/tools/data-tools';

/**
 * 统一工具服务类
 * 
 * 实现IToolService接口，提供统一的工具管理和调用服务
 */
class UnifiedToolService implements IToolService {
    private static instance: UnifiedToolService | null = null;
    private toolConfigs: Map<string, IToolConfig> = new Map();
    private toolHandlers: Map<string, Function> = new Map();
    private mcpToolIds: Set<string> = new Set();
    private callHistory: IToolCall[] = [];
    
    /**
     * 私有构造函数
     */
    private constructor() {
        this.initialize();
    }
    
    /**
     * 获取单例实例
     * 
     * @returns {UnifiedToolService} 工具服务实例
     */
    public static getInstance(): UnifiedToolService {
        if (!UnifiedToolService.instance) {
            UnifiedToolService.instance = new UnifiedToolService();
        }
        return UnifiedToolService.instance;
    }
    
    /**
     * 初始化工具服务
     */
    private initialize(): void {
        try {
            // 初始化MCP工具
            mcpTools.initAllMcpTools();
            const allMcpTools = mcpTools.getAllMcpTools();
            
            for (const tool of allMcpTools) {
                this.toolConfigs.set(tool.id, this.convertToIToolConfig(tool));
                this.mcpToolIds.add(tool.id);
            }
            
            // 注册文件操作工具
            this.registerToolHandlers({
                'file-read': readFile,
                'file-write': writeFile,
                'file-append': appendFile,
                'file-delete': deleteFile,
                'dir-create': createDirectory,
                'dir-list': listDirectory,
                'file-info': getFileInfo
            });

            // 注册网络请求工具
            this.registerToolHandlers({
                'http-get': httpGet,
                'http-post': httpPost,
                'http-put': httpPut,
                'http-delete': httpDelete,
                'http-upload': httpUploadFile
            });

            // 注册数据处理工具
            this.registerToolHandlers({
                'data-parse-json': parseJson,
                'data-stringify-json': stringifyJson,
                'data-format-date': formatDate,
                'data-calculate-stats': calculateStats,
                'data-get-object-value': getObjectValue,
                'data-csv-to-json': csvToJson,
                'data-json-to-csv': jsonToCsv
            });

            // 注册工具定义
            this.registerToolConfigs([
                ...fileTools,
                ...httpTools,
                ...dataTools
            ]);
            
            console.log(`已初始化 ${this.toolConfigs.size} 个工具`);
        } catch (error) {
            console.error('初始化工具服务失败:', error);
        }
    }
    
    /**
     * 转换MCP工具配置为统一工具配置
     * 
     * @param {any} mcpTool - MCP工具配置
     * @returns {IToolConfig} 统一工具配置
     */
    private convertToIToolConfig(mcpTool: any): IToolConfig {
        return {
            id: mcpTool.id,
            name: mcpTool.name,
            description: mcpTool.description,
            category: mcpTool.category,
            functionName: mcpTool.functionName,
            parameters: mcpTool.parameters.map(p => ({
                name: p.name,
                description: p.description,
                type: p.type,
                required: p.required,
                default: p.default,
                example: p.example
            })),
            tags: mcpTool.tags || [],
            requireConfirmation: mcpTool.requireConfirmation || false,
            icon: mcpTool.icon
        };
    }
    
    /**
     * 转换内部工具配置为统一工具配置
     * 
     * @param {any} internalTool - 内部工具配置
     * @returns {IToolConfig} 统一工具配置
     */
    private convertInternalToolConfig(internalTool: any): IToolConfig {
        return {
            id: internalTool.id,
            name: internalTool.name,
            description: internalTool.description,
            category: internalTool.category,
            parameters: (internalTool.parameters || []).map(p => ({
                name: p.name,
                description: p.description,
                type: p.type,
                required: p.required,
                default: p.defaultValue,
                example: p.example
            })),
            tags: internalTool.tags || [],
            requireConfirmation: false,
            icon: internalTool.iconUrl
        };
    }
    
    /**
     * 注册工具处理函数
     * 
     * @param {Record<string, Function>} handlers - 工具ID和处理函数的映射
     * @returns {boolean} 是否成功注册
     */
    private registerToolHandlers(handlers: Record<string, Function>): boolean {
        try {
            Object.entries(handlers).forEach(([toolId, handler]) => {
                this.toolHandlers.set(toolId, handler);
            });
            return true;
        } catch (error) {
            console.error('注册工具处理函数错误:', error);
            return false;
        }
    }
    
    /**
     * 注册工具配置
     * 
     * @param {any[]} tools - 要注册的工具配置数组
     * @returns {boolean} 是否成功注册
     */
    private registerToolConfigs(tools: any[]): boolean {
        try {
            tools.forEach(tool => {
                const config = this.convertInternalToolConfig(tool);
                this.toolConfigs.set(config.id, config);
            });
            return true;
        } catch (error) {
            console.error('注册工具配置错误:', error);
            return false;
        }
    }
    
    /**
     * 验证工具参数
     * 
     * @param {IToolConfig} toolConfig - 工具配置
     * @param {Record<string, any>} params - 参数值
     * @throws {ToolParameterValidationError} 参数验证错误
     */
    private validateParameters(toolConfig: IToolConfig, params: Record<string, any>): void {
        if (!toolConfig.parameters || toolConfig.parameters.length === 0) {
            return;
        }
        
        for (const param of toolConfig.parameters) {
            // 检查必需参数
            if (param.required && (params[param.name] === undefined || params[param.name] === null)) {
                throw new ToolParameterValidationError(`缺少必需参数: ${param.name}`);
            }
            
            // 检查参数类型（基本检查）
            if (params[param.name] !== undefined && params[param.name] !== null) {
                const value = params[param.name];
                const type = param.type;
                
                if (type === 'string' && typeof value !== 'string') {
                    throw new ToolParameterValidationError(`参数 ${param.name} 必须是字符串类型`);
                } else if (type === 'number' && typeof value !== 'number') {
                    throw new ToolParameterValidationError(`参数 ${param.name} 必须是数字类型`);
                } else if (type === 'boolean' && typeof value !== 'boolean') {
                    throw new ToolParameterValidationError(`参数 ${param.name} 必须是布尔类型`);
                } else if (type === 'array' && !Array.isArray(value)) {
                    throw new ToolParameterValidationError(`参数 ${param.name} 必须是数组类型`);
                } else if (type === 'object' && (typeof value !== 'object' || Array.isArray(value) || value === null)) {
                    throw new ToolParameterValidationError(`参数 ${param.name} 必须是对象类型`);
                }
            }
        }
    }
    
    /**
     * 记录工具调用
     * 
     * @param {IToolCall} toolCall - 工具调用记录
     */
    private async recordToolCall(toolCall: IToolCall): Promise<void> {
        // 记录到内存
        this.callHistory.unshift(toolCall);
        
        // 保持最大记录数
        const MAX_HISTORY = 1000;
        if (this.callHistory.length > MAX_HISTORY) {
            this.callHistory.pop();
        }
        
        // 保存到数据库 (可以选择性实现)
        try {
            if (toolCall.sessionId) {
                await prisma.toolCall.create({
                    data: {
                        id: toolCall.id,
                        toolId: toolCall.toolId,
                        sessionId: toolCall.sessionId,
                        agentId: toolCall.agentId,
                        params: JSON.stringify(toolCall.params),
                        result: toolCall.result ? JSON.stringify(toolCall.result) : null,
                        status: toolCall.status,
                        startTime: toolCall.startTime,
                        endTime: toolCall.endTime,
                        error: toolCall.error,
                        executionTime: toolCall.executionTime
                    }
                });
            }
        } catch (error) {
            console.error('保存工具调用记录失败:', error);
            // 不中断流程
        }
    }
    
    /**
     * 更新工具调用记录
     * 
     * @param {string} callId - 调用ID
     * @param {Partial<IToolCall>} update - 要更新的字段
     */
    private async updateToolCall(callId: string, update: Partial<IToolCall>): Promise<void> {
        // 更新内存记录
        const index = this.callHistory.findIndex(call => call.id === callId);
        if (index !== -1) {
            this.callHistory[index] = { ...this.callHistory[index], ...update };
        }
        
        // 更新数据库记录 (可以选择性实现)
        try {
            const updateData: any = { ...update };
            
            // 处理JSON字段
            if (updateData.params) updateData.params = JSON.stringify(updateData.params);
            if (updateData.result) updateData.result = JSON.stringify(updateData.result);
            
            await prisma.toolCall.update({
                where: { id: callId },
                data: updateData
            });
        } catch (error) {
            console.error(`更新工具调用记录失败 (${callId}):`, error);
            // 不中断流程
        }
    }
    
    /**
     * 注册工具
     * 
     * @param {IToolConfig} toolConfig - 工具配置
     * @param {Function} handler - 工具处理函数
     * @returns {boolean} 是否注册成功
     */
    public registerTool(toolConfig: IToolConfig, handler: Function): boolean {
        try {
            // 检查工具ID是否已存在
            if (this.toolConfigs.has(toolConfig.id)) {
                console.warn(`工具ID已存在: ${toolConfig.id}，将被覆盖`);
            }
            
            // 注册工具配置和处理函数
            this.toolConfigs.set(toolConfig.id, toolConfig);
            this.toolHandlers.set(toolConfig.id, handler);
            
            return true;
        } catch (error) {
            console.error('注册工具失败:', error);
            return false;
        }
    }
    
    /**
     * 获取所有工具
     * 
     * @param {string} [category] - 可选的工具类别过滤
     * @returns {Promise<IToolConfig[]>} 工具配置列表
     */
    public async getAllTools(category?: string): Promise<IToolConfig[]> {
        try {
            const allTools = Array.from(this.toolConfigs.values());
            
            if (category) {
                return allTools.filter(tool => tool.category === category);
            }
            
            return allTools;
        } catch (error) {
            console.error('获取工具列表错误:', error);
            return [];
        }
    }
    
    /**
     * 根据ID获取工具
     * 
     * @param {string} toolId - 工具ID
     * @returns {Promise<IToolConfig | null>} 工具配置或null
     */
    public async getToolById(toolId: string): Promise<IToolConfig | null> {
        try {
            return this.toolConfigs.get(toolId) || null;
        } catch (error) {
            console.error(`获取工具错误 (${toolId}):`, error);
            return null;
        }
    }
    
    /**
     * 调用工具
     * 
     * @param {string} toolId - 工具ID
     * @param {Record<string, any>} params - 调用参数
     * @param {string} [sessionId] - 会话ID
     * @param {string} [agentId] - 代理ID
     * @returns {Promise<IToolResult>} 调用结果
     */
    public async callTool(
        toolId: string,
        params: Record<string, any>,
        sessionId?: string,
        agentId?: string
    ): Promise<IToolResult> {
        // 创建调用记录
        const callId = uuidv4();
        const toolCall: IToolCall = {
            id: callId,
            toolId,
            sessionId,
            agentId,
            params,
            status: 'pending',
            startTime: new Date()
        };
        
        // 记录调用开始
        await this.recordToolCall(toolCall);
        
        try {
            // 获取工具配置
            const toolConfig = this.toolConfigs.get(toolId);
            if (!toolConfig) {
                const result: IToolResult = { 
                    success: false, 
                    error: `工具不存在: ${toolId}` 
                };
                
                await this.updateToolCall(callId, {
                    status: 'error',
                    error: result.error,
                    endTime: new Date()
                });
                
                return result;
            }
            
            // 验证参数
            this.validateParameters(toolConfig, params);
            
            // 执行开始时间
            const startTime = Date.now();
            let result: IToolResult;
            
            // 根据工具类型调用不同的执行逻辑
            if (this.mcpToolIds.has(toolId)) {
                // 调用MCP工具
                result = await mcpTools.callMcpTool(toolId, params);
            } else {
                // 调用本地工具
                const handler = this.toolHandlers.get(toolId);
                if (!handler) {
                    result = { 
                        success: false, 
                        error: `未找到工具处理函数: ${toolId}` 
                    };
                } else {
                    try {
                        // 提取参数值
                        const paramList = toolConfig.parameters.map(p => 
                            params[p.name] !== undefined ? params[p.name] : p.default
                        );
                        
                        // 执行处理函数
                        const data = await handler(...paramList);
                        result = { success: true, data };
                    } catch (error) {
                        result = { 
                            success: false, 
                            error: error instanceof Error ? error.message : String(error)
                        };
                    }
                }
            }
            
            // 计算执行时间
            const endTime = new Date();
            const executionTime = Date.now() - startTime;
            result.executionTime = executionTime;
            
            // 更新调用记录
            await this.updateToolCall(callId, {
                status: result.success ? 'success' : 'error',
                result: result.data,
                error: result.error,
                endTime,
                executionTime
            });
            
            return result;
        } catch (error) {
            // 处理异常
            const errorMessage = error instanceof Error ? error.message : String(error);
            const result: IToolResult = { 
                success: false, 
                error: `工具调用失败: ${errorMessage}` 
            };
            
            // 更新调用记录
            await this.updateToolCall(callId, {
                status: 'error',
                error: result.error,
                endTime: new Date()
            });
            
            return result;
        }
    }
    
    /**
     * 获取工具调用历史
     * 
     * @param {string} [sessionId] - 会话ID
     * @param {string} [agentId] - 代理ID
     * @param {string} [toolId] - 工具ID
     * @param {number} [limit=100] - 返回记录数量限制
     * @returns {Promise<IToolCall[]>} 工具调用记录列表
     */
    public async getToolCallHistory(
        sessionId?: string,
        agentId?: string,
        toolId?: string,
        limit: number = 100
    ): Promise<IToolCall[]> {
        try {
            // 从内存中过滤
            let result = this.callHistory;
            
            // 应用过滤条件
            if (sessionId) {
                result = result.filter(call => call.sessionId === sessionId);
            }
            
            if (agentId) {
                result = result.filter(call => call.agentId === agentId);
            }
            
            if (toolId) {
                result = result.filter(call => call.toolId === toolId);
            }
            
            // 应用限制
            return result.slice(0, limit);
        } catch (error) {
            console.error('获取工具调用历史错误:', error);
            return [];
        }
    }
}

// 导出单例实例
export const unifiedToolService = UnifiedToolService.getInstance(); 