import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { agentTeamService, MemberRole } from '@/services/agent-team-service';

/**
 * 添加团队成员
 * POST /api/agents/teams/[id]/members
 */
export async function POST(
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
        
        // 验证必填字段
        if (!body.configId || !body.role) {
            return NextResponse.json(
                { success: false, error: '缺少必填字段: configId, role' },
                { status: 400 }
            );
        }
        
        // 验证角色
        if (!Object.values(MemberRole).includes(body.role)) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: `无效的成员角色，有效角色: ${Object.values(MemberRole).join(', ')}` 
                },
                { status: 400 }
            );
        }
        
        // 添加团队成员
        const member = await agentTeamService.addTeamMember({
            teamId: params.id,
            configId: body.configId,
            role: body.role,
            position: body.position,
            isRequired: body.isRequired,
            metadata: body.metadata
        });
        
        // 获取更新后的团队详情
        const updatedTeam = await agentTeamService.getTeam(params.id);
        
        // 查找新添加的成员
        const addedMember = updatedTeam?.members.find(m => m.id === member.id);
        
        return NextResponse.json({ 
            success: true, 
            data: {
                team: updatedTeam,
                member: addedMember
            }
        });
    } catch (error) {
        console.error('添加团队成员失败:', error);
        return NextResponse.json(
            { success: false, error: '添加团队成员失败' },
            { status: 500 }
        );
    }
} 