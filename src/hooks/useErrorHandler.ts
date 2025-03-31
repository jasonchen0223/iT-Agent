/**
 * 错误处理Hook
 * 
 * 用于在React组件中处理错误
 */
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/toast-unified';
import { errorToToast, logError } from '@/utils/error-utils';

/**
 * 错误处理Hook的返回值
 */
interface UseErrorHandlerReturn {
    /**
     * 当前错误
     */
    error: Error | null;
    
    /**
     * 是否正在加载
     */
    isLoading: boolean;
    
    /**
     * 处理错误的函数
     */
    handleError: (error: any, context?: Record<string, any>) => void;
    
    /**
     * 清除错误的函数
     */
    clearError: () => void;
    
    /**
     * 异步操作包装器，处理错误和加载状态
     */
    withErrorHandling: <T>(promise: () => Promise<T>) => Promise<T | undefined>;
    
    /**
     * 设置加载状态
     */
    setIsLoading: (isLoading: boolean) => void;
}

/**
 * 错误处理Hook
 * 
 * @param showToast 是否显示错误通知提示
 * @returns 错误处理相关函数和状态
 */
export function useErrorHandler(showToast = true): UseErrorHandlerReturn {
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useToast();
    
    /**
     * 处理错误
     */
    const handleError = useCallback((error: any, context?: Record<string, any>) => {
        // 记录错误
        logError(error, context);
        
        // 设置错误状态
        setError(error instanceof Error ? error : new Error(String(error)));
        
        // 结束加载状态
        setIsLoading(false);
        
        // 显示错误通知
        if (showToast) {
            toast.addToast(errorToToast(error));
        }
    }, [showToast, toast]);
    
    /**
     * 清除错误
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);
    
    /**
     * 异步操作包装器
     */
    const withErrorHandling = useCallback(async <T>(promise: () => Promise<T>): Promise<T | undefined> => {
        try {
            clearError();
            setIsLoading(true);
            
            const result = await promise();
            
            setIsLoading(false);
            return result;
        } catch (error) {
            handleError(error);
            return undefined;
        }
    }, [clearError, handleError]);
    
    return {
        error,
        isLoading,
        handleError,
        clearError,
        withErrorHandling,
        setIsLoading
    };
} 