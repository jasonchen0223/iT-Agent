/**
 * 单个会话API路由
 * 
 * 负责获取、更新和删除特定会话
 */
import { NextRequest, NextResponse } from 'next/server';
import { sessionService } from '@/lib/session-service';

interface IParams {
    id: string;
}

/**
 * 获取单个会话详情
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
        
        // 获取会话详情
        const session = await sessionService.getSession(sessionId);
        
        // 如果会话不存在
        if (!session) {
            return NextResponse.json(
                { success: false, error: '会话不存在' },
                { status: 404 }
            );
        }
        
        // 返回会话详情
        return NextResponse.json({
            success: true,
            data: session
        });
    } catch (error) {
        console.error('获取会话详情错误:', error);
        return NextResponse.json(
            { success: false, error: '请求处理失败' },
            { status: 500 }
        );
    }
}

/**
 * 更新会话状态
 * 
 * @param {NextRequest} request - 请求对象
 * @param {Object} params - 路由参数
 * @returns {NextResponse} 响应对象
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: IParams }
) {
    try {
        const sessionId = params.id;
        
        // 解析请求体
        const body = await request.json();
        const { status, name, sessionState } = body;
        
        // 先获取会话，确保存在
        const existingSession = await sessionService.getSession(sessionId);
        
        if (!existingSession) {
            return NextResponse.json(
                { success: false, error: '会话不存在' },
                { status: 404 }
            );
        }
        
        // 更新会话状态
        if (sessionState) {
            await sessionService.updateSessionState(sessionId, sessionState);
        }
        
        // TODO: 实现会话基本信息更新
        // 当前只返回最新的会话信息
        const updatedSession = await sessionService.getSession(sessionId);
        
        return NextResponse.json({
            success: true,
            data: updatedSession
        });
    } catch (error) {
        console.error('更新会话错误:', error);
        return NextResponse.json(
            { success: false, error: '会话更新失败' },
            { status: 500 }
        );
    }
}

/**
 * 删除会话
 * 
 * @param {NextRequest} request - 请求对象
 * @param {Object} params - 路由参数
 * @returns {NextResponse} 响应对象
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: IParams }
) {
    try {
        const sessionId = params.id;
        
        // 删除会话
        const success = await sessionService.deleteSession(sessionId);
        
        if (!success) {
            return NextResponse.json(
                { success: false, error: '会话不存在或删除失败' },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            success: true,
            message: '会话已成功删除'
        });
    } catch (error) {
        console.error('删除会话错误:', error);
        return NextResponse.json(
            { success: false, error: '会话删除失败' },
            { status: 500 }
        );
    }
} 