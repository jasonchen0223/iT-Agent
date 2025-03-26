/**
 * 代理团队服务
 * 
 * 管理代理团队的创建、配置和调度
 */
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

/**
 * 团队类型枚举
 */
export enum TeamType {
    /**
     * 工作流团队 - 代理按特定顺序执行任务
     */
    WORKFLOW = 'workflow',
    
    /**
     * 会话团队 - 代理在一个会话中交互
     */
    CONVERSATION = 'conversation',
    
    /**
     * 并行团队 - 代理同时并行工作
     */
    PARALLEL = 'parallel'
}

/**
 * 团队成员角色枚举
 */
export enum TeamMemberRole {
    /**
     * 团队领导 - 负责协调团队
     */
    LEADER = 'leader',
    
    /**
     * 团队成员 - 执行具体任务
     */
    MEMBER = 'member',
    
    /**
     * 观察者 - 监控任务但不直接参与
     */
    OBSERVER = 'observer'
}

/**
 * 团队状态枚举
 */
export enum TeamStatus {
    /**
     * 活跃状态
     */
    ACTIVE = 'active',
    
    /**
     * 非活跃状态
     */
    INACTIVE = 'inactive',
    
    /**
     * 归档状态
     */
    ARCHIVED = 'archived'
}

/**
 * 团队接口
 */
export interface ITeam {
    id: string;
    name: string;
    description: string | null;
    type: TeamType;
    status: TeamStatus;
    createdAt: string;
    updatedAt: string;
    createdBy: string | null;
    members: ITeamMember[];
}

/**
 * 团队成员接口
 */
export interface ITeamMember {
    id: string;
    teamId: string;
    configId: string;
    role: TeamMemberRole;
    position: number;
    isRequired: boolean;
    metadata: any;
    config: {
        id: string;
        name: string;
        role: string;
        icon: string | null;
        color: string | null;
    };
}

/**
 * 团队创建参数
 */
export interface ICreateTeamParams {
    name: string;
    description?: string;
    type: TeamType;
    members: {
        configId: string;
        role: TeamMemberRole;
        position: number;
        isRequired: boolean;
    }[];
}

/**
 * 团队服务类
 */
export class TeamService {
    /**
     * 获取团队列表
     */
    static async getTeams(params: {
        search?: string;
        type?: string;
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<{ items: ITeam[]; total: number }> {
        try {
            const response = await fetch(`/api/agents/teams?${new URLSearchParams({
                search: params.search || '',
                type: params.type || '',
                status: params.status || '',
                page: String(params.page || 1),
                limit: String(params.limit || 10)
            }).toString()}`);
            
            if (!response.ok) {
                throw new Error('获取团队列表失败');
            }
            
            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.error || '获取团队列表失败');
            }
        } catch (error) {
            console.error('获取团队列表失败:', error);
            throw error;
        }
    }
    
    /**
     * 获取单个团队信息
     */
    static async getTeam(id: string): Promise<ITeam> {
        try {
            const response = await fetch(`/api/agents/teams/${id}`);
            
            if (!response.ok) {
                throw new Error('获取团队信息失败');
            }
            
            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.error || '获取团队信息失败');
            }
        } catch (error) {
            console.error('获取团队信息失败:', error);
            throw error;
        }
    }
    
    /**
     * 创建团队
     */
    static async createTeam(params: ICreateTeamParams): Promise<ITeam> {
        try {
            const response = await fetch('/api/agents/teams', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            });
            
            if (!response.ok) {
                throw new Error('创建团队失败');
            }
            
            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.error || '创建团队失败');
            }
        } catch (error) {
            console.error('创建团队失败:', error);
            throw error;
        }
    }
    
    /**
     * 更新团队
     */
    static async updateTeam(id: string, params: Partial<ICreateTeamParams>): Promise<ITeam> {
        try {
            const response = await fetch(`/api/agents/teams/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params)
            });
            
            if (!response.ok) {
                throw new Error('更新团队失败');
            }
            
            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.error || '更新团队失败');
            }
        } catch (error) {
            console.error('更新团队失败:', error);
            throw error;
        }
    }
    
    /**
     * 删除团队
     */
    static async deleteTeam(id: string): Promise<boolean> {
        try {
            const response = await fetch(`/api/agents/teams/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('删除团队失败');
            }
            
            const data = await response.json();
            
            if (data.success) {
                return true;
            } else {
                throw new Error(data.error || '删除团队失败');
            }
        } catch (error) {
            console.error('删除团队失败:', error);
            throw error;
        }
    }
    
    /**
     * 启动团队
     */
    static async startTeam(id: string): Promise<{ sessionId: string }> {
        try {
            const response = await fetch(`/api/agents/teams/${id}/start`, {
                method: 'POST'
            });
            
            if (!response.ok) {
                throw new Error('启动团队失败');
            }
            
            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.error || '启动团队失败');
            }
        } catch (error) {
            console.error('启动团队失败:', error);
            throw error;
        }
    }
}

// 导出服务单例
export const agentTeamService = new TeamService();
export default agentTeamService; 