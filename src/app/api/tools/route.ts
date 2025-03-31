/**
 * 工具库API路由
 * 
 * 负责工具的获取和注册
 */
import { NextRequest, NextResponse } from 'next/server';
import { mockTools } from '@/lib/mock-data';

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
    const search = searchParams.get('search')?.toLowerCase() || '';
    const category = searchParams.get('category')?.toLowerCase() || '';
    const status = searchParams.get('status')?.toLowerCase() || '';
    const limit = Number(searchParams.get('limit') || '50');
    
    // 筛选工具
    let tools = [...mockTools];
    
    if (search) {
      tools = tools.filter(tool => 
        tool.name.toLowerCase().includes(search) || 
        tool.description.toLowerCase().includes(search)
      );
    }
    
    if (category) {
      tools = tools.filter(tool => 
        tool.category?.toLowerCase() === category
      );
    }
    
    if (status) {
      tools = tools.filter(tool => 
        tool.status?.toLowerCase() === status
      );
    }
    
    // 限制结果数量
    if (limit && limit > 0) {
      tools = tools.slice(0, limit);
    }
    
    return NextResponse.json({
      success: true,
      data: tools,
      total: tools.length
    });
  } catch (error) {
    console.error('获取工具列表失败:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '未知错误' 
      },
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
    
    // 基本验证
    if (!body.name || !body.description || !body.type) {
      return NextResponse.json(
        { success: false, error: '缺少必要字段', requiredFields: ['name', 'description', 'type'] },
        { status: 400 }
      );
    }
    
    // 检查工具名称是否存在
    const existingTool = mockTools.find(tool => tool.name === body.name);
    
    if (existingTool) {
      return NextResponse.json(
        { success: false, error: '工具名称已存在', name: body.name },
        { status: 409 }
      );
    }
    
    // 模拟创建新工具
    const newTool = {
      id: `tool-${Date.now()}`,
      name: body.name,
      description: body.description,
      type: body.type,
      status: 'available',
      icon: body.icon,
      version: body.version || '1.0.0',
      source: body.source || 'internal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // 实际应用中，应将新工具保存到数据库
    // 这里只是返回模拟数据
    
    return NextResponse.json({
      success: true,
      data: newTool
    }, { status: 201 });
  } catch (error) {
    console.error('注册工具失败:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '未知错误' 
      },
      { status: 500 }
    );
  }
} 