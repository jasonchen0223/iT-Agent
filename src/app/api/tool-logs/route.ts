/**
 * 工具调用日志API路由
 * 
 * 提供获取工具调用日志的API
 */
import { NextRequest, NextResponse } from 'next/server';
import { toolLogService, IToolLogFilter } from '@/services/tool-log-service';

/**
 * 获取工具调用日志列表
 * 
 * @param request 请求对象
 * @returns 响应对象
 */
export async function GET(request: NextRequest) {
    try {
        // 获取查询参数
        const searchParams = request.nextUrl.searchParams;
        
        // 解析过滤条件
        const filter: IToolLogFilter = {};
        
        if (searchParams.has('toolId')) {
            filter.toolId = searchParams.get('toolId') || undefined;
        }
        
        if (searchParams.has('sessionId')) {
            filter.sessionId = searchParams.get('sessionId') || undefined;
        }
        
        if (searchParams.has('agentId')) {
            filter.agentId = searchParams.get('agentId') || undefined;
        }
        
        if (searchParams.has('status')) {
            const status = searchParams.get('status');
            if (status === 'success' || status === 'error') {
                filter.status = status;
            }
        }
        
        if (searchParams.has('startTime')) {
            const startTimeStr = searchParams.get('startTime');
            if (startTimeStr) {
                filter.startTime = new Date(startTimeStr);
            }
        }
        
        if (searchParams.has('endTime')) {
            const endTimeStr = searchParams.get('endTime');
            if (endTimeStr) {
                filter.endTime = new Date(endTimeStr);
            }
        }
        
        // 获取最近日志或根据过滤条件查询
        const recent = searchParams.get('recent');
        
        let logs;
        if (recent) {
            const count = parseInt(recent, 10) || 10;
            logs = toolLogService.getRecentLogs(count);
        } else if (searchParams.has('sessionId') && Object.keys(filter).length === 1) {
            logs = toolLogService.getSessionLogs(filter.sessionId!);
        } else {
            logs = toolLogService.queryLogs(filter);
        }
        
        // 返回日志列表
        return NextResponse.json({ 
            success: true, 
            data: logs 
        });
    } catch (error) {
        console.error('获取工具调用日志失败:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: '获取工具调用日志失败' 
            }, 
            { status: 500 }
        );
    }
} 