/**
 * 工具库API路由
 * 
 * 负责工具的获取和注册
 */
import { NextRequest, NextResponse } from 'next/server';
import { toolService } from '@/lib/tool-service';
import { TToolCategory } from '@/types/tool';

/**
 * 获取工具列表
 * 
 * @param {NextRequest} request - 请求对象
 * @returns {NextResponse} 响应对象
 */
export async function GET(request: NextRequest) {
    try {
        // 获取查询参数
        const searchParams = request.nextUrl.searchParams;
        const category = searchParams.get('category') as TToolCategory | null;
        
        // 获取工具列表
        let tools;
        if (category) {
            tools = toolService.getToolsByCategory(category);
        } else {
            tools = toolService.getAllTools();
        }
        
        // 返回工具列表
        return NextResponse.json({
            success: true,
            data: tools
        });
    } catch (error) {
        console.error('获取工具列表错误:', error);
        return NextResponse.json(
            { success: false, error: '请求处理失败' },
            { status: 500 }
        );
    }
}

/**
 * 注册新工具
 * 
 * @param {NextRequest} request - 请求对象
 * @returns {NextResponse} 响应对象
 */
export async function POST(request: NextRequest) {
    try {
        // 解析请求体
        const body = await request.json();
        const { tool, handlerCode } = body;
        
        // 验证必要字段
        if (!tool || !tool.id || !tool.name || !tool.category) {
            return NextResponse.json(
                { success: false, error: '工具配置缺少必要字段' },
                { status: 400 }
            );
        }
        
        // TODO: 实现自定义工具处理函数的安全创建
        // 当前版本不支持通过API注册自定义处理函数
        
        // 返回结果
        return NextResponse.json({
            success: false,
            error: '通过API注册自定义工具功能尚未实现'
        }, { status: 501 });
        
    } catch (error) {
        console.error('注册工具错误:', error);
        return NextResponse.json(
            { success: false, error: '工具注册失败' },
            { status: 500 }
        );
    }
} 