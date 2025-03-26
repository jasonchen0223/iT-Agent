/**
 * 消息总线服务
 * 
 * 提供代理之间的消息传递和路由功能
 */
import { v4 as uuidv4 } from 'uuid';
import { TMessage, TMessageType, TMessagePriority, IBaseMessage } from '@/types/message-types';
import { TAgentRole } from '@/types/agent-types';

/**
 * 消息订阅函数类型
 */
type TMessageHandler = (message: TMessage) => Promise<void> | void;

/**
 * 消息过滤条件
 */
interface IMessageFilter {
    /**
     * 消息类型
     */
    type?: TMessageType;
    
    /**
     * 发送者ID
     */
    senderId?: string;
    
    /**
     * 接收者ID
     */
    receiverId?: string;
    
    /**
     * 发送者角色
     */
    senderRole?: TAgentRole;
    
    /**
     * 优先级
     */
    priority?: TMessagePriority;
    
    /**
     * 自定义过滤函数
     */
    custom?: (message: TMessage) => boolean;
}

/**
 * 消息订阅信息
 */
interface ISubscription {
    /**
     * 订阅ID
     */
    id: string;
    
    /**
     * 订阅者ID
     */
    subscriberId: string;
    
    /**
     * 过滤条件
     */
    filter: IMessageFilter;
    
    /**
     * 处理函数
     */
    handler: TMessageHandler;
}

/**
 * 消息总线服务类
 * 
 * 负责管理系统中的消息传递
 */
class MessageBusService {
    /**
     * 全局序列号计数器
     */
    private sequenceCounter: number = 0;
    
    /**
     * 消息历史记录
     */
    private messageHistory: Map<string, TMessage> = new Map();
    
    /**
     * 消息订阅列表
     */
    private subscriptions: ISubscription[] = [];
    
    /**
     * 会话消息映射表 - 按会话ID分组存储消息ID
     */
    private sessionMessages: Map<string, string[]> = new Map();
    
    /**
     * 构造函数
     */
    constructor() {
        console.log('消息总线服务已初始化');
    }
    
    /**
     * 创建新消息
     * 
     * @param type 消息类型
     * @param senderId 发送者ID
     * @param senderRole 发送者角色
     * @param sessionId 会话ID
     * @param data 消息数据
     * @param receiverId 接收者ID
     * @param priority 优先级
     * @param parentId 父消息ID
     * @returns 创建的消息对象
     */
    createMessage<T extends TMessage>(
        type: TMessageType,
        senderId: string,
        senderRole: TAgentRole,
        sessionId: string,
        data: Omit<T, keyof IBaseMessage>,
        receiverId?: string,
        priority: TMessagePriority = TMessagePriority.NORMAL,
        parentId?: string,
    ): T {
        // 生成消息ID
        const id = uuidv4();
        
        // 获取并递增序列号
        const sequence = this.getNextSequence();
        
        // 创建基础消息
        const baseMessage: IBaseMessage = {
            id,
            sessionId,
            senderId,
            senderRole,
            receiverId,
            type,
            priority,
            sequence,
            parentId,
            timestamp: new Date(),
        };
        
        // 合并基础消息和特定类型的数据
        const message = {
            ...baseMessage,
            ...data,
        } as T;
        
        return message;
    }
    
    /**
     * 发布消息
     * 
     * @param message 要发布的消息
     * @returns 消息ID
     */
    async publishMessage(message: TMessage): Promise<string> {
        // 存储消息到历史记录
        this.messageHistory.set(message.id, message);
        
        // 添加到会话消息列表
        const sessionMessages = this.sessionMessages.get(message.sessionId) || [];
        sessionMessages.push(message.id);
        this.sessionMessages.set(message.sessionId, sessionMessages);
        
        // 寻找匹配的订阅并触发处理函数
        const matchingSubscriptions = this.findMatchingSubscriptions(message);
        
        // 并行处理消息
        await Promise.all(
            matchingSubscriptions.map(async (subscription) => {
                try {
                    await subscription.handler(message);
                } catch (error) {
                    console.error(`消息处理错误 (订阅ID: ${subscription.id}):`, error);
                }
            })
        );
        
        return message.id;
    }
    
    /**
     * 订阅消息
     * 
     * @param subscriberId 订阅者ID
     * @param filter 消息过滤条件
     * @param handler 消息处理函数
     * @returns 订阅ID
     */
    subscribe(
        subscriberId: string,
        filter: IMessageFilter,
        handler: TMessageHandler
    ): string {
        const subscriptionId = uuidv4();
        
        this.subscriptions.push({
            id: subscriptionId,
            subscriberId,
            filter,
            handler,
        });
        
        return subscriptionId;
    }
    
    /**
     * 取消订阅
     * 
     * @param subscriptionId 订阅ID
     * @returns 是否成功取消
     */
    unsubscribe(subscriptionId: string): boolean {
        const initialLength = this.subscriptions.length;
        this.subscriptions = this.subscriptions.filter(
            (subscription) => subscription.id !== subscriptionId
        );
        
        return initialLength !== this.subscriptions.length;
    }
    
    /**
     * 取消订阅者的所有订阅
     * 
     * @param subscriberId 订阅者ID
     * @returns 取消的订阅数量
     */
    unsubscribeAll(subscriberId: string): number {
        const initialLength = this.subscriptions.length;
        this.subscriptions = this.subscriptions.filter(
            (subscription) => subscription.subscriberId !== subscriberId
        );
        
        return initialLength - this.subscriptions.length;
    }
    
    /**
     * 获取消息
     * 
     * @param messageId 消息ID
     * @returns 消息或null
     */
    getMessage(messageId: string): TMessage | null {
        return this.messageHistory.get(messageId) || null;
    }
    
    /**
     * 获取会话消息
     * 
     * @param sessionId 会话ID
     * @param limit 限制条数
     * @param offset 偏移量
     * @returns 消息数组
     */
    getSessionMessages(
        sessionId: string,
        limit?: number,
        offset: number = 0
    ): TMessage[] {
        const messageIds = this.sessionMessages.get(sessionId) || [];
        
        // 按序列号排序的消息ID
        const sortedIds = messageIds
            .map(id => this.messageHistory.get(id)!)
            .sort((a, b) => a.sequence - b.sequence)
            .map(message => message.id);
        
        // 应用分页
        const paginatedIds = limit
            ? sortedIds.slice(offset, offset + limit)
            : sortedIds.slice(offset);
        
        // 获取消息对象
        return paginatedIds
            .map(id => this.messageHistory.get(id)!)
            .filter(Boolean);
    }
    
    /**
     * 获取消息线程
     * 
     * @param messageId 起始消息ID
     * @returns 消息线程数组
     */
    getMessageThread(messageId: string): TMessage[] {
        const message = this.messageHistory.get(messageId);
        if (!message) return [];
        
        // 递归获取消息所有回复
        const replies = this.findReplies(messageId);
        
        // 按序列号排序
        return [message, ...replies].sort((a, b) => a.sequence - b.sequence);
    }
    
    /**
     * 清除会话消息
     * 
     * @param sessionId 会话ID
     * @returns 是否成功清除
     */
    clearSessionMessages(sessionId: string): boolean {
        const messageIds = this.sessionMessages.get(sessionId);
        if (!messageIds) return false;
        
        // 从历史记录中删除消息
        messageIds.forEach(id => this.messageHistory.delete(id));
        
        // 删除会话消息映射
        this.sessionMessages.delete(sessionId);
        
        return true;
    }
    
    /**
     * 获取下一个序列号
     * 
     * @returns 序列号
     */
    private getNextSequence(): number {
        return ++this.sequenceCounter;
    }
    
    /**
     * 查找匹配的订阅
     * 
     * @param message 消息
     * @returns 匹配的订阅列表
     */
    private findMatchingSubscriptions(message: TMessage): ISubscription[] {
        return this.subscriptions.filter((subscription) => {
            const { filter } = subscription;
            
            // 检查消息类型
            if (filter.type !== undefined && filter.type !== message.type) {
                return false;
            }
            
            // 检查发送者ID
            if (filter.senderId !== undefined && filter.senderId !== message.senderId) {
                return false;
            }
            
            // 检查接收者ID
            if (filter.receiverId !== undefined && 
                message.receiverId !== undefined &&
                filter.receiverId !== message.receiverId) {
                return false;
            }
            
            // 检查发送者角色
            if (filter.senderRole !== undefined && filter.senderRole !== message.senderRole) {
                return false;
            }
            
            // 检查优先级
            if (filter.priority !== undefined && filter.priority !== message.priority) {
                return false;
            }
            
            // 应用自定义过滤函数
            if (filter.custom !== undefined && !filter.custom(message)) {
                return false;
            }
            
            return true;
        });
    }
    
    /**
     * 递归查找消息回复
     * 
     * @param parentId 父消息ID
     * @returns 回复消息数组
     */
    private findReplies(parentId: string): TMessage[] {
        const replies: TMessage[] = [];
        
        // 查找直接回复
        for (const message of this.messageHistory.values()) {
            if (message.parentId === parentId) {
                replies.push(message);
                
                // 递归查找子回复
                const childReplies = this.findReplies(message.id);
                replies.push(...childReplies);
            }
        }
        
        return replies;
    }
}

// 创建消息总线服务实例
export const messageBusService = new MessageBusService(); 