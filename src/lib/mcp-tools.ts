/**
 * MCP工具包装器
 * 
 * 提供对MCP工具的统一封装与调用接口
 */
import { IToolConfig, IToolResult, TToolCategory } from '../types/tool';

/**
 * MCP工具注册表
 */
const mcpToolRegistry: Record<string, IToolConfig> = {};

/**
 * 注册MCP工具
 * 
 * @param {IToolConfig} toolConfig - 工具配置
 * @returns {boolean} 注册是否成功
 */
export function registerMcpTool(toolConfig: IToolConfig): boolean {
    // 检查工具ID是否已存在
    if (mcpToolRegistry[toolConfig.id]) {
        console.error(`工具ID已存在: ${toolConfig.id}`);
        return false;
    }
    
    // 注册工具
    mcpToolRegistry[toolConfig.id] = toolConfig;
    return true;
}

/**
 * 获取所有已注册的MCP工具
 * 
 * @returns {IToolConfig[]} 工具配置列表
 */
export function getAllMcpTools(): IToolConfig[] {
    return Object.values(mcpToolRegistry);
}

/**
 * 获取指定ID的MCP工具
 * 
 * @param {string} toolId - 工具ID
 * @returns {IToolConfig | null} 工具配置或null
 */
export function getMcpToolById(toolId: string): IToolConfig | null {
    return mcpToolRegistry[toolId] || null;
}

/**
 * 调用MCP工具
 * 
 * @param {string} toolId - 工具ID
 * @param {Record<string, any>} params - 调用参数
 * @returns {Promise<IToolResult>} 执行结果
 */
export async function callMcpTool(
    toolId: string, 
    params: Record<string, any>
): Promise<IToolResult> {
    // 获取工具配置
    const toolConfig = getMcpToolById(toolId);
    if (!toolConfig) {
        return {
            success: false,
            error: `未找到工具: ${toolId}`,
        };
    }
    
    try {
        // 这里应该实际调用MCP工具API
        // 当前只是模拟返回
        console.log(`调用MCP工具: ${toolId}`, params);
        
        return {
            success: true,
            data: {
                message: `成功调用工具: ${toolConfig.name}`,
                params,
                timestamp: new Date().toISOString(),
            },
        };
    } catch (error) {
        return {
            success: false,
            error: `工具调用失败: ${error instanceof Error ? error.message : String(error)}`,
        };
    }
}

/**
 * 初始化终端命令工具
 * 
 * 注册基本的终端命令执行工具
 */
export function initTerminalTools() {
    registerMcpTool({
        id: 'run_terminal_cmd',
        name: '运行终端命令',
        description: '执行终端命令并返回结果',
        category: TToolCategory.TERMINAL,
        functionName: 'run_terminal_cmd',
        parameters: [
            {
                name: 'command',
                description: '要执行的命令',
                type: 'string',
                required: true,
                example: 'ls -la',
            },
            {
                name: 'is_background',
                description: '是否后台运行',
                type: 'boolean',
                required: true,
                default: false,
            },
            {
                name: 'require_user_approval',
                description: '是否需要用户确认',
                type: 'boolean',
                required: true,
                default: true,
            },
        ],
        requireConfirmation: true,
    });
}

/**
 * 初始化文件系统工具
 * 
 * 注册基本的文件操作工具
 */
export function initFileSystemTools() {
    // 列出目录内容
    registerMcpTool({
        id: 'list_dir',
        name: '列出目录',
        description: '列出指定目录中的文件和子目录',
        category: TToolCategory.FILE_SYSTEM,
        functionName: 'list_dir',
        parameters: [
            {
                name: 'relative_workspace_path',
                description: '相对于工作空间的路径',
                type: 'string',
                required: true,
                example: '.',
            },
        ],
        requireConfirmation: false,
    });
    
    // 读取文件内容
    registerMcpTool({
        id: 'read_file',
        name: '读取文件',
        description: '读取文件内容',
        category: TToolCategory.FILE_SYSTEM,
        functionName: 'read_file',
        parameters: [
            {
                name: 'target_file',
                description: '目标文件路径',
                type: 'string',
                required: true,
                example: 'src/app/page.tsx',
            },
            {
                name: 'offset',
                description: '起始行号',
                type: 'number',
                required: false,
                default: 0,
            },
            {
                name: 'limit',
                description: '读取的行数',
                type: 'number',
                required: false,
                default: 100,
            },
        ],
        requireConfirmation: false,
    });
    
    // 编辑文件
    registerMcpTool({
        id: 'edit_file',
        name: '编辑文件',
        description: '编辑文件内容',
        category: TToolCategory.FILE_SYSTEM,
        functionName: 'edit_file',
        parameters: [
            {
                name: 'target_file',
                description: '目标文件路径',
                type: 'string',
                required: true,
                example: 'src/app/page.tsx',
            },
            {
                name: 'instructions',
                description: '编辑说明',
                type: 'string',
                required: true,
            },
            {
                name: 'code_edit',
                description: '编辑的代码',
                type: 'string',
                required: true,
            },
        ],
        requireConfirmation: true,
    });
}

/**
 * 初始化所有MCP工具
 * 
 * 注册所有基本的MCP工具
 */
export function initAllMcpTools() {
    initTerminalTools();
    initFileSystemTools();
} 