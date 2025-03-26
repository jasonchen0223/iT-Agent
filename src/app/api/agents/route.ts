/**
 * 代理API路由
 * 
 * 提供代理相关操作的API端点
 */
import { NextRequest, NextResponse } from 'next/server';
import agentService from '../../../lib/agent-service';
import { v4 as uuidv4 } from 'uuid';

/**
 * GET处理程序
 * 
 * 获取所有会话或指定会话的代理
 */
export async function GET(request: NextRequest) {
    try {
        // 获取查询参数
        const searchParams = request.nextUrl.searchParams;
        const sessionId = searchParams.get('sessionId');
        
        // 如果提供了会话ID，则获取该会话的代理
        if (sessionId) {
            const agents = agentService.getSessionAgents(sessionId);
            
            if (agents.length === 0) {
                return NextResponse.json(
                    { success: false, error: '会话不存在或会话中没有代理' }, 
                    { status: 404 }
                );
            }
            
            // 转换为安全的JSON格式
            const safeAgents = agents.map(agent => ({
                id: agent.config.id,
                name: agent.config.name,
                role: agent.config.role,
                description: agent.config.description,
                status: agent.status,
                color: agent.config.color,
                icon: agent.config.icon,
            }));
            
            return NextResponse.json({ success: true, data: safeAgents });
        }
        
        // 否则获取所有会话
        const sessions = agentService.getAllSessions();
        
        return NextResponse.json({ 
            success: true, 
            data: sessions.map(session => ({
                id: session.id,
                name: session.name,
                description: session.description,
                agentCount: session.agents.length,
                createdAt: session.createdAt,
            })) 
        });
    } catch (error) {
        console.error('获取代理失败:', error);
        return NextResponse.json(
            { success: false, error: '获取代理失败' }, 
            { status: 500 }
        );
    }
}

/**
 * POST处理程序
 * 
 * 创建新会话或在会话中发送消息
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // 检查是否是创建会话请求
        if (body.action === 'create_session') {
            // 创建新会话
            const sessionConfig = body.config || {};
            const sessionId = agentService.createSession(sessionConfig);
            
            const session = agentService.getSession(sessionId);
            
            return NextResponse.json({ 
                success: true, 
                data: {
                    id: session!.id,
                    name: session!.name,
                    description: session!.description,
                    agentCount: session!.agents.length,
                    createdAt: session!.createdAt,
                }
            });
        }
        
        // 检查是否是发送消息请求
        if (body.action === 'send_message') {
            // 验证参数
            if (!body.sessionId || !body.query) {
                return NextResponse.json(
                    { success: false, error: '缺少必要参数' }, 
                    { status: 400 }
                );
            }
            
            // 启动AutoGen会话
            const result = await agentService.startPythonAutoGenSession(
                body.sessionId,
                body.query
            );
            
            return NextResponse.json({ success: true, data: result });
        }
        
        // 未知操作
        return NextResponse.json(
            { success: false, error: '未知操作' }, 
            { status: 400 }
        );
    } catch (error) {
        console.error('代理操作失败:', error);
        return NextResponse.json(
            { success: false, error: '代理操作失败' }, 
            { status: 500 }
        );
    }
} 