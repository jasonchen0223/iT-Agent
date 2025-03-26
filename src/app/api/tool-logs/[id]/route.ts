/**
 * 工具调用日志详情API路由
 * 
 * 提供获取单个工具调用日志详情的API
 */
import { NextRequest, NextResponse } from 'next/server';
import { toolLogService } from '@/services/tool-log-service';

interface IRouteParams {
    params: {
        id: string;
    };
}

/**
 * 获取工具调用日志详情
 * 
 * @param request 请求对象
 * @param params 路由参数
 * @returns 响应对象
 */
export async function GET(
    request: NextRequest, 
    { params }: IRouteParams
) {
    try {
        const { id } = params;
        
        // 获取所有日志
        const logs = toolLogService.queryLogs();
        
        // 查找指定ID的日志
        const log = logs.find(log => log.id === id);
        
        if (!log) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: '未找到工具调用日志' 
                }, 
                { status: 404 }
            );
        }
        
        // 返回日志详情
        return NextResponse.json({ 
            success: true, 
            data: log 
        });
    } catch (error) {
        console.error('获取工具调用日志详情失败:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: '获取工具调用日志详情失败' 
            }, 
            { status: 500 }
        );
    }
} 