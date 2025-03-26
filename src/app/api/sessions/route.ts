/**
 * 会话管理API路由
 * 
 * 负责会话的创建、获取、更新和删除
 */
import { NextRequest, NextResponse } from 'next/server';
import { sessionService } from '@/lib/session-service';

/**
 * 获取当前用户的所有会话
 * 
 * @param {NextRequest} request - 请求对象
 * @returns {NextResponse} 响应对象
 */
export async function GET(request: NextRequest) {
    try {
        // TODO: 从身份验证中获取实际用户ID
        const userId = 'user_123'; // 临时用户ID，后续改为从认证系统获取
        
        // 获取用户会话列表
        const sessions = await sessionService.getUserSessions(userId);
        
        // 返回会话列表
        return NextResponse.json({ 
            success: true, 
            data: sessions 
        });
    } catch (error) {
        console.error('获取会话列表错误:', error);
        return NextResponse.json(
            { success: false, error: '请求处理失败' }, 
            { status: 500 }
        );
    }
}

/**
 * 创建新会话
 * 
 * @param {NextRequest} request - 请求对象
 * @returns {NextResponse} 响应对象
 */
export async function POST(request: NextRequest) {
    try {
        // 解析请求体
        const body = await request.json();
        const { name, strategy } = body;
        
        // 验证输入
        if (!name) {
            return NextResponse.json(
                { success: false, error: '会话名称不能为空' },
                { status: 400 }
            );
        }
        
        // TODO: 从身份验证中获取实际用户ID
        const userId = 'user_123'; // 临时用户ID，后续改为从认证系统获取
        
        // 创建新会话
        const session = await sessionService.createSession(name, userId, strategy);
        
        // 返回创建的会话
        return NextResponse.json({ 
            success: true, 
            data: session 
        }, { status: 201 });
    } catch (error) {
        console.error('创建会话错误:', error);
        return NextResponse.json(
            { success: false, error: '会话创建失败' }, 
            { status: 500 }
        );
    }
} 