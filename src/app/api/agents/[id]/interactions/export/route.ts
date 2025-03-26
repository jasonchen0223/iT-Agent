import { NextRequest, NextResponse } from 'next/server';
import { agentInteractionService, IInteractionFilter } from '@/services/agent-interaction-service';

/**
 * 导出代理交互历史
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
        const format = (searchParams.get('format') || 'json') as 'json' | 'csv';

        // 构建过滤条件
        const filter: IInteractionFilter = { agentId };

        // 添加可选过滤条件
        if (sessionId) filter.sessionId = sessionId;
        if (taskId) filter.taskId = taskId;
        if (startDateStr) filter.startDate = new Date(startDateStr);
        if (endDateStr) filter.endDate = new Date(endDateStr);
        if (typesStr) filter.types = typesStr.split(',');
        if (keywordsStr) filter.keywords = keywordsStr.split(',');

        // 导出数据
        const exportData = await agentInteractionService.exportInteractions(filter, format);

        // 根据格式设置不同的内容类型
        const contentType = format === 'json' ? 'application/json' : 'text/csv';
        const filename = `agent-${agentId}-interactions.${format}`;

        // 返回文件下载响应
        return new NextResponse(exportData, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${filename}"`
            }
        });
    } catch (error) {
        console.error('导出代理交互历史失败:', error);
        return NextResponse.json(
            { success: false, error: '导出代理交互历史失败' },
            { status: 500 }
        );
    }
} 