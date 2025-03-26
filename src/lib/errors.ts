/**
 * 系统错误类型
 * 
 * 定义系统中使用的自定义错误类型和错误处理机制
 */

/**
 * 基础错误类
 */
export class BaseError extends Error {
    /**
     * 错误代码
     */
    code: string;
    
    /**
     * 状态码
     */
    statusCode: number;
    
    /**
     * 严重性级别
     */
    severity: 'low' | 'medium' | 'high' | 'critical';
    
    /**
     * 错误详情对象
     */
    details?: Record<string, any>;
    
    /**
     * 可用于修复的建议
     */
    suggestion?: string;
    
    constructor(message: string, options: {
        code?: string,
        statusCode?: number,
        severity?: 'low' | 'medium' | 'high' | 'critical',
        details?: Record<string, any>,
        suggestion?: string
    } = {}) {
        super(message);
        this.name = this.constructor.name;
        this.code = options.code || 'UNKNOWN_ERROR';
        this.statusCode = options.statusCode || 500;
        this.severity = options.severity || 'medium';
        this.details = options.details;
        this.suggestion = options.suggestion;
        
        // 确保 stack trace 正确
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
    
    /**
     * 获取错误详情
     */
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            statusCode: this.statusCode,
            severity: this.severity,
            details: this.details,
            suggestion: this.suggestion,
            stack: this.stack
        };
    }
}

// =================== 工具相关错误 ===================

/**
 * 工具参数验证错误
 */
export class ToolParameterValidationError extends BaseError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, {
            code: 'TOOL_PARAMETER_VALIDATION_ERROR',
            statusCode: 400,
            severity: 'medium',
            details,
            suggestion: '请检查工具参数是否符合要求'
        });
    }
}

/**
 * 工具执行错误
 */
export class ToolExecutionError extends BaseError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, {
            code: 'TOOL_EXECUTION_ERROR',
            statusCode: 500,
            severity: 'high',
            details,
            suggestion: '请检查工具执行环境和参数是否正确'
        });
    }
}

/**
 * 工具注册错误
 */
export class ToolRegistrationError extends BaseError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, {
            code: 'TOOL_REGISTRATION_ERROR',
            statusCode: 400,
            severity: 'medium',
            details,
            suggestion: '请检查工具配置是否完整和正确'
        });
    }
}

/**
 * 工具权限错误
 */
export class ToolPermissionError extends BaseError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, {
            code: 'TOOL_PERMISSION_ERROR',
            statusCode: 403,
            severity: 'high',
            details,
            suggestion: '请确认用户是否有使用此工具的权限'
        });
    }
}

// =================== 代理相关错误 ===================

/**
 * 代理错误
 */
export class AgentError extends BaseError {
    constructor(message: string, options: any = {}) {
        super(message, {
            code: options.code || 'AGENT_ERROR',
            statusCode: options.statusCode || 500,
            severity: options.severity || 'medium',
            details: options.details,
            suggestion: options.suggestion || '请检查代理配置和状态'
        });
    }
}

/**
 * 代理初始化错误
 */
export class AgentInitializationError extends AgentError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, {
            code: 'AGENT_INITIALIZATION_ERROR',
            statusCode: 500,
            severity: 'high',
            details,
            suggestion: '请检查代理配置和依赖服务是否正确'
        });
    }
}

/**
 * 代理通信错误
 */
export class AgentCommunicationError extends AgentError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, {
            code: 'AGENT_COMMUNICATION_ERROR',
            statusCode: 500,
            severity: 'high',
            details,
            suggestion: '请检查代理之间的通信通道是否正常'
        });
    }
}

/**
 * 代理状态错误
 */
export class AgentStateError extends AgentError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, {
            code: 'AGENT_STATE_ERROR',
            statusCode: 409,
            severity: 'medium',
            details,
            suggestion: '请检查代理状态是否允许此操作'
        });
    }
}

// =================== API相关错误 ===================

/**
 * API错误
 */
export class ApiError extends BaseError {
    constructor(message: string, options: any = {}) {
        super(message, {
            code: options.code || 'API_ERROR',
            statusCode: options.statusCode || 400,
            severity: options.severity || 'medium',
            details: options.details,
            suggestion: options.suggestion || '请检查API请求参数是否正确'
        });
    }
}

/**
 * 资源不存在错误
 */
export class NotFoundError extends ApiError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, {
            code: 'NOT_FOUND_ERROR',
            statusCode: 404,
            severity: 'low',
            details,
            suggestion: '请检查请求的资源ID是否正确'
        });
    }
}

/**
 * 认证错误
 */
export class AuthenticationError extends ApiError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, {
            code: 'AUTHENTICATION_ERROR',
            statusCode: 401,
            severity: 'high',
            details,
            suggestion: '请检查认证凭据是否有效'
        });
    }
}

/**
 * 授权错误
 */
export class AuthorizationError extends ApiError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, {
            code: 'AUTHORIZATION_ERROR',
            statusCode: 403,
            severity: 'high',
            details,
            suggestion: '用户没有执行此操作的权限'
        });
    }
}

/**
 * 验证错误
 */
export class ValidationError extends ApiError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, {
            code: 'VALIDATION_ERROR',
            statusCode: 400,
            severity: 'medium',
            details,
            suggestion: '请检查提交的数据是否符合要求'
        });
    }
}

// =================== 数据相关错误 ===================

/**
 * 数据错误
 */
export class DataError extends BaseError {
    constructor(message: string, options: any = {}) {
        super(message, {
            code: options.code || 'DATA_ERROR',
            statusCode: options.statusCode || 500,
            severity: options.severity || 'high',
            details: options.details,
            suggestion: options.suggestion || '请检查数据操作和数据库连接'
        });
    }
}

/**
 * 数据库连接错误
 */
export class DatabaseConnectionError extends DataError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, {
            code: 'DATABASE_CONNECTION_ERROR',
            statusCode: 503,
            severity: 'critical',
            details,
            suggestion: '请检查数据库连接配置和数据库服务状态'
        });
    }
}

/**
 * 数据查询错误
 */
export class DatabaseQueryError extends DataError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, {
            code: 'DATABASE_QUERY_ERROR',
            statusCode: 500,
            severity: 'high',
            details,
            suggestion: '请检查SQL查询语句是否正确'
        });
    }
}

/**
 * 数据完整性错误
 */
export class DataIntegrityError extends DataError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, {
            code: 'DATA_INTEGRITY_ERROR',
            statusCode: 409,
            severity: 'high',
            details,
            suggestion: '请检查数据是否满足完整性约束'
        });
    }
}

// =================== 系统相关错误 ===================

/**
 * 系统错误
 */
export class SystemError extends BaseError {
    constructor(message: string, options: any = {}) {
        super(message, {
            code: options.code || 'SYSTEM_ERROR',
            statusCode: options.statusCode || 500,
            severity: options.severity || 'critical',
            details: options.details,
            suggestion: options.suggestion || '请联系系统管理员'
        });
    }
}

/**
 * 配置错误
 */
export class ConfigurationError extends SystemError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, {
            code: 'CONFIGURATION_ERROR',
            statusCode: 500,
            severity: 'high',
            details,
            suggestion: '请检查系统配置文件和环境变量'
        });
    }
}

/**
 * 外部服务错误
 */
export class ExternalServiceError extends SystemError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, {
            code: 'EXTERNAL_SERVICE_ERROR',
            statusCode: 502,
            severity: 'high',
            details,
            suggestion: '请检查外部服务状态和连接配置'
        });
    }
}

// =================== 错误处理函数 ===================

/**
 * 通用错误处理函数类型
 */
export type ErrorHandler = (error: Error) => void;

/**
 * 全局错误处理器配置
 */
interface ErrorHandlerConfig {
    /**
     * 是否自动记录错误到控制台
     */
    logToConsole: boolean;
    
    /**
     * 是否记录错误到服务器
     */
    logToServer: boolean;
    
    /**
     * 是否在生产环境隐藏错误详情
     */
    hideDetailsInProduction: boolean;
    
    /**
     * 自定义错误处理器
     */
    customHandlers: Map<string, ErrorHandler>;
}

/**
 * 全局错误处理器
 */
class ErrorManager {
    private static instance: ErrorManager;
    private config: ErrorHandlerConfig = {
        logToConsole: true,
        logToServer: false,
        hideDetailsInProduction: true,
        customHandlers: new Map()
    };
    
    private constructor() {
        // 初始化默认配置
    }
    
    /**
     * 获取单例实例
     */
    public static getInstance(): ErrorManager {
        if (!ErrorManager.instance) {
            ErrorManager.instance = new ErrorManager();
        }
        return ErrorManager.instance;
    }
    
    /**
     * 配置错误处理器
     */
    public configure(config: Partial<ErrorHandlerConfig>): void {
        this.config = { ...this.config, ...config };
    }
    
    /**
     * 注册自定义错误处理器
     * 
     * @param errorName 错误名称
     * @param handler 处理函数
     */
    public registerHandler(errorName: string, handler: ErrorHandler): void {
        this.config.customHandlers.set(errorName, handler);
    }
    
    /**
     * 获取环境
     */
    private getEnvironment(): 'development' | 'production' {
        return process.env.NODE_ENV as 'development' | 'production' || 'development';
    }
    
    /**
     * 处理错误
     * 
     * @param error 错误对象
     */
    public handleError(error: Error): void {
        const isProduction = this.getEnvironment() === 'production';
        
        // 使用自定义处理器
        const customHandler = this.config.customHandlers.get(error.name);
        if (customHandler) {
            customHandler(error);
            return;
        }
        
        // 控制台日志
        if (this.config.logToConsole) {
            if (error instanceof BaseError) {
                console.error(`[${error.code}] ${error.message}`, {
                    severity: error.severity,
                    statusCode: error.statusCode,
                    details: isProduction && this.config.hideDetailsInProduction ? '[HIDDEN]' : error.details
                });
            } else {
                console.error(`[UNHANDLED ERROR] ${error.message}`, error);
            }
        }
        
        // 服务器日志
        if (this.config.logToServer) {
            // TODO: 实现服务器日志记录
        }
    }
    
    /**
     * 格式化错误为API响应
     * 
     * @param error 错误对象
     */
    public formatErrorForResponse(error: Error): { 
        success: false,
        error: string,
        code?: string,
        details?: any,
        suggestion?: string
    } {
        const isProduction = this.getEnvironment() === 'production';
        
        if (error instanceof BaseError) {
            return {
                success: false,
                error: error.message,
                code: error.code,
                details: isProduction && this.config.hideDetailsInProduction ? undefined : error.details,
                suggestion: error.suggestion
            };
        } else {
            return {
                success: false,
                error: isProduction ? '服务器处理请求时发生错误' : error.message
            };
        }
    }
    
    /**
     * 获取适合HTTP响应的状态码
     * 
     * @param error 错误对象
     */
    public getStatusCodeForError(error: Error): number {
        if (error instanceof BaseError) {
            return error.statusCode;
        } else {
            return 500;
        }
    }
}

/**
 * 全局错误处理器实例
 */
export const errorManager = ErrorManager.getInstance();

/**
 * 异步函数的错误处理包装器
 * 
 * @param fn 原始异步函数
 */
export function withErrorHandling<T, A extends any[]>(
    fn: (...args: A) => Promise<T>
): (...args: A) => Promise<T> {
    return async (...args: A): Promise<T> => {
        try {
            return await fn(...args);
        } catch (error) {
            errorManager.handleError(error as Error);
            throw error;
        }
    };
} 