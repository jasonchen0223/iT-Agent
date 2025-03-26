/**
 * 代理服务模块
 * 
 * 提供代理管理与实例化功能
 */
import { v4 as uuidv4 } from 'uuid';
import { IAgent, IAgentConfig, IAgentMessage, TAgentRole, TAgentStatus } from '@/types/agent';
import { executePythonScript } from './python-bridge';
import path from 'path';
import { messageRouter } from '@/features/message-router';
import { prisma } from './db';

/**
 * 会话配置接口
 */
export interface ISessionConfig {
    /**
     * 会话ID
     */
    id: string;
    /**
     * 会话名称
     */
    name: string;
    /**
     * 会话描述
     */
    description?: string;
    /**
     * 会话中的代理配置列表
     */
    agents: IAgentConfig[];
    /**
     * 最大对话轮次
     */
    maxRounds?: number;
    /**
     * 创建时间
     */
    createdAt: Date;
}

/**
 * 代理服务类
 */
class AgentService {
    /**
     * 代理实例映射表
     */
    private agents: Map<string, IAgent> = new Map();
    
    /**
     * 会话配置映射表
     */
    private sessions: Map<string, ISessionConfig> = new Map();
    
    /**
     * 初始化代理服务
     */
    async initialize(): Promise<boolean> {
        try {
            // 检查AutoGen安装状态
            const scriptPath = path.join(process.cwd(), 'scripts/python/agents.py');
            const result = await executePythonScript(scriptPath, ['check_installation']);
            
            if (!result.success) {
                console.error('AutoGen检查失败:', result.error);
                return false;
            }
            
            console.log('AutoGen初始化成功:', result.result);
            return true;
        } catch (error) {
            console.error('代理服务初始化失败:', error);
            return false;
        }
    }
    
    /**
     * 创建新会话
     * 
     * @param {Partial<ISessionConfig>} config - 会话配置
     * @returns {string} 会话ID
     */
    createSession(config: Partial<ISessionConfig> = {}): string {
        const sessionId = config.id || uuidv4();
        
        // 创建默认代理配置
        const defaultAgents = this.getDefaultAgents(sessionId);
        
        // 合并配置
        const sessionConfig: ISessionConfig = {
            id: sessionId,
            name: config.name || `会话 ${new Date().toLocaleString('zh-CN')}`,
            description: config.description,
            agents: config.agents || defaultAgents,
            maxRounds: config.maxRounds || 10,
            createdAt: new Date(),
        };
        
        // 存储会话配置
        this.sessions.set(sessionId, sessionConfig);
        
        // 初始化会话中的代理
        sessionConfig.agents.forEach(agentConfig => {
            const agent = this.createAgentInstance(agentConfig);
            this.agents.set(agent.id, agent);
        });
        
        return sessionId;
    }
    
    /**
     * 获取会话配置
     * 
     * @param {string} sessionId - 会话ID
     * @returns {ISessionConfig | null} 会话配置
     */
    getSession(sessionId: string): ISessionConfig | null {
        return this.sessions.get(sessionId) || null;
    }
    
    /**
     * 获取所有会话
     * 
     * @returns {ISessionConfig[]} 会话配置列表
     */
    getAllSessions(): ISessionConfig[] {
        return Array.from(this.sessions.values());
    }
    
    /**
     * 获取代理实例
     * 
     * @param {string} agentId - 代理ID
     * @returns {IAgent | null} 代理实例
     */
    getAgent(agentId: string): IAgent | null {
        return this.agents.get(agentId) || null;
    }
    
    /**
     * 获取会话中的所有代理
     * 
     * @param {string} sessionId - 会话ID
     * @returns {IAgent[]} 代理实例列表
     */
    getSessionAgents(sessionId: string): IAgent[] {
        const session = this.getSession(sessionId);
        if (!session) {
            return [];
        }
        
        return session.agents
            .map(config => this.getAgent(config.id))
            .filter(agent => agent !== null) as IAgent[];
    }
    
    /**
     * 启动Python AutoGen会话
     * 
     * @param {string} sessionId - 会话ID
     * @param {string} query - 用户查询
     * @returns {Promise<any>} 会话结果
     */
    async startPythonAutoGenSession(sessionId: string, query: string): Promise<any> {
        try {
            const session = this.getSession(sessionId);
            if (!session) {
                throw new Error(`会话不存在: ${sessionId}`);
            }
            
            // 调用Python的AutoGen处理会话
            const scriptPath = path.join(process.cwd(), 'scripts/python/agents.py');
            
            // 序列化会话配置为JSON字符串
            const sessionConfig = JSON.stringify(session);
            
            const result = await executePythonScript(
                scriptPath, 
                ['run_conversation', query, sessionConfig]
            );
            
            if (!result.success) {
                throw new Error(`AutoGen会话执行失败: ${result.error}`);
            }
            
            return result.result;
        } catch (error) {
            console.error('启动Python AutoGen会话失败:', error);
            throw error;
        }
    }

    /**
     * 发送消息
     * 
     * @param {string} senderId - 发送者ID
     * @param {string} receiverId - 接收者ID
     * @param {string} content - 消息内容
     * @param {TMessageType} type - 消息类型
     * @returns {Promise<IAgentMessage>} 发送的消息
     */
    async sendMessage(senderId: string, receiverId: string, content: string, type: 'text' | 'code' | 'tool_call' | 'tool_result' | 'error' = 'text'): Promise<IAgentMessage> {
        const sender = this.getAgent(senderId);
        if (!sender) {
            throw new Error(`发送者不存在: ${senderId}`);
        }

        const receiver = this.getAgent(receiverId);
        if (!receiver) {
            throw new Error(`接收者不存在: ${receiverId}`);
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

        // 通过消息路由器路由消息
        await messageRouter.routeMessage(message);

        return message;
    }

    /**
     * 创建代理实例
     * 
     * @param {IAgentConfig} config - 代理配置
     * @returns {IAgent} 代理实例
     */
    createAgentInstance(config: IAgentConfig): IAgent {
        const id = config.id || uuidv4();
        
        // 创建基础代理实例
        const agent: IAgent = {
            id,
            name: config.name,
            role: config.role,
            description: config.description,
            systemMessage: config.systemMessage,
            icon: config.icon || this.getDefaultIconForRole(config.role),
            color: config.color || this.getDefaultColorForRole(config.role),
            model: config.model,
            temperature: config.temperature,
            maxTokens: config.maxTokens,
            
            // 添加方法
            sendMessage: async (content, receiverId) => {
                return await this.sendMessage(id, receiverId, content);
            },
            
            receiveMessage: async (message) => {
                console.log(`代理 ${config.name} 接收消息:`, message);
                // 这里将扩展以实现消息处理逻辑
            },
            
            callTool: async (toolName, parameters) => {
                console.log(`代理 ${config.name} 调用工具 ${toolName}:`, parameters);
                // 这里将扩展以实现工具调用逻辑
                return { success: true, result: { toolName, timestamp: new Date().toISOString() } };
            }
        };
        
        return agent;
    }

    /**
     * 获取角色默认图标
     * 
     * @param {TAgentRole} role - 代理角色
     * @returns {string} 图标名称
     */
    getDefaultIconForRole(role: TAgentRole): string {
        const iconMap: Record<TAgentRole, string> = {
            [TAgentRole.USER]: 'user',
            [TAgentRole.ASSISTANT]: 'assistant',
            [TAgentRole.ORCHESTRATOR]: 'orchestrator',
            [TAgentRole.CODER]: 'code',
            [TAgentRole.REVIEWER]: 'eye',
            [TAgentRole.TESTER]: 'test-tube',
            [TAgentRole.EXECUTOR]: 'play',
            [TAgentRole.RESEARCHER]: 'search',
            [TAgentRole.PLANNER]: 'clipboard-list',
            [TAgentRole.CUSTOM]: 'sparkles',
        };
        
        return iconMap[role] || 'question-mark';
    }

    /**
     * 获取角色默认颜色
     * 
     * @param {TAgentRole} role - 代理角色
     * @returns {string} 颜色值
     */
    getDefaultColorForRole(role: TAgentRole): string {
        const colorMap: Record<TAgentRole, string> = {
            [TAgentRole.USER]: '#3B82F6', // blue-500
            [TAgentRole.ASSISTANT]: '#8B5CF6', // violet-500
            [TAgentRole.ORCHESTRATOR]: '#EC4899', // pink-500
            [TAgentRole.CODER]: '#10B981', // emerald-500
            [TAgentRole.REVIEWER]: '#F59E0B', // amber-500
            [TAgentRole.TESTER]: '#6366F1', // indigo-500
            [TAgentRole.EXECUTOR]: '#EF4444', // red-500
            [TAgentRole.RESEARCHER]: '#8B5CF6', // violet-500
            [TAgentRole.PLANNER]: '#14B8A6', // teal-500
            [TAgentRole.CUSTOM]: '#6366F1', // indigo-500
        };
        
        return colorMap[role] || '#6B7280'; // gray-500
    }

    /**
     * 获取默认代理配置
     * 
     * @param {string} sessionId - 会话ID
     * @returns {IAgentConfig[]} 默认代理配置列表
     */
    private getDefaultAgents(sessionId: string): IAgentConfig[] {
        return [
            {
                id: `${sessionId}_user`,
                name: '用户',
                role: TAgentRole.USER,
                description: '代表系统用户的代理',
                systemMessage: '你是用户，你可以提出任务需求，并接收完成结果。',
                icon: 'user',
                color: '#3B82F6',
            },
            {
                id: `${sessionId}_assistant`,
                name: '助手',
                role: TAgentRole.ASSISTANT,
                description: '主要的AI助手代理，与用户直接对话',
                systemMessage: '你是一个智能助手，你的任务是理解用户需求，并协调其他代理共同完成任务。你可以直接回答简单问题，或者将复杂任务分解并交给适当的专家代理。',
                icon: 'assistant',
                color: '#8B5CF6',
                model: 'gpt-4',
                temperature: 0.2,
            },
            {
                id: `${sessionId}_planner`,
                name: '规划者',
                role: TAgentRole.PLANNER,
                description: '负责任务分解和规划的代理',
                systemMessage: '你是规划专家，你的任务是：\n1. 分析用户提出的复杂任务\n2. 将任务分解为可管理的子任务\n3. 为每个子任务分配适当的执行者\n4. 制定任务执行计划，包括顺序和依赖关系',
                icon: 'clipboard-list',
                color: '#14B8A6',
                model: 'gpt-4',
                temperature: 0.2,
            },
            {
                id: `${sessionId}_executor`,
                name: '执行者',
                role: TAgentRole.EXECUTOR,
                description: '负责执行具体操作的代理',
                systemMessage: '你是执行专家，你的任务是：\n1. 接收规划者分配的具体子任务\n2. 使用适当的工具和方法执行任务\n3. 报告执行结果和状态\n4. 处理执行过程中的异常情况',
                icon: 'play',
                color: '#EF4444',
                model: 'gpt-4',
                temperature: 0.2,
            }
        ];
    }

    /**
     * 创建代理配置
     * 
     * @param {IAgentConfig} config - 代理配置
     * @param {string} userId - 用户ID
     * @returns {Promise<IAgentConfig>} 创建的代理配置
     */
    async createAgentConfig(config: IAgentConfig, userId: string): Promise<IAgentConfig> {
        const agentConfig = await prisma.agentConfig.create({
            data: {
                name: config.name,
                role: config.role,
                description: config.description,
                systemMessage: config.systemMessage,
                icon: config.icon || this.getDefaultIconForRole(config.role),
                color: config.color || this.getDefaultColorForRole(config.role),
                model: config.model,
                temperature: config.temperature,
                maxTokens: config.maxTokens,
                createdBy: userId,
            }
        });
        
        return {
            id: agentConfig.id,
            name: agentConfig.name,
            role: agentConfig.role as TAgentRole,
            description: agentConfig.description,
            systemMessage: agentConfig.systemMessage,
            icon: agentConfig.icon || '',
            color: agentConfig.color || '',
            model: agentConfig.model || undefined,
            temperature: agentConfig.temperature || undefined,
            maxTokens: agentConfig.maxTokens || undefined,
        };
    }

    /**
     * 获取代理配置
     * 
     * @param {string} configId - 配置ID
     * @returns {Promise<IAgentConfig | null>} 代理配置
     */
    async getAgentConfig(configId: string): Promise<IAgentConfig | null> {
        const config = await prisma.agentConfig.findUnique({
            where: { id: configId }
        });
        
        if (!config) {
            return null;
        }
        
        return {
            id: config.id,
            name: config.name,
            role: config.role as TAgentRole,
            description: config.description,
            systemMessage: config.systemMessage,
            icon: config.icon || '',
            color: config.color || '',
            model: config.model || undefined,
            temperature: config.temperature || undefined,
            maxTokens: config.maxTokens || undefined,
        };
    }

    /**
     * 获取用户的所有代理配置
     * 
     * @param {string} userId - 用户ID
     * @returns {Promise<IAgentConfig[]>} 代理配置列表
     */
    async getUserAgentConfigs(userId: string): Promise<IAgentConfig[]> {
        const configs = await prisma.agentConfig.findMany({
            where: { createdBy: userId }
        });
        
        return configs.map(config => ({
            id: config.id,
            name: config.name,
            role: config.role as TAgentRole,
            description: config.description,
            systemMessage: config.systemMessage,
            icon: config.icon || '',
            color: config.color || '',
            model: config.model || undefined,
            temperature: config.temperature || undefined,
            maxTokens: config.maxTokens || undefined,
        }));
    }

    /**
     * 更新代理配置
     * 
     * @param {string} configId - 配置ID
     * @param {Partial<IAgentConfig>} updates - 更新内容
     * @returns {Promise<IAgentConfig>} 更新后的配置
     */
    async updateAgentConfig(configId: string, updates: Partial<IAgentConfig>): Promise<IAgentConfig> {
        const config = await prisma.agentConfig.update({
            where: { id: configId },
            data: {
                name: updates.name,
                role: updates.role,
                description: updates.description,
                systemMessage: updates.systemMessage,
                icon: updates.icon,
                color: updates.color,
                model: updates.model,
                temperature: updates.temperature,
                maxTokens: updates.maxTokens,
            }
        });
        
        return {
            id: config.id,
            name: config.name,
            role: config.role as TAgentRole,
            description: config.description,
            systemMessage: config.systemMessage,
            icon: config.icon || '',
            color: config.color || '',
            model: config.model || undefined,
            temperature: config.temperature || undefined,
            maxTokens: config.maxTokens || undefined,
        };
    }

    /**
     * 删除代理配置
     * 
     * @param {string} configId - 配置ID
     * @returns {Promise<boolean>} 删除结果
     */
    async deleteAgentConfig(configId: string): Promise<boolean> {
        try {
            await prisma.agentConfig.delete({
                where: { id: configId }
            });
            return true;
        } catch (error) {
            console.error('删除代理配置失败:', error);
            return false;
        }
    }
}

// 创建代理服务单例
export const agentService = new AgentService();

export default agentService; 