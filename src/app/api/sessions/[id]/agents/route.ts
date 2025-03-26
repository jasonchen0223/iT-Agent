/**
 * 会话代理API路由
 * 
 * 负责获取会话中的代理和向会话添加代理
 */
import { NextRequest, NextResponse } from 'next/server';
import { sessionService } from '@/lib/session-service';

interface IParams {
    id: string;
}

/**
 * 获取会话中的代理
 * 
 * @param {NextRequest} request - 请求对象
 * @param {Object} params - 路由参数
 * @returns {NextResponse} 响应对象
 */
export async function GET(
    request: NextRequest,
    { params }: { params: IParams }
) {
    try {
        const sessionId = params.id;
        
        // 获取会话
        const session = await sessionService.getSession(sessionId);
        
        if (!session) {
            return NextResponse.json(
                { success: false, error: '会话不存在' },
                { status: 404 }
            );
        }
        
        // 返回会话中的代理
        return NextResponse.json({
            success: true,
            data: session.agents
        });
    } catch (error) {
        console.error('获取会话代理错误:', error);
        return NextResponse.json(
            { success: false, error: '请求处理失败' },
            { status: 500 }
        );
    }
}

/**
 * 向会话添加代理
 * 
 * @param {NextRequest} request - 请求对象
 * @param {Object} params - 路由参数
 * @returns {NextResponse} 响应对象
 */
export async function POST(
    request: NextRequest,
    { params }: { params: IParams }
) {
    try {
        const sessionId = params.id;
        
        // 解析请求体
        const body = await request.json();
        const { name, role, description, configId } = body;
        
        // 验证必要参数
        if (!name || !role) {
            return NextResponse.json(
                { success: false, error: '代理名称和角色不能为空' },
                { status: 400 }
            );
        }
        
        // 获取会话，确保存在
        const session = await sessionService.getSession(sessionId);
        
        if (!session) {
            return NextResponse.json(
                { success: false, error: '会话不存在' },
                { status: 404 }
            );
        }
        
        // 添加代理
        const agent = await sessionService.addAgentToSession(
            sessionId,
            name,
            role,
            description || '',
            configId
        );
        
        // 返回添加的代理
        return NextResponse.json({
            success: true,
            data: agent
        }, { status: 201 });
    } catch (error) {
        console.error('添加会话代理错误:', error);
        return NextResponse.json(
            { success: false, error: '代理添加失败' },
            { status: 500 }
        );
    }
} 