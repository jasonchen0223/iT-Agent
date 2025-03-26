import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { agentTeamService, TeamType, TeamStatus } from '@/services/agent-team-service';

/**
 * 获取代理团队详情
 * GET /api/agents/teams/[id]
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // 获取用户会话
        const session = await getServerSession(authOptions);
        
        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, error: '未授权访问' },
                { status: 401 }
            );
        }
        
        // 获取团队详情
        const team = await agentTeamService.getTeam(params.id);
        
        // 检查团队是否存在
        if (!team) {
            return NextResponse.json(
                { success: false, error: '团队不存在' },
                { status: 404 }
            );
        }
        
        // 检查权限（只有创建者可以查看自己的团队）
        if (team.createdBy !== session.user.id) {
            return NextResponse.json(
                { success: false, error: '无权限访问此团队' },
                { status: 403 }
            );
        }
        
        return NextResponse.json({ success: true, data: team });
    } catch (error) {
        console.error('获取团队详情失败:', error);
        return NextResponse.json(
            { success: false, error: '获取团队详情失败' },
            { status: 500 }
        );
    }
}

/**
 * 更新代理团队
 * PUT /api/agents/teams/[id]
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // 获取用户会话
        const session = await getServerSession(authOptions);
        
        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, error: '未授权访问' },
                { status: 401 }
            );
        }
        
        // 获取团队详情
        const team = await agentTeamService.getTeam(params.id);
        
        // 检查团队是否存在
        if (!team) {
            return NextResponse.json(
                { success: false, error: '团队不存在' },
                { status: 404 }
            );
        }
        
        // 检查权限（只有创建者可以修改自己的团队）
        if (team.createdBy !== session.user.id) {
            return NextResponse.json(
                { success: false, error: '无权限修改此团队' },
                { status: 403 }
            );
        }
        
        // 获取请求体
        const body = await request.json();
        
        // 验证团队类型（如果提供）
        if (body.type && !Object.values(TeamType).includes(body.type)) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: `无效的团队类型，有效类型: ${Object.values(TeamType).join(', ')}` 
                },
                { status: 400 }
            );
        }
        
        // 验证团队状态（如果提供）
        if (body.status && !Object.values(TeamStatus).includes(body.status)) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: `无效的团队状态，有效状态: ${Object.values(TeamStatus).join(', ')}` 
                },
                { status: 400 }
            );
        }
        
        // 更新团队
        const updatedTeam = await agentTeamService.updateTeam(params.id, {
            name: body.name,
            description: body.description,
            type: body.type,
            status: body.status,
            metadata: body.metadata
        });
        
        return NextResponse.json({ success: true, data: updatedTeam });
    } catch (error) {
        console.error('更新团队失败:', error);
        return NextResponse.json(
            { success: false, error: '更新团队失败' },
            { status: 500 }
        );
    }
}

/**
 * 删除代理团队
 * DELETE /api/agents/teams/[id]
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // 获取用户会话
        const session = await getServerSession(authOptions);
        
        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, error: '未授权访问' },
                { status: 401 }
            );
        }
        
        // 获取团队详情
        const team = await agentTeamService.getTeam(params.id);
        
        // 检查团队是否存在
        if (!team) {
            return NextResponse.json(
                { success: false, error: '团队不存在' },
                { status: 404 }
            );
        }
        
        // 检查权限（只有创建者可以删除自己的团队）
        if (team.createdBy !== session.user.id) {
            return NextResponse.json(
                { success: false, error: '无权限删除此团队' },
                { status: 403 }
            );
        }
        
        // 删除团队
        await agentTeamService.deleteTeam(params.id);
        
        return NextResponse.json({ 
            success: true, 
            message: '团队已成功删除' 
        });
    } catch (error) {
        console.error('删除团队失败:', error);
        return NextResponse.json(
            { success: false, error: '删除团队失败' },
            { status: 500 }
        );
    }
} 