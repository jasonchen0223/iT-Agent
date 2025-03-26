import { Message } from '@/types/message';
import { MessageRouteRule, MessageRouteResult } from '@/types/message-route';

/**
 * 消息路由器
 * 用于根据规则路由消息到相应的代理
 */
export class MessageRouter {
    private rules: MessageRouteRule[] = [];

    /**
     * 构造函数
     * @param rules 初始规则集
     */
    constructor(rules: MessageRouteRule[] = []) {
        this.rules = this.sortRules(rules);
    }

    /**
     * 设置路由规则
     * @param rules 规则集
     */
    setRules(rules: MessageRouteRule[]): void {
        this.rules = this.sortRules(rules);
    }

    /**
     * 添加路由规则
     * @param rule 规则
     */
    addRule(rule: MessageRouteRule): void {
        this.rules.push(rule);
        this.rules = this.sortRules(this.rules);
    }

    /**
     * 根据优先级排序规则
     * @param rules 规则集
     * @returns 排序后的规则集
     */
    private sortRules(rules: MessageRouteRule[]): MessageRouteRule[] {
        const priorityOrder = { high: 0, normal: 1, low: 2 };
        return [...rules].sort((a, b) => {
            const priorityDiff = (priorityOrder[a.priority as keyof typeof priorityOrder] || 1) 
                - (priorityOrder[b.priority as keyof typeof priorityOrder] || 1);
            
            // 如果优先级相同，则按创建时间排序
            if (priorityDiff === 0) {
                return a.createdAt.getTime() - b.createdAt.getTime();
            }
            
            return priorityDiff;
        });
    }

    /**
     * 路由消息
     * @param message 要路由的消息
     * @param agentsMap 代理映射表 {id: {id, role}}
     * @returns 路由结果
     */
    routeMessage(
        message: Message, 
        agentsMap: Record<string, { id: string; role: string }>
    ): MessageRouteResult {
        // 初始化结果
        const result: MessageRouteResult = {
            success: true,
            intercepted: false,
            forwardTo: [],
            appliedRules: [],
        };

        // 如果没有规则，直接传递原始消息
        if (this.rules.length === 0) {
            result.forwardTo = [{
                receiverId: message.receiverId,
                receiverRole: agentsMap[message.receiverId]?.role
            }];
            return result;
        }

        // 获取发送者和接收者角色
        const senderRole = agentsMap[message.senderId]?.role;
        const receiverRole = agentsMap[message.receiverId]?.role;

        // 应用所有匹配的规则
        for (const rule of this.rules) {
            // 跳过禁用的规则
            if (!rule.enabled) continue;

            // 检查规则是否匹配
            if (this.ruleMatches(rule, message, senderRole, receiverRole)) {
                result.appliedRules.push(rule.id);

                // 如果规则指定拦截原始消息
                if (rule.interceptOriginal) {
                    result.intercepted = true;
                }

                // 如果规则指定了转发目标
                if (rule.forwardToId || rule.forwardToRole) {
                    // 如果指定了明确的转发目标ID
                    if (rule.forwardToId) {
                        result.forwardTo?.push({
                            receiverId: rule.forwardToId,
                            receiverRole: agentsMap[rule.forwardToId]?.role
                        });
                    } 
                    // 如果指定了转发目标角色，查找所有匹配该角色的代理
                    else if (rule.forwardToRole) {
                        const forwardTargets = Object.values(agentsMap)
                            .filter(agent => agent.role === rule.forwardToRole)
                            .map(agent => ({
                                receiverId: agent.id,
                                receiverRole: agent.role
                            }));
                        
                        if (forwardTargets.length > 0) {
                            result.forwardTo = [...(result.forwardTo || []), ...forwardTargets];
                        }
                    }
                }
            }
        }

        // 如果没有匹配的规则或没有拦截原始消息，则保留原始接收者
        if (!result.intercepted && (!result.forwardTo || result.forwardTo.length === 0)) {
            result.forwardTo = [{
                receiverId: message.receiverId,
                receiverRole: receiverRole
            }];
        }

        return result;
    }

    /**
     * 检查规则是否匹配消息
     */
    private ruleMatches(
        rule: MessageRouteRule,
        message: Message,
        senderRole?: string,
        receiverRole?: string
    ): boolean {
        // 如果规则指定了发送者角色，但不匹配
        if (rule.senderRole && rule.senderRole !== senderRole) {
            return false;
        }

        // 如果规则指定了接收者角色，但不匹配
        if (rule.receiverRole && rule.receiverRole !== receiverRole) {
            return false;
        }

        // 如果规则指定了消息类型，但不匹配
        if (rule.messageType && rule.messageType !== message.type) {
            return false;
        }

        // 如果规则指定了关键词，检查是否包含任一关键词
        if (rule.keywords && rule.keywords.length > 0) {
            const messageContent = message.content.toLowerCase();
            const hasKeyword = rule.keywords.some(keyword => 
                messageContent.includes(keyword.toLowerCase())
            );
            
            if (!hasKeyword) {
                return false;
            }
        }

        // 所有条件都匹配
        return true;
    }
} 