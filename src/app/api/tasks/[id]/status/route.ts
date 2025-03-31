/**
 * 任务状态更新API路由
 * 
 * 负责单独更新任务状态
 */
import { NextRequest, NextResponse } from 'next/server';
import { taskService } from '@/lib/task-service';
import { TTaskStatus } from '@/types/task';

interface IParams {
  id: string;
}

/**
 * 更新任务状态
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
    const taskId = params.id;
    
    // 解析请求体
    const body = await request.json();
    const { status } = body;
    
    // 验证输入
    if (!status) {
      return NextResponse.json(
        { success: false, error: '状态不能为空' },
        { status: 400 }
      );
    }
    
    // 验证状态值有效性
    const validStatuses: TTaskStatus[] = ['pending', 'assigned', 'running', 'completed', 'failed', 'cancelled'];
    if (!validStatuses.includes(status as TTaskStatus)) {
      return NextResponse.json(
        { success: false, error: '无效的任务状态' },
        { status: 400 }
      );
    }
    
    // 更新任务状态
    const updatedTask = await taskService.updateTaskStatus(taskId, status as TTaskStatus);
    
    if (!updatedTask) {
      return NextResponse.json(
        { success: false, error: '任务不存在或更新失败' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    console.error('更新任务状态错误:', error);
    return NextResponse.json(
      { success: false, error: '任务状态更新失败' },
      { status: 500 }
    );
  }
} 