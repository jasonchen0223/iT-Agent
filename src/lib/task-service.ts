/**
 * 任务服务模块
 * 
 * 提供任务管理与持久化功能
 */
import { prisma } from './db';
import { 
  ITask, 
  ICreateTaskRequest, 
  IUpdateTaskRequest, 
  ITaskFilterOptions,
  TTaskStatus 
} from '@/types/task';

/**
 * 任务服务类
 */
class TaskService {
  /**
   * 创建新任务
   * 
   * @param {ICreateTaskRequest} taskData - 任务数据
   * @returns {Promise<ITask>} 创建的任务
   */
  async createTask(taskData: ICreateTaskRequest): Promise<ITask> {
    // 解析依赖关系
    const dependencies = taskData.dependencies ? JSON.stringify(taskData.dependencies) : null;
    
    // 创建任务记录
    const task = await prisma.agentTask.create({
      data: {
        name: taskData.name,
        description: taskData.description,
        type: taskData.type,
        status: 'pending',
        priority: taskData.priority,
        inputs: JSON.stringify(taskData.inputs),
        assignedAgentId: taskData.assignedAgentId,
        sessionId: taskData.sessionId,
        parentTaskId: taskData.parentTaskId,
        collaborationInstanceId: taskData.collaborationInstanceId,
        deadline: taskData.deadline,
        dependencies,
      }
    });

    return this.convertTaskModel(task);
  }

  /**
   * 获取任务详情
   * 
   * @param {string} taskId - 任务ID
   * @returns {Promise<ITask | null>} 任务对象
   */
  async getTask(taskId: string): Promise<ITask | null> {
    const task = await prisma.agentTask.findUnique({
      where: { id: taskId },
      include: {
        subTasks: true
      }
    });

    if (!task) {
      return null;
    }

    return this.convertTaskModel(task);
  }

  /**
   * 更新任务
   * 
   * @param {string} taskId - 任务ID
   * @param {IUpdateTaskRequest} updates - 更新数据
   * @returns {Promise<ITask | null>} 更新后的任务
   */
  async updateTask(taskId: string, updates: IUpdateTaskRequest): Promise<ITask | null> {
    // 首先检查任务是否存在
    const existingTask = await prisma.agentTask.findUnique({
      where: { id: taskId }
    });

    if (!existingTask) {
      return null;
    }

    // 准备更新数据
    const updateData: any = {};
    
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.priority !== undefined) updateData.priority = updates.priority;
    if (updates.inputs !== undefined) updateData.inputs = JSON.stringify(updates.inputs);
    if (updates.outputs !== undefined) updateData.outputs = JSON.stringify(updates.outputs);
    if (updates.assignedAgentId !== undefined) updateData.assignedAgentId = updates.assignedAgentId;
    if (updates.startTime !== undefined) updateData.startTime = updates.startTime;
    if (updates.endTime !== undefined) updateData.endTime = updates.endTime;
    if (updates.deadline !== undefined) updateData.deadline = updates.deadline;
    if (updates.dependencies !== undefined) updateData.dependencies = JSON.stringify(updates.dependencies);

    // 执行更新
    const updatedTask = await prisma.agentTask.update({
      where: { id: taskId },
      data: updateData,
      include: {
        subTasks: true
      }
    });

    return this.convertTaskModel(updatedTask);
  }

  /**
   * 删除任务
   * 
   * @param {string} taskId - 任务ID
   * @returns {Promise<boolean>} 是否成功删除
   */
  async deleteTask(taskId: string): Promise<boolean> {
    try {
      await prisma.agentTask.delete({
        where: { id: taskId }
      });
      return true;
    } catch (error) {
      console.error('删除任务错误:', error);
      return false;
    }
  }

  /**
   * 获取任务列表
   * 
   * @param {ITaskFilterOptions} filters - 筛选条件
   * @returns {Promise<ITask[]>} 任务列表
   */
  async getTasks(filters: ITaskFilterOptions = {}): Promise<ITask[]> {
    // 构建查询条件
    const where: any = {};
    
    if (filters.sessionId) where.sessionId = filters.sessionId;
    if (filters.assignedAgentId) where.assignedAgentId = filters.assignedAgentId;
    if (filters.parentTaskId) where.parentTaskId = filters.parentTaskId;
    
    // 处理状态筛选
    if (filters.status) {
      if (Array.isArray(filters.status)) {
        where.status = { in: filters.status };
      } else {
        where.status = filters.status;
      }
    }
    
    // 处理优先级筛选
    if (filters.priority) {
      if (Array.isArray(filters.priority)) {
        where.priority = { in: filters.priority };
      } else {
        where.priority = filters.priority;
      }
    }
    
    // 处理类型筛选
    if (filters.type) {
      if (Array.isArray(filters.type)) {
        where.type = { in: filters.type };
      } else {
        where.type = filters.type;
      }
    }

    // 执行查询
    const tasks = await prisma.agentTask.findMany({
      where,
      include: {
        subTasks: true
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return tasks.map(task => this.convertTaskModel(task));
  }

  /**
   * 获取会话的任务列表
   * 
   * @param {string} sessionId - 会话ID
   * @returns {Promise<ITask[]>} 任务列表
   */
  async getSessionTasks(sessionId: string): Promise<ITask[]> {
    return this.getTasks({ sessionId });
  }

  /**
   * 获取代理的任务列表
   * 
   * @param {string} agentId - 代理ID
   * @returns {Promise<ITask[]>} 任务列表
   */
  async getAgentTasks(agentId: string): Promise<ITask[]> {
    return this.getTasks({ assignedAgentId: agentId });
  }

  /**
   * 更改任务状态
   * 
   * @param {string} taskId - 任务ID
   * @param {TTaskStatus} status - 新状态
   * @returns {Promise<ITask | null>} 更新后的任务
   */
  async updateTaskStatus(taskId: string, status: TTaskStatus): Promise<ITask | null> {
    const updateData: any = { status };
    
    // 如果是开始运行，设置开始时间
    if (status === 'running') {
      updateData.startTime = new Date();
    }
    
    // 如果是结束状态，设置结束时间
    if (['completed', 'failed', 'cancelled'].includes(status)) {
      updateData.endTime = new Date();
    }
    
    return this.updateTask(taskId, updateData);
  }

  /**
   * 分配任务给代理
   * 
   * @param {string} taskId - 任务ID
   * @param {string} agentId - 代理ID
   * @returns {Promise<ITask | null>} 更新后的任务
   */
  async assignTaskToAgent(taskId: string, agentId: string): Promise<ITask | null> {
    return this.updateTask(taskId, { 
      assignedAgentId: agentId,
      status: 'assigned'
    });
  }

  /**
   * 添加任务输出结果
   * 
   * @param {string} taskId - 任务ID
   * @param {Record<string, any>} outputs - 输出结果
   * @returns {Promise<ITask | null>} 更新后的任务
   */
  async addTaskOutput(taskId: string, outputs: Record<string, any>): Promise<ITask | null> {
    const task = await this.getTask(taskId);
    if (!task) return null;
    
    // 合并现有输出和新输出
    const existingOutputs = task.outputs || {};
    const mergedOutputs = { ...existingOutputs, ...outputs };
    
    return this.updateTask(taskId, { outputs: mergedOutputs });
  }

  /**
   * 将数据库任务模型转换为应用层任务对象
   * 
   * @param {any} taskModel - 数据库任务模型
   * @returns {ITask} 应用层任务对象
   */
  private convertTaskModel(taskModel: any): ITask {
    const dependencies = taskModel.dependencies 
      ? JSON.parse(taskModel.dependencies) 
      : undefined;
    
    const inputs = JSON.parse(taskModel.inputs);
    const outputs = taskModel.outputs ? JSON.parse(taskModel.outputs) : undefined;
    
    // 处理子任务
    const subTasks = taskModel.subTasks 
      ? taskModel.subTasks.map((subTask: any) => this.convertTaskModel(subTask))
      : undefined;
    
    return {
      id: taskModel.id,
      name: taskModel.name,
      description: taskModel.description,
      type: taskModel.type,
      status: taskModel.status,
      priority: taskModel.priority,
      inputs,
      outputs,
      assignedAgentId: taskModel.assignedAgentId,
      sessionId: taskModel.sessionId,
      parentTaskId: taskModel.parentTaskId,
      collaborationInstanceId: taskModel.collaborationInstanceId,
      createdAt: taskModel.createdAt,
      updatedAt: taskModel.updatedAt,
      startTime: taskModel.startTime,
      endTime: taskModel.endTime,
      deadline: taskModel.deadline,
      dependencies,
      subTasks
    };
  }
}

// 导出任务服务实例
export const taskService = new TaskService(); 