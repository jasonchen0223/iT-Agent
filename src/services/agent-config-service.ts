/**
 * 代理配置服务
 * 
 * 管理代理的配置信息，包括系统提示语、工具列表、权限等
 */
import { v4 as uuidv4 } from 'uuid';
import { TAgentRole, TAgentModel } from '@/types/agent-types';

/**
 * 代理权限配置
 */
export interface IAgentPermission {
    /**
     * 可访问的工具ID列表
     */
    allowedTools: string[];
    
    /**
     * 可发送消息的代理ID列表
     */
    allowedRecipients: string[];
    
    /**
     * 最大并发消息数
     */
    maxConcurrentMessages?: number;
    
    /**
     * 最大工具调用次数
     */
    maxToolCalls?: number;
    
    /**
     * 是否可以创建新会话
     */
    canCreateSession?: boolean;
    
    /**
     * 是否可以结束会话
     */
    canEndSession?: boolean;
    
    /**
     * 是否有管理员权限
     */
    isAdmin?: boolean;
}

/**
 * 代理界面配置
 */
export interface IAgentUiConfig {
    /**
     * 头像URL
     */
    avatarUrl?: string;
    
    /**
     * 主题色
     */
    themeColor?: string;
    
    /**
     * 颜色模式
     */
    colorMode?: 'light' | 'dark' | 'system';
    
    /**
     * 消息气泡样式
     */
    messageBubbleStyle?: 'rounded' | 'sharp' | 'chat';
    
    /**
     * 是否显示时间戳
     */
    showTimestamp?: boolean;
    
    /**
     * 是否显示头像
     */
    showAvatar?: boolean;
    
    /**
     * 定制CSS
     */
    customCss?: string;
}

/**
 * 代理行为配置
 */
export interface IAgentBehaviorConfig {
    /**
     * 思考速度 (0-10)
     * 0: 非常快，几乎没有思考
     * 10: 非常慢，深度思考
     */
    thinkingSpeed?: number;
    
    /**
     * 主动性 (0-10)
     * 0: 完全被动，只回应直接问题
     * 10: 非常主动，积极提问和引导对话
     */
    proactivity?: number;
    
    /**
     * 创造性 (0-10)
     * 0: 非常保守，只提供已知事实
     * 10: 非常创造性，提供新颖的见解和想法
     */
    creativity?: number;
    
    /**
     * 协作性 (0-10)
     * 0: 独立工作，很少寻求帮助
     * 10: 高度协作，频繁与其他代理交流
     */
    collaboration?: number;
    
    /**
     * 决策速度 (0-10)
     * 0: 快速决策，可能准确性较低
     * 10: 谨慎决策，收集更多信息后再行动
     */
    decisionSpeed?: number;
}

/**
 * 模型配置
 */
export interface IModelConfig {
    /**
     * 模型名称
     */
    modelName: TAgentModel;
    
    /**
     * 温度参数 (0-1)
     */
    temperature?: number;
    
    /**
     * 最大标记数
     */
    maxTokens?: number;
    
    /**
     * 存在惩罚
     */
    presencePenalty?: number;
    
    /**
     * 频率惩罚
     */
    frequencyPenalty?: number;
    
    /**
     * 停止序列
     */
    stopSequences?: string[];
    
    /**
     * 附加指令
     */
    additionalInstructions?: string;
}

/**
 * 代理配置接口
 */
export interface IAgentConfig {
    /**
     * 配置ID
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
     * 系统提示语
     */
    systemPrompt: string;
    
    /**
     * 可用工具ID列表
     */
    tools: string[];
    
    /**
     * 权限配置
     */
    permissions: IAgentPermission;
    
    /**
     * 界面配置
     */
    uiConfig?: IAgentUiConfig;
    
    /**
     * 行为配置
     */
    behaviorConfig?: IAgentBehaviorConfig;
    
    /**
     * 模型配置
     */
    modelConfig: IModelConfig;
    
    /**
     * 元数据
     */
    metadata?: Record<string, any>;
    
    /**
     * 创建时间
     */
    createdAt: Date;
    
    /**
     * 更新时间
     */
    updatedAt: Date;
    
    /**
     * 创建者ID
     */
    createdBy?: string;
}

/**
 * 代理配置过滤条件
 */
export interface IAgentConfigFilter {
    /**
     * 角色
     */
    role?: TAgentRole;
    
    /**
     * 名称
     */
    name?: string;
    
    /**
     * 工具ID
     */
    toolId?: string;
    
    /**
     * 创建者ID
     */
    createdBy?: string;
}

/**
 * 代理配置服务类
 * 
 * 负责管理代理配置
 */
export class AgentConfigService {
    /**
     * 配置列表
     */
    private configs: Map<string, IAgentConfig> = new Map();
    
    /**
     * 配置模板列表
     */
    private templates: Map<string, IAgentConfig> = new Map();
    
    /**
     * 单例实例
     */
    private static instance: AgentConfigService;
    
    /**
     * 获取服务实例
     */
    public static getInstance(): AgentConfigService {
        if (!AgentConfigService.instance) {
            AgentConfigService.instance = new AgentConfigService();
        }
        return AgentConfigService.instance;
    }
    
    /**
     * 私有构造函数
     */
    private constructor() {
        console.log('代理配置服务初始化');
        this.initializeDefaultTemplates();
    }
    
    /**
     * 初始化默认模板
     */
    private initializeDefaultTemplates(): void {
        // 助手模板
        const assistantTemplate: IAgentConfig = {
            id: 'template-assistant',
            name: '通用助手',
            description: '一个通用的AI助手，可以回答问题和完成任务',
            role: TAgentRole.ASSISTANT,
            systemPrompt: '你是一个有用的AI助手。你的任务是理解用户的请求并提供有帮助的回答。',
            tools: [],
            permissions: {
                allowedTools: [],
                allowedRecipients: [],
                maxConcurrentMessages: 10,
                maxToolCalls: 50,
                canCreateSession: false,
                canEndSession: false,
                isAdmin: false
            },
            modelConfig: {
                modelName: TAgentModel.GPT_3_5_TURBO,
                temperature: 0.7,
                maxTokens: 1024
            },
            uiConfig: {
                themeColor: '#5E81AC',
                colorMode: 'system',
                messageBubbleStyle: 'rounded',
                showTimestamp: true,
                showAvatar: true
            },
            behaviorConfig: {
                thinkingSpeed: 5,
                proactivity: 6,
                creativity: 7,
                collaboration: 8,
                decisionSpeed: 5
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        // 专家模板
        const expertTemplate: IAgentConfig = {
            id: 'template-expert',
            name: '领域专家',
            description: '一个专注于特定领域的专家代理',
            role: TAgentRole.EXPERT,
            systemPrompt: '你是一个专注于特定领域的专家。你的任务是提供深入、专业的建议和见解。',
            tools: [],
            permissions: {
                allowedTools: [],
                allowedRecipients: [],
                maxConcurrentMessages: 5,
                maxToolCalls: 30,
                canCreateSession: false,
                canEndSession: false,
                isAdmin: false
            },
            modelConfig: {
                modelName: TAgentModel.GPT_4,
                temperature: 0.5,
                maxTokens: 2048
            },
            uiConfig: {
                themeColor: '#B48EAD',
                colorMode: 'system',
                messageBubbleStyle: 'sharp',
                showTimestamp: true,
                showAvatar: true
            },
            behaviorConfig: {
                thinkingSpeed: 8,
                proactivity: 4,
                creativity: 5,
                collaboration: 6,
                decisionSpeed: 7
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        // 协调者模板
        const coordinatorTemplate: IAgentConfig = {
            id: 'template-coordinator',
            name: '任务协调者',
            description: '一个协调多个代理工作的管理代理',
            role: TAgentRole.COORDINATOR,
            systemPrompt: '你是一个团队协调者。你的任务是管理和协调多个代理的工作，确保任务高效完成。',
            tools: [],
            permissions: {
                allowedTools: [],
                allowedRecipients: [],
                maxConcurrentMessages: 20,
                maxToolCalls: 100,
                canCreateSession: true,
                canEndSession: true,
                isAdmin: true
            },
            modelConfig: {
                modelName: TAgentModel.GPT_4,
                temperature: 0.3,
                maxTokens: 2048
            },
            uiConfig: {
                themeColor: '#81A1C1',
                colorMode: 'system',
                messageBubbleStyle: 'chat',
                showTimestamp: true,
                showAvatar: true
            },
            behaviorConfig: {
                thinkingSpeed: 6,
                proactivity: 9,
                creativity: 6,
                collaboration: 10,
                decisionSpeed: 8
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        // 用户代理模板
        const userProxyTemplate: IAgentConfig = {
            id: 'template-user-proxy',
            name: '用户代理',
            description: '代表用户与其他代理交互的代理',
            role: TAgentRole.USER_PROXY,
            systemPrompt: '你是用户的代理。你的任务是代表用户与其他代理交互，理解用户意图并传达给团队。',
            tools: [],
            permissions: {
                allowedTools: [],
                allowedRecipients: [],
                maxConcurrentMessages: 15,
                maxToolCalls: 50,
                canCreateSession: true,
                canEndSession: true,
                isAdmin: false
            },
            modelConfig: {
                modelName: TAgentModel.GPT_3_5_TURBO,
                temperature: 0.6,
                maxTokens: 1024
            },
            uiConfig: {
                themeColor: '#A3BE8C',
                colorMode: 'system',
                messageBubbleStyle: 'rounded',
                showTimestamp: true,
                showAvatar: true
            },
            behaviorConfig: {
                thinkingSpeed: 3,
                proactivity: 7,
                creativity: 5,
                collaboration: 9,
                decisionSpeed: 4
            },
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        // 添加模板
        this.templates.set(assistantTemplate.id, assistantTemplate);
        this.templates.set(expertTemplate.id, expertTemplate);
        this.templates.set(coordinatorTemplate.id, coordinatorTemplate);
        this.templates.set(userProxyTemplate.id, userProxyTemplate);
    }
    
    /**
     * 创建代理配置
     * 
     * @param config 配置信息
     * @returns 新配置ID
     */
    public createConfig(config: Omit<IAgentConfig, 'id' | 'createdAt' | 'updatedAt'>): string {
        const id = uuidv4();
        const now = new Date();
        
        const newConfig: IAgentConfig = {
            ...config,
            id,
            createdAt: now,
            updatedAt: now
        };
        
        this.configs.set(id, newConfig);
        return id;
    }
    
    /**
     * 从模板创建配置
     * 
     * @param templateId 模板ID
     * @param overrides 覆盖值
     * @returns 新配置ID
     */
    public createFromTemplate(
        templateId: string,
        overrides: Partial<IAgentConfig> = {}
    ): string {
        const template = this.templates.get(templateId);
        
        if (!template) {
            throw new Error(`模板不存在: ${templateId}`);
        }
        
        const id = uuidv4();
        const now = new Date();
        
        const newConfig: IAgentConfig = {
            ...template,
            ...overrides,
            id,
            createdAt: now,
            updatedAt: now
        };
        
        this.configs.set(id, newConfig);
        return id;
    }
    
    /**
     * 更新代理配置
     * 
     * @param id 配置ID
     * @param updates 更新信息
     * @returns 更新后的配置
     */
    public updateConfig(id: string, updates: Partial<IAgentConfig>): IAgentConfig {
        const config = this.configs.get(id);
        
        if (!config) {
            throw new Error(`配置不存在: ${id}`);
        }
        
        const updatedConfig: IAgentConfig = {
            ...config,
            ...updates,
            id,
            updatedAt: new Date()
        };
        
        this.configs.set(id, updatedConfig);
        return updatedConfig;
    }
    
    /**
     * 获取代理配置
     * 
     * @param id 配置ID
     * @returns 配置信息
     */
    public getConfig(id: string): IAgentConfig | null {
        return this.configs.get(id) || null;
    }
    
    /**
     * 删除代理配置
     * 
     * @param id 配置ID
     * @returns 是否成功删除
     */
    public deleteConfig(id: string): boolean {
        return this.configs.delete(id);
    }
    
    /**
     * 获取所有配置
     * 
     * @param filter 过滤条件
     * @returns 配置列表
     */
    public getAllConfigs(filter?: IAgentConfigFilter): IAgentConfig[] {
        const configs = Array.from(this.configs.values());
        
        if (!filter) {
            return configs;
        }
        
        return configs.filter(config => {
            // 角色过滤
            if (filter.role && config.role !== filter.role) {
                return false;
            }
            
            // 名称过滤
            if (filter.name && !config.name.includes(filter.name)) {
                return false;
            }
            
            // 工具ID过滤
            if (filter.toolId && !config.tools.includes(filter.toolId)) {
                return false;
            }
            
            // 创建者ID过滤
            if (filter.createdBy && config.createdBy !== filter.createdBy) {
                return false;
            }
            
            return true;
        });
    }
    
    /**
     * 获取所有模板
     * 
     * @returns 模板列表
     */
    public getAllTemplates(): IAgentConfig[] {
        return Array.from(this.templates.values());
    }
    
    /**
     * 获取模板
     * 
     * @param id 模板ID
     * @returns 模板信息
     */
    public getTemplate(id: string): IAgentConfig | null {
        return this.templates.get(id) || null;
    }
    
    /**
     * 创建模板
     * 
     * @param template 模板信息
     * @returns 新模板ID
     */
    public createTemplate(template: Omit<IAgentConfig, 'createdAt' | 'updatedAt'>): string {
        const now = new Date();
        
        const newTemplate: IAgentConfig = {
            ...template,
            createdAt: now,
            updatedAt: now
        };
        
        this.templates.set(template.id, newTemplate);
        return template.id;
    }
    
    /**
     * 复制现有配置为模板
     * 
     * @param configId 配置ID
     * @param templateName 模板名称
     * @returns 新模板ID
     */
    public saveAsTemplate(configId: string, templateName: string): string {
        const config = this.configs.get(configId);
        
        if (!config) {
            throw new Error(`配置不存在: ${configId}`);
        }
        
        const templateId = `template-${uuidv4()}`;
        const now = new Date();
        
        const newTemplate: IAgentConfig = {
            ...config,
            id: templateId,
            name: templateName,
            createdAt: now,
            updatedAt: now,
            metadata: {
                ...config.metadata,
                sourceConfigId: configId
            }
        };
        
        this.templates.set(templateId, newTemplate);
        return templateId;
    }
    
    /**
     * 删除模板
     * 
     * @param id 模板ID
     * @returns 是否成功删除
     */
    public deleteTemplate(id: string): boolean {
        return this.templates.delete(id);
    }
}

/**
 * 代理配置服务实例
 */
export const agentConfigService = AgentConfigService.getInstance(); 