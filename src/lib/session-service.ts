/**
 * 会话服务模块
 * 
 * 提供会话管理与持久化功能
 */
import { prisma } from './db';
import { IAgentMessage, IAgent, TAgentRole } from '@/types/agent';
import { agentService } from './agent-service';
import { v4 as uuidv4 } from 'uuid';

export type TSessionStatus = 'active' | 'paused' | 'completed' | 'error';
export type TCooperationStrategy = 'sequential' | 'orchestrated' | 'parallel' | 'adaptive';

/**
 * 会话状态接口
 */
export interface ISessionState {
    sessionId: string;
    activeAgentId: string | null;
    currentRound: number;
    maxRounds: number;
    status: TSessionStatus;
    strategy: TCooperationStrategy;
    metadata?: Record<string, any>;
}

/**
 * 会话接口
 */
export interface ISession {
    id: string;
    name: string;
    status: TSessionStatus;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    agents: IAgent[];
    messages: IAgentMessage[];
    sessionState?: ISessionState;
}

/**
 * 会话服务类
 */
class SessionService {
    /**
     * 创建新会话
     * 
     * @param {string} name - 会话名称
     * @param {string} userId - 用户ID
     * @param {TCooperationStrategy} strategy - 协作策略
     * @returns {Promise<ISession>} 创建的会话
     */
    async createSession(
        name: string,
        userId: string,
        strategy: TCooperationStrategy = 'sequential'
    ): Promise<ISession> {
        // 创建会话记录
        const session = await prisma.session.create({
            data: {
                name,
                status: 'active' as TSessionStatus,
                userId,
            }
        });

        // 创建会话状态
        const sessionState = await prisma.sessionState.create({
            data: {
                sessionId: session.id,
                currentRound: 0,
                maxRounds: 10,
                strategy,
            }
        });

        // 创建默认代理
        const userAgent = await this.addAgentToSession(
            session.id,
            'User',
            TAgentRole.USER,
            '用户代理，代表人类用户'
        );

        const assistantAgent = await this.addAgentToSession(
            session.id,
            'Assistant',
            TAgentRole.ASSISTANT,
            '助手代理，提供帮助和建议'
        );

        return {
            id: session.id,
            name: session.name,
            status: session.status as TSessionStatus,
            userId: session.userId,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
            agents: [userAgent, assistantAgent],
            messages: [],
            sessionState: {
                sessionId: sessionState.sessionId,
                activeAgentId: null,
                currentRound: sessionState.currentRound,
                maxRounds: sessionState.maxRounds,
                status: 'active',
                strategy: sessionState.strategy as TCooperationStrategy,
                metadata: sessionState.metadata as Record<string, any> || {},
            }
        };
    }

    /**
     * 向会话添加代理
     * 
     * @param {string} sessionId - 会话ID
     * @param {string} name - 代理名称
     * @param {TAgentRole} role - 代理角色
     * @param {string} description - 代理描述
     * @param {string} configId - 代理配置ID
     * @returns {Promise<IAgent>} 添加的代理
     */
    async addAgentToSession(
        sessionId: string,
        name: string,
        role: TAgentRole,
        description: string,
        configId?: string
    ): Promise<IAgent> {
        // 创建代理记录
        const agent = await prisma.agent.create({
            data: {
                name,
                role,
                description,
                sessionId,
                configId,
            }
        });

        // 返回代理对象
        return agentService.createAgentInstance({
            id: agent.id,
            name: agent.name,
            role: role,
            description: agent.description || '',
            systemMessage: '',
            icon: '',
            color: '',
        });
    }

    /**
     * 获取会话
     * 
     * @param {string} sessionId - 会话ID
     * @returns {Promise<ISession | null>} 会话对象
     */
    async getSession(sessionId: string): Promise<ISession | null> {
        // 从数据库查询会话
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            include: {
                agents: true,
                messages: {
                    orderBy: { createdAt: 'asc' }
                },
                sessionState: true
            }
        });

        if (!session) {
            return null;
        }

        // 转换为应用层会话对象
        const agents = session.agents.map(agent => agentService.createAgentInstance({
            id: agent.id,
            name: agent.name,
            role: agent.role as TAgentRole,
            description: agent.description || '',
            systemMessage: '',
            icon: '',
            color: '',
        }));

        const messages = session.messages.map(msg => ({
            id: msg.id,
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            content: msg.content,
            type: msg.type as any,
            createdAt: msg.createdAt,
            metadata: msg.metadata as Record<string, any> || {},
        }));

        const sessionState = session.sessionState ? {
            sessionId: session.sessionState.sessionId,
            activeAgentId: session.sessionState.activeAgentId || null,
            currentRound: session.sessionState.currentRound,
            maxRounds: session.sessionState.maxRounds,
            status: session.status as TSessionStatus,
            strategy: session.sessionState.strategy as TCooperationStrategy,
            metadata: session.sessionState.metadata as Record<string, any> || {},
        } : undefined;

        return {
            id: session.id,
            name: session.name,
            status: session.status as TSessionStatus,
            userId: session.userId,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
            agents,
            messages,
            sessionState
        };
    }

    /**
     * 获取用户的所有会话
     * 
     * @param {string} userId - 用户ID
     * @returns {Promise<ISession[]>} 会话列表
     */
    async getUserSessions(userId: string): Promise<ISession[]> {
        // 从数据库查询用户的所有会话
        const sessions = await prisma.session.findMany({
            where: { userId },
            include: {
                sessionState: true
            },
            orderBy: { updatedAt: 'desc' }
        });

        // 转换为应用层会话对象列表（不包含详细信息）
        return sessions.map(session => ({
            id: session.id,
            name: session.name,
            status: session.status as TSessionStatus,
            userId: session.userId,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
            agents: [],
            messages: [],
            sessionState: session.sessionState ? {
                sessionId: session.sessionState.sessionId,
                activeAgentId: session.sessionState.activeAgentId || null,
                currentRound: session.sessionState.currentRound,
                maxRounds: session.sessionState.maxRounds,
                status: session.status as TSessionStatus,
                strategy: session.sessionState.strategy as TCooperationStrategy,
                metadata: session.sessionState.metadata as Record<string, any> || {},
            } : undefined
        }));
    }

    /**
     * 更新会话状态
     * 
     * @param {string} sessionId - 会话ID
     * @param {Partial<ISessionState>} updates - 状态更新
     * @returns {Promise<ISessionState>} 更新后的状态
     */
    async updateSessionState(
        sessionId: string,
        updates: Partial<ISessionState>
    ): Promise<ISessionState> {
        // 更新会话状态
        const updatedState = await prisma.sessionState.update({
            where: { sessionId },
            data: {
                activeAgentId: updates.activeAgentId,
                currentRound: updates.currentRound,
                maxRounds: updates.maxRounds,
                strategy: updates.strategy,
                metadata: updates.metadata as any,
            }
        });

        // 如果状态更新包含会话状态，同时更新会话
        if (updates.status) {
            await prisma.session.update({
                where: { id: sessionId },
                data: { status: updates.status }
            });
        }

        return {
            sessionId: updatedState.sessionId,
            activeAgentId: updatedState.activeAgentId || null,
            currentRound: updatedState.currentRound,
            maxRounds: updatedState.maxRounds,
            status: updates.status || 'active',
            strategy: updatedState.strategy as TCooperationStrategy,
            metadata: updatedState.metadata as Record<string, any> || {},
        };
    }

    /**
     * 添加消息到会话
     * 
     * @param {string} sessionId - 会话ID
     * @param {string} senderId - 发送者ID
     * @param {string} receiverId - 接收者ID
     * @param {string} content - 消息内容
     * @param {string} type - 消息类型
     * @param {Record<string, any>} metadata - 元数据
     * @returns {Promise<IAgentMessage>} 添加的消息
     */
    async addMessageToSession(
        sessionId: string,
        senderId: string,
        receiverId: string,
        content: string,
        type: 'text' | 'code' | 'tool_call' | 'tool_result' | 'error' = 'text',
        metadata?: Record<string, any>
    ): Promise<IAgentMessage> {
        // 添加消息记录
        const message = await prisma.message.create({
            data: {
                content,
                type,
                senderId,
                receiverId,
                sessionId,
                metadata: metadata as any,
            }
        });

        // 标记会话为活跃
        await prisma.session.update({
            where: { id: sessionId },
            data: { 
                updatedAt: new Date(),
                status: 'active',
            }
        });

        return {
            id: message.id,
            senderId: message.senderId,
            receiverId: message.receiverId,
            content: message.content,
            type: message.type as any,
            createdAt: message.createdAt,
            metadata: message.metadata as Record<string, any> || {},
        };
    }

    /**
     * 删除会话
     * 
     * @param {string} sessionId - 会话ID
     * @returns {Promise<boolean>} 删除结果
     */
    async deleteSession(sessionId: string): Promise<boolean> {
        try {
            // 删除会话记录
            await prisma.session.delete({
                where: { id: sessionId }
            });
            return true;
        } catch (error) {
            console.error('删除会话失败:', error);
            return false;
        }
    }
}

// 创建会话服务单例
export const sessionService = new SessionService();

export default sessionService; 