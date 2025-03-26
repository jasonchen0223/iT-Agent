/**
 * 代理监控服务
 * 
 * 提供代理运行状态和性能的监控功能，包括实时监控和告警
 */
import { v4 as uuidv4 } from 'uuid';
import { IAgent, TAgentStatus } from '@/types/agent-types';
import { TMessage } from '@/types/message-types';
import { 
    IAgentHistoryRecord, 
    IPerformanceMetric, 
    TPerformanceMetricType,
    agentStateService
} from './agent-state-service';

/**
 * 告警级别
 */
export enum TAlertLevel {
    /**
     * 信息级别
     */
    INFO = 'info',
    
    /**
     * 警告级别
     */
    WARNING = 'warning',
    
    /**
     * 错误级别
     */
    ERROR = 'error',
    
    /**
     * 严重级别
     */
    CRITICAL = 'critical'
}

/**
 * 监控指标阈值配置
 */
export interface IMetricThreshold {
    /**
     * 指标类型
     */
    metricType: TPerformanceMetricType;
    
    /**
     * 指标名称（针对自定义指标）
     */
    metricName?: string;
    
    /**
     * 警告阈值
     */
    warningThreshold?: number;
    
    /**
     * 错误阈值
     */
    errorThreshold?: number;
    
    /**
     * 严重阈值
     */
    criticalThreshold?: number;
    
    /**
     * 比较方式
     * greater: 大于阈值时触发
     * less: 小于阈值时触发
     */
    comparison: 'greater' | 'less';
}

/**
 * 告警配置
 */
export interface IAlertConfig {
    /**
     * 配置ID
     */
    id: string;
    
    /**
     * 配置名称
     */
    name: string;
    
    /**
     * 代理ID，如果为空则适用于所有代理
     */
    agentId?: string;
    
    /**
     * 会话ID，如果为空则适用于所有会话
     */
    sessionId?: string;
    
    /**
     * 指标阈值配置
     */
    thresholds: IMetricThreshold[];
    
    /**
     * 是否启用
     */
    enabled: boolean;
    
    /**
     * 告警间隔（秒），防止告警风暴
     */
    alertInterval: number;
    
    /**
     * 上次告警时间
     */
    lastAlertTime?: Date;
    
    /**
     * 通知方式
     */
    notificationMethods: ('console' | 'ui' | 'webhook')[];
    
    /**
     * Webhook URL（如果通知方式包含webhook）
     */
    webhookUrl?: string;
}

/**
 * 告警记录
 */
export interface IAlertRecord {
    /**
     * 记录ID
     */
    id: string;
    
    /**
     * 告警配置ID
     */
    alertConfigId: string;
    
    /**
     * 代理ID
     */
    agentId: string;
    
    /**
     * 会话ID
     */
    sessionId: string;
    
    /**
     * 告警级别
     */
    level: TAlertLevel;
    
    /**
     * 告警消息
     */
    message: string;
    
    /**
     * 触发指标
     */
    triggerMetric: TPerformanceMetricType;
    
    /**
     * 指标值
     */
    metricValue: number;
    
    /**
     * 阈值
     */
    threshold: number;
    
    /**
     * 创建时间
     */
    timestamp: Date;
    
    /**
     * 是否已处理
     */
    resolved: boolean;
    
    /**
     * 处理时间
     */
    resolvedAt?: Date;
    
    /**
     * 处理备注
     */
    resolution?: string;
}

/**
 * 监控订阅回调函数
 */
export type TMonitorCallback = (
    agent: IAgent, 
    sessionId: string, 
    metrics: IPerformanceMetric[], 
    alerts: IAlertRecord[]
) => void;

/**
 * 代理监控服务
 */
export class AgentMonitorService {
    /**
     * 告警配置列表
     */
    private alertConfigs: Map<string, IAlertConfig> = new Map();
    
    /**
     * 告警记录列表
     */
    private alertRecords: Map<string, IAlertRecord[]> = new Map();
    
    /**
     * 监控订阅列表
     */
    private subscriptions: Map<string, TMonitorCallback> = new Map();
    
    /**
     * 监控间隔（毫秒）
     */
    private monitorInterval: number = 5000;
    
    /**
     * 监控计时器ID
     */
    private timerId: NodeJS.Timeout | null = null;
    
    /**
     * 正在监控的代理列表
     */
    private monitoredAgents: Set<string> = new Set();
    
    /**
     * 单例实例
     */
    private static instance: AgentMonitorService;
    
    /**
     * 获取服务实例
     */
    public static getInstance(): AgentMonitorService {
        if (!AgentMonitorService.instance) {
            AgentMonitorService.instance = new AgentMonitorService();
        }
        return AgentMonitorService.instance;
    }
    
    /**
     * 私有构造函数
     */
    private constructor() {
        console.log('代理监控服务初始化');
        this.initializeDefaultAlertConfigs();
    }
    
    /**
     * 初始化默认告警配置
     */
    private initializeDefaultAlertConfigs(): void {
        // 响应时间告警配置
        const responseTimeAlert: IAlertConfig = {
            id: 'alert-response-time',
            name: '响应时间告警',
            thresholds: [
                {
                    metricType: TPerformanceMetricType.RESPONSE_TIME,
                    warningThreshold: 5000,   // 5秒
                    errorThreshold: 10000,    // 10秒
                    criticalThreshold: 30000, // 30秒
                    comparison: 'greater'
                }
            ],
            enabled: true,
            alertInterval: 60, // 60秒
            notificationMethods: ['console', 'ui']
        };
        
        // 错误率告警配置
        const errorRateAlert: IAlertConfig = {
            id: 'alert-error-rate',
            name: '错误率告警',
            thresholds: [
                {
                    metricType: TPerformanceMetricType.ERROR_RATE,
                    warningThreshold: 5,  // 5%
                    errorThreshold: 10,   // 10%
                    criticalThreshold: 20, // 20%
                    comparison: 'greater'
                }
            ],
            enabled: true,
            alertInterval: 300, // 5分钟
            notificationMethods: ['console', 'ui']
        };
        
        // 内存使用告警配置
        const memoryUsageAlert: IAlertConfig = {
            id: 'alert-memory-usage',
            name: '内存使用告警',
            thresholds: [
                {
                    metricType: TPerformanceMetricType.MEMORY_USAGE,
                    warningThreshold: 200,  // 200MB
                    errorThreshold: 500,    // 500MB
                    criticalThreshold: 1000, // 1000MB
                    comparison: 'greater'
                }
            ],
            enabled: true,
            alertInterval: 300, // 5分钟
            notificationMethods: ['console', 'ui']
        };
        
        // 添加默认配置
        this.alertConfigs.set(responseTimeAlert.id, responseTimeAlert);
        this.alertConfigs.set(errorRateAlert.id, errorRateAlert);
        this.alertConfigs.set(memoryUsageAlert.id, memoryUsageAlert);
    }
    
    /**
     * 开始监控代理
     * 
     * @param agent 代理实例
     * @param sessionId 会话ID
     */
    public startMonitoring(agent: IAgent, sessionId: string): void {
        const monitorKey = `${agent.id}-${sessionId}`;
        
        // 添加到监控列表
        this.monitoredAgents.add(monitorKey);
        
        // 如果没有启动监控计时器，则启动
        if (!this.timerId) {
            this.timerId = setInterval(() => {
                this.checkMetrics();
            }, this.monitorInterval);
        }
        
        console.log(`开始监控代理 ${agent.name} (${agent.id}) 在会话 ${sessionId} 中的状态`);
    }
    
    /**
     * 停止监控代理
     * 
     * @param agentId 代理ID
     * @param sessionId 会话ID
     */
    public stopMonitoring(agentId: string, sessionId: string): void {
        const monitorKey = `${agentId}-${sessionId}`;
        
        // 从监控列表中移除
        this.monitoredAgents.delete(monitorKey);
        
        // 如果没有需要监控的代理，停止计时器
        if (this.monitoredAgents.size === 0 && this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
        
        console.log(`停止监控代理 ${agentId} 在会话 ${sessionId} 中的状态`);
    }
    
    /**
     * 检查指标并触发告警
     */
    private checkMetrics(): void {
        // 遍历所有被监控的代理
        for (const monitorKey of this.monitoredAgents) {
            const [agentId, sessionId] = monitorKey.split('-');
            
            // 获取代理的性能指标
            const metrics = agentStateService.getPerformanceMetrics(
                agentId,
                sessionId,
                undefined,
                // 获取最近5分钟的指标
                new Date(Date.now() - 5 * 60 * 1000)
            );
            
            // 检查指标是否触发告警
            const alerts = this.checkAlertsForMetrics(agentId, sessionId, metrics);
            
            // 如果有告警，通知订阅者
            if (alerts.length > 0) {
                this.notifySubscribers(agentId, sessionId, metrics, alerts);
            }
        }
    }
    
    /**
     * 检查指标是否触发告警
     * 
     * @param agentId 代理ID
     * @param sessionId 会话ID
     * @param metrics 性能指标列表
     * @returns 触发的告警列表
     */
    private checkAlertsForMetrics(
        agentId: string,
        sessionId: string,
        metrics: IPerformanceMetric[]
    ): IAlertRecord[] {
        const alerts: IAlertRecord[] = [];
        
        // 遍历所有告警配置
        for (const config of this.alertConfigs.values()) {
            // 如果配置未启用，跳过
            if (!config.enabled) {
                continue;
            }
            
            // 如果配置指定了代理ID，但与当前代理不匹配，跳过
            if (config.agentId && config.agentId !== agentId) {
                continue;
            }
            
            // 如果配置指定了会话ID，但与当前会话不匹配，跳过
            if (config.sessionId && config.sessionId !== sessionId) {
                continue;
            }
            
            // 检查是否在告警间隔内
            if (config.lastAlertTime) {
                const timeSinceLastAlert = (Date.now() - config.lastAlertTime.getTime()) / 1000;
                if (timeSinceLastAlert < config.alertInterval) {
                    continue;
                }
            }
            
            // 检查每个阈值配置
            for (const threshold of config.thresholds) {
                // 过滤出匹配的指标
                const matchingMetrics = metrics.filter(m => {
                    if (m.type !== threshold.metricType) {
                        return false;
                    }
                    
                    if (threshold.metricType === TPerformanceMetricType.CUSTOM && 
                        threshold.metricName && 
                        m.name !== threshold.metricName) {
                        return false;
                    }
                    
                    return true;
                });
                
                // 如果没有匹配的指标，跳过
                if (matchingMetrics.length === 0) {
                    continue;
                }
                
                // 计算平均值
                const values = matchingMetrics.map(m => m.value);
                const avgValue = values.reduce((a, b) => a + b, 0) / values.length;
                
                // 根据比较方式检查是否超过阈值
                const checkThreshold = (value: number, thresholdValue?: number): boolean => {
                    if (thresholdValue === undefined) {
                        return false;
                    }
                    
                    return threshold.comparison === 'greater' 
                        ? value > thresholdValue 
                        : value < thresholdValue;
                };
                
                // 确定告警级别
                let alertLevel: TAlertLevel | null = null;
                let thresholdValue: number | undefined;
                
                if (checkThreshold(avgValue, threshold.criticalThreshold)) {
                    alertLevel = TAlertLevel.CRITICAL;
                    thresholdValue = threshold.criticalThreshold;
                } else if (checkThreshold(avgValue, threshold.errorThreshold)) {
                    alertLevel = TAlertLevel.ERROR;
                    thresholdValue = threshold.errorThreshold;
                } else if (checkThreshold(avgValue, threshold.warningThreshold)) {
                    alertLevel = TAlertLevel.WARNING;
                    thresholdValue = threshold.warningThreshold;
                }
                
                // 如果触发告警，创建告警记录
                if (alertLevel && thresholdValue !== undefined) {
                    const metricName = threshold.metricType === TPerformanceMetricType.CUSTOM
                        ? threshold.metricName || '自定义指标'
                        : threshold.metricType;
                    
                    const comparisonText = threshold.comparison === 'greater' ? '超过' : '低于';
                    
                    const alertRecord: IAlertRecord = {
                        id: uuidv4(),
                        alertConfigId: config.id,
                        agentId,
                        sessionId,
                        level: alertLevel,
                        message: `代理 ${agentId} 的 ${metricName} 指标 ${comparisonText} ${thresholdValue} 阈值，当前值为 ${avgValue.toFixed(2)}`,
                        triggerMetric: threshold.metricType,
                        metricValue: avgValue,
                        threshold: thresholdValue,
                        timestamp: new Date(),
                        resolved: false
                    };
                    
                    // 添加到告警记录
                    if (!this.alertRecords.has(agentId)) {
                        this.alertRecords.set(agentId, []);
                    }
                    this.alertRecords.get(agentId)!.push(alertRecord);
                    
                    // 更新最后告警时间
                    config.lastAlertTime = new Date();
                    
                    // 根据通知方式发送告警
                    this.sendAlert(alertRecord, config);
                    
                    // 添加到返回列表
                    alerts.push(alertRecord);
                }
            }
        }
        
        return alerts;
    }
    
    /**
     * 发送告警
     * 
     * @param alert 告警记录
     * @param config 告警配置
     */
    private sendAlert(alert: IAlertRecord, config: IAlertConfig): void {
        // 控制台通知
        if (config.notificationMethods.includes('console')) {
            const levelColorMap: Record<TAlertLevel, string> = {
                [TAlertLevel.INFO]: '\x1b[34m', // 蓝色
                [TAlertLevel.WARNING]: '\x1b[33m', // 黄色
                [TAlertLevel.ERROR]: '\x1b[31m', // 红色
                [TAlertLevel.CRITICAL]: '\x1b[41m\x1b[37m', // 红底白字
            };
            
            const resetColor = '\x1b[0m';
            const color = levelColorMap[alert.level] || '';
            
            console.log(`${color}[${alert.level.toUpperCase()}]${resetColor} ${alert.message}`);
        }
        
        // UI通知 - 这里只记录，实际显示由UI组件负责
        if (config.notificationMethods.includes('ui')) {
            // UI通知将由前端订阅并显示
        }
        
        // Webhook通知
        if (config.notificationMethods.includes('webhook') && config.webhookUrl) {
            // 实际项目中，这里应该使用fetch或axios等发送HTTP请求
            console.log(`[Webhook] 发送告警到 ${config.webhookUrl}: ${alert.message}`);
            
            // 示例代码：
            /*
            fetch(config.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(alert),
            }).catch(error => {
                console.error('发送webhook通知失败:', error);
            });
            */
        }
    }
    
    /**
     * 通知监控订阅者
     * 
     * @param agentId 代理ID
     * @param sessionId 会话ID
     * @param metrics 性能指标
     * @param alerts 告警记录
     */
    private notifySubscribers(
        agentId: string,
        sessionId: string,
        metrics: IPerformanceMetric[],
        alerts: IAlertRecord[]
    ): void {
        // 获取代理实例 - 在实际项目中，应该从代理工厂或其他服务中获取
        const agent: IAgent = {
            id: agentId,
            name: `Agent ${agentId}`, // 临时名称
            status: TAgentStatus.RUNNING, // 假设正在运行
            role: 'unknown' as any, // 类型安全
            model: 'unknown' as any, // 类型安全
        };
        
        // 通知所有订阅者
        for (const callback of this.subscriptions.values()) {
            try {
                callback(agent, sessionId, metrics, alerts);
            } catch (error) {
                console.error('通知监控订阅者时出错:', error);
            }
        }
    }
    
    /**
     * 添加监控订阅
     * 
     * @param callback 回调函数
     * @returns 订阅ID
     */
    public subscribe(callback: TMonitorCallback): string {
        const subscriptionId = uuidv4();
        this.subscriptions.set(subscriptionId, callback);
        return subscriptionId;
    }
    
    /**
     * 取消监控订阅
     * 
     * @param subscriptionId 订阅ID
     */
    public unsubscribe(subscriptionId: string): void {
        this.subscriptions.delete(subscriptionId);
    }
    
    /**
     * 创建告警配置
     * 
     * @param config 配置信息
     * @returns 配置ID
     */
    public createAlertConfig(config: Omit<IAlertConfig, 'id'>): string {
        const id = uuidv4();
        const newConfig: IAlertConfig = {
            ...config,
            id
        };
        
        this.alertConfigs.set(id, newConfig);
        return id;
    }
    
    /**
     * 更新告警配置
     * 
     * @param id 配置ID
     * @param updates 更新信息
     * @returns 更新后的配置
     */
    public updateAlertConfig(id: string, updates: Partial<IAlertConfig>): IAlertConfig {
        const config = this.alertConfigs.get(id);
        
        if (!config) {
            throw new Error(`告警配置不存在: ${id}`);
        }
        
        const updatedConfig: IAlertConfig = {
            ...config,
            ...updates,
            id
        };
        
        this.alertConfigs.set(id, updatedConfig);
        return updatedConfig;
    }
    
    /**
     * 删除告警配置
     * 
     * @param id 配置ID
     * @returns 是否成功删除
     */
    public deleteAlertConfig(id: string): boolean {
        return this.alertConfigs.delete(id);
    }
    
    /**
     * 获取告警配置
     * 
     * @param id 配置ID
     * @returns 配置信息
     */
    public getAlertConfig(id: string): IAlertConfig | null {
        return this.alertConfigs.get(id) || null;
    }
    
    /**
     * 获取所有告警配置
     * 
     * @returns 配置列表
     */
    public getAllAlertConfigs(): IAlertConfig[] {
        return Array.from(this.alertConfigs.values());
    }
    
    /**
     * 获取代理的告警记录
     * 
     * @param agentId 代理ID
     * @param resolved 是否已解决
     * @param level 告警级别
     * @param limit 限制数量
     * @returns 告警记录列表
     */
    public getAlerts(
        agentId: string,
        resolved?: boolean,
        level?: TAlertLevel,
        limit?: number
    ): IAlertRecord[] {
        const records = this.alertRecords.get(agentId) || [];
        
        // 过滤
        let filtered = records;
        
        if (resolved !== undefined) {
            filtered = filtered.filter(r => r.resolved === resolved);
        }
        
        if (level) {
            filtered = filtered.filter(r => r.level === level);
        }
        
        // 按时间降序排序
        filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        
        // 应用限制
        if (limit !== undefined && limit > 0) {
            filtered = filtered.slice(0, limit);
        }
        
        return filtered;
    }
    
    /**
     * 获取所有告警记录
     * 
     * @param resolved 是否已解决
     * @param level 告警级别
     * @param limit 限制数量
     * @returns 告警记录列表
     */
    public getAllAlerts(
        resolved?: boolean,
        level?: TAlertLevel,
        limit?: number
    ): IAlertRecord[] {
        // 收集所有记录
        let allRecords: IAlertRecord[] = [];
        
        for (const records of this.alertRecords.values()) {
            allRecords = allRecords.concat(records);
        }
        
        // 过滤
        if (resolved !== undefined) {
            allRecords = allRecords.filter(r => r.resolved === resolved);
        }
        
        if (level) {
            allRecords = allRecords.filter(r => r.level === level);
        }
        
        // 按时间降序排序
        allRecords.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        
        // 应用限制
        if (limit !== undefined && limit > 0) {
            allRecords = allRecords.slice(0, limit);
        }
        
        return allRecords;
    }
    
    /**
     * 解决告警
     * 
     * @param alertId 告警ID
     * @param resolution 解决备注
     * @returns 是否成功解决
     */
    public resolveAlert(alertId: string, resolution?: string): boolean {
        // 查找告警记录
        for (const records of this.alertRecords.values()) {
            const alert = records.find(r => r.id === alertId);
            
            if (alert) {
                alert.resolved = true;
                alert.resolvedAt = new Date();
                alert.resolution = resolution;
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * 设置监控间隔
     * 
     * @param interval 间隔（毫秒）
     */
    public setMonitorInterval(interval: number): void {
        this.monitorInterval = interval;
        
        // 如果定时器正在运行，重启它
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = setInterval(() => {
                this.checkMetrics();
            }, this.monitorInterval);
        }
    }
    
    /**
     * 获取监控间隔
     * 
     * @returns 监控间隔（毫秒）
     */
    public getMonitorInterval(): number {
        return this.monitorInterval;
    }
}

/**
 * 代理监控服务实例
 */
export const agentMonitorService = AgentMonitorService.getInstance(); 