import { IAgentConfig, TAgentRole, TAgentStatus } from '@/types/agent';
import { prisma } from '@/lib/prisma';

/**
 * 获取所有代理配置
 * 
 * @returns {Promise<IAgentConfig[]>} 代理配置列表
 */
export const getAllAgentConfigs = async (): Promise<IAgentConfig[]> => {
    const configs = await prisma.agentConfig.findMany({
        orderBy: { updatedAt: 'desc' }
    });
    
    return configs.map(config => ({
        id: config.id,
        name: config.name,
        role: config.role as TAgentRole,
        description: config.description || '',
        systemMessage: config.systemPrompt,
        color: config.color || '#6366f1',
        status: TAgentStatus.IDLE,
        icon: config.icon,
        model: config.model,
        capability: config.capability.split(',').filter(Boolean),
        settings: config.settings ? JSON.parse(config.settings) : {}
    }));
};

/**
 * 根据ID获取代理配置
 * 
 * @param {string} id - 代理ID
 * @returns {Promise<IAgentConfig | null>} 代理配置或空
 */
export const getAgentConfigById = async (id: string): Promise<IAgentConfig | null> => {
    const config = await prisma.agentConfig.findUnique({
        where: { id }
    });
    
    if (!config) return null;
    
    return {
        id: config.id,
        name: config.name,
        role: config.role as TAgentRole,
        description: config.description || '',
        systemMessage: config.systemPrompt,
        color: config.color || '#6366f1',
        status: TAgentStatus.IDLE,
        icon: config.icon,
        model: config.model,
        capability: config.capability.split(',').filter(Boolean),
        settings: config.settings ? JSON.parse(config.settings) : {}
    };
};

/**
 * 创建新的代理配置
 * 
 * @param {Omit<IAgentConfig, 'id' | 'status'>} config - 代理配置数据
 * @returns {Promise<IAgentConfig>} 创建的代理配置
 */
export const createAgentConfig = async (
    config: Omit<IAgentConfig, 'id' | 'status'>
): Promise<IAgentConfig> => {
    const newConfig = await prisma.agentConfig.create({
        data: {
            name: config.name,
            role: config.role,
            description: config.description,
            systemPrompt: config.systemMessage,
            color: config.color,
            icon: config.icon,
            model: config.model || 'gpt-3.5-turbo',
            capability: Array.isArray(config.capability) ? config.capability.join(',') : '',
            settings: config.settings ? JSON.stringify(config.settings) : null
        }
    });
    
    return {
        id: newConfig.id,
        name: newConfig.name,
        role: newConfig.role as TAgentRole,
        description: newConfig.description || '',
        systemMessage: newConfig.systemPrompt,
        color: newConfig.color || '#6366f1',
        status: TAgentStatus.IDLE,
        icon: newConfig.icon,
        model: newConfig.model,
        capability: newConfig.capability.split(',').filter(Boolean),
        settings: newConfig.settings ? JSON.parse(newConfig.settings) : {}
    };
};

/**
 * 更新代理配置
 * 
 * @param {string} id - 代理ID
 * @param {Partial<Omit<IAgentConfig, 'id'>>} updates - 更新内容
 * @returns {Promise<IAgentConfig | null>} 更新后的代理配置或空
 */
export const updateAgentConfig = async (
    id: string,
    updates: Partial<Omit<IAgentConfig, 'id'>>
): Promise<IAgentConfig | null> => {
    const config = await prisma.agentConfig.update({
        where: { id },
        data: {
            ...(updates.name && { name: updates.name }),
            ...(updates.role && { role: updates.role }),
            ...(updates.description && { description: updates.description }),
            ...(updates.systemMessage && { systemPrompt: updates.systemMessage }),
            ...(updates.color && { color: updates.color }),
            ...(updates.icon && { icon: updates.icon }),
            ...(updates.model && { model: updates.model }),
            ...(updates.capability && { 
                capability: Array.isArray(updates.capability) ? 
                    updates.capability.join(',') : updates.capability 
            }),
            ...(updates.settings && { 
                settings: JSON.stringify(updates.settings)
            })
        }
    }).catch(() => null);
    
    if (!config) return null;
    
    return {
        id: config.id,
        name: config.name,
        role: config.role as TAgentRole,
        description: config.description || '',
        systemMessage: config.systemPrompt,
        color: config.color || '#6366f1',
        status: TAgentStatus.IDLE,
        icon: config.icon,
        model: config.model,
        capability: config.capability.split(',').filter(Boolean),
        settings: config.settings ? JSON.parse(config.settings) : {}
    };
};

/**
 * 删除代理配置
 * 
 * @param {string} id - 要删除的代理ID
 * @returns {Promise<boolean>} 删除是否成功
 */
export const deleteAgentConfig = async (id: string): Promise<boolean> => {
    try {
        await prisma.agentConfig.delete({
            where: { id }
        });
        return true;
    } catch {
        return false;
    }
};

/**
 * 复制代理配置
 * 
 * @param {string} id - 要复制的代理ID
 * @returns {Promise<IAgentConfig | null>} 复制的代理配置或空
 */
export const cloneAgentConfig = async (id: string): Promise<IAgentConfig | null> => {
    const sourceConfig = await prisma.agentConfig.findUnique({
        where: { id }
    });
    
    if (!sourceConfig) return null;
    
    const clonedConfig = await prisma.agentConfig.create({
        data: {
            name: `${sourceConfig.name} (副本)`,
            role: sourceConfig.role,
            description: sourceConfig.description,
            systemPrompt: sourceConfig.systemPrompt,
            color: sourceConfig.color,
            icon: sourceConfig.icon,
            model: sourceConfig.model,
            capability: sourceConfig.capability,
            settings: sourceConfig.settings
        }
    });
    
    return {
        id: clonedConfig.id,
        name: clonedConfig.name,
        role: clonedConfig.role as TAgentRole,
        description: clonedConfig.description || '',
        systemMessage: clonedConfig.systemPrompt,
        color: clonedConfig.color || '#6366f1',
        status: TAgentStatus.IDLE,
        icon: clonedConfig.icon,
        model: clonedConfig.model,
        capability: clonedConfig.capability.split(',').filter(Boolean),
        settings: clonedConfig.settings ? JSON.parse(clonedConfig.settings) : {}
    };
};

/**
 * 根据角色获取代理模板
 * 
 * @param {TAgentRole} role - 代理角色
 * @returns {Promise<Partial<IAgentConfig>>} 代理模板
 */
export const getAgentTemplateByRole = async (role: TAgentRole): Promise<Partial<IAgentConfig>> => {
    // 角色映射到默认颜色
    const roleDefaultColors: Record<TAgentRole, string> = {
        [TAgentRole.USER]: '#4f46e5',       // 深靛青色
        [TAgentRole.ASSISTANT]: '#16a34a',  // 绿色
        [TAgentRole.ORCHESTRATOR]: '#8b5cf6', // 紫色
        [TAgentRole.EXECUTOR]: '#0891b2',   // 青色
        [TAgentRole.PLANNER]: '#6366f1',    // 靛青色
        [TAgentRole.CRITIC]: '#dc2626',     // 红色
        [TAgentRole.RESEARCHER]: '#eab308', // 黄色
        [TAgentRole.CODER]: '#2563eb',      // 蓝色
        [TAgentRole.TESTER]: '#ea580c'      // 橙色
    };
    
    // 角色系统消息模板
    const roleSystemMessages: Record<TAgentRole, string> = {
        [TAgentRole.USER]: '你是用户代理，负责接收用户指令并与其他代理协作。你的主要目标是确保用户的需求被正确理解和执行。',
        [TAgentRole.ASSISTANT]: '你是助手代理，负责提供全面的支持和建议。你的目标是基于你的知识和技能，为用户提供最佳帮助。',
        [TAgentRole.ORCHESTRATOR]: '你是协调者代理，负责组织和管理其他代理的工作。你的目标是确保任务高效地分配和执行。',
        [TAgentRole.EXECUTOR]: '你是执行者代理，负责执行具体的行动和操作。你的目标是准确而高效地完成分配给你的任务。',
        [TAgentRole.PLANNER]: '你是规划者代理，负责制定策略和计划。你的目标是为复杂问题创建结构化的解决方案。',
        [TAgentRole.CRITIC]: '你是批评者代理，负责审查和评估其他代理的工作。你的目标是提供建设性的反馈以改进结果。',
        [TAgentRole.RESEARCHER]: '你是研究者代理，负责收集和分析信息。你的目标是找到解决问题所需的相关数据和知识。',
        [TAgentRole.CODER]: '你是编码者代理，负责编写和审查代码。你的目标是创建高质量、高效的软件实现。',
        [TAgentRole.TESTER]: '你是测试者代理，负责验证解决方案的质量。你的目标是找出潜在问题并确保解决方案符合要求。'
    };

    return {
        role,
        color: roleDefaultColors[role],
        systemMessage: roleSystemMessages[role]
    };
}; 