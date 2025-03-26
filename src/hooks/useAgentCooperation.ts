/**
 * 代理协作自定义Hook
 */
import { useState, useEffect, useCallback } from 'react';
import { IAgentMessage } from '@/types/agent';
import { 
    agentCooperationManager, 
    ICooperationSessionState,
    TCooperationStrategy
} from '@/features/agent-cooperation';

/**
 * 使用代理协作Hook
 * 
 * @param {string} sessionId - 会话ID
 * @param {number} maxRounds - 最大轮次
 * @returns {Object} 代理协作状态和控制方法
 */
export function useAgentCooperation(sessionId: string, maxRounds: number = 10) {
    // 会话状态
    const [sessionState, setSessionState] = useState<ICooperationSessionState | null>(null);
    
    // 会话消息
    const [messages, setMessages] = useState<IAgentMessage[]>([]);
    
    // 加载状态
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    // 错误状态
    const [error, setError] = useState<string | null>(null);
    
    // 初始化会话
    useEffect(() => {
        try {
            let session = agentCooperationManager.getSessionState(sessionId);
            
            if (!session) {
                session = agentCooperationManager.createSession(sessionId, maxRounds);
            }
            
            setSessionState(session);
            setMessages(session.messages);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setIsLoading(false);
        }
    }, [sessionId, maxRounds]);
    
    // 订阅会话状态更新
    useEffect(() => {
        if (!sessionId) return;
        
        const unsubscribeState = agentCooperationManager.subscribeToStateChanges(
            sessionId,
            (state) => {
                setSessionState({ ...state });
                setMessages([...state.messages]);
            }
        );
        
        const unsubscribeMessages = agentCooperationManager.subscribeToMessages(
            sessionId,
            (message) => {
                setMessages(prev => [...prev, message]);
            }
        );
        
        return () => {
            unsubscribeState();
            unsubscribeMessages();
        };
    }, [sessionId]);
    
    // 启动协作
    const startCooperation = useCallback(
        async (strategy: TCooperationStrategy = 'sequential', initialMessage: string = '') => {
            try {
                setIsLoading(true);
                await agentCooperationManager.startCooperation(sessionId, strategy, initialMessage);
                return true;
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
                return false;
            } finally {
                setIsLoading(false);
            }
        },
        [sessionId]
    );
    
    // 发送消息
    const sendMessage = useCallback(
        async (senderId: string, receiverId: string, content: string, type?: 'text' | 'code' | 'tool_call' | 'tool_result' | 'error') => {
            try {
                setIsLoading(true);
                const message = await agentCooperationManager.sendMessage(
                    sessionId,
                    senderId,
                    receiverId,
                    content,
                    type
                );
                return message;
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        [sessionId]
    );
    
    // 暂停协作
    const pauseCooperation = useCallback(async () => {
        try {
            return await agentCooperationManager.pauseCooperation(sessionId);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            return false;
        }
    }, [sessionId]);
    
    // 恢复协作
    const resumeCooperation = useCallback(async () => {
        try {
            return await agentCooperationManager.resumeCooperation(sessionId);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            return false;
        }
    }, [sessionId]);
    
    // 结束协作
    const endCooperation = useCallback(async () => {
        try {
            return await agentCooperationManager.endCooperation(sessionId);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            return false;
        }
    }, [sessionId]);
    
    // 返回协作状态和方法
    return {
        sessionState,
        messages,
        isLoading,
        error,
        startCooperation,
        sendMessage,
        pauseCooperation,
        resumeCooperation,
        endCooperation
    };
}

export default useAgentCooperation; 