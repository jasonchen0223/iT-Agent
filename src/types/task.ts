/**
 * 任务类型定义
 */

/**
 * 任务状态类型
 */
export type TTaskStatus = 'pending' | 'assigned' | 'running' | 'completed' | 'failed' | 'cancelled';

/**
 * 任务优先级类型
 */
export type TTaskPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * 任务类型
 */
export type TTaskType = 'manual' | 'auto' | 'development' | 'design' | 'testing' | 'planning' | 'research' | 'review' | 'other';

/**
 * 任务依赖类型
 */
export interface ITaskDependency {
  taskId: string;
  condition?: 'completed' | 'failed' | 'any'; // 依赖条件，默认为completed
}

/**
 * 子任务接口
 */
export interface ISubTask {
  id: string;
  name: string;
  status: TTaskStatus;
  parentTaskId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 任务接口
 */
export interface ITask {
  id: string;
  name: string;
  description?: string;
  status: TTaskStatus;
  priority: TTaskPriority;
  type: TTaskType;
  assignedTo?: string;
  createdBy?: string;
  sessionId?: string;
  parentTaskId?: string;
  subTasks?: ITask[];
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  completedAt?: Date;
  tags?: string[];
  metadata?: Record<string, any>;
}

/**
 * 任务创建请求
 */
export interface ITaskCreateRequest {
  name: string;
  description?: string;
  status?: TTaskStatus;
  priority: TTaskPriority;
  type: TTaskType;
  assignedTo?: string;
  sessionId?: string;
  parentTaskId?: string;
  dueDate?: Date;
  tags?: string[];
  metadata?: Record<string, any>;
}

/**
 * 任务更新请求
 */
export interface ITaskUpdateRequest {
  name?: string;
  description?: string;
  status?: TTaskStatus;
  priority?: TTaskPriority;
  type?: TTaskType;
  assignedTo?: string;
  sessionId?: string;
  parentTaskId?: string;
  dueDate?: Date;
  completedAt?: Date;
  tags?: string[];
  metadata?: Record<string, any>;
}

/**
 * 任务分配请求
 */
export interface ITaskAssignRequest {
  assignedTo: string;
}

/**
 * 任务状态更新请求
 */
export interface ITaskStatusUpdateRequest {
  status: TTaskStatus;
}

/**
 * 任务筛选选项
 */
export interface ITaskFilterOptions {
  sessionId?: string;
  assignedAgentId?: string;
  status?: TTaskStatus | TTaskStatus[];
  priority?: TTaskPriority | TTaskPriority[];
  type?: TTaskType | TTaskType[];
  parentTaskId?: string;
}

/**
 * 任务过滤条件接口
 */
export interface ITaskFilters {
  status?: TTaskStatus[];
  priority?: TTaskPriority[];
  type?: TTaskType[];
  userId?: string;
  agentId?: string;
  sessionId?: string;
  parentTaskId?: string;
  search?: string;
  fromDate?: Date;
  toDate?: Date;
}

/**
 * 任务统计接口
 */
export interface ITaskStats {
  total: number;
  byStatus: Record<TTaskStatus, number>;
  byPriority: Record<TTaskPriority, number>;
  byType: Record<TTaskType, number>;
}

/**
 * 任务排序选项
 */
export type TTaskSortField = 'createdAt' | 'updatedAt' | 'dueDate' | 'priority' | 'status' | 'name';
export type TTaskSortOrder = 'asc' | 'desc';

/**
 * 任务排序接口
 */
export interface ITaskSort {
  field: TTaskSortField;
  order: TTaskSortOrder;
} 