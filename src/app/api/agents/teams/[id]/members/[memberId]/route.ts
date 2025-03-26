import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import agentTeamService, { MemberRole } from '@/services/agent-team-service';

/**
 * 更新团队成员
 * PUT /api/agents/teams/[id]/members/[memberId]
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string, memberId: string } }
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
        
        // 检查成员是否存在
        const member = team.members.find(m => m.id === params.memberId);
        if (!member) {
            return NextResponse.json(
                { success: false, error: '团队成员不存在' },
                { status: 404 }
            );
        }
        
        // 获取请求体
        const body = await request.json();
        
        // 验证角色（如果提供）
        if (body.role && !Object.values(MemberRole).includes(body.role)) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: `无效的成员角色，有效角色: ${Object.values(MemberRole).join(', ')}` 
                },
                { status: 400 }
            );
        }
        
        // 更新团队成员
        await agentTeamService.updateTeamMember(params.memberId, {
            role: body.role,
            position: body.position,
            isRequired: body.isRequired,
            metadata: body.metadata
        });
        
        // 获取更新后的团队详情
        const updatedTeam = await agentTeamService.getTeam(params.id);
        
        // 查找更新后的成员
        const updatedMember = updatedTeam?.members.find(m => m.id === params.memberId);
        
        return NextResponse.json({ 
            success: true, 
            data: {
                team: updatedTeam,
                member: updatedMember
            }
        });
    } catch (error) {
        console.error('更新团队成员失败:', error);
        return NextResponse.json(
            { success: false, error: '更新团队成员失败' },
            { status: 500 }
        );
    }
}

/**
 * 删除团队成员
 * DELETE /api/agents/teams/[id]/members/[memberId]
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string, memberId: string } }
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
        
        // 检查成员是否存在
        const member = team.members.find(m => m.id === params.memberId);
        if (!member) {
            return NextResponse.json(
                { success: false, error: '团队成员不存在' },
                { status: 404 }
            );
        }
        
        // 删除团队成员
        await agentTeamService.removeTeamMember(params.memberId);
        
        // 获取更新后的团队详情
        const updatedTeam = await agentTeamService.getTeam(params.id);
        
        return NextResponse.json({ 
            success: true, 
            data: {
                team: updatedTeam,
                message: '成员已成功移除'
            }
        });
    } catch (error) {
        console.error('删除团队成员失败:', error);
        return NextResponse.json(
            { success: false, error: '删除团队成员失败' },
            { status: 500 }
        );
    }
} 