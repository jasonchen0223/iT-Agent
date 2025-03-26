/**
 * 代理工厂服务
 * 
 * 提供创建和获取各种类型代理的功能
 */
import { IAgent, TAgentRole, TAgentModel } from '@/types/agent-types';
import { TextAssistantAgent, ITextAssistantOptions } from './text-assistant-agent';
import { AgentBase, IAgentOptions } from './agent-base-service';

/**
 * 代理创建选项
 */
export interface IAgentCreateOptions {
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
    systemPrompt?: string;
    
    /**
     * 代理配置
     */
    config?: Record<string, any>;
}

/**
 * 代理类型映射接口
 */
interface IAgentTypeMap {
    [key: string]: {
        /**
         * 代理类
         */
        AgentClass: typeof AgentBase;
        
        /**
         * 默认系统提示词
         */
        defaultSystemPrompt?: string;
    };
}

/**
 * 代理工厂服务类
 */
export class AgentFactoryService {
    /**
     * 代理映射表 (ID -> 代理实例)
     */
    private agents: Map<string, IAgent> = new Map();
    
    /**
     * 代理类型映射
     */
    private agentTypes: IAgentTypeMap = {};
    
    /**
     * 单例实例
     */
    private static instance: AgentFactoryService;
    
    /**
     * 获取服务实例
     */
    public static getInstance(): AgentFactoryService {
        if (!AgentFactoryService.instance) {
            AgentFactoryService.instance = new AgentFactoryService();
        }
        return AgentFactoryService.instance;
    }
    
    /**
     * 私有构造函数
     */
    private constructor() {
        this.registerDefaultAgentTypes();
        console.log('代理工厂服务初始化');
    }
    
    /**
     * 注册默认代理类型
     */
    private registerDefaultAgentTypes(): void {
        // 注册文本助手代理
        this.registerAgentType('text_assistant', TextAssistantAgent);
        
        // TODO: 注册更多代理类型
    }
    
    /**
     * 注册代理类型
     * 
     * @param typeName 类型名称
     * @param AgentClass 代理类
     * @param defaultSystemPrompt 默认系统提示词
     */
    public registerAgentType(
        typeName: string,
        AgentClass: typeof AgentBase,
        defaultSystemPrompt?: string
    ): void {
        this.agentTypes[typeName] = {
            AgentClass,
            defaultSystemPrompt
        };
        console.log(`注册代理类型: ${typeName}`);
    }
    
    /**
     * 创建代理
     * 
     * @param typeName 代理类型名称
     * @param options 代理创建选项
     * @returns 代理实例
     */
    public createAgent(typeName: string, options: IAgentCreateOptions): IAgent {
        const typeInfo = this.agentTypes[typeName];
        
        if (!typeInfo) {
            throw new Error(`未知代理类型: ${typeName}`);
        }
        
        const { AgentClass, defaultSystemPrompt } = typeInfo;
        
        // 准备代理选项
        const agentOptions: IAgentOptions = {
            name: options.name,
            description: options.description,
            role: options.role,
            customRoleName: options.customRoleName,
            model: options.model,
            customModelName: options.customModelName,
            systemPrompt: options.systemPrompt || defaultSystemPrompt || '',
            config: options.config || {}
        };
        
        // 创建代理实例
        const agent = new AgentClass(agentOptions);
        
        // 保存到映射表
        this.agents.set(agent.id, agent);
        
        console.log(`创建代理: ${agent.id} - ${options.name} (${typeName})`);
        return agent;
    }
    
    /**
     * 创建文本助手代理
     * 
     * @param options 代理创建选项
     * @returns 文本助手代理实例
     */
    public createTextAssistant(options: Omit<IAgentCreateOptions, 'role'>): TextAssistantAgent {
        const textAssistantOptions: ITextAssistantOptions = {
            name: options.name,
            description: options.description,
            model: options.model,
            customModelName: options.customModelName,
            customSystemPrompt: options.systemPrompt,
            config: options.config || {}
        };
        
        const agent = new TextAssistantAgent(textAssistantOptions);
        
        // 保存到映射表
        this.agents.set(agent.id, agent);
        
        console.log(`创建文本助手代理: ${agent.id} - ${options.name}`);
        return agent;
    }
    
    /**
     * 获取代理
     * 
     * @param agentId 代理ID
     * @returns 代理实例
     */
    public getAgent(agentId: string): IAgent {
        const agent = this.agents.get(agentId);
        
        if (!agent) {
            throw new Error(`代理不存在: ${agentId}`);
        }
        
        return agent;
    }
    
    /**
     * 获取所有代理
     * 
     * @returns 代理列表
     */
    public getAllAgents(): IAgent[] {
        return Array.from(this.agents.values());
    }
    
    /**
     * 移除代理
     * 
     * @param agentId 代理ID
     */
    public async removeAgent(agentId: string): Promise<void> {
        const agent = this.getAgent(agentId);
        
        try {
            // 尝试终止代理
            await agent.terminate();
        } catch (error) {
            console.error(`终止代理失败: ${agentId}`, error);
        }
        
        // 从映射表中移除
        this.agents.delete(agentId);
        console.log(`移除代理: ${agentId}`);
    }
    
    /**
     * 获取可用代理类型
     * 
     * @returns 类型名称列表
     */
    public getAvailableAgentTypes(): string[] {
        return Object.keys(this.agentTypes);
    }
}

/**
 * 代理工厂服务实例
 */
export const agentFactoryService = AgentFactoryService.getInstance(); 