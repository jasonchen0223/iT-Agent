import { Session } from '@/types/session';
import { Agent } from '@/types/agent';
import { Message } from '@/types/message';
import { MessageRouter } from './message-router';
import { getAllMessageRouteRules } from '@/server/actions/message-route-service';
import { addMessageToSession, updateSessionState } from '@/server/actions/session-service';

/**
 * 编排器类
 * 用于协调多代理之间的通信和协作
 */
export class Orchestrator {
    private session: Session;
    private agents: Record<string, Agent> = {};
    private messageRouter: MessageRouter;
    private isRunning: boolean = false;

    /**
     * 构造函数
     * @param session 会话对象
     */
    constructor(session: Session) {
        this.session = session;
        this.messageRouter = new MessageRouter();
        
        // 初始化代理映射
        session.agents.forEach(agent => {
            this.agents[agent.id] = agent;
        });
    }

    /**
     * 初始化编排器
     */
    async initialize(): Promise<void> {
        try {
            // 加载消息路由规则
            const rules = await getAllMessageRouteRules();
            this.messageRouter.setRules(rules);
            
            // 确保会话状态存在
            if (!this.session.state) {
                await this.createSessionState();
            }
        } catch (error) {
            console.error('初始化编排器失败:', error);
            throw new Error('初始化编排器失败');
        }
    }

    /**
     * 创建会话状态
     */
    private async createSessionState() {
        try {
            const state = await updateSessionState(this.session.id, {
                currentRound: 0,
                maxRounds: 10,
                strategy: 'sequential',
                metadata: {}
            });
            this.session.state = state;
        } catch (error) {
            console.error('创建会话状态失败:', error);
            throw new Error('创建会话状态失败');
        }
    }

    /**
     * 获取会话
     */
    getSession(): Session {
        return this.session;
    }

    /**
     * 获取代理列表
     */
    getAgents(): Agent[] {
        return Object.values(this.agents);
    }

    /**
     * 获取代理
     * @param agentId 代理ID
     */
    getAgent(agentId: string): Agent | null {
        return this.agents[agentId] || null;
    }

    /**
     * 设置活跃代理
     * @param agentId 代理ID
     */
    async setActiveAgent(agentId: string): Promise<void> {
        if (!this.agents[agentId]) {
            throw new Error('指定的代理不存在');
        }

        try {
            // 更新会话状态
            const state = await updateSessionState(this.session.id, {
                activeAgentId: agentId
            });
            
            // 更新本地会话状态
            if (this.session.state) {
                this.session.state.activeAgentId = agentId;
            } else {
                this.session.state = state;
            }
        } catch (error) {
            console.error('设置活跃代理失败:', error);
            throw new Error('设置活跃代理失败');
        }
    }

    /**
     * 发送消息并路由
     * @param message 消息对象（不包含id和createdAt）
     */
    async sendMessage(message: Omit<Message, 'id' | 'createdAt'>): Promise<Message[]> {
        try {
            // 创建代理映射表，用于获取角色信息
            const agentsMap: Record<string, { id: string; role: string }> = {};
            Object.values(this.agents).forEach(agent => {
                agentsMap[agent.id] = { id: agent.id, role: agent.role };
            });
            
            // 路由消息
            const routeResult = this.messageRouter.routeMessage(
                message as Message, 
                agentsMap
            );
            
            // 存储发送的消息和路由的消息
            const savedMessages: Message[] = [];
            
            // 保存原始消息（如果没有被拦截）
            if (!routeResult.intercepted) {
                const savedOriginalMessage = await addMessageToSession(
                    this.session.id,
                    message
                );
                savedMessages.push(savedOriginalMessage);
            }
            
            // 保存转发的消息
            if (routeResult.forwardTo && routeResult.forwardTo.length > 0) {
                for (const target of routeResult.forwardTo) {
                    // 跳过与原始接收者相同的目标（如果没有被拦截）
                    if (!routeResult.intercepted && target.receiverId === message.receiverId) {
                        continue;
                    }
                    
                    // 创建转发消息
                    const forwardedMessage = await addMessageToSession(
                        this.session.id,
                        {
                            ...message,
                            receiverId: target.receiverId,
                            metadata: {
                                ...(message.metadata || {}),
                                forwarded: true,
                                originalReceiverId: message.receiverId,
                                appliedRules: routeResult.appliedRules
                            }
                        }
                    );
                    
                    savedMessages.push(forwardedMessage);
                }
            }
            
            // 更新会话消息列表
            this.session.messages = [...this.session.messages, ...savedMessages];
            
            return savedMessages;
        } catch (error) {
            console.error('发送消息失败:', error);
            throw new Error('发送消息失败');
        }
    }

    /**
     * 启动会话
     */
    async start(): Promise<void> {
        if (this.isRunning) {
            return;
        }
        
        try {
            this.isRunning = true;
            
            // 更新会话状态
            await updateSessionState(this.session.id, {
                currentRound: 0,
                strategy: this.session.state?.strategy || 'sequential',
                metadata: {
                    ...(this.session.state?.metadata || {}),
                    startTime: new Date().toISOString()
                }
            });
            
            // 根据策略执行不同的启动逻辑
            switch (this.session.state?.strategy) {
                case 'sequential':
                    await this.startSequentialStrategy();
                    break;
                case 'parallel':
                    await this.startParallelStrategy();
                    break;
                case 'orchestrated':
                    await this.startOrchestratedStrategy();
                    break;
                case 'adaptive':
                    await this.startAdaptiveStrategy();
                    break;
                default:
                    await this.startSequentialStrategy();
            }
        } catch (error) {
            this.isRunning = false;
            console.error('启动会话失败:', error);
            throw new Error('启动会话失败');
        }
    }

    /**
     * 停止会话
     */
    async stop(): Promise<void> {
        if (!this.isRunning) {
            return;
        }
        
        try {
            this.isRunning = false;
            
            // 更新会话状态
            await updateSessionState(this.session.id, {
                metadata: {
                    ...(this.session.state?.metadata || {}),
                    stopTime: new Date().toISOString()
                }
            });
        } catch (error) {
            console.error('停止会话失败:', error);
            throw new Error('停止会话失败');
        }
    }

    /**
     * 启动顺序执行策略
     * 代理按照预定义的顺序轮流发言
     */
    private async startSequentialStrategy(): Promise<void> {
        if (!this.session.state) {
            throw new Error('会话状态不存在');
        }
        
        // 如果没有活跃代理，选择第一个代理作为活跃代理
        if (!this.session.state.activeAgentId && this.session.agents.length > 0) {
            await this.setActiveAgent(this.session.agents[0].id);
        }
    }

    /**
     * 启动并行执行策略
     * 所有代理同时执行，相互独立
     */
    private async startParallelStrategy(): Promise<void> {
        // 并行策略不需要活跃代理
        // 所有代理可以同时工作
    }

    /**
     * 启动由编排器控制的策略
     * 编排器决定哪个代理在什么时候执行
     */
    private async startOrchestratedStrategy(): Promise<void> {
        if (!this.session.state) {
            throw new Error('会话状态不存在');
        }
        
        // 设置控制代理作为活跃代理（如果存在）
        const controlAgent = this.session.agents.find(agent => agent.role === 'orchestrator');
        if (controlAgent) {
            await this.setActiveAgent(controlAgent.id);
        } else if (this.session.agents.length > 0) {
            // 如果没有控制代理，选择第一个代理
            await this.setActiveAgent(this.session.agents[0].id);
        }
    }

    /**
     * 启动自适应策略
     * 根据会话状态和消息内容动态决定下一个活跃代理
     */
    private async startAdaptiveStrategy(): Promise<void> {
        if (!this.session.state) {
            throw new Error('会话状态不存在');
        }
        
        // 初始设置与顺序执行策略相同
        if (!this.session.state.activeAgentId && this.session.agents.length > 0) {
            await this.setActiveAgent(this.session.agents[0].id);
        }
    }

    /**
     * 进入下一轮对话
     */
    async nextRound(): Promise<void> {
        if (!this.session.state) {
            throw new Error('会话状态不存在');
        }
        
        try {
            const currentRound = (this.session.state.currentRound || 0) + 1;
            const maxRounds = this.session.state.maxRounds || 10;
            
            // 检查是否达到最大轮数
            if (currentRound > maxRounds) {
                await this.stop();
                return;
            }
            
            // 更新轮数
            await updateSessionState(this.session.id, {
                currentRound,
            });
            
            // 更新本地会话状态
            if (this.session.state) {
                this.session.state.currentRound = currentRound;
            }
            
            // 根据策略选择下一个活跃代理
            await this.selectNextActiveAgent();
        } catch (error) {
            console.error('进入下一轮失败:', error);
            throw new Error('进入下一轮失败');
        }
    }

    /**
     * 根据策略选择下一个活跃代理
     */
    private async selectNextActiveAgent(): Promise<void> {
        if (!this.session.state) {
            throw new Error('会话状态不存在');
        }
        
        const strategy = this.session.state.strategy || 'sequential';
        
        switch (strategy) {
            case 'sequential':
                await this.selectNextAgentSequential();
                break;
            case 'parallel':
                // 并行策略不需要活跃代理
                break;
            case 'orchestrated':
                // 编排控制策略由控制代理决定下一个活跃代理
                break;
            case 'adaptive':
                await this.selectNextAgentAdaptive();
                break;
            default:
                await this.selectNextAgentSequential();
        }
    }

    /**
     * 顺序选择下一个活跃代理
     */
    private async selectNextAgentSequential(): Promise<void> {
        const agents = this.session.agents;
        if (agents.length === 0) return;
        
        const currentActiveId = this.session.state?.activeAgentId;
        
        // 如果没有当前活跃代理，选择第一个
        if (!currentActiveId) {
            await this.setActiveAgent(agents[0].id);
            return;
        }
        
        // 找出当前活跃代理的索引
        const currentIndex = agents.findIndex(agent => agent.id === currentActiveId);
        
        // 计算下一个代理的索引（循环）
        const nextIndex = (currentIndex + 1) % agents.length;
        
        // 设置下一个代理为活跃代理
        await this.setActiveAgent(agents[nextIndex].id);
    }

    /**
     * 自适应选择下一个活跃代理
     * 基于最新消息和代理角色
     */
    private async selectNextAgentAdaptive(): Promise<void> {
        const agents = this.session.agents;
        if (agents.length === 0) return;
        
        // 获取最新的几条消息
        const recentMessages = this.session.messages
            .slice(-5)
            .filter(msg => msg.type === 'text');
        
        // 如果没有最近的消息，使用顺序策略
        if (recentMessages.length === 0) {
            await this.selectNextAgentSequential();
            return;
        }
        
        // 分析最新消息的内容，查找提到的代理角色
        // 这里使用简单的关键词匹配，实际项目中可能需要更复杂的NLP
        const latestMessage = recentMessages[recentMessages.length - 1];
        const content = latestMessage.content.toLowerCase();
        
        // 查找内容中提到的代理角色
        const mentionedAgent = agents.find(agent => 
            content.includes(agent.role.toLowerCase()) || 
            content.includes(agent.name.toLowerCase())
        );
        
        if (mentionedAgent) {
            await this.setActiveAgent(mentionedAgent.id);
        } else {
            // 如果没有找到提到的代理，使用顺序策略
            await this.selectNextAgentSequential();
        }
    }
} 