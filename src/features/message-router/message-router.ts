/**
 * 消息处理与路由模块核心实现
 * 
 * 管理代理之间的消息传递规则和路由机制
 */
import { IAgentMessage, TAgentRole } from '@/types/agent';
import { agentService } from '@/lib/agent-service';
import { canAgentsCommunicate } from '@/features/agent-cooperation/utils';
import { v4 as uuidv4 } from 'uuid';

/**
 * 消息优先级类型
 */
export type TMessagePriority = 
    | 'high'   // 高优先级：紧急消息，立即处理
    | 'normal' // 普通优先级：正常处理
    | 'low';   // 低优先级：空闲时处理

/**
 * 消息路由规则接口
 */
export interface IMessageRouteRule {
    /**
     * 规则ID
     */
    id: string;
    
    /**
     * 发送者角色（可选，不指定则匹配所有发送者）
     */
    senderRole?: TAgentRole;
    
    /**
     * 接收者角色（可选，不指定则匹配所有接收者）
     */
    receiverRole?: TAgentRole;
    
    /**
     * 消息类型（可选，不指定则匹配所有类型）
     */
    messageType?: string;
    
    /**
     * 关键词（可选，消息内容包含关键词时匹配）
     */
    keywords?: string[];
    
    /**
     * 是否启用规则
     */
    enabled: boolean;
    
    /**
     * 转发消息的目标代理角色（可选）
     */
    forwardToRole?: TAgentRole;
    
    /**
     * 转发消息的目标代理ID（可选，优先于角色）
     */
    forwardToId?: string;
    
    /**
     * 是否拦截原始消息（如果为true，消息不会发送给原接收者）
     */
    interceptOriginal: boolean;
    
    /**
     * 优先级
     */
    priority: TMessagePriority;
    
    /**
     * 消息变换函数（可选，用于在转发前修改消息）
     */
    transform?: (message: IAgentMessage) => IAgentMessage;
    
    /**
     * 规则描述
     */
    description: string;
}

/**
 * 消息队列接口
 */
interface IMessageQueue {
    /**
     * 高优先级消息队列
     */
    high: IAgentMessage[];
    
    /**
     * 普通优先级消息队列
     */
    normal: IAgentMessage[];
    
    /**
     * 低优先级消息队列
     */
    low: IAgentMessage[];
}

/**
 * 消息路由器类
 */
export class MessageRouter {
    /**
     * 路由规则列表
     */
    private rules: IMessageRouteRule[] = [];
    
    /**
     * 消息处理回调
     */
    private messageHandlers: Map<string, ((message: IAgentMessage) => Promise<void>)[]> = new Map();
    
    /**
     * 消息队列
     */
    private messageQueue: IMessageQueue = {
        high: [],
        normal: [],
        low: []
    };
    
    /**
     * 是否正在处理队列
     */
    private isProcessingQueue: boolean = false;
    
    /**
     * 处理间隔（毫秒）
     */
    private processingInterval: number = 100;
    
    /**
     * 构造函数
     */
    constructor() {
        // 初始化默认规则
        this.initDefaultRules();
        
        // 启动队列处理
        this.startQueueProcessing();
    }
    
    /**
     * 初始化默认路由规则
     */
    private initDefaultRules(): void {
        // 规则1: 用户消息需要广播给协调者
        this.addRule({
            id: uuidv4(),
            senderRole: TAgentRole.USER,
            forwardToRole: TAgentRole.ORCHESTRATOR,
            interceptOriginal: false,
            priority: 'high',
            enabled: true,
            description: '用户消息自动广播给协调者'
        });
        
        // 规则2: 错误消息转发给协调者和用户
        this.addRule({
            id: uuidv4(),
            messageType: 'error',
            forwardToRole: TAgentRole.ORCHESTRATOR,
            interceptOriginal: false,
            priority: 'high',
            enabled: true,
            description: '错误消息转发给协调者'
        });
        
        this.addRule({
            id: uuidv4(),
            messageType: 'error',
            forwardToRole: TAgentRole.USER,
            interceptOriginal: false,
            priority: 'high',
            enabled: true,
            description: '错误消息转发给用户'
        });
    }
    
    /**
     * 启动队列处理
     */
    private startQueueProcessing(): void {
        setInterval(() => {
            if (this.isProcessingQueue) return;
            
            this.processMessageQueue();
        }, this.processingInterval);
    }
    
    /**
     * 处理消息队列
     */
    private async processMessageQueue(): Promise<void> {
        if (this.isProcessingQueue) return;
        
        this.isProcessingQueue = true;
        
        try {
            // 先处理高优先级消息
            while (this.messageQueue.high.length > 0) {
                const message = this.messageQueue.high.shift();
                if (message) {
                    await this.deliverMessage(message);
                }
            }
            
            // 处理一条普通优先级消息
            if (this.messageQueue.normal.length > 0) {
                const message = this.messageQueue.normal.shift();
                if (message) {
                    await this.deliverMessage(message);
                }
            }
            
            // 如果没有高优先级和普通优先级消息，处理一条低优先级消息
            if (this.messageQueue.high.length === 0 && 
                this.messageQueue.normal.length === 0 && 
                this.messageQueue.low.length > 0) {
                const message = this.messageQueue.low.shift();
                if (message) {
                    await this.deliverMessage(message);
                }
            }
        } catch (error) {
            console.error('处理消息队列时出错:', error);
        } finally {
            this.isProcessingQueue = false;
        }
    }
    
    /**
     * 投递消息到实际接收者
     * 
     * @param {IAgentMessage} message - 要投递的消息
     */
    private async deliverMessage(message: IAgentMessage): Promise<void> {
        try {
            const receiver = agentService.getAgent(message.receiverId);
            
            if (!receiver) {
                console.error(`接收者不存在: ${message.receiverId}`);
                return;
            }
            
            await receiver.receiveMessage(message);
            
            // 通知消息处理回调
            this.notifyMessageHandlers(message);
        } catch (error) {
            console.error('投递消息时出错:', error);
        }
    }
    
    /**
     * 添加路由规则
     * 
     * @param {Omit<IMessageRouteRule, 'id'>} rule - 路由规则（不包含ID）
     * @returns {string} 规则ID
     */
    addRule(rule: Omit<IMessageRouteRule, 'id'>): string {
        const id = rule.id || uuidv4();
        
        this.rules.push({
            id,
            ...rule,
        });
        
        // 根据优先级排序规则
        this.sortRules();
        
        return id;
    }
    
    /**
     * 更新路由规则
     * 
     * @param {string} id - 规则ID
     * @param {Partial<IMessageRouteRule>} updates - 要更新的规则属性
     * @returns {boolean} 是否更新成功
     */
    updateRule(id: string, updates: Partial<IMessageRouteRule>): boolean {
        const index = this.rules.findIndex(rule => rule.id === id);
        
        if (index === -1) {
            return false;
        }
        
        this.rules[index] = {
            ...this.rules[index],
            ...updates,
        };
        
        // 重新排序规则
        this.sortRules();
        
        return true;
    }
    
    /**
     * 删除路由规则
     * 
     * @param {string} id - 规则ID
     * @returns {boolean} 是否删除成功
     */
    deleteRule(id: string): boolean {
        const index = this.rules.findIndex(rule => rule.id === id);
        
        if (index === -1) {
            return false;
        }
        
        this.rules.splice(index, 1);
        return true;
    }
    
    /**
     * 获取所有路由规则
     * 
     * @returns {IMessageRouteRule[]} 路由规则列表
     */
    getRules(): IMessageRouteRule[] {
        return [...this.rules];
    }
    
    /**
     * 根据优先级对规则进行排序
     */
    private sortRules(): void {
        const priorityOrder: Record<TMessagePriority, number> = {
            high: 0,
            normal: 1,
            low: 2
        };
        
        this.rules.sort((a, b) => {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    }
    
    /**
     * 应用路由规则
     * 
     * @param {IAgentMessage} message - 要路由的消息
     * @returns {IAgentMessage[]} 应用规则后产生的消息列表
     */
    private applyRules(message: IAgentMessage): IAgentMessage[] {
        const result: IAgentMessage[] = [];
        let intercepted = false;
        
        // 遍历所有启用的规则
        for (const rule of this.rules.filter(r => r.enabled)) {
            // 检查规则是否匹配
            if (this.ruleMatches(rule, message)) {
                // 如果规则指定拦截原始消息
                if (rule.interceptOriginal) {
                    intercepted = true;
                }
                
                // 如果规则指定了转发
                if (rule.forwardToId || rule.forwardToRole) {
                    const forwardedMessage = this.createForwardedMessage(message, rule);
                    if (forwardedMessage) {
                        result.push(forwardedMessage);
                    }
                }
            }
        }
        
        // 如果原始消息没有被拦截，则包含在结果中
        if (!intercepted) {
            result.unshift(message);
        }
        
        return result;
    }
    
    /**
     * 检查规则是否匹配消息
     * 
     * @param {IMessageRouteRule} rule - 路由规则
     * @param {IAgentMessage} message - 消息
     * @returns {boolean} 是否匹配
     */
    private ruleMatches(rule: IMessageRouteRule, message: IAgentMessage): boolean {
        // 检查发送者角色
        if (rule.senderRole) {
            const sender = agentService.getAgent(message.senderId);
            if (!sender || sender.config.role !== rule.senderRole) {
                return false;
            }
        }
        
        // 检查接收者角色
        if (rule.receiverRole) {
            const receiver = agentService.getAgent(message.receiverId);
            if (!receiver || receiver.config.role !== rule.receiverRole) {
                return false;
            }
        }
        
        // 检查消息类型
        if (rule.messageType && message.type !== rule.messageType) {
            return false;
        }
        
        // 检查关键词
        if (rule.keywords && rule.keywords.length > 0) {
            const content = message.content.toLowerCase();
            const hasKeyword = rule.keywords.some(keyword => 
                content.includes(keyword.toLowerCase())
            );
            
            if (!hasKeyword) {
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * 创建转发的消息
     * 
     * @param {IAgentMessage} originalMessage - 原始消息
     * @param {IMessageRouteRule} rule - 路由规则
     * @returns {IAgentMessage | null} 转发的消息或null
     */
    private createForwardedMessage(
        originalMessage: IAgentMessage, 
        rule: IMessageRouteRule
    ): IAgentMessage | null {
        let targetAgentId: string | null = null;
        
        // 如果规则直接指定了目标代理ID
        if (rule.forwardToId) {
            targetAgentId = rule.forwardToId;
        } 
        // 如果规则指定了目标代理角色
        else if (rule.forwardToRole) {
            const agentsWithRole = agentService.getAgentsByRole(rule.forwardToRole);
            if (agentsWithRole.length > 0) {
                // 使用第一个匹配的代理
                targetAgentId = agentsWithRole[0].config.id;
            }
        }
        
        if (!targetAgentId) {
            return null;
        }
        
        // 检查发送者和接收者是否可以通信
        const sender = agentService.getAgent(originalMessage.senderId);
        const receiver = agentService.getAgent(targetAgentId);
        
        if (!sender || !receiver) {
            return null;
        }
        
        if (!canAgentsCommunicate(sender.config.role, receiver.config.role)) {
            console.warn(`代理无法直接通信: ${sender.config.role} -> ${receiver.config.role}`);
            return null;
        }
        
        // 创建转发消息
        let forwardedMessage: IAgentMessage = {
            ...originalMessage,
            id: uuidv4(),
            receiverId: targetAgentId,
            createdAt: new Date()
        };
        
        // 应用消息变换
        if (rule.transform) {
            forwardedMessage = rule.transform(forwardedMessage);
        }
        
        return forwardedMessage;
    }
    
    /**
     * 路由消息
     * 
     * @param {IAgentMessage} message - 要路由的消息
     * @returns {Promise<void>}
     */
    async routeMessage(message: IAgentMessage): Promise<void> {
        // 应用路由规则
        const routedMessages = this.applyRules(message);
        
        // 将消息添加到队列
        for (const routedMessage of routedMessages) {
            this.addToQueue(routedMessage);
        }
    }
    
    /**
     * 将消息添加到队列
     * 
     * @param {IAgentMessage} message - 要添加到队列的消息
     */
    private addToQueue(message: IAgentMessage): void {
        // 查找适用于此消息的规则
        const matchedRules = this.rules.filter(rule => 
            rule.enabled && this.ruleMatches(rule, message)
        );
        
        // 确定最高优先级
        let priority: TMessagePriority = 'normal';
        
        for (const rule of matchedRules) {
            if (rule.priority === 'high') {
                priority = 'high';
                break;
            } else if (rule.priority === 'normal' && priority === 'low') {
                priority = 'normal';
            }
        }
        
        // 将消息添加到相应的队列
        this.messageQueue[priority].push(message);
    }
    
    /**
     * 注册消息处理回调
     * 
     * @param {string} handlerId - 处理器ID
     * @param {(message: IAgentMessage) => Promise<void>} handler - 消息处理回调
     * @returns {() => void} 取消注册的函数
     */
    registerMessageHandler(
        handlerId: string,
        handler: (message: IAgentMessage) => Promise<void>
    ): () => void {
        if (!this.messageHandlers.has(handlerId)) {
            this.messageHandlers.set(handlerId, []);
        }
        
        const handlers = this.messageHandlers.get(handlerId)!;
        handlers.push(handler);
        
        return () => {
            const index = handlers.indexOf(handler);
            if (index !== -1) {
                handlers.splice(index, 1);
            }
        };
    }
    
    /**
     * 通知消息处理回调
     * 
     * @param {IAgentMessage} message - 消息
     */
    private notifyMessageHandlers(message: IAgentMessage): void {
        for (const handlers of this.messageHandlers.values()) {
            for (const handler of handlers) {
                try {
                    handler(message).catch(error => {
                        console.error('消息处理回调发生错误:', error);
                    });
                } catch (error) {
                    console.error('调用消息处理回调时发生错误:', error);
                }
            }
        }
    }
}

// 创建单例实例
const messageRouter = new MessageRouter();

export default messageRouter; 