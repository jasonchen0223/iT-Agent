/**
 * 任务分配API路由
 * 
 * 负责将任务分配给代理
 */
import { NextRequest, NextResponse } from 'next/server';
import { taskService } from '@/lib/task-service';

interface IParams {
  id: string;
}

/**
 * 分配任务给代理
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
    const taskId = params.id;
    
    // 解析请求体
    const body = await request.json();
    const { agentId } = body;
    
    // 验证输入
    if (!agentId) {
      return NextResponse.json(
        { success: false, error: '代理ID不能为空' },
        { status: 400 }
      );
    }
    
    // 分配任务给代理
    const updatedTask = await taskService.assignTaskToAgent(taskId, agentId);
    
    if (!updatedTask) {
      return NextResponse.json(
        { success: false, error: '任务不存在或分配失败' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    console.error('分配任务错误:', error);
    return NextResponse.json(
      { success: false, error: '任务分配失败' },
      { status: 500 }
    );
  }
} 