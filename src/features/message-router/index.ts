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
    MessageRouter,
    IMessageRouteRule,
    TMessagePriority
};

export default messageRouter; 