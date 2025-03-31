/**
 * 单个任务API路由
 * 
 * 负责获取、更新和删除特定任务
 */
import { NextRequest, NextResponse } from 'next/server';
import { taskService } from '@/lib/task-service';
import { IUpdateTaskRequest } from '@/types/task';

interface IParams {
  id: string;
}

/**
 * 获取单个任务详情
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
    const taskId = params.id;
    
    // 获取任务详情
    const task = await taskService.getTask(taskId);
    
    // 如果任务不存在
    if (!task) {
      return NextResponse.json(
        { success: false, error: '任务不存在' },
        { status: 404 }
      );
    }
    
    // 返回任务详情
    return NextResponse.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('获取任务详情错误:', error);
    return NextResponse.json(
      { success: false, error: '请求处理失败' },
      { status: 500 }
    );
  }
}

/**
 * 更新任务
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
    
    // 处理更新字段
    const updates: IUpdateTaskRequest = {};
    
    if (body.name !== undefined) updates.name = body.name;
    if (body.description !== undefined) updates.description = body.description;
    if (body.status !== undefined) updates.status = body.status;
    if (body.priority !== undefined) updates.priority = body.priority;
    if (body.inputs !== undefined) updates.inputs = body.inputs;
    if (body.outputs !== undefined) updates.outputs = body.outputs;
    if (body.assignedAgentId !== undefined) updates.assignedAgentId = body.assignedAgentId;
    if (body.deadline !== undefined) updates.deadline = body.deadline ? new Date(body.deadline) : undefined;
    if (body.startTime !== undefined) updates.startTime = body.startTime ? new Date(body.startTime) : undefined;
    if (body.endTime !== undefined) updates.endTime = body.endTime ? new Date(body.endTime) : undefined;
    if (body.dependencies !== undefined) updates.dependencies = body.dependencies;
    
    // 更新任务
    const updatedTask = await taskService.updateTask(taskId, updates);
    
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
    console.error('更新任务错误:', error);
    return NextResponse.json(
      { success: false, error: '任务更新失败' },
      { status: 500 }
    );
  }
}

/**
 * 删除任务
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
    const taskId = params.id;
    
    // 删除任务
    const success = await taskService.deleteTask(taskId);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: '任务不存在或删除失败' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: '任务已成功删除'
    });
  } catch (error) {
    console.error('删除任务错误:', error);
    return NextResponse.json(
      { success: false, error: '任务删除失败' },
      { status: 500 }
    );
  }
} 