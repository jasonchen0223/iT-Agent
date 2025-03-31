/**
 * 消息处理与路由模块导出
 */
import messageRouter, { 
    MessageRouter,
    IMessageRouteRule,
    TMessagePriority
} from './message-router';

export {
    messageRouter,
    MessageRouter
};

// 导出接口和类型
export type { IMessageRouteRule, TMessagePriority };

export default messageRouter; 