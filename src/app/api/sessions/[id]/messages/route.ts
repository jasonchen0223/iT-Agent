/**
 * 会话消息API路由
 * 
 * 负责获取和添加会话消息
 */
import { NextRequest, NextResponse } from 'next/server';
import { sessionService } from '@/lib/session-service';

interface IParams {
    id: string;
}

/**
 * 获取会话消息
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
        
        // 返回会话消息
        return NextResponse.json({
            success: true,
            data: session.messages
        });
    } catch (error) {
        console.error('获取会话消息错误:', error);
        return NextResponse.json(
            { success: false, error: '请求处理失败' },
            { status: 500 }
        );
    }
}

/**
 * 添加会话消息
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
        const { senderId, receiverId, content, type, metadata } = body;
        
        // 验证必要参数
        if (!senderId || !content) {
            return NextResponse.json(
                { success: false, error: '消息发送者和内容不能为空' },
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
        
        // 添加消息
        const message = await sessionService.addMessageToSession(
            sessionId,
            senderId,
            receiverId || '', // 如果未指定接收者，使用空字符串
            content,
            type || 'text',
            metadata
        );
        
        // 返回添加的消息
        return NextResponse.json({
            success: true,
            data: message
        }, { status: 201 });
    } catch (error) {
        console.error('添加会话消息错误:', error);
        return NextResponse.json(
            { success: false, error: '消息添加失败' },
            { status: 500 }
        );
    }
} 