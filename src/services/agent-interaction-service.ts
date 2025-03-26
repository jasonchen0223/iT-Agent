/**
 * 代理交互历史服务
 * 
 * 提供代理交互历史记录的管理、查询和导出功能
 */

import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

// 引入Prisma客户端实例
const prisma = new PrismaClient();

/**
 * 交互查询过滤条件接口
 */
export interface IInteractionFilter {
    agentId?: string;
    sessionId?: string;
    taskId?: string;
    startDate?: Date;
    endDate?: Date;
    types?: string[];
    senderRoles?: string[];
    receiverRoles?: string[];
    keywords?: string[];
    limit?: number;
    offset?: number;
}

/**
 * 交互统计接口
 */
export interface IInteractionStats {
    totalInteractions: number;
    byType: Record<string, number>;
    byAgentRole: Record<string, number>;
    averageResponseTime: number;
    timeDistribution: Record<string, number>;
}

/**
 * 代理交互历史服务类
 */
export class AgentInteractionService {
    private static instance: AgentInteractionService;

    /**
     * 私有构造函数，实现单例模式
     */
    private constructor() {}

    /**
     * 获取服务实例
     * @returns AgentInteractionService实例
     */
    public static getInstance(): AgentInteractionService {
        if (!AgentInteractionService.instance) {
            AgentInteractionService.instance = new AgentInteractionService();
        }
        return AgentInteractionService.instance;
    }

    /**
     * 获取代理交互历史列表
     * @param filter 查询过滤条件
     * @returns 交互历史列表和元数据
     */
    public async getInteractions(filter: IInteractionFilter) {
        try {
            // 构建查询条件
            const where: any = {};
            
            if (filter.agentId) {
                where.OR = [
                    { senderId: filter.agentId },
                    { receiverId: filter.agentId }
                ];
            }
            
            if (filter.sessionId) {
                where.sessionId = filter.sessionId;
            }
            
            if (filter.startDate || filter.endDate) {
                where.createdAt = {};
                
                if (filter.startDate) {
                    where.createdAt.gte = filter.startDate;
                }
                
                if (filter.endDate) {
                    where.createdAt.lte = filter.endDate;
                }
            }
            
            if (filter.types && filter.types.length > 0) {
                where.type = { in: filter.types };
            }
            
            if (filter.keywords && filter.keywords.length > 0) {
                where.content = {
                    contains: filter.keywords.join(' '),
                    mode: 'insensitive'
                };
            }
            
            // 获取总记录数
            const total = await prisma.message.count({ where });
            
            // 查询分页数据
            const limit = filter.limit || 20;
            const offset = filter.offset || 0;
            
            const messages = await prisma.message.findMany({
                where,
                include: {
                    sender: true,
                    receiver: true,
                    session: true
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip: offset,
                take: limit
            });
            
            // 格式化结果
            const interactions = messages.map(message => ({
                id: message.id,
                content: message.content,
                type: message.type,
                metadata: message.metadata ? JSON.parse(message.metadata) : null,
                timestamp: message.createdAt,
                sender: {
                    id: message.sender.id,
                    name: message.sender.name,
                    role: message.sender.role
                },
                receiver: {
                    id: message.receiver.id,
                    name: message.receiver.name,
                    role: message.receiver.role
                },
                session: {
                    id: message.sessionId,
                    name: message.session.name
                }
            }));
            
            return {
                interactions,
                meta: {
                    total,
                    limit,
                    offset,
                    hasMore: total > offset + limit
                }
            };
        } catch (error) {
            console.error('获取交互历史失败:', error);
            throw new Error('获取交互历史失败');
        }
    }

    /**
     * 获取特定代理的交互历史统计
     * @param agentId 代理ID
     * @param timeRange 时间范围（天）
     * @returns 交互统计信息
     */
    public async getInteractionStats(agentId: string, timeRange: number = 30): Promise<IInteractionStats> {
        try {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - timeRange);
            
            // 获取指定时间范围内的消息
            const messages = await prisma.message.findMany({
                where: {
                    OR: [
                        { senderId: agentId },
                        { receiverId: agentId }
                    ],
                    createdAt: {
                        gte: startDate
                    }
                },
                include: {
                    sender: true,
                    receiver: true
                }
            });
            
            // 按类型统计
            const byType: Record<string, number> = {};
            
            // 按角色统计
            const byAgentRole: Record<string, number> = {};
            
            // 按时间分布统计
            const timeDistribution: Record<string, number> = {};
            
            // 响应时间计算
            let totalResponseTime = 0;
            let responseCount = 0;
            
            // 临时存储上一条消息时间
            const lastMessageTime: Record<string, Date> = {};
            
            messages.forEach(message => {
                // 按类型统计
                if (!byType[message.type]) {
                    byType[message.type] = 0;
                }
                byType[message.type]++;
                
                // 按角色统计
                if (message.senderId === agentId) {
                    const receiverRole = message.receiver.role;
                    if (!byAgentRole[receiverRole]) {
                        byAgentRole[receiverRole] = 0;
                    }
                    byAgentRole[receiverRole]++;
                    
                    // 计算响应时间
                    if (lastMessageTime[message.receiverId]) {
                        const responseTime = message.createdAt.getTime() - lastMessageTime[message.receiverId].getTime();
                        totalResponseTime += responseTime;
                        responseCount++;
                    }
                } else {
                    const senderRole = message.sender.role;
                    if (!byAgentRole[senderRole]) {
                        byAgentRole[senderRole] = 0;
                    }
                    byAgentRole[senderRole]++;
                    
                    // 记录接收时间，用于计算响应时间
                    lastMessageTime[message.senderId] = message.createdAt;
                }
                
                // 按时间分布统计
                const hour = message.createdAt.getHours();
                const timeKey = `${hour}:00`;
                if (!timeDistribution[timeKey]) {
                    timeDistribution[timeKey] = 0;
                }
                timeDistribution[timeKey]++;
            });
            
            // 计算平均响应时间（毫秒）
            const averageResponseTime = responseCount > 0 ? totalResponseTime / responseCount : 0;
            
            return {
                totalInteractions: messages.length,
                byType,
                byAgentRole,
                averageResponseTime,
                timeDistribution
            };
        } catch (error) {
            console.error('获取交互统计失败:', error);
            throw new Error('获取交互统计失败');
        }
    }

    /**
     * 导出代理交互历史
     * @param filter 查询过滤条件
     * @param format 导出格式（json, csv）
     * @returns 导出数据
     */
    public async exportInteractions(filter: IInteractionFilter, format: 'json' | 'csv' = 'json') {
        try {
            // 获取交互数据，不分页
            const unlimitedFilter = { ...filter, limit: undefined, offset: undefined };
            const { interactions } = await this.getInteractions(unlimitedFilter);
            
            if (format === 'json') {
                return JSON.stringify(interactions, null, 2);
            } else if (format === 'csv') {
                // 生成CSV头
                let csv = 'ID,内容,类型,发送方,接收方,会话,时间戳\n';
                
                // 添加数据行
                interactions.forEach(interaction => {
                    const row = [
                        interaction.id,
                        `"${interaction.content.replace(/"/g, '""')}"`, // 处理引号
                        interaction.type,
                        `${interaction.sender.name} (${interaction.sender.role})`,
                        `${interaction.receiver.name} (${interaction.receiver.role})`,
                        interaction.session.name,
                        interaction.timestamp.toISOString()
                    ];
                    
                    csv += row.join(',') + '\n';
                });
                
                return csv;
            }
            
            throw new Error(`不支持的导出格式: ${format}`);
        } catch (error) {
            console.error('导出交互历史失败:', error);
            throw new Error('导出交互历史失败');
        }
    }

    /**
     * 获取交互详情
     * @param interactionId 交互ID
     * @returns 交互详情
     */
    public async getInteractionDetail(interactionId: string) {
        try {
            const message = await prisma.message.findUnique({
                where: { id: interactionId },
                include: {
                    sender: true,
                    receiver: true,
                    session: true
                }
            });
            
            if (!message) {
                throw new Error('交互记录不存在');
            }
            
            return {
                id: message.id,
                content: message.content,
                type: message.type,
                metadata: message.metadata ? JSON.parse(message.metadata) : null,
                timestamp: message.createdAt,
                sender: {
                    id: message.sender.id,
                    name: message.sender.name,
                    role: message.sender.role
                },
                receiver: {
                    id: message.receiver.id,
                    name: message.receiver.name,
                    role: message.receiver.role
                },
                session: {
                    id: message.sessionId,
                    name: message.session.name
                }
            };
        } catch (error) {
            console.error('获取交互详情失败:', error);
            throw new Error('获取交互详情失败');
        }
    }
}

// 导出服务实例
export const agentInteractionService = AgentInteractionService.getInstance();
export default agentInteractionService; 