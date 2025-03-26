/**
 * 工具类型定义
 */

/**
 * 工具类别枚举
 */
export enum TToolCategory {
    AI = 'ai',
    DEVELOPMENT = 'development',
    PRODUCTIVITY = 'productivity',
    COMMUNICATION = 'communication',
    ANALYSIS = 'analysis',
    SYSTEM = 'system',
}

/**
 * 工具接口
 */
export interface TTool {
    /**
     * 工具唯一标识
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
     * 工具标签
     */
    tags?: string[];
    
    /**
     * 是否为内置工具
     */
    isBuiltin?: boolean;
    
    /**
     * 工具图标URL
     */
    iconUrl?: string;
    
    /**
     * 工具参数定义
     */
    parameters?: TToolParameter[];
    
    /**
     * 工具返回值类型
     */
    returnType?: string;
    
    /**
     * 工具使用示例
     */
    examples?: string[];
}

/**
 * 工具参数接口
 */
export interface TToolParameter {
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
    defaultValue?: any;
    
    /**
     * 可选值列表
     */
    options?: any[];
} 