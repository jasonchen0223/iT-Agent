import { NextRequest, NextResponse } from 'next/server';
import agentCapabilityService from '@/services/agent-capability-service';

/**
 * 获取特定代理能力
 * GET /api/agents/capabilities/[id] - 获取特定ID的代理能力
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // 确保服务已初始化
        await agentCapabilityService.initialize();
        
        const id = params.id;
        const capability = agentCapabilityService.getCapability(id);
        
        if (!capability) {
            return NextResponse.json({ 
                success: false, 
                error: '未找到指定能力' 
            }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: capability });
    } catch (error) {
        console.error('获取代理能力详情错误:', error);
        return NextResponse.json({ 
            success: false, 
            error: '获取代理能力详情失败' 
        }, { status: 500 });
    }
} 