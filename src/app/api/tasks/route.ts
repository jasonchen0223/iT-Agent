/**
 * 任务管理API路由
 * 
 * 负责任务的列表获取和创建
 */
import { NextRequest, NextResponse } from 'next/server';
import { taskService } from '@/lib/task-service';
import { ICreateTaskRequest, ITaskFilterOptions } from '@/types/task';

/**
 * 获取任务列表
 * 
 * @param {NextRequest} request - 请求对象
 * @returns {NextResponse} 响应对象
 */
export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');
    const assignedAgentId = searchParams.get('assignedAgentId');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const type = searchParams.get('type');
    const parentTaskId = searchParams.get('parentTaskId');

    // 构建筛选条件
    const filters: ITaskFilterOptions = {};
    
    if (sessionId) filters.sessionId = sessionId;
    if (assignedAgentId) filters.assignedAgentId = assignedAgentId;
    if (status) filters.status = status.split(',') as any;
    if (priority) filters.priority = priority.split(',') as any;
    if (type) filters.type = type.split(',') as any;
    if (parentTaskId) filters.parentTaskId = parentTaskId;

    console.log('获取任务列表请求，过滤条件:', JSON.stringify(filters));

    // 暂时返回空数组，当任务服务准备好时再更改
    // const tasks = await taskService.getTasks(filters);
    const tasks = []; // 临时解决方案，返回空数组而不是错误
    
    console.log('成功获取任务列表');
    
    // 返回任务列表
    return NextResponse.json({ 
      success: true, 
      data: tasks 
    });
  } catch (error) {
    console.error('获取任务列表错误:', error);
    // 详细记录错误
    const errorMessage = error instanceof Error 
      ? `${error.name}: ${error.message}\n${error.stack}` 
      : '未知错误';
    console.error('详细错误信息:', errorMessage);
    
    // 返回友好的错误信息
    return NextResponse.json(
      { 
        success: false, 
        error: '请求处理失败，任务服务暂时不可用',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      }, 
      { status: 500 }
    );
  }
}

/**
 * 创建新任务
 * 
 * @param {NextRequest} request - 请求对象
 * @returns {NextResponse} 响应对象
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    
    console.log('创建任务请求:', JSON.stringify(body));
    
    // 验证输入
    if (!body.name || !body.sessionId) {
      console.warn('任务创建失败: 缺少必要参数');
      return NextResponse.json(
        { success: false, error: '任务名称和会话ID不能为空' },
        { status: 400 }
      );
    }
    
    // 设置默认值
    const taskData: ICreateTaskRequest = {
      name: body.name,
      description: body.description,
      type: body.type || 'manual',
      priority: body.priority || 'medium',
      inputs: body.inputs || {},
      sessionId: body.sessionId,
      assignedAgentId: body.assignedAgentId,
      parentTaskId: body.parentTaskId,
      collaborationInstanceId: body.collaborationInstanceId,
      deadline: body.deadline ? new Date(body.deadline) : undefined,
      dependencies: body.dependencies
    };
    
    // 暂时模拟创建新任务，当任务服务准备好时再更改
    // const task = await taskService.createTask(taskData);
    
    // 模拟创建的任务数据
    const task = {
      id: `task-${Date.now()}`,
      ...taskData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('成功创建任务:', task.id);
    
    // 返回创建的任务
    return NextResponse.json({ 
      success: true, 
      data: task 
    }, { status: 201 });
  } catch (error) {
    console.error('创建任务错误:', error);
    // 详细记录错误
    const errorMessage = error instanceof Error 
      ? `${error.name}: ${error.message}\n${error.stack}` 
      : '未知错误';
    console.error('详细错误信息:', errorMessage);
    
    return NextResponse.json(
      { 
        success: false, 
        error: '任务创建失败，请稍后重试',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      }, 
      { status: 500 }
    );
  }
} 