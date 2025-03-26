import { NextRequest, NextResponse } from 'next/server';
import { agentInteractionService, IInteractionFilter } from '@/services/agent-interaction-service';

/**
 * 获取代理交互历史列表
 * 
 * @param request 请求对象
 * @param params 路由参数，包含代理ID
 * @returns 响应对象
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const agentId = params.id;
        if (!agentId) {
            return NextResponse.json(
                { success: false, error: '缺少代理ID' },
                { status: 400 }
            );
        }

        // 获取查询参数
        const searchParams = request.nextUrl.searchParams;
        const sessionId = searchParams.get('sessionId');
        const taskId = searchParams.get('taskId');
        const startDateStr = searchParams.get('startDate');
        const endDateStr = searchParams.get('endDate');
        const typesStr = searchParams.get('types');
        const keywordsStr = searchParams.get('keywords');
        const limitStr = searchParams.get('limit');
        const offsetStr = searchParams.get('offset');

        // 构建过滤条件
        const filter: IInteractionFilter = { agentId };

        // 添加可选过滤条件
        if (sessionId) filter.sessionId = sessionId;
        if (taskId) filter.taskId = taskId;
        if (startDateStr) filter.startDate = new Date(startDateStr);
        if (endDateStr) filter.endDate = new Date(endDateStr);
        if (typesStr) filter.types = typesStr.split(',');
        if (keywordsStr) filter.keywords = keywordsStr.split(',');
        if (limitStr) filter.limit = parseInt(limitStr);
        if (offsetStr) filter.offset = parseInt(offsetStr);

        // 获取交互历史数据
        const result = await agentInteractionService.getInteractions(filter);

        return NextResponse.json({
            success: true,
            data: result.interactions,
            meta: result.meta
        });
    } catch (error) {
        console.error('获取代理交互历史失败:', error);
        return NextResponse.json(
            { success: false, error: '获取代理交互历史失败' },
            { status: 500 }
        );
    }
}

/**
 * 获取代理交互历史统计信息
 * 
 * @param request 请求对象
 * @param params 路由参数，包含代理ID
 * @returns 响应对象
 */
export async function HEAD(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const agentId = params.id;
        if (!agentId) {
            return NextResponse.json(
                { success: false, error: '缺少代理ID' },
                { status: 400 }
            );
        }

        // 获取查询参数
        const searchParams = request.nextUrl.searchParams;
        const timeRangeStr = searchParams.get('timeRange');
        const timeRange = timeRangeStr ? parseInt(timeRangeStr) : 30;

        // 获取统计数据
        const stats = await agentInteractionService.getInteractionStats(agentId, timeRange);

        return NextResponse.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('获取代理交互统计失败:', error);
        return NextResponse.json(
            { success: false, error: '获取代理交互统计失败' },
            { status: 500 }
        );
    }
} 