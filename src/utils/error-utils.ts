/**
 * 错误处理工具类
 * 
 * 提供错误处理相关的实用函数
 */

import { errorManager, BaseError } from '@/lib/errors';
import { ToastProps } from '@/components/ui/toast-unified';

/**
 * 将错误转换为用户友好的消息
 * 
 * @param error 错误对象
 * @returns 用户友好的错误消息
 */
export function getUserFriendlyErrorMessage(error: any): string {
    if (!error) {
        return '发生未知错误';
    }
    
    // 如果是自定义错误类
    if (error instanceof BaseError) {
        return error.message;
    }
    
    // 如果是 API 错误响应
    if (error.response && error.response.data) {
        if (typeof error.response.data === 'string') {
            return error.response.data;
        }
        
        if (error.response.data.message || error.response.data.error) {
            return error.response.data.message || error.response.data.error;
        }
    }
    
    // 如果是标准 Error 对象
    if (error instanceof Error) {
        return error.message;
    }
    
    // 如果是字符串
    if (typeof error === 'string') {
        return error;
    }
    
    // 无法识别的错误类型
    return '发生未知错误';
}

/**
 * 将错误对象转换为 Toast 数据
 * 
 * @param error 错误对象 
 * @returns Toast数据对象
 */
export function errorToToast(error: any): Omit<ToastProps, 'id'> {
    const isCustomError = error instanceof BaseError;
    
    return {
        type: 'error',
        title: isCustomError ? `错误: ${error.code}` : '操作失败',
        description: getUserFriendlyErrorMessage(error),
        duration: 5000,
    };
}

/**
 * 将错误记录到日志
 * 
 * @param error 错误对象
 * @param context 错误上下文
 */
export function logError(error: any, context?: Record<string, any>): void {
    if (error instanceof Error) {
        // 使用错误管理器记录错误
        errorManager.handleError(error);
        
        // 补充日志信息
        if (context) {
            console.error('错误上下文:', context);
        }
    } else {
        console.error('非标准错误对象:', error);
        if (context) {
            console.error('错误上下文:', context);
        }
    }
}

/**
 * 异步错误处理器
 * 
 * @param promise Promise对象
 * @returns [结果, 错误] 元组
 */
export async function handleAsync<T>(
    promise: Promise<T>
): Promise<[T | null, Error | null]> {
    try {
        const result = await promise;
        return [result, null];
    } catch (error) {
        return [null, error as Error];
    }
}

/**
 * 重试异步操作
 * 
 * @param operation 异步操作函数
 * @param retries 重试次数
 * @param delay 重试延迟(毫秒)
 * @returns 操作结果
 */
export async function retryAsync<T>(
    operation: () => Promise<T>,
    retries = 3,
    delay = 300
): Promise<T> {
    try {
        return await operation();
    } catch (error) {
        if (retries <= 0) {
            throw error;
        }
        
        console.warn(`操作失败，${retries}次重试后重新尝试:`, error);
        
        // 等待指定延迟
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // 指数退避策略
        const nextDelay = delay * 2;
        
        // 递归重试
        return retryAsync(operation, retries - 1, nextDelay);
    }
}

/**
 * 防抖异步函数执行
 */
export function debounceAsync<T, A extends any[]>(
    fn: (...args: A) => Promise<T>,
    wait: number
): (...args: A) => Promise<T> {
    let timer: NodeJS.Timeout | null = null;
    let resolves: ((value: T) => void)[] = [];
    let rejects: ((reason: any) => void)[] = [];
    let lastArgs: A | null = null;
    
    return (...args: A): Promise<T> => {
        lastArgs = args;
        
        return new Promise<T>((resolve, reject) => {
            resolves.push(resolve);
            rejects.push(reject);
            
            if (timer) {
                clearTimeout(timer);
            }
            
            timer = setTimeout(async () => {
                const currentResolves = [...resolves];
                const currentRejects = [...rejects];
                const currentArgs = lastArgs as A;
                
                resolves = [];
                rejects = [];
                timer = null;
                lastArgs = null;
                
                try {
                    const result = await fn(...currentArgs);
                    currentResolves.forEach(resolve => resolve(result));
                } catch (error) {
                    currentRejects.forEach(reject => reject(error));
                }
            }, wait);
        });
    };
} 