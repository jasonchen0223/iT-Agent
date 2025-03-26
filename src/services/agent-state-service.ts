/**
 * 代理状态管理服务
 * 
 * 提供代理状态、历史记录和性能统计的管理功能
 */
import { v4 as uuidv4 } from 'uuid';
import { IAgent, TAgentStatus } from '@/types/agent-types';
import { TMessage } from '@/types/message-types';

/**
 * 代理状态记录
 */
export interface IAgentStatusRecord {
    /**
     * 记录ID
     */
    id: string;
    
    /**
     * 代理ID
     */
    agentId: string;
    
    /**
     * 会话ID
     */
    sessionId: string;
    
    /**
     * 状态
     */
    status: TAgentStatus;
    
    /**
     * 状态详情
     */
    details?: string;
    
    /**
     * 创建时间
     */
    timestamp: Date;
}

/**
 * 性能指标类型
 */
export enum TPerformanceMetricType {
    /**
     * 响应时间 (毫秒)
     */
    RESPONSE_TIME = 'response_time',
    
    /**
     * 消息处理数
     */
    MESSAGES_PROCESSED = 'messages_processed',
    
    /**
     * 成功率 (百分比)
     */
    SUCCESS_RATE = 'success_rate',
    
    /**
     * 工具使用频率
     */
    TOOL_USAGE = 'tool_usage',
    
    /**
     * 错误率 (百分比)
     */
    ERROR_RATE = 'error_rate',
    
    /**
     * 内存使用 (MB)
     */
    MEMORY_USAGE = 'memory_usage',
    
    /**
     * 自定义指标
     */
    CUSTOM = 'custom'
}

/**
 * 性能指标记录
 */
export interface IPerformanceMetric {
    /**
     * 记录ID
     */
    id: string;
    
    /**
     * 代理ID
     */
    agentId: string;
    
    /**
     * 会话ID
     */
    sessionId: string;
    
    /**
     * 指标类型
     */
    type: TPerformanceMetricType;
    
    /**
     * 指标名称（针对自定义指标）
     */
    name?: string;
    
    /**
     * 指标值
     */
    value: number;
    
    /**
     * 单位
     */
    unit?: string;
    
    /**
     * 相关消息ID
     */
    messageId?: string;
    
    /**
     * 创建时间
     */
    timestamp: Date;
}

/**
 * 代理历史事件类型
 */
export enum TAgentHistoryEventType {
    /**
     * 创建事件
     */
    CREATED = 'created',
    
    /**
     * 初始化事件
     */
    INITIALIZED = 'initialized',
    
    /**
     * 启动事件
     */
    STARTED = 'started',
    
    /**
     * 停止事件
     */
    STOPPED = 'stopped',
    
    /**
     * 消息发送事件
     */
    MESSAGE_SENT = 'message_sent',
    
    /**
     * 消息接收事件
     */
    MESSAGE_RECEIVED = 'message_received',
    
    /**
     * 工具调用事件
     */
    TOOL_CALLED = 'tool_called',
    
    /**
     * 错误事件
     */
    ERROR = 'error',
    
    /**
     * 配置更新事件
     */
    CONFIG_UPDATED = 'config_updated',
    
    /**
     * 角色更改事件
     */
    ROLE_CHANGED = 'role_changed',
    
    /**
     * 终止事件
     */
    TERMINATED = 'terminated',
    
    /**
     * 自定义事件
     */
    CUSTOM = 'custom'
}

/**
 * 代理历史记录
 */
export interface IAgentHistoryRecord {
    /**
     * 记录ID
     */
    id: string;
    
    /**
     * 代理ID
     */
    agentId: string;
    
    /**
     * 会话ID
     */
    sessionId: string;
    
    /**
     * 事件类型
     */
    eventType: TAgentHistoryEventType;
    
    /**
     * 事件标题
     */
    title: string;
    
    /**
     * 事件详情
     */
    details?: string;
    
    /**
     * 相关消息ID
     */
    messageId?: string;
    
    /**
     * 相关工具ID
     */
    toolId?: string;
    
    /**
     * 元数据
     */
    metadata?: Record<string, any>;
    
    /**
     * 创建时间
     */
    timestamp: Date;
}

/**
 * 代理状态过滤条件
 */
export interface IAgentStateFilter {
    /**
     * 代理ID
     */
    agentId?: string;
    
    /**
     * 会话ID
     */
    sessionId?: string;
    
    /**
     * 状态
     */
    status?: TAgentStatus;
    
    /**
     * 开始时间
     */
    startTime?: Date;
    
    /**
     * 结束时间
     */
    endTime?: Date;
}

/**
 * 代理状态服务类
 * 
 * 负责管理代理状态、历史记录和性能统计
 */
export class AgentStateService {
    /**
     * 状态记录列表
     */
    private statusRecords: Map<string, IAgentStatusRecord[]> = new Map();
    
    /**
     * 性能指标记录列表
     */
    private performanceMetrics: Map<string, IPerformanceMetric[]> = new Map();
    
    /**
     * 历史记录列表
     */
    private historyRecords: Map<string, IAgentHistoryRecord[]> = new Map();
    
    /**
     * 单例实例
     */
    private static instance: AgentStateService;
    
    /**
     * 获取服务实例
     */
    public static getInstance(): AgentStateService {
        if (!AgentStateService.instance) {
            AgentStateService.instance = new AgentStateService();
        }
        return AgentStateService.instance;
    }
    
    /**
     * 私有构造函数
     */
    private constructor() {
        console.log('代理状态服务初始化');
    }
    
    /**
     * 记录代理状态变更
     * 
     * @param agentId 代理ID
     * @param sessionId 会话ID
     * @param status 新状态
     * @param details 状态详情
     * @returns 状态记录ID
     */
    public recordStatus(
        agentId: string,
        sessionId: string,
        status: TAgentStatus,
        details?: string
    ): string {
        const record: IAgentStatusRecord = {
            id: uuidv4(),
            agentId,
            sessionId,
            status,
            details,
            timestamp: new Date()
        };
        
        // 获取或创建代理的状态记录列表
        if (!this.statusRecords.has(agentId)) {
            this.statusRecords.set(agentId, []);
        }
        
        this.statusRecords.get(agentId)!.push(record);
        
        // 触发状态变更事件
        this.recordHistoryEvent(
            agentId,
            sessionId,
            TAgentHistoryEventType.CUSTOM,
            `状态变更为 ${status}`,
            details
        );
        
        return record.id;
    }
    
    /**
     * 记录性能指标
     * 
     * @param agentId 代理ID
     * @param sessionId 会话ID
     * @param type 指标类型
     * @param value 指标值
     * @param unit 单位
     * @param name 指标名称（针对自定义指标）
     * @param messageId 相关消息ID
     * @returns 性能指标记录ID
     */
    public recordPerformanceMetric(
        agentId: string,
        sessionId: string,
        type: TPerformanceMetricType,
        value: number,
        unit?: string,
        name?: string,
        messageId?: string
    ): string {
        const metric: IPerformanceMetric = {
            id: uuidv4(),
            agentId,
            sessionId,
            type,
            name: type === TPerformanceMetricType.CUSTOM ? name : undefined,
            value,
            unit,
            messageId,
            timestamp: new Date()
        };
        
        // 获取或创建代理的性能指标列表
        if (!this.performanceMetrics.has(agentId)) {
            this.performanceMetrics.set(agentId, []);
        }
        
        this.performanceMetrics.get(agentId)!.push(metric);
        
        return metric.id;
    }
    
    /**
     * 记录历史事件
     * 
     * @param agentId 代理ID
     * @param sessionId 会话ID
     * @param eventType 事件类型
     * @param title 事件标题
     * @param details 事件详情
     * @param messageId 相关消息ID
     * @param toolId 相关工具ID
     * @param metadata 元数据
     * @returns 历史记录ID
     */
    public recordHistoryEvent(
        agentId: string,
        sessionId: string,
        eventType: TAgentHistoryEventType,
        title: string,
        details?: string,
        messageId?: string,
        toolId?: string,
        metadata?: Record<string, any>
    ): string {
        const record: IAgentHistoryRecord = {
            id: uuidv4(),
            agentId,
            sessionId,
            eventType,
            title,
            details,
            messageId,
            toolId,
            metadata,
            timestamp: new Date()
        };
        
        // 获取或创建代理的历史记录列表
        if (!this.historyRecords.has(agentId)) {
            this.historyRecords.set(agentId, []);
        }
        
        this.historyRecords.get(agentId)!.push(record);
        
        return record.id;
    }
    
    /**
     * 代理初始化事件
     * 
     * @param agent 代理实例
     * @param sessionId 会话ID
     * @returns 历史记录ID
     */
    public agentInitialized(agent: IAgent, sessionId: string): string {
        // 记录状态变更
        this.recordStatus(
            agent.id,
            sessionId,
            agent.status,
            '代理已初始化'
        );
        
        // 记录历史事件
        return this.recordHistoryEvent(
            agent.id,
            sessionId,
            TAgentHistoryEventType.INITIALIZED,
            '代理初始化',
            `代理 ${agent.name} (${agent.role}) 已初始化`,
            undefined,
            undefined,
            {
                agentName: agent.name,
                agentRole: agent.role,
                modelType: agent.model
            }
        );
    }
    
    /**
     * 代理启动事件
     * 
     * @param agent 代理实例
     * @param sessionId 会话ID
     * @returns 历史记录ID
     */
    public agentStarted(agent: IAgent, sessionId: string): string {
        // 记录状态变更
        this.recordStatus(
            agent.id,
            sessionId,
            agent.status,
            '代理已启动'
        );
        
        // 记录历史事件
        return this.recordHistoryEvent(
            agent.id,
            sessionId,
            TAgentHistoryEventType.STARTED,
            '代理启动',
            `代理 ${agent.name} 已启动并开始工作`,
            undefined,
            undefined,
            {
                agentName: agent.name,
                startTime: new Date().toISOString()
            }
        );
    }
    
    /**
     * 代理停止事件
     * 
     * @param agent 代理实例
     * @param sessionId 会话ID
     * @param reason 停止原因
     * @returns 历史记录ID
     */
    public agentStopped(agent: IAgent, sessionId: string, reason?: string): string {
        // 记录状态变更
        this.recordStatus(
            agent.id,
            sessionId,
            agent.status,
            '代理已停止'
        );
        
        // 记录历史事件
        return this.recordHistoryEvent(
            agent.id,
            sessionId,
            TAgentHistoryEventType.STOPPED,
            '代理停止',
            reason 
                ? `代理 ${agent.name} 已停止工作: ${reason}`
                : `代理 ${agent.name} 已停止工作`,
            undefined,
            undefined,
            {
                agentName: agent.name,
                stopTime: new Date().toISOString(),
                reason
            }
        );
    }
    
    /**
     * 代理发送消息事件
     * 
     * @param agent 代理实例
     * @param sessionId 会话ID
     * @param message 消息
     * @returns 历史记录ID
     */
    public messageSent(agent: IAgent, sessionId: string, message: TMessage): string {
        // 开始计时
        const startTime = Date.now();
        
        // 记录历史事件
        const recordId = this.recordHistoryEvent(
            agent.id,
            sessionId,
            TAgentHistoryEventType.MESSAGE_SENT,
            '消息发送',
            `代理 ${agent.name} 发送了一条 ${message.type} 消息`,
            message.id,
            undefined,
            {
                messageType: message.type,
                recipientId: message.receiverId
            }
        );
        
        // 计算并记录处理时间
        const processingTime = Date.now() - startTime;
        this.recordPerformanceMetric(
            agent.id,
            sessionId,
            TPerformanceMetricType.RESPONSE_TIME,
            processingTime,
            'ms',
            '消息发送响应时间',
            message.id
        );
        
        return recordId;
    }
    
    /**
     * 代理接收消息事件
     * 
     * @param agent 代理实例
     * @param sessionId 会话ID
     * @param message 消息
     * @returns 历史记录ID
     */
    public messageReceived(agent: IAgent, sessionId: string, message: TMessage): string {
        // 记录历史事件
        return this.recordHistoryEvent(
            agent.id,
            sessionId,
            TAgentHistoryEventType.MESSAGE_RECEIVED,
            '消息接收',
            `代理 ${agent.name} 接收了一条 ${message.type} 消息`,
            message.id,
            undefined,
            {
                messageType: message.type,
                senderId: message.senderId
            }
        );
    }
    
    /**
     * 工具调用事件
     * 
     * @param agent 代理实例
     * @param sessionId 会话ID
     * @param toolId 工具ID
     * @param params 工具参数
     * @param messageId 相关消息ID
     * @returns 历史记录ID
     */
    public toolCalled(
        agent: IAgent,
        sessionId: string,
        toolId: string,
        params: any,
        messageId?: string
    ): string {
        // 记录历史事件
        return this.recordHistoryEvent(
            agent.id,
            sessionId,
            TAgentHistoryEventType.TOOL_CALLED,
            '工具调用',
            `代理 ${agent.name} 调用了工具 ${toolId}`,
            messageId,
            toolId,
            {
                toolId,
                params: JSON.stringify(params)
            }
        );
    }
    
    /**
     * 错误事件
     * 
     * @param agent 代理实例
     * @param sessionId 会话ID
     * @param error 错误对象
     * @param messageId 相关消息ID
     * @returns 历史记录ID
     */
    public errorOccurred(
        agent: IAgent,
        sessionId: string,
        error: Error,
        messageId?: string
    ): string {
        // 记录状态变更
        this.recordStatus(
            agent.id,
            sessionId,
            TAgentStatus.ERROR,
            `错误: ${error.message}`
        );
        
        // 记录历史事件
        return this.recordHistoryEvent(
            agent.id,
            sessionId,
            TAgentHistoryEventType.ERROR,
            '发生错误',
            `代理 ${agent.name} 遇到错误: ${error.message}`,
            messageId,
            undefined,
            {
                errorName: error.name,
                errorMessage: error.message,
                errorStack: error.stack
            }
        );
    }
    
    /**
     * 获取代理的当前状态
     * 
     * @param agentId 代理ID
     * @returns 当前状态记录，如果没有则返回null
     */
    public getCurrentStatus(agentId: string): IAgentStatusRecord | null {
        const records = this.statusRecords.get(agentId);
        
        if (!records || records.length === 0) {
            return null;
        }
        
        // 返回最新的状态记录
        return records.sort((a, b) => 
            b.timestamp.getTime() - a.timestamp.getTime()
        )[0];
    }
    
    /**
     * 获取代理的状态历史
     * 
     * @param filter 过滤条件
     * @param limit 最大记录数
     * @param offset 偏移量
     * @returns 状态记录数组
     */
    public getStatusHistory(
        filter: IAgentStateFilter,
        limit?: number,
        offset: number = 0
    ): IAgentStatusRecord[] {
        // 收集所有记录
        let allRecords: IAgentStatusRecord[] = [];
        
        // 如果指定了代理ID，只获取该代理的记录
        if (filter.agentId) {
            const records = this.statusRecords.get(filter.agentId);
            if (records) {
                allRecords = allRecords.concat(records);
            }
        } else {
            // 否则获取所有代理的记录
            for (const records of this.statusRecords.values()) {
                allRecords = allRecords.concat(records);
            }
        }
        
        // 应用过滤条件
        let filteredRecords = allRecords.filter(record => {
            // 会话ID过滤
            if (filter.sessionId && record.sessionId !== filter.sessionId) {
                return false;
            }
            
            // 状态过滤
            if (filter.status && record.status !== filter.status) {
                return false;
            }
            
            // 时间范围过滤
            if (filter.startTime && record.timestamp < filter.startTime) {
                return false;
            }
            
            if (filter.endTime && record.timestamp > filter.endTime) {
                return false;
            }
            
            return true;
        });
        
        // 按时间降序排序
        filteredRecords.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        
        // 应用分页
        if (limit !== undefined) {
            filteredRecords = filteredRecords.slice(offset, offset + limit);
        }
        
        return filteredRecords;
    }
    
    /**
     * 获取代理的性能指标
     * 
     * @param agentId 代理ID
     * @param sessionId 会话ID
     * @param type 指标类型
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @returns 性能指标记录数组
     */
    public getPerformanceMetrics(
        agentId: string,
        sessionId?: string,
        type?: TPerformanceMetricType,
        startTime?: Date,
        endTime?: Date
    ): IPerformanceMetric[] {
        const metrics = this.performanceMetrics.get(agentId);
        
        if (!metrics || metrics.length === 0) {
            return [];
        }
        
        // 应用过滤条件
        return metrics.filter(metric => {
            // 会话ID过滤
            if (sessionId && metric.sessionId !== sessionId) {
                return false;
            }
            
            // 指标类型过滤
            if (type && metric.type !== type) {
                return false;
            }
            
            // 时间范围过滤
            if (startTime && metric.timestamp < startTime) {
                return false;
            }
            
            if (endTime && metric.timestamp > endTime) {
                return false;
            }
            
            return true;
        }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
    
    /**
     * 获取代理历史记录
     * 
     * @param filter 过滤条件
     * @param limit 最大记录数
     * @param offset 偏移量
     * @returns 历史记录数组
     */
    public getHistory(
        filter: IAgentStateFilter,
        limit?: number,
        offset: number = 0
    ): IAgentHistoryRecord[] {
        // 收集所有记录
        let allRecords: IAgentHistoryRecord[] = [];
        
        // 如果指定了代理ID，只获取该代理的记录
        if (filter.agentId) {
            const records = this.historyRecords.get(filter.agentId);
            if (records) {
                allRecords = allRecords.concat(records);
            }
        } else {
            // 否则获取所有代理的记录
            for (const records of this.historyRecords.values()) {
                allRecords = allRecords.concat(records);
            }
        }
        
        // 应用过滤条件
        let filteredRecords = allRecords.filter(record => {
            // 会话ID过滤
            if (filter.sessionId && record.sessionId !== filter.sessionId) {
                return false;
            }
            
            // 时间范围过滤
            if (filter.startTime && record.timestamp < filter.startTime) {
                return false;
            }
            
            if (filter.endTime && record.timestamp > filter.endTime) {
                return false;
            }
            
            return true;
        });
        
        // 按时间降序排序
        filteredRecords.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        
        // 应用分页
        if (limit !== undefined) {
            filteredRecords = filteredRecords.slice(offset, offset + limit);
        }
        
        return filteredRecords;
    }
    
    /**
     * 清除代理的状态和历史记录
     * 
     * @param agentId 代理ID
     * @param sessionId 会话ID，如果提供，只清除该会话的记录
     */
    public clearAgentState(agentId: string, sessionId?: string): void {
        if (sessionId) {
            // 只清除特定会话的记录
            const statusRecords = this.statusRecords.get(agentId);
            if (statusRecords) {
                this.statusRecords.set(
                    agentId,
                    statusRecords.filter(record => record.sessionId !== sessionId)
                );
            }
            
            const performanceMetrics = this.performanceMetrics.get(agentId);
            if (performanceMetrics) {
                this.performanceMetrics.set(
                    agentId,
                    performanceMetrics.filter(metric => metric.sessionId !== sessionId)
                );
            }
            
            const historyRecords = this.historyRecords.get(agentId);
            if (historyRecords) {
                this.historyRecords.set(
                    agentId,
                    historyRecords.filter(record => record.sessionId !== sessionId)
                );
            }
        } else {
            // 清除代理的所有记录
            this.statusRecords.delete(agentId);
            this.performanceMetrics.delete(agentId);
            this.historyRecords.delete(agentId);
        }
    }
    
    /**
     * 获取性能摘要
     * 
     * @param agentId 代理ID
     * @param sessionId 会话ID
     * @returns 性能指标摘要
     */
    public getPerformanceSummary(
        agentId: string,
        sessionId?: string
    ): Record<string, { avg: number, min: number, max: number, count: number }> {
        const metrics = this.getPerformanceMetrics(agentId, sessionId);
        
        if (metrics.length === 0) {
            return {};
        }
        
        // 按类型分组
        const groupedMetrics: Record<string, IPerformanceMetric[]> = {};
        
        for (const metric of metrics) {
            const key = metric.type;
            if (!groupedMetrics[key]) {
                groupedMetrics[key] = [];
            }
            groupedMetrics[key].push(metric);
        }
        
        // 计算每种类型的摘要
        const summary: Record<string, { avg: number, min: number, max: number, count: number }> = {};
        
        for (const [type, typeMetrics] of Object.entries(groupedMetrics)) {
            const values = typeMetrics.map(m => m.value);
            const count = values.length;
            const sum = values.reduce((a, b) => a + b, 0);
            const min = Math.min(...values);
            const max = Math.max(...values);
            const avg = sum / count;
            
            summary[type] = { avg, min, max, count };
        }
        
        return summary;
    }
}

/**
 * 代理状态服务实例
 */
export const agentStateService = AgentStateService.getInstance(); 