import { PrismaClient } from '@prisma/client';
import { MessageRouteRule } from '@/types/message-route';

const prisma = new PrismaClient();

/**
 * 创建新的消息路由规则
 */
export async function createMessageRouteRule(rule: Omit<MessageRouteRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<MessageRouteRule> {
    try {
        const createdRule = await prisma.messageRouteRule.create({
            data: {
                description: rule.description,
                priority: rule.priority,
                senderRole: rule.senderRole,
                receiverRole: rule.receiverRole,
                messageType: rule.messageType,
                keywords: JSON.stringify(rule.keywords || []),
                forwardToRole: rule.forwardToRole,
                forwardToId: rule.forwardToId,
                interceptOriginal: rule.interceptOriginal,
                enabled: rule.enabled ?? true,
            }
        });

        return {
            id: createdRule.id,
            description: createdRule.description,
            priority: createdRule.priority,
            senderRole: createdRule.senderRole || undefined,
            receiverRole: createdRule.receiverRole || undefined,
            messageType: createdRule.messageType || undefined,
            keywords: JSON.parse(createdRule.keywords || '[]'),
            forwardToRole: createdRule.forwardToRole || undefined,
            forwardToId: createdRule.forwardToId || undefined,
            interceptOriginal: createdRule.interceptOriginal,
            enabled: createdRule.enabled,
            createdAt: createdRule.createdAt,
            updatedAt: createdRule.updatedAt,
        };
    } catch (error) {
        console.error('创建消息路由规则失败:', error);
        throw new Error('创建消息路由规则失败');
    }
}

/**
 * 获取所有消息路由规则
 */
export async function getAllMessageRouteRules(): Promise<MessageRouteRule[]> {
    try {
        const rules = await prisma.messageRouteRule.findMany({
            orderBy: [
                { priority: 'asc' },
                { createdAt: 'desc' }
            ]
        });

        return rules.map(rule => ({
            id: rule.id,
            description: rule.description,
            priority: rule.priority,
            senderRole: rule.senderRole || undefined,
            receiverRole: rule.receiverRole || undefined,
            messageType: rule.messageType || undefined,
            keywords: JSON.parse(rule.keywords || '[]'),
            forwardToRole: rule.forwardToRole || undefined,
            forwardToId: rule.forwardToId || undefined,
            interceptOriginal: rule.interceptOriginal,
            enabled: rule.enabled,
            createdAt: rule.createdAt,
            updatedAt: rule.updatedAt,
        }));
    } catch (error) {
        console.error('获取消息路由规则失败:', error);
        throw new Error('获取消息路由规则失败');
    }
}

/**
 * 获取消息路由规则详情
 */
export async function getMessageRouteRule(ruleId: string): Promise<MessageRouteRule | null> {
    try {
        const rule = await prisma.messageRouteRule.findUnique({
            where: {
                id: ruleId
            }
        });

        if (!rule) {
            return null;
        }

        return {
            id: rule.id,
            description: rule.description,
            priority: rule.priority,
            senderRole: rule.senderRole || undefined,
            receiverRole: rule.receiverRole || undefined,
            messageType: rule.messageType || undefined,
            keywords: JSON.parse(rule.keywords || '[]'),
            forwardToRole: rule.forwardToRole || undefined,
            forwardToId: rule.forwardToId || undefined,
            interceptOriginal: rule.interceptOriginal,
            enabled: rule.enabled,
            createdAt: rule.createdAt,
            updatedAt: rule.updatedAt,
        };
    } catch (error) {
        console.error('获取消息路由规则详情失败:', error);
        throw new Error('获取消息路由规则详情失败');
    }
}

/**
 * 更新消息路由规则
 */
export async function updateMessageRouteRule(
    ruleId: string, 
    data: Partial<Omit<MessageRouteRule, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<MessageRouteRule> {
    try {
        // 处理keywords字段
        const updateData = {
            ...data,
            keywords: data.keywords ? JSON.stringify(data.keywords) : undefined
        };

        const updatedRule = await prisma.messageRouteRule.update({
            where: {
                id: ruleId
            },
            data: updateData
        });

        return {
            id: updatedRule.id,
            description: updatedRule.description,
            priority: updatedRule.priority,
            senderRole: updatedRule.senderRole || undefined,
            receiverRole: updatedRule.receiverRole || undefined,
            messageType: updatedRule.messageType || undefined,
            keywords: JSON.parse(updatedRule.keywords || '[]'),
            forwardToRole: updatedRule.forwardToRole || undefined,
            forwardToId: updatedRule.forwardToId || undefined,
            interceptOriginal: updatedRule.interceptOriginal,
            enabled: updatedRule.enabled,
            createdAt: updatedRule.createdAt,
            updatedAt: updatedRule.updatedAt,
        };
    } catch (error) {
        console.error('更新消息路由规则失败:', error);
        throw new Error('更新消息路由规则失败');
    }
}

/**
 * 删除消息路由规则
 */
export async function deleteMessageRouteRule(ruleId: string): Promise<boolean> {
    try {
        await prisma.messageRouteRule.delete({
            where: {
                id: ruleId
            }
        });
        return true;
    } catch (error) {
        console.error('删除消息路由规则失败:', error);
        throw new Error('删除消息路由规则失败');
    }
}

/**
 * 启用或禁用消息路由规则
 */
export async function toggleMessageRouteRuleStatus(ruleId: string, enabled: boolean): Promise<MessageRouteRule> {
    try {
        const updatedRule = await prisma.messageRouteRule.update({
            where: {
                id: ruleId
            },
            data: {
                enabled
            }
        });

        return {
            id: updatedRule.id,
            description: updatedRule.description,
            priority: updatedRule.priority,
            senderRole: updatedRule.senderRole || undefined,
            receiverRole: updatedRule.receiverRole || undefined,
            messageType: updatedRule.messageType || undefined,
            keywords: JSON.parse(updatedRule.keywords || '[]'),
            forwardToRole: updatedRule.forwardToRole || undefined,
            forwardToId: updatedRule.forwardToId || undefined,
            interceptOriginal: updatedRule.interceptOriginal,
            enabled: updatedRule.enabled,
            createdAt: updatedRule.createdAt,
            updatedAt: updatedRule.updatedAt,
        };
    } catch (error) {
        console.error('更新消息路由规则状态失败:', error);
        throw new Error('更新消息路由规则状态失败');
    }
} 