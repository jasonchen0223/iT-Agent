/**
 * 团队类型枚举
 */
export enum TeamType {
    /**
     * 工作流团队：代理按顺序执行任务，前一个代理的输出作为下一个代理的输入
     */
    WORKFLOW = 'workflow',
    
    /**
     * 会话团队：代理在同一会话中自由交互，类似群聊
     */
    CONVERSATION = 'conversation',
    
    /**
     * 并行团队：代理同时独立工作，适合需要多视角处理或同时处理多任务的场景
     */
    PARALLEL = 'parallel',
}

/**
 * 团队成员角色枚举
 */
export enum MemberRole {
    /**
     * 团队领导：负责协调和指导团队的工作
     */
    LEADER = 'leader',
    
    /**
     * 普通成员：执行任务的常规成员
     */
    MEMBER = 'member',
    
    /**
     * 观察者：只接收信息，不参与执行
     */
    OBSERVER = 'observer',
    
    /**
     * 专家：在特定领域提供专业知识
     */
    SPECIALIST = 'specialist',
}

/**
 * 团队成员接口
 */
export interface ITeamMember {
    /**
     * 成员ID
     */
    id?: string;
    
    /**
     * 团队ID
     */
    teamId?: string;
    
    /**
     * 代理配置ID
     */
    configId: string;
    
    /**
     * 成员角色
     */
    role: MemberRole;
    
    /**
     * 成员在团队中的位置
     */
    position: number;
    
    /**
     * 是否为必需成员（不能在执行过程中被跳过）
     */
    isRequired: boolean;
    
    /**
     * 关联的代理配置
     */
    config?: any;
    
    /**
     * 成员元数据（由不同类型的团队自定义使用）
     */
    metadata?: Record<string, any>;
}

/**
 * 团队接口
 */
export interface ITeam {
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
     * 团队类型
     */
    type: TeamType;
    
    /**
     * 创建者ID
     */
    createdBy: string;
    
    /**
     * 创建时间
     */
    createdAt: string;
    
    /**
     * 更新时间
     */
    updatedAt: string;
    
    /**
     * 团队成员
     */
    members: ITeamMember[];
    
    /**
     * 团队会话计数
     */
    sessionCount?: number;
    
    /**
     * 最近会话时间
     */
    lastSessionAt?: string;
    
    /**
     * 团队元数据（由不同类型的团队自定义使用）
     */
    metadata?: Record<string, any>;
}

/**
 * 团队创建或更新接口
 */
export interface ITeamCreateUpdate {
    /**
     * 团队名称
     */
    name: string;
    
    /**
     * 团队描述
     */
    description?: string;
    
    /**
     * 团队类型
     */
    type: TeamType;
    
    /**
     * 团队成员
     */
    members?: Omit<ITeamMember, 'teamId'>[];
    
    /**
     * 团队元数据
     */
    metadata?: Record<string, any>;
}

/**
 * 团队会话状态枚举
 */
export enum SessionStatus {
    /**
     * 准备中
     */
    PREPARING = 'preparing',
    
    /**
     * 进行中
     */
    ACTIVE = 'active',
    
    /**
     * 已完成
     */
    COMPLETED = 'completed',
    
    /**
     * 错误
     */
    ERROR = 'error',
    
    /**
     * 已暂停
     */
    PAUSED = 'paused'
}

/**
 * 团队会话接口
 */
export interface ITeamSession {
    /**
     * 会话ID
     */
    id: string;
    
    /**
     * 团队ID
     */
    teamId: string;
    
    /**
     * 会话状态
     */
    status: SessionStatus;
    
    /**
     * 开始时间
     */
    startedAt: string;
    
    /**
     * 结束时间
     */
    endedAt?: string;
    
    /**
     * 消息计数
     */
    messageCount: number;
    
    /**
     * 会话元数据
     */
    metadata?: Record<string, any>;
} 