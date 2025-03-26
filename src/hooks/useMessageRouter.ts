/**
 * 消息路由自定义Hook
 */
import { useState, useEffect, useCallback } from 'react';
import { IAgentMessage } from '@/types/agent';
import { messageRouter, IMessageRouteRule } from '@/features/message-router';
import { v4 as uuidv4 } from 'uuid';

/**
 * 使用消息路由Hook
 * 
 * @returns {Object} 消息路由状态和控制方法
 */
export function useMessageRouter() {
    // 路由规则
    const [rules, setRules] = useState<IMessageRouteRule[]>([]);
    
    // 最近处理的消息
    const [recentMessages, setRecentMessages] = useState<IAgentMessage[]>([]);
    
    // 消息处理器ID（用于订阅/取消订阅）
    const [handlerId] = useState(() => `message-handler-${uuidv4()}`);
    
    // 加载状态
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    // 错误状态
    const [error, setError] = useState<string | null>(null);
    
    // 初始化：获取规则
    useEffect(() => {
        try {
            const currentRules = messageRouter.getRules();
            setRules(currentRules);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
    }, []);
    
    // 订阅消息处理
    useEffect(() => {
        const unsubscribe = messageRouter.registerMessageHandler(
            handlerId,
            async (message) => {
                // 更新最近处理的消息
                setRecentMessages(prev => {
                    // 保持最多20条最近消息
                    const messages = [message, ...prev];
                    if (messages.length > 20) {
                        return messages.slice(0, 20);
                    }
                    return messages;
                });
            }
        );
        
        return () => {
            unsubscribe();
        };
    }, [handlerId]);
    
    // 添加规则
    const addRule = useCallback((rule: Omit<IMessageRouteRule, 'id'>) => {
        try {
            setIsLoading(true);
            const ruleId = messageRouter.addRule(rule);
            
            // 更新规则列表
            setRules(messageRouter.getRules());
            
            return ruleId;
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    // 更新规则
    const updateRule = useCallback((id: string, updates: Partial<IMessageRouteRule>) => {
        try {
            setIsLoading(true);
            const result = messageRouter.updateRule(id, updates);
            
            // 更新规则列表
            if (result) {
                setRules(messageRouter.getRules());
            }
            
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    // 删除规则
    const deleteRule = useCallback((id: string) => {
        try {
            setIsLoading(true);
            const result = messageRouter.deleteRule(id);
            
            // 更新规则列表
            if (result) {
                setRules(messageRouter.getRules());
            }
            
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    // 路由消息
    const routeMessage = useCallback(async (message: IAgentMessage) => {
        try {
            setIsLoading(true);
            await messageRouter.routeMessage(message);
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    // 清除错误
    const clearError = useCallback(() => {
        setError(null);
    }, []);
    
    // 刷新规则列表
    const refreshRules = useCallback(() => {
        try {
            const currentRules = messageRouter.getRules();
            setRules(currentRules);
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            return false;
        }
    }, []);
    
    // 返回状态和方法
    return {
        rules,
        recentMessages,
        isLoading,
        error,
        addRule,
        updateRule,
        deleteRule,
        routeMessage,
        clearError,
        refreshRules
    };
}

export default useMessageRouter; 