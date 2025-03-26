import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { agentTeamService, TeamType } from '@/services/agent-team-service';

/**
 * 启动团队会话
 */
export async function POST(
    request: Request,
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
        
        // 检查权限（只有创建者可以启动自己的团队）
        if (team.createdBy !== session.user.id) {
            return NextResponse.json(
                { success: false, error: '无权限启动此团队' },
                { status: 403 }
            );
        }
        
        // 获取请求体（可选）
        const body = await request.json().catch(() => ({}));
        
        // 检查团队成员
        if (!team.members || team.members.length === 0) {
            return NextResponse.json(
                { success: false, error: '团队没有成员，无法启动' },
                { status: 400 }
            );
        }
        
        // 根据团队类型检查成员数量
        if (team.type === TeamType.WORKFLOW && team.members.length < 1) {
            return NextResponse.json(
                { success: false, error: '工作流团队至少需要1个成员' },
                { status: 400 }
            );
        }
        
        if (team.type === TeamType.CONVERSATION && team.members.length < 2) {
            return NextResponse.json(
                { success: false, error: '会话团队至少需要2个成员' },
                { status: 400 }
            );
        }
        
        // 启动团队会话
        const result = await agentTeamService.startTeam({
            teamId: params.id,
            initialMessage: body.initialMessage,
            metadata: body.metadata
        });
        
        return NextResponse.json({ 
            success: true, 
            data: {
                sessionId: result.sessionId,
                teamId: result.teamId,
                teamType: result.teamType,
                message: '团队已成功启动'
            }
        });
    } catch (error) {
        console.error('启动团队失败:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : '启动团队失败' },
            { status: 500 }
        );
    }
} 