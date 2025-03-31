/**
 * 会话任务API路由
 * 
 * 负责获取特定会话的所有任务
 */
import { NextRequest, NextResponse } from 'next/server';
import { taskService } from '@/lib/task-service';
import { sessionService } from '@/lib/session-service';

interface IParams {
  id: string;
}

/**
 * 获取会话任务列表
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
    
    // 检查会话是否存在
    const session = await sessionService.getSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { success: false, error: '会话不存在' },
        { status: 404 }
      );
    }
    
    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const type = searchParams.get('type');
    const parentTaskId = searchParams.get('parentTaskId');
    
    // 构建筛选条件，默认包含会话ID
    const filters = {
      sessionId,
      status: status ? status.split(',') as any : undefined,
      priority: priority ? priority.split(',') as any : undefined,
      type: type ? type.split(',') as any : undefined,
      parentTaskId: parentTaskId || undefined
    };
    
    // 获取任务列表
    const tasks = await taskService.getTasks(filters);
    
    // 返回任务列表
    return NextResponse.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('获取会话任务列表错误:', error);
    return NextResponse.json(
      { success: false, error: '请求处理失败' },
      { status: 500 }
    );
  }
}

/**
 * 为会话创建新任务
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
    
    // 检查会话是否存在
    const session = await sessionService.getSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { success: false, error: '会话不存在' },
        { status: 404 }
      );
    }
    
    // 解析请求体
    const body = await request.json();
    
    // 验证输入
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: '任务名称不能为空' },
        { status: 400 }
      );
    }
    
    // 创建新任务，自动绑定到当前会话
    const taskData = {
      name: body.name,
      description: body.description,
      type: body.type || 'manual',
      priority: body.priority || 'medium',
      inputs: body.inputs || {},
      sessionId, // 使用URL中的会话ID
      assignedAgentId: body.assignedAgentId,
      parentTaskId: body.parentTaskId,
      collaborationInstanceId: body.collaborationInstanceId,
      deadline: body.deadline ? new Date(body.deadline) : undefined,
      dependencies: body.dependencies
    };
    
    // 创建新任务
    const task = await taskService.createTask(taskData);
    
    // 返回创建的任务
    return NextResponse.json({
      success: true,
      data: task
    }, { status: 201 });
  } catch (error) {
    console.error('创建会话任务错误:', error);
    return NextResponse.json(
      { success: false, error: '任务创建失败' },
      { status: 500 }
    );
  }
} 