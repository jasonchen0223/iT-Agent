/**
 * 代理能力注册服务
 * 
 * 提供代理能力的注册、管理和检索功能
 */
import { v4 as uuidv4 } from 'uuid';
import { IAgentCapability } from '@/types/agent-types';
import { TTool } from '@/types/tool-types';
import { toolService } from './tool-service';

/**
 * 能力类型枚举
 */
export enum CapabilityType {
    /**
     * 工具能力 - 基于工具调用的能力
     */
    TOOL = 'tool',
    
    /**
     * 知识能力 - 基于知识库的能力
     */
    KNOWLEDGE = 'knowledge',
    
    /**
     * 推理能力 - 基于特定推理模式的能力
     */
    REASONING = 'reasoning',
    
    /**
     * 通信能力 - 与特定系统或服务通信的能力
     */
    COMMUNICATION = 'communication',
    
    /**
     * 自定义能力 - 用户自定义能力
     */
    CUSTOM = 'custom'
}

/**
 * 能力过滤条件
 */
export interface ICapabilityFilter {
    /**
     * 能力类型
     */
    type?: CapabilityType;
    
    /**
     * 搜索关键词(匹配名称或描述)
     */
    searchQuery?: string;
    
    /**
     * 标签列表(任意一个匹配即可)
     */
    tags?: string[];
    
    /**
     * 是否只显示内置能力
     */
    builtinOnly?: boolean;
}

/**
 * 能力创建参数
 */
export interface ICapabilityCreateOptions {
    /**
     * 能力名称
     */
    name: string;
    
    /**
     * 能力描述
     */
    description: string;
    
    /**
     * 能力类型
     */
    type: CapabilityType;
    
    /**
     * 关联工具ID (如果type为TOOL)
     */
    toolId?: string;
    
    /**
     * 标签列表
     */
    tags?: string[];
    
    /**
     * 是否内置能力
     */
    isBuiltin?: boolean;
    
    /**
     * 能力参数
     */
    params?: Record<string, any>;
}

/**
 * 代理能力注册服务类
 */
export class AgentCapabilityService {
    private static instance: AgentCapabilityService;
    
    /**
     * 能力注册表
     */
    private capabilities: Map<string, IAgentCapability> = new Map();
    
    /**
     * 工具能力映射关系
     */
    private toolCapabilities: Map<string, string> = new Map(); // toolId -> capabilityId
    
    /**
     * 是否已初始化内置能力
     */
    private isInitialized: boolean = false;
    
    /**
     * 私有构造函数
     */
    private constructor() {}
    
    /**
     * 获取单例实例
     */
    public static getInstance(): AgentCapabilityService {
        if (!AgentCapabilityService.instance) {
            AgentCapabilityService.instance = new AgentCapabilityService();
        }
        return AgentCapabilityService.instance;
    }
    
    /**
     * 初始化服务
     */
    public async initialize(): Promise<void> {
        if (this.isInitialized) {
            return;
        }
        
        try {
            // 注册默认能力
            await this.registerDefaultCapabilities();
            this.isInitialized = true;
        } catch (error) {
            console.error('初始化代理能力服务失败:', error);
            throw error;
        }
    }
    
    /**
     * 注册默认能力
     */
    private async registerDefaultCapabilities(): Promise<void> {
        try {
            // 注册基于工具的默认能力
            const tools = await toolService.getAllTools();
            
            for (const tool of tools) {
                await this.registerToolAsCapability(tool);
            }
            
            // 注册基础推理能力
            this.registerCapability({
                name: '通用推理',
                description: '基础逻辑推理和问题解决能力',
                type: CapabilityType.REASONING,
                isBuiltin: true,
                tags: ['reasoning', 'logic', 'problem-solving']
            });
            
            // 注册基础知识能力
            this.registerCapability({
                name: '通用知识',
                description: '基础常识和领域知识',
                type: CapabilityType.KNOWLEDGE,
                isBuiltin: true,
                tags: ['knowledge', 'facts', 'information']
            });
            
            // 注册基础通信能力
            this.registerCapability({
                name: '代理间通信',
                description: '与其他代理进行消息交换的能力',
                type: CapabilityType.COMMUNICATION,
                isBuiltin: true,
                tags: ['communication', 'messaging']
            });
            
            console.log(`注册了 ${this.capabilities.size} 个默认能力`);
        } catch (error) {
            console.error('注册默认能力失败:', error);
            throw error;
        }
    }
    
    /**
     * 将工具注册为代理能力
     * 
     * @param tool 工具对象
     * @returns 生成的能力ID
     */
    public async registerToolAsCapability(tool: TTool): Promise<string> {
        const existingCapabilityId = this.toolCapabilities.get(tool.id);
        
        if (existingCapabilityId) {
            return existingCapabilityId;
        }
        
        const capability: IAgentCapability = {
            id: uuidv4(),
            name: `${tool.name}工具`,
            description: tool.description,
            type: CapabilityType.TOOL,
            params: {
                toolId: tool.id,
                parameters: tool.parameters
            }
        };
        
        this.capabilities.set(capability.id, capability);
        this.toolCapabilities.set(tool.id, capability.id);
        
        return capability.id;
    }
    
    /**
     * 注册新能力
     * 
     * @param options 能力创建选项
     * @returns 生成的能力ID
     */
    public registerCapability(options: ICapabilityCreateOptions): string {
        // 如果是工具类型能力，确保提供了工具ID
        if (options.type === CapabilityType.TOOL && !options.toolId) {
            throw new Error('工具类型能力必须提供toolId参数');
        }
        
        // 如果是基于工具的能力，检查工具是否已注册为能力
        if (options.type === CapabilityType.TOOL && options.toolId) {
            const existingCapabilityId = this.toolCapabilities.get(options.toolId);
            
            if (existingCapabilityId) {
                return existingCapabilityId;
            }
        }
        
        const capability: IAgentCapability = {
            id: uuidv4(),
            name: options.name,
            description: options.description,
            type: options.type,
            params: {
                ...options.params,
                toolId: options.toolId,
                tags: options.tags
            }
        };
        
        this.capabilities.set(capability.id, capability);
        
        // 如果是工具类型能力，更新工具映射
        if (options.type === CapabilityType.TOOL && options.toolId) {
            this.toolCapabilities.set(options.toolId, capability.id);
        }
        
        return capability.id;
    }
    
    /**
     * 获取能力
     * 
     * @param id 能力ID
     * @returns 能力对象或null
     */
    public getCapability(id: string): IAgentCapability | null {
        return this.capabilities.get(id) || null;
    }
    
    /**
     * 获取所有能力
     * 
     * @returns 能力对象数组
     */
    public getAllCapabilities(): IAgentCapability[] {
        return Array.from(this.capabilities.values());
    }
    
    /**
     * 搜索能力
     * 
     * @param filter 过滤条件
     * @returns 匹配的能力数组
     */
    public searchCapabilities(filter: ICapabilityFilter = {}): IAgentCapability[] {
        let result = this.getAllCapabilities();
        
        // 按类型过滤
        if (filter.type) {
            result = result.filter(cap => cap.type === filter.type);
        }
        
        // 按关键词搜索
        if (filter.searchQuery) {
            const query = filter.searchQuery.toLowerCase();
            result = result.filter(cap => 
                cap.name.toLowerCase().includes(query) || 
                cap.description.toLowerCase().includes(query)
            );
        }
        
        // 按标签过滤
        if (filter.tags && filter.tags.length > 0) {
            result = result.filter(cap => {
                const capTags = cap.params?.tags || [];
                return filter.tags!.some(tag => capTags.includes(tag));
            });
        }
        
        // 只显示内置能力
        if (filter.builtinOnly) {
            result = result.filter(cap => cap.params?.isBuiltin === true);
        }
        
        return result;
    }
    
    /**
     * 获取基于工具的能力
     * 
     * @returns 工具相关能力数组
     */
    public getToolCapabilities(): IAgentCapability[] {
        return this.getAllCapabilities().filter(cap => cap.type === CapabilityType.TOOL);
    }
    
    /**
     * 获取推理能力
     * 
     * @returns 推理相关能力数组
     */
    public getReasoningCapabilities(): IAgentCapability[] {
        return this.getAllCapabilities().filter(cap => cap.type === CapabilityType.REASONING);
    }
    
    /**
     * 获取知识能力
     * 
     * @returns 知识相关能力数组
     */
    public getKnowledgeCapabilities(): IAgentCapability[] {
        return this.getAllCapabilities().filter(cap => cap.type === CapabilityType.KNOWLEDGE);
    }
    
    /**
     * 获取通信能力
     * 
     * @returns 通信相关能力数组
     */
    public getCommunicationCapabilities(): IAgentCapability[] {
        return this.getAllCapabilities().filter(cap => cap.type === CapabilityType.COMMUNICATION);
    }
    
    /**
     * 为代理分配推荐能力
     * 
     * @param role 代理角色
     * @returns 推荐的能力ID数组
     */
    public getRecommendedCapabilitiesForRole(role: string): string[] {
        // 基于角色推荐不同的能力组合
        switch (role) {
            case 'assistant':
                return this.filterCapabilitiesByTypes([
                    CapabilityType.KNOWLEDGE,
                    CapabilityType.REASONING,
                    CapabilityType.COMMUNICATION,
                    CapabilityType.TOOL
                ]);
                
            case 'expert':
                return this.filterCapabilitiesByTypes([
                    CapabilityType.KNOWLEDGE,
                    CapabilityType.REASONING
                ]);
                
            case 'tool_user':
                return this.filterCapabilitiesByTypes([
                    CapabilityType.TOOL
                ]);
                
            case 'coordinator':
                return this.filterCapabilitiesByTypes([
                    CapabilityType.COMMUNICATION,
                    CapabilityType.REASONING
                ]);
                
            default:
                return this.filterCapabilitiesByTypes([
                    CapabilityType.KNOWLEDGE,
                    CapabilityType.COMMUNICATION
                ]);
        }
    }
    
    /**
     * 按类型过滤能力并返回ID数组
     * 
     * @param types 能力类型数组
     * @returns 能力ID数组
     */
    private filterCapabilitiesByTypes(types: CapabilityType[]): string[] {
        return this.getAllCapabilities()
            .filter(cap => types.includes(cap.type as CapabilityType))
            .map(cap => cap.id);
    }
    
    /**
     * 验证能力列表是否有效
     * 
     * @param capabilityIds 能力ID数组
     * @returns 是否全部有效
     */
    public validateCapabilities(capabilityIds: string[]): boolean {
        for (const id of capabilityIds) {
            if (!this.capabilities.has(id)) {
                return false;
            }
        }
        return true;
    }
}

// 导出服务单例
export const agentCapabilityService = AgentCapabilityService.getInstance();
export default agentCapabilityService; 