import { NextRequest, NextResponse } from 'next/server';
import { agentInteractionService } from '@/services/agent-interaction-service';

/**
 * 获取特定交互记录的详情
 * 
 * @param request 请求对象
 * @param params 路由参数，包含代理ID和交互ID
 * @returns 响应对象
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string; interactionId: string } }
) {
    try {
        const { id: agentId, interactionId } = params;
        
        if (!agentId || !interactionId) {
            return NextResponse.json(
                { success: false, error: '缺少必要参数' },
                { status: 400 }
            );
        }

        // 获取交互详情
        const detail = await agentInteractionService.getInteractionDetail(interactionId);
        
        // 验证该交互是否与指定代理相关
        if (detail.sender.id !== agentId && detail.receiver.id !== agentId) {
            return NextResponse.json(
                { success: false, error: '无权访问该交互记录' },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            data: detail
        });
    } catch (error) {
        console.error('获取交互详情失败:', error);
        return NextResponse.json(
            { success: false, error: '获取交互详情失败' },
            { status: 500 }
        );
    }
} 