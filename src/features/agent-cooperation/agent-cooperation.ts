/**
 * 代理协作机制核心模块
 * 
 * 实现代理之间的通信、协作和状态管理
 */
import { IAgent, IAgentMessage, TAgentRole, TAgentStatus } from '@/types/agent';
import { agentService } from '@/lib/agent-service';
import { v4 as uuidv4 } from 'uuid';
import { messageRouter } from '@/features/message-router';

/**
 * 协作会话状态接口
 */
export interface ICooperationSessionState {
    /**
     * 会话ID
     */
    sessionId: string;
    /**
     * 当前活跃代理ID
     */
    activeAgentId: string | null;
    /**
     * 会话状态
     */
    status: 'idle' | 'active' | 'paused' | 'completed' | 'error';
    /**
     * 消息历史
     */
    messages: IAgentMessage[];
    /**
     * 当前消息处理锁
     */
    processingLock: boolean;
    /**
     * 当前轮次
     */
    currentRound: number;
    /**
     * 最大轮次
     */
    maxRounds: number;
    /**
     * 错误信息
     */
    error?: string;
}

/**
 * 协作策略类型
 */
export type TCooperationStrategy = 
    | 'sequential'  // 顺序协作：代理按固定顺序轮流工作
    | 'orchestrated'  // 协调式协作：由协调者代理分配任务
    | 'parallel'  // 并行协作：代理同时工作
    | 'adaptive';  // 自适应协作：根据任务动态调整协作方式

/**
 * 代理协作管理器类
 */
export class AgentCooperationManager {
    /**
     * 会话状态映射表
     */
    private sessions: Map<string, ICooperationSessionState> = new Map();
    
    /**
     * 消息订阅回调函数
     */
    private messageSubscribers: Map<string, ((message: IAgentMessage) => void)[]> = new Map();
    
    /**
     * 状态变化订阅回调函数
     */
    private stateSubscribers: Map<string, ((state: ICooperationSessionState) => void)[]> = new Map();
    
    /**
     * 创建协作会话
     * 
     * @param {string} sessionId - 会话ID
     * @param {number} maxRounds - 最大轮次
     * @returns {ICooperationSessionState} 会话状态
     */
    createSession(sessionId: string, maxRounds: number = 10): ICooperationSessionState {
        if (this.sessions.has(sessionId)) {
            throw new Error(`会话已存在: ${sessionId}`);
        }
        
        // 初始化会话状态
        const sessionState: ICooperationSessionState = {
            sessionId,
            activeAgentId: null,
            status: 'idle',
            messages: [],
            processingLock: false,
            currentRound: 0,
            maxRounds,
        };
        
        // 存储会话状态
        this.sessions.set(sessionId, sessionState);
        
        return sessionState;
    }
    
    /**
     * 获取会话状态
     * 
     * @param {string} sessionId - 会话ID
     * @returns {ICooperationSessionState | null} 会话状态
     */
    getSessionState(sessionId: string): ICooperationSessionState | null {
        return this.sessions.get(sessionId) || null;
    }
    
    /**
     * 发送消息
     * 
     * @param {string} sessionId - 会话ID
     * @param {string} senderId - 发送者ID
     * @param {string} receiverId - 接收者ID
     * @param {string} content - 消息内容
     * @param {string} type - 消息类型
     * @returns {Promise<IAgentMessage>} 发送的消息
     */
    async sendMessage(
        sessionId: string,
        senderId: string,
        receiverId: string,
        content: string,
        type: 'text' | 'code' | 'tool_call' | 'tool_result' | 'error' = 'text'
    ): Promise<IAgentMessage> {
        const session = this.getSessionState(sessionId);
        if (!session) {
            throw new Error(`会话不存在: ${sessionId}`);
        }
        
        // 创建消息
        const message: IAgentMessage = {
            id: uuidv4(),
            senderId,
            receiverId,
            content,
            type,
            createdAt: new Date(),
        };
        
        // 更新会话状态
        session.messages.push(message);
        
        // 使用消息路由器路由消息
        await messageRouter.routeMessage(message);
        
        // 通知状态变化订阅者
        this.notifyStateSubscribers(sessionId, session);
        
        return message;
    }
    
    /**
     * 启动协作会话
     * 
     * @param {string} sessionId - 会话ID
     * @param {TCooperationStrategy} strategy - 协作策略
     * @param {string} initialMessage - 初始消息
     * @returns {Promise<boolean>} 启动结果
     */
    async startCooperation(
        sessionId: string,
        strategy: TCooperationStrategy = 'sequential',
        initialMessage: string = ''
    ): Promise<boolean> {
        const session = this.getSessionState(sessionId);
        if (!session) {
            throw new Error(`会话不存在: ${sessionId}`);
        }
        
        // 检查会话是否已经开始
        if (session.status === 'active') {
            return false;
        }
        
        // 更新会话状态
        session.status = 'active';
        session.currentRound = 1;
        
        // 根据策略启动协作
        switch (strategy) {
            case 'sequential':
                return this.startSequentialCooperation(sessionId, initialMessage);
            case 'orchestrated':
                return this.startOrchestratedCooperation(sessionId, initialMessage);
            case 'parallel':
                return this.startParallelCooperation(sessionId, initialMessage);
            case 'adaptive':
                return this.startAdaptiveCooperation(sessionId, initialMessage);
            default:
                throw new Error(`未支持的协作策略: ${strategy}`);
        }
    }
    
    /**
     * 启动顺序协作
     * 
     * @param {string} sessionId - 会话ID
     * @param {string} initialMessage - 初始消息
     * @returns {Promise<boolean>} 启动结果
     */
    private async startSequentialCooperation(
        sessionId: string,
        initialMessage: string
    ): Promise<boolean> {
        const session = this.getSessionState(sessionId);
        if (!session) {
            return false;
        }
        
        // 获取会话中的代理
        const agents = agentService.getSessionAgents(sessionId);
        if (agents.length === 0) {
            session.error = '会话中没有代理';
            session.status = 'error';
            this.notifyStateSubscribers(sessionId, session);
            return false;
        }
        
        // 找到用户代理和助手代理
        const userAgent = agents.find(agent => agent.config.role === TAgentRole.USER);
        const assistantAgent = agents.find(agent => agent.config.role === TAgentRole.ASSISTANT);
        
        if (!userAgent || !assistantAgent) {
            session.error = '会话缺少用户代理或助手代理';
            session.status = 'error';
            this.notifyStateSubscribers(sessionId, session);
            return false;
        }
        
        // 初始消息由用户发给助手
        if (initialMessage) {
            await this.sendMessage(
                sessionId,
                userAgent.config.id,
                assistantAgent.config.id,
                initialMessage
            );
        }
        
        // 设置助手为活跃代理
        session.activeAgentId = assistantAgent.config.id;
        this.notifyStateSubscribers(sessionId, session);
        
        return true;
    }
    
    /**
     * 启动协调式协作
     * 
     * @param {string} sessionId - 会话ID
     * @param {string} initialMessage - 初始消息
     * @returns {Promise<boolean>} 启动结果
     */
    private async startOrchestratedCooperation(
        sessionId: string,
        initialMessage: string
    ): Promise<boolean> {
        const session = this.getSessionState(sessionId);
        if (!session) {
            return false;
        }
        
        // 获取会话中的代理
        const agents = agentService.getSessionAgents(sessionId);
        
        // 找到用户代理和协调者代理
        const userAgent = agents.find(agent => agent.config.role === TAgentRole.USER);
        const orchestratorAgent = agents.find(agent => agent.config.role === TAgentRole.ORCHESTRATOR);
        
        if (!userAgent || !orchestratorAgent) {
            session.error = '会话缺少用户代理或协调者代理';
            session.status = 'error';
            this.notifyStateSubscribers(sessionId, session);
            return false;
        }
        
        // 初始消息由用户发给协调者
        if (initialMessage) {
            await this.sendMessage(
                sessionId,
                userAgent.config.id,
                orchestratorAgent.config.id,
                initialMessage
            );
        }
        
        // 设置协调者为活跃代理
        session.activeAgentId = orchestratorAgent.config.id;
        this.notifyStateSubscribers(sessionId, session);
        
        return true;
    }
    
    /**
     * 启动并行协作
     * 
     * @param {string} sessionId - 会话ID
     * @param {string} initialMessage - 初始消息
     * @returns {Promise<boolean>} 启动结果
     */
    private async startParallelCooperation(
        sessionId: string,
        initialMessage: string
    ): Promise<boolean> {
        const session = this.getSessionState(sessionId);
        if (!session) {
            return false;
        }
        
        // 获取会话中的代理
        const agents = agentService.getSessionAgents(sessionId);
        if (agents.length === 0) {
            session.error = '会话中没有代理';
            session.status = 'error';
            this.notifyStateSubscribers(sessionId, session);
            return false;
        }
        
        // 找到用户代理
        const userAgent = agents.find(agent => agent.config.role === TAgentRole.USER);
        if (!userAgent) {
            session.error = '会话缺少用户代理';
            session.status = 'error';
            this.notifyStateSubscribers(sessionId, session);
            return false;
        }
        
        // 找到所有不是用户的代理
        const nonUserAgents = agents.filter(agent => agent.config.role !== TAgentRole.USER);
        
        if (nonUserAgents.length === 0) {
            session.error = '会话中缺少非用户代理';
            session.status = 'error';
            this.notifyStateSubscribers(sessionId, session);
            return false;
        }
        
        // 将初始消息发送给所有非用户代理（并行处理）
        if (initialMessage) {
            await Promise.all(nonUserAgents.map(agent => 
                this.sendMessage(
                    sessionId,
                    userAgent.config.id,
                    agent.config.id,
                    initialMessage
                )
            ));
        }
        
        // 并行模式下不设置单一活跃代理
        session.activeAgentId = null;
        this.notifyStateSubscribers(sessionId, session);
        
        return true;
    }
    
    /**
     * 启动自适应协作
     * 
     * @param {string} sessionId - 会话ID
     * @param {string} initialMessage - 初始消息
     * @returns {Promise<boolean>} 启动结果
     */
    private async startAdaptiveCooperation(
        sessionId: string,
        initialMessage: string
    ): Promise<boolean> {
        const session = this.getSessionState(sessionId);
        if (!session) {
            return false;
        }
        
        // 获取会话中的代理
        const agents = agentService.getSessionAgents(sessionId);
        
        // 找到用户代理
        const userAgent = agents.find(agent => agent.config.role === TAgentRole.USER);
        
        // 找到协调者代理（自适应模式需要协调者）
        const orchestratorAgent = agents.find(agent => agent.config.role === TAgentRole.ORCHESTRATOR);
        
        if (!userAgent || !orchestratorAgent) {
            // 如果没有协调者，则回退到顺序模式
            session.error = '自适应模式需要协调者代理，回退到顺序模式';
            return this.startSequentialCooperation(sessionId, initialMessage);
        }
        
        // 任务初始分析由协调者进行
        if (initialMessage) {
            await this.sendMessage(
                sessionId,
                userAgent.config.id,
                orchestratorAgent.config.id,
                `[自适应协作]请分析以下任务并确定最佳协作策略：\n\n${initialMessage}`
            );
        }
        
        // 设置协调者为活跃代理
        session.activeAgentId = orchestratorAgent.config.id;
        this.notifyStateSubscribers(sessionId, session);
        
        return true;
    }
    
    /**
     * 结束代理协作
     * 
     * @param {string} sessionId - 会话ID
     * @returns {Promise<boolean>} 结束结果
     */
    async endCooperation(sessionId: string): Promise<boolean> {
        const session = this.getSessionState(sessionId);
        if (!session) {
            return false;
        }
        
        // 更新会话状态
        session.status = 'completed';
        session.activeAgentId = null;
        
        // 通知订阅者
        this.notifyStateSubscribers(sessionId, session);
        
        return true;
    }
    
    /**
     * 暂停代理协作
     * 
     * @param {string} sessionId - 会话ID
     * @returns {Promise<boolean>} 暂停结果
     */
    async pauseCooperation(sessionId: string): Promise<boolean> {
        const session = this.getSessionState(sessionId);
        if (!session) {
            return false;
        }
        
        // 更新会话状态
        session.status = 'paused';
        
        // 通知订阅者
        this.notifyStateSubscribers(sessionId, session);
        
        return true;
    }
    
    /**
     * 恢复代理协作
     * 
     * @param {string} sessionId - 会话ID
     * @returns {Promise<boolean>} 恢复结果
     */
    async resumeCooperation(sessionId: string): Promise<boolean> {
        const session = this.getSessionState(sessionId);
        if (!session || session.status !== 'paused') {
            return false;
        }
        
        // 更新会话状态
        session.status = 'active';
        
        // 通知订阅者
        this.notifyStateSubscribers(sessionId, session);
        
        return true;
    }
    
    /**
     * 订阅消息
     * 
     * @param {string} sessionId - 会话ID
     * @param {(message: IAgentMessage) => void} callback - 回调函数
     * @returns {() => void} 取消订阅函数
     */
    subscribeToMessages(
        sessionId: string,
        callback: (message: IAgentMessage) => void
    ): () => void {
        // 获取当前会话的订阅者列表
        const subscribers = this.messageSubscribers.get(sessionId) || [];
        
        // 添加新订阅者
        subscribers.push(callback);
        this.messageSubscribers.set(sessionId, subscribers);
        
        // 返回取消订阅函数
        return () => {
            const currentSubscribers = this.messageSubscribers.get(sessionId) || [];
            this.messageSubscribers.set(
                sessionId,
                currentSubscribers.filter(sub => sub !== callback)
            );
        };
    }
    
    /**
     * 订阅状态变化
     * 
     * @param {string} sessionId - 会话ID
     * @param {(state: ICooperationSessionState) => void} callback - 回调函数
     * @returns {() => void} 取消订阅函数
     */
    subscribeToStateChanges(
        sessionId: string,
        callback: (state: ICooperationSessionState) => void
    ): () => void {
        // 获取当前会话的订阅者列表
        const subscribers = this.stateSubscribers.get(sessionId) || [];
        
        // 添加新订阅者
        subscribers.push(callback);
        this.stateSubscribers.set(sessionId, subscribers);
        
        // 返回取消订阅函数
        return () => {
            const currentSubscribers = this.stateSubscribers.get(sessionId) || [];
            this.stateSubscribers.set(
                sessionId,
                currentSubscribers.filter(sub => sub !== callback)
            );
        };
    }
    
    /**
     * 通知消息订阅者
     * 
     * @param {string} sessionId - 会话ID
     * @param {IAgentMessage} message - 消息
     */
    private notifyMessageSubscribers(sessionId: string, message: IAgentMessage): void {
        const subscribers = this.messageSubscribers.get(sessionId) || [];
        subscribers.forEach(callback => {
            try {
                callback(message);
            } catch (error) {
                console.error('通知消息订阅者失败:', error);
            }
        });
    }
    
    /**
     * 通知状态订阅者
     * 
     * @param {string} sessionId - 会话ID
     * @param {ICooperationSessionState} state - 状态
     */
    private notifyStateSubscribers(sessionId: string, state: ICooperationSessionState): void {
        const subscribers = this.stateSubscribers.get(sessionId) || [];
        subscribers.forEach(callback => {
            try {
                callback({ ...state });  // 传递状态副本
            } catch (error) {
                console.error('通知状态订阅者失败:', error);
            }
        });
    }
}

// 创建并导出代理协作管理器单例
export const agentCooperationManager = new AgentCooperationManager();

export default agentCooperationManager; 