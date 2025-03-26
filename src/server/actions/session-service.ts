import { PrismaClient } from '@prisma/client';
import { Session } from '@/types/session';
import { Agent } from '@/types/agent';
import { Message } from '@/types/message';

const prisma = new PrismaClient();

/**
 * 创建新会话
 */
export async function createSession(name: string, userId: string): Promise<Session> {
    try {
        const session = await prisma.session.create({
            data: {
                name,
                userId,
                status: 'active',
                sessionState: {
                    create: {
                        currentRound: 0,
                        maxRounds: 10,
                        strategy: 'sequential',
                    }
                }
            },
            include: {
                sessionState: true,
                agents: true,
                messages: true,
            }
        });

        return {
            id: session.id,
            name: session.name,
            status: session.status,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
            userId: session.userId,
            state: session.sessionState ? {
                id: session.sessionState.id,
                sessionId: session.sessionState.sessionId,
                activeAgentId: session.sessionState.activeAgentId || undefined,
                currentRound: session.sessionState.currentRound,
                maxRounds: session.sessionState.maxRounds,
                strategy: session.sessionState.strategy,
                metadata: session.sessionState.metadata ? JSON.parse(session.sessionState.metadata) : {},
            } : undefined,
            agents: session.agents.map(agent => ({
                id: agent.id,
                name: agent.name,
                role: agent.role,
                description: agent.description || undefined,
                sessionId: agent.sessionId,
                createdAt: agent.createdAt,
                updatedAt: agent.updatedAt,
                configId: agent.configId || undefined,
            })),
            messages: session.messages.map(message => ({
                id: message.id,
                content: message.content,
                type: message.type,
                senderId: message.senderId,
                receiverId: message.receiverId,
                sessionId: message.sessionId,
                metadata: message.metadata ? JSON.parse(message.metadata) : {},
                createdAt: message.createdAt,
            })),
        };
    } catch (error) {
        console.error('创建会话失败:', error);
        throw new Error('创建会话失败');
    }
}

/**
 * 获取用户所有会话
 */
export async function getUserSessions(userId: string): Promise<Session[]> {
    try {
        const sessions = await prisma.session.findMany({
            where: {
                userId
            },
            include: {
                sessionState: true,
                agents: true,
                messages: true,
            },
            orderBy: {
                updatedAt: 'desc',
            }
        });

        return sessions.map(session => ({
            id: session.id,
            name: session.name,
            status: session.status,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
            userId: session.userId,
            state: session.sessionState ? {
                id: session.sessionState.id,
                sessionId: session.sessionState.sessionId,
                activeAgentId: session.sessionState.activeAgentId || undefined,
                currentRound: session.sessionState.currentRound,
                maxRounds: session.sessionState.maxRounds,
                strategy: session.sessionState.strategy,
                metadata: session.sessionState.metadata ? JSON.parse(session.sessionState.metadata) : {},
            } : undefined,
            agents: session.agents.map(agent => ({
                id: agent.id,
                name: agent.name,
                role: agent.role,
                description: agent.description || undefined,
                sessionId: agent.sessionId,
                createdAt: agent.createdAt,
                updatedAt: agent.updatedAt,
                configId: agent.configId || undefined,
            })),
            messages: session.messages.map(message => ({
                id: message.id,
                content: message.content,
                type: message.type,
                senderId: message.senderId,
                receiverId: message.receiverId,
                sessionId: message.sessionId,
                metadata: message.metadata ? JSON.parse(message.metadata) : {},
                createdAt: message.createdAt,
            })),
        }));
    } catch (error) {
        console.error('获取用户会话失败:', error);
        throw new Error('获取用户会话失败');
    }
}

/**
 * 获取会话详情
 */
export async function getSession(sessionId: string): Promise<Session | null> {
    try {
        const session = await prisma.session.findUnique({
            where: {
                id: sessionId
            },
            include: {
                sessionState: true,
                agents: true,
                messages: true,
            }
        });

        if (!session) {
            return null;
        }

        return {
            id: session.id,
            name: session.name,
            status: session.status,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
            userId: session.userId,
            state: session.sessionState ? {
                id: session.sessionState.id,
                sessionId: session.sessionState.sessionId,
                activeAgentId: session.sessionState.activeAgentId || undefined,
                currentRound: session.sessionState.currentRound,
                maxRounds: session.sessionState.maxRounds,
                strategy: session.sessionState.strategy,
                metadata: session.sessionState.metadata ? JSON.parse(session.sessionState.metadata) : {},
            } : undefined,
            agents: session.agents.map(agent => ({
                id: agent.id,
                name: agent.name,
                role: agent.role,
                description: agent.description || undefined,
                sessionId: agent.sessionId,
                createdAt: agent.createdAt,
                updatedAt: agent.updatedAt,
                configId: agent.configId || undefined,
            })),
            messages: session.messages.map(message => ({
                id: message.id,
                content: message.content,
                type: message.type,
                senderId: message.senderId,
                receiverId: message.receiverId,
                sessionId: message.sessionId,
                metadata: message.metadata ? JSON.parse(message.metadata) : {},
                createdAt: message.createdAt,
            })),
        };
    } catch (error) {
        console.error('获取会话详情失败:', error);
        throw new Error('获取会话详情失败');
    }
}

/**
 * 更新会话
 */
export async function updateSession(
    sessionId: string, 
    data: { name?: string; status?: string }
): Promise<Session> {
    try {
        const session = await prisma.session.update({
            where: {
                id: sessionId
            },
            data,
            include: {
                sessionState: true,
                agents: true,
                messages: true,
            }
        });

        return {
            id: session.id,
            name: session.name,
            status: session.status,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
            userId: session.userId,
            state: session.sessionState ? {
                id: session.sessionState.id,
                sessionId: session.sessionState.sessionId,
                activeAgentId: session.sessionState.activeAgentId || undefined,
                currentRound: session.sessionState.currentRound,
                maxRounds: session.sessionState.maxRounds,
                strategy: session.sessionState.strategy,
                metadata: session.sessionState.metadata ? JSON.parse(session.sessionState.metadata) : {},
            } : undefined,
            agents: session.agents.map(agent => ({
                id: agent.id,
                name: agent.name,
                role: agent.role,
                description: agent.description || undefined,
                sessionId: agent.sessionId,
                createdAt: agent.createdAt,
                updatedAt: agent.updatedAt,
                configId: agent.configId || undefined,
            })),
            messages: session.messages.map(message => ({
                id: message.id,
                content: message.content,
                type: message.type,
                senderId: message.senderId,
                receiverId: message.receiverId,
                sessionId: message.sessionId,
                metadata: message.metadata ? JSON.parse(message.metadata) : {},
                createdAt: message.createdAt,
            })),
        };
    } catch (error) {
        console.error('更新会话失败:', error);
        throw new Error('更新会话失败');
    }
}

/**
 * 删除会话
 */
export async function deleteSession(sessionId: string): Promise<boolean> {
    try {
        await prisma.session.delete({
            where: {
                id: sessionId
            }
        });
        return true;
    } catch (error) {
        console.error('删除会话失败:', error);
        throw new Error('删除会话失败');
    }
}

/**
 * 向会话添加代理
 */
export async function addAgentToSession(sessionId: string, agent: Omit<Agent, 'id' | 'createdAt' | 'updatedAt' | 'sessionId'>): Promise<Agent> {
    try {
        const createdAgent = await prisma.agent.create({
            data: {
                name: agent.name,
                role: agent.role,
                description: agent.description,
                sessionId,
                configId: agent.configId,
            }
        });

        return {
            id: createdAgent.id,
            name: createdAgent.name,
            role: createdAgent.role,
            description: createdAgent.description || undefined,
            sessionId: createdAgent.sessionId,
            createdAt: createdAgent.createdAt,
            updatedAt: createdAgent.updatedAt,
            configId: createdAgent.configId || undefined,
        };
    } catch (error) {
        console.error('添加代理失败:', error);
        throw new Error('添加代理失败');
    }
}

/**
 * 从会话中移除代理
 */
export async function removeAgentFromSession(agentId: string): Promise<boolean> {
    try {
        await prisma.agent.delete({
            where: {
                id: agentId
            }
        });
        return true;
    } catch (error) {
        console.error('移除代理失败:', error);
        throw new Error('移除代理失败');
    }
}

/**
 * 添加消息到会话
 */
export async function addMessageToSession(
    sessionId: string, 
    message: Omit<Message, 'id' | 'createdAt' | 'sessionId'>
): Promise<Message> {
    try {
        const createdMessage = await prisma.message.create({
            data: {
                content: message.content,
                type: message.type,
                senderId: message.senderId,
                receiverId: message.receiverId,
                sessionId,
                metadata: message.metadata ? JSON.stringify(message.metadata) : null,
            }
        });

        return {
            id: createdMessage.id,
            content: createdMessage.content,
            type: createdMessage.type,
            senderId: createdMessage.senderId,
            receiverId: createdMessage.receiverId,
            sessionId: createdMessage.sessionId,
            metadata: createdMessage.metadata ? JSON.parse(createdMessage.metadata) : {},
            createdAt: createdMessage.createdAt,
        };
    } catch (error) {
        console.error('添加消息失败:', error);
        throw new Error('添加消息失败');
    }
}

/**
 * 更新会话状态
 */
export async function updateSessionState(
    sessionId: string, 
    stateData: {
        activeAgentId?: string;
        currentRound?: number;
        maxRounds?: number;
        strategy?: string;
        metadata?: Record<string, any>;
    }
): Promise<Session['state']> {
    try {
        // 检查会话状态是否存在
        const existingState = await prisma.sessionState.findUnique({
            where: {
                sessionId
            }
        });

        // 准备更新数据，处理metadata字段
        const updateData = {
            ...stateData,
            metadata: stateData.metadata ? JSON.stringify(stateData.metadata) : undefined
        };

        let sessionState;
        if (existingState) {
            // 更新现有状态
            sessionState = await prisma.sessionState.update({
                where: {
                    sessionId
                },
                data: updateData
            });
        } else {
            // 创建新状态
            sessionState = await prisma.sessionState.create({
                data: {
                    ...updateData,
                    sessionId
                }
            });
        }

        return {
            id: sessionState.id,
            sessionId: sessionState.sessionId,
            activeAgentId: sessionState.activeAgentId || undefined,
            currentRound: sessionState.currentRound,
            maxRounds: sessionState.maxRounds,
            strategy: sessionState.strategy,
            metadata: sessionState.metadata ? JSON.parse(sessionState.metadata) : {},
        };
    } catch (error) {
        console.error('更新会话状态失败:', error);
        throw new Error('更新会话状态失败');
    }
} 