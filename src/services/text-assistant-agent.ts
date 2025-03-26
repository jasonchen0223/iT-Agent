/**
 * 文本助手代理
 * 
 * 一个简单的文本交互助手代理实现，作为基础代理的子类示例
 */
import { AgentBase, IAgentOptions } from './agent-base-service';
import { TAgentRole, TAgentModel, TAgentStatus } from '@/types/agent-types';
import { 
    TMessage, 
    TMessageType, 
    ITextMessage, 
    ICommandMessage, 
    IToolCallMessage,
    IToolResponseMessage,
    TMessagePriority
} from '@/types/message-types';

/**
 * 文本助手代理选项
 */
export interface ITextAssistantOptions extends Omit<IAgentOptions, 'role' | 'systemPrompt'> {
    /**
     * 自定义系统提示词
     */
    customSystemPrompt?: string;
}

/**
 * 文本助手代理
 * 
 * 一个简单的文本交互助手代理实现
 */
export class TextAssistantAgent extends AgentBase {
    /**
     * 构造函数
     * 
     * @param options 代理选项
     */
    constructor(options: ITextAssistantOptions) {
        super({
            ...options,
            role: TAgentRole.ASSISTANT,
            systemPrompt: options.customSystemPrompt || TextAssistantAgent.getDefaultSystemPrompt()
        });
    }
    
    /**
     * 获取默认系统提示词
     */
    private static getDefaultSystemPrompt(): string {
        return `你是一个有用的AI助手，专注于帮助用户完成各种任务。
- 保持回答简洁、准确、有帮助性
- 如果不确定，诚实地表明你的不确定性
- 当可能需要工具时，明确告知用户可用的工具
- 确保回答安全、无害，并尊重用户的隐私

你的目标是通过文本对话和工具使用协助用户解决问题。`;
    }
    
    /**
     * 初始化代理
     * 
     * @param sessionId 会话ID
     */
    async initialize(sessionId: string): Promise<void> {
        await super.initialize(sessionId);
        
        // 额外的初始化逻辑可以添加在这里
        console.log(`文本助手代理初始化: ${this.name}`);
    }
    
    /**
     * 启动代理
     */
    async start(): Promise<void> {
        await super.start();
        
        // 额外的启动逻辑可以添加在这里
        console.log(`文本助手代理已启动: ${this.name}`);
    }
    
    /**
     * 处理收到的消息
     * 
     * @param message 收到的消息
     */
    protected async handleMessage(message: TMessage): Promise<void> {
        console.log(`文本助手代理收到消息: ${this.name}`, message.type);
        
        // 根据消息类型进行处理
        switch (message.type) {
            case TMessageType.TEXT:
                await this.handleTextMessage(message as ITextMessage);
                break;
                
            case TMessageType.COMMAND:
                await this.handleCommandMessage(message as ICommandMessage);
                break;
                
            case TMessageType.TOOL_RESPONSE:
                await this.handleToolResponseMessage(message as IToolResponseMessage);
                break;
                
            default:
                // 对于不支持的消息类型，发送系统消息说明
                await this.sendSystemMessage(
                    'unsupported_message',
                    `不支持的消息类型: ${message.type}`,
                    'warning',
                    message.senderId
                );
                break;
        }
    }
    
    /**
     * 处理文本消息
     * 
     * @param message 文本消息
     */
    private async handleTextMessage(message: ITextMessage): Promise<void> {
        const { content } = message.data;
        const senderId = message.senderId;
        
        // 简单的文本回复 - 在实际实现中，这里将调用LLM获取回复
        let response = `你好，我收到了你的消息: "${content}"`;
        
        // 检查是否是关于工具的查询
        if (content.toLowerCase().includes('工具') || content.toLowerCase().includes('tool')) {
            const toolHelp = '我可以帮你使用各种工具。请告诉我你需要什么类型的工具？';
            response = toolHelp;
            
            // 这里可以添加工具推荐逻辑
        }
        
        // 发送回复
        await this.sendTextMessage(
            response,
            senderId,
            TMessagePriority.NORMAL,
            message.id
        );
    }
    
    /**
     * 处理命令消息
     * 
     * @param message 命令消息
     */
    private async handleCommandMessage(message: ICommandMessage): Promise<void> {
        const { command, args } = message.data;
        const senderId = message.senderId;
        
        switch (command) {
            case 'help':
                // 处理帮助命令
                await this.sendTextMessage(
                    `我是${this.name}，一个AI助手。我可以帮助你回答问题、使用工具和执行任务。`,
                    senderId,
                    TMessagePriority.NORMAL,
                    message.id
                );
                break;
                
            case 'use_tool':
                // 处理使用工具命令
                if (args.toolId) {
                    await this.handleToolUseCommand(args.toolId, args.params || {}, senderId, message.id);
                } else {
                    await this.sendSystemMessage(
                        'command_error',
                        '使用工具命令需要指定toolId参数',
                        'error',
                        senderId
                    );
                }
                break;
                
            default:
                // 处理未知命令
                await this.sendSystemMessage(
                    'unknown_command',
                    `未知命令: ${command}`,
                    'warning',
                    senderId
                );
                break;
        }
    }
    
    /**
     * 处理工具使用命令
     * 
     * @param toolId 工具ID
     * @param params 工具参数
     * @param senderId 发送者ID
     * @param parentId 父消息ID
     */
    private async handleToolUseCommand(
        toolId: string, 
        params: Record<string, any>, 
        senderId: string,
        parentId?: string
    ): Promise<void> {
        try {
            // 调用工具
            const result = await this.callTool(toolId, params);
            
            // 发送工具结果
            await this.sendTextMessage(
                `工具 ${toolId} 执行结果: ${JSON.stringify(result, null, 2)}`,
                senderId,
                TMessagePriority.NORMAL,
                parentId
            );
        } catch (error) {
            // 处理工具调用错误
            const errorMessage = error instanceof Error ? error.message : '未知错误';
            await this.sendSystemMessage(
                'tool_error',
                `工具调用失败: ${errorMessage}`,
                'error',
                senderId
            );
        }
    }
    
    /**
     * 处理工具响应消息
     * 
     * @param message 工具响应消息
     */
    private async handleToolResponseMessage(message: IToolResponseMessage): Promise<void> {
        const { toolId, result, success, error } = message.data;
        const senderId = message.senderId;
        
        if (success) {
            // 处理成功的工具响应
            await this.sendTextMessage(
                `工具 ${toolId} 执行成功，结果: ${JSON.stringify(result, null, 2)}`,
                senderId,
                TMessagePriority.NORMAL,
                message.id
            );
        } else {
            // 处理失败的工具响应
            await this.sendSystemMessage(
                'tool_response_error',
                `工具 ${toolId} 执行失败: ${error || '未知错误'}`,
                'error',
                senderId
            );
        }
    }
} 