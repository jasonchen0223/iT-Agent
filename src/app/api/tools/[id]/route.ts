/**
 * 工具详情API路由
 * 
 * 根据ID获取单个工具的详细信息
 */
import { NextRequest, NextResponse } from 'next/server';
import { mockTools } from '@/lib/mock-data';

/**
 * 获取单个工具详情
 * 
 * @param {NextRequest} request - 请求对象
 * @param {{ params: { id: string } }} context - 路由上下文
 * @returns {NextResponse} 响应对象
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: '缺少工具ID' },
        { status: 400 }
      );
    }

    // 查找匹配的工具
    const tool = mockTools.find(tool => tool.id === id);

    if (!tool) {
      return NextResponse.json(
        { success: false, error: '找不到指定工具' },
        { status: 404 }
      );
    }

    // 返回工具详情
    return NextResponse.json({ success: true, data: tool });
  } catch (error) {
    console.error('获取工具详情失败:', error);
    return NextResponse.json(
      { success: false, error: '获取工具详情失败' },
      { status: 500 }
    );
  }
}

/**
 * 更新工具信息
 * 
 * @param {NextRequest} request - 请求对象
 * @param {{ params: { id: string } }} context - 路由上下文
 * @returns {NextResponse} 响应对象
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 获取当前用户
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: '未授权' },
        { status: 401 }
      );
    }
    
    // 检查管理员权限
    if (!currentUser.isAdmin) {
      return NextResponse.json(
        { success: false, error: '没有更新工具的权限' },
        { status: 403 }
      );
    }
    
    // 获取工具ID
    const { id } = params;
    
    // 检查工具是否存在
    const existingTool = await db.tool.findUnique({
      where: { id }
    });
    
    if (!existingTool) {
      return NextResponse.json(
        { success: false, error: '工具不存在' },
        { status: 404 }
      );
    }
    
    // 解析请求体
    const body = await request.json();
    
    // 更新工具
    const updatedTool = await db.tool.update({
      where: { id },
      data: {
        name: body.name || existingTool.name,
        description: body.description || existingTool.description,
        type: body.type || existingTool.type,
        status: body.status || existingTool.status,
        icon: body.icon ?? existingTool.icon,
        version: body.version || existingTool.version,
        source: body.source || existingTool.source,
        permissions: body.permissions || existingTool.permissions,
        metadata: body.metadata || existingTool.metadata,
        updatedAt: new Date()
      }
    });
    
    return NextResponse.json({
      success: true,
      data: updatedTool
    });
  } catch (error) {
    return handleApiError(error, '更新工具失败');
  }
}

/**
 * 删除工具
 * 
 * @param {NextRequest} request - 请求对象
 * @param {{ params: { id: string } }} context - 路由上下文
 * @returns {NextResponse} 响应对象
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 获取当前用户
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: '未授权' },
        { status: 401 }
      );
    }
    
    // 检查管理员权限
    if (!currentUser.isAdmin) {
      return NextResponse.json(
        { success: false, error: '没有删除工具的权限' },
        { status: 403 }
      );
    }
    
    // 获取工具ID
    const { id } = params;
    
    // 检查工具是否存在
    const existingTool = await db.tool.findUnique({
      where: { id }
    });
    
    if (!existingTool) {
      return NextResponse.json(
        { success: false, error: '工具不存在' },
        { status: 404 }
      );
    }
    
    // 删除工具
    await db.tool.delete({
      where: { id }
    });
    
    return NextResponse.json({
      success: true,
      data: true
    });
  } catch (error) {
    return handleApiError(error, '删除工具失败');
  }
} 