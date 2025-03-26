/**
 * 代理编排服务
 * 
 * 负责管理代理协作过程和任务分配，是多代理系统的核心控制组件
 */
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/lib/db';
import { agentCollaborationService, CollaborationStatus, CollaborationNodeType, ICollaborationNode } from '@/services/agent-collaboration-service';

/**
 * 代理类型枚举
 */
export enum AgentType {
    /**
     * 文本处理代理
     */
    TEXT = 'text',
    
    /**
     * 代码处理代理
     */
    CODE = 'code',
    
    /**
     * 数据分析代理
     */
    DATA = 'data',
    
    /**
     * 搜索代理
     */
    SEARCH = 'search',
    
    /**
     * 决策代理
     */
    DECISION = 'decision',
    
    /**
     * 监督代理
     */
    SUPERVISOR = 'supervisor',
    
    /**
     * 自定义代理
     */
    CUSTOM = 'custom'
}

/**
 * 任务状态枚举
 */
export enum TaskStatus {
    /**
     * 待分配状态
     */
    PENDING = 'pending',
    
    /**
     * 已分配状态
     */
    ASSIGNED = 'assigned',
    
    /**
     * 执行中状态
     */
    RUNNING = 'running',
    
    /**
     * 已完成状态
     */
    COMPLETED = 'completed',
    
    /**
     * 已失败状态
     */
    FAILED = 'failed',
    
    /**
     * 已取消状态
     */
    CANCELLED = 'cancelled'
}

/**
 * 任务优先级枚举
 */
export enum TaskPriority {
    /**
     * 低优先级
     */
    LOW = 'low',
    
    /**
     * 中等优先级
     */
    MEDIUM = 'medium',
    
    /**
     * 高优先级
     */
    HIGH = 'high',
    
    /**
     * 紧急优先级
     */
    URGENT = 'urgent'
}

/**
 * 协作类型枚举
 */
export enum CollaborationType {
    /**
     * 顺序执行
     */
    SEQUENTIAL = 'sequential',
    
    /**
     * 并行执行
     */
    PARALLEL = 'parallel',
    
    /**
     * 条件执行
     */
    CONDITIONAL = 'conditional',
    
    /**
     * 自适应执行
     */
    ADAPTIVE = 'adaptive'
}

/**
 * 代理任务接口
 */
export interface IAgentTask {
    /**
     * 任务ID
     */
    id: string;
    
    /**
     * 任务名称
     */
    name: string;
    
    /**
     * 任务描述
     */
    description?: string;
    
    /**
     * 任务类型
     */
    type: string;
    
    /**
     * 任务状态
     */
    status: TaskStatus;
    
    /**
     * 任务优先级
     */
    priority: TaskPriority;
    
    /**
     * 任务输入数据
     */
    inputs: Record<string, any>;
    
    /**
     * 任务输出数据
     */
    outputs?: Record<string, any>;
    
    /**
     * 分配的代理ID
     */
    assignedAgentId?: string;
    
    /**
     * 会话ID
     */
    sessionId: string;
    
    /**
     * 父任务ID
     */
    parentTaskId?: string;
    
    /**
     * 协作实例ID
     */
    collaborationInstanceId?: string;
    
    /**
     * 创建时间
     */
    createdAt: Date;
    
    /**
     * 更新时间
     */
    updatedAt: Date;
    
    /**
     * 开始时间
     */
    startTime?: Date;
    
    /**
     * 结束时间
     */
    endTime?: Date;
    
    /**
     * 任务截止时间
     */
    deadline?: Date;
    
    /**
     * 任务依赖
     */
    dependencies?: string[];
}

/**
 * 代理信息接口
 */
export interface IAgentInfo {
    /**
     * 代理ID
     */
    id: string;
    
    /**
     * 代理名称
     */
    name: string;
    
    /**
     * 代理类型
     */
    type: AgentType;
    
    /**
     * 代理描述
     */
    description?: string;
    
    /**
     * 代理配置
     */
    config: Record<string, any>;
    
    /**
     * 代理能力
     */
    capabilities: string[];
    
    /**
     * 代理状态
     */
    status: 'available' | 'busy' | 'offline';
    
    /**
     * 创建时间
     */
    createdAt: Date;
    
    /**
     * 更新时间
     */
    updatedAt: Date;
}

/**
 * 团队信息接口
 */
export interface ITeamInfo {
    /**
     * 团队ID
     */
    id: string;
    
    /**
     * 团队名称
     */
    name: string;
    
    /**
     * 团队描述
     */
    description?: string;
    
    /**
     * 团队代理列表
     */
    agents: IAgentInfo[];
}

/**
 * 编排配置接口
 */
export interface IOrchestrationConfig {
    /**
     * 最大并行任务数
     */
    maxParallelTasks: number;
    
    /**
     * 任务超时时间 (毫秒)
     */
    taskTimeout: number;
    
    /**
     * 是否启用自动扩展
     */
    enableAutoScaling: boolean;
    
    /**
     * 是否启用自适应协作
     */
    enableAdaptiveCollaboration: boolean;
    
    /**
     * 监督代理ID
     */
    supervisorAgentId?: string;
}

/**
 * 代理编排服务类
 */
export class AgentOrchestrationService {
    private static instance: AgentOrchestrationService | null = null;
    private agents: Map<string, IAgentInfo> = new Map();
    private teams: Map<string, ITeamInfo> = new Map();
    private tasks: Map<string, IAgentTask> = new Map();
    private config: IOrchestrationConfig;
    
    /**
     * 私有构造函数
     */
    private constructor() {
        // 默认配置
        this.config = {
            maxParallelTasks: 5,
            taskTimeout: 300000, // 5分钟
            enableAutoScaling: false,
            enableAdaptiveCollaboration: true
        };
        
        // 初始化
        this.initialize();
    }
    
    /**
     * 初始化方法
     */
    private async initialize(): Promise<void> {
        try {
            // 从数据库加载代理
            const agents = await prisma.agent.findMany();
            for (const agent of agents) {
                this.agents.set(agent.id, {
                    id: agent.id,
                    name: agent.name,
                    type: agent.type as AgentType,
                    description: agent.description || undefined,
                    config: JSON.parse(agent.config),
                    capabilities: agent.capabilities.split(','),
                    status: 'available',
                    createdAt: agent.createdAt,
                    updatedAt: agent.updatedAt
                });
            }
            
            // 从数据库加载团队
            const teams = await prisma.agentTeam.findMany({
                include: {
                    members: {
                        include: {
                            agent: true
                        }
                    }
                }
            });
            
            for (const team of teams) {
                const teamAgents: IAgentInfo[] = [];
                
                for (const member of team.members) {
                    const agent = this.agents.get(member.agentId);
                    if (agent) {
                        teamAgents.push(agent);
                    }
                }
                
                this.teams.set(team.id, {
                    id: team.id,
                    name: team.name,
                    description: team.description || undefined,
                    agents: teamAgents
                });
            }
            
            console.log(`已加载 ${this.agents.size} 个代理和 ${this.teams.size} 个团队`);
        } catch (error) {
            console.error('代理编排服务初始化失败:', error);
        }
    }
    
    /**
     * 获取单例实例
     * 
     * @returns 代理编排服务实例
     */
    public static getInstance(): AgentOrchestrationService {
        if (!AgentOrchestrationService.instance) {
            AgentOrchestrationService.instance = new AgentOrchestrationService();
        }
        return AgentOrchestrationService.instance;
    }
    
    /**
     * 创建代理
     * 
     * @param name 代理名称
     * @param type 代理类型
     * @param config 代理配置
     * @param capabilities 代理能力
     * @param description 代理描述
     * @returns 创建的代理信息
     */
    public async createAgent(
        name: string,
        type: AgentType,
        config: Record<string, any>,
        capabilities: string[],
        description?: string
    ): Promise<IAgentInfo> {
        const id = uuidv4();
        const now = new Date();
        
        const agent: IAgentInfo = {
            id,
            name,
            type,
            description,
            config,
            capabilities,
            status: 'available',
            createdAt: now,
            updatedAt: now
        };
        
        this.agents.set(id, agent);
        
        // 保存到数据库
        try {
            await prisma.agent.create({
                data: {
                    id,
                    name,
                    type,
                    description,
                    config: JSON.stringify(config),
                    capabilities: capabilities.join(','),
                    createdAt: now,
                    updatedAt: now
                }
            });
        } catch (error) {
            console.error('保存代理失败:', error);
        }
        
        return agent;
    }
    
    /**
     * 获取代理
     * 
     * @param agentId 代理ID
     * @returns 代理信息或null
     */
    public async getAgent(agentId: string): Promise<IAgentInfo | null> {
        // 从内存获取
        if (this.agents.has(agentId)) {
            return this.agents.get(agentId) || null;
        }
        
        // 从数据库获取
        try {
            const agent = await prisma.agent.findUnique({
                where: { id: agentId }
            });
            
            if (!agent) {
                return null;
            }
            
            const agentInfo: IAgentInfo = {
                id: agent.id,
                name: agent.name,
                type: agent.type as AgentType,
                description: agent.description || undefined,
                config: JSON.parse(agent.config),
                capabilities: agent.capabilities.split(','),
                status: 'available',
                createdAt: agent.createdAt,
                updatedAt: agent.updatedAt
            };
            
            // 缓存到内存
            this.agents.set(agentId, agentInfo);
            
            return agentInfo;
        } catch (error) {
            console.error(`获取代理失败 (${agentId}):`, error);
            return null;
        }
    }
    
    /**
     * 更新代理信息
     * 
     * @param agentId 代理ID
     * @param updates 更新数据
     * @returns 更新后的代理信息或null
     */
    public async updateAgent(
        agentId: string,
        updates: Partial<Omit<IAgentInfo, 'id' | 'createdAt' | 'updatedAt'>>
    ): Promise<IAgentInfo | null> {
        // 获取现有代理
        const agent = await this.getAgent(agentId);
        if (!agent) {
            return null;
        }
        
        // 更新代理
        const now = new Date();
        const updatedAgent: IAgentInfo = {
            ...agent,
            ...updates,
            updatedAt: now
        };
        
        // 更新内存
        this.agents.set(agentId, updatedAgent);
        
        // 更新数据库
        try {
            const dbUpdates: any = {
                updatedAt: now
            };
            
            if (updates.name) dbUpdates.name = updates.name;
            if (updates.type) dbUpdates.type = updates.type;
            if (updates.description !== undefined) dbUpdates.description = updates.description;
            if (updates.config) dbUpdates.config = JSON.stringify(updates.config);
            if (updates.capabilities) dbUpdates.capabilities = updates.capabilities.join(',');
            
            await prisma.agent.update({
                where: { id: agentId },
                data: dbUpdates
            });
        } catch (error) {
            console.error(`更新代理失败 (${agentId}):`, error);
        }
        
        return updatedAgent;
    }
    
    /**
     * 创建团队
     * 
     * @param name 团队名称
     * @param agentIds 代理ID列表
     * @param description 团队描述
     * @returns 创建的团队信息
     */
    public async createTeam(
        name: string,
        agentIds: string[],
        description?: string
    ): Promise<ITeamInfo> {
        const id = uuidv4();
        
        // 获取团队代理
        const teamAgents: IAgentInfo[] = [];
        for (const agentId of agentIds) {
            const agent = await this.getAgent(agentId);
            if (agent) {
                teamAgents.push(agent);
            }
        }
        
        const team: ITeamInfo = {
            id,
            name,
            description,
            agents: teamAgents
        };
        
        this.teams.set(id, team);
        
        // 保存到数据库
        try {
            await prisma.agentTeam.create({
                data: {
                    id,
                    name,
                    description,
                    type: 'conversation', // 默认类型
                    status: 'inactive',   // 默认状态
                    members: {
                        create: agentIds.map(agentId => ({
                            agentId,
                            role: 'member',    // 默认角色
                            configId: '',      // 需要设置默认配置ID
                            position: 0,       // 默认位置
                            isRequired: true   // 默认必需
                        }))
                    }
                }
            });
        } catch (error) {
            console.error('保存团队失败:', error);
            throw error;
        }
        
        return team;
    }
    
    /**
     * 获取团队
     * 
     * @param teamId 团队ID
     * @returns 团队信息或null
     */
    public async getTeam(teamId: string): Promise<ITeamInfo | null> {
        // 从内存获取
        if (this.teams.has(teamId)) {
            return this.teams.get(teamId) || null;
        }
        
        // 从数据库获取
        try {
            const team = await prisma.agentTeam.findUnique({
                where: { id: teamId },
                include: {
                    members: {
                        include: {
                            agent: true
                        }
                    }
                }
            });
            
            if (!team) {
                return null;
            }
            
            const teamAgents: IAgentInfo[] = [];
            
            for (const member of team.members) {
                const agent = await this.getAgent(member.agentId);
                if (agent) {
                    teamAgents.push(agent);
                }
            }
            
            const teamInfo: ITeamInfo = {
                id: team.id,
                name: team.name,
                description: team.description || undefined,
                agents: teamAgents
            };
            
            // 缓存到内存
            this.teams.set(teamId, teamInfo);
            
            return teamInfo;
        } catch (error) {
            console.error(`获取团队失败 (${teamId}):`, error);
            return null;
        }
    }
    
    /**
     * 创建任务
     * 
     * @param name 任务名称
     * @param type 任务类型
     * @param inputs 任务输入数据
     * @param sessionId 会话ID
     * @param priority 任务优先级
     * @param description 任务描述
     * @param assignedAgentId 分配的代理ID
     * @param parentTaskId 父任务ID
     * @param collaborationInstanceId 协作实例ID
     * @param deadline 任务截止时间
     * @param dependencies 任务依赖
     * @returns 创建的任务
     */
    public async createTask(
        name: string,
        type: string,
        inputs: Record<string, any>,
        sessionId: string,
        priority: TaskPriority = TaskPriority.MEDIUM,
        description?: string,
        assignedAgentId?: string,
        parentTaskId?: string,
        collaborationInstanceId?: string,
        deadline?: Date,
        dependencies?: string[]
    ): Promise<IAgentTask> {
        const id = uuidv4();
        const now = new Date();
        
        const task: IAgentTask = {
            id,
            name,
            description,
            type,
            status: assignedAgentId ? TaskStatus.ASSIGNED : TaskStatus.PENDING,
            priority,
            inputs,
            sessionId,
            assignedAgentId,
            parentTaskId,
            collaborationInstanceId,
            createdAt: now,
            updatedAt: now,
            deadline,
            dependencies
        };
        
        this.tasks.set(id, task);
        
        // 保存到数据库
        try {
            await prisma.agentTask.create({
                data: {
                    id,
                    name,
                    description,
                    type,
                    status: task.status,
                    priority,
                    inputs: JSON.stringify(inputs),
                    sessionId,
                    assignedAgentId,
                    parentTaskId,
                    collaborationInstanceId,
                    deadline,
                    dependencies: dependencies ? JSON.stringify(dependencies) : null
                }
            });
        } catch (error) {
            console.error('保存任务失败:', error);
        }
        
        return task;
    }
    
    /**
     * 分配任务
     * 
     * @param taskId 任务ID
     * @param agentId 代理ID
     * @returns 更新后的任务或null
     */
    public async assignTask(taskId: string, agentId: string): Promise<IAgentTask | null> {
        // 获取任务
        const task = this.tasks.get(taskId);
        if (!task) {
            return null;
        }
        
        // 获取代理
        const agent = await this.getAgent(agentId);
        if (!agent) {
            return null;
        }
        
        // 更新任务
        const now = new Date();
        const updatedTask: IAgentTask = {
            ...task,
            assignedAgentId: agentId,
            status: TaskStatus.ASSIGNED,
            updatedAt: now
        };
        
        this.tasks.set(taskId, updatedTask);
        
        // 更新代理状态
        await this.updateAgent(agentId, { status: 'busy' });
        
        // 更新数据库
        try {
            await prisma.agentTask.update({
                where: { id: taskId },
                data: {
                    assignedAgentId: agentId,
                    status: TaskStatus.ASSIGNED,
                    updatedAt: now
                }
            });
        } catch (error) {
            console.error(`更新任务失败 (${taskId}):`, error);
        }
        
        return updatedTask;
    }
    
    /**
     * 启动任务
     * 
     * @param taskId 任务ID
     * @returns 更新后的任务或null
     */
    public async startTask(taskId: string): Promise<IAgentTask | null> {
        // 获取任务
        const task = this.tasks.get(taskId);
        if (!task || task.status !== TaskStatus.ASSIGNED) {
            return null;
        }
        
        // 更新任务
        const now = new Date();
        const updatedTask: IAgentTask = {
            ...task,
            status: TaskStatus.RUNNING,
            startTime: now,
            updatedAt: now
        };
        
        this.tasks.set(taskId, updatedTask);
        
        // 更新数据库
        try {
            await prisma.agentTask.update({
                where: { id: taskId },
                data: {
                    status: TaskStatus.RUNNING,
                    startTime: now,
                    updatedAt: now
                }
            });
        } catch (error) {
            console.error(`更新任务失败 (${taskId}):`, error);
        }
        
        return updatedTask;
    }
    
    /**
     * 完成任务
     * 
     * @param taskId 任务ID
     * @param outputs 任务输出数据
     * @returns 更新后的任务或null
     */
    public async completeTask(taskId: string, outputs: Record<string, any>): Promise<IAgentTask | null> {
        // 获取任务
        const task = this.tasks.get(taskId);
        if (!task || task.status !== TaskStatus.RUNNING) {
            return null;
        }
        
        // 更新任务
        const now = new Date();
        const updatedTask: IAgentTask = {
            ...task,
            status: TaskStatus.COMPLETED,
            outputs,
            endTime: now,
            updatedAt: now
        };
        
        this.tasks.set(taskId, updatedTask);
        
        // 更新代理状态
        if (task.assignedAgentId) {
            await this.updateAgent(task.assignedAgentId, { status: 'available' });
        }
        
        // 更新数据库
        try {
            await prisma.agentTask.update({
                where: { id: taskId },
                data: {
                    status: TaskStatus.COMPLETED,
                    outputs: JSON.stringify(outputs),
                    endTime: now,
                    updatedAt: now
                }
            });
        } catch (error) {
            console.error(`更新任务失败 (${taskId}):`, error);
        }
        
        return updatedTask;
    }
    
    /**
     * 失败任务
     * 
     * @param taskId 任务ID
     * @param error 错误信息
     * @returns 更新后的任务或null
     */
    public async failTask(taskId: string, error: any): Promise<IAgentTask | null> {
        // 获取任务
        const task = this.tasks.get(taskId);
        if (!task || (task.status !== TaskStatus.RUNNING && task.status !== TaskStatus.ASSIGNED)) {
            return null;
        }
        
        // 更新任务
        const now = new Date();
        const updatedTask: IAgentTask = {
            ...task,
            status: TaskStatus.FAILED,
            outputs: { error },
            endTime: now,
            updatedAt: now
        };
        
        this.tasks.set(taskId, updatedTask);
        
        // 更新代理状态
        if (task.assignedAgentId) {
            await this.updateAgent(task.assignedAgentId, { status: 'available' });
        }
        
        // 更新数据库
        try {
            await prisma.agentTask.update({
                where: { id: taskId },
                data: {
                    status: TaskStatus.FAILED,
                    outputs: JSON.stringify({ error }),
                    endTime: now,
                    updatedAt: now
                }
            });
        } catch (error) {
            console.error(`更新任务失败 (${taskId}):`, error);
        }
        
        return updatedTask;
    }
    
    /**
     * 取消任务
     * 
     * @param taskId 任务ID
     * @returns 更新后的任务或null
     */
    public async cancelTask(taskId: string): Promise<IAgentTask | null> {
        // 获取任务
        const task = this.tasks.get(taskId);
        if (!task || task.status === TaskStatus.COMPLETED || task.status === TaskStatus.FAILED) {
            return null;
        }
        
        // 更新任务
        const now = new Date();
        const updatedTask: IAgentTask = {
            ...task,
            status: TaskStatus.CANCELLED,
            endTime: now,
            updatedAt: now
        };
        
        this.tasks.set(taskId, updatedTask);
        
        // 更新代理状态
        if (task.assignedAgentId) {
            await this.updateAgent(task.assignedAgentId, { status: 'available' });
        }
        
        // 更新数据库
        try {
            await prisma.agentTask.update({
                where: { id: taskId },
                data: {
                    status: TaskStatus.CANCELLED,
                    endTime: now,
                    updatedAt: now
                }
            });
        } catch (error) {
            console.error(`更新任务失败 (${taskId}):`, error);
        }
        
        return updatedTask;
    }
    
    /**
     * 获取任务
     * 
     * @param taskId 任务ID
     * @returns 任务或null
     */
    public async getTask(taskId: string): Promise<IAgentTask | null> {
        // 从内存获取
        if (this.tasks.has(taskId)) {
            return this.tasks.get(taskId) || null;
        }
        
        // 从数据库获取
        try {
            const task = await prisma.agentTask.findUnique({
                where: { id: taskId }
            });
            
            if (!task) {
                return null;
            }
            
            const agentTask: IAgentTask = {
                id: task.id,
                name: task.name,
                description: task.description || undefined,
                type: task.type,
                status: task.status as TaskStatus,
                priority: task.priority as TaskPriority,
                inputs: JSON.parse(task.inputs),
                outputs: task.outputs ? JSON.parse(task.outputs) : undefined,
                assignedAgentId: task.assignedAgentId || undefined,
                sessionId: task.sessionId,
                parentTaskId: task.parentTaskId || undefined,
                collaborationInstanceId: task.collaborationInstanceId || undefined,
                createdAt: task.createdAt,
                updatedAt: task.updatedAt,
                startTime: task.startTime || undefined,
                endTime: task.endTime || undefined,
                deadline: task.deadline || undefined,
                dependencies: task.dependencies ? JSON.parse(task.dependencies) : undefined
            };
            
            // 缓存到内存
            this.tasks.set(taskId, agentTask);
            
            return agentTask;
        } catch (error) {
            console.error(`获取任务失败 (${taskId}):`, error);
            return null;
        }
    }
    
    /**
     * 查找适合的代理
     * 
     * @param task 任务
     * @param requiredCapabilities 所需能力
     * @returns 适合的代理ID或null
     */
    public async findSuitableAgent(
        task: IAgentTask,
        requiredCapabilities: string[] = []
    ): Promise<string | null> {
        // 获取所有可用代理
        const availableAgents = Array.from(this.agents.values()).filter(
            agent => agent.status === 'available'
        );
        
        if (availableAgents.length === 0) {
            return null;
        }
        
        // 找到具有所需能力的代理
        if (requiredCapabilities.length > 0) {
            const suitableAgents = availableAgents.filter(agent => 
                requiredCapabilities.every(cap => agent.capabilities.includes(cap))
            );
            
            if (suitableAgents.length > 0) {
                // 简单方案：随机选择一个合适的代理
                const randomIndex = Math.floor(Math.random() * suitableAgents.length);
                return suitableAgents[randomIndex].id;
            }
        }
        
        // 如果没有找到具有所需能力的代理，随机选择一个可用代理
        const randomIndex = Math.floor(Math.random() * availableAgents.length);
        return availableAgents[randomIndex].id;
    }
    
    /**
     * 创建协作流程
     * 
     * @param sessionId 会话ID
     * @param agents 代理ID列表
     * @param name 协作名称
     * @param type 协作类型
     * @param description 协作描述
     * @param config 协作配置
     * @returns 协作实例ID或null
     */
    public async createCollaboration(
        sessionId: string,
        agents: string[],
        name: string,
        type: CollaborationType = CollaborationType.SEQUENTIAL,
        description?: string,
        config?: {
            maxRetries?: number;
            timeout?: number;
            conditions?: Array<{
                agentId: string;
                condition: string;
                trueNodeId?: string;
                falseNodeId?: string;
            }>;
        }
    ): Promise<string | null> {
        try {
            // 创建节点
            const nodes: ICollaborationNode[] = [];
            
            // 创建开始节点
            const startNode = {
                id: uuidv4(),
                type: CollaborationNodeType.START,
                name: '开始',
                config: {},
                next: []
            };
            
            nodes.push(startNode);
            
            // 根据协作类型创建不同的节点结构
            switch (type) {
                case CollaborationType.PARALLEL: {
                    // 创建并行节点
                    const parallelNode = {
                        id: uuidv4(),
                        type: CollaborationNodeType.PARALLEL,
                        name: '并行执行',
                        config: {
                            timeout: config?.timeout || 300000, // 默认5分钟超时
                            maxRetries: config?.maxRetries || 3
                        },
                        next: []
                    };
                    
                    startNode.next.push(parallelNode.id);
                    nodes.push(parallelNode);
                    
                    // 为每个代理创建并行的节点
                    for (const agentId of agents) {
                        const agent = await this.getAgent(agentId);
                        if (!agent) {
                            console.error(`代理不存在 (${agentId})`);
                            continue;
                        }
                        
                        const agentNode = agentCollaborationService.createAgentNode(
                            `代理: ${agent.name}`,
                            agentId,
                            []
                        );
                        
                        parallelNode.next.push(agentNode.id);
                        nodes.push(agentNode);
                    }
                    break;
                }
                
                case CollaborationType.CONDITIONAL: {
                    if (!config?.conditions || config.conditions.length === 0) {
                        throw new Error('条件协作需要提供条件配置');
                    }
                    
                    let currentNodeId = startNode.id;
                    
                    // 为每个条件创建条件节点和相应的代理节点
                    for (const condition of config.conditions) {
                        const agent = await this.getAgent(condition.agentId);
                        if (!agent) {
                            console.error(`代理不存在 (${condition.agentId})`);
                            continue;
                        }
                        
                        const conditionNode = agentCollaborationService.createConditionNode(
                            `条件: ${condition.condition}`,
                            condition.condition,
                            condition.trueNodeId || '',
                            condition.falseNodeId || ''
                        );
                        
                        // 连接到前一个节点
                        const currentNode = nodes.find(node => node.id === currentNodeId);
                        if (currentNode) {
                            currentNode.next.push(conditionNode.id);
                        }
                        
                        nodes.push(conditionNode);
                        
                        // 创建代理节点
                        const agentNode = agentCollaborationService.createAgentNode(
                            `代理: ${agent.name}`,
                            condition.agentId,
                            []
                        );
                        
                        // 设置条件节点的true分支
                        conditionNode.config.trueNodeId = agentNode.id;
                        nodes.push(agentNode);
                        
                        currentNodeId = agentNode.id;
                    }
                    break;
                }
                
                case CollaborationType.ADAPTIVE: {
                    // 创建自适应节点
                    const adaptiveNode = {
                        id: uuidv4(),
                        type: CollaborationNodeType.PARALLEL,
                        name: '自适应执行',
                        config: {
                            timeout: config?.timeout || 300000,
                            maxRetries: config?.maxRetries || 3,
                            adaptiveStrategy: 'dynamic'
                        },
                        next: []
                    };
                    
                    startNode.next.push(adaptiveNode.id);
                    nodes.push(adaptiveNode);
                    
                    // 动态分配代理
                    for (const agentId of agents) {
                        const agent = await this.getAgent(agentId);
                        if (!agent) {
                            console.error(`代理不存在 (${agentId})`);
                            continue;
                        }
                        
                        // 根据代理能力和当前负载创建节点
                        const agentNode = agentCollaborationService.createAgentNode(
                            `代理: ${agent.name}`,
                            agentId,
                            [],
                            `自适应执行 - ${agent.capabilities.join(', ')}`
                        );
                        
                        adaptiveNode.next.push(agentNode.id);
                        nodes.push(agentNode);
                    }
                    break;
                }
                
                default: {
                    // 顺序执行
                    let previousNodeId = startNode.id;
                    
                    for (const agentId of agents) {
                        const agent = await this.getAgent(agentId);
                        if (!agent) {
                            console.error(`代理不存在 (${agentId})`);
                            continue;
                        }
                        
                        const agentNode = agentCollaborationService.createAgentNode(
                            `代理: ${agent.name}`,
                            agentId,
                            []
                        );
                        
                        // 连接到前一个节点
                        const previousNode = nodes.find(node => node.id === previousNodeId);
                        if (previousNode) {
                            previousNode.next.push(agentNode.id);
                        }
                        
                        nodes.push(agentNode);
                        previousNodeId = agentNode.id;
                    }
                }
            }
            
            // 创建结束节点
            const endNode = {
                id: uuidv4(),
                type: CollaborationNodeType.END,
                name: '结束',
                config: {},
                next: []
            };
            
            // 连接所有末端节点到结束节点
            nodes.forEach(node => {
                if (node.next.length === 0 && node.type !== CollaborationNodeType.END) {
                    node.next.push(endNode.id);
                }
            });
            
            nodes.push(endNode);
            
            // 创建协作
            const collaboration = await agentCollaborationService.createCollaboration(
                name,
                CollaborationStatus.PENDING,
                nodes,
                startNode.id,
                description
            );
            
            if (!collaboration) {
                return null;
            }
            
            // 创建协作实例
            const instance = await agentCollaborationService.createInstance(
                collaboration.id,
                sessionId
            );
            
            // 记录协作创建日志
            console.log(`创建协作实例成功: ${instance?.id}`, {
                type,
                name,
                agentsCount: agents.length,
                nodesCount: nodes.length
            });
            
            return instance ? instance.id : null;
        } catch (error) {
            console.error('创建协作流程失败:', error);
            throw error; // 向上传播错误，而不是返回null
        }
    }
    
    /**
     * 监控协作实例
     * 
     * @param instanceId 实例ID
     * @param onUpdate 更新回调
     * @returns 监控ID
     */
    public monitorCollaborationInstance(
        instanceId: string,
        onUpdate: (status: CollaborationStatus, currentNodeId: string) => void
    ): string {
        const monitorId = uuidv4();
        
        // 实现监控逻辑
        // 这是一个简化实现，实际应用中可能需要更复杂的监控机制
        const checkInterval = setInterval(async () => {
            const instance = await agentCollaborationService.getInstance(instanceId);
            
            if (!instance) {
                clearInterval(checkInterval);
                return;
            }
            
            onUpdate(instance.status, instance.currentNodeId);
            
            if (instance.status === CollaborationStatus.COMPLETED || 
                instance.status === CollaborationStatus.FAILED ||
                instance.status === CollaborationStatus.CANCELLED) {
                clearInterval(checkInterval);
            }
        }, 2000); // 每2秒检查一次
        
        return monitorId;
    }
    
    /**
     * 更新编排配置
     * 
     * @param config 配置更新
     */
    public updateConfig(config: Partial<IOrchestrationConfig>): void {
        this.config = {
            ...this.config,
            ...config
        };
    }
    
    /**
     * 获取编排配置
     * 
     * @returns 当前配置
     */
    public getConfig(): IOrchestrationConfig {
        return { ...this.config };
    }
}

// 导出单例实例
export const agentOrchestrationService = AgentOrchestrationService.getInstance(); 