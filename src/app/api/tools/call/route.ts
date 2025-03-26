/**
 * 工具调用API路由
 * 
 * 负责工具的调用
 */
import { NextRequest } from 'next/server';
import { toolService } from '@/lib/tool-service';
import { withErrorHandling, validateRequestBody, createSuccessResponse } from '@/lib/api-middleware';
import { ToolPermissionError } from '@/lib/errors';

/**
 * 调用工具
 * 
 * @param {NextRequest} request - 请求对象
 * @returns 响应对象
 */
export const POST = withErrorHandling(async (request: NextRequest) => {
    // 解析请求体
    const body = await request.json();
    
    // 验证请求体
    validateRequestBody(body, ['toolId', 'sessionId', 'agentId']);
    
    const { toolId, params, sessionId, agentId } = body;
    
    // 这里可以检查权限
    // TODO: 实现实际的权限检查
    const hasPermission = true;
    if (!hasPermission) {
        throw new ToolPermissionError('无权调用此工具');
    }
    
    // 调用工具
    const result = await toolService.callTool(
        toolId,
        params || {},
        sessionId,
        agentId
    );
    
    // 返回调用结果
    return createSuccessResponse(result);
}); 