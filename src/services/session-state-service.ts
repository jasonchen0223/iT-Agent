/**
 * 会话状态管理服务
 * 
 * 提供会话状态的创建、更新、持久化和恢复功能
 */
import { prisma } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { agentCollaborationService } from './agent-collaboration-service';
import { agentOrchestrationService } from './agent-orchestration-service';

/**
 * 会话类型枚举
 */
export enum SessionType {
    /**
     * 对话型会话
     */
    CONVERSATION = 'conversation',
    
    /**
     * 工作流型会话
     */
    WORKFLOW = 'workflow',
    
    /**
     * 并行处理型会话
     */
    PARALLEL = 'parallel'
}

/**
 * 会话状态枚举
 */
export enum SessionStatus {
    /**
     * 活跃状态
     */
    ACTIVE = 'active',
    
    /**
     * 暂停状态
     */
    PAUSED = 'paused',
    
    /**
     * 已完成状态
     */
    COMPLETED = 'completed',
    
    /**
     * 错误状态
     */
    ERROR = 'error'
}

/**
 * 协作策略枚举
 */
export enum CooperationStrategy {
    /**
     * 顺序执行
     */
    SEQUENTIAL = 'sequential',
    
    /**
     * 并行执行
     */
    PARALLEL = 'parallel',
    
    /**
     * 自适应执行
     */
    ADAPTIVE = 'adaptive'
}

/**
 * 会话状态接口
 */
export interface ISessionState {
    /**
     * 会话ID
     */
    sessionId: string;
    
    /**
     * 会话类型
     */
    type: SessionType;
    
    /**
     * 会话状态
     */
    status: SessionStatus;
    
    /**
     * 当前活跃代理ID
     */
    activeAgentId: string | null;
    
    /**
     * 当前轮次
     */
    currentRound: number;
    
    /**
     * 最大轮次
     */
    maxRounds: number;
    
    /**
     * 协作策略
     */
    strategy: CooperationStrategy;
    
    /**
     * 最后一条消息时间
     */
    lastMessageAt: Date | null;
    
    /**
     * 开始时间
     */
    startedAt: Date | null;
    
    /**
     * 结束时间
     */
    endedAt: Date | null;
    
    /**
     * 元数据
     */
    metadata: Record<string, any>;
}

/**
 * 会话状态管理服务类
 */
export class SessionStateService {
    private static instance: SessionStateService | null = null;
    private states: Map<string, ISessionState> = new Map();
    
    /**
     * 私有构造函数
     */
    private constructor() {
        this.initialize();
    }
    
    /**
     * 初始化方法
     */
    private async initialize(): Promise<void> {
        try {
            // 从数据库加载活跃会话的状态
            const activeSessions = await prisma.session.findMany({
                where: {
                    status: {
                        not: SessionStatus.COMPLETED
                    }
                }
            });
            
            for (const session of activeSessions) {
                const state: ISessionState = {
                    sessionId: session.id,
                    type: session.type as SessionType,
                    status: session.status as SessionStatus,
                    activeAgentId: session.activeAgentId || null,
                    currentRound: session.currentRound,
                    maxRounds: session.maxRounds,
                    strategy: session.strategy as CooperationStrategy,
                    lastMessageAt: session.lastMessageAt,
                    startedAt: session.startedAt,
                    endedAt: session.endedAt,
                    metadata: session.metadata ? JSON.parse(session.metadata) : {}
                };
                
                this.states.set(session.id, state);
            }
            
            console.log(`已加载 ${this.states.size} 个活跃会话状态`);
        } catch (error) {
            console.error('会话状态服务初始化失败:', error);
        }
    }
    
    /**
     * 获取服务实例
     */
    public static getInstance(): SessionStateService {
        if (!SessionStateService.instance) {
            SessionStateService.instance = new SessionStateService();
        }
        return SessionStateService.instance;
    }
    
    /**
     * 创建会话状态
     * 
     * @param sessionId 会话ID
     * @param type 会话类型
     * @param options 可选配置
     * @returns 创建的状态
     */
    public async createState(
        sessionId: string,
        type: SessionType = SessionType.CONVERSATION,
        options: Partial<ISessionState> = {}
    ): Promise<ISessionState> {
        const now = new Date();
        
        const state: ISessionState = {
            sessionId,
            type,
            status: SessionStatus.ACTIVE,
            activeAgentId: null,
            currentRound: 0,
            maxRounds: 10,
            strategy: CooperationStrategy.SEQUENTIAL,
            lastMessageAt: null,
            startedAt: now,
            endedAt: null,
            metadata: {},
            ...options
        };
        
        // 保存到内存
        this.states.set(sessionId, state);
        
        // 保存到数据库
        try {
            await prisma.session.update({
                where: { id: sessionId },
                data: {
                    type: state.type,
                    status: state.status,
                    activeAgentId: state.activeAgentId,
                    currentRound: state.currentRound,
                    maxRounds: state.maxRounds,
                    strategy: state.strategy,
                    lastMessageAt: state.lastMessageAt,
                    startedAt: state.startedAt,
                    endedAt: state.endedAt,
                    metadata: JSON.stringify(state.metadata)
                }
            });
        } catch (error) {
            console.error('保存会话状态失败:', error);
            throw error;
        }
        
        return state;
    }
    
    /**
     * 获取会话状态
     * 
     * @param sessionId 会话ID
     * @returns 会话状态或null
     */
    public async getState(sessionId: string): Promise<ISessionState | null> {
        // 从内存获取
        if (this.states.has(sessionId)) {
            return this.states.get(sessionId) || null;
        }
        
        // 从数据库获取
        try {
            const session = await prisma.session.findUnique({
                where: { id: sessionId }
            });
            
            if (!session) {
                return null;
            }
            
            const state: ISessionState = {
                sessionId: session.id,
                type: session.type as SessionType,
                status: session.status as SessionStatus,
                activeAgentId: session.activeAgentId || null,
                currentRound: session.currentRound,
                maxRounds: session.maxRounds,
                strategy: session.strategy as CooperationStrategy,
                lastMessageAt: session.lastMessageAt,
                startedAt: session.startedAt,
                endedAt: session.endedAt,
                metadata: session.metadata ? JSON.parse(session.metadata) : {}
            };
            
            // 缓存到内存
            this.states.set(sessionId, state);
            
            return state;
        } catch (error) {
            console.error(`获取会话状态失败 (${sessionId}):`, error);
            return null;
        }
    }
    
    /**
     * 更新会话状态
     * 
     * @param sessionId 会话ID
     * @param updates 状态更新
     * @returns 更新后的状态或null
     */
    public async updateState(
        sessionId: string,
        updates: Partial<ISessionState>
    ): Promise<ISessionState | null> {
        // 获取现有状态
        const currentState = await this.getState(sessionId);
        if (!currentState) {
            return null;
        }
        
        // 更新状态
        const updatedState: ISessionState = {
            ...currentState,
            ...updates,
            metadata: {
                ...currentState.metadata,
                ...(updates.metadata || {})
            }
        };
        
        // 保存到内存
        this.states.set(sessionId, updatedState);
        
        // 保存到数据库
        try {
            await prisma.session.update({
                where: { id: sessionId },
                data: {
                    type: updatedState.type,
                    status: updatedState.status,
                    activeAgentId: updatedState.activeAgentId,
                    currentRound: updatedState.currentRound,
                    maxRounds: updatedState.maxRounds,
                    strategy: updatedState.strategy,
                    lastMessageAt: updatedState.lastMessageAt,
                    startedAt: updatedState.startedAt,
                    endedAt: updatedState.endedAt,
                    metadata: JSON.stringify(updatedState.metadata)
                }
            });
        } catch (error) {
            console.error(`更新会话状态失败 (${sessionId}):`, error);
            throw error;
        }
        
        return updatedState;
    }
    
    /**
     * 暂停会话
     * 
     * @param sessionId 会话ID
     * @returns 更新后的状态或null
     */
    public async pauseSession(sessionId: string): Promise<ISessionState | null> {
        return this.updateState(sessionId, {
            status: SessionStatus.PAUSED
        });
    }
    
    /**
     * 恢复会话
     * 
     * @param sessionId 会话ID
     * @returns 更新后的状态或null
     */
    public async resumeSession(sessionId: string): Promise<ISessionState | null> {
        return this.updateState(sessionId, {
            status: SessionStatus.ACTIVE
        });
    }
    
    /**
     * 完成会话
     * 
     * @param sessionId 会话ID
     * @returns 更新后的状态或null
     */
    public async completeSession(sessionId: string): Promise<ISessionState | null> {
        const now = new Date();
        return this.updateState(sessionId, {
            status: SessionStatus.COMPLETED,
            endedAt: now
        });
    }
    
    /**
     * 标记会话错误
     * 
     * @param sessionId 会话ID
     * @param error 错误信息
     * @returns 更新后的状态或null
     */
    public async markSessionError(
        sessionId: string,
        error: string
    ): Promise<ISessionState | null> {
        return this.updateState(sessionId, {
            status: SessionStatus.ERROR,
            metadata: {
                error
            }
        });
    }
    
    /**
     * 更新活跃代理
     * 
     * @param sessionId 会话ID
     * @param agentId 代理ID
     * @returns 更新后的状态或null
     */
    public async updateActiveAgent(
        sessionId: string,
        agentId: string | null
    ): Promise<ISessionState | null> {
        return this.updateState(sessionId, {
            activeAgentId: agentId
        });
    }
    
    /**
     * 更新最后消息时间
     * 
     * @param sessionId 会话ID
     * @returns 更新后的状态或null
     */
    public async updateLastMessageTime(sessionId: string): Promise<ISessionState | null> {
        return this.updateState(sessionId, {
            lastMessageAt: new Date()
        });
    }
    
    /**
     * 增加轮次计数
     * 
     * @param sessionId 会话ID
     * @returns 更新后的状态或null
     */
    public async incrementRound(sessionId: string): Promise<ISessionState | null> {
        const state = await this.getState(sessionId);
        if (!state) {
            return null;
        }
        
        return this.updateState(sessionId, {
            currentRound: state.currentRound + 1
        });
    }
    
    /**
     * 检查会话是否已达到最大轮次
     * 
     * @param sessionId 会话ID
     * @returns 是否达到最大轮次
     */
    public async hasReachedMaxRounds(sessionId: string): Promise<boolean> {
        const state = await this.getState(sessionId);
        if (!state) {
            return false;
        }
        
        return state.currentRound >= state.maxRounds;
    }
    
    /**
     * 获取会话元数据
     * 
     * @param sessionId 会话ID
     * @param key 元数据键
     * @returns 元数据值或undefined
     */
    public async getMetadata<T>(
        sessionId: string,
        key: string
    ): Promise<T | undefined> {
        const state = await this.getState(sessionId);
        if (!state) {
            return undefined;
        }
        
        return state.metadata[key] as T;
    }
    
    /**
     * 设置会话元数据
     * 
     * @param sessionId 会话ID
     * @param key 元数据键
     * @param value 元数据值
     * @returns 更新后的状态或null
     */
    public async setMetadata<T>(
        sessionId: string,
        key: string,
        value: T
    ): Promise<ISessionState | null> {
        const state = await this.getState(sessionId);
        if (!state) {
            return null;
        }
        
        return this.updateState(sessionId, {
            metadata: {
                ...state.metadata,
                [key]: value
            }
        });
    }
}

// 导出单例实例
export const sessionStateService = SessionStateService.getInstance(); 