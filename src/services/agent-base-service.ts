/**
 * 代理基础服务
 * 
 * 提供代理的共同功能和生命周期管理
 */
import { v4 as uuidv4 } from 'uuid';
import { 
    IAgent, 
    TAgentRole, 
    TAgentModel, 
    TAgentStatus, 
    IAgentCapability 
} from '@/types/agent-types';
import { 
    TMessage, 
    TMessageType, 
    TMessagePriority, 
    ITextMessage, 
    ICommandMessage 
} from '@/types/message-types';
import { messageBusService } from './message-bus-service';
import { toolService } from './tool-service';
import { toolLogService } from './tool-log-service';

/**
 * 代理初始化选项
 */
export interface IAgentOptions {
    /**
     * 代理ID (可选，如不提供将自动生成)
     */
    id?: string;
    
    /**
     * 代理名称
     */
    name: string;
    
    /**
     * 代理描述
     */
    description: string;
    
    /**
     * 代理角色
     */
    role: TAgentRole;
    
    /**
     * 自定义角色名称(当role为CUSTOM时使用)
     */
    customRoleName?: string;
    
    /**
     * 代理模型
     */
    model: TAgentModel;
    
    /**
     * 自定义模型名称(当model为CUSTOM时使用)
     */
    customModelName?: string;
    
    /**
     * 系统提示词
     */
    systemPrompt: string;
    
    /**
     * 代理能力列表
     */
    capabilities?: IAgentCapability[];
    
    /**
     * 代理配置
     */
    config?: Record<string, any>;
}

/**
 * 代理基础类
 * 
 * 所有代理实现的基础类
 */
export abstract class AgentBase implements IAgent {
    /**
     * 代理ID
     */
    id: string;
    
    /**
     * 代理名称
     */
    name: string;
    
    /**
     * 代理描述
     */
    description: string;
    
    /**
     * 代理角色
     */
    role: TAgentRole;
    
    /**
     * 自定义角色名称
     */
    customRoleName?: string;
    
    /**
     * 代理模型
     */
    model: TAgentModel;
    
    /**
     * 自定义模型名称
     */
    customModelName?: string;
    
    /**
     * 系统提示词
     */
    systemPrompt: string;
    
    /**
     * 代理能力列表
     */
    capabilities: IAgentCapability[];
    
    /**
     * 代理状态
     */
    status: TAgentStatus;
    
    /**
     * 代理配置
     */
    config: Record<string, any>;
    
    /**
     * 创建时间
     */
    createdAt: Date;
    
    /**
     * 更新时间
     */
    updatedAt: Date;
    
    /**
     * 代理订阅ID
     */
    private subscriptionId?: string;
    
    /**
     * 当前会话ID
     */
    protected sessionId?: string;
    
    /**
     * 最后消息ID
     */
    protected lastMessageId?: string;
    
    /**
     * 构造函数
     * 
     * @param options 代理选项
     */
    constructor(options: IAgentOptions) {
        this.id = options.id || uuidv4();
        this.name = options.name;
        this.description = options.description;
        this.role = options.role;
        this.customRoleName = options.customRoleName;
        this.model = options.model;
        this.customModelName = options.customModelName;
        this.systemPrompt = options.systemPrompt;
        this.capabilities = options.capabilities || [];
        this.config = options.config || {};
        this.status = TAgentStatus.IDLE;
        
        const now = new Date();
        this.createdAt = now;
        this.updatedAt = now;
    }
    
    /**
     * 初始化代理
     * 
     * @param sessionId 会话ID
     */
    async initialize(sessionId: string): Promise<void> {
        this.sessionId = sessionId;
        this.status = TAgentStatus.IDLE;
        
        // 订阅消息
        this.subscribeToMessages();
        
        // 发送初始化消息
        await this.sendSystemMessage(
            'initialize',
            `代理${this.name}已初始化`,
            'info'
        );
        
        // 子类可以覆盖此方法提供额外的初始化逻辑
    }
    
    /**
     * 启动代理
     */
    async start(): Promise<void> {
        if (!this.sessionId) {
            throw new Error('代理未初始化');
        }
        
        if (this.status !== TAgentStatus.IDLE) {
            throw new Error(`代理无法启动，当前状态: ${this.status}`);
        }
        
        this.status = TAgentStatus.WORKING;
        
        // 发送启动消息
        await this.sendSystemMessage(
            'start',
            `代理${this.name}已启动`,
            'info'
        );
        
        // 子类应该覆盖此方法提供启动逻辑
    }
    
    /**
     * 停止代理
     */
    async stop(): Promise<void> {
        if (this.status === TAgentStatus.IDLE || this.status === TAgentStatus.TERMINATED) {
            return;
        }
        
        this.status = TAgentStatus.IDLE;
        
        // 发送停止消息
        await this.sendSystemMessage(
            'stop',
            `代理${this.name}已停止`,
            'info'
        );
        
        // 子类可以覆盖此方法提供额外的停止逻辑
    }
    
    /**
     * 终止代理
     */
    async terminate(): Promise<void> {
        // 取消消息订阅
        if (this.subscriptionId) {
            messageBusService.unsubscribe(this.subscriptionId);
            this.subscriptionId = undefined;
        }
        
        this.status = TAgentStatus.TERMINATED;
        
        // 发送终止消息
        await this.sendSystemMessage(
            'terminate',
            `代理${this.name}已终止`,
            'info'
        );
        
        // 子类可以覆盖此方法提供额外的终止逻辑
    }
    
    /**
     * 发送文本消息
     * 
     * @param content 消息内容
     * @param receiverId 接收者ID
     * @param priority 优先级
     * @param parentId 父消息ID
     * @returns 消息ID
     */
    protected async sendTextMessage(
        content: string,
        receiverId?: string,
        priority: TMessagePriority = TMessagePriority.NORMAL,
        parentId?: string
    ): Promise<string> {
        if (!this.sessionId) {
            throw new Error('代理未初始化，无法发送消息');
        }
        
        const message = messageBusService.createMessage<ITextMessage>(
            TMessageType.TEXT,
            this.id,
            this.role,
            this.sessionId,
            { content },
            receiverId,
            priority,
            parentId
        );
        
        this.lastMessageId = await messageBusService.publishMessage(message);
        return this.lastMessageId;
    }
    
    /**
     * 发送命令消息
     * 
     * @param command 命令名称
     * @param args 命令参数
     * @param receiverId 接收者ID
     * @param priority 优先级
     * @param parentId 父消息ID
     * @returns 消息ID
     */
    protected async sendCommandMessage(
        command: string,
        args: Record<string, any>,
        receiverId?: string,
        priority: TMessagePriority = TMessagePriority.NORMAL,
        parentId?: string
    ): Promise<string> {
        if (!this.sessionId) {
            throw new Error('代理未初始化，无法发送消息');
        }
        
        const message = messageBusService.createMessage<ICommandMessage>(
            TMessageType.COMMAND,
            this.id,
            this.role,
            this.sessionId,
            { command, args },
            receiverId,
            priority,
            parentId
        );
        
        this.lastMessageId = await messageBusService.publishMessage(message);
        return this.lastMessageId;
    }
    
    /**
     * 发送系统消息
     * 
     * @param type 系统消息类型
     * @param content 消息内容
     * @param level 消息级别
     * @param receiverId 接收者ID
     * @returns 消息ID
     */
    protected async sendSystemMessage(
        type: string,
        content: string,
        level: 'info' | 'warning' | 'error' = 'info',
        receiverId?: string
    ): Promise<string> {
        if (!this.sessionId) {
            throw new Error('代理未初始化，无法发送消息');
        }
        
        const message = messageBusService.createMessage(
            TMessageType.SYSTEM,
            this.id,
            this.role,
            this.sessionId,
            { 
                content,
                level,
                metadata: { type }
            },
            receiverId,
            level === 'error' ? TMessagePriority.HIGH : TMessagePriority.NORMAL
        );
        
        this.lastMessageId = await messageBusService.publishMessage(message);
        return this.lastMessageId;
    }
    
    /**
     * 调用工具
     * 
     * @param toolId 工具ID
     * @param params 工具参数
     * @returns 工具调用结果
     */
    protected async callTool(toolId: string, params: any): Promise<any> {
        if (!this.sessionId) {
            throw new Error('代理未初始化，无法调用工具');
        }
        
        try {
            // 记录工具调用开始
            const logId = toolLogService.startToolCall(toolId, this.sessionId, this.id, params);
            
            // 调用工具
            const result = await toolService.callTool(toolId, params, this.sessionId, this.id);
            
            // 记录工具调用结束
            toolLogService.endToolCall(logId, result);
            
            return result;
        } catch (error) {
            // 记录错误
            if (error instanceof Error) {
                toolLogService.endToolCall(logId, undefined, error);
            }
            
            throw error;
        }
    }
    
    /**
     * 消息处理方法
     * 
     * 子类应重写此方法提供具体的消息处理逻辑
     * 
     * @param message 接收到的消息
     */
    protected abstract handleMessage(message: TMessage): Promise<void>;
    
    /**
     * 订阅消息
     */
    private subscribeToMessages(): void {
        // 确保不会重复订阅
        if (this.subscriptionId) {
            messageBusService.unsubscribe(this.subscriptionId);
        }
        
        // 订阅接收者为此代理或广播的消息
        this.subscriptionId = messageBusService.subscribe(
            this.id,
            {
                custom: (message) => {
                    // 消息接收者是此代理或为空(广播)
                    return !message.receiverId || message.receiverId === this.id;
                }
            },
            async (message) => {
                // 更新状态
                this.status = TAgentStatus.WORKING;
                
                try {
                    // 调用子类实现的消息处理方法
                    await this.handleMessage(message);
                } catch (error) {
                    console.error(`代理${this.name}处理消息时发生错误:`, error);
                    // 发送错误消息
                    await this.sendSystemMessage(
                        'error',
                        `处理消息时发生错误: ${error instanceof Error ? error.message : 'Unknown error'}`,
                        'error'
                    );
                    
                    this.status = TAgentStatus.ERROR;
                }
                
                // 消息处理完成后恢复状态
                if (this.status !== TAgentStatus.ERROR) {
                    this.status = TAgentStatus.IDLE;
                }
            }
        );
    }
} 