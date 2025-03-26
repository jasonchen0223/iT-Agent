/**
 * 工具调用示例
 * 
 * 展示如何使用统一工具接口
 */
import { unifiedToolService } from '@/services/unified-tool-service';

/**
 * 示例：调用文件读取工具
 * 
 * @param {string} filePath - 文件路径
 * @returns {Promise<string>} 文件内容
 */
export async function readFileExample(filePath: string): Promise<string> {
    const result = await unifiedToolService.callTool(
        'file-read',
        { filePath },
        'example-session',
        'example-agent'
    );
    
    if (result.success) {
        return result.data;
    } else {
        throw new Error(`文件读取失败: ${result.error}`);
    }
}

/**
 * 示例：调用HTTP GET请求工具
 * 
 * @param {string} url - 请求URL
 * @returns {Promise<any>} 响应数据
 */
export async function httpGetExample(url: string): Promise<any> {
    const result = await unifiedToolService.callTool(
        'http-get',
        { url },
        'example-session',
        'example-agent'
    );
    
    if (result.success) {
        return result.data;
    } else {
        throw new Error(`HTTP请求失败: ${result.error}`);
    }
}

/**
 * 示例：调用终端命令工具
 * 
 * @param {string} command - 命令
 * @returns {Promise<string>} 命令输出
 */
export async function terminalCommandExample(command: string): Promise<string> {
    const result = await unifiedToolService.callTool(
        'run_terminal_cmd',
        { 
            command,
            is_background: false,
            require_user_approval: true
        },
        'example-session',
        'example-agent'
    );
    
    if (result.success) {
        return result.data;
    } else {
        throw new Error(`命令执行失败: ${result.error}`);
    }
}

/**
 * 示例：注册自定义工具
 * 
 * @returns {boolean} 是否注册成功
 */
export function registerCustomToolExample(): boolean {
    // 定义一个简单的计算器工具
    const calculatorTool = {
        id: 'calculator',
        name: '计算器',
        description: '执行基本的数学计算',
        category: 'utility',
        parameters: [
            {
                name: 'expression',
                description: '数学表达式',
                type: 'string' as const,
                required: true,
                example: '2 + 2'
            }
        ],
        tags: ['计算', '数学'],
        icon: 'calculator'
    };
    
    // 工具处理函数
    const calculatorHandler = (expression: string): number => {
        // 安全的表达式计算（实际应用中应使用更安全的方法）
        // 这里只是示例，不建议在生产环境使用eval
        try {
            // eslint-disable-next-line no-eval
            return eval(expression);
        } catch (error) {
            throw new Error(`计算表达式错误: ${error.message}`);
        }
    };
    
    // 注册工具
    return unifiedToolService.registerTool(calculatorTool, calculatorHandler);
}

/**
 * 示例：使用自定义工具
 * 
 * @param {string} expression - 数学表达式
 * @returns {Promise<number>} 计算结果
 */
export async function useCustomToolExample(expression: string): Promise<number> {
    // 确保工具已注册
    registerCustomToolExample();
    
    const result = await unifiedToolService.callTool(
        'calculator',
        { expression },
        'example-session',
        'example-agent'
    );
    
    if (result.success) {
        return result.data;
    } else {
        throw new Error(`计算失败: ${result.error}`);
    }
}

/**
 * 示例：获取工具调用历史
 * 
 * @returns {Promise<any[]>} 调用历史
 */
export async function getToolHistoryExample(): Promise<any[]> {
    return unifiedToolService.getToolCallHistory(
        'example-session',
        undefined,
        undefined,
        10
    );
} 