import { Message } from '@/types/message';
import { MessageRouteRule, MessageRouteResult } from '@/types/message-route';
import { Session } from '@/types/session';
import { Agent } from '@/types/agent';
import { MessageRouter } from '@/lib/message-router';
import { getAllMessageRouteRules } from './message-route-service';
import { addMessageToSession } from './session-service';

/**
 * 消息路由服务
 * 提供消息路由和转发功能
 */
export class MessageRouterService {
    private messageRouter: MessageRouter;
    
    /**
     * 构造函数
     */
    constructor() {
        this.messageRouter = new MessageRouter([]);
    }
    
    /**
     * 初始化消息路由器
     */
    async initialize(): Promise<void> {
        try {
            // 加载所有消息路由规则
            const rules = await getAllMessageRouteRules();
            this.messageRouter.setRules(rules);
            
            console.log('消息路由器初始化成功，加载了', rules.length, '条规则');
        } catch (error) {
            console.error('初始化消息路由器失败:', error);
            throw new Error('初始化消息路由器失败');
        }
    }
    
    /**
     * 路由消息
     * @param message 消息对象
     * @param session 会话对象
     * @returns 路由结果
     */
    async routeMessage(message: Message, session: Session): Promise<MessageRouteResult> {
        try {
            // 创建代理映射
            const agentsMap: Record<string, { id: string; role: string }> = {};
            session.agents.forEach(agent => {
                agentsMap[agent.id] = { id: agent.id, role: agent.role };
            });
            
            // 路由消息
            const routeResult = this.messageRouter.routeMessage(message, agentsMap);
            
            // 如果没有被拦截，保存原始消息
            if (!routeResult.intercepted) {
                await addMessageToSession(session.id, {
                    content: message.content,
                    type: message.type,
                    senderId: message.senderId,
                    receiverId: message.receiverId,
                    metadata: message.metadata
                });
            }
            
            // 处理转发
            if (routeResult.forwardTo && routeResult.forwardTo.length > 0) {
                for (const target of routeResult.forwardTo) {
                    // 跳过与原始接收者相同的目标（如果没有被拦截）
                    if (!routeResult.intercepted && target.receiverId === message.receiverId) {
                        continue;
                    }
                    
                    // 创建转发消息
                    await addMessageToSession(session.id, {
                        content: message.content,
                        type: message.type,
                        senderId: message.senderId,
                        receiverId: target.receiverId,
                        metadata: {
                            ...(message.metadata || {}),
                            forwarded: true,
                            originalReceiverId: message.receiverId,
                            appliedRules: routeResult.appliedRules
                        }
                    });
                }
            }
            
            return routeResult;
        } catch (error) {
            console.error('路由消息失败:', error);
            
            // 返回错误结果
            return {
                success: false,
                intercepted: false,
                appliedRules: [],
                error: error instanceof Error ? error.message : '路由消息失败'
            };
        }
    }
    
    /**
     * 刷新路由规则
     */
    async refreshRules(): Promise<number> {
        try {
            const rules = await getAllMessageRouteRules();
            this.messageRouter.setRules(rules);
            return rules.length;
        } catch (error) {
            console.error('刷新路由规则失败:', error);
            throw new Error('刷新路由规则失败');
        }
    }
}

// 创建消息路由服务单例
export const messageRouterService = new MessageRouterService();

export default messageRouterService; 