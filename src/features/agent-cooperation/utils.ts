/**
 * 代理协作实用工具函数
 */
import { IAgentMessage, TAgentRole } from '@/types/agent';
import { ICooperationSessionState } from './agent-cooperation';

/**
 * 解析代理消息内容
 * 
 * 解析消息中的代码、工具调用和其他特殊格式
 * 
 * @param {string} content - 消息内容
 * @returns {Object} 解析结果
 */
export function parseMessageContent(content: string): {
    text: string;
    code: {language: string, content: string}[];
    toolCalls: {name: string, params: any}[];
} {
    const result = {
        text: content,
        code: [] as {language: string, content: string}[],
        toolCalls: [] as {name: string, params: any}[],
    };
    
    // 解析代码块
    const codeRegex = /```(\w+)?\s*\n([\s\S]*?)\n```/g;
    let match;
    
    while ((match = codeRegex.exec(content)) !== null) {
        const language = match[1] || 'text';
        const codeContent = match[2];
        
        result.code.push({
            language,
            content: codeContent
        });
    }
    
    // 解析工具调用
    // 格式: [TOOL_CALL:工具名称{参数JSON}]
    const toolCallRegex = /\[TOOL_CALL:([\w]+)\{([^}]+)\}\]/g;
    
    while ((match = toolCallRegex.exec(content)) !== null) {
        const toolName = match[1];
        let params = {};
        
        try {
            params = JSON.parse(match[2]);
        } catch (error) {
            console.error('解析工具调用参数失败:', error);
        }
        
        result.toolCalls.push({
            name: toolName,
            params
        });
    }
    
    return result;
}

/**
 * 格式化代理消息
 * 
 * @param {IAgentMessage} message - 代理消息
 * @returns {string} 格式化的消息
 */
export function formatAgentMessage(message: IAgentMessage): string {
    const { content, type } = message;
    
    switch (type) {
        case 'code':
            return `\`\`\`\n${content}\n\`\`\``;
        case 'tool_call':
            return `[工具调用] ${content}`;
        case 'tool_result':
            return `[工具结果] ${content}`;
        case 'error':
            return `[错误] ${content}`;
        case 'text':
        default:
            return content;
    }
}

/**
 * 获取会话中下一个应该活跃的代理ID
 * 
 * @param {ICooperationSessionState} sessionState - 会话状态
 * @returns {string | null} 下一个活跃代理ID
 */
export function getNextActiveAgentId(sessionState: ICooperationSessionState): string | null {
    const { messages, activeAgentId } = sessionState;
    
    if (messages.length === 0) {
        return null;
    }
    
    // 获取所有参与会话的代理ID
    const agentIds = new Set<string>();
    messages.forEach(message => {
        agentIds.add(message.senderId);
        agentIds.add(message.receiverId);
    });
    
    // 转换为数组
    const agentIdArray = Array.from(agentIds);
    
    // 如果没有当前活跃代理，返回第一个代理
    if (!activeAgentId) {
        return agentIdArray[0];
    }
    
    // 找到当前活跃代理的索引
    const currentIndex = agentIdArray.indexOf(activeAgentId);
    
    // 计算下一个代理的索引
    const nextIndex = (currentIndex + 1) % agentIdArray.length;
    
    return agentIdArray[nextIndex];
}

/**
 * 提取会话中的关键信息
 * 
 * @param {ICooperationSessionState} sessionState - 会话状态
 * @returns {Object} 会话关键信息
 */
export function extractSessionSummary(sessionState: ICooperationSessionState): {
    taskDescription: string;
    keyInsights: string[];
    participatingAgents: string[];
    duration: number;
    messageCount: number;
} {
    const { messages } = sessionState;
    
    // 初始化结果
    const result = {
        taskDescription: '',
        keyInsights: [] as string[],
        participatingAgents: [] as string[],
        duration: 0,
        messageCount: messages.length
    };
    
    // 提取任务描述（通常是第一条消息）
    if (messages.length > 0) {
        result.taskDescription = messages[0].content;
    }
    
    // 提取参与代理
    const agentIds = new Set<string>();
    messages.forEach(message => {
        agentIds.add(message.senderId);
    });
    result.participatingAgents = Array.from(agentIds);
    
    // 计算会话持续时间
    if (messages.length >= 2) {
        const startTime = messages[0].createdAt.getTime();
        const endTime = messages[messages.length - 1].createdAt.getTime();
        result.duration = endTime - startTime;
    }
    
    // 提取关键见解（目前是一个简单实现，可以进一步改进）
    result.keyInsights = messages
        .filter(msg => msg.content.includes('总结') || msg.content.includes('结论') || msg.content.includes('关键点'))
        .map(msg => msg.content);
    
    return result;
}

/**
 * 检查两个代理是否能够直接通信
 * 
 * @param {TAgentRole} roleA - 代理A的角色
 * @param {TAgentRole} roleB - 代理B的角色
 * @returns {boolean} 是否可以直接通信
 */
export function canAgentsCommunicate(roleA: TAgentRole, roleB: TAgentRole): boolean {
    // 用户代理可以与任何代理通信
    if (roleA === TAgentRole.USER || roleB === TAgentRole.USER) {
        return true;
    }
    
    // 协调者可以与任何代理通信
    if (roleA === TAgentRole.ORCHESTRATOR || roleB === TAgentRole.ORCHESTRATOR) {
        return true;
    }
    
    // 助手可以与大多数代理通信
    if (roleA === TAgentRole.ASSISTANT || roleB === TAgentRole.ASSISTANT) {
        return true;
    }
    
    // 特定角色的通信规则
    const communicationRules: Record<TAgentRole, TAgentRole[]> = {
        [TAgentRole.USER]: Object.values(TAgentRole), // 用户可以与所有代理通信
        [TAgentRole.ASSISTANT]: Object.values(TAgentRole), // 助手可以与所有代理通信
        [TAgentRole.ORCHESTRATOR]: Object.values(TAgentRole), // 协调者可以与所有代理通信
        [TAgentRole.EXECUTOR]: [TAgentRole.PLANNER, TAgentRole.CRITIC, TAgentRole.ORCHESTRATOR], // 执行者仅与部分代理通信
        [TAgentRole.PLANNER]: [TAgentRole.EXECUTOR, TAgentRole.RESEARCHER, TAgentRole.ORCHESTRATOR, TAgentRole.CRITIC],
        [TAgentRole.CRITIC]: Object.values(TAgentRole), // 评论者可以与所有代理通信
        [TAgentRole.RESEARCHER]: [TAgentRole.PLANNER, TAgentRole.ORCHESTRATOR, TAgentRole.ASSISTANT],
        [TAgentRole.CODER]: [TAgentRole.PLANNER, TAgentRole.TESTER, TAgentRole.ORCHESTRATOR, TAgentRole.CRITIC],
        [TAgentRole.TESTER]: [TAgentRole.CODER, TAgentRole.ORCHESTRATOR, TAgentRole.CRITIC],
    };
    
    // 检查通信规则
    return (
        communicationRules[roleA]?.includes(roleB) || 
        communicationRules[roleB]?.includes(roleA) || 
        false
    );
} 