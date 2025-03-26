/**
 * 工具调用日志服务
 * 
 * 记录和查询工具调用历史
 */
import { v4 as uuidv4 } from 'uuid';

/**
 * 工具调用日志接口
 */
export interface IToolCallLog {
    /**
     * 日志ID
     */
    id: string;
    
    /**
     * 工具ID
     */
    toolId: string;
    
    /**
     * 会话ID
     */
    sessionId: string;
    
    /**
     * 代理ID
     */
    agentId: string;
    
    /**
     * 调用参数
     */
    params: any;
    
    /**
     * 调用结果
     */
    result?: any;
    
    /**
     * 错误信息
     */
    error?: string;
    
    /**
     * 调用开始时间
     */
    startTime: Date;
    
    /**
     * 调用结束时间
     */
    endTime: Date;
    
    /**
     * 执行时间(毫秒)
     */
    executionTime: number;
    
    /**
     * 调用状态
     */
    status: 'success' | 'error';
}

/**
 * 工具调用日志过滤条件接口
 */
export interface IToolLogFilter {
    /**
     * 工具ID
     */
    toolId?: string;
    
    /**
     * 会话ID
     */
    sessionId?: string;
    
    /**
     * 代理ID
     */
    agentId?: string;
    
    /**
     * 起始时间
     */
    startTime?: Date;
    
    /**
     * 结束时间
     */
    endTime?: Date;
    
    /**
     * 调用状态
     */
    status?: 'success' | 'error';
}

/**
 * 工具调用日志服务类
 * 
 * 管理工具调用日志的记录和查询
 */
class ToolLogService {
    // 使用内存存储日志，实际应用中应该使用数据库
    private logs: IToolCallLog[] = [];
    
    /**
     * 记录工具调用开始
     * 
     * @param toolId 工具ID
     * @param sessionId 会话ID
     * @param agentId 代理ID
     * @param params 调用参数
     * @returns 日志ID
     */
    startToolCall(toolId: string, sessionId: string, agentId: string, params: any): string {
        const logId = uuidv4();
        const now = new Date();
        
        const log: IToolCallLog = {
            id: logId,
            toolId,
            sessionId,
            agentId,
            params,
            startTime: now,
            endTime: now,
            executionTime: 0,
            status: 'success'
        };
        
        this.logs.push(log);
        return logId;
    }
    
    /**
     * 记录工具调用结束
     * 
     * @param logId 日志ID
     * @param result 调用结果
     * @param error 错误信息
     */
    endToolCall(logId: string, result?: any, error?: Error): void {
        const log = this.logs.find(l => l.id === logId);
        
        if (!log) {
            console.error(`未找到工具调用日志: ${logId}`);
            return;
        }
        
        const endTime = new Date();
        log.endTime = endTime;
        log.executionTime = endTime.getTime() - log.startTime.getTime();
        
        if (error) {
            log.status = 'error';
            log.error = error.message;
        } else {
            log.status = 'success';
            log.result = result;
        }
    }
    
    /**
     * 查询工具调用日志
     * 
     * @param filter 过滤条件
     * @returns 日志数组
     */
    queryLogs(filter?: IToolLogFilter): IToolCallLog[] {
        if (!filter) {
            return [...this.logs];
        }
        
        return this.logs.filter(log => {
            if (filter.toolId && log.toolId !== filter.toolId) {
                return false;
            }
            
            if (filter.sessionId && log.sessionId !== filter.sessionId) {
                return false;
            }
            
            if (filter.agentId && log.agentId !== filter.agentId) {
                return false;
            }
            
            if (filter.status && log.status !== filter.status) {
                return false;
            }
            
            if (filter.startTime && log.startTime < filter.startTime) {
                return false;
            }
            
            if (filter.endTime && log.endTime > filter.endTime) {
                return false;
            }
            
            return true;
        });
    }
    
    /**
     * 获取最近的工具调用日志
     * 
     * @param count 日志数量
     * @returns 日志数组
     */
    getRecentLogs(count: number = 10): IToolCallLog[] {
        return [...this.logs]
            .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
            .slice(0, count);
    }
    
    /**
     * 获取会话的工具调用日志
     * 
     * @param sessionId 会话ID
     * @returns 日志数组
     */
    getSessionLogs(sessionId: string): IToolCallLog[] {
        return this.logs.filter(log => log.sessionId === sessionId);
    }
    
    /**
     * 清除过期日志
     * 
     * @param days 保留天数
     */
    clearOldLogs(days: number = 30): void {
        const cutoffTime = new Date();
        cutoffTime.setDate(cutoffTime.getDate() - days);
        
        this.logs = this.logs.filter(log => log.startTime >= cutoffTime);
    }
}

// 创建工具日志服务实例
export const toolLogService = new ToolLogService(); 