/**
 * 会话服务
 * 
 * 提供会话创建、管理和生命周期控制
 */
import { v4 as uuidv4 } from 'uuid';
import { IAgent, TAgentStatus } from '@/types/agent-types';
import { TMessage } from '@/types/message-types';
import { messageBusService } from './message-bus-service';

/**
 * 会话状态枚举
 */
export enum TSessionStatus {
    /**
     * 创建中
     */
    CREATING = 'creating',
    
    /**
     * 就绪
     */
    READY = 'ready',
    
    /**
     * 运行中
     */
    RUNNING = 'running',
    
    /**
     * 暂停
     */
    PAUSED = 'paused',
    
    /**
     * 结束
     */
    ENDED = 'ended',
    
    /**
     * 错误
     */
    ERROR = 'error'
}

/**
 * 会话信息接口
 */
export interface ISessionInfo {
    /**
     * 会话ID
     */
    id: string;
    
    /**
     * 会话名称
     */
    name: string;
    
    /**
     * 会话描述
     */
    description?: string;
    
    /**
     * 创建者ID
     */
    creatorId: string;
    
    /**
     * 会话状态
     */
    status: TSessionStatus;
    
    /**
     * 会话配置
     */
    config: Record<string, any>;
    
    /**
     * 代理ID列表
     */
    agentIds: string[];
    
    /**
     * 创建时间
     */
    createdAt: Date;
    
    /**
     * 更新时间
     */
    updatedAt: Date;
    
    /**
     * 开始时间
     */
    startedAt?: Date;
    
    /**
     * 结束时间
     */
    endedAt?: Date;
}

/**
 * 会话创建选项
 */
export interface ISessionCreateOptions {
    /**
     * 会话名称
     */
    name: string;
    
    /**
     * 会话描述
     */
    description?: string;
    
    /**
     * 创建者ID
     */
    creatorId: string;
    
    /**
     * 会话配置
     */
    config?: Record<string, any>;
}

/**
 * 会话服务类
 */
export class SessionService {
    /**
     * 会话映射表
     */
    private sessions: Map<string, ISessionInfo> = new Map();
    
    /**
     * 会话代理映射表
     */
    private sessionAgents: Map<string, Map<string, IAgent>> = new Map();
    
    /**
     * 单例实例
     */
    private static instance: SessionService;
    
    /**
     * 获取服务实例
     */
    public static getInstance(): SessionService {
        if (!SessionService.instance) {
            SessionService.instance = new SessionService();
        }
        return SessionService.instance;
    }
    
    /**
     * 私有构造函数
     */
    private constructor() {
        console.log('会话服务初始化');
    }
    
    /**
     * 创建新会话
     * 
     * @param options 会话创建选项
     * @returns 会话信息
     */
    public createSession(options: ISessionCreateOptions): ISessionInfo {
        const id = uuidv4();
        const now = new Date();
        
        const session: ISessionInfo = {
            id,
            name: options.name,
            description: options.description,
            creatorId: options.creatorId,
            status: TSessionStatus.CREATING,
            config: options.config || {},
            agentIds: [],
            createdAt: now,
            updatedAt: now
        };
        
        this.sessions.set(id, session);
        this.sessionAgents.set(id, new Map());
        
        console.log(`创建会话: ${id} - ${options.name}`);
        return session;
    }
    
    /**
     * 更新会话状态
     * 
     * @param sessionId 会话ID
     * @param status 新状态
     */
    public updateSessionStatus(sessionId: string, status: TSessionStatus): void {
        const session = this.getSession(sessionId);
        
        session.status = status;
        session.updatedAt = new Date();
        
        if (status === TSessionStatus.RUNNING && !session.startedAt) {
            session.startedAt = new Date();
        }
        
        if (status === TSessionStatus.ENDED && !session.endedAt) {
            session.endedAt = new Date();
        }
        
        this.sessions.set(sessionId, session);
        console.log(`会话状态更新: ${sessionId} -> ${status}`);
    }
    
    /**
     * 获取会话信息
     * 
     * @param sessionId 会话ID
     * @returns 会话信息
     */
    public getSession(sessionId: string): ISessionInfo {
        const session = this.sessions.get(sessionId);
        if (!session) {
            throw new Error(`会话不存在: ${sessionId}`);
        }
        return { ...session };
    }
    
    /**
     * 获取所有会话
     * 
     * @returns 会话信息列表
     */
    public getAllSessions(): ISessionInfo[] {
        return Array.from(this.sessions.values()).map(session => ({ ...session }));
    }
    
    /**
     * 添加代理到会话
     * 
     * @param sessionId 会话ID
     * @param agent 代理实例
     */
    public async addAgent(sessionId: string, agent: IAgent): Promise<void> {
        const session = this.getSession(sessionId);
        const sessionAgents = this.sessionAgents.get(sessionId);
        
        if (!sessionAgents) {
            throw new Error(`会话代理映射不存在: ${sessionId}`);
        }
        
        if (sessionAgents.has(agent.id)) {
            console.warn(`代理已存在于会话中: ${agent.id} in ${sessionId}`);
            return;
        }
        
        // 初始化代理
        await agent.initialize(sessionId);
        
        // 添加到会话
        sessionAgents.set(agent.id, agent);
        session.agentIds.push(agent.id);
        session.updatedAt = new Date();
        
        this.sessions.set(sessionId, session);
        console.log(`添加代理到会话: ${agent.id} -> ${sessionId}`);
    }
    
    /**
     * 从会话中移除代理
     * 
     * @param sessionId 会话ID
     * @param agentId 代理ID
     */
    public async removeAgent(sessionId: string, agentId: string): Promise<void> {
        const session = this.getSession(sessionId);
        const sessionAgents = this.sessionAgents.get(sessionId);
        
        if (!sessionAgents) {
            throw new Error(`会话代理映射不存在: ${sessionId}`);
        }
        
        const agent = sessionAgents.get(agentId);
        if (!agent) {
            console.warn(`代理不存在于会话中: ${agentId} in ${sessionId}`);
            return;
        }
        
        // 终止代理
        await agent.terminate();
        
        // 从会话移除
        sessionAgents.delete(agentId);
        session.agentIds = session.agentIds.filter(id => id !== agentId);
        session.updatedAt = new Date();
        
        this.sessions.set(sessionId, session);
        console.log(`从会话移除代理: ${agentId} from ${sessionId}`);
    }
    
    /**
     * 获取会话中的代理
     * 
     * @param sessionId 会话ID
     * @param agentId 代理ID
     * @returns 代理实例
     */
    public getAgent(sessionId: string, agentId: string): IAgent {
        const sessionAgents = this.sessionAgents.get(sessionId);
        
        if (!sessionAgents) {
            throw new Error(`会话代理映射不存在: ${sessionId}`);
        }
        
        const agent = sessionAgents.get(agentId);
        if (!agent) {
            throw new Error(`代理不存在于会话中: ${agentId} in ${sessionId}`);
        }
        
        return agent;
    }
    
    /**
     * 获取会话中的所有代理
     * 
     * @param sessionId 会话ID
     * @returns 代理列表
     */
    public getSessionAgents(sessionId: string): IAgent[] {
        const sessionAgents = this.sessionAgents.get(sessionId);
        
        if (!sessionAgents) {
            throw new Error(`会话代理映射不存在: ${sessionId}`);
        }
        
        return Array.from(sessionAgents.values());
    }
    
    /**
     * 启动会话
     * 
     * @param sessionId 会话ID
     */
    public async startSession(sessionId: string): Promise<void> {
        const session = this.getSession(sessionId);
        
        if (session.status !== TSessionStatus.READY && session.status !== TSessionStatus.PAUSED) {
            throw new Error(`会话无法启动，当前状态: ${session.status}`);
        }
        
        // 更新会话状态
        this.updateSessionStatus(sessionId, TSessionStatus.RUNNING);
        
        // 获取会话中的所有代理
        const agents = this.getSessionAgents(sessionId);
        
        // 启动所有代理
        for (const agent of agents) {
            try {
                await agent.start();
            } catch (error) {
                console.error(`启动代理失败: ${agent.id}`, error);
                // 继续启动其他代理
            }
        }
        
        console.log(`会话已启动: ${sessionId}`);
    }
    
    /**
     * 暂停会话
     * 
     * @param sessionId 会话ID
     */
    public async pauseSession(sessionId: string): Promise<void> {
        const session = this.getSession(sessionId);
        
        if (session.status !== TSessionStatus.RUNNING) {
            throw new Error(`会话无法暂停，当前状态: ${session.status}`);
        }
        
        // 更新会话状态
        this.updateSessionStatus(sessionId, TSessionStatus.PAUSED);
        
        // 获取会话中的所有代理
        const agents = this.getSessionAgents(sessionId);
        
        // 暂停所有代理
        for (const agent of agents) {
            try {
                await agent.stop();
            } catch (error) {
                console.error(`暂停代理失败: ${agent.id}`, error);
                // 继续暂停其他代理
            }
        }
        
        console.log(`会话已暂停: ${sessionId}`);
    }
    
    /**
     * 结束会话
     * 
     * @param sessionId 会话ID
     */
    public async endSession(sessionId: string): Promise<void> {
        const session = this.getSession(sessionId);
        
        if (session.status === TSessionStatus.ENDED) {
            console.warn(`会话已经结束: ${sessionId}`);
            return;
        }
        
        // 更新会话状态
        this.updateSessionStatus(sessionId, TSessionStatus.ENDED);
        
        // 获取会话中的所有代理
        const agents = this.getSessionAgents(sessionId);
        
        // 终止所有代理
        for (const agent of agents) {
            try {
                await agent.terminate();
            } catch (error) {
                console.error(`终止代理失败: ${agent.id}`, error);
                // 继续终止其他代理
            }
        }
        
        // 清理会话消息
        messageBusService.clearSessionMessages(sessionId);
        
        console.log(`会话已结束: ${sessionId}`);
    }
    
    /**
     * 删除会话
     * 
     * @param sessionId 会话ID
     */
    public async deleteSession(sessionId: string): Promise<void> {
        const session = this.getSession(sessionId);
        
        // 如果会话未结束，先结束它
        if (session.status !== TSessionStatus.ENDED) {
            await this.endSession(sessionId);
        }
        
        // 删除会话
        this.sessions.delete(sessionId);
        this.sessionAgents.delete(sessionId);
        
        console.log(`会话已删除: ${sessionId}`);
    }
    
    /**
     * 判断会话是否就绪
     * 
     * @param sessionId 会话ID
     * @returns 是否就绪
     */
    public isSessionReady(sessionId: string): boolean {
        const session = this.getSession(sessionId);
        
        if (session.status !== TSessionStatus.CREATING) {
            return true;
        }
        
        // 检查所有代理是否就绪
        const agents = this.getSessionAgents(sessionId);
        const allReady = agents.every(agent => 
            agent.status === TAgentStatus.IDLE
        );
        
        if (allReady && agents.length > 0) {
            this.updateSessionStatus(sessionId, TSessionStatus.READY);
            return true;
        }
        
        return false;
    }
    
    /**
     * 获取会话消息
     * 
     * @param sessionId 会话ID
     * @returns 消息列表
     */
    public getSessionMessages(sessionId: string): TMessage[] {
        return messageBusService.getSessionMessages(sessionId);
    }
}

/**
 * 会话服务实例
 */
export const sessionService = SessionService.getInstance(); 