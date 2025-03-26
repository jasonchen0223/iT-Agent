import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import agentTeamService, { TeamType, TeamStatus } from '@/services/agent-team-service';

/**
 * 获取代理团队列表
 * GET /api/agents/teams
 */
export async function GET(request: NextRequest) {
    try {
        // 获取用户会话
        const session = await getServerSession(authOptions);
        
        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, error: '未授权访问' },
                { status: 401 }
            );
        }
        
        // 从URL中获取查询参数
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || undefined;
        const type = searchParams.get('type') as TeamType || undefined;
        const status = searchParams.get('status') || undefined;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        
        // 获取团队列表
        const teams = await agentTeamService.getTeams(
            session.user.id as string,
            { search, type, status, page, limit }
        );
        
        return NextResponse.json({ success: true, data: teams });
    } catch (error) {
        console.error('获取团队列表失败:', error);
        return NextResponse.json(
            { success: false, error: '获取团队列表失败' },
            { status: 500 }
        );
    }
}

/**
 * 创建新的代理团队
 * POST /api/agents/teams
 */
export async function POST(request: NextRequest) {
    try {
        // 获取用户会话
        const session = await getServerSession(authOptions);
        
        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, error: '未授权访问' },
                { status: 401 }
            );
        }
        
        // 获取请求体
        const body = await request.json();
        
        // 验证必填字段
        if (!body.name || !body.type) {
            return NextResponse.json(
                { success: false, error: '缺少必填字段: name, type' },
                { status: 400 }
            );
        }
        
        // 验证团队类型
        if (!Object.values(TeamType).includes(body.type)) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: `无效的团队类型，有效类型: ${Object.values(TeamType).join(', ')}` 
                },
                { status: 400 }
            );
        }
        
        // 创建团队
        const team = await agentTeamService.createTeam({
            name: body.name,
            description: body.description,
            type: body.type,
            createdBy: session.user.id as string,
            metadata: body.metadata
        });
        
        return NextResponse.json({ success: true, data: team });
    } catch (error) {
        console.error('创建团队失败:', error);
        return NextResponse.json(
            { success: false, error: '创建团队失败' },
            { status: 500 }
        );
    }
} 