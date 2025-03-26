/**
 * 消息路由规则类型
 * 用于定义消息路由的规则，包括匹配条件和转发目标
 */
export interface MessageRouteRule {
    /** 规则ID */
    id: string;
    /** 规则描述 */
    description: string;
    /** 规则优先级 (high/normal/low) */
    priority: string;
    /** 发送者角色（可选，用于匹配） */
    senderRole?: string;
    /** 接收者角色（可选，用于匹配） */
    receiverRole?: string;
    /** 消息类型（可选，用于匹配） */
    messageType?: string;
    /** 关键词（可选，用于匹配消息内容） */
    keywords: string[];
    /** 转发目标角色（可选） */
    forwardToRole?: string;
    /** 转发目标ID（可选） */
    forwardToId?: string;
    /** 是否拦截原始消息 */
    interceptOriginal: boolean;
    /** 规则是否启用 */
    enabled: boolean;
    /** 创建时间 */
    createdAt: Date;
    /** 更新时间 */
    updatedAt: Date;
}

/**
 * 消息路由结果类型
 * 用于表示消息路由处理的结果
 */
export interface MessageRouteResult {
    /** 是否路由成功 */
    success: boolean;
    /** 原始消息是否被拦截 */
    intercepted: boolean;
    /** 转发的目标（可能有多个） */
    forwardTo?: {
        /** 接收者ID */
        receiverId: string;
        /** 接收者角色 */
        receiverRole?: string;
    }[];
    /** 应用的规则ID列表 */
    appliedRules: string[];
    /** 错误信息（如果有） */
    error?: string;
} 