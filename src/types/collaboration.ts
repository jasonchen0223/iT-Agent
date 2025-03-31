/**
 * 代理节点接口
 * 
 * 定义协作网络中的代理节点
 */
export interface IAgentNode {
    id: string;
    name: string;
    type: TAgentNodeType;
    status?: TAgentNodeStatus;
    description?: string;
    x?: number;
    y?: number;
    radius?: number;
    color?: string;
    messageCount?: number;
    capabilities?: string[];
}

/**
 * 协作连接接口
 * 
 * 定义代理之间的协作关系
 */
export interface ICollaborationLink {
    id: string;
    source: string; // 源节点ID
    target: string; // 目标节点ID
    type: TCollaborationLinkType;
    label?: string;
    color?: string;
    weight?: number; // 连接权重
    messageCount?: number;
}

/**
 * 协作会话接口
 * 
 * 定义代理协作会话
 */
export interface ICollaborationSession {
    id: string;
    name: string;
    description?: string;
    status: TCollaborationStatus;
    nodes: IAgentNode[];
    links: ICollaborationLink[];
    startTime?: string;
    endTime?: string;
    messageCount?: number;
    taskCount?: number;
}

/**
 * 代理节点类型
 */
export type TAgentNodeType = 
    | 'leader'       // 领导者
    | 'specialist'   // 专家
    | 'coordinator'  // 协调者
    | 'executor'     // 执行者
    | 'observer';    // 观察者

/**
 * 代理节点状态
 */
export type TAgentNodeStatus = 
    | 'active'       // 活跃
    | 'idle'         // 空闲
    | 'busy'         // 忙碌
    | 'error'        // 错误
    | 'terminated';  // 终止

/**
 * 协作连接类型
 */
export type TCollaborationLinkType = 
    | 'command'          // 命令关系
    | 'communication'    // 通信关系
    | 'collaboration'    // 协作关系
    | 'delegation';      // 委派关系

/**
 * 协作状态
 */
export type TCollaborationStatus = 
    | 'active'       // 活跃
    | 'paused'       // 暂停
    | 'completed'    // 完成
    | 'archived'     // 归档
    | 'failed';      // 失败

/**
 * 协作模式
 */
export type TCollaborationMode = 
    | 'sequential'   // 顺序协作
    | 'parallel'     // 并行协作
    | 'hybrid'       // 混合协作
    | 'workflow';    // 工作流协作 