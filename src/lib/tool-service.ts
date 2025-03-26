/**
 * 工具服务模块
 * 
 * 提供工具的注册、获取和调用功能
 */
import { prisma } from './db';
import { ITool, IToolCall, IToolCallResult, TToolCategory } from '@/types/tool';
import { mcpTools } from './mcp-tools';
import { v4 as uuidv4 } from 'uuid';

/**
 * 工具服务类
 */
class ToolService {
    private tools: Map<string, ITool> = new Map();
    private handlers: Map<string, Function> = new Map();
    
    constructor() {
        this.initializeBuiltinTools();
    }
    
    /**
     * 初始化内置工具
     */
    private async initializeBuiltinTools() {
        try {
            // 注册终端命令工具
            this.registerTool({
                id: 'terminal_command',
                name: '终端命令',
                description: '执行终端命令并返回结果',
                category: TToolCategory.TERMINAL,
                icon: 'terminal',
                params: [
                    {
                        name: 'command',
                        type: 'string' as any,
                        description: '要执行的命令',
                        required: true
                    },
                    {
                        name: 'workingDir',
                        type: 'string' as any,
                        description: '工作目录',
                        required: false
                    }
                ],
                outputType: 'string',
                isEnabled: true,
                isBuiltin: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }, this.executeTerminalCommand.bind(this));
            
            // 注册文件读取工具
            this.registerTool({
                id: 'read_file',
                name: '文件读取',
                description: '读取文件内容',
                category: TToolCategory.FILE_SYSTEM,
                icon: 'file',
                params: [
                    {
                        name: 'path',
                        type: 'string' as any,
                        description: '文件路径',
                        required: true
                    }
                ],
                outputType: 'string',
                isEnabled: true,
                isBuiltin: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }, this.readFile.bind(this));
            
            // 注册文件写入工具
            this.registerTool({
                id: 'write_file',
                name: '文件写入',
                description: '写入文件内容',
                category: TToolCategory.FILE_SYSTEM,
                icon: 'file-plus',
                params: [
                    {
                        name: 'path',
                        type: 'string' as any,
                        description: '文件路径',
                        required: true
                    },
                    {
                        name: 'content',
                        type: 'string' as any,
                        description: '文件内容',
                        required: true
                    },
                    {
                        name: 'append',
                        type: 'boolean' as any,
                        description: '是否追加内容',
                        required: false,
                        default: false
                    }
                ],
                outputType: 'boolean',
                isEnabled: true,
                isBuiltin: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }, this.writeFile.bind(this));
            
            // 注册网络请求工具
            this.registerTool({
                id: 'web_request',
                name: '网络请求',
                description: '发送HTTP请求并获取响应',
                category: TToolCategory.WEB,
                icon: 'globe',
                params: [
                    {
                        name: 'url',
                        type: 'string' as any,
                        description: '请求URL',
                        required: true
                    },
                    {
                        name: 'method',
                        type: 'string' as any,
                        description: '请求方法',
                        required: false,
                        default: 'GET',
                        enum: ['GET', 'POST', 'PUT', 'DELETE']
                    },
                    {
                        name: 'headers',
                        type: 'object' as any,
                        description: '请求头',
                        required: false
                    },
                    {
                        name: 'body',
                        type: 'string' as any,
                        description: '请求体',
                        required: false
                    }
                ],
                outputType: 'object',
                isEnabled: true,
                isBuiltin: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }, this.webRequest.bind(this));
            
        } catch (error) {
            console.error('初始化内置工具失败:', error);
        }
    }
    
    /**
     * 注册工具
     * 
     * @param {ITool} tool - 工具配置
     * @param {Function} handler - 工具处理函数
     * @returns {boolean} 是否注册成功
     */
    registerTool(tool: ITool, handler: Function): boolean {
        try {
            // 检查工具ID是否已存在
            if (this.tools.has(tool.id)) {
                console.warn(`工具ID '${tool.id}' 已存在，将被覆盖`);
            }
            
            // 注册工具
            this.tools.set(tool.id, tool);
            this.handlers.set(tool.id, handler);
            
            return true;
        } catch (error) {
            console.error('注册工具失败:', error);
            return false;
        }
    }
    
    /**
     * 获取所有工具
     * 
     * @returns {ITool[]} 工具列表
     */
    getAllTools(): ITool[] {
        return Array.from(this.tools.values());
    }
    
    /**
     * 获取特定类别的工具
     * 
     * @param {TToolCategory} category - 工具类别
     * @returns {ITool[]} 工具列表
     */
    getToolsByCategory(category: TToolCategory): ITool[] {
        return this.getAllTools().filter(tool => tool.category === category);
    }
    
    /**
     * 获取工具
     * 
     * @param {string} toolId - 工具ID
     * @returns {ITool | null} 工具配置
     */
    getTool(toolId: string): ITool | null {
        return this.tools.get(toolId) || null;
    }
    
    /**
     * 调用工具
     * 
     * @param {string} toolId - 工具ID
     * @param {Record<string, any>} params - 工具参数
     * @param {string} sessionId - 会话ID
     * @param {string} agentId - 代理ID
     * @returns {Promise<IToolCallResult>} 工具调用结果
     */
    async callTool(
        toolId: string,
        params: Record<string, any>,
        sessionId: string,
        agentId: string
    ): Promise<IToolCallResult> {
        try {
            // 获取工具配置
            const tool = this.getTool(toolId);
            if (!tool) {
                return { success: false, error: `工具 '${toolId}' 不存在` };
            }
            
            // 检查工具是否启用
            if (!tool.isEnabled) {
                return { success: false, error: `工具 '${toolId}' 未启用` };
            }
            
            // 获取工具处理函数
            const handler = this.handlers.get(toolId);
            if (!handler) {
                return { success: false, error: `工具 '${toolId}' 没有处理函数` };
            }
            
            // 验证参数
            const validationResult = this.validateParams(tool, params);
            if (!validationResult.success) {
                return validationResult;
            }
            
            // 创建工具调用记录
            const toolCall: IToolCall = {
                id: uuidv4(),
                toolId,
                sessionId,
                agentId,
                params,
                result: null,
                status: 'pending',
                startTime: new Date()
            };
            
            // 记录工具调用
            await this.recordToolCall(toolCall);
            
            // 调用工具
            const startTime = Date.now();
            let result: IToolCallResult;
            
            try {
                const data = await handler(params);
                result = { 
                    success: true, 
                    data, 
                    executionTime: Date.now() - startTime 
                };
                
                // 更新调用记录
                await this.updateToolCallResult(toolCall.id, {
                    result: data,
                    status: 'success',
                    endTime: new Date()
                });
            } catch (error) {
                console.error(`调用工具 '${toolId}' 失败:`, error);
                const errorMessage = error instanceof Error ? error.message : String(error);
                
                result = { 
                    success: false, 
                    error: errorMessage, 
                    executionTime: Date.now() - startTime 
                };
                
                // 更新调用记录
                await this.updateToolCallResult(toolCall.id, {
                    error: errorMessage,
                    status: 'error',
                    endTime: new Date()
                });
            }
            
            return result;
        } catch (error) {
            console.error('调用工具失败:', error);
            return { 
                success: false, 
                error: '工具调用过程中发生错误' 
            };
        }
    }
    
    /**
     * 验证工具参数
     * 
     * @param {ITool} tool - 工具配置
     * @param {Record<string, any>} params - 工具参数
     * @returns {IToolCallResult} 验证结果
     */
    private validateParams(tool: ITool, params: Record<string, any>): IToolCallResult {
        try {
            // 检查必要参数
            for (const param of tool.params) {
                if (param.required && (params[param.name] === undefined || params[param.name] === null)) {
                    return { 
                        success: false, 
                        error: `缺少必要参数 '${param.name}'` 
                    };
                }
            }
            
            // 检查枚举参数
            for (const param of tool.params) {
                if (
                    param.enum && 
                    params[param.name] !== undefined && 
                    !param.enum.includes(params[param.name])
                ) {
                    return { 
                        success: false, 
                        error: `参数 '${param.name}' 的值必须是以下之一: ${param.enum.join(', ')}` 
                    };
                }
            }
            
            return { success: true };
        } catch (error) {
            console.error('验证参数失败:', error);
            return { success: false, error: '参数验证失败' };
        }
    }
    
    /**
     * 记录工具调用
     * 
     * @param {IToolCall} toolCall - 工具调用记录
     * @returns {Promise<void>}
     */
    private async recordToolCall(toolCall: IToolCall): Promise<void> {
        try {
            // TODO: 将工具调用记录保存到数据库
            console.log('记录工具调用:', toolCall);
        } catch (error) {
            console.error('记录工具调用失败:', error);
        }
    }
    
    /**
     * 更新工具调用结果
     * 
     * @param {string} callId - 调用ID
     * @param {Partial<IToolCall>} update - 更新内容
     * @returns {Promise<void>}
     */
    private async updateToolCallResult(
        callId: string,
        update: Partial<IToolCall>
    ): Promise<void> {
        try {
            // TODO: 更新数据库中的工具调用记录
            console.log('更新工具调用结果:', callId, update);
        } catch (error) {
            console.error('更新工具调用结果失败:', error);
        }
    }
    
    /**
     * 终端命令执行处理函数
     * 
     * @param {object} params - 参数
     * @returns {Promise<string>} 命令输出
     */
    private async executeTerminalCommand(params: { command: string, workingDir?: string }): Promise<string> {
        try {
            return await mcpTools.executeCommand(params.command, params.workingDir);
        } catch (error) {
            console.error('执行终端命令失败:', error);
            throw error;
        }
    }
    
    /**
     * 文件读取处理函数
     * 
     * @param {object} params - 参数
     * @returns {Promise<string>} 文件内容
     */
    private async readFile(params: { path: string }): Promise<string> {
        try {
            return await mcpTools.readFile(params.path);
        } catch (error) {
            console.error('读取文件失败:', error);
            throw error;
        }
    }
    
    /**
     * 文件写入处理函数
     * 
     * @param {object} params - 参数
     * @returns {Promise<boolean>} 是否成功
     */
    private async writeFile(params: { path: string, content: string, append?: boolean }): Promise<boolean> {
        try {
            await mcpTools.writeFile(
                params.path,
                params.content,
                params.append || false
            );
            return true;
        } catch (error) {
            console.error('写入文件失败:', error);
            throw error;
        }
    }
    
    /**
     * 网络请求处理函数
     * 
     * @param {object} params - 参数
     * @returns {Promise<object>} 响应结果
     */
    private async webRequest(
        params: { url: string, method?: string, headers?: Record<string, string>, body?: string }
    ): Promise<object> {
        try {
            const response = await fetch(params.url, {
                method: params.method || 'GET',
                headers: params.headers || {},
                body: params.body
            });
            
            const contentType = response.headers.get('content-type') || '';
            
            // 根据内容类型返回相应格式的数据
            if (contentType.includes('application/json')) {
                return {
                    status: response.status,
                    statusText: response.statusText,
                    headers: Object.fromEntries(response.headers.entries()),
                    data: await response.json()
                };
            } else {
                return {
                    status: response.status,
                    statusText: response.statusText,
                    headers: Object.fromEntries(response.headers.entries()),
                    data: await response.text()
                };
            }
        } catch (error) {
            console.error('网络请求失败:', error);
            throw error;
        }
    }
}

export const toolService = new ToolService(); 