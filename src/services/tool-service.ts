/**
 * 工具服务模块
 * 
 * 提供工具注册、获取和调用功能
 */
import { TTool, TToolCategory, TToolParameter } from '@/types/tool-types';
import { fileTools, readFile, writeFile, appendFile, deleteFile, createDirectory, listDirectory, getFileInfo } from '@/tools/file-tools';
import { httpTools, httpGet, httpPost, httpPut, httpDelete, httpUploadFile } from '@/tools/http-tools';
import { dataTools, parseJson, stringifyJson, formatDate, calculateStats, getObjectValue, csvToJson, jsonToCsv } from '@/tools/data-tools';

/**
 * 工具调用参数验证错误
 */
class ToolParameterValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ToolParameterValidationError';
    }
}

/**
 * 工具服务类
 * 
 * 管理工具注册、获取和调用
 */
class ToolService {
    private tools: Map<string, TTool> = new Map();
    private toolHandlers: Map<string, Function> = new Map();

    /**
     * 构造函数
     * 
     * 初始化工具服务，注册内置工具
     */
    constructor() {
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
        this.registerTools([
            ...fileTools,
            ...httpTools,
            ...dataTools
        ]);
    }

    /**
     * 注册工具
     * 
     * @param {TTool[]} tools - 要注册的工具数组
     * @returns {boolean} 是否成功注册
     */
    registerTools(tools: TTool[]): boolean {
        try {
            tools.forEach(tool => {
                this.tools.set(tool.id, tool);
            });
            return true;
        } catch (error) {
            console.error('注册工具错误:', error);
            return false;
        }
    }

    /**
     * 注册工具处理函数
     * 
     * @param {Record<string, Function>} handlers - 工具ID和处理函数的映射
     * @returns {boolean} 是否成功注册
     */
    registerToolHandlers(handlers: Record<string, Function>): boolean {
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
     * 获取所有工具
     * 
     * @param {TToolCategory} [category] - 可选的工具类别过滤
     * @returns {Promise<TTool[]>} 工具数组
     */
    async getAllTools(category?: TToolCategory): Promise<TTool[]> {
        try {
            const allTools = Array.from(this.tools.values());
            
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
     * @param {string} id - 工具ID
     * @returns {Promise<TTool | null>} 工具对象或null（如果未找到）
     */
    async getToolById(id: string): Promise<TTool | null> {
        try {
            // 目前只返回测试数据，后续将从数据库获取
            const allTools = await this.getAllTools();
            const tool = allTools.find(tool => tool.id === id);
            
            return tool || null;
        } catch (error) {
            console.error('根据ID获取工具错误:', error);
            return null;
        }
    }

    /**
     * 验证工具参数
     * 
     * @param {TTool} tool - 工具定义
     * @param {any} params - 调用参数
     * @throws {ToolParameterValidationError} 参数验证错误
     */
    private validateParameters(tool: TTool, params: any): void {
        if (!tool.parameters || tool.parameters.length === 0) {
            return;
        }

        for (const param of tool.parameters) {
            if (param.required && (params[param.name] === undefined || params[param.name] === null)) {
                throw new ToolParameterValidationError(`缺少必需参数: ${param.name}`);
            }
        }
    }

    /**
     * 调用工具
     * 
     * @param {string} toolId - 工具ID
     * @param {any} params - 调用参数
     * @param {string} sessionId - 会话ID
     * @param {string} agentId - 代理ID
     * @returns {Promise<any>} 工具调用结果
     * @throws {Error} 工具调用错误
     */
    async callTool(toolId: string, params: any, sessionId: string, agentId: string): Promise<any> {
        try {
            const tool = this.tools.get(toolId);
            
            if (!tool) {
                throw new Error(`未找到工具: ${toolId}`);
            }
            
            const handler = this.toolHandlers.get(toolId);
            
            if (!handler) {
                throw new Error(`未找到工具处理函数: ${toolId}`);
            }
            
            // 验证参数
            this.validateParameters(tool, params);
            
            // 提取参数值
            const paramValues = tool.parameters?.map(param => params[param.name]) || [];
            
            // 调用工具处理函数
            const result = await handler(...paramValues);
            
            // 记录工具调用（可扩展为写入数据库）
            console.log(`工具调用: ${toolId}`, {
                sessionId,
                agentId,
                params,
                timestamp: new Date().toISOString()
            });
            
            return result;
        } catch (error) {
            console.error(`工具调用错误 (${toolId}):`, error);
            throw error;
        }
    }
}

// 创建工具服务实例
export const toolService = new ToolService(); 