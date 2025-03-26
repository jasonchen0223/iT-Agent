import { NextRequest, NextResponse } from 'next/server';
import agentCapabilityService from '@/services/agent-capability-service';

/**
 * 获取推荐代理能力
 * GET /api/agents/capabilities/recommend?role=assistant - 获取特定角色的推荐能力
 */
export async function GET(request: NextRequest) {
    try {
        // 确保服务已初始化
        await agentCapabilityService.initialize();
        
        const searchParams = request.nextUrl.searchParams;
        const role = searchParams.get('role');
        
        if (!role) {
            return NextResponse.json({ 
                success: false, 
                error: '缺少角色参数' 
            }, { status: 400 });
        }
        
        // 获取角色推荐能力
        const capabilityIds = agentCapabilityService.getRecommendedCapabilitiesForRole(role);
        
        // 获取能力详情
        const capabilities = capabilityIds.map(id => agentCapabilityService.getCapability(id)).filter(Boolean);
        
        return NextResponse.json({ 
            success: true, 
            data: {
                role,
                capabilities
            }
        });
    } catch (error) {
        console.error('获取推荐代理能力错误:', error);
        return NextResponse.json({ 
            success: false, 
            error: '获取推荐代理能力失败' 
        }, { status: 500 });
    }
} 